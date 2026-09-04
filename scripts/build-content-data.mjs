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
    ...personajes.map((p) => ({
      id: `personaje-${p.id}`,
      tab: 'genealogia',
      target: p.id,
      title: p.name,
      excerpt: p.role || excerpt(p.content),
      content: excerpt(p.content, 600),
      badge: p.tag ? `Personaje · ${p.tag}` : 'Personaje',
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
const staticEntries = [
  {
    id: 'seccion-historia',
    tab: 'historia',
    target: null,
    title: 'Historia de Moriscos',
    excerpt: 'Eje cronológico de mil años: repoblación medieval, Edad Moderna, 1812, siglo XX y actualidad.',
    content: 'cronología historia repoblación Alfonso VI Madoz ferrocarril 1877 Unamuno Fray Luis 1941 área metropolitana',
    badge: 'Historia',
  },
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
    id: 'seccion-lugares',
    tab: 'lugares',
    target: null,
    title: 'Lugares y parajes de Moriscos',
    excerpt: 'Localizaciones emblemáticas, parajes naturales y lugares desaparecidos del término municipal.',
    content: 'iglesia ayuntamiento parque grande eras charca vértice geodésico Andorra Las Cavenes El Hoyo La Estación',
    badge: 'Lugares',
  },
  {
    id: 'iglesia-templo',
    tab: 'iglesia',
    target: null,
    title: 'Iglesia de San Pedro Apóstol',
    excerpt: 'Monumento de los siglos XII-XVI con retablo rococó y el lienzo barroco de la Virgen Peregrina.',
    content: 'mampostería mudéjar espadaña retablo rococó Virgen Peregrina cofradías Catedrales de La Armuña 1164 1265',
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
    id: 'fiestas-peregrina',
    tab: 'fiestas',
    target: null,
    title: 'Fiestas de la Virgen de la Peregrina',
    excerpt: 'Fiesta mayor de agosto: chupinazo, procesión, subasta de roscas, paella popular y parrillada.',
    content: 'chupinazo procesión roscas de pan bendito Acogótala pedida de la botella Asaltacalles San Isidro Lunes de Agua hornazo',
    badge: 'Fiestas',
  },
  {
    id: 'ruta-nocturna-flecha',
    tab: 'ruta-nocturna',
    target: null,
    title: 'Ruta nocturna al soto de La Flecha',
    excerpt: 'Sendero de 7,7 km con ocho hitos históricos hasta el oratorio de Fray Luis de León.',
    content: 'senderismo vértice geodésico Andorra El Parapeto Ribas aceña oratorio Fray Luis de León Tormes luna llena',
    badge: 'Ruta',
  },
  {
    id: 'seccion-galeria',
    tab: 'galeria',
    target: null,
    title: 'Galería fotográfica de Moriscos',
    excerpt: 'Fototeca comunitaria con labores del campo y la cosecha, panorámicas aéreas, fiestas y patrimonio.',
    content: 'galería fototeca fotos imágenes fotografías panorámica atardecer noche tractor alpacas cosecha mies girasoles iglesia San Pedro Virgen Peregrina escudo',
    badge: 'Fototeca',
  },
  {
    id: 'seccion-genealogia',
    tab: 'genealogia',
    target: null,
    title: 'Bosque Genealógico de Moriscos',
    excerpt: 'Más de 350 años de historia familiar a partir de los libros parroquiales iniciados en 1645.',
    content: 'genealogía apellidos Blanco Romo Pedraz Crespo Salvador archivo parroquial 1645 Ventanas del Ayer y Hoy',
    badge: 'Genealogía',
  },
  {
    id: 'seccion-referencias',
    tab: 'referencias',
    target: null,
    title: 'Referencias y fuentes documentales',
    excerpt: 'Archivos, monografías, hemeroteca y portales digitales en los que se basa esta web.',
    content: 'bibliografía fuentes archivo diocesano Catastro de Ensenada Madoz INE IGN hemeroteca Morisqueños',
    badge: 'Fuentes',
  },
  {
    id: 'seccion-sobre',
    tab: 'sobre-la-web',
    target: null,
    title: 'Sobre esta web',
    excerpt: 'Por qué existe el proyecto, de dónde sale la información y cómo contactar o colaborar.',
    content: 'proyecto personal independiente contacto colaboración código abierto GitHub aviso Pablo Crespo Bellido',
    badge: 'El proyecto',
  },
];

processAll();
