/* =====================================================================
   ACTIVIDADES / JUEGOS DEL F1
   ---------------------------------------------------------------------
   Las preguntas se generan solas a partir de js/datos.js, así que al
   completar más herramientas los juegos crecen automáticamente.
   ===================================================================== */

const JUEGOS = {
  quien:  { titulo: "¿Qué herramienta es?", rondas: 8, premio: 10 },
  atajos: { titulo: "Atajo correcto",       rondas: 6, premio: 10 },
  pasos:  { titulo: "Ordena los pasos",     rondas: 5, premio: 15 }
};

let partida = null;

document.querySelectorAll(".juego-card").forEach(b =>
  b.addEventListener("click", () => iniciarJuego(b.dataset.juego)));

function iniciarJuego(tipo) {
  const pool = todasLasHerramientas("F1").filter(h => !h.pendiente);
  let preguntas;
  if (tipo === "quien")  preguntas = mezclar(pool);
  if (tipo === "atajos") preguntas = mezclar(pool.filter(h => h.atajo));
  if (tipo === "pasos")  preguntas = mezclar(pool.filter(h => h.pasos && h.pasos.length >= 3));
  partida = { tipo, pool, preguntas: preguntas.slice(0, JUEGOS[tipo].rondas), i: 0, aciertos: 0, ganados: 0 };
  document.getElementById("juego-titulo").textContent = JUEGOS[tipo].titulo;
  irA("juego");
  mostrarPregunta();
}

function mostrarPregunta() {
  const p = partida;
  document.getElementById("juego-progreso").textContent = `${p.i + 1} de ${p.preguntas.length}`;
  const h = p.preguntas[p.i];
  if (p.tipo === "quien")  preguntaOpciones(ocultarNombre(h.sirve, h.nombre), h.nombre, p.pool.map(x => x.nombre), "Lee la descripción. ¿Qué herramienta es?");
  if (p.tipo === "atajos") preguntaOpciones(`<span class="pregunta-grande">${h.nombre}</span>`, h.atajo, p.pool.filter(x => x.atajo).map(x => x.atajo), "¿Cuál es su atajo de teclado?");
  if (p.tipo === "pasos")  preguntaPasos(h);
}

function ocultarNombre(texto, nombre) {
  return texto.split(nombre).join("_____");
}

/* ---- Pregunta de opción múltiple ---- */
function preguntaOpciones(enunciado, correcta, todas, instruccion) {
  const distractores = mezclar([...new Set(todas)].filter(x => x !== correcta)).slice(0, 3);
  const opciones = mezclar([correcta, ...distractores]);
  const area = document.getElementById("juego-area");
  area.innerHTML = `
    <p class="instruccion">${instruccion}</p>
    <div class="tarjeta-pregunta">${enunciado}</div>
    <div class="opciones">${opciones.map(o => `<button class="opcion" data-v="${o}">${o}</button>`).join("")}</div>
    <div id="retro"></div>`;
  area.querySelectorAll(".opcion").forEach(b => b.addEventListener("click", () => {
    const ok = b.dataset.v === correcta;
    area.querySelectorAll(".opcion").forEach(x => {
      x.disabled = true;
      if (x.dataset.v === correcta) x.classList.add("correcta");
    });
    if (!ok) b.classList.add("incorrecta");
    responder(ok, ok ? "¡Correcto!" : `La respuesta era: <b>${correcta}</b>`);
  }));
}

/* ---- Ordenar pasos ---- */
function preguntaPasos(h) {
  const desordenados = mezclar(h.pasos.map((t, i) => ({ t, i })));
  const elegidos = [];
  const area = document.getElementById("juego-area");
  area.innerHTML = `
    <p class="instruccion">Toca los pasos en orden para usar:</p>
    <div class="tarjeta-pregunta"><span class="pregunta-grande">${h.nombre}</span></div>
    <ol id="orden-elegido" class="orden-elegido"></ol>
    <div class="opciones columna">${desordenados.map(p => `<button class="opcion paso" data-i="${p.i}">${p.t}</button>`).join("")}</div>
    <button id="btn-deshacer" class="btn-secundario">Deshacer último</button>
    <div id="retro"></div>`;
  const lista = document.getElementById("orden-elegido");

  function pintar() {
    lista.innerHTML = elegidos.map(i => `<li>${h.pasos[i]}</li>`).join("");
    area.querySelectorAll(".paso").forEach(b => b.hidden = elegidos.includes(+b.dataset.i));
  }
  area.querySelectorAll(".paso").forEach(b => b.addEventListener("click", () => {
    elegidos.push(+b.dataset.i);
    pintar();
    if (elegidos.length === h.pasos.length) {
      const ok = elegidos.every((v, idx) => v === idx);
      document.getElementById("btn-deshacer").hidden = true;
      lista.classList.add(ok ? "bien" : "mal");
      responder(ok, ok ? "¡Orden perfecto!" :
        `El orden correcto es:<ol>${h.pasos.map(t => `<li>${t}</li>`).join("")}</ol>`);
    }
  }));
  document.getElementById("btn-deshacer").addEventListener("click", () => { elegidos.pop(); pintar(); });
}

/* ---- Resultado de cada ronda ---- */
function responder(ok, mensaje) {
  const premio = JUEGOS[partida.tipo].premio;
  if (ok) { partida.aciertos++; partida.ganados += premio; sumarPuntos(premio); }
  const ultima = partida.i === partida.preguntas.length - 1;
  document.getElementById("retro").innerHTML = `
    <div class="retro ${ok ? "ok" : "no"}">
      <div>${ok ? `✅ ${mensaje} <b>+${premio} ⭐</b>` : `❌ ${mensaje}`}</div>
      <button id="btn-siguiente" class="btn-principal">${ultima ? "Ver resultado" : "Siguiente"}</button>
    </div>`;
  document.getElementById("btn-siguiente").addEventListener("click", () => {
    if (ultima) return finJuego();
    partida.i++;
    mostrarPregunta();
  });
}

function finJuego() {
  const p = partida;
  const total = p.preguntas.length;
  const estrellas = p.aciertos === total ? "🌟🌟🌟" : p.aciertos >= total / 2 ? "🌟🌟" : "🌟";
  document.getElementById("juego-progreso").textContent = "";
  document.getElementById("juego-area").innerHTML = `
    <div class="fin-juego">
      <div class="fin-estrellas">${estrellas}</div>
      <h2>${p.aciertos} de ${total} correctas</h2>
      <p>Ganaste <b>${p.ganados} ⭐</b>. Úsalos en <b>Mi modelo</b> para desbloquear ropa.</p>
      <div class="fin-botones">
        <button class="btn-principal" id="btn-otra">Jugar otra vez</button>
        <button class="btn-secundario" data-ir="vestidor">Ir a Mi modelo</button>
        <button class="btn-secundario" data-ir="actividades">Otras actividades</button>
      </div>
    </div>`;
  document.getElementById("btn-otra").addEventListener("click", () => iniciarJuego(p.tipo));
}
