import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X } from 'lucide-react';

export default function EscudoPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Heráldica municipal</p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        El escudo de Moriscos
      </h1>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
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
        <div className="card-editorial p-6 sm:p-8">
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

        <div className="card-editorial p-6 sm:p-8">
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

        <div className="card-editorial p-6 sm:p-8">
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

        <div className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            4. El timbre
          </h2>
          <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
            La <strong>Corona Real cerrada</strong>, remate habitual de la heráldica municipal española contemporánea,
            que representa la adscripción del municipio al marco constitucional del Reino de España.
          </p>
        </div>

        <p className="text-balance text-center font-serif text-base italic leading-relaxed text-piedra-200 sm:text-lg">
          En una sola imagen, el escudo plasma la identidad cristiana repobladora (la cruz), el pasado andalusí (la
          luna), la geografía física (El Hoyo) y el trabajo de los labradores en los campos de trigo y zumacales.
        </p>
      </div>

      {/* Lightbox: portal al body para que la cruz quede fija arriba a la derecha
          en el viewport (también en móvil, por encima de la cabecera). */}
      {lightboxOpen &&
        createPortal(
          <div
            className="dialog-content fixed inset-0 z-[400] flex items-center justify-center bg-black/88 px-4 backdrop-blur-md"
            data-state="open"
            role="dialog"
            aria-modal="true"
            aria-label="Escudo de Moriscos ampliado"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              aria-label="Cerrar escudo"
              className="fixed z-[410] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-noche shadow-xl cursor-pointer active:scale-95"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
              }}
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <img
              src="/moriscos-wiki/images/escudo-moriscos-1024.jpg"
              alt="Escudo heráldico oficial del Ayuntamiento de Moriscos, en detalle"
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
              width="1024"
              height="1024"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
