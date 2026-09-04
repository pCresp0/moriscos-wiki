import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const downloadsDir = '/Users/pcrespo/Downloads';
const publicDir = path.resolve('public/images');
const originalsDir = path.resolve(publicDir, 'originals');

if (!fs.existsSync(originalsDir)) {
  fs.mkdirSync(originalsDir, { recursive: true });
}

// Mapeo de archivos originales
const imageMap = [
  {
    originalFile: 'iglesia de moriscos_20250323_104456_0069_1742817473378_photo.jpg',
    targetBase: 'iglesia-san-pedro-aerea',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: 'nido y cigue´ña de la iglesia.jpeg',
    targetBase: 'iglesia-torre-ciguenas',
    ext: 'jpg',
    maxDim: 2560,
  },
  {
    originalFile: 'panoramica total de moriscos_20250323_105312_0084_1742817436888_photo.jpg',
    targetBase: 'moriscos-panoramica-horizonte',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: 'moriscos empezando la primavera_20250323.jpg',
    targetBase: 'moriscos-panoramica-primavera',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: 'Lospilones-vistalateral-20250322.jpg',
    targetBase: 'moriscos-abrevadero-fuente',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: 'cementerio-vistazenital_20250323.jpg',
    targetBase: 'moriscos-cementerio-cenital',
    ext: 'jpg',
    maxDim: 2560,
  },
  {
    originalFile: 'cementerio-vistazenitalalejada_20250323.jpg',
    targetBase: 'moriscos-cementerio-soledad',
    ext: 'jpg',
    maxDim: 2560,
  },
  {
    originalFile: 'campos cultivo aledaños a morisocs_20250323_105958_0087_1742726609007_photo.jpg',
    targetBase: 'armuna-rodal-arboles',
    ext: 'jpg',
    maxDim: 2560,
  },
  {
    originalFile: 'camposaledaños a moriscos_20250323_110324_0091_1742726567778_photo.jpg',
    targetBase: 'armuna-campos-verdes',
    ext: 'jpg',
    maxDim: 2560,
  },
  {
    originalFile: '18julio2026_Moriscos al atardecer.jpg',
    targetBase: 'moriscos-panoramica-atardecer',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: '09agosto2026_Moriscos de noche.jpg',
    targetBase: 'moriscos-panoramica-noche',
    ext: 'jpg',
    maxDim: 3200,
  },
  {
    originalFile: 'Virgen Peregrina.jpg',
    targetBase: 'virgen-peregrina',
    ext: 'jpg',
    maxDim: 1600,
  },
];

async function run() {
  console.log('=== Procesando colección fotográfica híbrida Pro ===\n');

  for (const item of imageMap) {
    const srcPath = path.join(downloadsDir, item.originalFile);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARN] No se encontró el original: ${srcPath}`);
      continue;
    }

    const originalStats = fs.statSync(srcPath);
    const originalSizeMb = (originalStats.size / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';

    // 1. Copiar original a public/images/originals/
    const originalDestName = `${item.targetBase}-original.${item.ext}`;
    const originalDestPath = path.join(originalsDir, originalDestName);
    fs.copyFileSync(srcPath, originalDestPath);

    // 2. Leer metadatos del original
    const meta = await sharp(srcPath).metadata();
    const origRes = `${meta.width} × ${meta.height}`;
    const mp = ((meta.width * meta.height) / 1000000).toFixed(1).replace('.', ',') + ' MP';

    // 3. Generar versión Ultra-HD optimizada para pantalla web
    const webDestPath = path.join(publicDir, `${item.targetBase}.${item.ext}`);
    const webInfo = await sharp(srcPath)
      .resize({
        width: meta.width >= meta.height ? item.maxDim : undefined,
        height: meta.height > meta.width ? item.maxDim : undefined,
        withoutEnlargement: true,
      })
      .jpeg({ quality: 86, progressive: true, mozjpeg: true })
      .toFile(webDestPath);

    const webSizeKb = Math.round(webInfo.size / 1024) + ' KB';
    const webRes = `${webInfo.width} × ${webInfo.height}`;

    console.log(`✓ ${item.targetBase}:`);
    console.log(`  - Original 48MP/Master: ${origRes} (${mp}) · ${originalSizeMb} -> originals/${originalDestName}`);
    console.log(`  - Web Ultra-HD (4K):    ${webRes} · ${webSizeKb} -> images/${item.targetBase}.${item.ext}\n`);
  }

  // Copiar también la de alpacas a originals si existe
  const alpacasPath = path.join(publicDir, 'moriscos-cosecha-alpacas.jpg');
  if (fs.existsSync(alpacasPath)) {
    fs.copyFileSync(alpacasPath, path.join(originalsDir, 'moriscos-cosecha-alpacas-original.jpg'));
    console.log('✓ moriscos-cosecha-alpacas copiada a originals');
  }

  console.log('\nProcesamiento híbrido completado con éxito.');
}

run().catch(console.error);
