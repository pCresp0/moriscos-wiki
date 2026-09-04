import React, { useEffect, useRef, useState } from 'react';
import { referencesData, referenceCategories } from '../data/references';
import { ExternalLink, Calendar, Building2, MapPin } from 'lucide-react';

export default function ReferenciasPage({ target }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const categories = Object.entries(referenceCategories);
  const targetRef = useRef(null);

  const filtered = selectedCat === 'all'
    ? referencesData
    : referencesData.filter((r) => r.categoria === selectedCat);

  useEffect(() => {
    if (!target) return;
    setSelectedCat('all');
  }, [target]);

  useEffect(() => {
    if (!target || !targetRef.current) return;
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [target, selectedCat]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Fuentes &amp; Bibliografía</p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        Referencias y fuentes documentales
      </h1>
      <p className="mt-4 text-balance text-base leading-relaxed text-pergamino-muted/80 sm:text-lg">
        Principales fuentes históricas, legajos de archivos eclesiásticos y estatales, monografías académicas, crónicas de prensa y portales digitales de los que se han extraído y contrastado los datos de esta web.
      </p>

      {/* Reconocimiento especial a la web Morisqueños */}
      <div className="mt-6 rounded-2xl border border-armuna/35 bg-noche-surface/80 p-4 sm:p-5 shadow-lg backdrop-blur-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-pergamino-muted/85 leading-relaxed">
          <p>
            <strong className="text-armuna-light font-serif text-base block mb-0.5">Agradecimiento y fuente documental destacada:</strong>
            Buena parte de los datos cronológicos, transcripciones notariales y referencias históricas de Moriscos han sido obtenidos y contrastados a partir de la labor de investigación del portal{' '}
            <strong className="text-pergamino">Morisqueños</strong> y su monografía de{' '}
            <a
              href="https://sites.google.com/view/morisquenos/resena-historica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-armuna-light font-semibold hover:underline inline-flex items-center gap-1"
            >
              Reseña Histórica <ExternalLink size={13} />
            </a>.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            selectedCat === 'all'
              ? 'bg-armuna-light text-noche font-bold shadow-md'
              : 'border border-noche-border bg-noche-surface/60 text-pergamino-muted/70 hover:text-pergamino'
          }`}
        >
          Todas ({referencesData.length})
        </button>
        {categories.map(([key, cat]) => {
          const count = referencesData.filter((r) => r.categoria === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCat(key)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCat === key
                  ? 'bg-armuna-light text-noche font-bold shadow-md'
                  : 'border border-noche-border bg-noche-surface/60 text-pergamino-muted/70 hover:text-pergamino'
              }`}
            >
              {cat.badge} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div className="mt-10 space-y-6">
        {filtered.map((ref) => (
          <article
            key={ref.id}
            id={ref.id}
            ref={ref.id === target ? targetRef : null}
            className={`card-editorial p-6 sm:p-8 ${ref.id === target ? 'search-target border-armuna-light/60' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-armuna/30 bg-armuna/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-armuna-light">
                  {referenceCategories[ref.categoria]?.badge ?? ref.categoria}
                </span>
                <span className="rounded-full border border-noche-border bg-noche px-3 py-1 text-xs font-medium text-pergamino-muted/70">
                  {ref.tipoFuente}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-display text-xs sm:text-sm font-semibold text-piedra-300">
                <Calendar size={15} className="text-armuna-light" />
                {ref.anioRegistro}
              </span>
            </div>

            <h2 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-snug text-pergamino">
              {ref.titulo}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-pergamino-muted/75">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Building2 size={16} className="text-armuna-light shrink-0" />
                {ref.autorInstitucion}
              </span>
              {ref.ubicacionArchivo && (
                <span className="inline-flex items-center gap-1.5 font-medium text-piedra-300">
                  <MapPin size={16} className="text-armuna-light shrink-0" />
                  {ref.ubicacionArchivo}
                </span>
              )}
            </div>

            {/* Aportaciones */}
            <div className="mt-5 border-t border-noche-border pt-4">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-armuna-light">
                Aportación y datos extraídos:
              </p>
              <ul className="mt-3 space-y-2">
                {ref.aportacionHistorica.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-pergamino-muted/85">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-armuna-light" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {ref.url && (
              <div className="mt-6 border-t border-noche-border pt-4">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-armuna-light hover:underline"
                >
                  <span>{ref.enlaceTexto ?? 'Consultar fuente o archivo'}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
