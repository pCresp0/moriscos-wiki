import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X } from 'lucide-react';
import { useT } from '../i18n';

export default function EscudoPage() {
  const t = useT();
  const [activeImage, setActiveImage] = useState(null);

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
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">{t('escudo.kicker')}</p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        {t('escudo.title')}
      </h1>


      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() =>
            setActiveImage({
              src: '/moriscos-wiki/images/escudo-moriscos-1024.jpg',
              alt: 'Escudo heráldico oficial del Ayuntamiento de Moriscos',
              caption: 'Escudo oficial del Ayuntamiento de Moriscos: conjunto heráldico completo timbrado con Corona Real.',
            })
          }
          aria-label="Ver el escudo en grande"
          className="group relative mx-auto h-52 w-52 shrink-0 cursor-zoom-in overflow-hidden rounded-2xl shadow-xl ring-2 ring-piedra-400/40 sm:mx-0 bg-noche-card"
        >
          <img
            src="/moriscos-wiki/images/escudo-moriscos-480.jpg"
            alt="Escudo heráldico oficial del Ayuntamiento de Moriscos"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width="208"
            height="208"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-pergamino opacity-0 transition-all group-hover:opacity-100">
            <ZoomIn size={32} />
          </span>
        </button>
        <p className="leading-relaxed text-pergamino-muted/80 text-base sm:text-lg">
          Es el <strong>escudo heráldico oficial del Ayuntamiento de Moriscos</strong>: un partido y entado en punta,
          timbrado con la Corona Real, cuyo diseño sintetiza mil años de historia del pueblo, desde su fundación hasta su
          economía tradicional en La Armuña.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {/* 1. Primer cuartel */}
        <div id="cuartel-1" className="card-editorial p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start scroll-mt-24">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/escudo-cuartel-1-cruz-hoyo.png',
                alt: 'Primer cuartel: la cruz recruzada de plata y el relieve de El Hoyo',
                caption: 'Primer cuartel (izquierda): Cruz recruzada de plata sobre campo de gules (rojo) y relieve de oro de las cárcavas y el despoblado de El Hoyo.',
              })
            }
            className="group relative mx-auto sm:mx-0 shrink-0 w-36 sm:w-44 h-48 sm:h-52 rounded-xl bg-noche-surface/80 border border-piedra-400/25 p-2.5 flex items-center justify-center shadow-lg transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10 cursor-zoom-in"
            aria-label="Ampliar detalle del primer cuartel"
          >
            <img
              src="/moriscos-wiki/images/escudo-cuartel-1-cruz-hoyo.png"
              alt="Primer cuartel del escudo de Moriscos: cruz recruzada y relieve de El Hoyo"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="176"
              height="208"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={24} />
            </span>
            <span className="absolute bottom-1.5 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted/80 bg-noche/85 px-1.5 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ampliar
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              1. Primer cuartel (izquierda): la repoblación y El Hoyo
            </h2>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
              Campo de gules (rojo) con dos elementos: la <strong>cruz recruzada de plata</strong>, que simboliza la
              repoblación medieval de los siglos XI-XII llevada a cabo por las tropas de Alfonso VI, el conde Raimundo de
              Borgoña y el obispo Jerónimo de Perigord; y, debajo, un <strong>relieve de oro</strong> que representa el
              terreno quebrado del despoblado de El Hoyo y las cárcavas (las Cavenes) que descienden hacia el Tormes,
              homenaje a las antiguas alquerías medievales absorbidas por Moriscos.
            </p>
          </div>
        </div>

        {/* 2. Segundo cuartel */}
        <div id="cuartel-2" className="card-editorial p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start scroll-mt-24">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/escudo-cuartel-2-trigo-zumaque.png',
                alt: 'Segundo cuartel: espiga de trigo y rama de zumaque',
                caption: 'Segundo cuartel (derecha): Campo de oro con espiga de trigo y rama de zumaque (Rhus Coriaria) cruzadas en aspa, símbolos agrícolas e industriales.',
              })
            }
            className="group relative mx-auto sm:mx-0 shrink-0 w-36 sm:w-44 h-48 sm:h-52 rounded-xl bg-noche-surface/80 border border-piedra-400/25 p-2.5 flex items-center justify-center shadow-lg transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10 cursor-zoom-in"
            aria-label="Ampliar detalle del segundo cuartel"
          >
            <img
              src="/moriscos-wiki/images/escudo-cuartel-2-trigo-zumaque.png"
              alt="Segundo cuartel del escudo de Moriscos: trigo y zumaque"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="176"
              height="208"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={24} />
            </span>
            <span className="absolute bottom-1.5 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted/80 bg-noche/85 px-1.5 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ampliar
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              2. Segundo cuartel (derecha): la tierra y la industria
            </h2>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
              Campo de oro, en homenaje a los campos de cereal de La Armuña, con dos plantas cruzadas en aspa: la{' '}
              <strong>espiga de trigo</strong>, que representa la agricultura de secano (trigo candeal, lenteja de La
              Armuña y garbanzo) motor de la economía local; y la <strong>rama de zumaque</strong> (<em>Rhus Coriaria</em>),
              con hojas verdes y bayas rojas, el elemento más singular del escudo: sus hojas, ricas en taninos, fueron
              indispensables para la industria del curtido de cueros salmantina.
            </p>
          </div>
        </div>

        {/* 3. Entado en punta */}
        <div id="entado-punta" className="card-editorial p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start scroll-mt-24">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/escudo-punta-luna.png',
                alt: 'Entado en punta: luna creciente de plata sobre azur',
                caption: 'Entado en punta (abajo): Luna creciente de plata sobre campo de azur, símbolo parlante del pasado andalusí y origen del nombre "Moriscos".',
              })
            }
            className="group relative mx-auto sm:mx-0 shrink-0 w-36 sm:w-44 h-48 sm:h-52 rounded-xl bg-noche-surface/80 border border-piedra-400/25 p-2.5 flex items-center justify-center shadow-lg transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10 cursor-zoom-in"
            aria-label="Ampliar detalle del entado en punta"
          >
            <img
              src="/moriscos-wiki/images/escudo-punta-luna.png"
              alt="Entado en punta del escudo de Moriscos: luna creciente"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="176"
              height="208"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={24} />
            </span>
            <span className="absolute bottom-1.5 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted/80 bg-noche/85 px-1.5 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ampliar
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              3. Entado en punta (abajo): el origen del nombre
            </h2>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
              Un triángulo de campo de azur con una <strong>luna creciente de plata</strong>, símbolo parlante que hace
              referencia directa al nombre del pueblo: tributo al pasado andalusí del enclave, previo a los decretos de
              expulsión de 1609, cuando pequeños asentamientos mudéjares o mozárabes legaron al lugar el topónimo de
              "Moriscos".
            </p>
          </div>
        </div>

        {/* 4. El timbre */}
        <div id="timbre-corona" className="card-editorial p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start scroll-mt-24">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/escudo-timbre-corona.png',
                alt: 'El timbre: Corona Real española cerrada',
                caption: 'El timbre: Corona Real cerrada, símbolo de pertenencia al marco constitucional del Reino de España.',
              })
            }
            className="group relative mx-auto sm:mx-0 shrink-0 w-36 sm:w-44 h-48 sm:h-52 rounded-xl bg-noche-surface/80 border border-piedra-400/25 p-2.5 flex items-center justify-center shadow-lg transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10 cursor-zoom-in"
            aria-label="Ampliar detalle del timbre"
          >
            <img
              src="/moriscos-wiki/images/escudo-timbre-corona.png"
              alt="Timbre del escudo de Moriscos: Corona Real"
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              width="176"
              height="208"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={24} />
            </span>
            <span className="absolute bottom-1.5 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted/80 bg-noche/85 px-1.5 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ampliar
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              4. El timbre: la Corona Real
            </h2>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
              La <strong>Corona Real cerrada</strong>, remate habitual de la heráldica municipal española contemporánea,
              que representa la adscripción del municipio al marco constitucional del Reino de España.
            </p>
          </div>
        </div>

        <p className="text-balance text-center font-serif text-base italic leading-relaxed text-piedra-200 sm:text-lg">
          En una sola imagen, el escudo plasma la identidad cristiana repobladora (la cruz), el pasado andalusí (la
          luna), la geografía física (El Hoyo) y el trabajo de los labradores en los campos de trigo y zumacales.
        </p>
      </div>

      {/* Lightbox interactivo para el escudo y cualquiera de sus partes */}
      {activeImage &&
        createPortal(
          <div
            className="dialog-content fixed inset-0 z-[400] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md"
            data-state="open"
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt || 'Detalle del escudo ampliado'}
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
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
