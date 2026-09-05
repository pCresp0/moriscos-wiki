import React, { Suspense, lazy, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, Download, Loader2 } from 'lucide-react';
import {
  History,
  Wheat,
  MapPin,
  PartyPopper,
  Shield,
  Church,
  BookOpen,
  Map,
  Camera,
  BookMarked,
  Library,
  Info,
} from 'lucide-react';
import { useT } from '../i18n';

const TownLocationMap = lazy(() => import('../components/TownLocationMap'));

const SECTIONS_CONFIG = [
  { id: 'historia', icon: History },
  { id: 'economia', icon: Wheat },
  { id: 'lugares', icon: MapPin },
  { id: 'fiestas', icon: PartyPopper },
  { id: 'escudo', icon: Shield },
  { id: 'iglesia', icon: Church },
  { id: 'libro', icon: BookOpen },
  { id: 'ruta-nocturna', icon: Map },
  { id: 'galeria', icon: Camera },
  { id: 'glosario', icon: BookMarked },
  { id: 'referencias', icon: Library },
  { id: 'sobre-la-web', icon: Info },
];

const HERO_PANORAMA = {
  id: 'moriscos-panoramica-horizonte',
  src: '/moriscos-wiki/images/moriscos-panoramica-horizonte.jpg',
  originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-horizonte-original.jpg',
  alt: 'Gran panorámica aérea de Moriscos en el centro de la llanura de La Armuña',
};

export default function InicioPage({ onNavigate }) {
  const t = useT();
  const [activeImage, setActiveImage] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const counters = [
    { label: t('counters.firstMention'), value: '1164', detail: t('counters.firstMentionDetail') },
    { label: t('counters.andorra'), value: '871,4', suffix: 'm', detail: t('counters.andorraDetail') },
    { label: t('counters.distance'), value: '9', suffix: 'km', detail: t('counters.distanceDetail') },
    { label: t('counters.area'), value: '12,08', suffix: 'km²', detail: t('counters.areaDetail') },
  ];

  const handleDownload = async (img) => {
    if (!img) return;
    const url = img.originalSrc || img.src;
    const filename = `${img.id || 'moriscos-panoramica'}.jpg`;

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
      window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

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

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container-editorial py-10 sm:py-16">
        <p className="kicker">{t('home.heroKicker')}</p>
        <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-4 text-balance text-lg font-medium text-piedra-200">
          {t('home.heroSubtitle')}
        </p>
        <div className="mt-5 space-y-4 text-pergamino-muted/80 leading-relaxed">
          <p>{t('home.heroP1')}</p>
          <p>{t('home.heroP2')}</p>
        </div>

        {/* Panorámica aérea destacada de Moriscos */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-noche-border/80 bg-noche-surface/90 px-4 py-2.5 sm:px-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-armuna-light">
              {t('home.panoramaLabel')}
            </span>
            <span className="text-xs text-pergamino-muted/70 font-mono">
              23 de marzo de 2025
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveImage(HERO_PANORAMA)}
            className="group relative block w-full h-[280px] sm:h-[420px] md:h-[500px] overflow-hidden cursor-zoom-in"
            aria-label={t('common.zoomIn')}
          >
            <img
              src={HERO_PANORAMA.src}
              alt={HERO_PANORAMA.alt}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              width="1024"
              height="576"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-pergamino-muted bg-noche/85 p-3 rounded-xl border border-piedra-400/25 backdrop-blur-md">
              <span className="font-serif font-medium truncate">
                {t('home.panoramaBadge')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-armuna-light font-semibold shrink-0">
                <ZoomIn size={15} /> {t('common.zoomIn')}
              </span>
            </div>
          </button>
          <div className="flex items-center justify-between border-t border-noche-border/80 bg-noche-surface/90 px-4 py-2.5 sm:px-6 text-xs text-pergamino-muted">
            <span className="hidden sm:inline font-serif text-pergamino-muted/70">
              {t('home.panoramaCollection')}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('galeria')}
              className="inline-flex items-center gap-1.5 font-semibold text-armuna-light hover:text-pergamino transition-colors cursor-pointer ml-auto sm:ml-0"
            >
              {t('home.exploreGallery')}
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

      {/* Mapa de Localización */}
      <section className="container-editorial py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="flex h-[360px] sm:h-[440px] items-center justify-center rounded-3xl border border-noche-border bg-noche-card/60 text-sm text-pergamino-muted/70">
              {t('home.mapLoading')}
            </div>
          }
        >
          <TownLocationMap onNavigateLugares={onNavigate} />
        </Suspense>
      </section>

      {/* Cuadrícula de Secciones */}
      <section className="container-editorial pb-16 sm:pb-24">
        <p className="kicker">{t('home.sectionsTitle')}</p>
        <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-bold text-pergamino">{t('home.sectionsSubtitle')}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS_CONFIG.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="group flex flex-col gap-3 rounded-2xl border border-noche-border bg-noche-card/80 p-5 sm:p-6 text-left transition-all hover:-translate-y-1 hover:border-piedra-400/50 hover:bg-noche-surface hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-armuna/15 text-armuna-light group-hover:scale-105 transition-transform">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span className="font-serif text-lg font-semibold text-pergamino group-hover:text-armuna-light transition-colors">
                  {t(`nav.${id}`)}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-pergamino-muted/75 leading-relaxed">
                {t(`home.sectionDesc.${id}`)}
              </span>
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
            aria-label={t('common.zoomIn')}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
              aria-label={t('common.close')}
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
              <p className="mt-3 text-center text-sm sm:text-base font-serif text-pergamino-muted max-w-2xl bg-noche/85 px-4 py-2.5 rounded-xl border border-piedra-400/25 shadow-lg backdrop-blur-sm">
                {t('home.panoramaBadge')}
              </p>
              {activeImage.originalSrc && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => handleDownload(activeImage)}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-xl bg-armuna px-4 py-2 text-xs sm:text-sm font-bold text-noche hover:bg-armuna-light disabled:opacity-60 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {downloading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{t('common.downloading')}</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} strokeWidth={2.5} />
                        <span>{t('common.download')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
