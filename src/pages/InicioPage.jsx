import React, { Suspense, lazy, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { counters } from '../data/site';
import { ZoomIn, X, Download } from 'lucide-react';

const TownLocationMap = lazy(() => import('../components/TownLocationMap'));
import {
  History,
  MapPin,
  PartyPopper,
  Shield,
  Church,
  BookOpen,
  Map,
  Camera,
  Users,
  BookMarked,
  Library,
  Info,
} from 'lucide-react';

const sections = [
  {
    id: 'historia',
    icon: History,
    title: 'Historia',
    description: 'Eje cronológico del pueblo, de la repoblación medieval del siglo XI a la actualidad.',
  },
  {
    id: 'lugares',
    icon: MapPin,
    title: 'Lugares',
    description: 'Localizaciones emblemáticas, parajes naturales y lugares desaparecidos del término municipal.',
  },
  {
    id: 'fiestas',
    icon: PartyPopper,
    title: 'Fiestas',
    description: 'La fiesta patronal de la Virgen de la Peregrina y el resto del calendario festivo del pueblo.',
  },
  {
    id: 'escudo',
    icon: Shield,
    title: 'El Escudo',
    description: 'El significado de cada elemento del escudo heráldico oficial de Moriscos.',
  },
  {
    id: 'iglesia',
    icon: Church,
    title: 'La Iglesia',
    description: 'Historia, arquitectura y tesoros artísticos de la Iglesia de San Pedro Apóstol.',
  },
  {
    id: 'libro',
    icon: BookOpen,
    title: 'El Libro',
    description: 'Once capítulos que recorren la geografía, la toponimia, la economía y los sucesos de Moriscos.',
  },
  {
    id: 'ruta-nocturna',
    icon: Map,
    title: 'Ruta Nocturna',
    description: 'Mapa interactivo con los ocho hitos del camino de 7,7 km hasta el soto de La Flecha.',
  },
  {
    id: 'galeria',
    icon: Camera,
    title: 'Galería',
    description: 'Fototeca de Moriscos: labores del campo, panorámicas aéreas, fiestas patronales y patrimonio.',
  },
  {
    id: 'genealogia',
    icon: Users,
    title: 'Genealogía',
    description: 'El Bosque Genealógico y los paisanos ilustres del pueblo, con registros desde 1645.',
  },
  {
    id: 'glosario',
    icon: BookMarked,
    title: 'Glosario',
    description: 'El vocabulario tradicional del campo salmantino, clasificado por categorías.',
  },
  {
    id: 'referencias',
    icon: Library,
    title: 'Referencias',
    description: 'Fuentes documentales, archivos históricos, hemeroteca y estudios de los que proceden los datos.',
  },
  {
    id: 'sobre-la-web',
    icon: Info,
    title: 'Sobre la web',
    description: 'Por qué existe este proyecto, de dónde sale la información y el escudo del pueblo.',
  },
];

const panoramas = [
  {
    id: 'atardecer',
    label: '🌅 Al atardecer · 18 jul 2026',
    src: '/moriscos-wiki/images/moriscos-panoramica-atardecer.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-atardecer-original.jpg',
    originalSize: '5,7 MB',
    alt: 'Panorámica aérea de Moriscos al atardecer sobre los campos de La Armuña tomada el 18 de julio de 2026',
    badge: 'Moriscos al atardecer · 18 de julio de 2026',
    caption:
      'Panorámica aérea de Moriscos al atardecer (18 de julio de 2026): el casco urbano tradicional, la torre campanario de la iglesia parroquial y los campos de cereal de La Armuña bajo el cielo crepuscular (Fotografía: Pablo Crespo Bellido).',
  },
  {
    id: 'noche',
    label: '🌙 De noche · 09 ago 2026',
    src: '/moriscos-wiki/images/moriscos-panoramica-noche.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-noche-original.jpg',
    originalSize: '5,2 MB',
    alt: 'Panorámica aérea de Moriscos de noche iluminado tomada el 09 de agosto de 2026',
    badge: 'Moriscos de noche · 09 de agosto de 2026',
    caption:
      'Panorámica aérea de Moriscos de noche (09 de agosto de 2026): el casco urbano y las nuevas urbanizaciones iluminadas durante las fiestas patronales, con la iglesia parroquial en el centro (Fotografía: Pablo Crespo Bellido).',
  },
  {
    id: 'primavera',
    label: '🌱 Primavera · 23 mar 2025',
    src: '/moriscos-wiki/images/moriscos-panoramica-primavera.jpg',
    originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-primavera-original.jpg',
    originalSize: '7,8 MB',
    alt: 'Panorámica aérea de Moriscos empezando la primavera tomada el 23 de marzo de 2025',
    badge: 'Moriscos empezando la primavera · 23 de marzo de 2025',
    caption:
      'Panorámica aérea «Moriscos empezando la primavera» (23 de marzo de 2025): el pueblo rodeado por el manto verde de las parcelas de cereal naciente y legumbres de La Armuña (Fotografía: Pablo Crespo Bellido).',
  },
];

export default function InicioPage({ onNavigate }) {
  const [activeImage, setActiveImage] = useState(null);
  const [selectedPanoIndex, setSelectedPanoIndex] = useState(0);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeImage]);

  const currentPano = panoramas[selectedPanoIndex];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container-editorial py-10 sm:py-16">
        <p className="kicker">El pueblo</p>
        <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
          Moriscos, un pueblo de La Armuña
        </h1>
        <p className="mt-4 text-balance text-lg font-medium text-piedra-200">
          Este es un archivo digital abierto para documentar y dar a conocer la historia, los orígenes, la evolución y las curiosidades de Moriscos, de forma que su memoria no dependa solo del recuerdo de sus vecinos.
        </p>
        <div className="mt-5 space-y-4 text-pergamino-muted/80 leading-relaxed">
          <p>
            Moriscos es un pequeño municipio de la comarca de La Armuña, a unos 9 km al este-noreste de Salamanca capital, con poco más
            de 500 habitantes. Su término se extiende sobre la penillanura cerealista que da nombre a la comarca, entre los
            cursos del Tormes y del Zurguén, lindando con el paraje de La Flecha, retiro contemplativo de Fray Luis de León.
          </p>
          <p>
            Documentado desde 1164 como aldea del alfoz salmantino en plena repoblación medieval, Moriscos fue absorbiendo
            con los siglos los despoblados vecinos de El Hoyo y Ribas, vivió de cerca la Guerra de la Independencia de 1812
            y atravesó episodios de posguerra como el suceso de 1941. Su economía, tradicionalmente agraria &mdash;trigo,
            lenteja de La Armuña y el singular cultivo del zumaque&mdash;, ha ido dando paso en las últimas décadas a su
            integración en el área metropolitana de Salamanca.
          </p>
        </div>

        {/* Galería Panorámica aérea interactiva (Atardecer / Noche) */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-noche-border/80 bg-noche-surface/90 px-4 py-2.5 sm:px-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-armuna-light">
              Panorámica aérea
            </span>
            <div className="flex items-center gap-1.5">
              {panoramas.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPanoIndex(idx)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    selectedPanoIndex === idx
                      ? 'bg-armuna text-noche font-bold shadow-xs'
                      : 'bg-noche/60 text-pergamino-muted/70 hover:text-pergamino border border-piedra-400/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: currentPano.src,
                alt: currentPano.alt,
                caption: currentPano.caption,
                originalSrc: currentPano.originalSrc,
                originalSize: currentPano.originalSize,
              })
            }
            className="group relative block w-full h-[260px] sm:h-[400px] md:h-[480px] overflow-hidden cursor-zoom-in"
            aria-label={`Ampliar ${currentPano.alt}`}
          >
            <img
              key={currentPano.src}
              src={currentPano.src}
              alt={currentPano.alt}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              width="1024"
              height="576"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-pergamino-muted bg-noche/85 p-3 rounded-xl border border-piedra-400/25 backdrop-blur-md">
              <span className="font-serif font-medium truncate">
                {currentPano.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 text-armuna-light font-semibold shrink-0">
                <ZoomIn size={15} /> Ampliar
              </span>
            </div>
          </button>
          <div className="flex items-center justify-between border-t border-noche-border/80 bg-noche-surface/90 px-4 py-2.5 sm:px-6 text-xs text-pergamino-muted">
            <span className="hidden sm:inline font-serif text-pergamino-muted/70">
              Colección fotográfica de Moriscos
            </span>
            <button
              type="button"
              onClick={() => onNavigate('galeria')}
              className="inline-flex items-center gap-1.5 font-semibold text-armuna-light hover:text-pergamino transition-colors cursor-pointer ml-auto sm:ml-0"
            >
              Explorar fototeca completa →
            </button>
          </div>
        </div>
      </section>

      {/* Tarjetas de Datos Clave (Counters) */}
      <section className="border-y border-noche-border bg-noche-surface/50 py-12">
        <div className="container-editorial">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {counters.map((c) => (
              <div key={c.label} className="card-editorial flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-armuna-light uppercase">{c.label}</p>
                  <p className="mt-2 font-display text-3xl font-black text-pergamino">
                    {c.value} {c.suffix && <span className="text-xl font-normal text-armuna-light">{c.suffix}</span>}
                  </p>
                </div>
                <p className="mt-3 text-xs text-pergamino-muted/65">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa de Localización: ¿Dónde nos encontramos? */}
      <section className="container-editorial py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="flex h-[360px] sm:h-[440px] items-center justify-center rounded-3xl border border-noche-border bg-noche-card/60 text-sm text-pergamino-muted/70">
              Cargando mapa de localización de Moriscos…
            </div>
          }
        >
          <TownLocationMap onNavigateLugares={onNavigate} />
        </Suspense>
      </section>

      {/* Cuadrícula de Secciones */}
      <section className="container-editorial pb-16 sm:pb-24">
        <p className="kicker">En esta web</p>
        <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold text-pergamino">Qué vas a encontrar</h2>
        <p className="mt-3 text-pergamino-muted/70">
          Cada apartado documenta una parte distinta del pueblo: su historia y sus orígenes, sus lugares, su gente, sus
          tradiciones y sus curiosidades.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ id, icon: Icon, title, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="group flex flex-col gap-3 rounded-2xl border border-noche-border bg-noche-card/80 p-6 text-left transition-all hover:-translate-y-1 hover:border-piedra-400/50 hover:bg-noche-surface hover:shadow-xl cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-armuna/15 text-armuna-light group-hover:scale-110 transition-transform">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="font-serif text-lg font-semibold text-pergamino group-hover:text-armuna-light transition-colors">{title}</span>
              <span className="text-sm text-pergamino-muted/70 leading-relaxed">{description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Modal Lightbox para la foto panorámica */}
      {activeImage &&
        createPortal(
          <div
            className="dialog-content fixed inset-0 z-[400] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md"
            data-state="open"
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt || 'Imagen ampliada'}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
              aria-label="Cerrar imagen ampliada"
              className="fixed z-[410] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-noche shadow-xl cursor-pointer active:scale-95 transition-transform hover:scale-105"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
              }}
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <div
              className="flex flex-col items-center max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[75vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
              />
              {activeImage.caption && (
                <p className="mt-3 text-center text-sm sm:text-base font-serif text-pergamino-muted max-w-2xl bg-noche/85 px-4 py-2.5 rounded-xl border border-piedra-400/25 shadow-lg backdrop-blur-sm">
                  {activeImage.caption}
                </p>
              )}
              {activeImage.originalSrc && (
                <div className="mt-3">
                  <a
                    href={activeImage.originalSrc}
                    download="moriscos-panoramica-master.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-armuna px-4 py-2 text-xs sm:text-sm font-bold text-noche hover:bg-armuna-light transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                  >
                    <Download size={15} strokeWidth={2.5} />
                    <span>Descargar original en máxima resolución ({activeImage.originalSize})</span>
                  </a>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
