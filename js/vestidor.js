/* =====================================================================
   VESTIDOR: vestir y girar al modelo
   ---------------------------------------------------------------------
   El giro usa las 4 vistas (frente, perfil, espalda, perfil).
   Para que se vea como una vuelta, la figura se "aplana" de lado,
   cambia de vista y se vuelve a abrir.
   ===================================================================== */

let modeloActual = P.vestidor.modelo;        // se guarda en la cuenta (js/cuenta.js)
let categoriaActual = CATEGORIAS[0].id;
const ropa = m => P.vestidor.puesto[m];      // categoría -> id de prenda, por modelo
const ORDEN_CAPAS = ["inferior", "torso", "calzado", "encima", "accesorio"];   // de abajo hacia arriba
const luzDe = m => LUCES.find(l => l.id === P.vestidor.luces[m]) || LUCES[0];
const filtroLuz = () => { const f = luzDe(modeloActual).filtro; return f === "none" ? "" : `style="filter:${f}"`; };

/* Al entrar a una cuenta: recuperar el modelo y la ropa que tenía puesta */
function cargarVestidorGuardado() {
  modeloActual = P.vestidor.modelo;
  document.querySelectorAll(".tab-modelo").forEach(x => x.classList.toggle("activo", x.dataset.modelo === modeloActual));
  if (document.getElementById("pantalla-vestidor").classList.contains("activa")) pintarVestidor();
}
cargarVestidorGuardado();
const vistaIdx = { mujer: 0, hombre: 0 };      // posición en ORDEN_VISTAS
let girando = false;
let autoGiro = null;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Precargar todas las vistas para que el giro no parpadee */
Object.values(MODELOS).forEach(m => Object.values(m.vistas).forEach(src => { const i = new Image(); i.src = src; }));

/* ---------- Cambiar de modelo ---------- */
document.querySelectorAll(".tab-modelo").forEach(b => b.addEventListener("click", () => {
  detenerAutoGiro();
  cancelAnimationFrame(animacion360);
  modeloActual = b.dataset.modelo;
  P.vestidor.modelo = modeloActual;
  cambioProgreso();
  document.querySelectorAll(".tab-modelo").forEach(x => x.classList.toggle("activo", x === b));
  pintarVestidor();
}));

document.getElementById("btn-quitar").addEventListener("click", () => {
  P.vestidor.puesto[modeloActual] = {};
  cambioProgreso();
  pintarVestidor();
});

alEntrar.vestidor = pintarVestidor;

/* ---------- Hoja de referencia con las 4 vistas ---------- */
document.getElementById("btn-vistas").addEventListener("click", () => {
  const m = MODELOS[modeloActual];
  document.getElementById("detalle-contenido").innerHTML = `
    <div class="detalle-grupo">Hoja de referencia</div>
    <h2>${m.nombre}</h2>
    <img class="img-referencia" src="${m.referencia}" alt="${m.nombre}: frente, perfil izquierdo, perfil derecho y atrás">`;
  document.getElementById("detalle").classList.remove("oculto");
});

/* ---------- Controles de giro ---------- */
document.getElementById("btn-girar-izq").addEventListener("click", () => girar(-1));
document.getElementById("btn-girar-der").addEventListener("click", () => girar(1));
document.getElementById("btn-auto").addEventListener("click", alternarAutoGiro);

function alternarAutoGiro() {
  const btn = document.getElementById("btn-auto");
  if (autoGiro) {
    clearInterval(autoGiro); autoGiro = null;
    btn.textContent = "▶ Dar vueltas"; btn.setAttribute("aria-pressed", "false");
  } else {
    if (es360()) autoGiro = setInterval(() => ponerCuadro(cuadro360[modeloActual] + 1), 80);
    else { girar(1); autoGiro = setInterval(() => girar(1), 1100); }
    btn.textContent = "⏸ Detener"; btn.setAttribute("aria-pressed", "true");
  }
}
function detenerAutoGiro() { if (autoGiro) alternarAutoGiro(); }

/* ---------- Giro 3D real (modelos con cuadros de video 360°) ---------- */
const cuadro360 = { mujer: 0, hombre: 0 };
let animacion360 = null;
const es360 = () => MODELOS[modeloActual].giro360;
const srcCuadro = (g, n) => `${g.carpeta}${String(n).padStart(2, "0")}.jpg`;

// Precargar los cuadros para que el giro sea fluido
Object.values(MODELOS).forEach(m => {
  if (m.giro360) for (let n = 0; n < m.giro360.cuadros; n++) { const i = new Image(); i.src = srcCuadro(m.giro360, n); }
});

function ponerCuadro(n) {
  const g = es360();
  n = ((n % g.cuadros) + g.cuadros) % g.cuadros;
  cuadro360[modeloActual] = n;
  const img = document.getElementById("img360");
  if (img) img.src = srcCuadro(g, n);
  // Marca la vista más cercana (Frente / Perfil / Espalda / Perfil)
  const cercana = ORDEN_VISTAS.reduce((mejor, v, i) => {
    const d = Math.min(Math.abs(g.vistas[v] - n), g.cuadros - Math.abs(g.vistas[v] - n));
    return d < mejor.d ? { i, d } : mejor;
  }, { i: 0, d: Infinity }).i;
  document.querySelectorAll(".punto-vista").forEach((b, i) => b.classList.toggle("activo", i === cercana));
}

/* Gira suavemente hasta un cuadro (para los botones y los puntos de vista) */
function animar360(pasos) {
  cancelAnimationFrame(animacion360);
  if (sinMovimiento) { ponerCuadro(cuadro360[modeloActual] + pasos); return; }
  let hechos = 0, ultimo = 0;
  const paso = t => {
    if (t - ultimo >= 45) { ultimo = t; hechos++; ponerCuadro(cuadro360[modeloActual] + Math.sign(pasos)); }
    if (hechos < Math.abs(pasos)) animacion360 = requestAnimationFrame(paso);
  };
  animacion360 = requestAnimationFrame(paso);
}

function girar360(direccion, destino) {
  const g = es360();
  if (destino !== undefined) {
    let d = g.vistas[ORDEN_VISTAS[destino]] - cuadro360[modeloActual];
    if (d > g.cuadros / 2) d -= g.cuadros;
    if (d < -g.cuadros / 2) d += g.cuadros;
    animar360(d);
  } else {
    animar360(direccion * Math.round(g.cuadros / 4));
  }
}

/* Arrastrar con el dedo o el ratón para girar */
(function () {
  const esc = document.getElementById("escenario");
  let inicioX = null, cuadroInicio = 0;
  esc.addEventListener("pointerdown", e => {
    inicioX = e.clientX; cuadroInicio = cuadro360[modeloActual];
    esc.setPointerCapture(e.pointerId); detenerAutoGiro(); cancelAnimationFrame(animacion360);
  });
  esc.addEventListener("pointermove", e => {
    if (inicioX === null) return;
    const dx = e.clientX - inicioX;
    if (es360()) { ponerCuadro(cuadroInicio - Math.round(dx / 8)); return; }   // giro continuo
    if (Math.abs(dx) > 45) { girar(dx > 0 ? 1 : -1); inicioX = e.clientX; }
  });
  const soltar = () => { inicioX = null; };
  esc.addEventListener("pointerup", soltar);
  esc.addEventListener("pointercancel", soltar);
})();

/* Teclado: flechas izquierda / derecha cuando el escenario tiene el foco */
document.getElementById("escenario").addEventListener("keydown", e => {
  if (e.key === "ArrowLeft")  { e.preventDefault(); girar(-1); }
  if (e.key === "ArrowRight") { e.preventDefault(); girar(1); }
});

function girar(direccion, destino) {
  if (es360()) return girar360(direccion, destino);
  if (girando) return;
  const total = ORDEN_VISTAS.length;
  const nuevo = destino !== undefined ? destino : (vistaIdx[modeloActual] + direccion + total) % total;
  if (nuevo === vistaIdx[modeloActual]) return;
  const figura = document.getElementById("figura");

  if (sinMovimiento || !figura) {
    vistaIdx[modeloActual] = nuevo;
    pintarEscenario();
    return;
  }
  girando = true;
  figura.classList.add("cerrando");
  setTimeout(() => {
    vistaIdx[modeloActual] = nuevo;
    pintarEscenario(true);
    const f2 = document.getElementById("figura");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      f2.classList.remove("cerrando");
      setTimeout(() => { girando = false; }, 200);
    }));
  }, 200);
}

/* ---------- Pintar todo ---------- */
function prendasDelModelo() {
  return PRENDAS.filter(p => p.modelo === modeloActual || p.modelo === "ambos");
}

function pintarVestidor() {
  pintarEscenario();
  pintarTabs();
  pintarPrendas();
}

function imagenPrenda(p, vista) {
  if (vista === "frente") return p.img;
  return (p.vistas || {})[vista] || "";
}

function pintarEscenario(entraCerrada) {
  const m = MODELOS[modeloActual];
  const vista = ORDEN_VISTAS[vistaIdx[modeloActual]];
  const esc = document.getElementById("escenario");
  esc.classList.toggle("estudio-3d", !!m.giro360);

  // Modelo con giro 3D real (cuadros del video de modelado)
  if (m.giro360) {
    const g = m.giro360;
    const conRopa = Object.keys(ropa(modeloActual)).length;
    esc.style.aspectRatio = `${g.ancho} / ${g.alto}`;
    esc.innerHTML = `
      <img id="img360" class="modelo-base" ${filtroLuz()} src="${srcCuadro(g, cuadro360[modeloActual])}" alt="${m.nombre} en 3D. Arrastra para girarlo." draggable="false">
      <span class="sello-3d">3D · 360°</span>
      ${conRopa ? `<span class="aviso-vista">La ropa en 3D estará disponible pronto</span>` : ""}`;
    document.getElementById("indicador-vistas").innerHTML = ORDEN_VISTAS.map((v, i) =>
      `<button class="punto-vista" data-i="${i}" aria-label="Ver ${NOMBRE_VISTA[v]}">${NOMBRE_VISTA[v]}</button>`).join("");
    document.querySelectorAll(".punto-vista").forEach(b => b.addEventListener("click", () => {
      detenerAutoGiro();
      girar(0, +b.dataset.i);
    }));
    ponerCuadro(cuadro360[modeloActual]);
    return;
  }

  esc.style.aspectRatio = `${m.ancho} / ${m.alto}`;

  let capas = `<img class="modelo-base" ${filtroLuz()} src="${m.vistas[vista]}" alt="${m.nombre}, vista ${NOMBRE_VISTA[vista].toLowerCase()}" draggable="false">`;
  let ocultas = 0;
  ORDEN_CAPAS.forEach(cat => {
    const pr = PRENDAS.find(p => p.id === ropa(modeloActual)[cat]);
    if (!pr) return;
    const src = imagenPrenda(pr, vista);
    if (src) capas += `<img class="capa" src="${src}" alt="${pr.nombre}" draggable="false">`;
    else ocultas++;
  });

  esc.innerHTML = `
    <div class="sombra-piso"></div>
    <div class="respira"><div id="figura" class="figura ${entraCerrada ? "cerrando" : ""}">${capas}</div></div>
    ${ocultas ? `<span class="aviso-vista">${ocultas === 1 ? "1 prenda solo tiene" : ocultas + " prendas solo tienen"} vista de frente</span>` : ""}`;

  // Puntos de vista (Frente · Perfil · Espalda · Perfil)
  document.getElementById("indicador-vistas").innerHTML = ORDEN_VISTAS.map((v, i) =>
    `<button class="punto-vista ${i === vistaIdx[modeloActual] ? "activo" : ""}" data-i="${i}" aria-label="Ver ${NOMBRE_VISTA[v]}">${NOMBRE_VISTA[v]}</button>`).join("");
  document.querySelectorAll(".punto-vista").forEach(b => b.addEventListener("click", () => {
    detenerAutoGiro();
    girar(0, +b.dataset.i);
  }));
}

function pintarTabs() {
  const tabs = document.getElementById("closet-tabs");
  tabs.innerHTML = CATEGORIAS.map(c =>
    `<button class="closet-tab ${c.id === categoriaActual ? "activo" : ""}" data-cat="${c.id}">${c.nombre}</button>`).join("");
  tabs.querySelectorAll(".closet-tab").forEach(b => b.addEventListener("click", () => {
    categoriaActual = b.dataset.cat;
    pintarTabs();
    pintarPrendas();
  }));
}

function pintarPrendas() {
  const cont = document.getElementById("closet-prendas");
  if (categoriaActual === "luces") return pintarLuces(cont);
  const lista = prendasDelModelo().filter(p => p.categoria === categoriaActual);
  if (!lista.length) {
    const cat = CATEGORIAS.find(c => c.id === categoriaActual);
    cont.innerHTML = `<div class="closet-vacio">
      <span>🧵</span>
      <p><b>Próximamente en 3D.</b><br>${cat.vacio}</p>
    </div>`;
    return;
  }
  const puntos = leerPuntos();
  cont.innerHTML = lista.map(p => {
    const bloqueada = p.costo > puntos;
    const activa = ropa(modeloActual)[p.categoria] === p.id;
    return `<button class="prenda ${activa ? "activa" : ""}" data-id="${p.id}" ${bloqueada ? "disabled" : ""}>
      <img src="${p.miniatura || p.img}" alt="" loading="lazy">
      <span>${p.nombre}</span>
      ${bloqueada ? `<span class="candado">🔒 ${p.costo} ⭐</span>` : ""}
    </button>`;
  }).join("");
  cont.querySelectorAll(".prenda:not([disabled])").forEach(b => b.addEventListener("click", () => ponerPrenda(b.dataset.id)));
}

function ponerPrenda(id) {
  const p = PRENDAS.find(x => x.id === id);
  const r = ropa(modeloActual);
  if (r[p.categoria] === id) delete r[p.categoria];             // tocar otra vez = quitar
  else {
    r[p.categoria] = id;
  }
  cambioProgreso();
  pintarVestidor();
}

/* ---------- Color de luces ---------- */
function pintarLuces(cont) {
  const puntos = leerPuntos();
  const actual = luzDe(modeloActual).id;
  cont.innerHTML = `<p class="closet-ayuda">Cambia el color de todo lo que brilla: visor, cabello y detalles. Gana puntos en <b>Practicar</b> para desbloquear más colores.</p>` +
    LUCES.map(l => {
      const bloqueada = l.costo > puntos;
      return `<button class="luz ${l.id === actual ? "activa" : ""}" data-luz="${l.id}" ${bloqueada ? "disabled" : ""} style="--luz:${l.color}">
        <span class="foco-luz"></span>
        <span>${l.nombre}</span>
        ${bloqueada ? `<span class="candado">🔒 ${l.costo} ⭐</span>` : ""}
      </button>`;
    }).join("");
  cont.querySelectorAll(".luz:not([disabled])").forEach(b => b.addEventListener("click", () => {
    P.vestidor.luces[modeloActual] = b.dataset.luz;
    cambioProgreso();
    pintarVestidor();
  }));
}
