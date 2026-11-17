/* =====================================================================
   PRÁCTICA FINAL: FALDA RECTA PARA NIÑA TALLA 6
   ---------------------------------------------------------------------
   Sale del documento «Diseño experimental» (ejercicio de Lectra Modaris).
   Cada paso dice qué herramienta se usa, dónde se hace clic y qué
   valores se escriben. La app dibuja el patrón conforme se avanza.

   Coordenadas en cm: A = esquina superior izquierda (0, 0),
   x hacia la derecha, y hacia abajo.
   ===================================================================== */

const FALDA = {
  titulo: "Falda recta niña talla 6",
  modelo: "FALDA NIÑA T6",
  medidas: [
    ["Contorno de cintura", "66"], ["Contorno de cadera", "76"], ["Largo de falda", "42"],
    ["Largo de cadera", "12.5"], ["¼ contorno de cintura", "16.5"], ["¼ contorno de cadera", "19"],
    ["½ contorno de cadera + holgura", "38.5"], ["Holgura de construcción", "0.5"],
    ["Profundidad cintura espalda", "1.5"], ["Profundidad cintura delantero", "1"],
    ["Aumento para pinza trasera", "2"], ["Mitad del ancho de pinza", "1"],
    ["Largo pinza trasera", "9"], ["Holgura cintura delantero", "0.5"]
  ],

  /* Posición de cada punto (cm). oculto = no se le pone nombre en el dibujo */
  puntos: {
    A: [0, 0], B: [38.5, 0], D: [0, 42, "oculto"], E: [38.5, 42, "oculto"],
    1: [0, 1.5], 2: [0, 12.5], 3: [38.5, 12.5], 4: [19, 0], 5: [19, 42],
    6: [18.5, 0], 7: [6, 0], 8: [7, 0], 9: [8, 0], 10: [7, 12.5], 11: [7, 9],
    C: [19, 12.5], 12: [38.5, 1], 13: [21.5, 0]
  },

  /* tipo "barra": se hace desde el menú de arriba (Fichero, Hoja, Visualizar…)
     tipo "herramienta": se elige el menú F y la herramienta; luego clics y valores.
     opciones = formas correctas de hacerlo (la primera es la recomendada).
     clics: id de punto, "a-b" para una línea, "hoja" = cualquier lugar, "fin" = botón 3 del ratón. */
  pasos: [
    { titulo: "Crear el modelo", tipo: "barra", ruta: ["Fichero", "Nuevo"],
      guia: "Crea un modelo nuevo y llámalo <b>FALDA NIÑA T6</b>.",
      nombre: "Nombre nuevo modelo",
      error: "El modelo nuevo se crea desde el menú de arriba: Fichero › Nuevo (Ctrl + N)." },

    { titulo: "Nueva hoja", tipo: "barra", ruta: ["Hoja", "Nueva hoja"],
      guia: "Abre una hoja nueva para empezar a trazar.",
      error: "La hoja se crea desde el menú de arriba: Hoja › Nueva hoja (N)." },

    { titulo: "Base: rectángulo", tipo: "herramienta",
      guia: "Traza un rectángulo de <b>38.5 cm de ancho</b> (½ cadera + holgura) por <b>42 cm de alto</b> (largo de falda). A queda arriba a la izquierda y B arriba a la derecha.",
      opciones: [{ menu: "F2", herramienta: "Rectángulo", clics: ["hoja"],
                   campos: [{ n: "Ancho", v: 38.5 }, { n: "Altura", v: 42 }] }],
      dibuja: { puntos: ["A", "B", "D", "E"], lineas: [["A", "B"], ["B", "E"], ["E", "D"], ["D", "A"]] },
      error: "No inviertas las medidas: el ancho es ½ cadera + holgura (38.5) y la altura es el largo de falda (42)." },

    { titulo: "Punto 1: cintura espalda", tipo: "herramienta",
      guia: "Desde A, baja <b>1.5 cm</b> sobre la línea izquierda y marca el punto 1 (profundidad de cintura espalda).",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["A"], campos: [{ n: "Longitud", v: 1.5 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["A"], campos: [{ n: "Longitud", v: 1.5 }] }],
      dibuja: { puntos: ["1"] },
      error: "La profundidad de cintura de la espalda es 1.5 cm (la del delantero es 1 cm)." },

    { titulo: "Punto 2: altura de cadera", tipo: "herramienta",
      guia: "Desde A, baja <b>12.5 cm</b> y marca el punto 2 (largo de cadera).",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["A"], campos: [{ n: "Longitud", v: 12.5 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["A"], campos: [{ n: "Longitud", v: 12.5 }] }],
      dibuja: { puntos: ["2"] },
      error: "Se mide desde A (la esquina), no desde el punto 1." },

    { titulo: "Línea de cadera", tipo: "herramienta",
      guia: "Desde el punto 2, traza una línea horizontal hasta el borde derecho y marca el punto 3.",
      opciones: [{ menu: "F1", herramienta: "L. Recta", clics: ["2"], campos: [{ n: "dl", v: 38.5 }, { n: "Rotación", v: 0, alt: [360] }] },
                 { menu: "F1", herramienta: "Paralelo", clics: ["A-B"], campos: [{ n: "Distancia", v: 12.5 }] }],
      dibuja: { puntos: ["3"], lineas: [["2", "3"]] },
      error: "La línea de cadera mide lo mismo que el ancho del rectángulo (38.5) y va horizontal (rotación 0°)." },

    { titulo: "Punto 4: ¼ de cadera", tipo: "herramienta",
      guia: "Desde A, mide <b>19 cm</b> hacia la derecha sobre la línea de arriba y marca el punto 4.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["A"], campos: [{ n: "Longitud", v: 19 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["A"], campos: [{ n: "Longitud", v: 19 }] }],
      dibuja: { puntos: ["4"] },
      error: "¼ del contorno de cadera es 76 ÷ 4 = 19 cm." },

    { titulo: "Línea de costado", tipo: "herramienta",
      guia: "Desde el punto 4, escuadra una línea vertical hacia abajo hasta el borde inferior y marca el punto 5.",
      opciones: [{ menu: "F1", herramienta: "L. Recta", clics: ["4"], campos: [{ n: "dl", v: 42 }, { n: "Rotación", v: -90, alt: [270] }] },
                 { menu: "F1", herramienta: "Paralelo", clics: ["D-A"], campos: [{ n: "Distancia", v: 19 }] }],
      dibuja: { puntos: ["5"], lineas: [["4", "5"]] },
      error: "Hacia abajo es rotación −90° (o 270°). El largo es el de la falda: 42 cm." },

    { titulo: "Punto 6: cintura espalda + pinza", tipo: "herramienta",
      guia: "Desde A, mide hacia la derecha ¼ de cintura + aumento de pinza = 16.5 + 2 = <b>18.5 cm</b>. Marca el punto 6.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["A"], campos: [{ n: "Longitud", v: 18.5 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["A"], campos: [{ n: "Longitud", v: 18.5 }] }],
      dibuja: { puntos: ["6"] },
      error: "Recuerda sumar el aumento de la pinza: 16.5 + 2 = 18.5 cm." },

    { titulo: "Punto 7: inicio de la pinza", tipo: "herramienta", zoom: "pinza",
      guia: "Ubica el punto 7 (posición de la pinza). En esta práctica: <b>6 cm</b> desde A hacia la derecha.",
      nota: "El documento original no da esta medida: se tomó del gráfico de referencia.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["A"], campos: [{ n: "Longitud", v: 6 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["A"], campos: [{ n: "Longitud", v: 6 }] }],
      dibuja: { puntos: ["7"] },
      error: "En esta práctica el punto 7 va a 6 cm de A." },

    { titulo: "Punto 8: centro de la pinza", tipo: "herramienta", zoom: "pinza",
      guia: "Desde el punto 7, mide <b>1 cm</b> a la derecha y marca el punto 8.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["7"], campos: [{ n: "Longitud", v: 1 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["7"], campos: [{ n: "Longitud", v: 1 }] }],
      dibuja: { puntos: ["8"] },
      error: "Es la mitad del ancho de la pinza: 1 cm, medido desde el punto 7." },

    { titulo: "Punto 9: fin de la pinza", tipo: "herramienta", zoom: "pinza",
      guia: "Desde el punto 8, mide <b>1 cm</b> a la derecha y marca el punto 9.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["8"], campos: [{ n: "Longitud", v: 1 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["8"], campos: [{ n: "Longitud", v: 1 }] }],
      dibuja: { puntos: ["9"] },
      error: "Se mide desde el punto 8 (centro de la pinza), no desde el 7." },

    { titulo: "Centro de la pinza", tipo: "herramienta", zoom: "pinza",
      guia: "Desde el punto 8, escuadra una línea vertical hacia abajo hasta la línea de cadera y marca el punto 10.",
      opciones: [{ menu: "F1", herramienta: "L. Recta", clics: ["8"], campos: [{ n: "dl", v: 12.5 }, { n: "Rotación", v: -90, alt: [270] }] }],
      dibuja: { puntos: ["10"], lineas: [["8", "10"]] },
      error: "La línea baja hasta la cadera: 12.5 cm, con rotación −90° (hacia abajo)." },

    { titulo: "Punto 11: vértice de la pinza", tipo: "herramienta", zoom: "pinza",
      guia: "Desde el punto 8, mide <b>9 cm</b> hacia abajo y marca el punto 11 (largo de la pinza).",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["8"], campos: [{ n: "Longitud", v: 9 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["8"], campos: [{ n: "Longitud", v: 9 }] }],
      dibuja: { puntos: ["11"] },
      error: "El largo de la pinza trasera es 9 cm, medido desde el punto 8." },

    { titulo: "Cruce de costado y cadera", tipo: "herramienta",
      guia: "Marca un punto donde se cruzan la línea de costado (4–5) y la línea de cadera (2–3). Ahí terminan las curvas de costado.",
      opciones: [{ menu: "F1", herramienta: "Intersección", clics: ["C"] }],
      dibuja: { puntos: ["C"] },
      error: "Para el punto donde se cruzan dos líneas se usa Intersección: clic justo en el cruce." },

    { titulo: "Curva de cintura espalda", tipo: "herramienta", zoom: "pinza",
      guia: "Traza la curva de cintura de la espalda, del punto 1 al punto 6.",
      opciones: [{ menu: "F1", herramienta: "Bézier", clics: ["1", "6", "fin"] }],
      dibuja: { curvas: [{ de: "1", a: "6", c1: [7, 1.4], c2: [14, 0.8] }] },
      error: "Las curvas suaves se trazan con Bézier: clic en cada punto y botón 3 del ratón para terminar." },

    { titulo: "Pinza: primer lado", tipo: "herramienta", zoom: "pinza",
      guia: "Une el punto 7 con el punto 11 con una recta.",
      opciones: [{ menu: "F1", herramienta: "L. Recta", clics: ["7", "11"] }],
      dibuja: { lineas: [["7", "11"]] },
      error: "Es una recta (L. Recta): clic en el punto 7 y luego en el 11." },

    { titulo: "Pinza: segundo lado", tipo: "herramienta", zoom: "pinza",
      guia: "Une el punto 9 con el punto 11 con una recta.",
      opciones: [{ menu: "F1", herramienta: "L. Recta", clics: ["9", "11"] }],
      dibuja: { lineas: [["9", "11"]] },
      error: "Es una recta (L. Recta): clic en el punto 9 y luego en el 11." },

    { titulo: "Costado espalda", tipo: "herramienta", zoom: "pinza",
      guia: "Traza la curva de costado de la espalda: del punto 6 a la línea de cadera (cruce C).",
      opciones: [{ menu: "F1", herramienta: "Bézier", clics: ["6", "C", "fin"] }],
      dibuja: { curvas: [{ de: "6", a: "C", c1: [18.9, 4], c2: [19, 9] }] },
      error: "El costado es curvo: Bézier, del punto 6 al cruce C, y botón 3 para terminar." },

    { titulo: "Punto 12: cintura delantero", tipo: "herramienta",
      guia: "Desde B, baja <b>1 cm</b> sobre la línea derecha y marca el punto 12 (profundidad de cintura delantero).",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["B"], campos: [{ n: "Longitud", v: 1 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["B"], campos: [{ n: "Longitud", v: 1 }] }],
      dibuja: { puntos: ["12"] },
      error: "En el delantero la profundidad de cintura es 1 cm (en la espalda es 1.5)." },

    { titulo: "Punto 13: ¼ cintura delantero", tipo: "herramienta",
      guia: "Desde B, mide hacia la izquierda ¼ de cintura + holgura = 16.5 + 0.5 = <b>17 cm</b>. Marca el punto 13.",
      opciones: [{ menu: "F1", herramienta: "Pto. Constante", clics: ["B"], campos: [{ n: "Longitud", v: 17 }] },
                 { menu: "F1", herramienta: "Añadir punto", clics: ["B"], campos: [{ n: "Longitud", v: 17 }] }],
      dibuja: { puntos: ["13"] },
      error: "Se mide desde B hacia la izquierda: 16.5 + 0.5 de holgura = 17 cm." },

    { titulo: "Curva de cintura delantero", tipo: "herramienta",
      guia: "Traza la curva de cintura del delantero, del punto 12 al punto 13.",
      opciones: [{ menu: "F1", herramienta: "Bézier", clics: ["12", "13", "fin"] }],
      dibuja: { curvas: [{ de: "12", a: "13", c1: [32, 0.9], c2: [26, 0.5] }] },
      error: "Curva suave: Bézier, clic en 12, clic en 13 y botón 3 para terminar." },

    { titulo: "Costado delantero", tipo: "herramienta",
      guia: "Traza la curva de costado del delantero: del punto 13 a la línea de cadera (cruce C).",
      opciones: [{ menu: "F1", herramienta: "Bézier", clics: ["13", "C", "fin"] }],
      dibuja: { curvas: [{ de: "13", a: "C", c1: [19.6, 4], c2: [19, 9] }] },
      error: "Igual que en la espalda: Bézier del punto 13 al cruce C." },

    { titulo: "Ver el cartucho", tipo: "barra", ruta: ["Visualizar", "Cartucho"],
      guia: "Muestra el cartucho para revisar los datos de la hoja (nombre del modelo y tallas).",
      cartucho: true,
      error: "El cartucho se muestra desde el menú de arriba: Visualizar › Cartucho." },

    { titulo: "Guardar", tipo: "barra", ruta: ["Fichero", "Grabar"],
      guia: "Guarda tu trabajo para poder entregarlo.",
      error: "Para guardar: Fichero › Grabar (Ctrl + E)." }
  ],

  /* Lo que sigue en Lectra después del trazo (del documento) */
  despues: [
    "Comprobar contornos",
    "Extraer las piezas delantera y trasera",
    "Definir hilo de tela",
    "Aplicar simetría según corresponda",
    "Editar nombre de las piezas",
    "Agregar costuras/piquetes si forman parte de la práctica",
    "Crear variante y guardar"
  ]
};
