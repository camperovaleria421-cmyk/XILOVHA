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
  { tecla: "F4",  nombre: "Industrialización, pieza",               color: "#cfcfcf", listo: true  },
  { tecla: "F5",  nombre: "Piezas derivadas, pliegues, CAD-CAM",    color: "#cdb6d8", listo: false },
  { tecla: "F6",  nombre: "Escalado",                               color: "#7fd0cc", listo: false },
  { tecla: "F7",  nombre: "Evolución, modif. plancha",              color: "#9fd39b", listo: false },
  { tecla: "F8",  nombre: "Medidas, uniones, variantes",            color: "#ead98a", listo: false },
  { tecla: "~F1", nombre: "Alteraciones, Modaris 3D",               color: "#a99be0", listo: false }
];

const HERRAMIENTAS = {
  F1: {
    descripcion: "Todo empieza aquí: con estas herramientas pones puntos y dibujas las líneas que forman tu patrón.",

    glosario: [
      ["dx / dy", "Cuánto te mueves hacia los lados (dx) o hacia arriba y abajo (dy), contando desde el punto que tocaste."],
      ["dl", "El largo directo entre dos puntos, como si tendieras un hilo entre ellos."],
      ["Rotación", "La inclinación en grados: 0° apunta a la derecha y 90° hacia arriba. Para inclinar hacia el otro lado ponle signo menos (ej. -45)."],
      ["~  y  ^", "Así aparecen las teclas en los atajos: ~ es Alt y ^ es Ctrl."],
      ["Mayúsculas", "Una misma letra puede abrir dos herramientas: «x» minúscula es Eje y «X» mayúscula es Paralelo."],
      ["Punto característico", "Punto donde la línea cambia de dirección y se forma una esquina."],
      ["Punto de curva", "Punto que la línea atraviesa sin quebrarse, dejando la curva suave."],
      ["Botones del ratón", "El botón 1 pone un punto, el 2 quita el último que pusiste y el 3 da la línea por terminada."],
      ["Validar", "Aceptar lo que escribiste, ya sea con Enter (⏎) o con un clic."]
    ],

    grupos: [
      /* ========================= PUNTOS ========================= */
      {
        nombre: "Puntos",
        herramientas: [
          {
            nombre: "Deslizante",
            sirve: "Pon un punto que «viaja» con la línea: guarda su lugar en proporción. Si lo dejas a un tercio del largo y después la línea crece o se encoge, el punto se recorre para seguir a un tercio.",
            pasos: [
              "Elige Deslizante en el menú.",
              "Presiona sobre la línea sin soltar; verás aparecer el punto.",
              "Suelta y recórrelo a lo largo de la línea.",
              "Da clic en el lugar donde debe quedarse."
            ],
            nota: "Al escalar, en cada talla conserva la misma proporción del largo."
          },
          {
            nombre: "Pto. Constante", atajo: "V", manual: "Desarrollo (V)",
            sirve: "Pon un punto sobre una línea a una medida fija, contada desde otro punto de esa misma línea. Si la línea cambia de forma o de largo, la medida se respeta.",
            pasos: [
              "Elige la herramienta.",
              "Toca el punto de la línea desde el que vas a medir.",
              "Teclea la medida y da Enter, o llévalo con el ratón y da clic."
            ],
            nota: "¿El punto de partida está donde se juntan dos líneas? Coloca el cursor sobre la línea que quieres usar y presiona Espacio para cambiar a ella."
          },
          {
            nombre: "Serie de puntos constantes", pendiente: true,
            sirve: "Cuando la eliges aparece una ventana para decidir qué marca llevarán los puntos:",
            lista: ["Sin marcaje", "Taladro '35', '36', '37' y '1'", "Motivo vert. / horiz. / vert. horiz.", "Trama vertical y Trama horizontal", "Categoría motivo fallo", "Colocar piquetes en las series de puntos constantes"]
          },
          {
            nombre: "Desplazado", pendiente: true,
            sirve: "En el menú se ve en gris, es decir, todavía no se puede usar."
          },
          {
            nombre: "Punto Enlace",
            sirve: "Crea un punto separado de la línea pero «atado» a otro punto: cuando el punto guía se mueve, el nuevo se va con él.",
            pasos: [
              "Elige Punto Enlace.",
              "Toca el punto que servirá de guía.",
              "Dale su posición escribiendo dx, dy, dl o rotación, o llévalo con el ratón.",
              "Da clic para dejarlo."
            ],
            teclas: [
              ["Espacio 1 vez", "Lo deja girar libremente alrededor del punto guía."],
              ["Espacio 2 veces", "Se apoya en un punto nuevo que se crea sobre la curva."],
              ["Espacio 3 veces", "Vuelve a quedar en perpendicular al punto guía."]
            ],
            nota: "En las demás tallas se mueve igual que su punto guía."
          },
          {
            nombre: "Relativo", atajo: "Alt + r",
            sirve: "Crea un punto a cierta medida de otro punto o de cualquier lugar de la hoja. A diferencia de Punto Enlace, queda suelto: si el otro se mueve, este no.",
            pasos: [
              "Elige Relativo.",
              "Toca un punto de partida o un lugar vacío.",
              "Escribe dx, dy, dl o rotación, o llévalo con el ratón.",
              "Da clic para dejarlo."
            ],
            nota: "Al crearse copia el escalado del punto de partida."
          },
          {
            nombre: "Intersección", atajo: "I",
            sirve: "Pone un punto en el cruce de dos líneas. Si no llegan a tocarse, lo pone donde se encontrarían si las prolongaras.",
            pasos: [
              "Elige Intersección.",
              "Forma rápida: da clic justo en el cruce.",
              "Otra forma: presiona en la primera línea, arrastra sin soltar hasta la segunda y suelta."
            ],
            nota: "Conviene usarla para tener puntos de unión antes de sacar una pieza a mano."
          },
          {
            nombre: "Añadir punto", atajo: "Alt + 4",
            sirve: "Agrega un punto encima de una línea, medido desde un punto que tomas de referencia.",
            pasos: [
              "Elige Añadir punto.",
              "Toca el punto de referencia.",
              "Si quieres una medida exacta, escribe dx, dy o el largo y da Enter.",
              "Lleva el punto a la línea y da clic."
            ],
            nota: "Con clic normal el punto queda como esquina; si mantienes Shift (⇧), queda como punto de curva."
          },
          {
            nombre: "Taladro", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Ali 2Pts", atajo: "A",
            sirve: "Pone un punto (o los que tengas seleccionados) a la misma altura o en la misma vertical que otro punto.",
            pasos: [
              "Elige Ali 2Pts.",
              "Toca el punto que manda la posición.",
              "Con Espacio cambias entre alinear en horizontal o en vertical.",
              "Toca el punto que se va a acomodar."
            ],
            nota: "Con varios puntos seleccionados basta con tocar uno: se acomodan todos juntos."
          },
          {
            nombre: "Ali 3Pts", atajo: "Alt + a",
            sirve: "Primero marcas una línea guía con dos puntos; luego, cada punto que toques baja en ángulo recto hasta quedar sobre esa guía.",
            pasos: [
              "Elige Ali 3Pts.",
              "Toca el primer punto de la guía.",
              "Toca el segundo punto de la guía.",
              "Toca el punto que quieres llevar a la guía."
            ]
          },
          {
            nombre: "División",
            sirve: "Reparte puntos a distancias iguales sobre el tramo recto que une dos puntos.",
            pasos: [
              "Elige División.",
              "Toca el punto de inicio.",
              "Toca el punto final.",
              "Escribe en cuántas partes quieres dividir y da Enter."
            ],
            nota: "Siempre sale un punto menos que el número de partes (4 partes = 3 puntos). Quedan en recta; para que sigan una curva usa División segmento."
          }
        ]
      },

      /* ========================= LÍNEAS ========================= */
      {
        nombre: "Líneas",
        herramientas: [
          {
            nombre: "L. Recta", atajo: "O",
            sirve: "Dibuja una recta. Puedes indicar su largo (dl) y su inclinación (rotación) para que salga exacta.",
            pasos: [
              "Elige L. Recta.",
              "Da clic donde empieza.",
              "Escribe sus valores y da Enter, o estírala con el ratón y da clic donde termina."
            ],
            teclas: [
              ["Shift + clic al inicio", "La recta arranca formando un ángulo exacto con otra línea o curva (90° si no lo cambias)."],
              ["Shift + clic al final", "Obliga a la recta a terminar justo en ese punto."]
            ]
          },
          {
            nombre: "Paralelo", atajo: "X",
            sirve: "Saca una copia paralela de una línea, separada la distancia que tú digas.",
            pasos: [
              "Elige Paralelo.",
              "Toca la línea que vas a copiar.",
              "Escribe la separación y da Enter, o jálala con el ratón y da clic."
            ],
            nota: "En las tallas sigue el escalado de la línea de origen. Al pasar el cursor sobre ella se ilumina la línea de la que salió."
          },
          {
            nombre: "Oblicuo", pendiente: true,
            sirve: "Información pendiente."
          },
          {
            nombre: "Bézier", atajo: "b",
            sirve: "Para curvas suaves como escotes, sisas o tiros. Su forma depende de dónde pongas los puntos.",
            pasos: [
              "Elige Bézier.",
              "Da clic donde empieza la curva.",
              "Ve dando clic para cada punto siguiente.",
              "Con el botón 3 terminas."
            ],
            teclas: [
              ["Clic", "Deja un punto con esquina."],
              ["Shift + clic", "Deja un punto de curva, sin quiebre."],
              ["Botón 2", "Quita el punto que pusiste al último."]
            ],
            nota: "Para afinarla, enciende Visualización › Bézier y Pts de curva; luego, con Modificar, jala los «ganchos» (tangentes). Si mantienes Alt o Shift, el ajuste se comporta distinto."
          },
          {
            nombre: "Semi-circ.", atajo: "S",
            sirve: "Dibuja arcos de tres en tres puntos: donde empieza, por dónde se curva y donde acaba.",
            pasos: [
              "Elige Semi-circ.",
              "Da clic en el inicio.",
              "Da clic en un segundo punto que marca qué tanto se curva.",
              "Da clic en el tercero para cerrar el arco; sigue de tres en tres si necesitas más.",
              "Con el botón 3 terminas."
            ],
            nota: "Con Shift el punto queda suave; sin Shift queda como esquina."
          },
          {
            nombre: "Trazar",
            sirve: "Pasa a la computadora, con la mesa digitalizadora, líneas de un patrón o líneas internas de una pieza, sin formar contorno ni crear pieza.",
            pasos: [
              "Elige Trazar.",
              "Marca las líneas en la mesa.",
              "Para terminar, presiona F dos veces."
            ],
            nota: "Si es una línea interna que se va a cortar, ciérrala con 7 y luego F."
          },
          {
            nombre: "Eje", atajo: "x",
            sirve: "Marca la línea que hará de espejo para las simetrías. Lo que cuenta es hacia dónde apunta, no qué tan larga es.",
            pasos: [
              "Elige Eje.",
              "Toca los dos puntos por donde pasa."
            ]
          },
          {
            nombre: "Simetría", atajo: "Y",
            sirve: "Hace el reflejo de uno o varios objetos del otro lado de un eje que ya creaste.",
            pasos: [
              "Elige Simetría.",
              "Toca el eje.",
              "Toca lo que quieres reflejar."
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
            sirve: "Hace una copia de puntos, líneas o piezas y te deja ponerla donde quieras, en esta hoja o en otra.",
            pasos: [
              "Elige Duplicar.",
              "Toca lo que vas a copiar.",
              "Escribe Desfase X, Desfase Y o Rotación y da Enter, o acomódala con el ratón.",
              "Da clic para dejar la copia."
            ],
            nota: "La copia queda en el mismo plano de trabajo que el objeto original."
          },
          {
            nombre: "División segmento",
            sirve: "Parte una línea en tramos iguales respetando su forma, aunque sea curva.",
            pasos: [
              "Elige División segmento.",
              "Toca el primer punto del tramo.",
              "Presiona el segundo punto sin soltar; el tramo se ilumina.",
              "Si se iluminó otro tramo, cambia con Espacio; luego suelta.",
              "Escribe cuántas partes quieres y da Enter."
            ],
            nota: "Los puntos que crea son deslizantes, así que en las tallas se acomodan con la línea."
          },
          {
            nombre: "Digit.", atajo: "Ctrl + D",
            sirve: "Continúa digitalizando sobre la hoja abierta, ya sea con la mesa, el ratón o el teclado.",
            pasos: [
              "Elige Digit.; verás una figura de «mariposa» en el punto que está más a la izquierda.",
              "En la mesa, toca los dos puntos de la pieza que le corresponden.",
              "Sigue digitalizando; las teclas son las mismas que en Enl. dig.",
              "Para terminar, presiona F dos veces."
            ],
            nota: "Con Espacio vas saltando de un punto a otro."
          },
          {
            nombre: "Enl. dig.", atajo: "Ctrl + R",
            sirve: "Pasa un patrón de papel a Modaris con la mesa digitalizadora; al terminar, la pieza se crea sola.",
            pasos: [
              "Solo la primera vez: en Config elige Selección digit. (tu modelo de mesa) y luego Inic. digit.",
              "Elige Enl. dig.",
              "En la mesa, toca 2 puntos del eje horizontal o del hilo recto.",
              "Arranca el contorno con la tecla 2 y ve marcándolo.",
              "Cierra con F dos veces; la pieza aparece en una hoja nueva."
            ],
            teclas: [
              ["0", "Saca la pieza que llevas y abre otra hoja"],
              ["1", "Punto de esquina"],
              ["2", "Empieza o termina el contorno"],
              ["3", "Marca dentro de la pieza (de inicio, la '35')"],
              ["4", "Perforación del cartón"],
              ["5", "Escoger qué piquete o marca usar"],
              ["6", "Piquete sobre el último punto marcado"],
              ["7", "Empieza o termina una línea interna"],
              ["8", "Eje de referencia (hilo recto, través…)"],
              ["9", "Cambiar la dirección del piquete"],
              ["A", "Escalado (TEV) o marcar otra talla"],
              ["B", "Piquete de corredera o volver a marcar una talla"],
              ["C", "Punto de curva o brincar un punto"],
              ["D", "Quitar lo último que hiciste"],
              ["E", "Ponerle nombre al punto o repetir el escalado anterior"],
              ["F", "Crear la pieza · F dos veces para salir"],
              ["L (teclado)", "Teclear dl y rotación"],
              ["X (teclado)", "Teclear dx, dy y rotación"],
              ["↓ (teclado)", "Teclear dx, dy, rotación, dl y sagita"],
              ["G (teclado)", "Recuperar lo que quitaste con D"]
            ],
            nota: "Primero marca lo de adentro (marcas, cortes y perforaciones) y al final cierra el contorno."
          }
        ]
      }
    ]
  },

  /* ================================================================
     F2 · PIQUETES, ORIENTACIÓN, FIGURAS GEOMÉTRICAS
     ================================================================ */
  F2: {
    descripcion: "Aquí pones piquetes y marcas de corte, giras o volteas todo lo de la hoja y dibujas figuras sencillas: rectángulos, círculos, óvalos y arcos.",

    glosario: [
      ["Piquete", "Muesca chiquita en la orilla de la pieza; al coser te dice qué punto va con cuál."],
      ["Parámetros asociados", "El menú donde dejas listo el tipo de piquete o de marca antes de empezar."],
      ["Restricción máxima", "El objeto queda pegado a su punto: si el punto cambia de lugar, el objeto lo acompaña. Es la opción que viene puesta."],
      ["Magnetismo", "El objeto se coloca guiado por el punto, pero sin quedar pegado a él."],
      ["Ninguna restricción", "Objeto y punto no guardan ninguna relación."],
      ["Hilo recto / través", "Las líneas que te dicen en qué dirección va la tela dentro de la pieza."],
      ["Punto motivo", "Marca para que la pieza caiga bien sobre telas de cuadros o rayas."],
      ["Flecha", "Qué tanto sube un arco: la distancia del centro de la cuerda a la parte más alta."],
      ["Q W A S / moleta", "Teclas o rueda del ratón para cambiar el giro, la altura o el radio mientras dibujas."],
      ["~", "En los atajos, ~ quiere decir Alt."]
    ],

    grupos: [
      /* ========================= PIQUETES ========================= */
      {
        nombre: "Piquetes",
        herramientas: [
          {
            nombre: "Piquete", atajo: "c",
            sirve: "Pone una muesca en la orilla de la pieza (para marcar, para montar o para identificar). Si tocas una que ya existe, le cambia el tipo.",
            pasos: [
              "Si quieres otro tipo, escógelo antes en Parámetros asociados.",
              "Elige Piquete.",
              "Toca la línea donde lo quieres, o un piquete ya puesto para cambiarlo."
            ],
            nota: "Siempre sale a 90° de la línea y apuntando hacia dentro. Si en ese lugar no había punto, se crea uno automáticamente."
          },
          {
            nombre: "Orientación", atajo: "Alt + u",
            sirve: "Cambia hacia dónde apunta un piquete. Si lo diriges a un punto, el piquete lo seguirá cuando ese punto se mueva.",
            pasos: [
              "Elige Orientación.",
              "Toca el piquete; aparece una línea que puedes girar.",
              "Gírala y da clic para dejarla, o toca un punto para que apunte hacia él."
            ],
            nota: "Lo que pase después depende de la restricción: con Restricción máxima queda atado al punto, con Magnetismo solo toma su dirección y con Ninguna restricción no guardan relación."
          },
          {
            nombre: "Forzar proyección",
            manual: "Forzar proyección de piquetes",
            sirve: "Decide de qué lado se proyecta el piquete. Si no haces nada, va hacia la línea de corte que tenga más cerca.",
            pasos: [
              "Elige Forzar proyección.",
              "Presiona el piquete sin soltar.",
              "Cambia de lado con Espacio.",
              "Suelta cuando quede del lado que buscas."
            ],
            nota: "Al pasar el cursor, una flechita indica el lado elegido. Si luego lo vuelves a orientar (con Orientación, Bisectriz o Perpendicular), este ajuste se borra."
          },
          {
            nombre: "Bisectriz", atajo: "Alt + y",
            sirve: "Para un piquete que está en una esquina: lo acomoda exactamente a la mitad del ángulo entre las dos líneas.",
            pasos: [
              "Elige Bisectriz.",
              "Presiona el piquete sin soltar.",
              "Mueve el cursor hacia el lado del ángulo que quieres y suelta."
            ]
          },
          {
            nombre: "Perpendicular", atajo: "Alt + h",
            sirve: "Regresa un piquete a quedar en ángulo recto con su línea.",
            pasos: [
              "Elige Perpendicular.",
              "Presiona el piquete sin soltar.",
              "Mueve el cursor hacia la dirección que quieres (hay 4 opciones) y suelta."
            ]
          },
          {
            nombre: "Piquete exterior",
            sirve: "Saca uno o varios piquetes hacia la parte de afuera de la pieza, o los regresa adentro.",
            pasos: [
              "Para ver bien el cambio, enciende Visualizar › Parte recortada (Alt + F9).",
              "Elige Piquete exterior.",
              "Toca el piquete."
            ],
            nota: "Los piquetes siempre se crean hacia dentro; con esta herramienta les das la vuelta."
          },
          {
            nombre: "Marcaje", atajo: "M",
            sirve: "Le pone a un punto una marca de corte (taladro '35', '36', '37' o '1') o lo convierte en punto motivo para casar cuadros o rayas.",
            pasos: [
              "Escoge la marca en Parámetros asociados.",
              "Si es punto motivo, indica la trama vertical u horizontal y la categoría.",
              "Elige Marcaje.",
              "Toca el punto."
            ],
            teclas: [
              ["35 · 36 · 37 · 1", "Distintas marcas de taladro o de corte."],
              ["Motivo horiz.", "Punto motivo que se guía por la trama horizontal."],
              ["Motivo verti.", "Punto motivo que se guía por la trama vertical."],
              ["Motivo vert. hori.", "Punto motivo que se guía por las dos tramas."]
            ],
            nota: "Para quitar la marca usa la orden «Paso de marca». Ojo: mientras tengas una marca escogida, los puntos que hagas con Relativo saldrán con ella."
          },
          {
            nombre: "Marca DF TR",
            sirve: "Pone un punto motivo en el cruce del hilo recto con el través, para casar la pieza con cuadros o rayas.",
            pasos: [
              "Si quieres, antes escoge la marca y la categoría en Parámetros asociados.",
              "Elige Marca DF TR.",
              "Toca el hilo recto o el través."
            ],
            nota: "La pieza debe tener los dos ejes. Si no llegan a cruzarse, la marca se pone donde se encontrarían al prolongarlos."
          }
        ]
      },

      /* ========================= ORIENTACIÓN ========================= */
      {
        nombre: "Orientación",
        herramientas: [
          {
            nombre: "Sym x",
            sirve: "Refleja todo el contenido de la hoja de arriba hacia abajo, usando el eje X como espejo.",
            pasos: ["Elige Sym x; el cambio se ve al instante."]
          },
          {
            nombre: "Sym y",
            sirve: "Refleja todo el contenido de la hoja de izquierda a derecha, usando el eje Y como espejo.",
            pasos: ["Elige Sym y; el cambio se ve al instante."]
          },
          {
            nombre: "Rotar hoja",
            manual: "Rotación de la geometría de una hoja",
            sirve: "Da vuelta a todo lo de la hoja con uno de estos ángulos fijos:",
            lista: ["30°", "45°", "90°", "180°", "-90°", "-45°", "-30°"],
            pasos: ["Elige el botón del ángulo; gira al instante."],
            nota: "Con números positivos gira al contrario de las manecillas del reloj."
          },
          {
            nombre: "Rotación 2 puntos",
            sirve: "Gira todo lo de la hoja hasta que dos puntos queden a la misma altura.",
            pasos: [
              "Elige Rotación 2 puntos.",
              "Toca el primer punto; alrededor de él se hace el giro.",
              "Toca el segundo; quedará en horizontal con el primero."
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
            sirve: "Arma una pieza base de cuatro lados, con un punto en cada esquina.",
            pasos: [
              "Elige Rectángulo.",
              "Da clic donde empieza; se abre una ventana para ancho, alto y rotación.",
              "Escribe las medidas y da Enter, o estíralo con el ratón y da clic."
            ],
            teclas: [
              ["Shift (⇧)", "Mientras lo dibujas, lo vuelve cuadrado."],
              ["Q W A S / moleta", "Mientras lo dibujas, lo gira."]
            ],
            nota: "Sus medidas no cambian de una talla a otra."
          },
          {
            nombre: "Círculo",
            sirve: "Dibuja un círculo, ya sea con un diámetro exacto o a mano.",
            pasos: [
              "Elige Círculo.",
              "Da clic en el centro; se abre la ventana del diámetro.",
              "Escríbelo y da Enter, o estíralo con el ratón y da clic."
            ],
            nota: "Quedan 5 puntos: el centro, dos en las orillas y dos de curva. Su tamaño es el mismo en todas las tallas."
          },
          {
            nombre: "Óvalo",
            sirve: "Forma un óvalo con dos círculos: defines el primero, la separación, el segundo y la altura.",
            pasos: [
              "Elige Óvalo y marca dónde empieza.",
              "Presiona sin soltar, arrastra hasta el tamaño del primer círculo y suelta.",
              "Sin presionar nada, lleva el ratón a donde va el segundo círculo.",
              "Presiona sin soltar, dale tamaño al segundo círculo y suelta.",
              "Cambia la altura con Q W A S o la moleta y da clic para terminar."
            ],
            nota: "Otra forma: escribe el primer radio, el segundo radio y la altura, da Enter y solo estíralo y gíralo."
          },
          {
            nombre: "Arco_f",
            sirve: "Dibuja un arco diciendo qué tan alto sube (su flecha).",
            pasos: [
              "Elige Arco_f.",
              "Da clic en el inicio; se abre la ventana Flecha.",
              "Escribe la flecha y da Enter; luego gíralo, dale largo y da clic. También puedes dibujarlo a mano y cambiar la flecha con Q W A S o la moleta."
            ],
            nota: "La flecha es la distancia entre el centro de la cuerda y la parte más alta del arco."
          },
          {
            nombre: "Arco_r",
            sirve: "Dibuja un arco entre dos puntos a partir de su radio.",
            pasos: [
              "Elige Arco_r.",
              "Da clic en el punto de salida; se abre la ventana Radio.",
              "Escribe el radio y da Enter, gíralo y da clic. También puedes dibujarlo a mano y cambiar el radio con Q W A S o la moleta."
            ]
          },
          {
            nombre: "Tang. 2 círculos",
            sirve: "Dibujas dos círculos y te muestra las cuatro rectas que pueden tocarlos a ambos; tú escoges una.",
            pasos: [
              "Elige Tang. 2 círculos.",
              "Escribe el radio de cada círculo y da Enter, o dibújalos a mano.",
              "Con Espacio vas viendo cada recta.",
              "Da clic en la que quieras."
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
    descripcion: "Para arreglar lo que ya dibujaste: mover, estirar o cambiar el largo de las líneas, cortar y juntar curvas, fijar puntos con chinchetas y ligar valores a medidas.",

    glosario: [
      ["Chincheta", "Un punto «clavado»: no se mueve aunque desplaces o estires lo que está alrededor."],
      ["Homotecia", "Hacer una forma más grande o más chica sin que cambien sus proporciones."],
      ["Gradación / leyes de evolución", "Las reglas que dicen cuánto se mueve cada punto al pasar de una talla a otra."],
      ["Talla base", "La talla con la que dibujas; de ella salen las demás."],
      ["Punto de extremo", "Donde una línea comienza o acaba."],
      ["Punto constante", "Punto puesto a una medida fija sobre la línea (lo ves en F1)."],
      ["Medida MCM", "Una medida guardada en la tabla de medidas; puedes ligarla a puntos o paralelas."],
      ["Parámetros asociados", "El menú de opciones de cada herramienta; ajústalo antes de usarla."],
      ["~", "En los atajos, ~ quiere decir Alt."]
    ],

    grupos: [
      /* ========================= MODIFICACIÓN DE LÍNEA ========================= */
      {
        nombre: "Modificación de línea",
        herramientas: [
          {
            nombre: "Desplazar", atajo: "D",
            sirve: "Mueve un punto y arrastra con él lo que tiene conectado (líneas y otros puntos). Entre las chinchetas, la forma se reacomoda sola.",
            pasos: [
              "Si lo necesitas, ajusta cómo se mueve en Parámetros asociados.",
              "Si hay puntos que no deben moverse, ponles chincheta.",
              "Elige Desplazar y toca el punto.",
              "Escribe Desfase x, Desfase y, Rotación o dl y da Enter, o llévalo con el ratón y da clic."
            ],
            lista: [
              "Talla base: mueves la talla base y decides si el escalado no cambia, gira, o gira y cambia de tamaño.",
              "Talla por talla: cambias solo una talla y las demás quedan igual.",
              "Todas tallas / Selección de tallas / Todos tipos esc.: eliges a qué tallas o tipos de escalado afecta."
            ],
            nota: "También funciona con Ctrl + botón 2. Donde estaba el punto queda una «huella», que puedes ocultar en Visualizar › Trazar."
          },
          {
            nombre: "Estirar", atajo: "Alt + p",
            sirve: "Toma un punto como eje de giro y desde ahí gira y agranda o achica una parte de la pieza, como si la jalaras.",
            pasos: [
              "Si lo necesitas, ajusta cómo se mueve en Parámetros asociados.",
              "Elige Estirar.",
              "Toca el primer punto: será el eje y no se mueve.",
              "Toca el segundo punto: es el que vas a jalar.",
              "Escribe Desfase, Rotación, x, y, dl o Escala y da Enter, o jálalo con el ratón y da clic."
            ],
            nota: "Las opciones de movimiento son las mismas que en Desplazar."
          },
          {
            nombre: "Alargar", atajo: "$",
            sirve: "Le da a una curva, entre dos puntos, un largo exacto sin deformarla.",
            pasos: [
              "Elige Alargar.",
              "Toca un extremo de la curva.",
              "Presiona el otro extremo sin soltar (si no se distingue la curva, usa Espacio).",
              "Escribe el largo final o cuánto quieres sumar o restar (dl) y da Enter."
            ]
          },
          {
            nombre: "Ajustar 2 líneas",
            sirve: "Hace que una línea crezca o se recorte justo hasta topar con otra.",
            pasos: [
              "Elige Ajustar 2 líneas.",
              "Toca la línea que se va a alargar o recortar.",
              "Toca la línea que hará de tope."
            ],
            nota: "Solo cambia la primera línea; la segunda se queda igual. Si marcas «Suprimir el último punto», el extremo anterior se borra."
          },
          {
            nombre: "Al. Línea", atajo: "-",
            manual: "Alargar línea",
            sirve: "Continúa una línea en recta a partir de una de sus puntas.",
            pasos: [
              "Elige Al. Línea.",
              "Toca la línea cerca de la punta que quieres prolongar.",
              "Llévala hasta el largo que buscas y da clic, o escribe el dl, da Enter y clic."
            ],
            nota: "La punta desde donde creció pasa a ser punto de esquina."
          },
          {
            nombre: "Retiro",
            manual: "Retiro efectivo (retracción)",
            sirve: "Hace una pieza (o un pedazo de ella) más grande o más chica en porcentaje. Se usa para compensar lo que encoge la tela.",
            pasos: [
              "Decide si marcas «Retracción todas las tallas».",
              "Para un pedazo: selecciona sus puntos y toca el punto de origen. Para la pieza completa: da clic en cualquier parte de la hoja.",
              "Elige Retiro.",
              "Escribe el porcentaje en x y en y y da Enter."
            ],
            nota: "Sin la casilla «todas las tallas», todas usan el valor de la talla base; con ella, se calcula talla por talla. Si la pieza depende de otra, selecciónala completa antes; si no, el cambio alcanza a todo el patrón."
          },
          {
            nombre: "Simplificado", atajo: "Alt + s",
            sirve: "Deja más suave una curva eliminando los puntos que sobran.",
            pasos: [
              "Elige Simplificado.",
              "Toca la curva (o una de las que tengas seleccionadas).",
              "Escribe cuánto se puede apartar de la forma original (desvío) y da Enter."
            ],
            nota: "Mientras mayor sea el desvío, más puntos se quitan y más sencilla queda la curva."
          }
        ]
      },

      /* ========================= MODIFICACIÓN DE PUNTO ========================= */
      {
        nombre: "Modificación de punto",
        herramientas: [
          {
            nombre: "Modificar", atajo: "r",
            sirve: "Corrige un punto o una línea que ya existen: hacerla más larga o más corta, «ahuecarla», o recorrer un punto deslizante, constante o relativo.",
            pasos: [
              "Elige Modificar.",
              "Toca lo que quieres cambiar.",
              "Escribe los valores y da Enter, o muévelo con el ratón y da clic."
            ],
            nota: "Con ella también mueves los «ganchos» (tangentes) de las curvas Bézier."
          },
          {
            nombre: "Sección",
            sirve: "Parte una curva en un punto; así quedan dos líneas que se tocan ahí.",
            pasos: [
              "Elige Sección.",
              "Toca el punto donde la quieres partir."
            ],
            nota: "Ese punto pasa a ser la punta de las dos líneas nuevas."
          },
          {
            nombre: "Fusión curvas",
            sirve: "Convierte en una sola línea dos líneas que comparten un punto.",
            pasos: [
              "Elige Fusión curvas.",
              "Si solo hay dos líneas, toca el punto donde se juntan.",
              "Si llegan más de dos líneas a ese punto, presiona la primera sin soltar, arrastra hasta la segunda y suelta."
            ],
            nota: "Una Bézier solo se junta con otra Bézier. Para distinguirlas, enciende Visualizar › Bézier."
          },
          {
            nombre: "Unido", atajo: "Alt + 5",
            sirve: "Convierte dos puntos en uno. Si eran de líneas diferentes, esas líneas quedan conectadas.",
            pasos: [
              "Elige Unido.",
              "Toca el primer punto.",
              "Toca el segundo punto."
            ]
          },
          {
            nombre: "Separado", atajo: "Alt + 6",
            sirve: "Hace lo opuesto a Unido: despega una línea (o una marca) del punto que compartía con otra.",
            pasos: [
              "Elige Separado.",
              "Toca el punto compartido.",
              "Da clic para aceptar."
            ],
            nota: "Quedan dos puntos uno encima del otro, cada uno con su línea."
          },
          {
            nombre: "Insertar punto", atajo: "Alt + 7",
            sirve: "Vuelve un punto deslizante, constante o de cruce en un punto de esquina que forma parte de la línea.",
            pasos: [
              "Elige Insertar punto.",
              "Toca el punto."
            ]
          },
          {
            nombre: "Suprimir restricción",
            sirve: "Suelta un objeto de aquello de lo que dependía (simétrico, paralelo, deslizante, constante o relativo) y lo deja independiente.",
            pasos: [
              "Elige Suprimir restricción.",
              "Toca el objeto (o uno de los seleccionados)."
            ],
            nota: "Los puntos deslizantes y constantes pasan a ser puntos de esquina."
          },
          {
            nombre: "Supresión", atajo: "Supr",
            sirve: "Elimina lo que toques: puntos, líneas, marcas, etc.",
            pasos: [
              "Elige Supresión.",
              "Toca el objeto (o uno de los seleccionados)."
            ],
            nota: "Si mantienes Shift (⇧) al tocar una línea, se borran todos sus puntos. Cuando algo depende de lo que vas a borrar, Modaris te avisa primero."
          }
        ]
      },

      /* ========================= MEDIDAS ========================= */
      {
        nombre: "Asociar a medidas",
        herramientas: [
          {
            nombre: "Asociar", atajo: "=",
            sirve: "Liga entre sí puntos constantes, pliegues o paralelas dependientes para que tengan el mismo valor: cambias uno y cambian todos.",
            lista: [
              "Un punto constante con otro punto constante o con una paralela dependiente.",
              "Una paralela dependiente con otra paralela o con un punto constante.",
              "Con la misma herramienta deshaces la liga."
            ],
            nota: "No funciona con objetos que ya estén restringidos a una medida."
          },
          {
            nombre: "Asociar a medida", atajo: "Alt + n",
            sirve: "Liga un punto constante, pliegue o paralela dependiente con una medida: lo que cambies en uno se refleja en el otro.",
            lista: [
              "Añadir a baremo: suma la medida a la tabla MCM.",
              "Nombrar la medida: le pones tu propio nombre (si no, se numera sola: «Medida 10», «Medida 11»…).",
              "Restringir / Limitar a la tabla: muestra solo las medidas de la tabla abierta."
            ],
            nota: "Lo que está ligado se ve iluminado. Un objeto solo admite una medida."
          },
          {
            nombre: "Restricción por medida", atajo: "n",
            sirve: "Obliga a un punto constante, pliegue o paralela dependiente a seguir una medida, una fórmula o una medida MCM. Después ya no lo puedes mover ni escalar a mano.",
            lista: [
              "Lo puedes atar a una medida, a otro objeto, a un valor o a una fórmula.",
              "Con la misma herramienta quitas la restricción."
            ],
            nota: "Se distingue porque se pinta de amarillo dorado. Al pasar el cursor muestra su nombre, la medida entre corchetes y el valor; por ejemplo: Point 27 [1/4 bassin] 250.00 mm."
          }
        ]
      },

      /* ========================= CHINCHETAS ========================= */
      {
        nombre: "Chinchetas",
        herramientas: [
          {
            nombre: "Chincheta", atajo: "Alt + e",
            sirve: "Fija uno o varios puntos para que se queden quietos al desplazar o estirar. Si el punto ya estaba fijo, lo libera.",
            pasos: [
              "Elige Chincheta.",
              "Toca el punto (o uno de los seleccionados)."
            ]
          },
          {
            nombre: "Ch. Pts. Escalado", atajo: "h",
            sirve: "Fija en un solo paso todos los puntos de la hoja que tienen escalado.",
            pasos: ["Elige Ch. Pts. Escalado; se aplica al momento."]
          },
          {
            nombre: "Ch. Pts. Caract.",
            sirve: "Fija en un solo paso todos los puntos de esquina de la hoja, también los de las piezas unidas.",
            pasos: ["Elige Ch. Pts. Caract.; se aplica al momento."]
          },
          {
            nombre: "Ch. Extremidad", atajo: "f",
            sirve: "Fija en un solo paso todas las puntas de las líneas de la hoja.",
            pasos: ["Elige Ch. Extremidad; se aplica al momento."]
          },
          {
            nombre: "Quit. Ch.", atajo: "e",
            manual: "Quitar chinchetas",
            sirve: "Libera de golpe todos los puntos fijos de la hoja.",
            pasos: ["Elige Quit. Ch.; se aplica al momento."],
            nota: "Las puntas de una línea que está sola siempre quedan fijas, aunque las quites."
          }
        ]
      }
    ]
  }
};

/* =====================================================================
   F4: INDUSTRIALIZACIÓN Y PIEZAS (explicado con palabras propias)
   ===================================================================== */
HERRAMIENTAS.F4 = {
  descripcion: "Prepara el patrón para producirse: agrega márgenes de costura, define las esquinas, marca el hilo y saca cada pieza a su propia hoja.",

  glosario: [
    ["Patrón plano", "El trazo base de donde salen las piezas."],
    ["Pieza", "Cada parte de la prenda, en su propia hoja, lista para cortar."],
    ["Acabado", "La línea por donde se cose (sin margen)."],
    ["Corte", "La línea por donde se corta la tela (con margen)."],
    ["Inicio / Fin", "Margen al empezar y al terminar la línea. Si son distintos, el margen se va abriendo o cerrando."],
    ["Entretela termoadhesiva", "Refuerzo que se pega con calor (cuellos, puños, vistas…)."],
    ["Extraer", "Sacar una pieza del patrón plano a una hoja nueva."],
    ["Con dependencia", "La pieza y el patrón quedan conectados: si cambias uno, cambia el otro."],
    ["Maestro / esclavo", "El maestro manda; el esclavo copia su medida."],
    ["Botones al extraer", "1 = elegir · 2 = quitar lo último · 3 = terminar."]
  ],

  grupos: [
    {
      nombre: "Costuras",
      herramientas: [
        { nombre: "Costura Línea", atajo: "U",
          sirve: "Agrega margen de costura a una línea del patrón plano. Las piezas que salen de ese patrón también lo reciben.",
          pasos: ["Activa Costura Línea.", "Clic en la línea que llevará margen.", "Escribe Inicio y Fin y presiona Enter… o colócalo a mano y haz clic."],
          teclas: [["d", "Usa los valores que dejaste guardados en Parámetros asociados."]],
          nota: "Si la pieza ya tiene su propia Costura Pieza, se respeta la de la pieza." },
        { nombre: "Sup. Val. Cost. Cuv.",
          sirve: "Borra el margen de costura de una línea del patrón plano.",
          pasos: ["Activa Sup. Val. Cost. Cuv.", "Clic en la línea: su margen desaparece."],
          nota: "No borra el margen puesto directamente en la pieza." },
        { nombre: "Costura Pieza",
          sirve: "Agrega margen de costura solo a una pieza, sin cambiar el patrón plano.",
          pasos: ["Activa Costura Pieza.", "Clic en la línea de la pieza.", "Escribe Inicio y Fin y presiona Enter… o colócalo a mano y haz clic."],
          teclas: [["d", "Usa los valores que dejaste guardados en Parámetros asociados."]],
          nota: "Si no ves el margen, actívalo en Plano › Visualizar › Extracción." },
        { nombre: "Sup. Val. Cost. Pza.",
          sirve: "Borra el margen que se puso directamente en una pieza.",
          pasos: ["Activa Sup. Val. Cost. Pza.", "Clic en la línea: su margen desaparece."],
          nota: "Si el patrón plano tenía margen en esa línea, la pieza vuelve a usar ese." },
        { nombre: "Val. termoad.",
          sirve: "Indica en una pieza cuánto margen lleva la entretela termoadhesiva en cada línea.",
          pasos: ["Activa Val. termoad.", "Clic en la línea de la pieza.", "Escribe Inicio y Fin y presiona Enter… o colócalo a mano y haz clic."],
          nota: "Solo afecta a esa pieza." },
        { nombre: "Sup. Val. termoad.",
          sirve: "Quita el valor de entretela termoadhesiva de una línea.",
          pasos: ["Activa Sup. Val. termoad.", "Clic en la línea."] }
      ]
    },
    {
      nombre: "Esquinas",
      herramientas: [
        { nombre: "Añadir C. Especial",
          sirve: "Agrega una forma de esquina en un punto donde se juntan dos márgenes de costura. Formas disponibles:",
          lista: [
            "Intersección: los dos márgenes se alargan hasta tocarse (es la normal).",
            "Desplazado: la esquina se corta siguiendo la mitad del ángulo.",
            "Simetría: refleja el margen, para que al doblar coincida (dobladillos).",
            "Revés: como Simetría, pero con un doblez más.",
            "Perpendicular: termina a 90° de una línea. La variable ajusta el ancho del talón.",
            "Sobrante: recorta la punta con una línea recta.",
            "Vacío: deja el hueco de la esquina.",
            "Curva: redondea la esquina.",
            "Inglete: para unir dos dobladillos en diagonal. El avanzado permite lados distintos."
          ],
          pasos: ["Elige la forma en el menú Cost. Especial.", "Activa Añadir C. Especial.", "Clic en el punto de la esquina."],
          nota: "Precedente = la línea de antes de la esquina; siguiente = la de después. Con Crear… guardas una esquina con tus medidas." },
        { nombre: "Suprimir ángulo",
          sirve: "Borra una esquina que agregaste o que quedó encimada con otra.",
          pasos: ["Activa Suprimir ángulo.", "Clic en la esquina.", "Si hay varias encimadas, Espacio para elegir cuál."] },
        { nombre: "C. Cos. Especial",
          sirve: "Cambia la forma de una esquina o de todas las esquinas de la pieza.",
          pasos: ["Elige la forma en el menú Cost. Especial.", "Activa C. Cos. Especial.", "Clic en la esquina que quieres cambiar."],
          teclas: [["Shift (⇧) + clic en la pieza", "Cambia todas las esquinas."], ["Clic sostenido + Espacio", "Recorre las esquinas; suelta en la que quieras."]] },
        { nombre: "Informar de esquinas",
          sirve: "Copia las costuras y esquinas de una pieza a otra, o a otra parte de la misma pieza.",
          pasos: ["Activa Informar de esquinas.", "Clic en el primer punto del tramo que quieres copiar.", "Clic sostenido en el último punto (Espacio para elegir el tramo) y suelta.", "Repite lo mismo en el lugar donde lo quieres."],
          teclas: [["Shift (⇧)", "Lo copia en espejo (para piezas izquierda y derecha)."]] },
        { nombre: "Restringir altura perpend.",
          sirve: "Iguala la altura de dos esquinas perpendiculares, para que las piezas casen al coserlas.",
          pasos: ["Activa Restringir altura perpend.", "Clic en la esquina que va a copiar (esclavo).", "Clic en la esquina de referencia (maestro)."],
          nota: "Para separarlas: clic en el esclavo y luego en un lugar vacío. Al pasar el cursor, el maestro se ve rojo y el esclavo azul." }
      ]
    },
    {
      nombre: "Marcas y datos",
      herramientas: [
        { nombre: "Hilo/Través",
          sirve: "Dibuja el eje que dice cómo va la pieza sobre la tela. También cambia el tipo de un eje ya dibujado. Tipos:",
          lista: ["RH: hilo recto.", "TR: través.", "CM: dónde se escribe la información.", "GR: eje para el escalado.", "SPE: lleva un texto tuyo (hasta 32 letras).", "REF: lleva el texto de un archivo.", "POS: dónde va un accesorio en 3D (logo, botón…)."],
          pasos: ["Elige el tipo en Parámetros asociados.", "Activa Hilo/Través.", "Clic en el punto donde empieza el eje.", "Escribe dx, dy, dl o rotación… o colócalo a mano.", "Clic para validar."],
          nota: "De RH, TR, CM y GR solo cabe uno por pieza: si pones otro igual, el anterior se queda sin tipo." },
        { nombre: "Agujero cartón",
          sirve: "Marca dónde se perfora el molde de cartón, por ejemplo para colgarlo.",
          pasos: ["Pon el diámetro en Parámetros asociados.", "Activa Agujero cartón.", "Clic en el punto a marcar."],
          nota: "Si cambias el diámetro, cambian todos los agujeros de esa hoja." },
        { nombre: "Cambiar",
          sirve: "Intercambia todos los datos del cartucho entre dos piezas.",
          pasos: ["Activa Cambiar.", "Clic en la hoja de la primera pieza.", "Clic en la hoja de la segunda pieza."] },
        { nombre: "Intercambiar nombre piezas",
          sirve: "Intercambia solo los nombres de dos hojas.",
          pasos: ["Activa Intercambiar nombre piezas.", "Clic en la primera hoja.", "Clic en la segunda hoja."] }
      ]
    },
    {
      nombre: "Piezas",
      herramientas: [
        { nombre: "Sin costura", atajo: "o",
          sirve: "Saca una pieza a una hoja nueva tomando el trazo como línea de acabado (por donde se cose).",
          pasos: ["Activa Sin costura.", "Clic dentro de la zona que forma la pieza.", "Si la pieza tiene más zonas, clic en cada una.", "Botón 3 para terminar."],
          teclas: [["Botón 2", "Quita la última zona."], ["Esc", "Salir."], ["Shift (⇧)", "Al sacarla de otra pieza, no conserva la original."]],
          nota: "La zona debe estar cerrada. Si no ves la hoja nueva: Hoja › Siguiente." },
        { nombre: "Con costura", atajo: "y",
          sirve: "Saca una pieza a una hoja nueva tomando el trazo como línea de corte (ya trae el margen).",
          pasos: ["Activa Con costura.", "Clic dentro de la zona que forma la pieza.", "Si la pieza tiene más zonas, clic en cada una.", "Botón 3 para terminar."],
          teclas: [["Botón 2", "Quita la última zona."], ["Esc", "Salir."]],
          nota: "Si no ves la hoja nueva: Hoja › Siguiente." },
        { nombre: "Imp. Pza.",
          sirve: "Trae a la pieza puntos, líneas o piquetes que están en su patrón plano.",
          pasos: ["Activa Imp. Pza.", "Muestra el patrón con Visualizar › PatrónP.", "Clic en cada objeto que quieres traer."] },
        { nombre: "Exp. Pza",
          sirve: "Quita de la pieza líneas, pliegues o piquetes. Siguen existiendo en el patrón plano.",
          pasos: ["Activa Exp. Pza.", "Clic en cada objeto que quieres quitar."] },
        { nombre: "Canal",
          sirve: "Declara que una línea interna de la pieza es de un tipo especial, para identificarla así.",
          pasos: ["Activa la función.", "Clic en la línea interna."],
          nota: "También puedes traer la línea del patrón: primero Visualizar › PatrónP." },
        { nombre: "Retirar canal",
          sirve: "Quita la identificación de tipo Canal de una línea interna.",
          pasos: ["Activa Retirar canal.", "Clic en la línea."] },
        { nombre: "Extr. Manual S. Costura",
          sirve: "Saca una pieza marcando tú su contorno, línea por línea, como acabado (por donde se cose).",
          pasos: ["Activa Extr. Manual S. Costura.", "Clic en las líneas del contorno, en orden.", "Botón 3 sobre el último punto para terminar."],
          nota: "Si suena un aviso, las líneas no se tocan: revisa que haya un punto donde se unen." },
        { nombre: "Extr. Manual",
          sirve: "Saca una pieza marcando tú su contorno, línea por línea, como corte (ya trae el margen).",
          pasos: ["Activa Extr. Manual.", "Clic en las líneas del contorno, en orden.", "Botón 3 sobre el último punto para terminar."] },
        { nombre: "Crear S. Costura",
          sirve: "Crea las líneas de acabado de una pieza a partir de su corte. Quedan independientes.",
          pasos: ["Muestra Plano › Visualizar › Extracción.", "Activa Crear S. Costura.", "Clic dentro del acabado (todas las líneas)… o en una línea de corte (solo esa)."] },
        { nombre: "Crear C. Costura",
          sirve: "Crea las líneas de corte de una pieza a partir de su acabado. Quedan independientes.",
          pasos: ["Muestra Plano › Visualizar › Extracción.", "Activa Crear C. Costura.", "Clic dentro del corte (todas las líneas)… o en una línea de acabado (solo esa)."] },
        { nombre: "Bascular",
          sirve: "Convierte líneas de acabado en líneas de corte, y al revés.",
          pasos: ["Activa Bascular.", "Clic en una línea (cambia solo esa)… o dentro de la pieza (cambian todas)."] },
        { nombre: "Ajuste del encogimiento de la pieza",
          sirve: "Aplica a una pieza lo que la tela encoge, en X y en Y.",
          pasos: ["Pon los valores X y Y en Parámetros asociados.", "Activa Ajuste del encogimiento de la pieza.", "Clic en la hoja: el valor aparece en su cartucho."],
          nota: "Puedes aplicarlo a varias hojas seleccionadas." }
      ]
    }
  ]
};

/* =====================================================================
   ANTES DE EMPEZAR: pasos previos a usar las funciones
   (crear la hoja, hacer tu archivo, guardar...). Cada paso tiene su
   video en js/videos.js, sección "Inicio".
   ===================================================================== */
const ANTES = { tecla: "Inicio", nombre: "Antes de empezar", color: "#bfe3f5" };
HERRAMIENTAS.Inicio = {
  descripcion: "Los pasos que haces antes de usar las funciones: preparar tu carpeta, crear tu hoja y ver el cartucho.",
  grupos: [
    {
      nombre: "Primeros pasos",
      herramientas: [
        { nombre: "Creación de carpeta",
          sirve: "Preparar en tu computadora la carpeta del proyecto y el archivo de tallas antes de abrir Modaris.",
          pasos: [
            "En el Escritorio, clic derecho › Nuevo › Carpeta. Ponle el nombre de tu proyecto (ej. NIÑA).",
            "Entra a esa carpeta y crea otra llamada TALLAS.",
            "Dentro de TALLAS, clic derecho › Nuevo › Documento de texto. Llámalo NUMERIC.",
            "Ábrelo y escribe tu tabla de tallas igual que en el video. La talla base lleva * (ej. *6).",
            "Guarda y cierra."
          ],
          nota: "Ten todo en la misma carpeta: así encuentras tu modelo y tus tallas rápido." },
        { nombre: "Modelos y trazos",
          sirve: "Agregar a la carpeta de tu prenda las dos carpetas donde guardarás tu trabajo.",
          pasos: [
            "Dentro de la carpeta de tu prenda (ej. NIÑA): clic derecho › Nuevo › Carpeta.",
            "Llámala MODELOS: ahí guardas el archivo de tu prenda patronada.",
            "Crea otra carpeta igual y llámala TRAZOS (también se conocen como marcadas): ahí van tus marcadores."
          ] },
        { nombre: "Creación de hoja",
          sirve: "Crear tu modelo nuevo en Modaris y abrir la hoja donde vas a trazar.",
          pasos: [
            "Ve a Fichero › Nuevo (Ctrl + N).",
            "En «Nombre nuevo modelo» escribe el nombre (ej. FALDA NIÑA T6) y presiona Enter.",
            "Ve a Hoja › Nueva hoja (N).",
            "Aparece la hoja gris: ahí empiezas a trazar."
          ] },
        { nombre: "Visualizar cartucho",
          sirve: "Mostrar el cartucho: el recuadro con los datos de cada hoja (nombre del modelo, de la pieza y tallas).",
          pasos: [
            "Ve a Visualizar › Cartucho.",
            "Aparece el cartucho en la parte de abajo de cada hoja.",
            "Para ocultarlo, repite Visualizar › Cartucho."
          ] }
      ]
    }
  ]
};
