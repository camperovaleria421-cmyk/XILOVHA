/* =====================================================================
   VESTIDOR: vestir y girar al modelo
   ---------------------------------------------------------------------
   El giro usa las 4 vistas (frente, perfil, espalda, perfil).
   Para que se vea como una vuelta, la figura se "aplana" de lado,
   cambia de vista y se vuelve a abrir.
   ===================================================================== */

let modeloActual = "mujer";
let categoriaActual = CATEGORIAS[0].id;
const puesto = { mujer: {}, hombre: {} };      // categoría -> id de prenda
const vistaIdx = { mujer: 0, hombre: 0 };      // posición en ORDEN_VISTAS
let girando = false;
let autoGiro = null;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Precargar todas las vistas para que el giro no parpadee */
Object.values(MODELOS).forEach(m => Object.values(m.vistas).forEach(src => { const i = new Image(); i.src = src; }));

/* ---------- Cambiar de modelo ---------- */
document.querySelectorAll(".tab-modelo").forEach(b => b.addEventListener("click", () => {
  modeloActual = b.dataset.modelo;
  document.querySelectorAll(".tab-modelo").forEach(x => x.classList.toggle("activo", x === b));
  pintarVestidor();
}));

document.getElementById("btn-quitar").addEventListener("click", () => {
  puesto[modeloActual] = {};
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
    girar(1);
    autoGiro = setInterval(() => girar(1), 1100);
    btn.textContent = "⏸ Detener"; btn.setAttribute("aria-pressed", "true");
  }
}
function detenerAutoGiro() { if (autoGiro) alternarAutoGiro(); }

/* Arrastrar con el dedo o el ratón para girar */
(function () {
  const esc = document.getElementById("escenario");
  let inicioX = null;
  esc.addEventListener("pointerdown", e => { inicioX = e.clientX; esc.setPointerCapture(e.pointerId); detenerAutoGiro(); });
  esc.addEventListener("pointermove", e => {
    if (inicioX === null) return;
    const dx = e.clientX - inicioX;
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
  esc.style.aspectRatio = `${m.ancho} / ${m.alto}`;

  let capas = `<img class="modelo-base" src="${m.vistas[vista]}" alt="${m.nombre}, vista ${NOMBRE_VISTA[vista].toLowerCase()}" draggable="false">`;
  let ocultas = 0;
  ["inferior", "superior", "vestido", "zapatos", "accesorio"].forEach(cat => {
    const pr = PRENDAS.find(p => p.id === puesto[modeloActual][cat]);
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
  const lista = prendasDelModelo().filter(p => p.categoria === categoriaActual);
  if (!lista.length) {
    cont.innerHTML = `<div class="closet-vacio">
      <span>🧵</span>
      <p><b>Este cajón está vacío.</b><br>Aquí aparecerá la ropa de esta categoría en cuanto se agreguen las imágenes del closet.</p>
    </div>`;
    return;
  }
  const puntos = leerPuntos();
  cont.innerHTML = lista.map(p => {
    const bloqueada = p.costo > puntos;
    const activa = puesto[modeloActual][p.categoria] === p.id;
    return `<button class="prenda ${activa ? "activa" : ""}" data-id="${p.id}" ${bloqueada ? "disabled" : ""}>
      <img src="${p.img}" alt="">
      <span>${p.nombre}</span>
      ${bloqueada ? `<span class="candado">🔒 ${p.costo} ⭐</span>` : ""}
    </button>`;
  }).join("");
  cont.querySelectorAll(".prenda:not([disabled])").forEach(b => b.addEventListener("click", () => ponerPrenda(b.dataset.id)));
}

function ponerPrenda(id) {
  const p = PRENDAS.find(x => x.id === id);
  const ropa = puesto[modeloActual];
  if (ropa[p.categoria] === id) delete ropa[p.categoria];       // tocar otra vez = quitar
  else {
    ropa[p.categoria] = id;
    if (p.categoria === "vestido") { delete ropa.superior; delete ropa.inferior; }
    if (p.categoria === "superior" || p.categoria === "inferior") delete ropa.vestido;
  }
  pintarVestidor();
}
