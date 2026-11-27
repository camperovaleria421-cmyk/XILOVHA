/* =====================================================================
   TEXTOS EDITADOS DESDE EL PANEL DE ADMINISTRACIÓN
   ---------------------------------------------------------------------
   El texto original de cada menú está en js/datos.js. Si la
   administradora lo cambia en admin.html (pestaña «Funciones»), se guarda
   en Supabase (tabla xilovha_contenido) y aquí se pone encima del original.
   Sin internet se usa la última versión descargada; si nunca se ha
   descargado nada, se usa el texto original.
   ===================================================================== */

const Contenido = (() => {
  const CACHE = "xilovha-contenido";
  const original = JSON.parse(JSON.stringify(HERRAMIENTAS));
  const copia = o => JSON.parse(JSON.stringify(o));

  // Revisa que lo guardado tenga la forma correcta, para que nunca rompa la app
  function valido(d) {
    return d && typeof d === "object" && typeof d.descripcion === "string" && Array.isArray(d.grupos) &&
      d.grupos.every(g => g && typeof g.nombre === "string" && Array.isArray(g.herramientas) &&
        g.herramientas.every(h => h && typeof h.nombre === "string" && h.nombre.trim() && typeof h.sirve === "string"));
  }

  // filas = [{ menu: "F1", datos: {...} }, ...]. Los menús sin fila vuelven al original.
  function aplicar(filas) {
    const editados = {};
    (filas || []).forEach(f => { if (f && original[f.menu] && valido(f.datos)) editados[f.menu] = f.datos; });
    Object.keys(original).forEach(menu => {
      const nuevo = copia(editados[menu] || original[menu]);
      const destino = HERRAMIENTAS[menu];
      Object.keys(destino).forEach(k => delete destino[k]);
      Object.assign(destino, nuevo);
    });
  }

  function leerCache() { try { return JSON.parse(localStorage.getItem(CACHE)) || null; } catch (e) { return null; } }
  function guardarCache(filas) { try { localStorage.setItem(CACHE, JSON.stringify(filas)); } catch (e) {} }

  // Descarga la versión más nueva; devuelve true si cambió algo
  async function descargar(url, clave) {
    const r = await fetch(`${url}/rest/v1/xilovha_contenido?select=menu,datos`, { headers: { apikey: clave } });
    if (!r.ok) return false;
    const filas = await r.json();
    const antes = JSON.stringify(leerCache() || []);
    guardarCache(filas);
    aplicar(filas);
    return JSON.stringify(filas) !== antes;
  }

  // Al cargar: primero lo guardado en este dispositivo (instantáneo)
  const cache = leerCache();
  if (cache) aplicar(cache);

  return { original, aplicar, descargar, valido, copia };
})();

/* En la app (no en el admin): al terminar de cargar, baja la versión más nueva y repinta */
window.addEventListener("load", async () => {
  if (typeof pintarMenus !== "function" || typeof SUPABASE_URL === "undefined") return;
  try {
    if (!(await Contenido.descargar(SUPABASE_URL, SUPABASE_KEY))) return;
    pintarMenus();
    if (typeof CONSEJOS !== "undefined") {
      CONSEJOS.splice(0, CONSEJOS.length, ...Object.keys(HERRAMIENTAS).flatMap(menu =>
        HERRAMIENTAS[menu].grupos.flatMap(g => g.herramientas
          .filter(h => h.nota && !h.pendiente)
          .map(h => ({ menu, nombre: h.nombre, nota: h.nota })))));
      pintarConsejo();
    }
    // Si la lista de herramientas está abierta, se vuelve a pintar con el texto nuevo
    const lista = document.getElementById("pantalla-herramientas");
    if (menuActual && lista && lista.classList.contains("activa")) pintarHerramientas(document.getElementById("buscador").value || "");
  } catch (e) { console.warn("No se pudieron descargar los textos editados", e); }
});
