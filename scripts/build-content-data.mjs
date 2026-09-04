/*
 * Convierte los markdown de src/content en módulos JS que la app importa
 * directamente. Así todo el contenido viaja dentro del bundle: la web abre
 * cualquier sección al instante y sigue funcionando sin conexión.
 *
 * Se ejecuta en cada `npm run build` y también con `npm run content`.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHeadings } from '../src/utils/markdownBlocks.js';

const rootDir = path.resolve(fileURLToPath(import.meta.url), '../../');
const contentDir = path.join(rootDir, 'src/content');
const dataDir = path.join(rootDir, 'src/data');

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: text.trim() };

  const frontmatter = {};
  match[1].split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val !== '' && !Number.isNaN(Number(val))) {
      val = Number(val);
    }
    frontmatter[key] = val;
  });

  return { frontmatter, body: match[2].trim() };
}

async function readCollection(name) {
  const dir = path.join(contentDir, name);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  return Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const { frontmatter, body } = parseFrontmatter(raw);
      return { slug: file.replace(/\.md$/, ''), data: frontmatter, body };
    }),
  );
}

/** Recorta un texto por la última palabra completa, para extractos del buscador. */
function excerpt(text, max = 160) {
  const plain = text
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, plain.lastIndexOf(' ', max))}…`;
}

async function writeData(file, name, value) {
  await fs.writeFile(
    path.join(dataDir, file),
    `// Generado por scripts/build-content-data.mjs a partir de src/content. No editar a mano.\nexport const ${name} = ${JSON.stringify(value, null, 2)};\n`,
  );
}

async function processAll() {
  // 1. Capítulos del libro
  const chapters = (await readCollection('chapters'))
    .map(({ slug, data, body }) => ({
      id: slug,
      order: data.order ?? data.number ?? 0,
      number: data.number ?? data.order ?? 0,
      title: data.title || slug,
      dek: data.dek || '',
      readingMinutes: data.readingMinutes || 0,
      headings: extractHeadings(body),
      content: body,
    }))
    .sort((a, b) => a.order - b.order);

  // 2. Glosario etnográfico
  const glosario = (await readCollection('glosario'))
    .map(({ slug, data, body }) => ({
      id: slug,
      term: data.term || slug,
      category: data.category || 'General',
      short: data.short || '',
      content: body,
    }))
    .sort((a, b) => a.term.localeCompare(b.term, 'es'));

  // 3. Personajes (genealogía)
  const personajes = (await readCollection('personajes')).map(({ slug, data, body }) => ({
    id: slug,
    name: data.name || slug,
    years: data.years || '',
    role: data.role || '',
    tag: data.tag || '',
    content: body,
  }));

  await writeData('chaptersData.js', 'chapters', chapters);
  await writeData('glosarioData.js', 'glosario', glosario);
  await writeData('personajesData.js', 'personajes', personajes);

  // 4. Índice del buscador global. `tab` es la sección de la app y `target` el
  //    elemento concreto al que hay que saltar dentro de ella.
  const searchItems = [
    ...chapters.map((c) => ({
      id: `chapter-${c.id}`,
      tab: 'libro',
      target: c.id,
      title: `Cap. ${c.number} · ${c.title}`,
      excerpt: c.dek,
      content: excerpt(c.content, 1200),
      badge: `Capítulo ${c.number}`,
    })),
    ...glosario.map((g) => ({
      id: `glosario-${g.id}`,
      tab: 'glosario',
      target: g.id,
      title: g.term,
      excerpt: g.short || excerpt(g.content),
      content: excerpt(g.content, 600),
      badge: `Glosario · ${g.category}`,
    })),
    ...staticEntries,
  ];

  await writeData('searchIndex.js', 'searchIndex', searchItems);

  console.log(
    `Contenido generado: ${chapters.length} capítulos, ${glosario.length} términos, ${personajes.length} personajes, ${searchItems.length} entradas en el buscador.`,
  );
}

/* Secciones escritas directamente en las páginas React (no vienen de markdown)
   que también deben poder encontrarse desde el buscador. */
/* Secciones escritas directamente en las páginas React (no vienen de markdown)
   que también deben poder encontrarse desde el buscador con enlace directo y resalte. */
const staticEntries = [
  // --- HISTORIA ---
  {
    id: 'seccion-historia',
    tab: 'historia',
    target: null,
    title: 'Historia de Moriscos: eje cronológico',
    excerpt: 'Eje cronológico de mil años: repoblación medieval, Edad Moderna, 1812, siglo XX y actualidad.',
    content: 'cronología historia repoblación Alfonso VI Madoz ferrocarril 1877 Unamuno Fray Luis 1812 Arapiles siglo XX área metropolitana',
    badge: 'Historia',
  },

  // --- ECONOMÍA Y SUSTENTO ---
  {
    id: 'seccion-economia',
    tab: 'economia',
    target: null,
    title: '¿De qué ha vivido Moriscos? Economía y sustento',
    excerpt: 'Secano, bueyes y labor a dos hojas, la Lenteja de La Armuña y el gorgojo, aceñas del Tormes, tren de 1877, silos y Novartis.',
    content: 'economía secano dos hojas bueyes mulas trigo candeal mocho rubión centeno cebada avena lenteja armuña gigante gomecello pedrosillo rhizobium gorgojo bobolina asfixies tostado Gonzalo Sánchez aceñas maquila Cabrerizos La Flecha agua blanda dureza Madoz ferrocarril estación silos Gomecello FEGA Novartis Castellanos radioligandos Helcesa CTR residuos Legumbres Montes Legumer',
    badge: 'Economía',
  },
  {
    id: 'economia-secano-bueyes',
    tab: 'economia',
    target: 'secano-bueyes',
    title: 'Secano, bueyes y la rotación «a dos hojas»',
    excerpt: 'Penillanura a 800–900 m de altitud, suelos arcillosos con 0,97% de materia orgánica, bueyes de tiro (alzar y aricar) y trigo candeal.',
    content: 'secano rotación a dos hojas barbecho bueyes de labor mulas alzar aricar boyá boyero trigo candeal mocho rubión centeno cebada avena penillanura suelo arcilloso',
    badge: 'Economía · Secano',
  },
  {
    id: 'economia-lenteja-gorgojo',
    tab: 'economia',
    target: 'lenteja-gorgojo',
    title: 'El milagro de la Lenteja de La Armuña y el control del gorgojo',
    excerpt: 'Simbiosis bacteriana con Rhizobium, la plaga del gorgojo, tinajas de aceite, la tostadora de Calzada y los asfixies con bobolina.',
    content: 'Lenteja Rubia de La Armuña gigante de Gomecello Garbanzo de Pedrosillo Rhizobium nitrógeno fertilización natural gorgojo plaga tinajas aceite de oliva Sierra de Gata Gonzalo Sánchez tostado Calzada de Valdunciel asfixies bobolina anoxia',
    badge: 'Economía · Lenteja',
  },
  {
    id: 'economia-acenas-tormes',
    tab: 'economia',
    target: 'aceñas-tormes',
    title: 'Las aceñas del Tormes y el tributo de la maquila',
    excerpt: 'Molienda hidráulica señorial en Cabrerizos y La Flecha, la maquila (1/12 parte), bueyes invernando en el soto y agua blanda del río.',
    content: 'aceñas molinos hidráulicos río Tormes Cabrerizos La Flecha maquila celemín fanega panaderos harina Cabildo catedralicio Chantre Pedro Juan Vázquez Coronado Gonzalo de Villafuerte agua blanda dureza pozos Miguel el Silletero eneas esparto ranas',
    badge: 'Economía · Tormes',
  },
  {
    id: 'economia-madoz-tren-silos',
    tab: 'economia',
    target: 'madoz-tren-silos',
    title: 'Pascual Madoz (1845), el ferrocarril (1877) y los silos',
    excerpt: 'Las 40 casas de Madoz y la charca concejil, la línea férrea Medina–Salamanca de 1877 y la Red Nacional de Silos y Graneros.',
    content: 'Pascual Madoz Diccionario 1845 charca concejil pozos ferrocarril 1877 Medina del Campo Salamanca estación de Moriscos tren vapor trigo Red Nacional de Silos Graneros Gomecello FEGA Servicio Nacional del Trigo hormigón armado',
    badge: 'Economía · Transporte',
  },
  {
    id: 'economia-siglo-xxi-novartis',
    tab: 'economia',
    target: 'siglo-xxi-novartis',
    title: 'Siglo XXI: Industria, Novartis, Helcesa y biotecnología',
    excerpt: 'Inversión de 12,9 M€ de Novartis en Castellanos de Moriscos para radioligandos oncológicos, Helcesa, CTR de Gomecello y firmas de legumbres.',
    content: 'Novartis radioligandos oncológicos cáncer 12.9 millones polígono industrial Castellanos de Moriscos Helcesa acero inoxidable jamón porcino CTR Gomecello tratamiento de residuos Centro de la Legumbre Pajares Legumbres Montes Legumer',
    badge: 'Economía · Industria',
  },
  {
    id: 'economia-fuentes-referencias',
    tab: 'economia',
    target: 'fuentes-referencias',
    title: 'Aparato crítico y fuentes de la economía de Moriscos',
    excerpt: 'Monografías comarcales, archivo municipal de Cabrerizos, léxico tradicional de Mozodiel y guion de La Flecha.',
    content: 'fuentes bibliografía referencias citas aparato crítico archivo Cabrerizos Mozodiel de Sanchíñigo historia económica',
    badge: 'Economía · Fuentes',
  },

  // --- LUGARES EMBLEMÁTICOS ---
  {
    id: 'lugar-parque-grande',
    tab: 'lugares',
    target: 'lugar-parque-grande',
    title: 'El Parque Grande (Parque de la Alameda)',
    excerpt: 'Principal pulmón verde y de ocio del casco urbano, con arboleda, juegos infantiles, tirolina y chupinazo de fiestas.',
    content: 'Parque Grande Parque de la Alameda jardines arboleda tirolina juegos infantiles chupinazo peñas ocio verde',
    badge: 'Lugar emblemático',
  },
  {
    id: 'lugar-parque-chico',
    tab: 'lugares',
    target: 'lugar-parque-chico',
    title: 'El Parque Chico',
    excerpt: 'Plaza con jardines, pista deportiva y graderío en la zona este; acoge el vermú y la animación de charangas.',
    content: 'Parque Chico plaza jardines pista deportiva graderío vermú charangas animación fiestas',
    badge: 'Lugar emblemático',
  },
  {
    id: 'lugar-plaza-grande',
    tab: 'lugares',
    target: 'lugar-plaza-grande',
    title: 'La Plaza Grande y el Ayuntamiento',
    excerpt: 'Centro cívico e institucional del municipio, sede consistorial, escenario de verbenas populares y paella comunitaria.',
    content: 'Plaza Grande ayuntamiento casa consistorial verbenas orquestas paella popular casetas centro urbano',
    badge: 'Lugar emblemático',
  },
  {
    id: 'lugar-cementerio',
    tab: 'lugares',
    target: 'lugar-cementerio',
    title: 'El Cementerio Municipal',
    excerpt: 'Situado en el Camino de San Morales, camposanto con cipreses y tapias de calzada erigido a comienzos del siglo XX.',
    content: 'cementerio camposanto cipreses sepulturas camino San Morales memoria difuntos siglo XX',
    badge: 'Lugar emblemático',
  },

  // --- PARAJES NATURALES Y COTAS ---
  {
    id: 'paraje-vertice-andorra',
    tab: 'lugares',
    target: 'paraje-vertice-andorra',
    title: 'Vértice Geodésico «Andorra» (IGN nº 47879 · 871,4 m)',
    excerpt: 'La cota más alta del término municipal de Moriscos; pilar geodésico con placa de bronce y vistas panorámicas de La Armuña y Salamanca.',
    content: 'vértice geodésico Andorra IGN 47879 871 metros cota máxima mirador placa de bronce Instituto Geográfico Nacional horizonte Catedrales Salamanca',
    badge: 'Paraje natural',
  },
  {
    id: 'paraje-valdepega',
    tab: 'lugares',
    target: 'paraje-valdepega',
    title: 'El Árbol de Valdepega y el histórico pago vinícola',
    excerpt: 'Ejemplar solitario recortado en las colinas cerealistas; antiguo pago con viñedo tradicional y coto de caza.',
    content: 'Árbol de Valdepega pago Valdepega viña vino majuelos árbol solitario atardecer colinas campos secano caza',
    badge: 'Paraje natural',
  },
  {
    id: 'paraje-abrevadero-pilones',
    tab: 'lugares',
    target: 'paraje-abrevadero',
    title: 'Los Pilones: abrevadero comunal de caminos de labor',
    excerpt: 'Pilas ganaderas de hormigón y mampostería en la red de caminos de concentración parcelaria para abastecer rebaños y ganado de labor.',
    content: 'Los Pilones abrevadero comunal pilas ganaderas agua concentración parcelaria ovejas ganado bueyes mulas',
    badge: 'Patrimonio rural',
  },
  {
    id: 'paraje-laguna-serrada',
    tab: 'lugares',
    target: 'paraje-laguna-serrada',
    title: 'Laguna de la Serrada (Charca de la Serrá)',
    excerpt: 'Depresión endorreica estacional reforestada como refugio biológico para la perdiz roja y aves esteparias.',
    content: 'Laguna de la Serrada Charca de la Serrá balsa humedal endorreico perdiz roja fauna aves esteparias confluencia arroyos',
    badge: 'Paraje natural',
  },
  {
    id: 'paraje-cavenes',
    tab: 'lugares',
    target: 'paraje-cavenes',
    title: 'Las Cavenes y el Terrubio',
    excerpt: 'Cárcavas y socavones de arcilla rojiza vinculados a la minería aurífera romana y al legendario Castillo de Ripas.',
    content: 'Las Cavenes Terrubio cárcavas arcilla oro romano Castillo de Ripas foso motocross zanja',
    badge: 'Paraje natural',
  },
  {
    id: 'paraje-teso-parapeto',
    tab: 'lugares',
    target: 'paraje-teso-parapeto',
    title: 'El Parapeto y Teso de la Cabaña (Guerra de 1812)',
    excerpt: 'Eminencia topográfica fortificada por el mariscal Marmont en los combates preliminares de la Batalla de Los Arapiles.',
    content: 'El Parapeto Teso de la Cabaña 1812 Guerra de la Independencia Marmont Wellington franceses ingleses Arapiles fortificación trincheras',
    badge: 'Paraje histórico',
  },

  // --- LUGARES DESAPARECIDOS O TRANSFORMADOS ---
  {
    id: 'desaparecido-charca-concejil',
    tab: 'lugares',
    target: 'desaparecido-charca',
    title: 'La Charca concejil (desaparecida)',
    excerpt: 'Balsa comunal situada junto a la salida norte donde abrevaban los bueyes y yuntas de mulas; desecada hacia 1970.',
    content: 'charca concejil balsa abrevadero comunal bueyes yuntas mulas Madoz desecada saneamiento asfaltado',
    badge: 'Memoria perdida',
  },
  {
    id: 'desaparecido-eras-trillar',
    tab: 'lugares',
    target: 'desaparecido-eras',
    title: 'Las Eras de trillar (transformadas)',
    excerpt: 'Superficies circulares de tierra apisonada donde se trillaba con trillo de pedernal o rodillo; absorbidas por la parcelaria.',
    content: 'eras de trillar trilla trillo pedernal bueyes mies fanega parva bieldo concentración parcelaria',
    badge: 'Memoria perdida',
  },
  {
    id: 'desaparecido-camino-acena',
    tab: 'lugares',
    target: 'desaparecido-camino-acena',
    title: 'El Camino tradicional de la Aceña',
    excerpt: 'Antiguo trazado vecinal carretero hacia las moliendas del Tormes y La Flecha, seccionado por la autovía A-62.',
    content: 'Camino de la Aceña camino carretero molinos Tormes La Flecha autovía A-62 concentración parcelaria',
    badge: 'Memoria perdida',
  },
  {
    id: 'desaparecido-ponton-ferreo',
    tab: 'lugares',
    target: 'desaparecido-ponton',
    title: 'El Pontón de la vía férrea',
    excerpt: 'Paso inferior abovedado de cantería y ladrillo de 1877 que permitía cruzar los convoyes ferroviarios sin riesgo.',
    content: 'pontón vía férrea puente bóveda cantería tren 1877 paso inferior camino',
    badge: 'Memoria perdida',
  },
  {
    id: 'desaparecido-estacion-tren',
    tab: 'lugares',
    target: 'desaparecido-estacion',
    title: 'La Estación y apeadero de Moriscos (1877)',
    excerpt: 'Edificio de viajeros de dos plantas y muelle de carga de cereal de la línea Medina–Salamanca, derribado a finales del siglo XX.',
    content: 'estación apeadero ferrocarril 1877 Medina del Campo Salamanca muelle de carga viajeros tren vapor derribo',
    badge: 'Memoria perdida',
  },
  {
    id: 'desaparecido-el-hoyo-alqueria',
    tab: 'lugares',
    target: 'desaparecido-el-hoyo',
    title: 'El Despoblado de El Hoyo',
    excerpt: 'Alquería y parroquia medieval repoblada en el siglo XII, despoblada por peste y hambruna e integrada en Moriscos.',
    content: 'El Hoyo despoblado alquería medieval repoblación siglo XII Alfonso VI ruinas memoria heráldica escudo',
    badge: 'Memoria perdida',
  },

  // --- FOTOGRAFÍAS DOCUMENTALES (Pablo Crespo Bellido) ---
  {
    id: 'foto-vertice-andorra-entry',
    tab: 'lugares',
    target: 'foto-vertice-andorra',
    title: 'Fotografía: Vértice Geodésico Andorra (30 ago 2026)',
    excerpt: 'Fotografía documental del vértice IGN nº 47879 en la cumbre de Moriscos (Pablo Crespo Bellido).',
    content: 'fotografía foto vértice geodésico Andorra 30 de agosto de 2026 Pablo Crespo Bellido placa bronce 871 m',
    badge: 'Fotografía',
  },
  {
    id: 'foto-arbol-valdepega-entry',
    tab: 'lugares',
    target: 'foto-arbol-valdepega',
    title: 'Fotografía: Árbol solitario de Valdepega (30 ago 2026)',
    excerpt: 'Fotografía documental del emblemático árbol al atardecer sobre el secano armuñés (Pablo Crespo Bellido).',
    content: 'fotografía foto Árbol de Valdepega 30 de agosto de 2026 Pablo Crespo Bellido ocaso atardecer secano colinas doradas',
    badge: 'Fotografía',
  },
  {
    id: 'foto-cosecha-alpacas-entry',
    tab: 'lugares',
    target: 'foto-cosecha-alpacas',
    title: 'Fotografía: Cosecha y empacado de cereal (15 jul 2025)',
    excerpt: 'Tractor transportando alpacas de paja dorada junto a campos de girasoles al atardecer (Pablo Crespo Bellido).',
    content: 'fotografía foto cosecha cereal alpacas paja tractor girasoles mies 15 de julio de 2025 Pablo Crespo Bellido',
    badge: 'Fotografía',
  },
  {
    id: 'foto-abrevadero-entry',
    tab: 'lugares',
    target: 'foto-abrevadero',
    title: 'Fotografía: Los Pilones y abrevadero comunal (22 mar 2025)',
    excerpt: 'Vista aérea cenital de las pilas ganaderas en los caminos de concentración (Pablo Crespo Bellido).',
    content: 'fotografía foto Los Pilones abrevadero pilas ganaderas caminos concentración 22 de marzo de 2025 Pablo Crespo Bellido',
    badge: 'Fotografía',
  },

  // --- ESCUDO HERÁLDICO ---
  {
    id: 'escudo-cuartel-1',
    tab: 'escudo',
    target: 'cuartel-1',
    title: 'Primer cuartel del escudo: la repoblación y El Hoyo',
    excerpt: 'Campo de gules (rojo) con la cruz recruzada de plata y el relieve de oro del despoblado de El Hoyo y las Cavenes.',
    content: 'escudo cuartel 1 primero cruz recruzada plata gules rojo repoblación Alfonso VI Raimundo de Borgoña El Hoyo Cavenes alquerías',
    badge: 'Heráldica',
  },
  {
    id: 'escudo-cuartel-2',
    tab: 'escudo',
    target: 'cuartel-2',
    title: 'Segundo cuartel del escudo: trigo y zumaque',
    excerpt: 'Campo de oro con espiga de trigo de secano y rama de zumaque (Rhus Coriaria), símbolo del curtido de cueros.',
    content: 'escudo cuartel 2 segundo oro trigo candeal espiga zumaque Rhus Coriaria taninos curtido cueros agricultura industria salmantina',
    badge: 'Heráldica',
  },
  {
    id: 'escudo-entado-punta',
    tab: 'escudo',
    target: 'entado-punta',
    title: 'Entado en punta: la luna creciente y el origen del nombre',
    excerpt: 'Triángulo de azur con luna creciente de plata, símbolo parlante que alude al pasado andalusí y mudéjar de "Moriscos".',
    content: 'escudo entado en punta luna creciente media luna plata azur azul nombre Moriscos mudéjares andalusí morisco 1609',
    badge: 'Heráldica',
  },
  {
    id: 'escudo-timbre-corona',
    tab: 'escudo',
    target: 'timbre-corona',
    title: 'El timbre del escudo: Corona Real cerrada',
    excerpt: 'Corona Real española cerrada, símbolo constitucional de la soberanía municipal en el Reino de España.',
    content: 'escudo timbre Corona Real cerrada corona España constitucional municipio heráldica',
    badge: 'Heráldica',
  },

  // --- FIESTAS Y TRADICIONES ---
  {
    id: 'fiesta-peregrina',
    tab: 'fiestas',
    target: 'fiesta-peregrina',
    title: 'Fiestas Patronales de la Virgen de la Peregrina',
    excerpt: 'Fiesta mayor en agosto: chupinazo, procesión, subasta de roscas de pan bendito, paella popular y parrillada.',
    content: 'Fiestas Patronales Virgen de la Peregrina patrona agosto chupinazo campanas procesión manto carmesí roscas pan bendito paella popular parrillada Acogótala pedida de la botella Asaltacalles peñas',
    badge: 'Fiestas',
  },
  {
    id: 'fiesta-san-pedro',
    tab: 'fiestas',
    target: 'fiesta-san-pedro',
    title: 'San Pedro Apóstol (29 de junio)',
    excerpt: 'Patrón titular de la parroquia y del municipio de Moriscos; solemnes actos litúrgicos e institucionales.',
    content: 'San Pedro Apóstol 29 de junio patrón titular parroquia iglesia liturgia fiesta patronal',
    badge: 'Fiestas',
  },
  {
    id: 'fiesta-san-isidro',
    tab: 'fiestas',
    target: 'fiesta-san-isidro',
    title: 'San Isidro Labrador (15 de mayo)',
    excerpt: 'Homenaje de los agricultores con la bendición de los campos de cereal y legumbre en La Armuña.',
    content: 'San Isidro Labrador 15 de mayo agricultores bendición de campos trigo lenteja hermandad convivencia',
    badge: 'Fiestas',
  },
  {
    id: 'fiesta-lunes-aguas',
    tab: 'fiestas',
    target: 'fiesta-lunes-aguas',
    title: 'El Lunes de Aguas',
    excerpt: 'Tradición salmantina del lunes de Pascua: merienda popular en el campo y sotos del Tormes degustando el hornazo.',
    content: 'Lunes de Aguas hornazo embutido merienda Pascua campo sotos río Tormes La Flecha tradición salmantina',
    badge: 'Fiestas',
  },

  // --- RUTA NOCTURNA Y SUS HITOS ---
  {
    id: 'ruta-nocturna-flecha',
    tab: 'ruta-nocturna',
    target: null,
    title: 'Ruta nocturna al soto de La Flecha',
    excerpt: 'Sendero de 7,7 km con ocho hitos históricos hasta el oratorio de Fray Luis de León.',
    content: 'senderismo ruta nocturna luna llena Fray Luis de León Unamuno Tormes La Flecha marcha sendero mapa interactivo',
    badge: 'Ruta',
  },
  {
    id: 'ruta-hito-andorra',
    tab: 'ruta-nocturna',
    target: 'vertice-andorra',
    title: 'Ruta Nocturna · Hito 4: Vértice Geodésico Andorra',
    excerpt: 'Km 3,9: Cota más alta del término (871 m), desnivel de 93 m al Tormes y vistas nocturnas de la Catedral de Salamanca.',
    content: 'Hito 4 vértice geodésico Andorra ruta nocturna IGN 47879 mirador km 3.9 Catedral Salamanca',
    badge: 'Ruta nocturna',
  },
  {
    id: 'ruta-hito-parapeto',
    tab: 'ruta-nocturna',
    target: 'el-parapeto',
    title: 'Ruta Nocturna · Hito 5: El Parapeto y Teso de La Cabaña',
    excerpt: 'Km 5,0: Posiciones defensivas del ejército francés en 1812 previas a la Batalla de Los Arapiles.',
    content: 'Hito 5 El Parapeto Teso de La Cabaña ruta nocturna 1812 Marmont Wellington Arapiles km 5.0',
    badge: 'Ruta nocturna',
  },
  {
    id: 'ruta-hito-cavenes',
    tab: 'ruta-nocturna',
    target: 'cavenes-ripas',
    title: 'Ruta Nocturna · Hito 6: Las Cavenes y Castillo de Ripas',
    excerpt: 'Km 6,0: Cárcavas romanas de lavado de oro y emplazamiento medieval del Castillo de Ripas (siglo X).',
    content: 'Hito 6 Las Cavenes Castillo de Ripas ruta nocturna oro romano Ramiro II Terrubio km 6.0',
    badge: 'Ruta nocturna',
  },
  {
    id: 'ruta-hito-acena',
    tab: 'ruta-nocturna',
    target: 'pesquera-acena',
    title: 'Ruta Nocturna · Hito 7: La Pesquera y Aceña Agustina',
    excerpt: 'Km 6,9: Azud sobre el río Tormes y tajamares de la aceña del siglo XVI donde se cobraba la maquila.',
    content: 'Hito 7 La Pesquera Aceña Agustina ruta nocturna río Tormes azud maquila siglo XVI km 6.9',
    badge: 'Ruta nocturna',
  },
  {
    id: 'ruta-hito-flecha',
    tab: 'ruta-nocturna',
    target: 'oratorio-flecha',
    title: 'Ruta Nocturna · Hito 8: Oratorio de La Flecha y Sillón de Unamuno',
    excerpt: 'Km 7,7: Destino de la marcha, retiro de Fray Luis de León y asiento de piedra de Miguel de Unamuno.',
    content: 'Hito 8 Oratorio La Flecha Sillón Unamuno Fray Luis de León río Tormes soto descansada vida km 7.7',
    badge: 'Ruta nocturna',
  },

  // --- SECCIONES GENERALES ---
  {
    id: 'iglesia-templo',
    tab: 'iglesia',
    target: null,
    title: 'Iglesia Parroquial de San Pedro Apóstol',
    excerpt: 'Monumento de los siglos XII-XVI con retablo rococó, espadaña y el lienzo barroco restaurado de la Virgen Peregrina.',
    content: 'mampostería mudéjar espadaña retablo rococó Virgen Peregrina cofradías Catedrales de La Armuña 1164 1265 lienzo barroco',
    badge: 'Monumento',
  },
  {
    id: 'escudo-oficial',
    tab: 'escudo',
    target: null,
    title: 'Escudo heráldico de Moriscos',
    excerpt: 'Cruz recruzada de plata, El Hoyo, la espiga de trigo, el zumaque y la luna creciente.',
    content: 'heráldica gules oro azur cruz recruzada zumaque Rhus Coriaria luna creciente Corona Real cuartel',
    badge: 'Heráldica',
  },
  {
    id: 'seccion-galeria',
    tab: 'galeria',
    target: null,
    title: 'Galería fotográfica de Moriscos',
    excerpt: 'Fototeca comunitaria con labores del campo y la cosecha, panorámicas aéreas, fiestas y patrimonio.',
    content: 'galería fototeca fotos imágenes fotografías panorámica atardecer noche tractor alpacas cosecha mies girasoles iglesia San Pedro Virgen Peregrina escudo Vértice Andorra Valdepega Pablo Crespo Bellido',
    badge: 'Fototeca',
  },
  {
    id: 'seccion-referencias',
    tab: 'referencias',
    target: null,
    title: 'Referencias y fuentes documentales',
    excerpt: 'Archivos, monografías, hemeroteca y portales digitales en los que se basa esta web.',
    content: 'bibliografía fuentes archivo diocesano Catastro de Ensenada Madoz INE IGN hemeroteca Morisqueños moriscos.info Miguel Blanco González Cabrerizos Mozodiel',
    badge: 'Fuentes',
  },
  {
    id: 'seccion-sobre',
    tab: 'sobre-la-web',
    target: null,
    title: 'Sobre esta web: proyecto y agradecimientos',
    excerpt: 'Agradecimiento a Miguel Blanco González (moriscos.info), por qué existe el proyecto, fuentes y contacto.',
    content: 'proyecto personal independiente contacto colaboración código abierto GitHub aviso Pablo Crespo Bellido Miguel Blanco González moriscos.info agradecimiento',
    badge: 'El proyecto',
  },
];

processAll();
