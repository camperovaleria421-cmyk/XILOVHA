/* =====================================================================
   VIDEOS DE CADA HERRAMIENTA
   ---------------------------------------------------------------------
   Para agregar un video:
     1. Guarda el archivo .mp4 en la carpeta  videos/
     2. Escribe aquí su ruta, por ejemplo:
          "Deslizante": "videos/f1-deslizante.mp4",
   Si lo dejas vacío ("") la app muestra "Video próximamente".

   Si el video está en YouTube, pon el enlace completo
   (https://youtu.be/...). La app mostrará un botón para abrirlo.
   ===================================================================== */

const VIDEOS = {
  Inicio: {
    // ---- Antes de empezar ----
    "Creación de carpeta": "videos/inicio-carpeta-v2.mp4",
    "Modelos y trazos": "videos/inicio-modelos-trazos-v2.mp4",
    "Creación de hoja": "videos/inicio-hoja-v2.mp4",
    "Visualizar cartucho": "videos/inicio-cartucho-v2.mp4"
  },
  F1: {
    // ---- Puntos ----
    "Deslizante": "",
    "Pto. Constante": "",
    "Serie de puntos constantes": "",
    "Desplazado": "",
    "Punto Enlace": "",
    "Relativo": "",
    "Intersección": "",
    "Añadir punto": "",
    "Taladro": "",
    "Ali 2Pts": "",
    "Ali 3Pts": "",
    "División": "",
    // ---- Líneas ----
    "L. Recta": "",
    "Paralelo": "",
    "Oblicuo": "",
    "Bézier": "",
    "Semi-circ.": "",
    "Trazar": "",
    "Eje": "",
    "Simetría": "",
    "Eje rot.": "",
    "Pivotar": "",
    "Duplicar": "",
    "División segmento": "",
    "Digit.": "",
    "Enl. dig.": ""
  },
  F2: {
    // ---- Piquetes ----
    "Piquete": "",
    "Orientación": "",
    "Forzar proyección": "",
    "Bisectriz": "",
    "Perpendicular": "",
    "Piquete exterior": "",
    "Marcaje": "",
    "Marca DF TR": "",
    // ---- Orientación ----
    "Sym x": "",
    "Sym y": "",
    "Rotar hoja": "",
    "Rotación 2 puntos": "",
    // ---- Fig. Geométrica ----
    "Rectángulo": "",
    "Círculo": "",
    "Óvalo": "",
    "Arco_f": "",
    "Arco_r": "",
    "Tang. 2 círculos": ""
  },
  F3: {
    // ---- Modificación de línea ----
    "Desplazar": "",
    "Estirar": "",
    "Alargar": "",
    "Ajustar 2 líneas": "",
    "Al. Línea": "",
    "Retiro": "",
    "Simplificado": "",
    // ---- Modificación de punto ----
    "Modificar": "",
    "Sección": "",
    "Fusión curvas": "",
    "Unido": "",
    "Separado": "",
    "Insertar punto": "",
    "Suprimir restricción": "",
    "Supresión": "",
    // ---- Asociar a medidas ----
    "Asociar": "",
    "Asociar a medida": "",
    "Restricción por medida": "",
    // ---- Chinchetas ----
    "Chincheta": "",
    "Ch. Pts. Escalado": "",
    "Ch. Pts. Caract.": "",
    "Ch. Extremidad": "",
    "Quit. Ch.": ""
  }
};

/* Devuelve el HTML del bloque de video de una herramienta */
function bloqueVideo(menu, nombre) {
  const src = (VIDEOS[menu] || {})[nombre] || "";
  if (!src) {
    return `<div class="video-vacio"><span>🎬</span><p><b>Video próximamente</b><br>Aquí irá el video de «${nombre}».</p></div>`;
  }
  if (/^https?:\/\//.test(src)) {
    return `<a class="video-enlace" href="${src}" target="_blank" rel="noopener">▶ Ver video de «${nombre}»</a>`;
  }
  return `<video class="video" src="${src}" controls preload="metadata" playsinline></video>`;
}
