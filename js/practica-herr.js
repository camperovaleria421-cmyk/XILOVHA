/* =====================================================================
   PRACTICAR CADA HERRAMIENTA (botón «🎯 Practicar en pantalla» en la ficha)
   ---------------------------------------------------------------------
   Usa la misma pantalla de Modaris que la práctica de la falda.
   Cada práctica tiene: una escena (lo que ya está dibujado en la hoja),
   una tarea, los pasos que hay que hacer y el resultado que se dibuja.
   Para agregar otra herramienta basta con escribir su práctica en
   PRACTICAS_HERR (abajo).
   ===================================================================== */

const PH_VISTA = [-2, -2, 26, 21];   // parte de la hoja que se ve (cm)

/* Escenas base: lo que ya está dibujado al empezar (cm, «y» crece hacia abajo) */
const PH_ESCENAS = {
  vacia:      {},
  sinHoja:    { hoja: false },
  punto:      { P: { A: [3, 3] } },
  linea:      { P: { A: [2, 9], B: [20, 9] }, L: [["A", "B"]] },
  lineaCorta: { P: { A: [2, 9], B: [13, 9] }, L: [["A", "B"]] },
  rect:       { P: { A: [3, 2], B: [19, 2], C: [19, 16], D: [3, 16] }, L: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]] },
  cruz:       { P: { A: [2, 8], B: [20, 8], C: [11, 1], D: [11, 16] }, L: [["A", "B"], ["C", "D"]] },
  curva:      { P: { A: [2, 13], B: [20, 13] }, C: [{ id: "cv", pts: ["A", [6.5, 5.5], [15.5, 5.5], "B"] }] },
  quiebre:    { P: { A: [2, 13], B: [11, 4], C: [20, 13] }, L: [["A", "B"], ["B", "C"]] }
};

/* Ayudantes para escribir los pasos */
const phC   = (ids, t, dib) => ({ tipo: "clic", ids: [].concat(ids), t, dib });
const phV   = (campos, t, dib) => ({ tipo: "valores", campos: campos.map(([n, v, alt]) => ({ n, v, alt })), t: t || "Escribe los valores y presiona Enter", dib });
const phTxt = (n, t, dib) => ({ tipo: "valores", campos: [{ n, texto: true }], t, dib });
const phEsp = (t, dib) => ({ tipo: "espacio", t: t || "Presiona Espacio", dib });
const phB3  = (t, dib) => ({ tipo: "boton3", t: t || "Botón 3 del ratón para terminar", dib });
const phOp  = (ops, ok, t, dib) => ({ tipo: "opcion", ops, ok, t, dib });
const phBar = (m, it, t, dib) => ({ tipo: "barra", m, it, t, dib });
const RECT_PTS = ["A", "B", "C", "D"];

const PRACTICAS_HERR = {
  F1: {
    /* ---------- Puntos ---------- */
    "Deslizante": { escena: "linea", extra: { M: { m1: [8, 9, "①"] } },
      tarea: "Pon un punto deslizante sobre la línea A–B, justo en la marca ①.",
      pasos: [phC(["A-B", "m1"], "Clic sobre la línea (en Modaris lo mantienes presionado)"),
              phC("m1", "Desliza el punto por la línea y haz clic donde lo quieras fijar")],
      fin: { P: { P1: [8, 9] }, txt: "El punto quedó sobre la línea y conserva su proporción si la línea cambia." } },
    "Pto. Constante": { escena: "linea",
      tarea: "Pon un punto sobre la línea A–B, a 6 cm del punto A.",
      pasos: [phC("A", "Clic en el punto de referencia de la línea"),
              phV([["Longitud", 6]], "Escribe la longitud y presiona Enter")],
      fin: { P: { P1: [8, 9] }, txt: "El punto P1 queda siempre a 6 cm de A, aunque la línea cambie." } },
    "Punto Enlace": { escena: "rect",
      tarea: "Crea un punto amarrado al punto C, 3 cm a su derecha (dx = 3, dy = 0).",
      pasos: [phC("C", "Clic en el punto de referencia"),
              phV([["dx", 3], ["dy", 0]], "Escribe los valores y presiona Enter"),
              phC("*", "Haz clic para validar")],
      fin: { P: { P1: [22, 16] }, L: [["C", "P1", "g"]], txt: "Si C se mueve, P1 lo sigue." } },
    "Relativo": { escena: "rect",
      tarea: "Crea un punto 5 cm abajo del punto A (dx = 0, dy = −5).",
      pasos: [phC("A", "Clic en un punto de referencia"),
              phV([["dx", 0], ["dy", -5]], "Escribe dx y dy y presiona Enter (para el «−» usa el botón +/−)"),
              phC("*", "Haz clic para validar")],
      fin: { P: { P1: [3, 7] }, txt: "En Modaris «y» negativa es hacia abajo. P1 ya no depende de A." } },
    "Intersección": { escena: "cruz", extra: { M: { X: [11, 8, null] } },
      tarea: "Crea un punto donde se cruzan las dos líneas.",
      pasos: [phC("X", "Haz clic justo en el cruce de las dos líneas")],
      fin: { P: { I: [11, 8] }, txt: "El punto I quedó en el cruce." } },
    "Añadir punto": { escena: "linea", extra: { M: { m1: [12, 9, "①"] } },
      tarea: "Agrega un punto sobre la línea A–B, a 10 cm del punto A.",
      pasos: [phC("A", "Clic en el punto de referencia"),
              phV([["Longitud", 10]], "Escribe la longitud y presiona Enter"),
              phC(["m1", "A-B"], "Coloca el punto sobre la línea y haz clic (marca ①)")],
      fin: { P: { P1: [12, 9] }, txt: "Sin teclas es un punto característico (esquina); con Shift sería punto de curva." } },
    "Ali 2Pts": { escena: "vacia", extra: { P: { A: [4, 13], B: [17, 5] } },
      tarea: "Alinea el punto B en horizontal con el punto A.",
      pasos: [phC("A", "Clic en el punto de referencia"),
              phEsp("Presiona Espacio para cambiar a horizontal"),
              phC("B", "Clic en el punto que quieres alinear")],
      fin: { mover: { B: [17, 13] }, L: [["A", "B", "g"]], txt: "B bajó a la misma altura que A." } },
    "Ali 3Pts": { escena: "vacia", extra: { P: { A: [3, 14], B: [19, 4], C: [14, 13] }, L: [["A", "B", "g"]] },
      tarea: "Alinea el punto C sobre el eje que forman A y B.",
      pasos: [phC("A", "Clic en el 1.er punto del eje"), phC("B", "Clic en el 2.º punto del eje"),
              phC("C", "Clic en el punto que quieres alinear")],
      fin: { mover: { C: [11.36, 8.78] }, txt: "C cayó en perpendicular sobre el eje A–B." } },
    "División": { escena: "vacia", extra: { P: { A: [3, 9], B: [19, 9] } },
      tarea: "Reparte puntos entre A y B dividiendo la distancia en 4 partes iguales.",
      pasos: [phC("A", "Clic en el 1.er punto"), phC("B", "Clic en el 2.º punto"),
              phV([["Divisiones", 4]], "Escribe el número de divisiones y presiona Enter")],
      fin: { P: { P1: [7, 9], P2: [11, 9], P3: [15, 9] }, txt: "4 divisiones = 3 puntos nuevos." } },

    /* ---------- Líneas ---------- */
    "L. Recta": { escena: "punto",
      tarea: "Traza una línea desde el punto A, de 12 cm, hacia abajo (rotación −90).",
      pasos: [phC("A", "Clic en el punto inicial"),
              phV([["dl", 12], ["Rotación", -90, [270]]], "Escribe dl y la rotación y presiona Enter (para el «−» usa +/−)")],
      fin: { P: { B: [3, 15] }, L: [["A", "B", "n"]], txt: "Hacia abajo es −90° (o 270°)." } },
    "Paralelo": { escena: "vacia", extra: { P: { A: [2, 4], B: [20, 4] }, L: [["A", "B"]] },
      tarea: "Traza una paralela a la línea A–B, a 6 cm de distancia.",
      pasos: [phC("A-B", "Clic en la línea de referencia"),
              phV([["Distancia", 6]], "Escribe la distancia y presiona Enter")],
      fin: { P: { A2: [2, 10], B2: [20, 10] }, L: [["A2", "B2", "n"]], txt: "La paralela quedó a 6 cm." } },
    "Bézier": { escena: "vacia", extra: { M: { m1: [3, 14, "①"], m2: [11, 5, "②"], m3: [20, 14, "③"] } },
      tarea: "Traza una curva que pase por las marcas ①, ② y ③, y termínala.",
      pasos: [phC("m1", "Clic para poner el punto inicial", { P: { P1: [3, 14] } }),
              phC("m2", "Sigue haciendo clic para los demás puntos", { P: { P2: [11, 5] } }),
              phC("m3", "Clic en el siguiente punto", { P: { P3: [20, 14] } }),
              phB3("Botón 3 del ratón para terminar la curva")],
      fin: { C: [{ id: "n1", pts: ["P1", "P2", "P3"], n: true }], txt: "La curva pasa por los 3 puntos." } },
    "Semi-circ.": { escena: "vacia", extra: { M: { m1: [4, 13, "①"], m2: [11, 6, "②"], m3: [18, 13, "③"] } },
      tarea: "Traza un arco: inicio en ①, curvatura en ② y cierre en ③. Luego termina.",
      pasos: [phC("m1", "Clic en el punto inicial", { P: { P1: [4, 13] } }),
              phC("m2", "Clic en el 2.º punto (da la curvatura)", { P: { P2: [11, 6] } }),
              phC("m3", "Clic en el 3.er punto para cerrar el arco", { P: { P3: [18, 13] } }),
              phB3()],
      fin: { C: [{ id: "n1", pts: ["P1", "P2", "P3"], n: true }], txt: "El arco quedó trazado de 3 en 3 puntos." } },
    "Eje": { escena: "vacia", extra: { P: { A: [11, 1], B: [11, 17] } },
      tarea: "Crea un eje entre los puntos A y B.",
      pasos: [phC("A", "Clic en el 1.er punto del eje"), phC("B", "Clic en el 2.º punto del eje")],
      fin: { L: [["A", "B", "g"]], txt: "El eje sirve, por ejemplo, para hacer simetrías." } },
    "Simetría": { escena: "vacia", extra: { P: { E1: [11, 1], E2: [11, 17], A: [4, 4], B: [8, 13] }, L: [["E1", "E2", "g"], ["A", "B"]] },
      tarea: "Refleja la línea A–B del otro lado del eje.",
      pasos: [phC("E1-E2", "Clic en el eje"), phC("A-B", "Clic en el objeto a reflejar")],
      fin: { P: { A2: [18, 4], B2: [14, 13] }, L: [["A2", "B2", "n"]], txt: "La copia en espejo quedó del otro lado del eje." } },
    "Duplicar": { escena: "vacia", extra: { P: { A: [3, 5], B: [8, 13] }, L: [["A", "B"]] },
      tarea: "Haz una copia de la línea A–B, 10 cm a la derecha (Desfase X = 10, Desfase Y = 0).",
      pasos: [phC("A-B", "Clic en el objeto a copiar"),
              phV([["Desfase X", 10], ["Desfase Y", 0]], "Escribe el desfase y presiona Enter"),
              phC("*", "Clic para soltar la copia")],
      fin: { P: { A2: [13, 5], B2: [18, 13] }, L: [["A2", "B2", "n"]], txt: "La copia quedó 10 cm a la derecha." } },
    "División segmento": { escena: "curva",
      tarea: "Divide la curva entre A y B en 3 partes iguales, siguiendo su forma.",
      pasos: [phC("A", "Clic en el 1.er punto de la línea"),
              phC("B", "Clic en el 2.º punto y mantén presionado (se resalta el tramo)"),
              phEsp("Espacio para elegir el tramo correcto; suelta"),
              phV([["Divisiones", 3]], "Escribe el número de divisiones y presiona Enter")],
      fin: { P: { P1: [7.6, 7.2], P2: [14.4, 7.2] }, txt: "Los puntos siguen la forma de la curva." } }
  },

  F2: {
    /* ---------- Piquetes ---------- */
    "Piquete": { escena: "rect", extra: { M: { m1: [11, 2, "①"] } },
      tarea: "Pon un piquete en la línea de arriba, en la marca ①.",
      pasos: [phC(["m1", "A-B"], "Haz clic en la línea donde va el piquete")],
      fin: { piq: { N: { en: [11, 2], dir: [0, 1] } }, txt: "El piquete quedó en la línea A–B." } },
    "Orientación": { escena: "rect", extra: { P: { E: [15, 11] }, piq: { N: { en: [11, 2], dir: [0, 1] } } },
      tarea: "Orienta el piquete N para que apunte hacia el punto E.",
      pasos: [phC("N", "Haz clic en el piquete: aparece una línea que gira libre"),
              phC("E", "Haz clic en un punto para que apunte hacia él")],
      fin: { piq: { N: { en: [11, 2], dir: [0.42, 0.91] } }, txt: "El piquete N ahora apunta hacia E." } },
    "Forzar proyección": { escena: "rect", extra: { piq: { N: { en: [11, 2], dir: [0, 1] } } },
      tarea: "Pasa el piquete N al otro lado de la línea.",
      pasos: [phC("N", "Haz clic en el piquete y mantén presionado"),
              phEsp("Presiona Espacio para cambiar de lado"),
              phC("*", "Suelta el botón (haz clic) cuando esté en el lado correcto")],
      fin: { piq: { N: { en: [11, 2], dir: [0, -1] } }, txt: "El piquete quedó del otro lado." } },
    "Bisectriz": { escena: "rect", extra: { piq: { B: { en: [19, 2], dir: [0, 1] } }, M: { m1: [16.5, 4.5, "①"] } },
      tarea: "Pon el piquete de la esquina B en bisectriz (que divida el ángulo a la mitad, hacia adentro).",
      pasos: [phC("B", "Haz clic en el piquete y mantén presionado"),
              phC("m1", "Lleva el cursor al lado del ángulo que quieres (marca ①) y suelta")],
      fin: { piq: { B: { en: [19, 2], dir: [-0.71, 0.71] } }, txt: "El piquete divide la esquina a la mitad." } },
    "Perpendicular": { escena: "rect", extra: { piq: { N: { en: [11, 2], dir: [0.7, 0.7] } }, M: { m1: [11, 5, "①"] } },
      tarea: "Deja el piquete N perpendicular a la línea, hacia adentro de la pieza.",
      pasos: [phC("N", "Haz clic en el piquete y mantén presionado"),
              phC("m1", "Lleva el cursor hacia el lado que quieres (marca ①) y suelta")],
      fin: { piq: { N: { en: [11, 2], dir: [0, 1] } }, txt: "El piquete quedó a 90° de la línea." } },
    "Piquete exterior": { escena: "rect", extra: { piq: { N: { en: [11, 2], dir: [0, 1] } } },
      tarea: "Convierte el piquete N en piquete exterior.",
      pasos: [phC("N", "Haz clic en el piquete")],
      fin: { piq: { N: { en: [11, 2], dir: [0, -1], ext: true } }, txt: "Se ve mejor con Visualizar › Parte recortada (Alt + F9)." } },
    "Marcaje": { escena: "rect", extra: { P: { P1: [11, 9] } },
      tarea: "Marca el punto P1 con un taladro.",
      pasos: [phOp(["Sin marcaje", "Taladro", "Punto motivo"], "Taladro", "Elige el tipo de marca (Parámetros asociados)"),
              phC("P1", "Haz clic en el punto que quieres marcar")],
      fin: { estilo: { P1: "m" }, txt: "El punto P1 quedó marcado." } },
    "Marca DF TR": { escena: "rect", extra: { P: { H1: [11, 4, "o"], H2: [11, 14, "o"] }, L: [["H1", "H2", "h"]] },
      tarea: "Pon la marca en el hilo recto de la pieza.",
      pasos: [phC("H1-H2", "Haz clic en el hilo recto o en el través")],
      fin: { P: { MK: [11, 9] }, estilo: { MK: "m" }, txt: "La marca quedó en el hilo recto." } },

    /* ---------- Orientación ---------- */
    "Sym x": { escena: "rect", extra: { P: { E: [7, 6] }, L: [["A", "E"]] },
      tarea: "Voltea todo lo de la hoja de arriba hacia abajo.",
      pasos: [],
      fin: { tf: "translate(0 18) scale(1 -1)", txt: "Todo se volteó respecto al eje X (arriba ↔ abajo)." } },
    "Sym y": { escena: "rect", extra: { P: { E: [7, 6] }, L: [["A", "E"]] },
      tarea: "Voltea todo lo de la hoja de izquierda a derecha.",
      pasos: [],
      fin: { tf: "translate(22 0) scale(-1 1)", txt: "Todo se volteó respecto al eje Y (izquierda ↔ derecha)." } },
    "Rotar hoja": { escena: "rect", extra: { P: { E: [7, 6] }, L: [["A", "E"]] },
      tarea: "Gira todo lo de la hoja 90° (contra las manecillas del reloj).",
      pasos: [phOp(["30°", "45°", "90°", "180°", "-90°", "-45°", "-30°"], "90°", "Activa el botón del ángulo que quieres")],
      fin: { tf: "rotate(-90 11 9)", txt: "Los ángulos positivos giran contra las manecillas del reloj." } },
    "Rotación 2 puntos": { escena: "vacia", extra: { P: { A: [3, 14], B: [18, 6], C: [8, 4] }, L: [["A", "B"], ["B", "C"], ["C", "A"]] },
      tarea: "Gira la hoja para que A y B queden en la misma línea horizontal.",
      pasos: [phC("A", "Clic en el 1.er punto (es el centro del giro)"),
              phC("B", "Clic en el 2.º punto: queda alineado en horizontal con el primero")],
      fin: { tf: "rotate(28.07 3 14)", txt: "A–B ahora está en horizontal." } },

    /* ---------- Fig. Geométrica ---------- */
    "Rectángulo": { escena: "vacia",
      tarea: "Crea un rectángulo de 14 cm de ancho por 10 cm de alto.",
      pasos: [phC("*", "Clic en el punto de inicio"),
              phV([["Ancho", 14], ["Altura", 10], ["Rotación", 0, [360]]], "Escribe las medidas y presiona Enter")],
      fin: { P: { A: [4, 3], B: [18, 3], C: [18, 13], D: [4, 13] }, L: [["A", "B", "n"], ["B", "C", "n"], ["C", "D", "n"], ["D", "A", "n"]], txt: "Un punto en cada esquina." } },
    "Círculo": { escena: "vacia",
      tarea: "Crea un círculo de 8 cm de diámetro.",
      pasos: [phC("*", "Clic en el centro"), phV([["Diámetro", 8]], "Escribe el diámetro y presiona Enter")],
      fin: { ci: [[11, 9, 4]], P: { O: [11, 9], P1: [7, 9], P2: [15, 9], P3: [11, 5, "o"], P4: [11, 13, "o"] }, txt: "Crea 5 puntos: el centro, 2 extremos y 2 puntos de curva." } },
    "Óvalo": { escena: "vacia",
      tarea: "Crea un óvalo con 1.er radio 3, 2.º radio 2 y altura 6.",
      pasos: [phC("*", "Señala dónde empieza el óvalo"),
              phV([["1.er radio", 3], ["2.º radio", 2], ["Altura", 6]], "Escribe los valores y presiona Enter"),
              phC("*", "Estíralo, oriéntalo y haz clic para validar")],
      fin: { el: [[11, 9, 7, 3]], txt: "El óvalo sale de dos círculos y la altura." } },
    "Arco_f": { escena: "vacia", extra: { M: { m0: [4, 12, "①"], m1: [18, 12, "②"] } },
      tarea: "Traza un arco de ① a ② con una flecha de 3 cm.",
      pasos: [phC("m0", "Clic en el punto inicial", { P: { P1: [4, 12] } }),
              phV([["Flecha", 3]], "Escribe la flecha y presiona Enter"),
              phC("m1", "Orienta el arco, dale largo y haz clic")],
      fin: { P: { P2: [18, 12] }, C: [{ id: "n1", pts: ["P1", [11, 9], "P2"], n: true }], txt: "Flecha = altura del arco desde el centro de la cuerda." } },
    "Arco_r": { escena: "vacia", extra: { M: { m0: [4, 12, "①"], m1: [18, 12, "②"] } },
      tarea: "Traza un arco de ① a ② con radio de 8 cm.",
      pasos: [phC("m0", "Clic en el punto de salida", { P: { P1: [4, 12] } }),
              phV([["Radio", 8]], "Escribe el radio y presiona Enter"),
              phC("m1", "Orienta el arco y haz clic")],
      fin: { P: { P2: [18, 12] }, C: [{ id: "n1", pts: ["P1", [11, 7.9], "P2"], n: true }], txt: "El arco tiene radio de 8 cm." } },
    "Tang. 2 círculos": { escena: "vacia",
      tarea: "Traza dos círculos (radios 3 y 2) y elige la tangente de arriba.",
      pasos: [phV([["Radio 1", 3], ["Radio 2", 2]], "Escribe el radio de cada círculo y presiona Enter",
                  { ci: [[6, 9, 3], [17, 9, 2]], P: { T1: [6.3, 6.02, "o"], T2: [17.2, 7.01, "o"] }, L: [["T1", "T2", "g"]] }),
              phEsp("Presiona Espacio para ver cada tangente"),
              phC("T1-T2", "Haz clic en la tangente que quieres")],
      fin: { L: [["T1", "T2", "n"]], txt: "Hay 4 tangentes posibles; con Espacio las recorres." } }
  },

  F3: {
    /* ---------- Modificación de línea ---------- */
    "Desplazar": { escena: "rect",
      tarea: "Mueve el punto C 3 cm a la derecha (Desfase x = 3, Desfase y = 0).",
      pasos: [phC("C", "Haz clic en el punto a mover"), phV([["Desfase x", 3], ["Desfase y", 0]], "Escribe el desfase y presiona Enter")],
      fin: { mover: { C: [22, 16] }, txt: "C se movió y las líneas lo siguieron." } },
    "Estirar": { escena: "rect",
      tarea: "Estira la línea de arriba: A es el pivote y B se estira 4 cm a la derecha.",
      pasos: [phC("A", "Clic en el 1.er punto (el pivote, no se mueve)"), phC("B", "Clic en el 2.º punto (el que vas a estirar)"),
              phV([["Desfase x", 4], ["Desfase y", 0]], "Escribe los valores y presiona Enter")],
      fin: { mover: { B: [23, 2] }, txt: "B se estiró y A no se movió." } },
    "Alargar": { escena: "lineaCorta",
      tarea: "Alarga la línea A–B 5 cm más (dl = 5).",
      pasos: [phC("A", "Clic en el 1.er extremo de la curva"), phC("B", "Clic sostenido en el 2.º extremo"),
              phV([["dl", 5]], "Escribe lo que quieres agregar (dl) y presiona Enter")],
      fin: { mover: { B: [18, 9] }, txt: "La línea creció 5 cm por el extremo B." } },
    "Ajustar 2 líneas": { escena: "vacia", extra: { P: { A: [2, 5], B: [10, 5], C: [17, 1], D: [17, 16] }, L: [["A", "B"], ["C", "D"]] },
      tarea: "Alarga la línea A–B hasta que toque la línea C–D.",
      pasos: [phC("A-B", "Clic en la línea que quieres alargar o recortar"), phC("C-D", "Clic en la línea de referencia")],
      fin: { mover: { B: [17, 5] }, txt: "A–B llegó justo hasta C–D." } },
    "Al. Línea": { escena: "lineaCorta",
      tarea: "Alarga la línea por el extremo B: 6 cm (dl = 6).",
      pasos: [phC("A-B", "Clic en la línea, cerca del extremo que quieres alargar"),
              phV([["dl", 6]], "Escribe el dl y presiona Enter"), phC("*", "Haz clic para terminar")],
      fin: { mover: { B: [19, 9] }, txt: "La línea se alargó 6 cm." } },
    "Retiro": { escena: "rect",
      tarea: "Aplica a toda la pieza un retiro (encogimiento) de 2 % en x y 3 % en y.",
      pasos: [phC("*", "Para toda la pieza: clic en cualquier lugar de la hoja"),
              phV([["% en x", 2], ["% en y", 3]], "Escribe el porcentaje en x y en y y presiona Enter")],
      fin: { tf: "translate(11 9) scale(1.02 1.03) translate(-11 -9)", txt: "La pieza creció un poco para compensar que la tela encoge." } },
    "Simplificado": { escena: "vacia", extra: { P: { A: [2, 12], Q1: [6, 7], Q2: [9, 8.2], Q3: [12, 5], Q4: [16, 7.5], B: [20, 12] },
                                               C: [{ id: "cv", pts: ["A", "Q1", "Q2", "Q3", "Q4", "B"] }] },
      tarea: "Simplifica la curva con un desvío permitido de 0.5 cm.",
      pasos: [phC("cv", "Clic en la curva"), phV([["Desvío", 0.5]], "Escribe el desvío permitido y presiona Enter")],
      fin: { quitarC: ["cv"], quitarP: ["Q1", "Q2", "Q3", "Q4"], C: [{ id: "n1", pts: ["A", [8, 6], [14, 6], "B"], n: true }], txt: "La curva quedó más suave y con menos puntos." } },

    /* ---------- Modificación de punto ---------- */
    "Modificar": { escena: "rect",
      tarea: "Modifica el punto C: bájalo 2 cm (dx = 0, dy = −2).",
      pasos: [phC("C", "Clic en el objeto"), phV([["dx", 0], ["dy", -2]], "Escribe los valores y presiona Enter (para el «−» usa +/−)")],
      fin: { mover: { C: [19, 18] }, txt: "C bajó 2 cm." } },
    "Sección": { escena: "linea", extra: { P: { M: [11, 9] } },
      tarea: "Corta la línea A–B en el punto M.",
      pasos: [phC("M", "Clic en el punto donde quieres cortar")],
      fin: { quitarL: ["A-B"], L: [["A", "M", "n"], ["M", "B"]], txt: "Ahora son dos líneas: A–M y M–B." } },
    "Fusión curvas": { escena: "quiebre",
      tarea: "Une las dos líneas en una sola por su punto común B.",
      pasos: [phC("B", "Si son 2 líneas: clic en su punto común")],
      fin: { quitarL: ["A-B", "B-C"], L: [["A", "B", "n"], ["B", "C", "n"]], txt: "Las dos líneas ya son una sola." } },
    "Unido": { escena: "vacia", extra: { P: { A: [2, 12], B: [10, 6], C: [12, 7], D: [20, 12] }, L: [["A", "B"], ["C", "D"]] },
      tarea: "Une el punto B con el punto C para que las líneas queden unidas.",
      pasos: [phC("B", "Clic en el 1.er punto"), phC("C", "Clic en el 2.º punto")],
      fin: { mover: { C: [10, 6] }, txt: "Las dos líneas comparten ahora el mismo punto." } },
    "Separado": { escena: "quiebre",
      tarea: "Separa las dos líneas en su punto común B.",
      pasos: [phC("B", "Clic en el punto común"), phC("*", "Clic para confirmar")],
      fin: { P: { B2: [12, 4.6] }, quitarL: ["B-C"], L: [["B2", "C", "n"]], txt: "Cada línea tiene ahora su propio punto." } },
    "Insertar punto": { escena: "cruz", extra: { P: { X: [11, 8] } },
      tarea: "Inserta el punto X (de la línea A–B) también en la línea vertical C–D.",
      pasos: [phC("X", "Clic en el punto")],
      fin: { estilo: { X: "n" }, txt: "X ahora pertenece a las dos líneas." } },
    "Suprimir restricción": { escena: "linea", extra: { P: { P1: [8, 9] }, estilo: { P1: "r" } },
      tarea: "Quita la restricción del punto P1 (está en dorado).",
      pasos: [phC("P1", "Clic en el objeto")],
      fin: { estilo: { P1: "" }, txt: "P1 ya no sigue ninguna medida." } },
    "Supresión": { escena: "rect", extra: { P: { E: [7, 6], F: [15, 12] }, L: [["E", "F"]] },
      tarea: "Borra la línea E–F.",
      pasos: [phC("E-F", "Clic en el objeto")],
      fin: { quitarL: ["E-F"], quitarP: ["E", "F"], txt: "La línea E–F se borró." } },

    /* ---------- Chinchetas ---------- */
    "Chincheta": { escena: "rect",
      tarea: "Clava una chincheta en el punto B.",
      pasos: [phC("B", "Clic en el punto")],
      fin: { estilo: { B: "ch" }, txt: "B ya no se mueve al desplazar o estirar." } },
    "Ch. Pts. Escalado": { escena: "rect", extra: { P: { E: [11, 2] } },
      tarea: "Clava de una vez todos los puntos escalados de la hoja.",
      pasos: [], fin: { estilo: { A: "ch", B: "ch", C: "ch", D: "ch" }, txt: "Todos los puntos escalados quedaron clavados." } },
    "Ch. Pts. Caract.": { escena: "rect", extra: { P: { E: [11, 2] } },
      tarea: "Clava de una vez todos los puntos característicos (esquinas).",
      pasos: [], fin: { estilo: { A: "ch", B: "ch", C: "ch", D: "ch" }, txt: "Las esquinas quedaron clavadas." } },
    "Ch. Extremidad": { escena: "vacia", extra: { P: { A: [3, 4], B: [10, 12], C: [13, 4], D: [20, 12], M: [6.5, 8] }, L: [["A", "M"], ["M", "B"], ["C", "D"]] },
      tarea: "Clava de una vez los extremos de todas las líneas.",
      pasos: [], fin: { estilo: { A: "ch", B: "ch", C: "ch", D: "ch" }, txt: "Los extremos quedaron clavados." } },
    "Quit. Ch.": { escena: "rect", extra: { estilo: { A: "ch", B: "ch", C: "ch", D: "ch" } },
      tarea: "Quita todas las chinchetas de la hoja de una vez.",
      pasos: [], fin: { estilo: { A: "", B: "", C: "", D: "" }, txt: "Ya no hay chinchetas." } }
  },

  Inicio: {
    "Creación de hoja": { escena: "sinHoja", sinHerr: true,
      tarea: "Crea el modelo «FALDA NIÑA T6» y abre una hoja nueva para trazar.",
      pasos: [phBar("Fichero", "Nuevo", "Ve al menú de arriba: Fichero › Nuevo"),
              phTxt("Nombre nuevo modelo", "Escribe el nombre del modelo y presiona Enter"),
              phBar("Hoja", "Nueva hoja", "Ahora abre una hoja: Hoja › Nueva hoja", { hoja: true })],
      fin: { txt: "La hoja gris está lista: ahí empiezas a trazar." } },
    "Visualizar cartucho": { escena: "rect", sinHerr: true,
      tarea: "Muestra el cartucho de la hoja.",
      pasos: [phBar("Visualizar", "Cartucho", "Ve al menú de arriba: Visualizar › Cartucho")],
      fin: { cartucho: true, txt: "El cartucho muestra el modelo, la hoja y la talla." } }
  }
};

/* ---------- Botón en la ficha de la herramienta ---------- */
function practicaDe(menu, nombre) { return (PRACTICAS_HERR[menu] || {})[nombre]; }
function botonPracticaHerr(menu, gi, hi) {
  const h = HERRAMIENTAS[menu].grupos[gi].herramientas[hi];
  if (!practicaDe(menu, h.nombre)) return;
  if (document.getElementById("pantalla-juego").classList.contains("activa")) return;   // ya está en una práctica
  const titulo = document.querySelector("#detalle-contenido h2");
  const b = document.createElement("button");
  b.className = "btn-principal btn-practicar";
  b.innerHTML = "🎯 Practicar en pantalla";
  b.addEventListener("click", () => { cerrarDetalle(); iniciarPracticaHerr(menu, gi, hi); });
  titulo.insertAdjacentElement("afterend", b);
}

/* El botón ← de la pantalla de juego regresa a las funciones mientras se practica una herramienta */
const irAantesPH = irA;
irA = function (nombre) {
  if (nombre !== "juego") {
    const v = document.querySelector("#pantalla-juego .btn-volver");
    if (v) v.dataset.ir = "actividades";
    if (PH && nombre !== "juego") { clearInterval(PH.reloj); }
  }
  irAantesPH(nombre);
};

/* ---------- La práctica ---------- */
let PH = null;

function iniciarPracticaHerr(menu, gi, hi) {
  const h = HERRAMIENTAS[menu].grupos[gi].herramientas[hi];
  const spec = practicaDe(menu, h.nombre);
  if (PH) clearInterval(PH.reloj);
  PH = { menu, gi, hi, nombre: h.nombre, spec, i: spec.sinHerr ? 0 : -1, err: 0, ayu: 0, errPaso: 0,
         t0: Date.now(), tPaso: Date.now(), fin: null, pista: null, est: phEstadoInicial(spec),
         id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
  document.getElementById("juego-titulo").textContent = `Practicar · ${h.nombre}`;
  irA("juego");
  document.querySelector("#pantalla-juego .btn-volver").dataset.ir = "herramientas";
  phPintar();
}

function phClonar(o) { return JSON.parse(JSON.stringify(o || {})); }
function phEstadoInicial(spec) {
  const e = { hoja: true, P: {}, L: [], C: [], M: {}, piq: {}, estilo: {}, ci: [], el: [], tf: "", cartucho: false };
  phAplicar(e, phClonar(PH_ESCENAS[spec.escena]));
  phAplicar(e, phClonar(spec.extra));
  return e;
}
function phAplicar(e, d) {
  if (!d) return;
  if ("hoja" in d) e.hoja = d.hoja;
  if (d.cartucho) e.cartucho = true;
  Object.assign(e.P, d.P || {}); Object.assign(e.M, d.M || {}); Object.assign(e.piq, d.piq || {});
  Object.assign(e.estilo, d.estilo || {});
  (d.quitarL || []).forEach(id => { e.L = e.L.filter(([a, b]) => !mismoObjetivo(a + "-" + b, id)); });
  (d.quitarC || []).forEach(id => { e.C = e.C.filter(c => c.id !== id); });
  (d.quitarP || []).forEach(id => { delete e.P[id]; });
  (d.L || []).forEach(l => e.L.push(l));
  (d.C || []).forEach(c => e.C.push(c));
  (d.ci || []).forEach(c => e.ci.push(c));
  (d.el || []).forEach(c => e.el.push(c));
  Object.entries(d.mover || {}).forEach(([id, xy]) => { e.P[id] = [xy[0], xy[1], (e.P[id] || [])[2]]; });
  if (d.tf) e.tf = d.tf;
}

function phPintar() {
  const area = document.getElementById("juego-area");
  area.innerHTML = `
    <div class="fs">
      <aside class="fs-guia">
        <div class="fs-cab"><span>${PH.menu === "Inicio" ? "Antes de empezar" : PH.menu} · Práctica</span>
          <span>⏱ <b id="ph-t">0:00</b> · ❌ <b id="ph-err">0</b> · 💡 <b id="ph-ayu">0</b></span></div>
        <h2>${PH.nombre}</h2>
        <p class="ph-tarea"><b>Tu tarea:</b> ${PH.spec.tarea}</p>
        <div id="ph-msg" class="fs-msg" aria-live="polite"></div>
        <div class="fs-botones"><button id="ph-ayuda" class="btn-secundario">💡 Ayuda</button></div>
        <p class="fs-guardado">El foquito 💡 te señala en amarillo dónde tocar y te dice qué escribir.</p>
        <button id="ph-reiniciar" class="fs-link">Empezar de nuevo</button>
      </aside>
      <div class="fs-pantalla"></div>
    </div>`;
  PH.pant = pantallaModaris(area.querySelector(".fs-pantalla"), {
    onBarra: phBarra, onHerramienta: phHerramienta, onBoton3: () => phTecla("boton3")
  });
  // Botón «Espacio» (igual que la barra espaciadora)
  const esp = document.createElement("button");
  esp.className = "mod-boton3 ph-espacio"; esp.textContent = "Espacio ␣"; esp.hidden = true;
  esp.addEventListener("click", () => phTecla("espacio"));
  PH.pant.el.querySelector(".mod-pie").appendChild(esp);
  PH.btnEsp = esp;
  document.getElementById("ph-ayuda").addEventListener("click", phAyuda);
  document.getElementById("ph-reiniciar").addEventListener("click", () => iniciarPracticaHerr(PH.menu, PH.gi, PH.hi));
  clearInterval(PH.reloj);
  const yo = PH;
  PH.reloj = setInterval(() => {
    const t = document.getElementById("ph-t");
    if (!t || yo !== PH) return clearInterval(yo.reloj);
    const s = Math.round(((yo.fin || Date.now()) - yo.t0) / 1000);
    t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }, 1000);
  phEntrar();
}

function phMsg(t, clase) { const m = document.getElementById("ph-msg"); if (m) { m.className = "fs-msg " + (clase || ""); m.innerHTML = t; } }
function phContadores() {
  document.getElementById("ph-err").textContent = PH.err;
  document.getElementById("ph-ayu").textContent = PH.ayu;
}
function phPaso() { return PH.spec.pasos[PH.i]; }
function phTotalPasos() { return PH.spec.pasos.length + (PH.spec.sinHerr ? 0 : 1); }

/* Marca en amarillo algo del panel o del menú de arriba, sin perder la herramienta activa */
function phPanelPista(sel) {
  if (!sel && !PH.pistaPanel) return;
  PH.pistaPanel = sel;
  PH.pant.pista(sel);
  if (PH.i >= 0 && !PH.spec.sinHerr)
    PH.pant.el.querySelectorAll(".mod-h").forEach(b => b.classList.toggle("activa", b.textContent === PH.nombre));
}

function phEntrar() {
  PH.pista = null; PH.errPaso = 0;
  phPanelPista(null);
  const n = PH.i + (PH.spec.sinHerr ? 1 : 2);
  document.getElementById("juego-progreso").textContent = `Paso ${Math.min(n, phTotalPasos())} de ${phTotalPasos()}`;
  if (PH.i < 0) {
    PH.pant.prompt(`Elige la herramienta «${PH.nombre}»`);
    phMsg(`Primero busca <b>${PH.nombre}</b> en el panel de la derecha (abre su menú ${PH.menu} o presiona la tecla ${PH.menu}).`, "info");
    phDibujar();
    return;
  }
  const p = phPaso();
  PH.pant.prompt(p.t);
  PH.btnEsp.hidden = !!PH.spec.sinHerr;
  PH.pant.boton3(PH.spec.pasos.some(x => x.tipo === "boton3"));
  if (p.tipo === "valores") {
    PH.pant.dialogo(p.campos[0].texto ? "Nuevo modelo" : PH.nombre, p.campos, vals => {
      const malos = p.campos.filter((c, i) => c.texto ? !vals[i] : !valorOk(vals[i], c));
      if (malos.length) return phError(`Revisa ${malos.map(c => c.n).join(" y ")}. Vuelve a leer la tarea.`);
      if (p.campos[0].texto) PH.pant.modelo(vals[0].toUpperCase());
      PH.pant.cerrarDialogo();
      phSiguiente();
    });
  } else if (p.tipo === "opcion") {
    phOpciones(p);
  } else {
    PH.pant.cerrarDialogo();
  }
  phDibujar();
}

function phOpciones(p) {
  const dlg = PH.pant.el.querySelector(".mod-dialogo");
  dlg.innerHTML = `<div class="mod-form"><div class="mod-form-t">${PH.nombre}</div><div class="ph-ops">` +
    p.ops.map(o => `<button type="button" class="mod-signo" data-o="${o}">${o}</button>`).join("") + `</div></div>`;
  dlg.hidden = false;
  dlg.querySelectorAll("[data-o]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.o !== p.ok) return phError(`«${b.dataset.o}» no es lo que pide la tarea.`);
    PH.pant.cerrarDialogo();
    phSiguiente();
  }));
}

function phError(t) {
  PH.err++; PH.errPaso++;
  phContadores();
  phMsg("❌ " + t + (PH.errPaso >= 2 ? "<br><small>Si te atoras, usa 💡 Ayuda.</small>" : ""), "no");
}

function phSiguiente() {
  const p = phPaso();
  if (p && p.dib) phAplicar(PH.est, phClonar(p.dib));
  PH.i++;
  if (PH.i >= PH.spec.pasos.length) return phFin();
  phEntrar();
  phMsg("✔ Bien. Ahora: " + phPaso().t.toLowerCase() + ".", "ok");
}

/* ---- Elegir la herramienta ---- */
function phHerramienta(tecla, nombre, btn) {
  if (PH.fin) return;
  if (PH.i >= 0 || PH.spec.sinHerr) {
    btn.classList.remove("activa");
    if (PH.spec.sinHerr) return phError("Esto no se hace con el panel: usa el menú de arriba.");
    if (nombre === PH.nombre) { btn.classList.add("activa"); return; }
    return phError(`Ya tienes activa «${PH.nombre}». Sigue con el paso: ${phPaso() ? phPaso().t : ""}.`);
  }
  if (tecla !== PH.menu || nombre !== PH.nombre) {
    btn.classList.remove("activa"); btn.classList.add("mal");
    return phError(`«${nombre}» no es la herramienta. Busca «${PH.nombre}».`);
  }
  PH.pistaPanel = null;
  PH.pant.pista(null);
  PH.pant.abrirMenuF(tecla);
  PH.pant.el.querySelectorAll(".mod-h").forEach(b => b.classList.toggle("activa", b.textContent === nombre));
  PH.i = 0;
  if (!PH.spec.pasos.length) return phFin();   // herramientas de cambio inmediato
  phMsg(`✔ ${nombre} activa.`, "ok");
  phEntrar();
  phMsg(`✔ ${nombre} activa. Ahora: ${phPaso().t.toLowerCase()}.`, "ok");
}

/* ---- Menú de arriba ---- */
function phBarra(m, it) {
  if (PH.fin) return;
  const p = phPaso();
  if (PH.i < 0) return phError(`Primero elige la herramienta «${PH.nombre}» en el panel de la derecha.`);
  if (!p || p.tipo !== "barra" || p.m !== m || p.it !== it) return phError(`«${m} › ${it}» no es lo que sigue.`);
  phSiguiente();
}

/* ---- Teclas (Espacio, Botón 3) ---- */
function phTecla(tipo) {
  if (!PH || PH.fin) return;
  if (PH.i < 0) return phMsg(`Primero elige la herramienta «${PH.nombre}».`, "info");
  const p = phPaso();
  if (!p || p.tipo !== tipo) return phError(tipo === "espacio" ? "Espacio no hace nada en este momento." : "Todavía no toca terminar con el botón 3.");
  phSiguiente();
}
document.addEventListener("keydown", e => {
  if (e.key !== " " || !PH || !PH.pant || !PH.pant.el.isConnected || !PH.pant.el.offsetParent) return;
  if (/^(INPUT|TEXTAREA|BUTTON|SELECT)$/.test(document.activeElement && document.activeElement.tagName)) return;
  e.preventDefault();
  phTecla("espacio");
});

/* ---- Clic en la hoja ---- */
function phNombreObj(id) {
  if (id === "*") return "cualquier lugar de la hoja";
  if (id.includes("-")) return `la línea ${id.replace("-", "–")}`;
  if (PH.est.M[id]) return PH.est.M[id][2] ? `la marca ${PH.est.M[id][2]}` : "el cruce de las líneas";
  if (PH.est.piq[id]) return `el piquete ${id}`;
  if (PH.est.C.some(c => c.id === id)) return "la curva";
  return `el punto ${id}`;
}
function phClic(id) {
  if (!PH || PH.fin) return;
  if (PH.i < 0) return phMsg(`Primero elige la herramienta «${PH.nombre}» en el panel de la derecha.`, "info");
  const p = phPaso();
  if (!p) return;
  if (p.tipo !== "clic") {
    if (id !== "*") phMsg(`Ahora toca: <b>${p.t}</b>.`, "info");
    return;
  }
  if (p.ids.includes("*") || p.ids.some(e => mismoObjetivo(id, e))) return phSiguiente();
  if (id === "*") return phMsg("Haz clic sobre un punto, una línea o una marca.", "info");
  phError(`Ese es ${phNombreObj(id)}. Lee otra vez el paso.`);
}

/* ---- Ayuda (foquito) ---- */
function phAyuda() {
  if (!PH || PH.fin) return;
  PH.ayu++;
  phContadores();
  let t = "";
  if (PH.i < 0) {
    t = `Abre <b>${PH.menu}</b> y elige <b>${PH.nombre}</b> (está marcado en amarillo).`;
    phPanelPista("herr:" + PH.menu + ":" + PH.nombre);
  } else {
    const p = phPaso();
    if (p.tipo === "clic") {
      const obj = p.ids.find(x => x !== "*");
      t = obj ? `Haz clic en <b>${phNombreObj(obj)}</b> (está marcado en amarillo).` : "Haz clic en cualquier lugar de la hoja.";
      PH.pista = obj || null;
    } else if (p.tipo === "valores") {
      t = p.campos[0].texto ? "Escribe el nombre del modelo, por ejemplo <b>FALDA NIÑA T6</b>, y presiona Enter."
        : "Escribe: " + p.campos.map(c => `<b>${c.n} = ${c.v}</b>`).join(", ") + " y presiona <b>Enter</b>." +
          (p.campos.some(c => c.v < 0) ? " Para el signo «−» usa el botón <b>+/−</b>." : "");
    } else if (p.tipo === "espacio") {
      t = "Presiona la tecla <b>Espacio</b> o el botón <b>Espacio ␣</b> de abajo de la pantalla.";
    } else if (p.tipo === "boton3") {
      t = "Presiona <b>Botón 3 · terminar</b> (abajo de la pantalla).";
    } else if (p.tipo === "opcion") {
      t = `Elige <b>${p.ok}</b>.`;
    } else if (p.tipo === "barra") {
      t = `En el menú de arriba: <b>${p.m} › ${p.it}</b>.`;
      phPanelPista("barra:" + p.m);
    }
  }
  phMsg("💡 " + t, "info");
  phDibujar();
}

/* ---- Terminó ---- */
function phFin() {
  PH.fin = Date.now();
  phAplicar(PH.est, phClonar(PH.spec.fin));
  PH.pant.cerrarDialogo(); PH.pant.boton3(false); phPanelPista(null);
  PH.btnEsp.hidden = true;
  PH.pant.prompt("¡Listo!");
  PH.pista = null;
  phDibujar();
  const segundos = Math.min(3599, Math.round((PH.fin - PH.t0) / 100) / 10);
  const perfecto = PH.err === 0 && PH.ayu === 0;
  const premio = perfecto ? 5 : 2;
  sumarPuntos(premio);
  registrarRespuesta({ partida: PH.id, juego: "herr", pregunta: `${PH.menu} · ${PH.nombre}`.slice(0, 80),
                       respuesta: `errores ${PH.err} · ayudas ${PH.ayu}`, correcta: perfecto, segundos });
  document.getElementById("juego-progreso").textContent = "";
  const s = Math.round(segundos);
  document.querySelector(".fs-guia").innerHTML = `
    <div class="fin-estrellas">${perfecto ? "🌟🌟🌟" : PH.err + PH.ayu <= 2 ? "🌟🌟" : "🌟"}</div>
    <h2>¡Usaste ${PH.nombre}!</h2>
    <p>${PH.spec.fin.txt || ""}</p>
    <div class="fs-stats">
      <div><b>${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}</b><span>Tiempo</span></div>
      <div><b>${PH.err}</b><span>Errores</span></div>
      <div><b>${PH.ayu}</b><span>Ayudas</span></div>
    </div>
    <p>Ganaste <b>+${premio} ⭐</b>${perfecto ? " por hacerlo sin errores ni ayuda" : ". Sin errores ni ayuda ganas +5 ⭐"}.</p>
    <div class="fin-botones">
      <button class="btn-principal" id="ph-otra">Practicar otra vez</button>
      <button class="btn-secundario" id="ph-ficha">Volver a la ficha</button>
    </div>`;
  document.getElementById("ph-otra").addEventListener("click", () => iniciarPracticaHerr(PH.menu, PH.gi, PH.hi));
  document.getElementById("ph-ficha").addEventListener("click", () => {
    const { menu, gi, hi } = PH;
    abrirMenu(menu);
    abrirDetalle(menu, gi, hi);
  });
}

/* ---- Dibujo ---- */
function phPos(id) {
  const E = PH.est;
  if (Array.isArray(id)) return id;
  if (E.P[id]) return E.P[id];
  if (E.M[id]) return E.M[id];
  if (E.piq[id]) return E.piq[id].en;
  return null;
}
function phCurvaD(c) {
  const p = c.pts.map(phPos);
  if (p.length === 4 && typeof c.pts[1] !== "string" && typeof c.pts[2] !== "string")
    return `M${p[0][0]} ${p[0][1]} C${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} ${p[3][0]} ${p[3][1]}`;
  // Curva suave que pasa por todos los puntos (Catmull-Rom)
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function phDibujar() {
  const lz = PH.pant.lienzo, E = PH.est;
  if (!E.hoja) { lz.innerHTML = `<div class="mod-sin-hoja">Todavía no hay hoja abierta</div>`; return; }
  const [vx, vy, vw, vh] = PH_VISTA;
  let s = `<svg class="mod-svg" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">
    <rect class="mod-hoja" x="${vx + 0.4}" y="${vy + 0.4}" width="${vw - 0.8}" height="${vh - 0.8}"/><g transform="${E.tf}">`;
  E.L.forEach(([a, b, f]) => {
    const A = phPos(a), B = phPos(b);
    if (A && B) s += `<line class="${f === "g" ? "ph-guia" : f === "h" ? "ph-hilo" : "mod-tr" + (f === "n" ? " ph-nuevo" : "")}" x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/>`;
  });
  E.C.forEach(c => { s += `<path class="mod-tr${c.n ? " ph-nuevo" : ""}" d="${phCurvaD(c)}"/>`; });
  E.ci.forEach(([x, y, r]) => { s += `<circle class="mod-tr ph-nuevo" cx="${x}" cy="${y}" r="${r}"/>`; });
  E.el.forEach(([x, y, rx, ry]) => { s += `<ellipse class="mod-tr ph-nuevo" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`; });
  Object.entries(E.piq).forEach(([id, q]) => {
    const [x, y] = q.en, l = 1.1;
    s += `<line class="ph-piq${q.ext ? " ext" : ""}" x1="${x}" y1="${y}" x2="${x + q.dir[0] * l}" y2="${y + q.dir[1] * l}"/>
          <text class="mod-et" x="${x + 0.5}" y="${y - 0.5}" font-size="0.9">${id}</text>`;
  });
  Object.entries(E.M).forEach(([id, [x, y, et]]) => {
    if (!et) return;
    s += `<g class="ph-marca"><line x1="${x - 0.6}" y1="${y}" x2="${x + 0.6}" y2="${y}"/><line x1="${x}" y1="${y - 0.6}" x2="${x}" y2="${y + 0.6}"/></g>
          <text class="ph-marca-t" x="${x + 0.5}" y="${y + 1.3}" font-size="0.95">${et}</text>`;
  });
  Object.entries(E.P).forEach(([id, [x, y, f]]) => {
    if (f === "o") return;
    const est = E.estilo[id] || "";
    s += `<rect class="mod-pt${est === "r" ? " ph-restr" : est === "n" ? " ph-nuevo-pt" : ""}" x="${x - 0.25}" y="${y - 0.25}" width="0.5" height="0.5"/>`;
    if (est === "ch") s += `<path class="ph-ch" d="M${x} ${y - 0.3} l-0.45 -1 h0.9 z"/><circle class="ph-ch" cx="${x}" cy="${y - 1.25}" r="0.42"/>`;
    if (est === "m") s += `<circle class="ph-marcaje" cx="${x}" cy="${y}" r="0.7"/><line class="ph-marcaje" x1="${x - 0.7}" y1="${y}" x2="${x + 0.7}" y2="${y}"/><line class="ph-marcaje" x1="${x}" y1="${y - 0.7}" x2="${x}" y2="${y + 0.7}"/>`;
    s += `<text class="mod-et" x="${x + 0.45}" y="${y - 0.45}" font-size="1.05">${id}</text>`;
  });
  if (E.cartucho) s += `<g class="mod-cartucho"><rect x="11" y="16.6" width="11.5" height="2.2"/>
      <text x="11.4" y="17.5" font-size="0.65">modelo : FALDA NIÑA T6</text><text x="11.4" y="18.4" font-size="0.65">hoja 1 · talla 6 · cm</text></g>`;
  if (PH.pista) {
    if (PH.pista.includes("-")) {
      const [a, b] = PH.pista.split("-"), A = phPos(a), B = phPos(b);
      if (A && B) s += `<line class="mod-pista-l" x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/>`;
    } else if (PH.est.C.some(c => c.id === PH.pista)) {
      s += `<path class="mod-pista-l" fill="none" d="${phCurvaD(PH.est.C.find(c => c.id === PH.pista))}"/>`;
    } else {
      const P = phPos(PH.pista);
      if (P) s += `<circle class="mod-pista" cx="${P[0]}" cy="${P[1]}" r="1"/>`;
    }
  }
  s += `</g><circle class="mod-sel" r="0.8" cx="-99" cy="-99"/><line class="mod-hl" x1="-99" y1="-99" x2="-99" y2="-99"/></svg>`;
  lz.innerHTML = s;
  const svg = lz.querySelector("svg"), anillo = svg.querySelector(".mod-sel"), hl = svg.querySelector(".mod-hl");
  svg.addEventListener("mousemove", ev => {
    const o = phCercano(svg, ev);
    const P = o && !o.includes("-") ? phPos(o) : null;
    anillo.setAttribute("cx", P ? P[0] : -99); anillo.setAttribute("cy", P ? P[1] : -99);
    if (o && o.includes("-")) { const [a, b] = o.split("-"), A = phPos(a), B = phPos(b); hl.setAttribute("x1", A[0]); hl.setAttribute("y1", A[1]); hl.setAttribute("x2", B[0]); hl.setAttribute("y2", B[1]); }
    else ["x1", "y1", "x2", "y2"].forEach(a => hl.setAttribute(a, -99));
  });
  svg.addEventListener("click", ev => phClic(phCercano(svg, ev) || "*"));
}
function phCercano(svg, ev) {
  if (PH.est.tf) return null;
  const m = svg.getScreenCTM();
  if (!m) return null;
  const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  const p = pt.matrixTransform(m.inverse()), E = PH.est;
  let mejor = null, dmin = 1.2;
  const prueba = (id, xy) => { const d = Math.hypot(p.x - xy[0], p.y - xy[1]); if (d < dmin) { dmin = d; mejor = id; } };
  Object.entries(E.M).forEach(([id, xy]) => prueba(id, xy));
  Object.entries(E.piq).forEach(([id, q]) => prueba(id, q.en));
  Object.entries(E.P).forEach(([id, xy]) => { if (xy[2] !== "o") prueba(id, xy); });
  if (mejor) return mejor;
  dmin = 0.7;
  E.L.forEach(([a, b]) => { const A = phPos(a), B = phPos(b); if (!A || !B) return; const d = distSegmento(p, A, B); if (d < dmin) { dmin = d; mejor = a + "-" + b; } });
  if (mejor) return mejor;
  // Curvas: se revisan por tramos
  const tmp = document.createElementNS("http://www.w3.org/2000/svg", "path");
  E.C.forEach(c => {
    tmp.setAttribute("d", phCurvaD(c));
    svg.appendChild(tmp);
    const L = tmp.getTotalLength();
    for (let i = 0; i <= 40; i++) { const q = tmp.getPointAtLength(L * i / 40); const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < dmin) { dmin = d; mejor = c.id; } }
    tmp.remove();
  });
  return mejor;
}
