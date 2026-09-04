import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';

const categories = [
  { id: 'todas', label: 'Todas las fotos' },
  { id: 'campo', label: '🌾 Campo y Labores' },
  { id: 'paisaje', label: '🌤️ Panorámicas Aéreas' },
  { id: 'patrimonio', label: '⛪ Monumentos y Fe' },
  { id: 'fiestas', label: '🎉 Fiestas y Tradición' },
  { id: 'heraldica', label: '🛡️ Heráldica' },
];

export const galleryPhotos = [
  {
    id: 'cosecha-alpacas-2025',
    title: 'La mies y el empacado de cereal al atardecer',
    date: '15 de julio de 2025',
    category: 'campo',
    categoryLabel: 'Campo y Labores',
    location: 'Caminos de labor · Moriscos (La Armuña)',
    src: '/moriscos-wiki/images/moriscos-cosecha-alpacas.jpg',
    width: 576,
    height: 1024,
    aspect: 'vertical',
    alt: 'Tractor transportando remolque de alpacas de paja de cereal al atardecer junto a un campo de girasoles con Moriscos al fondo',
    badge: 'La mies en La Armuña · 15 jul 2025',
    description:
      'Instantánea aérea tomada en plena campaña de recolección de verano: un tractor remolca un gran fardo de alpacas de paja por los caminos rurales de Moriscos. A la izquierda, el dorado de los girasoles en flor contrasta con el rastrojo segado, mientras que al fondo el sol poniente baña de luz anaranjada el caserío del pueblo.',
    tabLink: 'lugares',
    tabLabel: 'Explorar parajes del término',
  },
  {
    id: 'panoramica-atardecer-2026',
    title: 'Morfología urbana y penillanura al atardecer',
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
    id: 'iglesia-san-pedro',
    title: 'Iglesia Parroquial de San Pedro Apóstol',
    date: 'Patrimonio histórico · Siglos XII-XVI',
    category: 'patrimonio',
    categoryLabel: 'Monumentos y Fe',
    location: 'Plaza de la Iglesia · Moriscos',
    src: '/moriscos-wiki/images/iglesia-san-pedro-exterior.jpg',
    width: 1024,
    height: 757,
    aspect: 'horizontal',
    alt: 'Espadaña-torre y fachada exterior de la Iglesia de San Pedro Apóstol',
    badge: 'Catedrales de La Armuña',
    description:
      'Una de las llamadas «Catedrales de La Armuña». Destaca su fábrica exterior de sillería y mampostería, con su espadaña-torre rematada en frontón triangular, campanas y nido de cigüeñas, albergando en su interior la carpintería mudéjar de lo blanco y el retablo rococó.',
    tabLink: 'iglesia',
    tabLabel: 'Descubrir el templo y sus tesoros',
  },
  {
    id: 'virgen-peregrina',
    title: 'Nuestra Señora la Virgen de la Peregrina en procesión',
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
    date: 'B.O.C.y L. · 10 de marzo de 1993',
    category: 'heraldica',
    categoryLabel: 'Heráldica e Identidad',
    location: 'Ayuntamiento de Moriscos',
    src: '/moriscos-wiki/images/escudo-moriscos-1024.jpg',
    width: 1024,
    height: 1024,
    aspect: 'square',
    alt: 'Escudo heráldico oficial del municipio de Moriscos',
    badge: 'Blasón Municipal',
    description:
      'Diseño heráldico de Salvador Llopis: cuartel primero con la cruz de la Orden de San Juan de Jerusalén sobre el cerro de El Hoyo; cuartel segundo con espigas de cereal y rama de zumaque en oro; punta con la media luna árabe alusiva al origen morisco; y timbre de Corona Real Española cerrada.',
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
        <p className="kicker">Fototeca comunitaria y memoria visual</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
          Galería de Moriscos
        </h1>
        <p className="mt-4 text-balance text-lg leading-relaxed text-pergamino-muted/80">
          Una mirada fotográfica a la identidad viva de Moriscos: el horizonte agrario de La Armuña durante la cosecha, las panorámicas aéreas al atardecer y de noche, su emblemática iglesia parroquial y la devoción festera a la Virgen Peregrina.
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

                {/* Badge de categoría / fecha */}
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

                {/* Enlace contextual a la sección de la wiki */}
                {photo.tabLink && (
                  <div className="mt-4 pt-3 border-t border-piedra-border/40 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onNavigate(photo.tabLink)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-armuna-light hover:text-pergamino hover:underline cursor-pointer transition-colors"
                    >
                      {photo.tabLabel} <ExternalLink size={12} />
                    </button>
                    <span className="text-[10px] text-pergamino-muted/50 uppercase tracking-wider font-mono">
                      Wiki
                    </span>
                  </div>
                )}
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
                    <p className="text-xs sm:text-sm text-pergamino-muted/80 flex items-center gap-1.5">
                      <MapPin size={14} className="text-armuna-light shrink-0" />
                      {currentPhoto.location}
                    </p>
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
