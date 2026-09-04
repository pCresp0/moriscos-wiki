import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Trees, ZoomIn, X } from 'lucide-react';
import { personajes } from '../data/personajesData';
import Markdown from '../components/Markdown';

export default function GenealogiaPage({ target }) {
  const targetRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeImage]);

  useEffect(() => {
    if (!target || !targetRef.current) return;
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [target]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Bosque genealógico</p>
      <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
        Paisanos ilustres y memoria familiar
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        Son &laquo;morisqueños&raquo; quienes cuentan con un lazo de unión con el pueblo de Moriscos. Esta condición se
        acredita incorporándose al Bosque Genealógico, con registros que se remontan a 1645.
      </p>

      <div className="card-editorial mt-10 p-6 sm:p-8">
        <div className="flex items-center gap-3 text-armuna-light">
          <Trees size={28} />
          <h2 className="font-serif text-2xl font-bold text-pergamino">El Bosque Genealógico</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-pergamino-muted/80 sm:text-base">
          El archivo parroquial de San Pedro Apóstol custodia un registro demográfico excepcional que permite
          reconstruir los árboles genealógicos de las familias morisqueñas desde el siglo XVII. Los apellidos
          tradicionales (Blanco, Romo, Pedraz, Crespo, Salvador, Domínguez, García...) entrelazan la historia del
          municipio con las localidades vecinas de Castellanos de Moriscos, Cabrerizos y Aldealengua.
        </p>
      </div>

      {/* Tarjeta fotográfica del Cementerio Municipal */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
        <div className="grid md:grid-cols-12 gap-0 items-center">
          <div className="md:col-span-4 bg-noche relative">
            <button
              type="button"
              onClick={() =>
                setActiveImage({
                  src: '/moriscos-wiki/images/moriscos-cementerio-cenital.jpg',
                  alt: 'Vista aérea cenital del Cementerio Municipal de Moriscos tomada el 23 de marzo de 2025',
                  caption:
                    'Plano cenital a 90° del Cementerio Municipal de Moriscos (23 de marzo de 2025): tapias encaladas, panteones con teja árabe y reposo de las familias morisqueñas entre las tierras de labor (Fotografía: Pablo Crespo Bellido).',
                })
              }
              className="group relative block w-full h-[260px] md:h-[300px] overflow-hidden cursor-zoom-in"
              aria-label="Ampliar vista cenital del cementerio"
            >
              <img
                src="/moriscos-wiki/images/moriscos-cementerio-cenital.jpg"
                alt="Plano cenital del Cementerio Municipal de Moriscos tomado el 23 de marzo de 2025"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                width="576"
                height="1024"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-pergamino-muted bg-noche/85 p-2 rounded-xl border border-piedra-400/25 backdrop-blur-md">
                <span className="font-serif font-medium truncate">Plano cenital · 23 mar 2025 · Foto: Pablo Crespo</span>
                <span className="inline-flex items-center gap-1 text-armuna-light font-semibold shrink-0">
                  <ZoomIn size={13} /> Ampliar
                </span>
              </div>
            </button>
          </div>

          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="kicker">Memoria y reposo</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-pergamino">
                El Cementerio Municipal y el descanso de nuestros mayores
              </h2>
              <p className="mt-3 text-sm sm:text-base text-pergamino-muted/80 leading-relaxed">
                Situado a las afueras del casco urbano en el camino rural hacia la vega, el camposanto municipal de Moriscos guarda el recuerdo y las raíces de las estirpes familiares que han trabajado esta tierra generación tras generación. Su trazado sobrio, rodeado de campos cerealistas en silencio, es el fiel reflejo de la historia viva de nuestra comunidad.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-piedra-border/40 flex items-center justify-between text-xs text-pergamino-muted/70">
              <span>23 mar 2025 · Camino del Cementerio</span>
              <span className="font-medium text-armuna-light">Fotografía: Pablo Crespo Bellido</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <p className="kicker">Biografías destacadas</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-armuna-light sm:text-3xl">
          Personajes e hijos ilustres
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personajes.map((p) => {
            const isTarget = p.id === target;
            return (
              <article
                key={p.id}
                id={p.id}
                ref={isTarget ? targetRef : null}
                className={`card-editorial flex flex-col ${isTarget ? 'search-target border-armuna-light/60' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded border border-noche-border bg-piedra-900/80 px-2.5 py-1 font-mono text-xs text-piedra-300">
                    {p.years || 'Historia viva'}
                  </span>
                  {p.tag ? (
                    <span className="rounded border border-armuna/20 bg-armuna/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-armuna-light">
                      {p.tag}
                    </span>
                  ) : (
                    <Award size={16} className="text-armuna-light" />
                  )}
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold text-pergamino">{p.name}</h3>
                {p.role && <p className="mt-0.5 text-xs font-semibold text-armuna-light">{p.role}</p>}
                <Markdown content={p.content} className="prose-chapter prose-sm mt-3 text-xs sm:text-sm" />
              </article>
            );
          })}
        </div>
      </div>

      <div className="card-editorial mt-16 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-armuna-light">¿Eres morisqueño?</h2>
        <p className="mt-3 leading-relaxed text-pergamino-muted/80">
          Comprueba si ya figuras en el Bosque Genealógico o solicita tu incorporación escribiendo a{' '}
          <a
            href="mailto:moriscos.info@gmail.com"
            className="font-semibold text-armuna-light hover:underline"
          >
            moriscos.info@gmail.com
          </a>
          . Podrás decidir qué datos hacer públicos y aparecer etiquetado en el archivo fotográfico &laquo;Ventanas del
          Ayer y Hoy&raquo;, con más de 250 morisqueños identificados desde 1930.
        </p>
      </div>

      {/* Modal Lightbox para la foto del cementerio */}
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
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
