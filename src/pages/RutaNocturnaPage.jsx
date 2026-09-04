import React, { Suspense, lazy, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, Download } from 'lucide-react';

// Leaflet solo hace falta en esta página: se carga aparte para que el resto de
// la web arranque con menos JavaScript.
const RouteMap = lazy(() => import('../components/RouteMap'));

export default function RutaNocturnaPage({ target }) {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!activeImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Guía de campo y senderismo</p>
      <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
        Ruta Nocturna: de Moriscos al soto de La Flecha
      </h1>
      <p className="mt-4 text-balance text-lg leading-relaxed text-pergamino-muted/80">
        Un itinerario senderista e histórico de 7,7 kilómetros que atraviesa el vértice geodésico &laquo;Andorra&raquo;,
        los escenarios de la batalla de 1812 y el antiguo despoblado de Ribas, hasta alcanzar el oratorio donde se
        retiró Fray Luis de León junto al río Tormes.
      </p>

      {/* Panorámica nocturna de inicio de ruta */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-piedra-border/40 bg-noche-card shadow-xl">
        <button
          type="button"
          onClick={() =>
            setActiveImage({
              src: '/moriscos-wiki/images/moriscos-panoramica-noche.jpg',
              alt: 'Panorámica aérea de Moriscos de noche, punto de inicio de la Ruta Nocturna',
              caption:
                'Panorámica aérea de Moriscos de noche (09 de agosto de 2026): el pueblo iluminado bajo el cielo estrellado de La Armuña, punto de encuentro y salida tradicional de la marcha nocturna hacia La Flecha. Fotografía: Pablo Crespo Bellido.',
              originalSrc: '/moriscos-wiki/images/originals/moriscos-panoramica-noche-original.jpg',
              originalSize: '5,2 MB',
            })
          }
          className="group relative block w-full h-[220px] sm:h-[320px] md:h-[380px] overflow-hidden cursor-zoom-in"
          aria-label="Ampliar panorámica nocturna de Moriscos"
        >
          <img
            src="/moriscos-wiki/images/moriscos-panoramica-noche.jpg"
            alt="Panorámica aérea de Moriscos de noche, punto de inicio de la Ruta Nocturna"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            width="1024"
            height="576"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-pergamino-muted bg-noche/85 p-3 rounded-xl border border-piedra-400/25 backdrop-blur-md">
            <div>
              <span className="font-serif font-medium block sm:inline">
                Moriscos iluminado de noche · Salida de la marcha nocturna
              </span>
              <span className="block sm:inline sm:ml-2 text-armuna-light text-xs font-mono">
                09 de agosto de 2026 · Foto: Pablo Crespo Bellido
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-armuna-light font-semibold shrink-0">
              <ZoomIn size={15} /> Ampliar
            </span>
          </div>
        </button>
      </div>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="flex h-[420px] items-center justify-center rounded-2xl border border-noche-border bg-noche-surface/60 text-sm text-pergamino-muted/70 sm:h-[520px]">
              Cargando el mapa de la ruta…
            </div>
          }
        >
          <RouteMap target={target} />
        </Suspense>
      </div>

      {/* Modal Lightbox */}
      {activeImage &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-armuna/40 bg-noche-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-3 right-3 z-10 rounded-full bg-noche/80 p-2 text-pergamino hover:bg-armuna hover:text-noche transition-colors"
                aria-label="Cerrar ampliación"
              >
                <X size={20} />
              </button>
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[75vh] w-auto mx-auto object-contain"
              />
              {activeImage.caption && (
                <div className="p-4 bg-noche-surface border-t border-piedra-border text-center text-sm text-pergamino-muted font-serif">
                  <p>{activeImage.caption}</p>
                  {activeImage.originalSrc && (
                    <div className="mt-3 flex justify-center">
                      <a
                        href={activeImage.originalSrc}
                        download="moriscos-panoramica-noche-master.jpg"
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
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

