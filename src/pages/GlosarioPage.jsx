import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import Markdown from '../components/Markdown';
import { useContent, useT } from '../i18n';

export default function GlosarioPage({ target }) {
  const { glosario } = useContent();
  const t = useT();

  const allLabel = t('glossary.allCategories') || 'Todos';
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(allLabel);
  const targetRef = useRef(null);

  // Sincronizar activeCategory si cambia el idioma y estaba en "Todos"
  useEffect(() => {
    setActiveCategory(allLabel);
  }, [allLabel]);

  const categories = useMemo(
    () => [allLabel, ...Array.from(new Set(glosario.map((g) => g.category))).sort((a, b) => a.localeCompare(b))],
    [glosario, allLabel],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return glosario.filter((g) => {
      const matchCategory = activeCategory === allLabel || g.category === activeCategory;
      const matchQuery =
        !needle ||
        g.term.toLowerCase().includes(needle) ||
        g.short.toLowerCase().includes(needle) ||
        g.content.toLowerCase().includes(needle);
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory, glosario, allLabel]);

  // Al llegar desde el buscador, se limpian los filtros y se salta al término.
  useEffect(() => {
    if (!target) return;
    setQuery('');
    setActiveCategory(allLabel);
  }, [target, allLabel]);

  useEffect(() => {
    if (!target || !targetRef.current) return;
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [target, filtered]);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">{t('glossary.kicker')}</p>
      <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
        {t('glossary.title')}
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        {t('glossary.description')}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pergamino-muted/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('glossary.searchPlaceholder')}
            aria-label={t('glossary.searchAria')}
            className="w-full rounded-xl border border-noche-border bg-noche-card/90 py-2.5 pl-10 pr-10 text-[16px] leading-normal text-pergamino placeholder:text-pergamino-muted/50 focus:border-armuna-light focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('glossary.clear')}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-pergamino-muted/60 hover:text-pergamino"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar glosario por categoría">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-armuna-light font-bold text-noche shadow-md'
                  : 'border border-noche-border bg-noche-card text-pergamino-muted hover:bg-noche-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-pergamino-muted/60">
        {t('glossary.showingCount', { count: filtered.length, total: glosario.length })}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const isTarget = item.id === target;
          return (
            <article
              key={item.id}
              id={item.id}
              ref={isTarget ? targetRef : null}
              className={`card-editorial flex flex-col justify-between ${isTarget ? 'search-target border-armuna-light/60' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-serif text-lg font-bold text-armuna-light">{item.term}</h2>
                  <span className="shrink-0 rounded border border-armuna/20 bg-armuna/10 px-2 py-0.5 font-mono text-[11px] uppercase text-armuna-light">
                    {item.category}
                  </span>
                </div>
                {item.short && (
                  <p className="mt-2 text-xs font-medium italic text-pergamino/90 sm:text-sm">{item.short}</p>
                )}
                <Markdown
                  content={item.content}
                  className="prose-chapter prose-sm mt-3 text-xs sm:text-sm"
                />
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-pergamino-muted/60">
            {t('glossary.noResults')}
          </p>
        )}
      </div>
    </div>
  );
}
