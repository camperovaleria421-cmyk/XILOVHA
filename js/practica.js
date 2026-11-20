/* =====================================================================
   PRÁCTICA EN PANTALLA (recreación de la pantalla de Modaris)
   ---------------------------------------------------------------------
   - pantallaModaris(): dibuja la pantalla: menú de arriba (Fichero, Hoja,
     Visualizar…), la hoja de trabajo y el panel de menús F1–F8.
   - preguntaPantalla(): una ronda del juego «Practica en pantalla».
   - Práctica final: falda recta niña T6 (los pasos están en js/falda.js).
   ===================================================================== */

const BARRA_MODARIS = {
  "Fichero": ["Nuevo", "Abrir Modelo", "Insertar Modelo", "Grabar", "Grabar como ...", "Grabar Selección", "Importar", "Exportar", "Salir"],
  "Edición": ["Deshacer", "Rehacer", "Copiar", "Pegar"],
  "Hoja": ["Nueva hoja", "Copiar", "Suprimir", "Elegir Hoja", "Elegir Variante", "Desplazar hoja", "Ajustar todo", "Visualizar todo"],
  "Cost. Especial": [],
  "Visualizar": ["Escalado", "Pts de curva", "Bézier", "Nombre puntos", "Ocultar medidas", "Piquetes", "Cartucho", "Malla", "Escala"],
  "Talla": [], "Selección": [], "Macro": [], "Plano": [], "Parámetros": [], "Config.": [], "Herramienta": []
};
const ATAJOS_BARRA = { "Nuevo": "Ctrl+N", "Abrir Modelo": "Ctrl+O", "Grabar": "Ctrl+E", "Grabar como ...": "Ctrl+T", "Nueva hoja": "N" };
const PANEL_MODARIS = [
  ["F1", "Puntos, Líneas"], ["F2", "Piqu., Orient., Fig. Geom."], ["F3", "Modificación"],
  ["F4", "Industrialización, Pieza"], ["F5", "Cortes, lomo, Pliegues, CAD-CAM"], ["F6", "Escalado"],
  ["F7", "Sis. Evolución, Modif. TEV"], ["F8", "Medidas, Comparar, Variantes"], ["", "FitNet, 3D Prototyping"]
];
function colorMenuF(t) { const m = MENUS.find(x => x.tecla === t); return m ? m.color : "#c9ced6"; }

/* Teclas F1–F8 abren el menú, igual que en Modaris */
let modarisActiva = null;
document.addEventListener("keydown", e => {
  const m = /^F([1-8])$/.exec(e.key);
  if (!m || !modarisActiva || !modarisActiva.el.isConnected || !modarisActiva.el.offsetParent) return;
  if (!document.getElementById("detalle").classList.contains("oculto")) return;
  e.preventDefault();
  modarisActiva.abrirMenuF("F" + m[1]);
});

function pantallaModaris(cont, o) {
  cont.innerHTML = `
    <div class="mod">
      <div class="mod-barra">${Object.keys(BARRA_MODARIS).map(m => `<button class="mod-bm" data-m="${m}">${m}</button>`).join("")}</div>
      <div class="mod-info"><span class="mod-ref">ref :</span><span class="mod-prompt"></span><span class="mod-modelo"></span></div>
      <div class="mod-cuerpo">
        <div class="mod-area"><div class="mod-lienzo"></div><div class="mod-dialogo" hidden></div></div>
        <div class="mod-panel"></div>
      </div>
      <div class="mod-pie"><span>Piquete <i>u</i></span><span>Sin marcaje</span><span>Desplazado</span><span>Nada</span><span>1- Escalado</span>
        <button class="mod-boton3" hidden>Botón 3 · terminar</button></div>
      <div class="mod-desplegable" hidden></div>
    </div>`;
  const el = cont.querySelector(".mod");
  const q = s => el.querySelector(s);
  const barra = q(".mod-barra"), desp = q(".mod-desplegable"), panel = q(".mod-panel"), dlg = q(".mod-dialogo");
  let abierto = null, pistaSel = null;
  const api = { el, lienzo: q(".mod-lienzo") };

  /* Menú de arriba */
  barra.querySelectorAll(".mod-bm").forEach(b => b.addEventListener("click", ev => {
    ev.stopPropagation();
    const m = b.dataset.m;
    if (!desp.hidden && desp.dataset.m === m) { desp.hidden = true; return; }
    const items = BARRA_MODARIS[m];
    desp.dataset.m = m;
    desp.innerHTML = items.length
      ? items.map(it => `<button data-it="${it}"><span>${it}</span><kbd>${ATAJOS_BARRA[it] || ""}</kbd></button>`).join("")
      : `<p>No se usa en esta práctica</p>`;
    desp.style.left = Math.max(0, Math.min(b.offsetLeft - barra.scrollLeft, el.clientWidth - 210)) + "px";
    desp.style.top = barra.offsetHeight + "px";
    desp.hidden = false;
    desp.querySelectorAll("button").forEach(x => x.addEventListener("click", ev2 => {
      ev2.stopPropagation();
      desp.hidden = true;
      if (o.onBarra) o.onBarra(m, x.dataset.it);
    }));
  }));
  el.addEventListener("click", () => { desp.hidden = true; });

  /* Panel de la derecha: menús F1–F8 y sus herramientas */
  function pintarPanel() {
    if (!abierto) {
      panel.innerHTML = `<div class="mod-seleccion">Selección</div><div class="mod-menus">` + PANEL_MODARIS.map(([t, txt]) => {
        const p = pistaSel && (pistaSel === "menu:" + t || pistaSel.startsWith("herr:" + t + ":")) && t;
        return `<button class="mod-mb ${p ? "pista" : ""}" data-t="${t}" style="--c:${colorMenuF(t)}"><span>${txt}</span><b>${t}</b></button>`;
      }).join("") + `</div>`;
      panel.querySelectorAll(".mod-mb").forEach(b => b.addEventListener("click", () => api.abrirMenuF(b.dataset.t || "3D")));
      return;
    }
    const info = MENUS.find(m => m.tecla === abierto);
    const d = info && info.listo ? HERRAMIENTAS[abierto] : null;
    const c = colorMenuF(abierto);
    const nombre = (PANEL_MODARIS.find(p => (p[0] || "3D") === abierto) || [])[1];
    panel.innerHTML = `<button class="mod-regresar">◂ Menús</button>
      <div class="mod-titulo-menu" style="--c:${c}">${abierto === "3D" ? "" : abierto + " · "}${nombre}</div>` +
      (d ? d.grupos.map((g, gi) => `<div class="mod-grupo">${g.nombre}</div><div class="mod-herrs">` +
             g.herramientas.map((h, hi) =>
               `<button class="mod-h ${pistaSel === "herr:" + abierto + ":" + h.nombre ? "pista" : ""}" style="--c:${c}" data-g="${gi}" data-h="${hi}">${h.nombre}</button>`).join("") +
             `</div>`).join("")
         : `<p class="mod-vacio">Este menú todavía no está en XILOVHA.</p>`);
    panel.querySelector(".mod-regresar").addEventListener("click", () => { abierto = null; pintarPanel(); });
    panel.querySelectorAll(".mod-h").forEach(b => b.addEventListener("click", () => {
      const h = d.grupos[+b.dataset.g].herramientas[+b.dataset.h];
      panel.querySelectorAll(".mod-h").forEach(x => x.classList.remove("activa", "mal"));
      b.classList.add("activa");
      if (o.onHerramienta) o.onHerramienta(abierto, h.nombre, b);
    }));
  }
  api.abrirMenuF = t => { abierto = t; pintarPanel(); };
  api.resetPanel = () => {
    abierto = null; pistaSel = null; pintarPanel();
    el.querySelectorAll(".mod-bm.pista").forEach(b => b.classList.remove("pista"));
  };
  api.pista = sel => {
    pistaSel = sel; pintarPanel();
    el.querySelectorAll(".mod-bm").forEach(b => b.classList.toggle("pista", sel === "barra:" + b.dataset.m));
  };
  api.prompt = txt => { q(".mod-prompt").innerHTML = txt || ""; };
  api.modelo = txt => { q(".mod-modelo").textContent = txt || ""; };
  api.boton3 = ver => { q(".mod-boton3").hidden = !ver; };
  q(".mod-boton3").addEventListener("click", () => { if (o.onBoton3) o.onBoton3(); });

  /* Ventana para escribir valores (como la de Modaris) */
  api.dialogo = (titulo, campos, onOk) => {
    dlg.innerHTML = `<form class="mod-form"><div class="mod-form-t">${titulo}</div>` +
      campos.map((c, i) => `<label><span>${c.n}</span><span class="mod-campo"><input name="c${i}" ${c.texto ? `type="text"` : `inputmode="decimal"`} autocomplete="off">` +
        (c.texto ? "" : `<button type="button" class="mod-signo" data-c="c${i}" title="Poner o quitar el signo menos (−)">+/−</button>`) + `</span></label>`).join("") +
      `<button type="submit" class="mod-enter">Enter ⏎</button></form>`;
    dlg.hidden = false;
    const f = dlg.querySelector("form");
    // El teclado del celular a veces no trae el «−»: este botón lo pone o lo quita
    f.querySelectorAll(".mod-signo").forEach(b => b.addEventListener("click", () => {
      const inp = f.elements[b.dataset.c];
      const v = inp.value.trim().replace(/^[−–]/, "-");
      inp.value = v.startsWith("-") ? v.slice(1) : "-" + v;
      inp.focus();
    }));
    f.addEventListener("submit", ev => { ev.preventDefault(); onOk(campos.map((c, i) => f.elements["c" + i].value.trim())); });
    setTimeout(() => { if (f.elements.c0) f.elements.c0.focus(); }, 30);
  };
  api.cerrarDialogo = () => { dlg.hidden = true; dlg.innerHTML = ""; };

  pintarPanel();
  modarisActiva = api;
  return api;
}

/* =====================================================================
   JUEGO «PRACTICA EN PANTALLA»: activa la herramienta y sigue sus pasos
   ===================================================================== */
function preguntaPantalla(h) {
  const pasos = pasosPantalla(h);
  const area = document.getElementById("juego-area");
  area.innerHTML = `
    <p class="instruccion">Usa esta herramienta en la pantalla de Modaris:</p>
    <div class="tarjeta-pregunta"><span class="pregunta-grande">${h.nombre}</span></div>
    <div class="fs-msg info" id="pp-msg">1. Búscala en el panel de la derecha (o abre su menú con las teclas F1–F8).</div>
    <div class="pp-pantalla"></div>
    <div id="retro"></div>`;
  const msgPP = (t, c) => { const m = document.getElementById("pp-msg"); m.className = "fs-msg " + (c || "info"); m.innerHTML = t; };
  let errores = 0, fase = "herr";
  const hechos = [];

  const pant = pantallaModaris(area.querySelector(".pp-pantalla"), {
    onBarra: () => { if (fase !== "herr") return; errores++; msgPP("❌ Esta herramienta no está en el menú de arriba: búscala en el panel de la derecha.", "no"); },
    onHerramienta: (t, n, btn) => {
      if (fase !== "herr") return;
      if (t !== h.menu || n !== h.nombre) {
        errores++; btn.classList.remove("activa"); btn.classList.add("mal");
        msgPP(`❌ Esa es «${n}». Busca «${h.nombre}».`, "no");
        return;
      }
      fase = "pasos";
      pant.prompt(`«${h.nombre}» activa · ¿qué haces ahora?`);
      msgPP(`✔ «${h.nombre}» activa. 2. Ahora toca los pasos en orden.`, "ok");
      pintarPasos();
    }
  });
  pant.prompt("Elige la herramienta");
  pant.lienzo.innerHTML = `<div class="pp-hoja"><p class="pp-vacio">Hoja de trabajo</p></div>`;

  function pintarPasos() {
    const restantes = mezclar(pasos.map((t, i) => ({ t, i })).filter(p => !hechos.includes(p.i)));
    pant.lienzo.innerHTML = `
      <div class="pp-hoja">
        <ol class="pp-log">${hechos.map(i => `<li>${pasos[i]}</li>`).join("")}</ol>
        ${restantes.length ? `<p class="pp-pregunta">¿Qué haces ahora?</p>
        <div class="pp-opciones">${restantes.map(p => `<button class="pp-op" data-i="${p.i}">${p.t}</button>`).join("")}</div>` : ""}
      </div>`;
    pant.lienzo.querySelectorAll(".pp-op").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      if (i !== hechos.length) {
        errores++; b.classList.add("mal"); b.disabled = true;
        msgPP("❌ Ese paso va después. Piensa qué se hace primero.", "no");
        return;
      }
      hechos.push(i);
      msgPP(hechos.length === pasos.length ? "✔ ¡Listo!" : "✔ Bien. ¿Y luego?", "ok");
      pintarPasos();
      if (hechos.length === pasos.length) {
        pant.prompt("");
        responder(errores === 0,
          errores === 0 ? "¡Sin errores!" : `Terminaste con ${errores} ${errores === 1 ? "error" : "errores"}. El orden correcto es:<ol>${pasos.map(t => `<li>${t}</li>`).join("")}</ol>`,
          `Errores: ${errores}`);
      }
    }));
  }
}

/* =====================================================================
   PRÁCTICA FINAL: FALDA RECTA NIÑA T6
   ===================================================================== */
let FS = null;   // estado de la práctica que está en pantalla
/* Dos versiones del mismo ejercicio:
   "ayuda" = con botón de ayuda y errores frecuentes   (se guarda como juego "falda")
   "sin"   = sin ayuda: solo la instrucción y el menú F  (se guarda como juego "falda2") */
const estadosFalda = { ayuda: null, sin: null };
const JUEGO_FALDA = { ayuda: "falda", sin: "falda2" };
const VISTAS_FALDA = { todo: [-3, -4, 45, 54], pinza: [-2, -3, 24, 18] };

document.getElementById("btn-falda").addEventListener("click", () => iniciarFalda("ayuda", true));
document.getElementById("btn-falda2").addEventListener("click", () => iniciarFalda("sin", true));
const antesActividades = alEntrar.actividades;
alEntrar.actividades = function () { if (antesActividades) antesActividades(); tarjetaFalda(); };
/* ---- Guardar el avance en el dispositivo (si sale o se cierra la página, sigue donde se quedó) ---- */
const CLAVE_FALDA = "xilovha-falda-avance";
let faldaCargadaPara = null;
function duenoFalda() { return (typeof Cuenta !== "undefined" && Cuenta.usuario && Cuenta.usuario.id) || "invitado"; }
function cargarFaldaGuardada() {
  const yo = duenoFalda();
  if (faldaCargadaPara === yo) return;
  faldaCargadaPara = yo;                       // si cambió la cuenta, no se mezcla el avance de otra persona
  estadosFalda.ayuda = estadosFalda.sin = null;
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_FALDA) || "null");
    if (!g || g.user !== yo) return;
    ["ayuda", "sin"].forEach(m => {
      const e = g[m];
      if (e && !e.terminado && e.id) estadosFalda[m] = { ...e, hechos: new Set(e.hechos || []), etapa: "", op: null, ci: 0, err: 0, ayu: 0, pistaObj: null };
    });
  } catch (e) {}
}
function guardarFalda() {
  try {
    const g = { user: duenoFalda() };
    ["ayuda", "sin"].forEach(m => {
      const e = estadosFalda[m];
      if (!e || e.terminado) return;
      g[m] = { modo: e.modo, i: e.etapa === "hecho" ? e.i + 1 : e.i, errores: e.errores, ayudas: e.ayudas, perfectos: e.perfectos,
               sinAyuda: e.sinAyuda, ganados: e.ganados, tiempos: e.tiempos, hechos: [...e.hechos], lineas: e.lineas, curvas: e.curvas,
               hoja: e.hoja, cartucho: e.cartucho, modelo: e.modelo, id: e.id, t0: e.t0, terminado: false };
    });
    localStorage.setItem(CLAVE_FALDA, JSON.stringify(g));
  } catch (e) {}
}

function tarjetaFalda() {
  cargarFaldaGuardada();
  [["ayuda", "falda-sub", "falda-premio", "Traza el patrón completo en una pantalla como la de Modaris, con ayuda en cada paso."],
   ["sin", "falda2-sub", "falda2-premio", "El mismo ejercicio, sin ayuda: solo la instrucción y el menú que se usa."]].forEach(([modo, sub, premio, txt]) => {
    const e = estadosFalda[modo], enCurso = e && !e.terminado && e.i > 0;
    document.getElementById(sub).textContent = enCurso ? `Vas en el paso ${e.i + 1} de ${FALDA.pasos.length}. Toca para continuar.` : txt;
    document.getElementById(premio).textContent = `hasta +${FALDA.pasos.length * 5 + 20} ⭐`;
  });
}
tarjetaFalda();

function iniciarFalda(modo, continuar) {
  juegoEnCurso = false;
  cargarFaldaGuardada();
  const previo = estadosFalda[modo];
  if (continuar && previo && !previo.terminado) {
    FS = previo;
    // Sigue en el paso donde se quedó (el paso a medias empieza otra vez, sin contar lo que llevaba)
    if (FS.etapa === "hecho") FS.i++;
    else { FS.errores -= FS.err || 0; FS.ayudas -= FS.ayu || 0; }
    FS.err = FS.ayu = 0; FS.etapa = "";
    // El reloj total no cuenta el tiempo que estuvo fuera: es la suma de los pasos ya hechos
    FS.t0 = Date.now() - FS.tiempos.reduce((s, t) => s + t.segundos, 0) * 1000;
  } else {
    FS = estadosFalda[modo] = { modo, i: 0, etapa: "", op: null, ci: 0, err: 0, ayu: 0, tPaso: Date.now(), t0: Date.now(),
           errores: 0, ayudas: 0, perfectos: 0, sinAyuda: 0, ganados: 0, tiempos: [],
           hechos: new Set(), lineas: [], curvas: [], hoja: false, cartucho: false, modelo: "", pistaObj: null,
           id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), terminado: false };
  }
  guardarFalda();
  document.getElementById("juego-titulo").textContent = modo === "sin" ? "Práctica final · Sin ayuda" : "Práctica final · Con ayuda";
  irA("juego");
  pintarFalda();
}

function pintarFalda() {
  const area = document.getElementById("juego-area");
  area.innerHTML = `
    <div class="fs">
      <aside class="fs-guia">
        <div class="fs-cab"><span id="fs-num"></span>
          <span>⏱ <b id="fs-tiempo">0:00</b> · ❌ <b id="fs-err">0</b>${FS.modo === "sin" ? "" : ` · 💡 <b id="fs-ayu">0</b>`}</span></div>
        <h2 id="fs-titulo"></h2>
        <p id="fs-texto"></p>
        <p id="fs-menu" class="fs-menu" hidden></p>
        <p id="fs-nota" class="fs-nota" hidden></p>
        <div id="fs-msg" class="fs-msg" aria-live="polite"></div>
        ${FS.modo === "sin" ? "" : `<div class="fs-botones"><button id="fs-ayuda" class="btn-secundario">💡 Ayuda</button><span id="fs-ficha"></span></div>`}
        <details class="fs-medidas"><summary>📏 Tabla de medidas (cm)</summary>
          <table>${FALDA.medidas.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></details>
        <p class="fs-guardado">💾 Tu avance se guarda al terminar cada paso. Si sales, al volver sigues donde te quedaste.</p>
        <button id="fs-reiniciar" class="fs-link">Empezar de nuevo</button>
      </aside>
      <div class="fs-pantalla"></div>
    </div>`;
  FS.pant = pantallaModaris(area.querySelector(".fs-pantalla"), {
    onBarra: faldaBarra, onHerramienta: faldaHerramienta, onBoton3: () => faldaObjetivo("fin")
  });
  FS.pant.modelo(FS.modelo);
  if (FS.modo !== "sin") document.getElementById("fs-ayuda").addEventListener("click", faldaAyuda);
  document.getElementById("fs-reiniciar").addEventListener("click", () => iniciarFalda(FS.modo, false));
  contadoresFalda();
  relojFalda();
  if (FS.terminado) return finFalda(true);
  if (FS.i >= FALDA.pasos.length) return finFalda();
  entrarPaso();
}

function relojFalda() {
  clearInterval(FS.reloj);
  const yo = FS;
  const tic = () => {
    const t = document.getElementById("fs-tiempo");
    if (!t || yo !== FS) return clearInterval(yo.reloj);
    const s = Math.round(((yo.fin || Date.now()) - yo.t0) / 1000);
    t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  tic();
  FS.reloj = setInterval(tic, 1000);
}

function contadoresFalda() {
  const e = document.getElementById("fs-err"), a = document.getElementById("fs-ayu");
  if (e) e.textContent = FS.errores;
  if (a) a.textContent = FS.ayudas;
}

function msgFalda(t, clase) {
  const m = document.getElementById("fs-msg");
  if (!m) return;
  m.className = "fs-msg " + (clase || "");
  m.innerHTML = t;
}

function entrarPaso() {
  const p = FALDA.pasos[FS.i];
  Object.assign(FS, { op: null, ci: 0, err: 0, ayu: 0, tPaso: Date.now(), pistaObj: null,
                      etapa: p.tipo === "barra" ? "barra" : "herramienta" });
  const total = FALDA.pasos.length;
  document.getElementById("juego-progreso").textContent = `Paso ${FS.i + 1} de ${total}`;
  document.getElementById("fs-num").textContent = `Paso ${FS.i + 1} de ${total}`;
  document.getElementById("fs-titulo").textContent = p.titulo;
  document.getElementById("fs-texto").innerHTML = p.guia;
  const nota = document.getElementById("fs-nota");
  nota.hidden = !p.nota; nota.textContent = p.nota ? "ℹ️ " + p.nota : "";
  // Sin ayuda: solo se dice en qué menú está la función
  const menu = document.getElementById("fs-menu");
  menu.hidden = FS.modo !== "sin";
  if (FS.modo === "sin") {
    const t = p.tipo === "barra" ? null : p.opciones[0].menu;
    menu.innerHTML = t ? `Usa el menú <b style="background:${colorMenuF(t)}">${t}</b>` : `Usa el <b>menú de arriba</b>`;
  }
  const ficha = document.getElementById("fs-ficha");
  if (ficha) ficha.innerHTML = "";
  msgFalda("");
  FS.pant.resetPanel(); FS.pant.cerrarDialogo(); FS.pant.boton3(false);
  FS.pant.prompt("Elige la función para este paso");
  dibujarFalda();
}

function errorFalda(t) {
  FS.err++; FS.errores++;
  contadoresFalda();
  msgFalda("❌ " + t + (FS.err >= 2 && FS.modo !== "sin" ? " <br><small>Si te atoras, usa 💡 Ayuda.</small>" : ""), "no");
}

/* ---- Menú de arriba ---- */
function faldaBarra(m, it) {
  const p = FALDA.pasos[FS.i];
  if (!p || FS.etapa === "hecho") return;
  if (p.tipo !== "barra" || m !== p.ruta[0] || it !== p.ruta[1]) {
    errorFalda(`«${m} › ${it}» no es lo que pide este paso.`);
    return;
  }
  if (p.nombre) {
    FS.etapa = "campos";
    FS.pant.prompt("Escribe el nombre y presiona Enter");
    FS.pant.dialogo("Nuevo modelo", [{ n: p.nombre, texto: true }], vals => {
      if (!/falda/i.test(vals[0])) { errorFalda(`Escribe el nombre del modelo: ${FALDA.modelo}.`); return; }
      FS.modelo = vals[0].toUpperCase();
      FS.pant.modelo(FS.modelo);
      FS.pant.cerrarDialogo();
      completarPaso();
    });
    return;
  }
  completarPaso();
}

/* ---- Herramienta del panel ---- */
function faldaHerramienta(tecla, nombre, btn) {
  const p = FALDA.pasos[FS.i];
  if (!p || FS.etapa === "hecho") return;
  if (p.tipo === "barra") {
    btn.classList.remove("activa"); btn.classList.add("mal");
    errorFalda("Este paso no se hace con una herramienta del panel: búscalo en el menú de arriba.");
    return;
  }
  const op = p.opciones.find(o => o.menu === tecla && o.herramienta === nombre);
  if (!op) {
    btn.classList.remove("activa"); btn.classList.add("mal");
    errorFalda(`«${nombre}» no es la herramienta para este paso.`);
    return;
  }
  Object.assign(FS, { op, ci: 0, etapa: "clics", pistaObj: null });
  FS.pant.cerrarDialogo();
  FS.pant.pista(null);
  FS.pant.abrirMenuF(tecla);
  FS.pant.el.querySelectorAll(".mod-h").forEach(b => b.classList.toggle("activa", b.textContent === nombre));
  FS.pant.boton3(nombre === "Bézier");
  FS.pant.prompt(textoClic());
  msgFalda(`✔ ${nombre} activa.`, "ok");
  dibujarFalda();
}

function textoClic() {
  const { herramienta: h, clics } = FS.op, i = FS.ci;
  if (clics[i] === "fin") return "Botón 3 del ratón para terminar la curva";
  if (h === "Rectángulo") return "Clic en la hoja para el inicio del rectángulo";
  if (h === "Pto. Constante" || h === "Añadir punto") return "Clic en el punto de referencia";
  if (h === "Paralelo") return "Clic en la línea de referencia";
  if (h === "Intersección") return "Clic justo en el cruce de las dos líneas";
  if (h === "L. Recta") return i === 0 ? "Clic en el punto inicial" : "Clic en el punto final";
  if (h === "Bézier") return i === 0 ? "Clic en el punto inicial de la curva" : "Clic en el siguiente punto de la curva";
  return "Haz clic";
}

function nombreObj(id) {
  const lados = { "A-B": "la línea de arriba (A–B)", "B-E": "la línea derecha", "E-D": "la línea de abajo", "D-A": "la línea izquierda" };
  if (id.includes("-")) {
    const [a, b] = id.split("-");
    return lados[a + "-" + b] || lados[b + "-" + a] || `la línea ${a}–${b}`;
  }
  if (id === "D" || id === "E") return "una esquina de abajo";
  if (id === "C") return "el cruce de costado y cadera";
  return "el punto " + id;
}
function mismoObjetivo(id, esp) {
  if (id === esp) return true;
  if (!id.includes("-") || !esp.includes("-")) return false;
  const [a, b] = id.split("-"), [c, d] = esp.split("-");
  return (a === c && b === d) || (a === d && b === c);
}

/* ---- Clic en la hoja (puntos, líneas, botón 3) ---- */
function faldaObjetivo(id) {
  if (!FS || FS.etapa === "hecho") return;
  if (FS.etapa !== "clics") {
    if (id !== "hoja" && FS.etapa !== "campos") msgFalda("Primero elige la función para este paso.", "info");
    return;
  }
  const esperado = FS.op.clics[FS.ci];
  if (id === "hoja" && esperado !== "hoja") { msgFalda("Haz clic sobre un punto o una línea.", "info"); return; }
  if (!mismoObjetivo(id, esperado)) {
    errorFalda(id === "fin" ? "Todavía falta marcar un punto antes de terminar."
      : esperado === "fin" ? "Ya marcaste los puntos: termina la curva con el botón 3."
      : `Ese es ${nombreObj(id)}. Lee otra vez el paso.`);
    return;
  }
  FS.ci++;
  FS.pistaObj = null;
  if (FS.ci < FS.op.clics.length) {
    FS.pant.prompt(textoClic());
    msgFalda(`✔ ${id === "hoja" ? "Inicio marcado" : nombreObj(id).replace(/^./, c => c.toUpperCase())}.`, "ok");
    dibujarFalda();
    return;
  }
  FS.pant.boton3(false);
  if (FS.op.campos) {
    FS.etapa = "campos";
    FS.pant.prompt("Escribe los valores y presiona Enter");
    FS.pant.dialogo(FS.op.herramienta, FS.op.campos, vals => {
      const malos = FS.op.campos.filter((c, i) => !valorOk(vals[i], c));
      if (malos.length) {
        errorFalda(`Revisa ${malos.map(c => c.n).join(" y ")}.` + (FS.modo === "sin" ? "" : ` <b>Error frecuente:</b> ${FALDA.pasos[FS.i].error}`));
        return;
      }
      FS.pant.cerrarDialogo();
      completarPaso();
    });
    dibujarFalda();
    return;
  }
  completarPaso();
}
function valorOk(txt, c) {
  const n = parseFloat(String(txt).replace(",", ".").replace(/[−–]/g, "-").replace(/\s+/g, ""));
  return isFinite(n) && [c.v, ...(c.alt || [])].some(v => Math.abs(n - v) < 0.051);
}

/* ---- Ayuda ---- */
function faldaAyuda() {
  if (!FS || FS.etapa === "hecho" || FS.terminado || FS.modo === "sin") return;
  const p = FALDA.pasos[FS.i];
  FS.ayu++; FS.ayudas++;
  contadoresFalda();
  let t = "";
  if (FS.etapa === "barra") {
    t = `En el menú de arriba: <b>${p.ruta.join(" › ")}</b>.`;
    FS.pant.pista("barra:" + p.ruta[0]);
  } else if (FS.etapa === "herramienta") {
    const o = p.opciones[0];
    t = `Abre <b>${o.menu}</b> y elige <b>${o.herramienta}</b>.`;
    FS.pant.pista("herr:" + o.menu + ":" + o.herramienta);
    botonFicha(o.menu, o.herramienta);
  } else if (FS.etapa === "clics") {
    const e = FS.op.clics[FS.ci];
    t = e === "fin" ? "Presiona <b>Botón 3 · terminar</b> (abajo de la pantalla)."
      : e === "hoja" ? "Haz clic en cualquier lugar de la hoja."
      : `Haz clic en <b>${nombreObj(e)}</b> (está marcado en amarillo).`;
    FS.pistaObj = e;
    dibujarFalda();
  } else if (FS.etapa === "campos") {
    t = p.nombre ? `Escribe <b>${FALDA.modelo}</b>.`
      : "Escribe: " + FS.op.campos.map(c => `<b>${c.n} = ${c.v}</b>`).join(", ") + ".";
  }
  msgFalda("💡 " + t, "info");
}
function botonFicha(menu, nombre) {
  const grupos = HERRAMIENTAS[menu].grupos;
  grupos.forEach((g, gi) => g.herramientas.forEach((h, hi) => {
    if (h.nombre !== nombre) return;
    const cont = document.getElementById("fs-ficha");
    cont.innerHTML = `<button class="btn-secundario">📖 Ver ficha de ${nombre}</button>`;
    cont.firstChild.addEventListener("click", () => abrirDetalle(menu, gi, hi));
  }));
}

/* ---- Paso terminado ---- */
function completarPaso() {
  const p = FALDA.pasos[FS.i];
  if (p.ruta && p.ruta[1] === "Nueva hoja") FS.hoja = true;
  if (p.cartucho) FS.cartucho = true;
  const d = p.dibuja || {};
  (d.puntos || []).forEach(id => FS.hechos.add(id));
  (d.lineas || []).forEach(l => FS.lineas.push(l));
  (d.curvas || []).forEach(c => FS.curvas.push(c));
  const segundos = Math.min(3599, Math.round((Date.now() - FS.tPaso) / 100) / 10);
  const perfecto = FS.err === 0 && FS.ayu === 0;
  if (FS.ayu === 0) FS.sinAyuda++;
  if (perfecto) { FS.perfectos++; FS.ganados += 5; sumarPuntos(5); }
  FS.tiempos.push({ paso: p.titulo, funcion: FS.op ? FS.op.herramienta : p.ruta.join(" › "), segundos, errores: FS.err, ayudas: FS.ayu });
  registrarRespuesta({
    partida: FS.id, juego: JUEGO_FALDA[FS.modo],
    pregunta: `Paso ${FS.i + 1}: ${p.titulo}`.slice(0, 80),
    respuesta: `${FS.op ? FS.op.menu + " › " + FS.op.herramienta : p.ruta.join(" › ")} · errores ${FS.err} · ayudas ${FS.ayu}`.slice(0, 160),
    correcta: perfecto, segundos
  });
  FS.etapa = "hecho";
  guardarFalda();
  FS.pistaObj = null;
  FS.pant.boton3(false);
  FS.pant.resetPanel();
  FS.pant.prompt("");
  dibujarFalda();
  msgFalda(perfecto ? "✅ ¡Paso correcto! <b>+5 ⭐</b>" : "✅ Paso terminado.", "ok");
  const yo = FS;
  setTimeout(() => {
    if (yo !== FS || FS.etapa !== "hecho") return;
    FS.i++;
    if (FS.i >= FALDA.pasos.length) finFalda(); else entrarPaso();
  }, 1100);
}

function finFalda(yaGuardado) {
  const total = FALDA.pasos.length;
  if (!yaGuardado) {
    FS.terminado = true;
    FS.fin = Date.now();
    FS.ganados += 20; sumarPuntos(20);
    registrarJuego(JUEGO_FALDA[FS.modo], FS.perfectos, total);
    guardarFalda();   // ya terminó: se borra el avance guardado de esta versión
  }
  const mmss = x => { x = Math.round(x); return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, "0")}`; };
  const tablaPasos = `<details class="fs-medidas"><summary>⏱ Tiempo en cada paso</summary><table>` +
    FS.tiempos.map((t, i) => `<tr><td>${i + 1}. ${t.paso}<br><small>${t.funcion}${t.errores ? ` · ❌ ${t.errores}` : ""}${t.ayudas ? ` · 💡 ${t.ayudas}` : ""}</small></td><td>${mmss(t.segundos)}</td></tr>`).join("") +
    `</table></details>`;
  const s = Math.round((FS.fin - FS.t0) / 1000);
  const autonomia = Math.round(FS.sinAyuda / total * 100);
  const estrellas = FS.perfectos === total ? "🌟🌟🌟" : FS.perfectos >= total * 0.6 ? "🌟🌟" : "🌟";
  document.getElementById("juego-progreso").textContent = "";
  FS.pant.prompt("Práctica terminada");
  dibujarFalda();
  document.querySelector(".fs-guia").innerHTML = `
    <div class="fin-estrellas">${estrellas}</div>
    <h2>¡Terminaste el trazo de la falda!</h2>
    <div class="fs-stats">
      <div><b>${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}</b><span>Tiempo</span></div>
      <div><b>${FS.errores}</b><span>Errores</span></div>
      ${FS.modo === "sin" ? `<div><b>${FS.perfectos}/${total}</b><span>Pasos sin errores</span></div>`
        : `<div><b>${FS.ayudas}</b><span>Ayudas</span></div><div><b>${autonomia}%</b><span>Pasos sin ayuda</span></div>`}
    </div>
    <p>${FS.perfectos} de ${total} pasos perfectos. Ganaste <b>${FS.ganados} ⭐</b>.</p>
    ${tablaPasos}
    <h3>Después del trazo, en Lectra:</h3>
    <ul class="fs-check">${FALDA.despues.map((t, i) => `<li><label><input type="checkbox"> ${t}</label></li>`).join("")}</ul>
    <div class="fin-botones">
      <button class="btn-principal" id="fs-otra">Repetir práctica</button>
      <button class="btn-secundario" data-ir="actividades">Otras actividades</button>
    </div>`;
  document.getElementById("fs-otra").addEventListener("click", () => iniciarFalda(FS.modo, false));
}

/* ---- Dibujo del patrón ---- */
function vistaFalda() {
  const p = FALDA.pasos[FS.i];
  return VISTAS_FALDA[(p && !FS.terminado && p.zoom) || "todo"];
}
function posEtiqueta(id, k) {
  const [x, y] = FALDA.puntos[id], d = 0.75 * k;
  if (x === 0) return [x - d, y + 0.45 * k, "end"];
  if (x === 38.5) return [x + d, y + 0.45 * k, "start"];
  if (y === 0) {
    if (id === "6") return [x - 0.2 * k, y - d, "end"];
    if (id === "4") return [x + 0.2 * k, y - d, "start"];
    return [x, y - d, "middle"];
  }
  return [x + d, y + 1.3 * k, "start"];
}
function dibujarFalda() {
  const lz = FS.pant.lienzo;
  if (!FS.hoja) {
    lz.innerHTML = `<div class="mod-sin-hoja">${FS.modelo ? "Modelo: " + FS.modelo + "<br>" : ""}Todavía no hay hoja abierta</div>`;
    return;
  }
  const [vx, vy, vw, vh] = vistaFalda(), k = vw / 45, P = FALDA.puntos;
  let s = `<svg class="mod-svg" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMin meet">
    <rect class="mod-hoja" x="-2.5" y="-3.5" width="44" height="52"/>`;
  FS.lineas.forEach(([a, b]) => { s += `<line class="mod-tr" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`; });
  FS.curvas.forEach(c => { const a = P[c.de], b = P[c.a]; s += `<path class="mod-tr" d="M${a[0]} ${a[1]} C${c.c1} ${c.c2} ${b[0]} ${b[1]}"/>`; });
  FS.hechos.forEach(id => {
    const [x, y, oculto] = P[id];
    s += `<rect class="mod-pt" x="${x - 0.28 * k}" y="${y - 0.28 * k}" width="${0.56 * k}" height="${0.56 * k}"/>`;
    if (!oculto) { const [lx, ly, an] = posEtiqueta(id, k); s += `<text class="mod-et" x="${lx}" y="${ly}" text-anchor="${an}" font-size="${1.35 * k}">${id}</text>`; }
  });
  if (FS.cartucho) {
    s += `<g class="mod-cartucho"><rect x="21" y="43.3" width="18.5" height="3.6"/>
      <text x="21.6" y="44.9" font-size="1">modelo : ${(FS.modelo || FALDA.modelo).replace(/[<>&]/g, "")}</text>
      <text x="21.6" y="46.3" font-size="1">hoja 1 · talla 6 · cm</text></g>`;
  }
  if (FS.pistaObj && FS.pistaObj !== "fin" && FS.pistaObj !== "hoja") {
    if (FS.pistaObj.includes("-")) {
      const [a, b] = FS.pistaObj.split("-");
      s += `<line class="mod-pista-l" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`;
    } else {
      const [x, y] = P[FS.pistaObj];
      s += `<circle class="mod-pista" cx="${x}" cy="${y}" r="${1.1 * k}"/>`;
    }
  }
  s += `<circle class="mod-sel" r="${0.9 * k}" cx="-99" cy="-99"/><line class="mod-hl" x1="-99" y1="-99" x2="-99" y2="-99"/></svg>`;
  lz.innerHTML = s;

  const svg = lz.querySelector("svg"), anillo = svg.querySelector(".mod-sel"), hl = svg.querySelector(".mod-hl");
  svg.addEventListener("mousemove", ev => {
    const o = objetoCercano(svg, ev);
    anillo.setAttribute("cx", o && !o.linea ? o.x : -99); anillo.setAttribute("cy", o && !o.linea ? o.y : -99);
    if (o && o.linea) { const [a, b] = o.id.split("-"); hl.setAttribute("x1", P[a][0]); hl.setAttribute("y1", P[a][1]); hl.setAttribute("x2", P[b][0]); hl.setAttribute("y2", P[b][1]); }
    else { ["x1", "y1", "x2", "y2"].forEach(a => hl.setAttribute(a, -99)); }
  });
  svg.addEventListener("click", ev => { const o = objetoCercano(svg, ev); faldaObjetivo(o ? o.id : "hoja"); });
}
function objetoCercano(svg, ev) {
  const m = svg.getScreenCTM();
  if (!m) return null;
  const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  const p = pt.matrixTransform(m.inverse());
  const k = vistaFalda()[2] / 45, P = FALDA.puntos;
  const cand = new Set(FS.hechos);
  if (FS.etapa === "clics") FS.op.clics.forEach(id => { if (P[id]) cand.add(id); });
  let mejor = null, dmin = 1.3 * k;
  cand.forEach(id => { const d = Math.hypot(p.x - P[id][0], p.y - P[id][1]); if (d < dmin) { dmin = d; mejor = { id, x: P[id][0], y: P[id][1] }; } });
  if (mejor) return mejor;
  dmin = 0.8 * k;
  FS.lineas.forEach(([a, b]) => { const d = distSegmento(p, P[a], P[b]); if (d < dmin) { dmin = d; mejor = { id: a + "-" + b, linea: true }; } });
  return mejor;
}
function distSegmento(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - (a[0] + t * dx), p.y - (a[1] + t * dy));
}
