/* =====================================================================
   DATOS DE LA APP XILOVHA
   ---------------------------------------------------------------------
   Aquí se guarda toda la información de los menús y herramientas.
   Para agregar o corregir una herramienta, solo edita este archivo.

   Cada herramienta puede tener:
     nombre    -> como aparece en el menú de Modaris
     atajo     -> tecla rápida (opcional)
     manual    -> otro nombre con el que se conoce la herramienta (se muestra como "También se llama")
     sirve     -> para qué sirve (1-2 frases)
     pasos     -> lista corta de pasos
     nota      -> dato importante / tip
     teclas    -> tabla de teclas [["tecla", "qué hace"], ...]
     lista     -> lista simple de opciones
     pendiente -> true = todavía no hay información en el manual
   ===================================================================== */

const MENUS = [
  { tecla: "F1",  nombre: "Puntos, líneas",                         color: "#f6d2ae", listo: true  },
  { tecla: "F2",  nombre: "Piquetes, orientación, herramientas",    color: "#f0b04a", listo: true  },
  { tecla: "F3",  nombre: "Modificación",                           color: "#f8c3cf", listo: true  },
  { tecla: "F4",  nombre: "Industrialización, pieza",               color: "#cfcfcf", listo: false },
  { tecla: "F5",  nombre: "Piezas derivadas, pliegues, CAD-CAM",    color: "#cdb6d8", listo: false },
  { tecla: "F6",  nombre: "Escalado",                               color: "#7fd0cc", listo: false },
  { tecla: "F7",  nombre: "Evolución, modif. plancha",              color: "#9fd39b", listo: false },
  { tecla: "F8",  nombre: "Medidas, uniones, variantes",            color: "#ead98a", listo: false },
  { tecla: "~F1", nombre: "Alteraciones, Modaris 3D",               color: "#a99be0", listo: false }
];

const HERRAMIENTAS = {
  F1: {
    descripcion: "Herramientas para crear puntos y trazar líneas: la base para construir cualquier patrón.",

    glosario: [
      ["dx / dy", "Distancia horizontal / vertical desde el punto donde hiciste clic."],
      ["dl", "Distancia en línea recta entre los dos puntos."],
      ["Rotación", "Ángulo respecto a la hoja (0° derecha, 90° arriba). Para sentido horario escribe negativo, ej. -45."],
      ["~  y  ^", "En los atajos de Modaris: ~ = tecla Alt  ·  ^ = tecla Ctrl."],
      ["Mayúsculas", "En los atajos cuentan: «x» (Eje) y «X» (Paralelo) son herramientas distintas."],
      ["Punto característico", "Punto que forma esquina (ángulo marcado)."],
      ["Punto de curva", "Punto por donde la línea pasa suave, sin esquina."],
      ["Botones del ratón", "1 = crear punto · 2 = borrar el último punto · 3 = terminar la línea."],
      ["Validar", "Confirmar con Enter (⏎) o con un clic."]
    ],

    grupos: [
      /* ========================= PUNTOS ========================= */
      {
        nombre: "Puntos",
        herramientas: [
          {
            nombre: "Deslizante",
            sirve: "Pone un punto sobre una línea que conserva su proporción: si lo pones a 1/3 de la línea y la línea se estira, sigue quedando a 1/3.",
            pasos: [
              "Activa Deslizante.",
              "Haz clic sobre la línea y mantén presionado: aparece el punto.",
              "Suelta y desliza el punto por la línea.",
              "Haz clic donde lo quieras fijar."
            ],
            nota: "Se gradúa proporcionalmente en todas las tallas."
          },
          {
            nombre: "Pto. Constante", atajo: "V", manual: "Desarrollo (V)",
            sirve: "Pone un punto sobre la línea a una distancia exacta de otro punto de la misma línea. Aunque la línea cambie, esa distancia se mantiene.",
            pasos: [
              "Activa la herramienta.",
              "Haz clic en el punto de referencia de la línea.",
              "Escribe la longitud y presiona Enter… o colócalo a mano y haz clic."
            ],
            nota: "Si el punto de referencia es la unión de dos líneas, pasa el cursor a la línea correcta y presiona Espacio."
          },
          {
            nombre: "Serie de puntos constantes", pendiente: true,
            sirve: "Al activarla se abre una ventana con estas opciones de marcaje:",
            lista: ["Sin marcaje", "Taladro '35', '36', '37' y '1'", "Motivo vert. / horiz. / vert. horiz.", "Trama vertical y Trama horizontal", "Categoría motivo fallo", "Colocar piquetes en las series de puntos constantes"]
          },
          {
            nombre: "Desplazado", pendiente: true,
            sirve: "Aparece desactivado (gris) en el menú."
          },
          {
            nombre: "Punto Enlace",
            sirve: "Crea un punto fuera de la línea que queda amarrado a otro punto: si el punto de referencia se mueve, éste lo sigue.",
            pasos: [
              "Activa Punto Enlace.",
              "Haz clic en el punto de referencia.",
              "Escribe los valores (dx, dy, dl o rotación) o colócalo a mano.",
              "Haz clic para validar."
            ],
            teclas: [
              ["Espacio 1 vez", "Gira libre alrededor del punto."],
              ["Espacio 2 veces", "Crea un nuevo punto sobre la curva y se apoya en él."],
              ["Espacio 3 veces", "Regresa a perpendicular al punto."]
            ],
            nota: "Copia el escalado del punto de referencia."
          },
          {
            nombre: "Relativo", atajo: "Alt + r",
            sirve: "Crea un punto a cierta distancia de otro punto (o de cualquier lugar). A diferencia de Punto Enlace, después NO depende de él.",
            pasos: [
              "Activa Relativo.",
              "Haz clic en un punto de referencia o en cualquier lugar.",
              "Escribe dx, dy, dl o rotación… o colócalo a mano.",
              "Haz clic para validar."
            ],
            nota: "Toma el escalado del punto de referencia."
          },
          {
            nombre: "Intersección", atajo: "I",
            sirve: "Crea un punto donde se cruzan dos líneas. Si no se tocan, lo pone donde se cruzarían si se alargaran.",
            pasos: [
              "Activa Intersección.",
              "Opción A: haz clic justo en el cruce.",
              "Opción B: clic sostenido en la 1.ª línea, arrastra hasta la 2.ª y suelta."
            ],
            nota: "Útil para agregar puntos antes de una extracción manual."
          },
          {
            nombre: "Añadir punto", atajo: "Alt + 4",
            sirve: "Agrega un punto sobre una línea, a una distancia de un punto de referencia.",
            pasos: [
              "Activa Añadir punto.",
              "Haz clic en el punto de referencia.",
              "(Opcional) escribe dx, dy o longitud y presiona Enter.",
              "Coloca el punto sobre la línea y haz clic."
            ],
            nota: "Sin teclas = punto característico (esquina). Con Shift (⇧) presionado = punto de curva."
          },
          {
            nombre: "Taladro", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Ali 2Pts", atajo: "A",
            sirve: "Alinea un punto (o varios seleccionados) en horizontal o vertical con un punto de referencia.",
            pasos: [
              "Activa Ali 2Pts.",
              "Haz clic en el punto de referencia.",
              "Presiona Espacio para cambiar entre horizontal y vertical.",
              "Haz clic en el punto que quieres alinear."
            ],
            nota: "Si tienes varios puntos seleccionados, haz clic en uno de ellos y se alinean todos."
          },
          {
            nombre: "Ali 3Pts", atajo: "Alt + a",
            sirve: "Alinea puntos sobre una línea imaginaria (eje) que defines con dos puntos. Los puntos «caen» en perpendicular sobre ese eje.",
            pasos: [
              "Activa Ali 3Pts.",
              "Clic en el 1.er punto del eje.",
              "Clic en el 2.º punto del eje.",
              "Clic en el punto que quieres alinear."
            ]
          },
          {
            nombre: "División",
            sirve: "Reparte puntos a la misma distancia en línea recta entre dos puntos.",
            pasos: [
              "Activa División.",
              "Clic en el 1.er punto.",
              "Clic en el 2.º punto.",
              "Escribe el número de divisiones y presiona Enter."
            ],
            nota: "Número de puntos = divisiones − 1 (ej. 4 divisiones = 3 puntos). Los puntos van en línea recta; si quieres que sigan la forma de la línea usa División segmento."
          }
        ]
      },

      /* ========================= LÍNEAS ========================= */
      {
        nombre: "Líneas",
        herramientas: [
          {
            nombre: "L. Recta", atajo: "O",
            sirve: "Traza una línea recta. Puedes darle medida exacta (dl) y ángulo (rotación).",
            pasos: [
              "Activa L. Recta.",
              "Clic en el punto inicial.",
              "Escribe los valores y presiona Enter… o estira la línea y haz clic para terminarla."
            ],
            teclas: [
              ["Shift + clic al inicio", "Ángulo exacto respecto a una línea o curva existente (90° por defecto)."],
              ["Shift + clic al final", "Hace que la recta pase exactamente por ese punto."]
            ]
          },
          {
            nombre: "Paralelo", atajo: "X",
            sirve: "Crea una línea paralela a otra, a la distancia que indiques.",
            pasos: [
              "Activa Paralelo.",
              "Clic en la línea de referencia.",
              "Escribe la distancia y presiona Enter… o arrástrala y haz clic."
            ],
            nota: "Sigue el escalado de la línea original. Si pasas el cursor encima, se resalta la línea de la que depende."
          },
          {
            nombre: "Oblicuo", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Bézier", atajo: "b",
            sirve: "Traza curvas suaves (escotes, sisas, tiros…). La forma se controla con sus puntos.",
            pasos: [
              "Activa Bézier.",
              "Clic para poner el punto inicial.",
              "Sigue haciendo clic para los demás puntos.",
              "Botón 3 del ratón para terminar."
            ],
            teclas: [
              ["Clic", "Punto característico (esquina)."],
              ["Shift + clic", "Punto de curva (suave)."],
              ["Botón 2", "Borra el último punto."]
            ],
            nota: "Para corregir la curva: activa Visualización › Bézier y Pts de curva, usa Modificar y arrastra los «ganchos» (tangentes). Con Alt o Shift cambia el efecto."
          },
          {
            nombre: "Semi-circ.", atajo: "S",
            sirve: "Traza curvas en forma de arco usando grupos de 3 puntos: inicio, curvatura y fin.",
            pasos: [
              "Activa Semi-circ.",
              "Clic en el punto inicial.",
              "Clic en el 2.º punto (da la curvatura).",
              "Clic en el 3.er punto para cerrar el arco. Repite de 3 en 3.",
              "Botón 3 del ratón para terminar."
            ],
            nota: "Shift = punto de curva (suave). Sin Shift = esquina."
          },
          {
            nombre: "Trazar",
            sirve: "Digitaliza líneas sobre un patrón o líneas internas de una pieza, sin crear contorno ni sacar pieza.",
            pasos: [
              "Activa Trazar.",
              "Digitaliza en la mesa.",
              "Termina presionando F dos veces."
            ],
            nota: "Línea interna que se va a cortar: termina con 7 y luego F."
          },
          {
            nombre: "Eje", atajo: "x",
            sirve: "Crea un eje (espejo) para hacer simetrías. Solo importa la dirección, no el largo.",
            pasos: [
              "Activa Eje.",
              "Clic en los dos puntos que forman el eje."
            ]
          },
          {
            nombre: "Simetría", atajo: "Y",
            sirve: "Copia en espejo uno o varios objetos usando un eje creado con Eje.",
            pasos: [
              "Activa Simetría.",
              "Clic en el eje.",
              "Clic en el objeto a reflejar."
            ]
          },
          {
            nombre: "Eje rot.", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Pivotar", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Duplicar", atajo: "Alt + D",
            sirve: "Copia puntos, líneas o piezas y los coloca donde quieras, en la misma hoja o en otra.",
            pasos: [
              "Activa Duplicar.",
              "Clic en el objeto a copiar.",
              "Escribe Desfase X, Desfase Y o Rotación y presiona Enter… o colócalo a mano.",
              "Clic para soltar la copia."
            ],
            nota: "La copia se hace en el mismo plano de trabajo que el original."
          },
          {
            nombre: "División segmento",
            sirve: "Divide una línea en partes iguales siguiendo su forma (también curvas).",
            pasos: [
              "Activa División segmento.",
              "Clic en el 1.er punto de la línea.",
              "Clic en el 2.º punto y mantén presionado (se resalta el tramo).",
              "Espacio para elegir el tramo correcto; suelta.",
              "Escribe el número de divisiones y presiona Enter."
            ],
            nota: "Crea puntos deslizantes y se gradúan con la línea."
          },
          {
            nombre: "Digit.", atajo: "Ctrl + D",
            sirve: "Retoma la digitalización en la hoja actual (desde la mesa, el ratón o el teclado).",
            pasos: [
              "Activa Digit.: aparece una «mariposa» en el punto más a la izquierda.",
              "En la mesa, haz clic en los dos puntos que corresponden en la pieza.",
              "Digitaliza (mismas teclas que Enl. dig.).",
              "Termina presionando F dos veces."
            ],
            nota: "Con Espacio recorres los puntos uno por uno."
          },
          {
            nombre: "Enl. dig.", atajo: "Ctrl + R",
            sirve: "Digitaliza un patrón en papel desde la mesa digitalizadora y saca la pieza automáticamente.",
            pasos: [
              "Antes (una sola vez): Config › Selección digit. (tipo de mesa) e Inic. digit.",
              "Activa Enl. dig.",
              "En la mesa, clic en 2 puntos del eje horizontal (o del hilo recto).",
              "Empieza el contorno con la tecla 2 y digitaliza.",
              "Termina con F dos veces: la pieza sale en una hoja nueva."
            ],
            teclas: [
              ["0", "Nueva hoja (saca la pieza actual)"],
              ["1", "Punto característico (esquina)"],
              ["2", "Inicio / fin de línea de contorno"],
              ["3", "Marca interna (por defecto '35')"],
              ["4", "Agujero cartón"],
              ["5", "Elegir tipo de piquete o de marca"],
              ["6", "Piquete en el último punto"],
              ["7", "Inicio / fin de línea interna"],
              ["8", "Eje de referencia (hilo recto, través…)"],
              ["9", "Reorientar el piquete"],
              ["A", "Gradación (TEV) / digitalizar otra talla"],
              ["B", "Piquete en corredera / redigitalizar talla"],
              ["C", "Punto de curva / saltar punto"],
              ["D", "Deshacer lo último"],
              ["E", "Nombrar punto / repetir gradación anterior"],
              ["F", "Sacar pieza · F dos veces = salir"],
              ["L (teclado)", "Escribir dl y rotación"],
              ["X (teclado)", "Escribir dx, dy y rotación"],
              ["↓ (teclado)", "Escribir dx, dy, rotación, dl y sagita"],
              ["G (teclado)", "Rehacer lo que deshiciste con D"]
            ],
            nota: "Las marcas, cortes y agujeros internos se digitalizan ANTES de cerrar el contorno."
          }
        ]
      }
    ]
  },

  /* ================================================================
     F2 · PIQUETES, ORIENTACIÓN, FIGURAS GEOMÉTRICAS
     ================================================================ */
  F2: {
    descripcion: "Herramientas para marcar piquetes y puntos de corte, girar o reflejar toda la hoja y trazar figuras básicas (rectángulos, círculos, óvalos y arcos).",

    glosario: [
      ["Piquete", "Pequeño corte o marca en la orilla de la pieza que sirve de guía para unir piezas al coser."],
      ["Parámetros asociados", "Menú donde eliges el tipo de piquete o de marca ANTES de usar la herramienta."],
      ["Restricción máxima", "El objeto queda amarrado a su punto de referencia: si el punto se mueve, el objeto lo sigue. Viene activada por defecto."],
      ["Magnetismo", "El objeto se acomoda respecto al punto, pero no queda amarrado a él."],
      ["Ninguna restricción", "El objeto y el punto son independientes."],
      ["Hilo recto / través", "Ejes que indican la dirección de la tela en la pieza."],
      ["Punto motivo", "Marca que sirve para acomodar la pieza sobre cuadros o rayas de la tela (tramas)."],
      ["Flecha", "Altura de un arco: la distancia desde el centro de la cuerda hasta lo más alto del arco."],
      ["Q W A S / moleta", "Teclas (o rueda del ratón) para ajustar giro, altura o radio mientras trazas."],
      ["~", "En los atajos de Modaris: ~ = tecla Alt."]
    ],

    grupos: [
      /* ========================= PIQUETES ========================= */
      {
        nombre: "Piquetes",
        herramientas: [
          {
            nombre: "Piquete", atajo: "c",
            sirve: "Coloca un piquete (de marca, de montaje o de identificación) en el contorno de la pieza. También sirve para cambiar el tipo de un piquete que ya existe.",
            pasos: [
              "(Opcional) elige el tipo de piquete en Parámetros asociados.",
              "Activa Piquete.",
              "Haz clic en la línea donde va el piquete… o sobre un piquete existente para cambiarlo."
            ],
            nota: "Sale perpendicular a la línea y hacia adentro de la pieza. Si no hay punto en ese lugar, Modaris lo crea solo."
          },
          {
            nombre: "Orientación", atajo: "Alt + u",
            sirve: "Cambia la dirección de un piquete. Puedes dirigirlo hacia un punto para que lo siga si ese punto se mueve.",
            pasos: [
              "Activa Orientación.",
              "Haz clic en el piquete: aparece una línea que gira libre.",
              "Gírala y haz clic para fijarla… o haz clic en un punto para que apunte hacia él."
            ],
            nota: "Con Restricción máxima el piquete queda amarrado al punto; con Magnetismo solo se orienta; con Ninguna restricción quedan independientes."
          },
          {
            nombre: "Forzar proyección",
            manual: "Forzar proyección de piquetes",
            sirve: "Elige hacia qué lado se proyecta el piquete (por defecto Modaris lo proyecta hacia la línea de corte más cercana).",
            pasos: [
              "Activa Forzar proyección.",
              "Haz clic en el piquete y mantén presionado.",
              "Presiona Espacio para cambiar de lado.",
              "Suelta el botón cuando esté en el lado correcto."
            ],
            nota: "Al pasar el cursor, una flecha muestra el lado forzado. Si después lo reorientas (Orientación, Bisectriz o Perpendicular) se pierde."
          },
          {
            nombre: "Bisectriz", atajo: "Alt + y",
            sirve: "Orienta un piquete que está en una esquina para que quede justo a la mitad del ángulo que forman las dos líneas.",
            pasos: [
              "Activa Bisectriz.",
              "Haz clic en el piquete y mantén presionado.",
              "Lleva el cursor al lado del ángulo que quieres y suelta."
            ]
          },
          {
            nombre: "Perpendicular", atajo: "Alt + h",
            sirve: "Vuelve a poner un piquete a 90° (perpendicular) de la línea donde está.",
            pasos: [
              "Activa Perpendicular.",
              "Haz clic en el piquete y mantén presionado.",
              "Lleva el cursor hacia el lado que quieres (hay 4 posiciones) y suelta."
            ]
          },
          {
            nombre: "Piquete exterior",
            sirve: "Pasa uno o varios piquetes hacia afuera de la pieza (o de regreso hacia adentro).",
            pasos: [
              "(Recomendado) activa Visualizar › Parte recortada (Alt + F9) para ver el resultado.",
              "Activa Piquete exterior.",
              "Haz clic en el piquete."
            ],
            nota: "Todo piquete nuevo nace hacia adentro; esta herramienta lo voltea."
          },
          {
            nombre: "Marcaje", atajo: "M",
            sirve: "Marca un punto con una herramienta de corte (taladro '35', '36', '37' o '1') o como punto motivo para acomodar la pieza sobre cuadros o rayas.",
            pasos: [
              "Elige el tipo de marca en Parámetros asociados.",
              "Si es punto motivo: escribe la trama vertical/horizontal y elige la categoría.",
              "Activa Marcaje.",
              "Haz clic en el punto que quieres marcar."
            ],
            teclas: [
              ["35 · 36 · 37 · 1", "Tipos de taladro / marca de corte."],
              ["Motivo horiz.", "Punto motivo respecto a la trama horizontal."],
              ["Motivo verti.", "Punto motivo respecto a la trama vertical."],
              ["Motivo vert. hori.", "Punto motivo respecto a ambas tramas."]
            ],
            nota: "La orden «Paso de marca» quita la marca elegida. Si dejas una marca elegida, los puntos Relativos que crees saldrán marcados."
          },
          {
            nombre: "Marca DF TR",
            sirve: "Pone un punto motivo justo donde se cruzan el hilo recto y el través de la pieza. Sirve para acomodarla sobre cuadros o rayas.",
            pasos: [
              "(Opcional) elige la marca motivo y la categoría en Parámetros asociados.",
              "Activa Marca DF TR.",
              "Haz clic en el hilo recto o en el través."
            ],
            nota: "Necesita los dos ejes. Si no se cruzan, la marca va donde se cruzarían al alargarlos."
          }
        ]
      },

      /* ========================= ORIENTACIÓN ========================= */
      {
        nombre: "Orientación",
        herramientas: [
          {
            nombre: "Sym x",
            sirve: "Voltea en espejo todo lo que hay en la hoja de arriba hacia abajo (respecto al eje X).",
            pasos: ["Activa Sym x: el cambio es inmediato."]
          },
          {
            nombre: "Sym y",
            sirve: "Voltea en espejo todo lo que hay en la hoja de izquierda a derecha (respecto al eje Y).",
            pasos: ["Activa Sym y: el cambio es inmediato."]
          },
          {
            nombre: "Rotar hoja",
            manual: "Rotación de la geometría de una hoja",
            sirve: "Gira todo lo que hay en la hoja un ángulo fijo.",
            lista: ["30°", "45°", "90°", "180°", "-90°", "-45°", "-30°"],
            pasos: ["Activa el botón del ángulo que quieres: el giro es inmediato."],
            nota: "Los ángulos positivos giran contra las manecillas del reloj."
          },
          {
            nombre: "Rotación 2 puntos",
            sirve: "Gira todo lo de la hoja para que dos puntos queden en la misma línea horizontal.",
            pasos: [
              "Activa Rotación 2 puntos.",
              "Clic en el 1.er punto (es el centro del giro).",
              "Clic en el 2.º punto: queda alineado en horizontal con el primero."
            ]
          }
        ]
      },

      /* ========================= FIG. GEOMÉTRICA ========================= */
      {
        nombre: "Fig. Geométrica",
        herramientas: [
          {
            nombre: "Rectángulo", atajo: "T",
            sirve: "Crea una pieza base rectangular, con un punto en cada esquina.",
            pasos: [
              "Activa Rectángulo.",
              "Clic en el punto de inicio: se abre la ventana de ancho, altura y rotación.",
              "Escribe las medidas y presiona Enter… o estíralo a mano y haz clic."
            ],
            teclas: [
              ["Shift (⇧)", "Mientras trazas: cuadrado perfecto."],
              ["Q W A S / moleta", "Mientras trazas: girar el rectángulo."]
            ],
            nota: "Las medidas son iguales en todas las tallas."
          },
          {
            nombre: "Círculo",
            sirve: "Crea un círculo dando su diámetro o trazándolo a mano.",
            pasos: [
              "Activa Círculo.",
              "Clic en el centro: se abre la ventana del diámetro.",
              "Escribe el diámetro y presiona Enter… o estíralo a mano y haz clic."
            ],
            nota: "Crea 5 puntos: el centro, 2 extremos y 2 puntos de curva. Mide igual en todas las tallas."
          },
          {
            nombre: "Óvalo",
            sirve: "Crea un óvalo a partir de dos círculos: el primero, la distancia entre ellos, el segundo y la altura.",
            pasos: [
              "Activa Óvalo y señala dónde empieza.",
              "Clic sostenido: arrastra hasta el tamaño del 1.er círculo y suelta.",
              "Sin presionar, mueve el ratón hasta donde va el 2.º círculo.",
              "Clic sostenido: arrastra el tamaño del 2.º círculo y suelta.",
              "Ajusta la altura con Q W A S o la moleta y haz clic para validar."
            ],
            nota: "También puedes escribir 1.er radio, 2.º radio y altura, presionar Enter y luego solo estirarlo y orientarlo."
          },
          {
            nombre: "Arco_f",
            sirve: "Crea un arco indicando su flecha (qué tan alto se curva).",
            pasos: [
              "Activa Arco_f.",
              "Clic en el punto inicial: se abre la ventana Flecha.",
              "Escribe la flecha y presiona Enter, luego orienta el arco, dale largo y haz clic… o trázalo a mano ajustando la flecha con Q W A S o la moleta."
            ],
            nota: "Flecha = distancia del centro de la cuerda a lo más alto del arco."
          },
          {
            nombre: "Arco_r",
            sirve: "Crea un arco entre dos puntos indicando su radio.",
            pasos: [
              "Activa Arco_r.",
              "Clic en el punto de salida: se abre la ventana Radio.",
              "Escribe el radio y presiona Enter, orienta el arco y haz clic… o trázalo a mano ajustando el radio con Q W A S o la moleta."
            ]
          },
          {
            nombre: "Tang. 2 círculos",
            sirve: "Traza dos círculos y te propone las 4 rectas tangentes posibles entre ellos para que elijas una.",
            pasos: [
              "Activa Tang. 2 círculos.",
              "Escribe el radio de cada círculo (Enter) o trázalos a mano.",
              "Presiona Espacio para ver cada tangente.",
              "Haz clic en la tangente que quieres."
            ]
          }
        ]
      }
    ]
  },

  /* ================================================================
     F3 · MODIFICACIÓN
     ================================================================ */
  F3: {
    descripcion: "Herramientas para corregir lo que ya trazaste: mover, estirar o alargar líneas, cortar y unir curvas, fijar puntos con chinchetas y amarrar valores a medidas.",

    glosario: [
      ["Chincheta", "Punto «clavado»: se queda fijo cuando mueves o estiras lo demás."],
      ["Homotecia", "Agrandar o achicar una forma conservando sus proporciones."],
      ["Gradación / leyes de evolución", "Cómo cambia cada punto de una talla a otra."],
      ["Talla base", "La talla en la que trazas; las demás se calculan a partir de ella."],
      ["Punto de extremo", "Punto donde empieza o termina una línea."],
      ["Punto constante", "Punto que está a una distancia fija sobre la línea (ver F1)."],
      ["Medida MCM", "Medida guardada en la tabla de medidas de Modaris; se puede amarrar a puntos o paralelas."],
      ["Parámetros asociados", "Menú con las opciones de la herramienta; elígelas antes de usarla."],
      ["~", "En los atajos de Modaris: ~ = tecla Alt."]
    ],

    grupos: [
      /* ========================= MODIFICACIÓN DE LÍNEA ========================= */
      {
        nombre: "Modificación de línea",
        herramientas: [
          {
            nombre: "Desplazar", atajo: "D",
            sirve: "Mueve un punto junto con todo lo que está unido a él (líneas, otros puntos). La forma se acomoda sola entre los puntos con chincheta.",
            pasos: [
              "(Opcional) elige las opciones de movimiento en Parámetros asociados.",
              "(Opcional) pon chinchetas en los puntos que no quieres que se muevan.",
              "Activa Desplazar y haz clic en el punto a mover.",
              "Escribe Desfase x, Desfase y, Rotación o dl y presiona Enter… o muévelo a mano y haz clic."
            ],
            lista: [
              "Talla base: mueve la talla base y elige si la gradación se queda igual, gira o gira y se escala.",
              "Talla por talla: mueve una sola talla sin tocar las demás.",
              "Todas tallas / Selección de tallas / Todos tipos esc.: a qué tallas o tipos de escalado se aplica."
            ],
            nota: "Atajo alterno: Ctrl + botón 2 del ratón. La posición original queda marcada como «huella» (se quita en Visualizar › Trazar)."
          },
          {
            nombre: "Estirar", atajo: "Alt + p",
            sirve: "Gira y agranda o achica una parte de la pieza tomando un punto como pivote, como si la estiraras.",
            pasos: [
              "(Opcional) elige las opciones de movimiento en Parámetros asociados.",
              "Activa Estirar.",
              "Clic en el 1.er punto (el pivote, no se mueve).",
              "Clic en el 2.º punto (el que vas a estirar).",
              "Escribe los valores (Desfase, Rotación, x, y, dl o Escala) y presiona Enter… o estíralo a mano y haz clic."
            ],
            nota: "Usa las mismas opciones de movimiento que Desplazar."
          },
          {
            nombre: "Alargar", atajo: "$",
            sirve: "Cambia el largo de una curva entre dos puntos a una medida exacta, sin cambiar su forma.",
            pasos: [
              "Activa Alargar.",
              "Clic en el 1.er extremo de la curva.",
              "Clic sostenido en el 2.º extremo (Espacio si hay dudas de qué curva es).",
              "Escribe el largo total o lo que quieres agregar o quitar (dl) y presiona Enter."
            ]
          },
          {
            nombre: "Ajustar 2 líneas",
            sirve: "Alarga o recorta una línea hasta que toque otra línea de referencia.",
            pasos: [
              "Activa Ajustar 2 líneas.",
              "Clic en la línea que quieres alargar o recortar.",
              "Clic en la línea de referencia."
            ],
            nota: "La primera línea es la que cambia; la segunda no se mueve. Con «Suprimir el último punto» se borra el extremo viejo."
          },
          {
            nombre: "Al. Línea", atajo: "-",
            manual: "Alargar línea",
            sirve: "Prolonga una línea en línea recta desde uno de sus extremos.",
            pasos: [
              "Activa Al. Línea.",
              "Clic en la línea, cerca del extremo que quieres alargar.",
              "Muévela hasta el largo deseado y haz clic… o escribe el dl, Enter y clic."
            ],
            nota: "El extremo desde donde se alarga se vuelve punto característico (esquina)."
          },
          {
            nombre: "Retiro",
            manual: "Retiro efectivo (retracción)",
            sirve: "Agranda o reduce una pieza (o parte de ella) por porcentaje. Sirve para compensar el encogimiento de la tela.",
            pasos: [
              "Marca o desmarca «Retracción todas las tallas».",
              "Para una parte: selecciona sus puntos y haz clic en el punto de origen. Para toda la pieza: clic en cualquier lugar de la hoja.",
              "Activa Retiro.",
              "Escribe el porcentaje en x y en y y presiona Enter."
            ],
            nota: "Sin «todas las tallas» se usa el valor de la talla base para todas; con él, se calcula según cada talla. En piezas dependientes, selecciona toda la pieza primero o se aplica a todo el patrón."
          },
          {
            nombre: "Simplificado", atajo: "Alt + s",
            sirve: "Suaviza una curva quitándole puntos de más.",
            pasos: [
              "Activa Simplificado.",
              "Clic en la curva (o en una selección de curvas).",
              "Escribe el desvío permitido y presiona Enter."
            ],
            nota: "Entre más grande el desvío, más puntos quita y más simple queda la curva."
          }
        ]
      },

      /* ========================= MODIFICACIÓN DE PUNTO ========================= */
      {
        nombre: "Modificación de punto",
        herramientas: [
          {
            nombre: "Modificar", atajo: "r",
            sirve: "Cambia la posición de un punto o línea ya creados: alargar, acortar o «excavar» una línea, o mover un punto deslizante, constante o relativo.",
            pasos: [
              "Activa Modificar.",
              "Clic en el objeto.",
              "Escribe los valores y presiona Enter… o muévelo a mano y haz clic."
            ],
            nota: "También sirve para mover los «ganchos» (tangentes) de las curvas Bézier."
          },
          {
            nombre: "Sección",
            sirve: "Corta una curva en un punto: quedan dos líneas unidas por ese punto.",
            pasos: [
              "Activa Sección.",
              "Clic en el punto donde quieres cortar."
            ],
            nota: "El punto se vuelve punto de extremo de las dos líneas nuevas."
          },
          {
            nombre: "Fusión curvas",
            sirve: "Une dos líneas que comparten un punto en una sola línea.",
            pasos: [
              "Activa Fusión curvas.",
              "Si son 2 líneas: clic en su punto común.",
              "Si el punto toca más de 2 líneas: clic sostenido en la 1.ª línea, arrastra hasta la 2.ª y suelta."
            ],
            nota: "Las curvas Bézier solo se fusionan con otras Bézier (actívalas en Visualizar › Bézier para reconocerlas)."
          },
          {
            nombre: "Unido", atajo: "Alt + 5",
            sirve: "Junta dos puntos en uno solo. Si son de líneas distintas, quedan conectadas por ese punto.",
            pasos: [
              "Activa Unido.",
              "Clic en el 1.er punto.",
              "Clic en el 2.º punto."
            ]
          },
          {
            nombre: "Separado", atajo: "Alt + 6",
            sirve: "Lo contrario de Unido: suelta una línea (o una marca) de un punto que compartía.",
            pasos: [
              "Activa Separado.",
              "Clic en el punto común.",
              "Clic para confirmar."
            ],
            nota: "Quedan dos puntos encimados, uno para cada línea."
          },
          {
            nombre: "Insertar punto", atajo: "Alt + 7",
            sirve: "Convierte un punto deslizante, constante o de intersección en un punto característico de la línea.",
            pasos: [
              "Activa Insertar punto.",
              "Clic en el punto."
            ]
          },
          {
            nombre: "Suprimir restricción",
            sirve: "Quita la dependencia de un objeto (simétrico, paralelo, deslizante, constante o relativo) para que quede libre.",
            pasos: [
              "Activa Suprimir restricción.",
              "Clic en el objeto (o en uno de la selección)."
            ],
            nota: "Los puntos deslizantes y constantes se vuelven puntos característicos."
          },
          {
            nombre: "Supresión", atajo: "Supr",
            sirve: "Borra cualquier objeto: puntos, líneas, marcas…",
            pasos: [
              "Activa Supresión.",
              "Clic en el objeto (o en uno de la selección)."
            ],
            nota: "Para borrar todos los puntos de una línea, mantén Shift (⇧) al hacer clic. Si otros objetos dependen de él, Modaris te avisa antes de borrar."
          }
        ]
      },

      /* ========================= MEDIDAS ========================= */
      {
        nombre: "Asociar a medidas",
        herramientas: [
          {
            nombre: "Asociar", atajo: "=",
            sirve: "Hace que varios puntos constantes, pliegues o paralelas dependientes compartan el mismo valor: si cambias uno, cambian todos.",
            lista: [
              "Punto constante con otro punto constante o con una paralela dependiente.",
              "Paralela dependiente con otra paralela o con un punto constante.",
              "También sirve para quitar la asociación."
            ],
            nota: "Solo funciona con objetos que no estén restringidos por una medida."
          },
          {
            nombre: "Asociar a medida", atajo: "Alt + n",
            sirve: "Amarra un punto constante, pliegue o paralela dependiente a una medida: si cambias la medida cambia el objeto, y al revés.",
            lista: [
              "Añadir a baremo: agrega la medida a la tabla MCM.",
              "Nombrar la medida: te deja ponerle nombre (si no, se llama «Medida 10», «Medida 11»…).",
              "Restringir / Limitar a la tabla: solo muestra medidas de la tabla abierta."
            ],
            nota: "El objeto asociado se ve resaltado (brillante). Cada objeto solo puede tener una medida."
          },
          {
            nombre: "Restricción por medida", atajo: "n",
            sirve: "Hace que un punto constante, pliegue o paralela dependiente siga una medida, una fórmula o una medida MCM. Ya no se puede mover ni escalar a mano.",
            lista: [
              "Restringir a una medida, a otro objeto, a un valor o a una fórmula.",
              "También sirve para quitar la restricción."
            ],
            nota: "El objeto restringido se ve en amarillo dorado. Al pasar el cursor ves su nombre, la medida entre corchetes y el valor, ej. Point 27 [1/4 bassin] 250.00 mm."
          }
        ]
      },

      /* ========================= CHINCHETAS ========================= */
      {
        nombre: "Chinchetas",
        herramientas: [
          {
            nombre: "Chincheta", atajo: "Alt + e",
            sirve: "Clava uno o varios puntos para que no se muevan al desplazar o estirar. Si el punto ya tiene chincheta, se la quita.",
            pasos: [
              "Activa Chincheta.",
              "Clic en el punto (o en uno de la selección)."
            ]
          },
          {
            nombre: "Ch. Pts. Escalado", atajo: "h",
            sirve: "Clava de una vez todos los puntos escalados de la hoja.",
            pasos: ["Activa Ch. Pts. Escalado: el cambio es inmediato."]
          },
          {
            nombre: "Ch. Pts. Caract.",
            sirve: "Clava de una vez todos los puntos característicos (esquinas) de la hoja, incluidas las piezas unidas.",
            pasos: ["Activa Ch. Pts. Caract.: el cambio es inmediato."]
          },
          {
            nombre: "Ch. Extremidad", atajo: "f",
            sirve: "Clava de una vez todos los puntos de extremo de las líneas de la hoja.",
            pasos: ["Activa Ch. Extremidad: el cambio es inmediato."]
          },
          {
            nombre: "Quit. Ch.", atajo: "e",
            manual: "Quitar chinchetas",
            sirve: "Quita todas las chinchetas de la hoja de una vez.",
            pasos: ["Activa Quit. Ch.: el cambio es inmediato."],
            nota: "Los extremos de una línea suelta siempre quedan clavados automáticamente."
          }
        ]
      }
    ]
  }
};

/* =====================================================================
   ANTES DE EMPEZAR: pasos previos a usar las funciones
   (crear la hoja, hacer tu archivo, guardar...). Cada paso tiene su
   video en js/videos.js, sección "Inicio".
   ===================================================================== */
const ANTES = { tecla: "Inicio", nombre: "Antes de empezar", color: "#bfe3f5" };
HERRAMIENTAS.Inicio = {
  descripcion: "Los pasos que haces antes de usar las funciones: preparar tu archivo y tu hoja de trabajo.",
  grupos: [
    {
      nombre: "Primeros pasos",
      herramientas: [
        { nombre: "Crear tu archivo", pendiente: true,
          sirve: "Crear un archivo nuevo de Modaris donde vas a guardar tu patrón." },
        { nombre: "Crear la hoja", pendiente: true,
          sirve: "Abrir una hoja de trabajo nueva para empezar a trazar." },
        { nombre: "Guardar tu documento", pendiente: true,
          sirve: "Guardar tu trabajo para no perder tus avances." }
      ]
    }
  ]
};