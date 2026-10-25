# Ciclo de vida del producto · Caso Bonice Triangulito

Presentación web interactiva sobre las cuatro etapas del ciclo de vida del producto (introducción, crecimiento, madurez y declive). El caso de estudio es el **Triangulito de Bonice**, un postre congelado en empaque triangular de la marca Bonice (Quala), hoy descontinuado. El producto dejó de venderse mientras su marca sigue en el mercado, lo que permite discutir el ciclo completo, incluido el retiro.

La experiencia incluye:

- Gráfica conceptual interactiva con las cuatro etapas, seleccionable con clic, toque o teclado.
- Una sección por etapa con características, preguntas clave expandibles, evidencia documentada frente a aplicación teórica y una estrategia recomendada.
- Comparador de respuestas ante el declive (renovar, reposicionar, cosechar, retirar), con lo que ocurrió realmente.
- Tabla comparativa que en móvil se convierte en tarjetas.
- Cuestionario de cinco preguntas con retroalimentación, conteo de aciertos y reintento.
- Ficha del producto y glosario en un panel lateral.
- Citas numeradas que abren una ventana con la fuente.
- Lista final de fuentes que indica qué afirmación respalda cada una.

Es HTML, CSS y JavaScript nativos: no hay dependencias, ni paso de compilación, ni servicios externos. Las tipografías están incluidas en el proyecto.

---

## Requisitos

- Un navegador moderno: Chrome, Edge, Safari o Firefox de los últimos dos años.
- Opcional: Python 3 o la extensión **Live Server** de VS Code, para servir la página como lo haría un hosting.

## Estructura

```
presentacion boing/
├── index.html              Estructura, iconos SVG y texto narrativo de cada sección
├── css/
│   ├── styles.css          Tokens (colores, tipografía, espaciado), base y navegación
│   ├── components.css      Componentes y secciones
│   └── responsive.css      Adaptaciones por tamaño de pantalla, impresión y alto contraste
├── js/
│   ├── core.js             Espacio de nombres (CicloVida), utilidades, estado y citas
│   ├── data.js             CONTENIDO reutilizable: etapas, ficha, glosario, comparador, quiz y fuentes
│   ├── navigation.js       Índice, sección actual, barra de progreso, paso entre secciones
│   ├── lifecycle.js        Curva conceptual, selector de etapas, mini gráficas, indicadores
│   ├── interactions.js     Acordeones, panel lateral, citas, comparador, revelado al desplazar
│   ├── quiz.js             Cuestionario
│   └── app.js              Arranque: dibuja tabla, ficha, fuentes y créditos de imágenes, e inicia módulos
├── assets/
│   ├── images/             Fotografías reales del producto y de la marca (WebP, recortadas)
│   ├── icons/              favicon.png y apple-touch-icon.png (recorte del empaque)
│   └── fonts/              Bricolage Grotesque y Figtree (woff2, licencia OFL)
├── docs/
│   ├── fuentes.md          Registro de fuentes, discrepancias y lo que no se pudo verificar
│   └── pruebas.md          Pruebas realizadas y errores corregidos
└── .nojekyll               Evita el procesamiento de Jekyll en GitHub Pages
```

## Ejecutar localmente

**Opción rápida:** haz doble clic en `index.html`. Todo funciona desde el disco porque no se usan módulos ES ni peticiones a servidores.

**Opción recomendada** (idéntica a la versión publicada):

```bash
# Desde la carpeta del proyecto
python -m http.server 8000
# Abrir http://localhost:8000
```

En VS Code también puedes hacer clic derecho sobre `index.html` y elegir **Open with Live Server**.

## Modificar el contenido

| Quiero cambiar… | Dónde |
|---|---|
| Nombre del equipo, materia, institución | `js/data.js` → `meta` (si se dejan vacíos no se muestran) |
| Créditos de las imágenes | `js/data.js` → `imageCredits` |
| Datos de cada etapa usados en la gráfica, la tabla y los indicadores | `js/data.js` → `stages` |
| Ficha del producto | `js/data.js` → `productSheet` |
| Términos del glosario | `js/data.js` → `glossary` |
| Comparador de declive | `js/data.js` → `declineOptions` (`selected: true` marca la opción que se muestra primero) |
| Preguntas del cuestionario | `js/data.js` → `quiz` (`answer` es el índice de la opción correcta, empezando en 0) |
| Fuentes | `js/data.js` → `sources` |
| Textos narrativos (portada, preguntas clave, caso, conclusión) | `index.html`, dentro de cada `<section>` |

**Citas.** Cada fuente tiene una clave (`key`) y la numeración se calcula sola según el orden de `sources`:

- Dentro de `data.js`, escribe `{{clave}}`. Por ejemplo: `"Texto con fuente {{informador-2024}}."`
- Dentro de `index.html`, escribe `<a class="cite" href="#fuente-informador-2024" data-cite="informador-2024"></a>`.

Si una clave no existe, la consola muestra un aviso.

**Hechos frente a interpretación.** Mantén la convención visual: `tag--fact` (borde continuo, ✓) para lo documentado, `tag--theory` (borde discontinuo, bombilla) para propuestas o interpretaciones, `tag--need` (borde punteado) para la evidencia que falta y `claim` para rumores o afirmaciones no verificadas.

## Imágenes

Todas las imágenes del producto son **reales**. Como el Triangulito ya no se vende, no hay fotos de catálogo; se usaron la imagen del empaque que aportó el equipo, fotogramas de comerciales y fotografías de terceros:

| Archivo (`assets/images/`) | Qué muestra | Origen |
|---|---|---|
| `triangulito-chocolate-empaque.png` | Los dos empaques 3D sabor chocolate, sin fondo (portada y Producto) | Recorte de `bonice triangulito producto.jpg`, aportada por el equipo: fondo eliminado, reflejo quitado, ampliada ×3 y enfocada |
| `triangulito-chocolate-empaque-sq.png` | Empaque de pie, con el logotipo y el pingüino (índice, ficha, versión «Chocolate») | Recorte de la misma imagen |
| `triangulito-empaque-chocolate.webp` | Empaque sabor chocolate en una mano (tarjeta de la portada) | Foto de la petición en Change.org (es la misma que `bonice triangulo.webp`) |
| `triangulito-chocolate-producto.webp` | El Triangulito de chocolate mordido (recuadro en Producto) | Fotograma del comercial para Ecuador (YouTube, AXXO ART) |
| `bonice-doble-commons-sq.webp` | Bonice Doble, formato tradicional | Wikimedia Commons, **CC BY-SA 4.0** |
| `bonice-vendedores.webp` | Vendedores de Bonice y su carrito | Foto de Alto Nivel publicada en Emprendedor |

`favicon.png` y `apple-touch-icon.png` (en `assets/icons/`) son un recorte circular del empaque de pie. Los archivos originales que aportó el equipo (`bonice triangulito producto.jpg` y `bonice triangulo.webp`) se conservan sin cambios en `assets/images/`.

Las versiones de galleta y arequipe no tienen imagen; se muestran con un icono en el tono del sabor.

Los créditos completos, con enlaces, se muestran en la sección **Fuentes y créditos** y se editan en `js/data.js` → `imageCredits`.

**Derechos.** Salvo la imagen de Wikimedia Commons, que tiene licencia libre, estas imágenes pertenecen a sus titulares. Se reproducen recortadas, con fines académicos y de análisis y con crédito a su fuente, como en un trabajo escolar. Si la presentación se va a difundir fuera del curso, conviene valorar si ese uso es suficiente o pedir permiso a los titulares.

**Para cambiar una imagen:** guarda la nueva en `assets/images/` (WebP, recortada al producto), actualiza `src`, `width` y `height` en `index.html` y su crédito en `imageCredits`.

## Colores y tipografía

Los colores son variables en `css/styles.css` (`:root`): azul de marca (`--brand-*`), hielo (`--ice*`), chocolate (`--choco-*`) y caramelo (`--caramel`, `--sun-*`). El verde (`--ok-*`) se reserva para lo documentado y las respuestas correctas. Cada etapa toma sus colores de `[data-stage="n"]`: `--stage` (marcas), `--stage-deep` (texto y fondos con texto blanco) y `--stage-tint` (fondos suaves). La paleta de etapas se validó para daltonismo, y cada etapa muestra siempre su número y su nombre, de modo que no depende solo del color.

## Publicar

### GitHub Pages (recomendado: gratis, HTTPS y sin caducidad)

1. Crea un repositorio público en GitHub, por ejemplo `ciclo-vida-triangulito`.
2. Desde la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Presentación ciclo de vida: Bonice Triangulito"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/ciclo-vida-triangulito.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings → Pages → Build and deployment**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`, y guarda.
4. En uno o dos minutos la página estará en `https://TU-USUARIO.github.io/ciclo-vida-triangulito/`.

### Netlify (alternativa sin Git)

1. Entra a <https://app.netlify.com/drop> con una cuenta gratuita.
2. Arrastra la carpeta completa del proyecto.
3. Netlify asigna una URL `https://….netlify.app` que puedes renombrar en **Site configuration**.

Todas las rutas son relativas, así que el sitio funciona en la raíz de un dominio o en una subcarpeta, como ocurre en GitHub Pages.

## Insertar en Notion

1. Publica la página y copia su URL `https://…`.
2. En Notion escribe `/embed`, elige **Embed** y pega la URL.
3. Arrastra el borde inferior del bloque para darle altura. Se recomiendan entre 600 y 800 px; la página se adapta a cualquier altura.
4. Para presentar a pantalla completa, usa **Abrir en pestaña nueva**, que aparece en el índice solo cuando la página está insertada. Dentro de Notion el modo de pantalla completa del navegador no está disponible, por eso ese botón se oculta.

**Si el bloque no carga:** comprueba que la URL use `https://` y que la página abra sin iniciar sesión. GitHub Pages y Netlify permiten la inserción en marcos por defecto. Si usas otro hosting, verifica que no envíe la cabecera `X-Frame-Options: DENY` ni una `Content-Security-Policy` con `frame-ancestors` restrictivo.

## Accesibilidad y rendimiento

- HTML semántico, enlace para saltar al contenido, foco visible y navegación completa con teclado (las pestañas usan flechas, Inicio y Fin; Escape cierra paneles y ventanas).
- Respeta `prefers-reduced-motion`: sin animaciones de entrada ni trazado de curvas.
- Texto alternativo en imágenes informativas; la gráfica tiene título y descripción accesibles.
- Cambiar de etapa no altera la altura de la página: las cuatro etapas del panel se apilan en la misma celda.
- Peso total aproximado de 0.97 MB con todas las imágenes (el PNG del empaque se dejó en calidad completa), sin peticiones a terceros. Las imágenes que no están en pantalla al cargar usan carga diferida.

Las pruebas realizadas y los errores corregidos están en [`docs/pruebas.md`](docs/pruebas.md); el registro de fuentes, en [`docs/fuentes.md`](docs/fuentes.md).

## Créditos y licencias

- Imágenes del producto: fotogramas de comerciales y fotografías de terceros, con sus créditos en la presentación (ver la tabla de **Imágenes**).
- Iconos y gráficas: elaboración propia.
- Tipografías: Bricolage Grotesque y Figtree, SIL Open Font License 1.1.
- Bonice y BonIce son marcas de su titular, Quala. Este proyecto académico no está afiliado a Quala ni a la marca.
