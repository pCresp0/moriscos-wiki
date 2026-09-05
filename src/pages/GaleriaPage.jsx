import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag, ExternalLink, Camera, Download, Loader2 } from 'lucide-react';

const categories = [
  { id: 'todas', label: 'Todas las fotos' },
  { id: 'paisaje', label: '🌤️ Panorámicas Aéreas' },
  { id: 'patrimonio', label: '⛪ Iglesia y Memoria' },
  { id: 'campo', label: '🌾 Campo y Faenas' },
  { id: 'fiestas', label: '🎉 Fiestas y Tradición' },
  { id: 'heraldica', label: '🛡️ Heráldica' },
];

export const galleryPhotos = [
  {
    id: 'iglesia-san-pedro-aerea',
    title: 'Iglesia de Moriscos: conjunto y plaza',
    originalTitle: 'iglesia de moriscos_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Plaza de la Iglesia · Casco urbano de Moriscos',
    src: '/moriscos-wiki/images/iglesia-san-pedro-aerea.jpg',
    originalSrc: '/moriscos-wiki/images/originals/iglesia-san-pedro-aerea-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '9,1 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Perspectiva aérea cenital de la Iglesia de San Pedro Apóstol de Moriscos tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Perspectiva aérea de conjunto del templo de San Pedro Apóstol capturada la mañana del 23 de marzo de 2025: la nave única, la esbelta espadaña-torre de cantería de Villamayor, los tejados de teja curva árabe y el atrio cercado por petril de piedra en la plaza central.',
    tabLink: 'iglesia',
    tabLabel: 'Descubrir el templo y su historia',
  },
  {
    id: 'iglesia-torre-ciguenas',
    title: 'Nido y cigüeña de la iglesia',
    originalTitle: 'nido y cigue´ña de la iglesia',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Campanario de San Pedro · Moriscos',
    src: '/moriscos-wiki/images/iglesia-torre-ciguenas.jpg',
    originalSrc: '/moriscos-wiki/images/originals/iglesia-torre-ciguenas-original.jpg',
    originalResolution: '3133 × 5570 (17,5 MP)',
    originalSize: '5,1 MB',
    width: 1440,
    height: 2560,
    aspect: 'vertical',
    alt: 'Detalle aéreo de la torre campanario de San Pedro con nido y cigüeña blanca tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 17,5 MP',
    description:
      'Detalle aéreo en plano medio capturado el 23 de marzo de 2025: la espadaña-torre rematada por tejado a cuatro aguas, la veleta de forja tradicional con cruz y sol radiante, y una pareja de cigüeñas blancas descansando en su nido en el alero, con el campo de La Armuña al fondo.',
    tabLink: 'iglesia',
    tabLabel: 'Ver arquitectura del templo',
  },
  {
    id: 'moriscos-panoramica-horizonte',
    title: 'Panorámica total de Moriscos y horizonte',
    originalTitle: 'panoramica total de moriscos_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea cenital · Término de Moriscos',
    src: '/moriscos-wiki/images/moriscos-panoramica-horizonte.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-horizonte-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '7,7 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Gran panorámica total de Moriscos tomada el 23 de marzo de 2025 con cielo de nubes y horizonte hacia Salamanca',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Gran panorámica aérea de gran angular tomada el 23 de marzo de 2025: el caserío de Moriscos en el centro de la llanura de La Armuña, con sombras dinámicas de nubes proyectadas sobre las parcelas verdes y la silueta de Salamanca en el horizonte.',
    tabLink: 'lugares',
    tabLabel: 'Explorar parajes del término',
  },
  {
    id: 'panoramica-primavera',
    title: 'Moriscos empezando la primavera',
    originalTitle: 'moriscos empezando la primavera_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Término municipal de Moriscos',
    src: '/moriscos-wiki/images/moriscos-panoramica-primavera.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-primavera-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '7,8 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Fotografía aérea de Moriscos empezando la primavera tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Vista aérea capturada el 23 de marzo de 2025 al inicio de la estación primaveral: el pueblo agrupado en el llano castellano contrastando con el mosaico verde de los brotes de cereal y legumbres que alfombran el término municipal.',
    tabLink: 'lugares',
    tabLabel: 'Explorar el término municipal',
  },
  {
    id: 'cosecha-alpacas-2025',
    title: 'La mies y el empacado de cereal al atardecer',
    originalTitle: 'tractor con alpacas_15julio2025',
    author: 'Pablo Crespo Bellido',
    date: '15 de julio de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Caminos de concentración · La Armuña',
    src: '/moriscos-wiki/images/moriscos-cosecha-alpacas.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-cosecha-alpacas-original.jpg',
    originalResolution: '1024 × 576',
    originalSize: '155 KB',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Tractor transportando remolque de alpacas de paja de cereal al atardecer tomado el 15 de julio de 2025',
    badge: '15 jul 2025 · Cosecha estival',
    description:
      'Instantánea aérea capturada al caer la tarde del 15 de julio de 2025: un tractor traslada un remolque colmado de alpacas de paja por los caminos de labor, flanqueado por un campo de girasoles en flor y rastrojo segado, con el caserío de Moriscos al fondo bañado por la luz poniente.',
    tabLink: 'lugares',
    tabLabel: 'Ver paisaje agrícola en Lugares',
  },
  {
    id: 'moriscos-abrevadero-fuente',
    title: 'Los Pilones: abrevadero comunal y pilas ganaderas',
    originalTitle: 'Lospilones-vistalateral-20250322',
    author: 'Pablo Crespo Bellido',
    date: '22 de marzo de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Los Pilones · Caminos de labor de Moriscos',
    src: '/moriscos-wiki/images/moriscos-abrevadero-fuente.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-abrevadero-fuente-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '8,4 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Vista aérea cenital de Los Pilones (abrevadero y pilas ganaderas) tomada el 22 de marzo de 2025',
    badge: '22 mar 2025 · Master 48 MP',
    description:
      'Vista aérea de Los Pilones tomada el 22 de marzo de 2025: histórica infraestructura agropecuaria comunal compuesta por largas pilas corridas de hormigón y caseta de manantial/bombeo para abrevar a los rebaños de ovejas y vacas en los caminos de labor pecuaria.',
    tabLink: 'lugares',
    tabLabel: 'Ver parajes en Lugares',
  },
  {
    id: 'moriscos-vertice-andorra',
    title: 'Vértice Geodésico «Andorra» (871,4 m)',
    originalTitle: 'vertice-geodesico-andorra_20260830',
    author: 'Pablo Crespo Bellido',
    date: '30 de agosto de 2026',
    category: 'patrimonio',
    categoryLabel: 'Geografía & Patrimonio',
    location: 'Paraje de La Andorra · Cota máxima de Moriscos',
    src: '/moriscos-wiki/images/moriscos-vertice-andorra.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-vertice-andorra-original.jpg',
    originalResolution: '768 × 1024',
    originalSize: '189 KB',
    width: 768,
    height: 1024,
    aspect: 'vertical',
    alt: 'Vértice Geodésico Andorra del Instituto Geográfico Nacional en Moriscos',
    badge: '30 ago 2026 · Hito IGN 47879',
    description:
      'Impresionante perspectiva del Vértice Geodésico «Andorra» (IGN nº 47879), capturada al atardecer del 30 de agosto de 2026 sobre el paraje de La Andorra. Con su pilar cilíndrico de hormigón, escalerilla de acceso y su clásica placa de bronce verde («La destrucción de esta señal está penada por la Ley»), marca la cumbre y cota más alta del término municipal a 871,464 metros de altitud, dominando el horizonte cerealista de La Armuña y la vega del río Tormes.',
    tabLink: 'lugares',
    tabLabel: 'Ver paraje en Lugares',
  },
  {
    id: 'moriscos-arbol-valdepega',
    title: 'El Árbol de Valdepega al atardecer',
    originalTitle: 'arbol-de-valdepega_20260830',
    author: 'Pablo Crespo Bellido',
    date: '30 de agosto de 2026',
    category: 'campo',
    categoryLabel: 'Campo y Paisaje',
    location: 'Pago de Valdepega · Moriscos',
    src: '/moriscos-wiki/images/moriscos-arbol-valdepega.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-arbol-valdepega-original.jpg',
    originalResolution: '768 × 1024',
    originalSize: '128 KB',
    width: 768,
    height: 1024,
    aspect: 'vertical',
    alt: 'Árbol solitario sobre las colinas doradas del pago de Valdepega en Moriscos',
    badge: '30 ago 2026 · Pago de Valdepega',
    description:
      'Lírica perspectiva del árbol solitario de Valdepega recortado sobre las suaves colinas onduladas del secano armuñés al atardecer del 30 de agosto de 2026. La luz rasante del ocaso baña la tierra arable proyectando una marcada sombra geométrica sobre las faldas del promontorio, encarnando la serenidad y la belleza de la campiña de Moriscos.',
    tabLink: 'lugares',
    tabLabel: 'Ver pago de Valdepega en Lugares',
  },
  {
    id: 'moriscos-cementerio-cenital',
    title: 'Cementerio Municipal: vista cenital',
    originalTitle: 'cementerio-vistazenital_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Camino del cementerio · Afueras de Moriscos',
    src: '/moriscos-wiki/images/moriscos-cementerio-cenital.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-cementerio-cenital-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '10,3 MB',
    width: 2560,
    height: 1440,
    aspect: 'horizontal',
    alt: 'Plano cenital perpendicular a 90 grados del Cementerio Municipal de Moriscos tomado el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Impresionante plano cenital directo a 90 grados capturado el 23 de marzo de 2025: el recinto rectangular con tapias encaladas de blanco, los panteones con cubiertas de teja árabe, las hileras de sepulturas y el silencio del camposanto en la campiña.',
    tabLink: 'lugares',
    tabLabel: 'Ver Cementerio en Lugares',
  },
  {
    id: 'moriscos-cementerio-soledad',
    title: 'Cementerio Municipal: vista cenital alejada',
    originalTitle: 'cementerio-vistazenitalalejada_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Llanura de Moriscos · La Armuña',
    src: '/moriscos-wiki/images/moriscos-cementerio-soledad.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-cementerio-soledad-original.jpg',
    originalResolution: '8064 × 4536 (36,6 MP)',
    originalSize: '10,4 MB',
    width: 2560,
    height: 1440,
    aspect: 'horizontal',
    alt: 'Vista cenital alejada del Cementerio Municipal de Moriscos tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Perspectiva cenital en altura capturada el 23 de marzo de 2025: el camposanto de Moriscos como un reducto de serenidad emplazado en medio de las grandes franjas agrícolas de La Armuña, flanqueado por el camino rural de tierra.',
    tabLink: 'lugares',
    tabLabel: 'Ver Cementerio en Lugares',
  },
  {
    id: 'armuna-rodal-arboles',
    title: 'Campos de cultivo aledaños y rodal de encinas',
    originalTitle: 'campos cultivo aledaños a morisocs_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Fincas de secano · Término de Moriscos',
    src: '/moriscos-wiki/images/armuna-rodal-arboles.jpg',
    originalSrc: '/moriscos-wiki/images/originals/armuna-rodal-arboles-original.jpg',
    originalResolution: '4536 × 8064 (36,6 MP)',
    originalSize: '10,8 MB',
    width: 1440,
    height: 2560,
    aspect: 'vertical',
    alt: 'Toma aérea cenital de campos de cultivo y rodal de encinas tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Toma aérea cenital capturada el 23 de marzo de 2025 que documenta los campos aledaños y un rodal de encinas autóctonas aislado en mitad del cereal, refugio biológico indispensable para la perdiz roja y liebres de La Armuña.',
    tabLink: 'lugares',
    tabLabel: 'Ver parajes del término',
  },
  {
    id: 'armuna-campos-verdes',
    title: 'Campos aledaños a Moriscos y horizontes abiertos',
    originalTitle: 'camposaledaños a moriscos_20250323',
    author: 'Pablo Crespo Bellido',
    date: '23 de marzo de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Llanura de secano · Término de Moriscos',
    src: '/moriscos-wiki/images/armuna-campos-verdes.jpg',
    originalSrc: '/moriscos-wiki/images/originals/armuna-campos-verdes-original.jpg',
    originalResolution: '4536 × 8064 (36,6 MP)',
    originalSize: '10,7 MB',
    width: 1440,
    height: 2560,
    aspect: 'vertical',
    alt: 'Vista aérea de los campos aledaños a Moriscos tomada el 23 de marzo de 2025',
    badge: '23 mar 2025 · Master 48 MP',
    description:
      'Perspectiva cenital capturada el 23 de marzo de 2025 que retrata las suaves ondulaciones y franjas de labor en los campos aledaños a Moriscos bajo el cielo salmantino.',
    tabLink: 'lugares',
    tabLabel: 'Ver cotas y parajes',
  },
  {
    id: 'panoramica-atardecer-2026',
    title: 'Moriscos al atardecer: casco urbano y penillanura',
    originalTitle: '18julio2026_Moriscos al atardecer',
    author: 'Pablo Crespo Bellido',
    date: '18 de julio de 2026',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea de Moriscos · La Armuña',
    src: '/moriscos-wiki/images/moriscos-panoramica-atardecer.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-atardecer-original.jpg',
    originalResolution: '4032 × 2268 (4K UHD · 9,1 MP)',
    originalSize: '5,7 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Panorámica aérea de Moriscos al atardecer tomada el 18 de julio de 2026 sobre los campos de La Armuña',
    badge: '18 jul 2026 · Master 4K UHD',
    description:
      'Perspectiva cenital y panorámica tomada el 18 de julio de 2026 al caer la tarde: la morfología del pueblo con la silueta de la torre de San Pedro sobresaliendo entre los tejados de teja curva y las parcelas cerealistas bajo el crepúsculo.',
    tabLink: 'inicio',
    tabLabel: 'Ver en portada',
  },
  {
    id: 'panoramica-noche-2026',
    title: 'Moriscos de noche: pueblo iluminado',
    originalTitle: '09agosto2026_Moriscos de noche',
    author: 'Pablo Crespo Bellido',
    date: '09 de agosto de 2026',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea nocturna sobre el casco urbano',
    src: '/moriscos-wiki/images/moriscos-panoramica-noche.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-noche-original.jpg',
    originalResolution: '4032 × 2268 (4K UHD · 9,1 MP)',
    originalSize: '5,2 MB',
    width: 3200,
    height: 1800,
    aspect: 'horizontal',
    alt: 'Panorámica aérea nocturna de Moriscos tomada el 09 de agosto de 2026',
    badge: '09 ago 2026 · Master 4K UHD',
    description:
      'Fotografía aérea nocturna tomada el 09 de agosto de 2026 durante las fechas festivas: el pueblo con sus calles y plazas iluminadas, punto de concentración y salida de la tradicional marcha nocturna hacia La Flecha.',
    tabLink: 'ruta-nocturna',
    tabLabel: 'Ver la Ruta Nocturna',
  },
  {
    id: 'virgen-peregrina',
    title: 'Nuestra Señora la Virgen de la Peregrina en procesión',
    originalTitle: 'Virgen Peregrina',
    author: 'Pablo Crespo Bellido',
    date: 'Fiestas Patronales de Agosto',
    category: 'fiestas',
    categoryLabel: 'Fiestas y Tradición',
    location: 'Parroquia y calles del pueblo',
    src: '/moriscos-wiki/images/virgen-peregrina.jpg',
    originalSrc: '/moriscos-wiki/images/originals/virgen-peregrina-original.jpg',
    originalResolution: '846 × 1280 (1,1 MP)',
    originalSize: '244 KB',
    width: 846,
    height: 1280,
    aspect: 'vertical',
    alt: 'Imagen procesional de la Virgen Peregrina engalanada en sus fiestas patronales',
    badge: 'Fiestas patronales · Agosto',
    description:
      'La Patrona de Moriscos sobre su carroza procesional bellamente engalanada con centros florales, portando al Niño Jesús, su báculo de peregrina y la concha venera. Imagen venerada por los vecinos durante las procesiones y la tradicional subasta de roscas de pan bendito.',
    tabLink: 'fiestas',
    tabLabel: 'Conocer las fiestas patronales',
  },
  {
    id: 'escudo-oficial',
    title: 'Escudo Heráldico Municipal Oficial',
    originalTitle: 'Escudo de Moriscos',
    author: 'Diseño heráldico: Salvador Llopis',
    date: 'B.O.C.y L. · 10 de marzo de 1993',
    category: 'heraldica',
    categoryLabel: 'Heráldica',
    location: 'Ayuntamiento de Moriscos',
    src: '/moriscos-wiki/images/escudo-moriscos-1024.jpg',
    originalSrc: '/moriscos-wiki/images/escudo-moriscos-1024.jpg',
    originalResolution: '1024 × 1024 (Vectorial oficial)',
    originalSize: '360 KB',
    width: 1024,
    height: 1024,
    aspect: 'square',
    alt: 'Escudo heráldico oficial del municipio de Moriscos aprobado en 1993',
    badge: 'Aprobación oficial · 10 mar 1993',
    description:
      'Diseño heráldico oficial: cuartel primero con la cruz de la Orden de San Juan de Jerusalén sobre el cerro de El Hoyo; cuartel segundo con espigas de cereal y rama de zumaque en oro; punta con la media luna árabe alusiva al origen morisco; y timbre de Corona Real Española cerrada.',
    tabLink: 'escudo',
    tabLabel: 'Ver desglose heráldico interactivo',
  },
];

export default function GaleriaPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (photo) => {
    if (!photo) return;
    const url = photo.originalSrc || photo.src;
    const isPng = url.toLowerCase().endsWith('.png');
    const filename = `${photo.id || 'moriscos'}.${isPng ? 'png' : 'jpg'}`;

    try {
      setDownloading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al descargar');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
    } catch {
      // Fallback seguro si no permite fetch de blob
      window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const filteredPhotos =
    selectedCategory === 'todas'
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.category === selectedCategory);

  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (activePhotoIndex === null) return;
      setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    },
    [activePhotoIndex, filteredPhotos.length],
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (activePhotoIndex === null) return;
      setActivePhotoIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    },
    [activePhotoIndex, filteredPhotos.length],
  );

  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, handlePrev, handleNext]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      {/* Cabecera Editorial */}
      <div className="w-full">
        <p className="kicker">Fototeca de Moriscos · Archivo de Pablo Crespo Bellido</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-pergamino sm:text-5xl">
          Galería de Moriscos
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pergamino-muted/80">
          Colección fotográfica documental de Moriscos y La Armuña: tomas aéreas y de dron capturadas por <strong>Pablo Crespo Bellido</strong> con indicación de fecha y ubicación, mostrando el patrimonio histórico, las faenas agrícolas y los paisajes del municipio.
        </p>
      </div>

      {/* Selector de Categorías / Filtros */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-piedra-border/40 pb-5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'todas'
              ? galleryPhotos.length
              : galleryPhotos.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setActivePhotoIndex(null);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-armuna text-noche font-bold shadow-md ring-1 ring-armuna-light/60'
                  : 'bg-noche-surface/80 text-pergamino-muted/80 hover:bg-noche-card hover:text-pergamino border border-piedra-400/20'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                  isSelected ? 'bg-noche/30 text-noche' : 'bg-noche/60 text-pergamino-muted/70'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Fotografías */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo, index) => {
          const isVertical = photo.aspect === 'vertical';

          return (
            <article
              key={photo.id}
              className="group card-editorial flex flex-col overflow-hidden p-0 transition-all duration-300 hover:border-armuna/40 hover:shadow-2xl"
            >
              {/* Imagen con gatillo de Lightbox */}
              <button
                type="button"
                onClick={() => setActivePhotoIndex(index)}
                className={`relative block w-full overflow-hidden cursor-zoom-in bg-noche ${
                  isVertical ? 'h-[360px] sm:h-[400px]' : 'h-[230px] sm:h-[260px]'
                }`}
                aria-label={`Ampliar fotografía: ${photo.title} (${photo.date})`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  width={photo.width}
                  height={photo.height}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/15 to-transparent opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />

                {/* Badge de categoría y fecha */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-noche/90 px-2.5 py-1 text-[11px] font-semibold text-armuna-light border border-armuna/30 backdrop-blur-md shadow-xs">
                    <Tag size={11} /> {photo.categoryLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-noche/90 px-2 py-1 text-[11px] font-medium text-pergamino border border-piedra-400/30 backdrop-blur-md shadow-xs">
                    <Calendar size={11} className="text-armuna-light" /> {photo.date}
                  </span>
                </div>

                {/* Botón de ampliar en hover */}
                <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-noche/90 px-3 py-1.5 text-xs font-semibold text-pergamino border border-piedra-400/30 backdrop-blur-md shadow-md opacity-90 group-hover:opacity-100 group-hover:bg-armuna group-hover:text-noche transition-all">
                  <ZoomIn size={14} /> Ampliar
                </div>
              </button>

              {/* Contenido textual */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-pergamino-muted/70">
                    <span className="inline-flex items-center gap-1 font-semibold text-armuna-light">
                      <Calendar size={13} />
                      {photo.date}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin size={13} className="text-armuna-light" />
                      {photo.location}
                    </span>
                  </div>

                  <h2 className="mt-2 font-serif text-lg font-bold text-pergamino group-hover:text-armuna-light transition-colors">
                    {photo.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-pergamino-muted/80 leading-relaxed line-clamp-3">
                    {photo.description}
                  </p>
                </div>

                {/* Pie de tarjeta con autoría real y enlace contextual */}
                <div className="mt-4 pt-3 border-t border-piedra-border/40 flex items-center justify-between gap-2">
                  {photo.tabLink ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(photo.tabLink)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-armuna-light hover:text-pergamino hover:underline cursor-pointer transition-colors"
                    >
                      {photo.tabLabel} <ExternalLink size={12} />
                    </button>
                  ) : <span />}
                  <span className="inline-flex items-center gap-1 text-[11px] text-pergamino-muted/70 font-sans shrink-0">
                    <Camera size={11} className="text-armuna-light" />
                    {photo.author}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal con carrusel previo/siguiente y teclado */}
      {currentPhoto &&
        createPortal(
          <div
            className="fixed inset-0 z-[500] overflow-y-auto bg-black/95 backdrop-blur-xl p-3 sm:p-5 md:p-8 flex flex-col items-center justify-start sm:justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={`${currentPhoto.title} (${currentPhoto.date})`}
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Botón flotante cerrar en esquina superior derecha */}
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Cerrar imagen ampliada (Escape)"
              className="fixed z-[520] inline-flex h-11 w-11 items-center justify-center rounded-full bg-noche/90 text-pergamino border border-armuna/40 shadow-2xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 14px)',
              }}
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Contenedor principal de la foto ampliada (centrado mediante margin auto) */}
            <div
              className="relative my-auto w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-piedra-400/35 bg-noche-card shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra superior del visor: categoría y contador */}
              <div className="w-full flex items-center justify-between border-b border-piedra-border/60 bg-noche-surface/95 px-4 py-3 sm:px-6">
                <span className="rounded-md bg-noche/80 px-2.5 py-1 text-xs font-semibold text-armuna-light border border-armuna/30">
                  {currentPhoto.categoryLabel}
                </span>
                <span className="text-xs font-mono font-medium text-pergamino-muted/70">
                  {activePhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              {/* Visor de imagen con fondo neutro y controles de navegación */}
              <div className="relative flex items-center justify-center w-full bg-black/75 p-2 sm:p-4 min-h-[260px]">
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  className="max-h-[48vh] sm:max-h-[52vh] md:max-h-[56vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />

                {/* Botón flecha izquierda */}
                {filteredPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Foto anterior (Flecha izquierda)"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-noche/85 text-pergamino border border-piedra-border shadow-xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {/* Botón flecha derecha */}
                {filteredPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Foto siguiente (Flecha derecha)"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-noche/85 text-pergamino border border-piedra-border shadow-xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* Ficha descriptiva inferior armónica y limpia */}
              <div className="w-full p-5 sm:p-6 bg-noche-surface border-t border-piedra-border/80">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-pergamino leading-tight">
                      {currentPhoto.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-pergamino-muted/80">
                      <span className="inline-flex items-center gap-1.5 text-pergamino">
                        <MapPin size={14} className="text-armuna-light shrink-0" />
                        {currentPhoto.location}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-armuna-light">
                        <Calendar size={14} className="shrink-0" /> {currentPhoto.date}
                      </span>
                      <span>•</span>
                      <span className="text-pergamino-muted">
                        Fotografía: <strong className="text-pergamino font-medium">{currentPhoto.author}</strong>
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-pergamino-muted/90 leading-relaxed pt-1">
                      {currentPhoto.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-stretch lg:self-center">
                    <button
                      type="button"
                      onClick={() => handleDownload(currentPhoto)}
                      disabled={downloading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-armuna px-4 py-2.5 text-xs sm:text-sm font-bold text-noche hover:bg-armuna-light disabled:opacity-60 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      title="Descargar fotografía"
                    >
                      {downloading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Descargando...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} strokeWidth={2.5} />
                          <span>Descargar fotografía</span>
                        </>
                      )}
                    </button>

                    {currentPhoto.tabLink && (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePhotoIndex(null);
                          onNavigate(currentPhoto.tabLink);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-noche-surface border border-piedra-400/30 px-4 py-2.5 text-xs sm:text-sm font-medium text-pergamino hover:border-armuna-light hover:text-armuna-light transition-colors shadow-md cursor-pointer"
                      >
                        <span>{currentPhoto.tabLabel}</span>
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
