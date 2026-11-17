/* =====================================================================
   MODELOS Y CLOSET DEL VESTIDOR
   ---------------------------------------------------------------------
   MODELOS: imagen base de cada robot.
     - Lo ideal: un PNG con fondo transparente, cuerpo completo, de frente,
       guardado en  img/modelos/  (ej. img/modelos/mujer.png).
     - Mientras tanto, la mujer usa un recorte de la imagen de inicio.

   PRENDAS: cada prenda es un PNG con fondo transparente en  img/ropa/
   dibujada sobre el mismo tamaño y posición que el modelo, para que
   encaje al ponerla encima.
     id        -> nombre único sin espacios
     nombre    -> como se muestra
     categoria -> "torso" | "inferior" | "calzado" | "encima" | "accesorio"
     modelo    -> "mujer" | "hombre" | "ambos"
     img       -> ruta del PNG (vista de frente)
     vistas    -> (opcional) imágenes para las otras vistas, ej.
                  { "perfil-izq": "...png", "atras": "...png", "perfil-der": "...png" }
                  Si una vista no tiene imagen, la prenda se oculta al girar.
     costo     -> puntos necesarios para desbloquearla (0 = gratis)

   Ejemplo:
     { id: "blusa-azul", nombre: "Blusa azul", categoria: "torso",
       modelo: "mujer", img: "img/ropa/blusa-azul.png", costo: 0 },
   ===================================================================== */

/* Cada modelo tiene 4 vistas para poder girar.
   ancho/alto = tamaño en píxeles de cada vista (todas miden igual).
   Cada prenda debe medir EXACTAMENTE lo mismo para que encaje. */
const ORDEN_VISTAS = ["frente", "perfil-izq", "atras", "perfil-der"];
const NOMBRE_VISTA = { "frente": "Frente", "perfil-izq": "Perfil", "atras": "Espalda", "perfil-der": "Perfil" };

const MODELOS = {
  mujer:  { nombre: "Modelo mujer",  ancho: 440, alto: 1525,
            vistas: {
              "frente":     "img/modelos/mujer-frente.png",
              "perfil-izq": "img/modelos/mujer-perfil-izq.png",
              "atras":      "img/modelos/mujer-atras.png",
              "perfil-der": "img/modelos/mujer-perfil-der.png"
            },
            referencia: "img/modelos/referencia-mujer.jpg" },
  hombre: { nombre: "Modelo hombre", ancho: 460, alto: 1135,
            vistas: {
              "frente":     "img/modelos/hombre-frente.png",
              "perfil-izq": "img/modelos/hombre-perfil-izq.png",
              "atras":      "img/modelos/hombre-atras.png",
              "perfil-der": "img/modelos/hombre-perfil-der.png"
            },
            referencia: "img/modelos/referencia-hombre.jpg",
            /* Giro 3D real: cuadros sacados del video de modelado 3D (vuelta de 360°).
               vistas = número de cuadro donde queda de frente, perfil, espalda y perfil. */
            giro360: { carpeta: "img/modelos/hombre-giro/", cuadros: 35, ancho: 350, alto: 600,
                       vistas: { "frente": 0, "perfil-izq": 9, "atras": 18, "perfil-der": 29 } } }
};

/* Secciones del closet (en este orden se dibujan las capas: de abajo hacia arriba) */
const CATEGORIAS = [
  { id: "luces",     nombre: "Color de luces",
    vacio: "" },
  { id: "torso",     nombre: "Torso",
    vacio: "Aquí irán camisetas, playeras, tops, sudaderas y camisas." },
  { id: "inferior",  nombre: "Parte baja",
    vacio: "Aquí irán pantalones, pants, mezclilla, de vestir, shorts y faldas." },
  { id: "calzado",   nombre: "Calzado",
    vacio: "Aquí irán tenis, botas, botines y zapatos." },
  { id: "encima",    nombre: "Chamarras y chalecos",
    vacio: "Aquí irán chamarras, chalecos, abrigos, sacos y camisas abiertas." },
  { id: "accesorio", nombre: "Accesorios",
    vacio: "Aquí irán accesorios para el cabello, audífonos, lentes, cadenas y paliacates." }
];

/* Color de luces del personaje: cambia el color de todo lo que brilla
   (visor, cabello y detalles azules). "giro" = grados de cambio de tono.
   costo = puntos necesarios para desbloquearlo. */
const LUCES = [
  { id: "azul",    nombre: "Azul original", color: "#29b6ff", filtro: "none",                                  costo: 0 },
  { id: "blanco",  nombre: "Blanco",        color: "#e8eef5", filtro: "saturate(0) brightness(1.05)",          costo: 0 },
  { id: "verde",   nombre: "Verde neón",    color: "#3ee88a", filtro: "hue-rotate(-75deg) saturate(1.15)",      costo: 30 },
  { id: "morado",  nombre: "Morado",        color: "#a35cff", filtro: "hue-rotate(70deg) saturate(1.1)",       costo: 60 },
  { id: "rosa",    nombre: "Rosa",          color: "#ff4fb8", filtro: "hue-rotate(118deg) saturate(1.15)",      costo: 90 },
  { id: "rojo",    nombre: "Rojo",          color: "#ff3b3b", filtro: "hue-rotate(160deg) saturate(1.25)",      costo: 120 },
  { id: "dorado",  nombre: "Dorado",        color: "#ffc93c", filtro: "hue-rotate(-160deg) saturate(1.3)",     costo: 200 }
];

/* Cada prenda se saca de una imagen de Gemini con el robot ya vestido:
   se compara contra el robot sin ropa y se recorta solo lo que cambió.
   miniatura = imagen pequeña para el closet. */
/* prenda(modelo, archivo, nombre, categoría, costo, ranura)
   Los archivos están en img/ropa/<modelo>/<archivo>-<vista>.webp
   ranura (solo accesorios): "cabello" | "cabeza" | "muneca", para poder usar varios a la vez. */
function prenda(modelo, archivo, nombre, categoria, costo, ranura) {
  const r = `img/ropa/${modelo}/${archivo}`;
  return { id: `${modelo}-${archivo}`, nombre, categoria, modelo, costo, ranura: ranura || categoria,
           img: `${r}-frente.webp`, miniatura: `${r}-mini.webp`,
           vistas: { "perfil-izq": `${r}-perfil-izq.webp`, "perfil-der": `${r}-perfil-der.webp`, "atras": `${r}-atras.webp` } };
}

const PRENDAS = [
  /* ---------- Modelo mujer ---------- */
  prenda("mujer", "camiseta-cuervo",   "Camiseta negra con cuervo",          "torso",    0),
  prenda("mujer", "camiseta-oversize", "Camiseta oversize negra",            "torso",    30),
  prenda("mujer", "jeans-baggy",       "Jeans baggy deslavados",             "inferior", 30),
  prenda("mujer", "chamarra-biker",    "Chamarra biker de piel",             "encima",   60),

  /* ---------- Modelo hombre ---------- */
  prenda("hombre", "camiseta-negra",       "Camiseta negra",                     "torso",    0),
  prenda("hombre", "camiseta-beige",       "Camiseta beige",                     "torso",    0),
  prenda("hombre", "sueter-beige",         "Suéter beige con cuello",            "torso",    30),
  prenda("hombre", "camiseta-oversize",    "Camiseta oversize estampada",        "torso",    40),
  prenda("hombre", "shorts-blancos",       "Shorts blancos",                     "inferior", 0),
  prenda("hombre", "jeans-negros",         "Jeans negros ajustados",             "inferior", 30),
  prenda("hombre", "jeans-azul-oscuro",    "Jeans azul oscuro",                  "inferior", 30),
  prenda("hombre", "cargo-beige",          "Pantalón cargo beige",               "inferior", 30),
  prenda("hombre", "cargo-negro",          "Pantalón cargo negro con cadena",    "inferior", 40),
  prenda("hombre", "jeans-baggy",          "Jeans baggy con cadena",             "inferior", 40),
  prenda("hombre", "pantalon-negro-roto",  "Pantalón negro roto",                "inferior", 50),
  prenda("hombre", "tenis-blancos",        "Tenis blancos",                      "calzado",  20),
  prenda("hombre", "chamarra-beige",       "Chamarra beige con playera",         "encima",   50),
  prenda("hombre", "chaleco-mezclilla",    "Chaleco de mezclilla con parches",   "encima",   70),
  prenda("hombre", "chamarra-biker",       "Chamarra biker de piel",             "encima",   80),
  prenda("hombre", "chamarra-biker-dorada","Chamarra biker con cierres dorados", "encima",   100),
  prenda("hombre", "cabello-largo",        "Cabello largo",                      "accesorio", 30, "cabello"),
  prenda("hombre", "gorra-negra",          "Gorra negra",                        "accesorio", 20, "cabeza"),
  prenda("hombre", "reloj",                "Reloj inteligente",                  "accesorio", 25, "muneca")
];
