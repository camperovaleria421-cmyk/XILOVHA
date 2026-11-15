/* =====================================================================
   LÓGICA PRINCIPAL DE LA APP XILOVHA
   ===================================================================== */

let menuActual = null;

/* ---------- Puntos (forman parte del avance de js/cuenta.js) ---------- */
function leerPuntos() { return P.puntos; }
function guardarPuntos(n) {
  P.puntos = Math.max(0, n);
  cambioProgreso();
  pintarPuntos();
}
function sumarPuntos(n) { guardarPuntos(leerPuntos() + n); }
function pintarPuntos() {
  const p = leerPuntos();
  document.querySelectorAll(".puntos-valor").forEach(el => el.textContent = p);
}

/* ---------- Cambiar de pantalla ---------- */
const alEntrar = {};   // funciones que se ejecutan al abrir cada pantalla
function irA(nombre) {
  document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
  document.getElementById("pantalla-" + nombre).classList.add("activa");
  // La barra lateral se ve en todas las pantallas menos en la portada
  document.body.classList.toggle("con-lateral", nombre !== "inicio");
  document.querySelectorAll(".lateral-item").forEach(b => {
    const activo = b.dataset.ir === nombre || (b.dataset.incluye || "") === nombre;
    b.classList.toggle("activo", activo);
    if (activo) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  });
  cerrarLateral();
  window.scrollTo(0, 0);
  pintarPuntos();
  if (alEntrar[nombre]) alEntrar[nombre]();
}
document.addEventListener("click", e => {
  const boton = e.target.closest("[data-ir]");
  if (boton) irA(boton.dataset.ir);
});

/* ---------- Menú lateral / cajón en el teléfono ---------- */
document.querySelectorAll(".barra").forEach(barra => {
  const b = document.createElement("button");
  b.className = "btn-menu";
  b.setAttribute("aria-label", "Abrir menú");
  b.innerHTML = `<svg class="ico"><use href="#i-menu"/></svg>`;
  barra.appendChild(b);
});
document.querySelectorAll(".btn-menu").forEach(b => b.addEventListener("click", abrirLateral));
function abrirLateral() { document.body.classList.add("lateral-abierto"); }
function cerrarLateral() { document.body.classList.remove("lateral-abierto"); }
document.getElementById("velo").addEventListener("click", cerrarLateral);
document.querySelector(".btn-cerrar-lateral").addEventListener("click", cerrarLateral);

/* ---------- Lista de menús F1–F8 (con sus colores) ---------- */
function contarHerramientas(tecla) {
  const d = HERRAMIENTAS[tecla];
  return d ? d.grupos.reduce((n, g) => n + g.herramientas.length, 0) : 0;
}
function pintarMenus() {
  const cont = document.getElementById("lista-menus");
  cont.innerHTML = MENUS.map(m => {
    const d = HERRAMIENTAS[m.tecla];
    const listo = m.listo && d;
    const detalle = listo ? `${contarHerramientas(m.tecla)} herramientas · ${d.grupos.map(g => g.nombre).join(", ")}` : "Próximamente";
    return `
    <button class="tarjeta-menu" data-tecla="${m.tecla}" style="--color-menu:${m.color}" ${listo ? "" : "disabled"}>
      <span class="tecla">${m.tecla}</span>
      <span class="tarjeta-texto"><strong>${m.nombre}</strong><small>${detalle}</small></span>
      ${listo ? `<svg class="ico flecha"><use href="#i-flecha"/></svg>` : `<span class="etiqueta pronto">Pronto</span>`}
    </button>`;
  }).join("");
  cont.querySelectorAll(".tarjeta-menu:not([disabled])").forEach(b =>
    b.addEventListener("click", () => abrirMenu(b.dataset.tecla)));

  // Chips de colores en el inicio
  const chips = document.getElementById("chips-menus");
  chips.innerHTML = MENUS.map(m => {
    const listo = m.listo && HERRAMIENTAS[m.tecla];
    return `<button class="chip-menu" data-tecla="${m.tecla}" style="--color-menu:${m.color}" ${listo ? "" : "disabled"}
              title="${m.nombre}${listo ? "" : " (próximamente)"}"><b>${m.tecla}</b><span>${m.nombre}</span></button>`;
  }).join("");
  chips.querySelectorAll(".chip-menu:not([disabled])").forEach(b =>
    b.addEventListener("click", () => abrirMenu(b.dataset.tecla)));

  // Resumen en la tarjeta azul del inicio
  const listos = MENUS.filter(m => m.listo && HERRAMIENTAS[m.tecla]);
  const total = listos.reduce((n, m) => n + contarHerramientas(m.tecla), 0);
  document.getElementById("hero-meta").textContent =
    `Nivel inicial · ${listos.map(m => m.tecla).join(" y ")} disponibles · ${total} herramientas`;
}

/* ---------- Consejo de la patronista (sale de los tips de cada ficha) ---------- */
const CONSEJOS = Object.keys(HERRAMIENTAS).flatMap(menu =>
  HERRAMIENTAS[menu].grupos.flatMap(g => g.herramientas
    .filter(h => h.nota && !h.pendiente)
    .map(h => ({ menu, nombre: h.nombre, nota: h.nota }))));
let consejoIdx = Math.floor(Math.random() * CONSEJOS.length);
function pintarConsejo() {
  const c = CONSEJOS[consejoIdx % CONSEJOS.length];
  if (!c) return;
  document.getElementById("consejo-texto").innerHTML = `<b>${c.nombre} (${c.menu}):</b> ${c.nota}`;
}
document.getElementById("btn-consejo").addEventListener("click", () => { consejoIdx++; pintarConsejo(); });
pintarConsejo();

/* ---------- Abrir un menú (ej. F1) ---------- */
function abrirMenu(tecla) {
  menuActual = tecla;
  const info = MENUS.find(m => m.tecla === tecla);
  const datos = HERRAMIENTAS[tecla];
  const cab = document.getElementById("cabecera-menu");
  cab.style.background = info.color;
  let html = `<h1>${tecla} · ${info.nombre}</h1><p>${datos.descripcion}</p>`;
  if (datos.glosario) {
    html += `<details class="glosario"><summary>📖 Términos que vas a ver</summary><dl>` +
      datos.glosario.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("") + `</dl></details>`;
  }
  cab.innerHTML = html;
  document.getElementById("buscador").value = "";
  pintarHerramientas("");
  irA("herramientas");
}

function pintarHerramientas(filtro) {
  const datos = HERRAMIENTAS[menuActual];
  const color = MENUS.find(m => m.tecla === menuActual).color;
  const texto = filtro.trim().toLowerCase();
  const cont = document.getElementById("lista-herramientas");
  let html = "";
  datos.grupos.forEach((g, gi) => {
    const visibles = g.herramientas
      .map((h, hi) => ({ h, hi }))
      .filter(({ h }) => (h.nombre + " " + (h.manual || "") + " " + (h.atajo || "")).toLowerCase().includes(texto));
    if (!visibles.length) return;
    html += `<div class="grupo"><h2>${g.nombre}</h2><div class="rejilla">` +
      visibles.map(({ h, hi }) =>
        `<button class="btn-herramienta ${h.pendiente ? "pendiente" : ""}" style="background:${color}" data-g="${gi}" data-h="${hi}">
           ${h.nombre}${h.atajo ? `<span class="mini-atajo">${h.atajo}</span>` : ""}
         </button>`).join("") + `</div></div>`;
  });
  cont.innerHTML = html || `<p class="sin-resultados">No se encontró ninguna herramienta.</p>`;
  cont.querySelectorAll(".btn-herramienta").forEach(b =>
    b.addEventListener("click", () => abrirDetalle(menuActual, +b.dataset.g, +b.dataset.h)));
}
document.getElementById("buscador").addEventListener("input", e => pintarHerramientas(e.target.value));

/* ---------- Ficha de una herramienta ---------- */
function abrirDetalle(menu, gi, hi) {
  const grupo = HERRAMIENTAS[menu].grupos[gi];
  const h = grupo.herramientas[hi];
  let html = `<div class="detalle-grupo">${menu} · ${grupo.nombre}</div>
              <h2>${h.nombre}</h2>`;
  if (h.atajo)  html += `<span class="atajo">⌨ Atajo: <kbd>${h.atajo}</kbd></span>`;
  if (h.manual) html += `<p class="en-manual">También se llama: <em>${h.manual}</em></p>`;
  html += `<div class="video-caja">${bloqueVideo(menu, h.nombre)}</div>`;
  html += `<h3>¿Para qué sirve?</h3><p>${h.sirve}</p>`;
  if (h.lista)  html += `<ul>${h.lista.map(x => `<li>${x}</li>`).join("")}</ul>`;
  if (h.pasos)  html += `<h3>¿Cómo se usa?</h3><ol class="pasos">${h.pasos.map(p => `<li>${p}</li>`).join("")}</ol>`;
  if (h.teclas) html += `<h3>Teclas útiles</h3><div class="tabla-scroll"><table class="teclas">` +
                  h.teclas.map(([k, d]) => `<tr><td><kbd>${k}</kbd></td><td>${d}</td></tr>`).join("") + `</table></div>`;
  if (h.nota)   html += `<div class="consejo"><strong>💡 Ojo:</strong> ${h.nota}</div>`;
  if (h.pendiente) html += `<span class="aviso-provisional">Información pendiente – se agregará pronto</span>`;
  document.getElementById("detalle-contenido").innerHTML = html;
  document.getElementById("detalle").classList.remove("oculto");

  // Registro de avance: ficha abierta y video visto
  registrarFicha(menu, h.nombre);
  const video = document.querySelector("#detalle-contenido video");
  if (video) video.addEventListener("play", () => registrarVideo(menu, h.nombre), { once: true });
  const enlace = document.querySelector("#detalle-contenido .video-enlace");
  if (enlace) enlace.addEventListener("click", () => registrarVideo(menu, h.nombre), { once: true });
}
function cerrarDetalle() {
  document.querySelectorAll("#detalle video").forEach(v => v.pause());
  document.getElementById("detalle").classList.add("oculto");
}
document.querySelector(".detalle-cerrar").addEventListener("click", cerrarDetalle);
document.getElementById("detalle").addEventListener("click", e => { if (e.target.id === "detalle") cerrarDetalle(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarDetalle(); cerrarLateral(); } });

/* ---------- Sección de videos ---------- */
alEntrar.videos = function () {
  const cont = document.getElementById("lista-videos");
  let html = "";
  Object.keys(HERRAMIENTAS).forEach(menu => {
    const color = MENUS.find(m => m.tecla === menu).color;
    HERRAMIENTAS[menu].grupos.forEach((g, gi) => {
      html += `<div class="grupo"><h2>${menu} · ${g.nombre}</h2><div class="lista-video">`;
      g.herramientas.forEach((h, hi) => {
        const tiene = !!((VIDEOS[menu] || {})[h.nombre]);
        html += `<button class="fila-video" data-menu="${menu}" data-g="${gi}" data-h="${hi}">
                   <span class="punto-color" style="background:${color}"></span>
                   <span class="fila-nombre">${h.nombre}</span>
                   <span class="estado ${tiene ? "ok" : ""}">${tiene ? "▶ Ver video" : "Próximamente"}</span>
                 </button>`;
      });
      html += `</div></div>`;
    });
  });
  cont.innerHTML = html;
  cont.querySelectorAll(".fila-video").forEach(b =>
    b.addEventListener("click", () => abrirDetalle(b.dataset.menu, +b.dataset.g, +b.dataset.h)));
};

/* ---------- Configuración ---------- */
document.getElementById("btn-reiniciar").addEventListener("click", () => {
  guardarPuntos(0);
  document.getElementById("msg-reinicio").hidden = false;
});

/* ---------- Utilidades compartidas ---------- */
function mezclar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function todasLasHerramientas(menu) {
  return HERRAMIENTAS[menu].grupos.flatMap(g => g.herramientas.map(h => ({ ...h, grupo: g.nombre })));
}

pintarMenus();
pintarPuntos();
iniciarCuenta();

/* Abrir una sección directo desde el enlace, ej. xilovha.vercel.app/#actividades */
window.addEventListener("load", () => {
  const h = location.hash.slice(1);
  if (h && h !== "inicio" && document.getElementById("pantalla-" + h)) irA(h);
});
