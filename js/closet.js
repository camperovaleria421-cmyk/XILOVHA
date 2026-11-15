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
     categoria -> "superior" | "inferior" | "vestido" | "zapatos" | "accesorio"
     modelo    -> "mujer" | "hombre" | "ambos"
     img       -> ruta del PNG (vista de frente)
     vistas    -> (opcional) imágenes para las otras vistas, ej.
                  { "perfil-izq": "...png", "atras": "...png", "perfil-der": "...png" }
                  Si una vista no tiene imagen, la prenda se oculta al girar.
     costo     -> puntos necesarios para desbloquearla (0 = gratis)

   Ejemplo:
     { id: "blusa-azul", nombre: "Blusa azul", categoria: "superior",
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

const CATEGORIAS = [
  { id: "superior",  nombre: "Blusas y camisas" },
  { id: "inferior",  nombre: "Pantalones y faldas" },
  { id: "vestido",   nombre: "Vestidos" },
  { id: "zapatos",   nombre: "Zapatos" },
  { id: "accesorio", nombre: "Accesorios" }
];

const PRENDAS = [
  // Aquí se agregan las prendas cuando lleguen las imágenes.
];
