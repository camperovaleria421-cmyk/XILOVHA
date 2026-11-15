/* =====================================================================
   CUENTAS, AVANCE Y RANKING (Supabase)
   ---------------------------------------------------------------------
   Cada jugador entra con correo y contraseña. Su avance (puntos, tiempo,
   fichas vistas, videos, juegos y su modelo vestido) se guarda en
   internet, así que lo encuentra igual en cualquier dispositivo.
   Sin internet, o con "Seguir sin cuenta", todo se guarda solo en
   este navegador.

   La clave de abajo es la PÚBLICA ("publishable"): está hecha para ir
   en la página. Lo que protege los datos son las reglas de sql/xilovha.sql.
   Nunca pongas aquí la clave secreta ("secret" o "service_role").
   ===================================================================== */

const SUPABASE_URL = "https://ljmavqsijlcqcqihuqxi.supabase.co";
const SUPABASE_KEY = "sb_publishable_HzaqS1Ud2wGLdHwoPyGyhA_mwCFWqzc";
const CLAVE_LOCAL = "xilovha-progreso";
const CLAVE_INVITADO = "xilovha-invitado";

/* ---------- El avance de quien está usando la app ---------- */
function progresoVacio() {
  return { puntos: 0, segundos: 0, fichas: [], videos: [], juegos: {},
           vestidor: { modelo: "mujer", puesto: { mujer: {}, hombre: {} } } };
}
function normalizar(p) {
  p = p || {};
  const v = p.vestidor || {};
  return {
    puntos: Math.max(0, parseInt(p.puntos, 10) || 0),
    segundos: Math.max(0, parseInt(p.segundos, 10) || 0),
    fichas: Array.isArray(p.fichas) ? p.fichas : [],
    videos: Array.isArray(p.videos) ? p.videos : [],
    juegos: p.juegos && typeof p.juegos === "object" ? p.juegos : {},
    vestidor: {
      modelo: v.modelo === "hombre" ? "hombre" : "mujer",
      puesto: { mujer: (v.puesto && v.puesto.mujer) || {}, hombre: (v.puesto && v.puesto.hombre) || {} }
    }
  };
}
function leerLocal() { try { return JSON.parse(localStorage.getItem(CLAVE_LOCAL)); } catch (e) { return null; } }
function guardarLocal() { try { localStorage.setItem(CLAVE_LOCAL, JSON.stringify(P)); } catch (e) {} }

let P = normalizar(leerLocal());
// Puntos de la versión anterior de la app (antes de las cuentas)
try {
  const viejos = parseInt(localStorage.getItem("xilovha-puntos"), 10);
  if (viejos && !leerLocal()) { P.puntos = viejos; guardarLocal(); }
} catch (e) {}

const Cuenta = { db: null, usuario: null, perfil: null, invitado: false };
try { Cuenta.invitado = localStorage.getItem(CLAVE_INVITADO) === "1"; } catch (e) {}

/* ---------- Guardar cambios (en el navegador y en internet) ---------- */
let temporizadorGuardar = null;
function cambioProgreso(inmediato) {
  guardarLocal();
  if (!Cuenta.perfil) return;
  clearTimeout(temporizadorGuardar);
  temporizadorGuardar = setTimeout(subirProgreso, inmediato ? 0 : 1500);
}
async function subirProgreso() {
  if (!Cuenta.db || !Cuenta.perfil) return;
  const { fichas, videos, juegos, vestidor } = P;
  try {
    await Cuenta.db.from("xilovha_perfiles")
      .update({ puntos: Math.min(P.puntos, 100000), segundos: P.segundos, progreso: { fichas, videos, juegos, vestidor } })
      .eq("user_id", Cuenta.usuario.id);
  } catch (e) { /* sin internet: se reintenta en el siguiente cambio */ }
}

/* ---------- Lo que se registra de cada jugador ---------- */
function registrarFicha(menu, nombre) {
  const k = `${menu} · ${nombre}`;
  if (!P.fichas.includes(k)) { P.fichas.push(k); cambioProgreso(); }
}
function registrarVideo(menu, nombre) {
  const k = `${menu} · ${nombre}`;
  if (!P.videos.includes(k)) { P.videos.push(k); cambioProgreso(); }
}
function registrarJuego(tipo, aciertos, total) {
  const j = P.juegos[tipo] || { veces: 0, aciertos: 0, preguntas: 0, mejor: 0 };
  j.veces++;
  j.aciertos += aciertos;
  j.preguntas += total;
  j.mejor = Math.max(j.mejor, Math.round(aciertos / total * 100));
  j.ultima = new Date().toISOString();
  P.juegos[tipo] = j;
  cambioProgreso(true);
}

/* Cada respuesta de un juego (solo con cuenta): pregunta, respuesta, si fue correcta y segundos */
function registrarRespuesta(datos) {
  if (!Cuenta.db || !Cuenta.perfil) return;
  Cuenta.db.from("xilovha_respuestas").insert({ user_id: Cuenta.usuario.id, ...datos })
    .then(() => {}, () => {});
}

/* Tiempo de uso: cuenta mientras la app está abierta y a la vista.
   Cada minuto avisa al servidor (así se sabe quién está en línea). */
let latidos = 0;
setInterval(() => {
  if (document.visibilityState !== "visible") return;
  P.segundos += 20;
  guardarLocal();
  latidos++;
  if (Cuenta.perfil && latidos % 3 === 0) subirProgreso();
}, 20000);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && Cuenta.perfil) subirProgreso();
});

/* ---------- Utilidades de texto ---------- */
function formatoTiempo(s) {
  s = s || 0;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  if (h) return `${h} h ${m} min`;
  if (m) return `${m} min`;
  return s ? "menos de 1 min" : "0 min";
}
function hace(fecha) {
  const min = Math.round((Date.now() - new Date(fecha).getTime()) / 60000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} día${d === 1 ? "" : "s"}`;
}
function escaparHTML(t) {
  return String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Conexión y sesión ---------- */
async function iniciarCuenta() {
  alEntrar.cuenta = pintarCuenta;
  alEntrar.ranking = abrirRanking;
  pintarCuenta();
  if (!window.supabase) return;                       // sin internet: modo local
  try {
    Cuenta.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY,
      { auth: { storageKey: "xilovha-sesion", persistSession: true, autoRefreshToken: true } });
    const { data } = await Cuenta.db.auth.getSession();
    if (data.session) {
      Cuenta.usuario = data.session.user;
      await cargarPerfil();
    }
  } catch (e) { console.warn("Sin conexión con el servidor de cuentas", e); }
  pintarCuenta();
}

async function cargarPerfil() {
  const { data, error } = await Cuenta.db.from("xilovha_perfiles")
    .select("nombre,correo,puntos,segundos,progreso").eq("user_id", Cuenta.usuario.id).maybeSingle();
  if (error) throw error;
  Cuenta.perfil = data || null;
  if (data) {
    P = normalizar({ ...data.progreso, puntos: data.puntos, segundos: data.segundos });
    guardarLocal();
    aplicarProgreso();
  }
  return data;
}

async function crearPerfil(nombre) {
  const { fichas, videos, juegos, vestidor } = P;      // lo que hizo como invitado pasa a su cuenta
  const { error } = await Cuenta.db.from("xilovha_perfiles").insert({
    user_id: Cuenta.usuario.id, nombre: nombre.trim(),
    puntos: Math.min(P.puntos, 100000), segundos: P.segundos, progreso: { fichas, videos, juegos, vestidor }
  });
  if (error) {
    if (error.code === "23505" && /nombre/.test(error.message)) return "Ese nombre de jugador ya lo usa alguien más. Elige otro.";
    return "No se pudo crear tu perfil. Intenta de nuevo.";
  }
  await cargarPerfil();
  return "";
}

/* Vuelve a pintar todo lo que depende del avance */
function aplicarProgreso() {
  pintarPuntos();
  if (typeof cargarVestidorGuardado === "function") cargarVestidorGuardado();
  pintarCuenta();
}

/* ---------- Pantalla "Mi cuenta" ---------- */
let modoCuenta = "entrar";   // entrar | crear | nombre

document.querySelectorAll(".pestana-cuenta").forEach(b =>
  b.addEventListener("click", () => cambiarModo(b.dataset.modo)));

function cambiarModo(modo) {
  modoCuenta = modo;
  document.querySelectorAll(".pestana-cuenta").forEach(b => b.classList.toggle("activo", b.dataset.modo === modo));
  const nombre = document.getElementById("campo-nombre");
  const credenciales = document.querySelectorAll(".campo-credencial");
  nombre.hidden = modo === "entrar";
  document.getElementById("cuenta-nombre").required = modo !== "entrar";
  credenciales.forEach(c => { c.hidden = modo === "nombre"; c.querySelector("input").required = modo !== "nombre"; });
  document.getElementById("cuenta-clave").autocomplete = modo === "crear" ? "new-password" : "current-password";
  document.getElementById("pestanas-cuenta").hidden = modo === "nombre";
  document.getElementById("btn-cuenta").textContent =
    modo === "crear" ? "Crear mi cuenta" : modo === "nombre" ? "Guardar mi nombre" : "Entrar";
  document.getElementById("cuenta-titulo").textContent =
    modo === "nombre" ? "Elige tu nombre de jugador" : "Entra para guardar tu avance";
  mensajeCuenta("");
}

function mensajeCuenta(texto, error) {
  const m = document.getElementById("cuenta-msg");
  m.textContent = texto;
  m.classList.toggle("error", !!error);
}

document.getElementById("form-cuenta").addEventListener("submit", async e => {
  e.preventDefault();
  if (!Cuenta.db) { mensajeCuenta("No hay conexión con el servidor. Revisa tu internet y recarga la página.", true); return; }
  const correo = document.getElementById("cuenta-correo").value.trim().toLowerCase();
  const clave = document.getElementById("cuenta-clave").value;
  const nombre = document.getElementById("cuenta-nombre").value.trim();
  const boton = document.getElementById("btn-cuenta");
  if (modoCuenta !== "entrar" && (nombre.length < 2 || nombre.length > 24)) {
    mensajeCuenta("Tu nombre de jugador debe tener entre 2 y 24 letras.", true); return;
  }
  if (modoCuenta !== "nombre" && !/^\S+@\S+\.\S+$/.test(correo)) { mensajeCuenta("Escribe tu correo completo, por ejemplo nombre@gmail.com.", true); return; }
  if (modoCuenta !== "nombre" && clave.length < 6) { mensajeCuenta("La contraseña debe tener al menos 6 caracteres.", true); return; }
  boton.disabled = true;
  mensajeCuenta("Un momento…");
  try {
    if (modoCuenta === "crear") {
      const { data, error } = await Cuenta.db.auth.signUp({ email: correo, password: clave });
      if (error) {
        mensajeCuenta(/registered|already/i.test(error.message) ? "Ese correo ya tiene cuenta. Usa «Ya tengo cuenta»."
          : /password/i.test(error.message) ? "La contraseña debe tener al menos 6 caracteres."
          : /email/i.test(error.message) ? "Revisa que el correo esté bien escrito."
          : "No se pudo crear la cuenta. Intenta de nuevo.", true);
        return;
      }
      if (!data.session) { mensajeCuenta("Tu cuenta se creó, pero falta confirmarla. Avísale a la administradora.", true); return; }
      Cuenta.usuario = data.user;
      const fallo = await crearPerfil(nombre);
      if (fallo) { cambiarModo("nombre"); mensajeCuenta(fallo, true); return; }
    } else if (modoCuenta === "entrar") {
      const { data, error } = await Cuenta.db.auth.signInWithPassword({ email: correo, password: clave });
      if (error) {
        mensajeCuenta(/confirm/i.test(error.message) ? "Tu correo aún no está confirmado. Avísale a la administradora."
          : "Correo o contraseña incorrectos.", true);
        return;
      }
      Cuenta.usuario = data.user;
      const perfil = await cargarPerfil();
      if (!perfil) { cambiarModo("nombre"); mensajeCuenta("Ya entraste. Solo falta tu nombre de jugador."); return; }
    } else {
      const fallo = await crearPerfil(nombre);
      if (fallo) { mensajeCuenta(fallo, true); return; }
    }
    Cuenta.invitado = false;
    try { localStorage.removeItem(CLAVE_INVITADO); } catch (e) {}
    document.getElementById("cuenta-clave").value = "";
    cambiarModo("entrar");
    pintarCuenta();
    irA("hub");
  } catch (err) {
    mensajeCuenta("No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.", true);
  } finally {
    boton.disabled = false;
  }
});

document.getElementById("btn-sin-cuenta").addEventListener("click", () => {
  Cuenta.invitado = true;
  try { localStorage.setItem(CLAVE_INVITADO, "1"); } catch (e) {}
  irA("hub");
});

document.getElementById("btn-salir").addEventListener("click", async () => {
  await subirProgreso();
  try { await Cuenta.db.auth.signOut(); } catch (e) {}
  Cuenta.usuario = null; Cuenta.perfil = null; Cuenta.invitado = false;
  P = progresoVacio();
  guardarLocal();
  try { localStorage.removeItem(CLAVE_INVITADO); } catch (e) {}
  aplicarProgreso();
  irA("inicio");
});

/* "Comenzar" en la portada: pide cuenta la primera vez */
document.getElementById("btn-comenzar").addEventListener("click", () => {
  irA(Cuenta.perfil || Cuenta.invitado ? "hub" : "cuenta");
});

function pintarCuenta() {
  const conPerfil = !!Cuenta.perfil;
  document.getElementById("cuenta-acceso").hidden = conPerfil;
  document.getElementById("cuenta-perfil").hidden = !conPerfil;
  document.getElementById("aviso-sin-conexion").hidden = !!Cuenta.db || conPerfil;
  if (!conPerfil && Cuenta.usuario && modoCuenta !== "nombre") cambiarModo("nombre");

  // Nombre en la barra lateral
  const etiqueta = document.getElementById("lateral-usuario");
  etiqueta.textContent = conPerfil ? Cuenta.perfil.nombre : Cuenta.invitado ? "Sin cuenta" : "Entrar";

  if (!conPerfil) return;
  const juegos = Object.values(P.juegos).reduce((n, j) => n + (j.veces || 0), 0);
  document.getElementById("perfil-nombre").textContent = Cuenta.perfil.nombre;
  document.getElementById("perfil-correo").textContent = Cuenta.perfil.correo || "";
  document.getElementById("perfil-datos").innerHTML = [
    ["⭐", P.puntos, "puntos"],
    ["⏱", formatoTiempo(P.segundos), "de uso"],
    ["📐", P.fichas.length, "fichas vistas"],
    ["🎬", P.videos.length, "videos vistos"],
    ["🎯", juegos, "juegos jugados"]
  ].map(([i, v, t]) => `<div class="dato"><span>${i}</span><b>${v}</b><small>${t}</small></div>`).join("");
}

/* ---------- Ranking ---------- */
let refrescoRanking = null;

async function abrirRanking() {
  await pintarRanking();
  clearInterval(refrescoRanking);
  refrescoRanking = setInterval(() => {
    if (document.getElementById("pantalla-ranking").classList.contains("activa")) pintarRanking();
    else clearInterval(refrescoRanking);
  }, 30000);
}

async function pintarRanking() {
  const cont = document.getElementById("ranking-lista");
  const resumen = document.getElementById("ranking-resumen");
  if (!Cuenta.db) {
    cont.innerHTML = `<p class="ranking-vacio">El ranking necesita internet. Revisa tu conexión y vuelve a abrir esta sección.</p>`;
    resumen.textContent = "";
    return;
  }
  let datos;
  try {
    const { data, error } = await Cuenta.db.from("xilovha_ranking")
      .select("nombre,puntos,segundos,ultima_vez,en_linea,modelo")
      .order("puntos", { ascending: false }).order("segundos", { ascending: true }).limit(500);
    if (error) throw error;
    datos = data;
  } catch (e) {
    cont.innerHTML = `<p class="ranking-vacio">No se pudo cargar el ranking. Intenta de nuevo en un momento.</p>`;
    return;
  }
  const enLinea = datos.filter(d => d.en_linea).length;
  resumen.innerHTML = `<span class="punto-linea"></span>${enLinea} en línea ahora · ${datos.length} jugador${datos.length === 1 ? "" : "es"} en total`;
  if (!datos.length) {
    cont.innerHTML = `<p class="ranking-vacio">Todavía no hay jugadores. ¡Crea tu cuenta y sé el primer lugar!</p>`;
    return;
  }
  const yo = Cuenta.perfil ? Cuenta.perfil.nombre.trim().toLowerCase() : null;
  const medallas = ["🥇", "🥈", "🥉"];
  const fila = (d, i) => {
    const esYo = yo && d.nombre.trim().toLowerCase() === yo;
    return `<li class="fila-ranking ${i < 3 ? "podio podio-" + (i + 1) : ""} ${esYo ? "yo" : ""}">
      <span class="lugar">${i < 3 ? medallas[i] : i + 1}</span>
      <span class="jugador">
        <b>${escaparHTML(d.nombre)}${esYo ? " <em>(tú)</em>" : ""}</b>
        <small>${d.en_linea ? `<span class="punto-linea"></span>En línea` : `Visto ${hace(d.ultima_vez)}`} · ${formatoTiempo(d.segundos)} de uso</small>
      </span>
      <span class="puntaje">${d.puntos} ⭐</span>
    </li>`;
  };
  let html = `<ol class="ranking">${datos.slice(0, 10).map(fila).join("")}</ol>`;
  const miLugar = yo ? datos.findIndex(d => d.nombre.trim().toLowerCase() === yo) : -1;
  if (miLugar >= 10) html += `<p class="tu-lugar">Tu lugar:</p><ol class="ranking" start="${miLugar + 1}">${fila(datos[miLugar], miLugar)}</ol>`;
  cont.innerHTML = html;
}
