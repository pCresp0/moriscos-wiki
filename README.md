# Moriscos · Historia, Lugares y Curiosidades

Plataforma web documental sobre la historia, geografía, etnografía y memoria viva de **Moriscos** (Salamanca, La Armuña) y el entorno de **La Flecha**.

Sitio en producción: **https://pcresp0.github.io/moriscos-wiki/**

Este documento es una guía **técnica** del proyecto: explica por qué se tomó cada decisión de arquitectura, cómo está organizado el código y qué contiene exactamente cada sección del sitio, para que cualquier persona con perfil técnico pueda entenderlo, mantenerlo o ampliarlo sin tener que leer todo el código fuente.

---

## 1. Qué es este proyecto y por qué existe

Moriscos (Salamanca) contaba ya con un portal comunitario histórico, **«Morisqueños»** (moriscos.info, alojado en Google Sites), con noticias, genealogía y archivo fotográfico. Este proyecto nace como una **plataforma editorial moderna** que:

- Reorganiza y presenta en formato de «libro digital» (11 capítulos) la historia, geografía y etnografía documentada del municipio.
- Añade capas interactivas que el portal original no podía ofrecer: buscador instantáneo, mapa interactivo de una ruta senderista, glosario filtrable, cuenta atrás de las fiestas patronales.
- Prioriza el rendimiento en móviles de gama media: la web se instala como aplicación, funciona sin conexión y cambiar de sección no descarga nada.

El contenido histórico (capítulos, glosario, genealogía) procede de un documento de recopilación histórica proporcionado por el propietario del proyecto y se ha volcado a Markdown estructurado; no es contenido generado sin fuente.

---

## 2. Stack tecnológico y justificación de cada elección

| Pieza | Elección | Por qué |
|---|---|---|
| Base | **Vite + React 19** (aplicación de una sola página) | Toda la web es un único documento HTML: navegar entre secciones es cambiar una variable de estado, sin peticiones de red ni reconstrucción del DOM. Es lo que hace que en el móvil no haya ni un salto al pulsar el menú. |
| Contenido | **Markdown en `src/content/` compilado a módulos JS** (`scripts/build-content-data.mjs`) | Los `.md` siguen siendo la fuente de verdad editable a mano, pero en el build se convierten en `src/data/*.js`. Así el contenido viaja dentro del bundle y está disponible al instante y sin conexión, sin necesitar un CMS ni peticiones `fetch`. |
| Estilos | **Tailwind CSS v4** vía `@tailwindcss/vite` | Configuración «CSS-first» (`@theme` en `src/index.css`), sin `tailwind.config.js`. |
| Buscador | **Fuse.js** sobre un índice generado en el build | Búsqueda difusa (tolerante a erratas) en el navegador, sobre título, extracto y cuerpo del texto. Cada resultado sabe a qué sección y a qué elemento concreto tiene que saltar. |
| Modal accesible | **Radix UI** (`@radix-ui/react-dialog`) | Primitivas de diálogo con foco atrapado, `aria-*` y cierre por teclado ya resueltos, en vez de reinventar accesibilidad a mano. |
| Mapa | **Leaflet + react-leaflet** | Mapa interactivo ligero y sin coste de licencia (tiles de OpenStreetMap) para la Ruta Nocturna. Se carga en un chunk aparte (`React.lazy`) porque solo hace falta en una sección. |
| Iconografía | **lucide-react** | Set de iconos SVG consistente y *tree-shakeable*: solo entran en el bundle los iconos que se usan. |
| Tipografía | **@fontsource** (Cinzel, Playfair Display, Plus Jakarta Sans) autoalojada | Evita depender de Google Fonts en tiempo de ejecución (mejor privacidad y rendimiento, y las fuentes también están disponibles sin conexión). |
| PWA | **vite-plugin-pwa** (Workbox) | Instalable en móvil y escritorio, y funciona sin conexión tras la primera visita. |
| Gestos | **react-swipeable** | Abrir y cerrar el menú lateral deslizando el dedo, con una zona muerta de 30 px en el borde para no pisar el gesto «atrás» de iOS. |
| Lint | **oxlint** | Linter en Rust, arranca en milisegundos; cubre JS/TS/JSX sin configurar ESLint + plugins. |
| Tests | **Vitest** | Mismo motor (Vite) que ya usa el proyecto, cero configuración de bundler; tests unitarios del enrutado, el buscador y la integridad del contenido (ver `tests/`). |
| Despliegue | **GitHub Actions → GitHub Pages** | Gratuito, integrado en el propio repositorio, sin infraestructura que mantener. |

### Por qué una SPA y no un sitio multipágina

Este proyecto **nació como sitio multipágina con Astro** y se migró a una SPA. El motivo es de uso real: en el móvil, cada cambio de sección implicaba pedir un documento nuevo, sincronizar el `<head>` y volver a montar el menú, lo que producía una micro-latencia perceptible al navegar. Con la SPA el documento no se destruye nunca y el cambio de sección es inmediato.

Lo que se gana y lo que cuesta:

- **Se gana**: navegación instantánea, un único bundle que se precachea entero (la web completa queda disponible sin conexión desde la primera visita) y un modelo mental más simple (un componente por sección, un estado de ruta).
- **Se pierde**: el HTML pre-renderizado por página. El contenido lo pinta JavaScript, así que un rastreador que no ejecute JS solo ve la portada. Para un archivo local consultado por vecinos y descendientes se consideró un intercambio aceptable, pero es la limitación principal a tener en cuenta (ver sección 9).

---

## 3. Arquitectura general

```
Contenido en Markdown (src/content/*)
        │  scripts/build-content-data.mjs (se ejecuta en npm run dev y npm run build)
        ▼
Módulos de datos (src/data/chaptersData.js, glosarioData.js, personajesData.js, searchIndex.js)
        │
        ▼
index.html + src/main.jsx ──▶ src/App.jsx
        │
        ├─ Estado de ruta en memoria: { tab, target } (navegación instantánea con URL limpia y fija)
        ├─ Armazón fijo: cabecera, menú lateral, menú deslizante, pie y #main-scroll-container
        └─ Una página React por sección (src/pages/*.jsx), importadas de forma estática

GitHub Actions (push a main)
        │
        ├─ npm ci && npm run build   → genera dist/ (HTML + bundle + service worker)
        └─ actions/deploy-pages      → publica dist/ en GitHub Pages
```

Puntos clave del modelo:

- **Armazón fijo de altura `100dvh`**: `html`, `body` y `#root` tienen `overflow: hidden`, y todo el scroll ocurre dentro de `#main-scroll-container`. Así la cabecera y el menú nunca se mueven, y las áreas seguras del iPhone (`env(safe-area-inset-*)`) se respetan en cabecera, menú, pie y botón de «volver arriba».
- **Sin *lazy loading* de páginas** (salvo el mapa): las 12 secciones se importan estáticamente, de modo que cambiar de sección no espera ninguna descarga. El mapa de Leaflet sí va en un chunk aparte porque pesa ~160 kB y solo se usa en una sección.
- **Navegación en memoria con URL fija**: la barra de direcciones permanece limpia y fija en la raíz (`pcresp0.github.io/moriscos-wiki/`) comportándose como una aplicación móvil nativa. La navegación entre pestañas y temas se gestiona en memoria de React de forma instantánea.
- **`public/404.html`** redirige a la raíz limpia del sitio.

---

## 4. Estructura de carpetas

```
├── index.html              Documento raíz: meta tags, Open Graph, iconos y el <div id="root">.
├── vite.config.js          Configuración de Vite: React, Tailwind, base de GitHub Pages y PWA (Workbox).
├── src/
│   ├── main.jsx            Punto de entrada: monta App y registra el service worker.
│   ├── App.jsx             Armazón + enrutado: estado { tab, target }, cabeceras, menús, scroll y pie.
│   ├── index.css           Tailwind v4 «CSS-first»: @theme con la paleta y tipografías, variante dark,
│   │                       y las clases reutilizables (.card-editorial, .kicker, .prose-chapter...).
│   ├── content/
│   │   ├── chapters/       11 ficheros .md, uno por capítulo del libro (ver sección 5).
│   │   ├── glosario/       13 ficheros .md, uno por término etnográfico.
│   │   └── personajes/     3 ficheros .md, uno por paisano ilustre.
│   ├── data/
│   │   ├── chaptersData.js    GENERADOS a partir de src/content por scripts/build-content-data.mjs.
│   │   ├── glosarioData.js    No editar a mano: se sobrescriben en cada build.
│   │   ├── personajesData.js
│   │   ├── searchIndex.js
│   │   ├── references.ts   Fuentes documentales de la sección Referencias (escritas a mano).
│   │   ├── route.ts        Los 8 hitos de la Ruta Nocturna (lat/lng, distancia, descripción, cita).
│   │   └── site.ts         Contadores destacados de la portada.
│   ├── pages/              Una sección de la web por fichero .jsx (ver sección 5.2).
│   ├── components/         Ver detalle en la sección 6.
│   └── utils/
│       ├── router.js       parseHash/buildHash: única fuente de verdad de las rutas (con test).
│       ├── search.js       Configuración de Fuse.js compartida por el buscador y sus tests.
│       ├── markdownBlocks.js  Analizador del markdown, compartido por la app y el script de contenido.
│       └── slugify.js      Genera las anclas de los apartados de cada capítulo.
├── public/                 Estáticos servidos tal cual: favicon, robots.txt, 404.html de compatibilidad,
│                           imágenes del escudo e iconos PWA (generados con sharp desde icon-master.svg).
├── scripts/
│   ├── build-content-data.mjs  Markdown → módulos JS + índice del buscador.
│   └── generate-icons.mjs      Iconos PWA y banner de redes a partir del escudo oficial.
├── tests/                  Tests unitarios con Vitest (enrutado, buscador, integridad del contenido).
├── .github/workflows/      CI/CD: despliegue a GitHub Pages, backup diario y merge main → develop.
└── dist/                   Salida del build (generada, no versionada).
```

---

## 5. Contenido y secciones

### 5.1. Modelo de contenido (`src/content/`)

- **`chapters`** — frontmatter: `number`, `title`, `dek` (subtítulo/resumen), `order`, `readingMinutes`. El cuerpo Markdown usa `##` para los apartados que alimentan el índice del capítulo y `###` para subsecciones que no aparecen en ese índice.
- **`glosario`** — frontmatter: `term`, `category` (`Aperos | Naturaleza | Medidas | Topónimos | Oficios | Cultivos`), `short` (una frase). El cuerpo Markdown es la definición extendida.
- **`personajes`** — frontmatter: `name`, `years`, `role`, `tag`. El cuerpo Markdown es la biografía.

El nombre del fichero es el identificador (`05-despoblado-ribas-flecha.md` → `05-despoblado-ribas-flecha`) y es lo que se usa en las rutas (`#/libro/05-despoblado-ribas-flecha`) y en los saltos del buscador (`#/glosario/maquila`).

Del markdown se soporta el subconjunto que realmente usan los textos: encabezados, párrafos, listas con y sin numerar, negrita, cursiva y enlaces. Se analiza con `src/utils/markdownBlocks.js` (~70 líneas) en vez de con una librería, para no meter un parser completo en el bundle. Si algún día el contenido necesitara tablas, citas o código, hay que ampliar ese fichero (hay un test que avisa si aparece sintaxis no soportada).

### 5.2. Secciones (`src/pages/`)

| Ruta | Fichero | Contenido |
|---|---|---|
| `#/` | `InicioPage.jsx` | Portada: presentación del pueblo, contadores clave (primera mención, vértice geodésico, distancia a Salamanca, superficie) y cuadrícula con las 11 secciones. |
| `#/historia` | `HistoriaPage.jsx` | Eje cronológico en cinco eras, de la repoblación medieval a la actualidad, con enlaces a la sección que amplía cada hito. |
| `#/lugares` | `LugaresPage.jsx` | Localizaciones emblemáticas, parajes y cotas del término, y lugares desaparecidos o transformados. |
| `#/fiestas` | `FiestasPage.jsx` | Cuenta atrás de la Fiesta Mayor (calculada sobre el jueves anterior al primer domingo de agosto), programa de festejos, ritos propios y calendario festivo anual. |
| `#/escudo` | `EscudoPage.jsx` | Significado de cada elemento del escudo heráldico, con visor ampliado de la imagen. |
| `#/iglesia` | `IglesiaPage.jsx` | Historia, arquitectura y tesoros artísticos de la Iglesia de San Pedro Apóstol, con su línea del tiempo. |
| `#/libro` y `#/libro/<slug>` | `LibroPage.jsx` | Índice de los 11 capítulos y lector de capítulo: barra de progreso de lectura, índice de apartados (fijo en escritorio, desplegable en móvil) y navegación al capítulo anterior o siguiente. |
| `#/ruta-nocturna` | `RutaNocturnaPage.jsx` | Mapa interactivo (Leaflet) con los 8 hitos de la ruta Moriscos → La Flecha (7,7 km), sincronizado con la lista lateral. |
| `#/genealogia` | `GenealogiaPage.jsx` | El Bosque Genealógico, los paisanos ilustres documentados y cómo incorporarse al archivo. |
| `#/glosario` | `GlosarioPage.jsx` | Los 13 términos etnográficos, con buscador propio y filtro por categoría. |
| `#/referencias` | `ReferenciasPage.jsx` | Fuentes documentales con filtro por tipo, aportación de cada una y enlace al archivo original. |
| `#/sobre-la-web` | `SobrePage.jsx` | Por qué existe el proyecto, de dónde sale la información, contacto, código abierto y aviso de proyecto no oficial. |

Cada página recibe dos props: `onNavigate(tab, target)` para navegar y `target` con el elemento concreto al que debe saltar (un capítulo, un término del glosario, un personaje, una fuente o un hito del mapa).

---

## 6. Componentes

- **`Nav.jsx`** — Exporta las tres formas de la navegación y la lista `navItems`, única fuente de verdad de las secciones: `DesktopTopBar` (marca y buscador, `lg` en adelante), `Sidebar` (menú fijo de escritorio) y `Nav` con su `Drawer` (cabecera móvil y menú deslizante de 300 ms, que se cierra con Escape, al tocar fuera o deslizando).
- **`SearchModal.tsx`** — Diálogo de Radix UI con atajo `⌘K`/`Ctrl K`. Filtra el índice generado en el build con Fuse.js y, al elegir un resultado, navega a la sección **y** al elemento concreto, que queda resaltado con un pulso dorado (clase `.search-target`).
- **`Markdown.jsx`** — Convierte el markdown del contenido en elementos reales de React (negritas, cursivas, listas, enlaces) y pone un `id` a cada encabezado `##` para poder enlazarlo desde el índice del capítulo.
- **`ReadingProgress.jsx`** — Barra fina pegada al borde superior del área de scroll que indica cuánto queda por leer del capítulo abierto.
- **`RouteMap.tsx`** — Mapa Leaflet con tiles de OpenStreetMap, la polilínea que une los 8 hitos de `route.ts` y marcadores numerados que cambian de tamaño y color según el hito activo; al seleccionar uno, el mapa hace `flyTo`. Se carga bajo demanda desde `RutaNocturnaPage`.
- **`VisitorStatsModal.tsx`** — Registro de visitas de los últimos 30 días **guardado solo en `localStorage`**: la web no envía nada a ningún servidor ni usa analítica de terceros, así que las cifras son de ese dispositivo.
- **`ScrollToTopButton.jsx`** — Botón flotante que aparece a partir de 400 px de scroll dentro de `#main-scroll-container`, respetando el área segura inferior.
- **`Footer.jsx`** — Contacto (email, LinkedIn, GitHub), enlaces a las secciones principales y autoría, con `padding-bottom` que suma `env(safe-area-inset-bottom)`.
- **`ErrorBoundary.tsx`** — Aísla los fallos: si una sección o el mapa lanzan un error, se muestra un aviso en su lugar y el resto de la web sigue usable. Envuelve la aplicación completa, cada sección y las islas delicadas (buscador, mapa).

---

## 7. Diseño y sistema visual

Definido íntegramente en `src/index.css` con el bloque `@theme` de Tailwind v4 (sin fichero de configuración JS):

- **Paleta**: tonos inspirados en el paisaje y el patrimonio local — `piedra` (arenisca de Villamayor), `armuna` (tierra y trigo), `soto` (ribera del Tormes), `pergamino` (texto claro) y `noche` (fondos). El sitio es siempre oscuro: la clase `dark` va fija en el `<html>` y la variante se define con `@custom-variant dark (&:where(.dark, .dark *))`.
- **Tipografía**: `Cinzel` para marca y titulares, `Playfair Display` como serif de apoyo y `Plus Jakarta Sans` para el cuerpo de texto.
- **Clases reutilizables**: `.container-editorial` (ancho de lectura), `.card-editorial` (tarjeta con borde y desenfoque), `.kicker`, `.btn-primary`, `.btn-secondary`, `.nav-item`, `.prose-chapter` (texto largo de capítulos, sobre `@tailwindcss/typography`), `.brand-panel` (pie con la textura del trigal), `.search-target` (pulso dorado del resultado buscado) y `.dialog-overlay`/`.dialog-content` (aparición de los diálogos).
- **Animación de entrada**: una única animación GPU de 0,18 s al montar cada sección (`main > div > *`), anulada si el sistema pide reducir el movimiento.
- Los paneles internos de Leaflet se fuerzan a `z-index` bajo para que el mapa no se superponga nunca al menú lateral ni a los diálogos.

---

## 8. Accesibilidad y rendimiento

- Enlace «Saltar al contenido principal», `aria-*` en botones y diálogos, foco gestionado por Radix UI en el buscador, y el menú deslizante pasa a `visibility: hidden` al cerrarse para no quedar en el orden de tabulación.
- Se respeta el zoom del navegador: el `<meta name="viewport">` no lleva `user-scalable=no` ni `maximum-scale`, así que se puede ampliar con los dedos; sí lleva `viewport-fit=cover`, necesario para que funcionen las áreas seguras del iPhone.
- `prefers-reduced-motion` anula las animaciones de entrada y de los diálogos.
- Fuentes autoalojadas para evitar peticiones externas y parpadeo de texto sin estilo.
- **Pesos del build** (aproximados, gzip): bundle principal ~159 kB, CSS ~24 kB, mapa ~48 kB en un chunk aparte que solo se descarga al abrir la Ruta Nocturna.
- **PWA instalable y sin conexión**: `manifest.webmanifest` (iconos 192/512/maskable) y un service worker de Workbox que precachea HTML, CSS, JS, tipografías (solo `woff2`, para no duplicar peso) e imágenes.

---

## 9. SEO: limitación conocida

Al ser una SPA sin renderizado en servidor, los buscadores que no ejecutan JavaScript solo ven el HTML de `index.html`: título, descripción, Open Graph e imagen de la portada. El contenido de los capítulos y del glosario **no** se sirve como HTML pre-renderizado.

Mitigaciones activas:

- `index.html` lleva título, descripción, Open Graph y Twitter Cards, así que al compartir cualquier enlace se ve una tarjeta correcta.
- `public/404.html` redirige las direcciones antiguas del sitio multipágina a la ruta equivalente, de modo que ningún enlace previamente compartido o indexado se rompe.

Si en el futuro la visibilidad en buscadores pasa a ser importante, la vía natural es pre-renderizar las secciones en el build (por ejemplo con `vite-plugin-ssr`/`vite-plugin-prerender`) manteniendo el mismo código de las páginas.

---

## 10. Despliegue y CI/CD

El pipeline vive en `.github/workflows/deploy.yml` y se dispara en cada `push` a `main` (o manualmente vía `workflow_dispatch`):

1. `actions/checkout` + `actions/setup-node` (**Node 22**).
2. `npm ci` (instalación reproducible a partir de `package-lock.json`).
3. `npm run build` → genera el contenido desde Markdown, los iconos PWA y el bundle de Vite con el service worker.
4. `actions/configure-pages` + `actions/upload-pages-artifact` + `actions/deploy-pages` → publica `dist/` como GitHub Pages.

Detalle importante: `base` está fijado a `/moriscos-wiki/` en `vite.config.js` (con barra final) porque el sitio se sirve en un subdirectorio de GitHub Pages. **Si `base` no termina en `/`, las concatenaciones de rutas se rompen.**

Hay además dos workflows de mantenimiento: un backup diario de `main` en una rama con fecha y un merge diario de `main` en `develop`.

---

## 11. Desarrollo local

```bash
npm install       # instala dependencias
npm run dev       # genera el contenido y arranca Vite con recarga en caliente
npm run content   # regenera src/data/* a partir de src/content/* (sin arrancar nada)
npm run build     # genera el sitio completo en dist/ (contenido + iconos + bundle + sw.js)
npm run preview   # sirve dist/ localmente para verificar el build de producción
npm run lint      # oxlint sobre todo el proyecto
npm run typecheck # comprobación de tipos con TypeScript
npm test          # tests unitarios con Vitest
```

En desarrollo no existe `sw.js` (solo se genera en `npm run build`) y el registro del service worker está limitado a producción, así que no interfiere con la recarga en caliente.

### Cómo añadir contenido

- **Un capítulo nuevo**: crear `src/content/chapters/12-mi-capitulo.md` con su frontmatter (`number`, `title`, `dek`, `order`, `readingMinutes`) y ejecutar `npm run content`. Aparece automáticamente en el índice del libro y en el buscador; el total de capítulos se calcula, no está escrito a mano.
- **Un término de glosario**: crear `src/content/glosario/mi-termino.md` con `term`, `category` y `short`.
- **Un personaje**: crear `src/content/personajes/nombre-apellido.md` con `name`, `years`, `role` y `tag`.
- **Un hito de la Ruta Nocturna**: añadir una entrada al array de `src/data/route.ts`.
- **Una fuente documental**: añadir una entrada a `src/data/references.ts`.

Los ficheros de `src/data/*Data.js` y `searchIndex.js` están generados: cualquier cambio hecho a mano se pierde en el siguiente build.

---

## 12. Limitaciones conocidas y notas de contenido

- El contenido histórico procede de un documento de recopilación aportado por el autor del proyecto; algunos episodios (sucesos de crónica negra, datos de personas identificables) contienen información sensible que conviene revisar antes de una difusión pública amplia.
- El buscador se indexa en el build: si se añade contenido, hay que volver a construir el sitio para que aparezca en los resultados.
- El contador de visitas es local a cada dispositivo. No hay backend ni analítica: un contador global real exigiría un servicio externo.
- No hay backend ni base de datos: cualquier funcionalidad futura de formularios (por ejemplo «aportar una fotografía») requeriría un servicio externo, ya que GitHub Pages solo sirve estáticos.

---

## 13. Colaborar

¿Tienes fotografías, documentos o correcciones sobre Moriscos? Escribe a **moriscos.info@gmail.com**.
