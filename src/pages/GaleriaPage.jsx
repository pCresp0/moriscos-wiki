import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag, ExternalLink, Camera } from 'lucide-react';

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
    title: 'Iglesia de San Pedro Apóstol y plaza del pueblo',
    author: 'Pablo Crespo Bellido',
    date: 'Patrimonio monumental · Siglos XII–XVI',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Plaza de la Iglesia · Casco urbano de Moriscos',
    src: '/moriscos-wiki/images/iglesia-san-pedro-aerea.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Perspectiva aérea cenital de la Iglesia de San Pedro Apóstol de Moriscos, su atrio y el entorno urbano',
    badge: 'Catedrales de La Armuña',
    description:
      'Vista aérea cenital del templo parroquial de San Pedro Apóstol: la nave única orientada, la sólida espadaña-torre de sillería de Villamayor, los tejados de teja árabe, el atrio exterior cerrado por petril de piedra y su posición articuladora de la plaza y calles de Moriscos.',
    tabLink: 'iglesia',
    tabLabel: 'Descubrir el templo y su historia',
  },
  {
    id: 'iglesia-torre-ciguenas',
    title: 'Espadaña-torre, veleta de forja y nido de cigüeñas',
    author: 'Pablo Crespo Bellido',
    date: 'Patrimonio y Fauna · San Pedro Apóstol',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Campanario de San Pedro · Moriscos',
    src: '/moriscos-wiki/images/iglesia-torre-ciguenas.jpg',
    width: 575,
    height: 1024,
    aspect: 'vertical',
    alt: 'Detalle aéreo de la torre campanario de San Pedro con veleta de hierro forjado y nido de cigüeñas',
    badge: 'Torre campanario y fauna',
    description:
      'Detalle aéreo cercano de la torre de sillería dorada: el remate a cuatro aguas de teja árabe, la veleta de forja tradicional con cruz y sol radiante, y una pareja de cigüeñas blancas descansando en su nido en el alero, con la llanura cerealista de La Armuña al fondo.',
    tabLink: 'iglesia',
    tabLabel: 'Ver arquitectura del templo',
  },
  {
    id: 'moriscos-panoramica-horizonte',
    title: 'Moriscos, sombras de nubes y horizontes hacia Salamanca',
    author: 'Pablo Crespo Bellido',
    date: 'Primavera · Paisaje y campiña',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea cenital · Término de Moriscos',
    src: '/moriscos-wiki/images/moriscos-panoramica-horizonte.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Gran panorámica aérea de Moriscos en la campiña verde de La Armuña con cielo de nubes y Salamanca al fondo',
    badge: 'Horizontes de La Armuña',
    description:
      'Gran panorámica aérea capturada sobre la penillanura armuñesa: el caserío de Moriscos en el centro de la escena, rodeado por campos de cultivo donde las nubes proyectan sombras dinámicas sobre el verdor de la tierra, con la silueta de Salamanca y las sierras en el horizonte lejano.',
    tabLink: 'lugares',
    tabLabel: 'Explorar parajes del término',
  },
  {
    id: 'panoramica-primavera',
    title: 'Moriscos y el mosaico primaveral de La Armuña',
    author: 'Pablo Crespo Bellido',
    date: 'Primavera · Paisaje agrario',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Término municipal de Moriscos',
    src: '/moriscos-wiki/images/moriscos-panoramica-primavera.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Panorámica aérea de Moriscos en primavera rodeado de parcelas verdes de cultivo',
    badge: 'Verdor primaveral',
    description:
      'Perspectiva cenital de Moriscos en primavera: el caserío agrupado con sus tonos terrosos y tejados rojizos contrastando vivamente con el verde intenso de los sembrados de cereal y legumbres de La Armuña en pleno crecimiento.',
    tabLink: 'lugares',
    tabLabel: 'Explorar el término municipal',
  },
  {
    id: 'cosecha-alpacas-2025',
    title: 'La mies y el empacado de cereal al atardecer',
    author: 'Pablo Crespo Bellido',
    date: '15 de julio de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Caminos de concentración · La Armuña',
    src: '/moriscos-wiki/images/moriscos-cosecha-alpacas.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Tractor transportando remolque de alpacas de paja de cereal al atardecer junto a un campo de girasoles con Moriscos al fondo',
    badge: 'La mies en La Armuña · 15 jul 2025',
    description:
      'Instantánea aérea tomada en plena campaña de recolección de verano: un tractor remolca un gran fardo de alpacas de paja por los caminos rurales de Moriscos. A la izquierda, el dorado de los girasoles en flor contrasta con el rastrojo segado, mientras que al fondo el sol poniente baña de luz anaranjada el caserío del pueblo.',
    tabLink: 'lugares',
    tabLabel: 'Ver paisaje agrícola en Lugares',
  },
  {
    id: 'moriscos-abrevadero-fuente',
    title: 'Abrevadero comunal y pilas ganaderas entre campos',
    author: 'Pablo Crespo Bellido',
    date: 'Infraestructura tradicional agraria',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Caminos de labor pecuaria · Moriscos',
    src: '/moriscos-wiki/images/moriscos-abrevadero-fuente.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Vista aérea del abrevadero con largas pilas de hormigón y caseta de fuente junto a campos de cultivo',
    badge: 'Patrimonio pecuario y rural',
    description:
      'Toma aérea cenital del abrevadero ganadero situado junto al camino rural de concentración: largas pilas corridas de abrevada para rebaños de ovejas y reses, acompañadas de la caseta de bombeo/manantial y parcelas sembradas de cereal que delimitan la cañada agropecuaria.',
    tabLink: 'lugares',
    tabLabel: 'Ver lugares y parajes',
  },
  {
    id: 'moriscos-cementerio-cenital',
    title: 'Cementerio Municipal de Moriscos: descanso y memoria',
    author: 'Pablo Crespo Bellido',
    date: 'Memoria y Genealogía local',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Camino del cementerio · Afueras de Moriscos',
    src: '/moriscos-wiki/images/moriscos-cementerio-cenital.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Plano cenital perpendicular del Cementerio Municipal de Moriscos con sus tapias blancas y tumbas',
    badge: 'Camposanto municipal',
    description:
      'Impresionante plano cenital directo a 90 grados del camposanto de Moriscos: el recinto rectangular con tapias encaladas de blanco, los panteones de entrada con cubiertas de teja árabe, las hileras de sepulturas familiares y el sosiego del camino de tierra que conduce a los campos.',
    tabLink: 'genealogia',
    tabLabel: 'Ver memoria en Genealogía',
  },
  {
    id: 'moriscos-cementerio-soledad',
    title: 'El camposanto en la inmensidad de La Armuña',
    author: 'Pablo Crespo Bellido',
    date: 'Memoria y Paisaje',
    category: 'patrimonio',
    categoryLabel: 'Iglesia y Memoria',
    location: 'Llanura de Moriscos · La Armuña',
    src: '/moriscos-wiki/images/moriscos-cementerio-soledad.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Vista cenital amplia del cementerio aislado en mitad de parcelas de labor',
    badge: 'Sosiego en la campiña',
    description:
      'Perspectiva cenital en altura que retrata el camposanto de Moriscos como un oasis de serenidad emplazado en medio de las grandes franjas agrícolas de La Armuña, flanqueado por el camino rural de tierra y la amplitud del horizonte castellano.',
    tabLink: 'genealogia',
    tabLabel: 'Consultar Bosque Genealógico',
  },
  {
    id: 'armuna-rodal-arboles',
    title: 'Isla de vegetación y rodal de encinas en La Armuña',
    author: 'Pablo Crespo Bellido',
    date: 'Paisaje y Biodiversidad',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Fincas de secano · Término de Moriscos',
    src: '/moriscos-wiki/images/armuna-rodal-arboles.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Vista aérea cenital de un rodal de encinas en medio del manto verde de cultivo',
    badge: 'Refugio ecológico',
    description:
      'Perspectiva aérea cenital que muestra un rodal o soto arbolado de encinas aislado en el corazón de las fincas de cultivo de La Armuña. Estos rodales actúan como refugio ecológico vital para la perdiz roja, liebres y aves esteparias en medio de la gran penillanura cerealista.',
    tabLink: 'lugares',
    tabLabel: 'Ver parajes del término',
  },
  {
    id: 'armuna-campos-verdes',
    title: 'Ondulaciones y horizontes abiertos de La Armuña',
    author: 'Pablo Crespo Bellido',
    date: 'Geografía y Campo',
    category: 'campo',
    categoryLabel: 'Campo y Faenas',
    location: 'Llanura de secano · Término de Moriscos',
    src: '/moriscos-wiki/images/armuna-campos-verdes.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Vista aérea vertical de los campos de cultivo ondulados de La Armuña bajo sombras de nubes',
    badge: 'Penillanura cerealista',
    description:
      'La infinita llanura de La Armuña vista desde las alturas: parcelas onduladas con diferentes tonalidades de verde y franjas de labor, surcadas por las sombras de las nubes estivales y con la silueta de los tesos y cerros en el lejano horizonte.',
    tabLink: 'lugares',
    tabLabel: 'Ver cotas y parajes',
  },
  {
    id: 'panoramica-atardecer-2026',
    title: 'Morfología urbana y penillanura al atardecer',
    author: 'Pablo Crespo Bellido',
    date: '18 de julio de 2026',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea de Moriscos · La Armuña',
    src: '/moriscos-wiki/images/moriscos-panoramica-atardecer.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Panorámica aérea de Moriscos al atardecer sobre los campos de La Armuña',
    badge: 'Panorámica crepuscular · 18 jul 2026',
    description:
      'Amplia perspectiva cenital y panorámica del casco urbano de Moriscos al caer la tarde de verano. Se aprecia la silueta de la torre campanario de la iglesia de San Pedro Apóstol emergiendo sobre los tejados tradicionales de teja árabe, rodeada por el mosaico de parcelas de cereal de secano características de la comarca.',
    tabLink: 'lugares',
    tabLabel: 'Ver lugares emblemáticos',
  },
  {
    id: 'panoramica-noche-2026',
    title: 'Moriscos iluminado bajo la noche de La Armuña',
    author: 'Pablo Crespo Bellido',
    date: '09 de agosto de 2026',
    category: 'paisaje',
    categoryLabel: 'Panorámicas Aéreas',
    location: 'Vista aérea nocturna sobre el casco urbano',
    src: '/moriscos-wiki/images/moriscos-panoramica-noche.jpg',
    width: 1024,
    height: 576,
    aspect: 'horizontal',
    alt: 'Panorámica aérea de Moriscos de noche iluminado bajo el cielo de La Armuña',
    badge: 'Pueblo iluminado · 09 ago 2026',
    description:
      'Fotografía aérea nocturna tomada durante las fechas de las Fiestas Patronales de agosto. Destacan las luminarias del casco histórico, las nuevas urbanizaciones residenciales y la glorieta de acceso, contrastando con la inmensidad en calma del campo de secano bajo el cielo nocturno.',
    tabLink: 'ruta-nocturna',
    tabLabel: 'Ver la Ruta Nocturna',
  },
  {
    id: 'virgen-peregrina',
    title: 'Nuestra Señora la Virgen de la Peregrina en procesión',
    author: 'Pablo Crespo Bellido',
    date: 'Fiestas Patronales · Agosto',
    category: 'fiestas',
    categoryLabel: 'Fiestas y Tradición',
    location: 'Parroquia y calles del pueblo',
    src: '/moriscos-wiki/images/virgen-peregrina.jpg',
    width: 676,
    height: 1024,
    aspect: 'vertical',
    alt: 'Imagen de la Virgen Peregrina en su carroza procesional engalanada',
    badge: 'Patrona de Moriscos',
    description:
      'La Patrona de Moriscos sobre su carroza procesional bellamente engalanada con centros florales, portando al Niño Jesús, su báculo de peregrina y la concha venera. Imagen venerada por los vecinos durante las procesiones y la tradicional subasta de roscas de pan bendito.',
    tabLink: 'fiestas',
    tabLabel: 'Conocer las fiestas patronales',
  },
  {
    id: 'escudo-oficial',
    title: 'Escudo Heráldico Municipal Oficial',
    author: 'Diseño heráldico: Salvador Llopis',
    date: 'B.O.C.y L. · 10 de marzo de 1993',
    category: 'heraldica',
    categoryLabel: 'Heráldica',
    location: 'Ayuntamiento de Moriscos',
    src: '/moriscos-wiki/images/escudo-moriscos-1024.jpg',
    width: 1024,
    height: 1024,
    aspect: 'square',
    alt: 'Escudo heráldico oficial del municipio de Moriscos',
    badge: 'Blasón Municipal',
    description:
      'Diseño heráldico oficial: cuartel primero con la cruz de la Orden de San Juan de Jerusalén sobre el cerro de El Hoyo; cuartel segundo con espigas de cereal y rama de zumaque en oro; punta con la media luna árabe alusiva al origen morisco; y timbre de Corona Real Española cerrada.',
    tabLink: 'escudo',
    tabLabel: 'Ver desglose heráldico interactivo',
  },
];

export default function GaleriaPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

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
      <div className="max-w-3xl">
        <p className="kicker">Fototeca de Moriscos · Archivo de Pablo Crespo Bellido</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
          Galería de Moriscos
        </h1>
        <p className="mt-4 text-balance text-lg leading-relaxed text-pergamino-muted/80">
          Una cuidada colección fotográfica documental de Moriscos y la comarca de La Armuña: tomas aéreas cenitales y de dron capturadas por <strong>Pablo Crespo Bellido</strong> a lo largo de los años, reflejando el patrimonio del pueblo, la inmensidad cerealista, las faenas del campo y las señas de identidad de su gente.
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
                aria-label={`Ampliar fotografía: ${photo.title}`}
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

                {/* Badge de categoría */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center gap-1 rounded-md bg-noche/85 px-2.5 py-1 text-[11px] font-semibold text-armuna-light border border-armuna/30 backdrop-blur-md shadow-xs">
                    <Tag size={11} /> {photo.categoryLabel}
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
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} className="text-armuna-light" />
                      {photo.date}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin size={13} className="text-armuna-light" />
                      {photo.location}
                    </span>
                  </div>

                  <h2 className="mt-2.5 font-serif text-lg font-bold text-pergamino group-hover:text-armuna-light transition-colors">
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
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/92 p-3 sm:p-6 backdrop-blur-lg"
            role="dialog"
            aria-modal="true"
            aria-label={currentPhoto.title}
            onClick={() => setActivePhotoIndex(null)}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Cerrar imagen ampliada (Escape)"
              className="fixed z-[510] inline-flex h-11 w-11 items-center justify-center rounded-full bg-noche/90 text-pergamino border border-piedra-border shadow-2xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
              }}
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Contenedor principal de la foto ampliada */}
            <div
              className="relative flex flex-col items-center max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-2xl border border-armuna/40 bg-noche-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra superior del visor con contador */}
              <div className="w-full flex items-center justify-between border-b border-piedra-border/60 bg-noche-surface/90 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-armuna-light">
                  <span className="rounded-md bg-noche/80 px-2.5 py-1 border border-armuna/30">
                    {currentPhoto.categoryLabel}
                  </span>
                  <span className="text-pergamino-muted/60">•</span>
                  <span className="text-pergamino-muted">{currentPhoto.date}</span>
                  <span className="text-pergamino-muted/60">•</span>
                  <span className="text-pergamino font-sans font-normal">📸 {currentPhoto.author}</span>
                </div>
                <span className="text-xs font-mono font-medium text-pergamino-muted/70">
                  {activePhotoIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              {/* Visor de imagen con controles flecha */}
              <div className="relative flex items-center justify-center w-full bg-black/60 p-2 sm:p-4 min-h-[300px]">
                <img
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />

                {/* Botón flecha izquierda */}
                {filteredPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Foto anterior (Flecha izquierda)"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-noche/85 text-pergamino border border-piedra-border shadow-xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-noche/85 text-pergamino border border-piedra-border shadow-xl hover:bg-armuna hover:text-noche hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* Ficha descriptiva inferior */}
              <div className="w-full p-5 sm:p-6 bg-noche-surface border-t border-piedra-border">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-pergamino">
                      {currentPhoto.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-pergamino-muted/80">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-armuna-light shrink-0" />
                        {currentPhoto.location}
                      </span>
                      <span>•</span>
                      <span className="text-armuna-light font-medium">
                        Fotografía: {currentPhoto.author}
                      </span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-pergamino-muted leading-relaxed pt-1">
                      {currentPhoto.description}
                    </p>
                  </div>

                  {currentPhoto.tabLink && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhotoIndex(null);
                        onNavigate(currentPhoto.tabLink);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-armuna px-4 py-2.5 text-xs sm:text-sm font-bold text-noche hover:bg-armuna-light transition-colors shadow-md cursor-pointer shrink-0 self-start sm:self-center"
                    >
                      <span>{currentPhoto.tabLabel}</span>
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
