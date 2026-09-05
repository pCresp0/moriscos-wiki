import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Fuse from 'fuse.js';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchIndex } from '../data/searchIndex';
import { MIN_QUERY_LENGTH, SEARCH_OPTIONS } from '../utils/search';
import ErrorBoundary from './ErrorBoundary';
import { useT } from '../i18n';

interface SearchModalProps {

  onSelectResult?: (tab: string, target?: string | null) => void;
}

const FREQUENT_SEARCHES = [
  'Vértice Andorra',
  'Virgen de la Peregrina',
  'Lenteja de La Armuña',
  'Iglesia de San Pedro',
  'Árbol de Valdepega',
  'Las Cavenes',
  'El Escudo',
  'Ruta Nocturna',
  'Los Pilones',
  'Novartis',
  'Aceñas del Tormes',
  'Fray Luis de León',
  'El Hoyo',
  'moriscos.info',
];

export function SearchModalInner({ onSelectResult }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [btnRect, setBtnRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setBtnRect({
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
      setCoords({
        top: Math.round(rect.bottom + 8),
        right: Math.max(16, Math.round(window.innerWidth - rect.right)),
      });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        updateCoords();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const onResize = () => updateCoords();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  const fuse = useMemo(() => new Fuse(searchIndex, SEARCH_OPTIONS), []);

  const trimmedQuery = query.trim();
  const isTooShort = trimmedQuery.length > 0 && trimmedQuery.length < MIN_QUERY_LENGTH;

  const results = useMemo(() => {
    if (!trimmedQuery || trimmedQuery.length < MIN_QUERY_LENGTH) return [];
    return fuse.search(trimmedQuery).slice(0, 12).map((r) => r.item);
  }, [trimmedQuery, fuse]);

  const handleSelect = (tab: string, target?: string | null) => {
    setOpen(false);
    setQuery('');
    onSelectResult?.(tab, target ?? null);
  };

  const t = useT();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Botón original en cabecera: se oculta con opacity-0 cuando el buscador está abierto */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          updateCoords();
          setOpen(true);
        }}
        className={`flex h-11 w-11 sm:h-10 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-full border border-piedra-300/40 bg-black/40 text-pergamino hover:border-piedra-300 hover:bg-black/55 active:scale-95 transition-all cursor-pointer shadow-sm ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label={t('search.open') || "Buscar en el sitio"}
      >
        <Search className="h-5 w-5 sm:h-4.5 sm:w-4.5 shrink-0 text-armuna-light" />
        <span className="hidden sm:inline font-semibold text-sm">{t('common.search') || "Buscar"}</span>
      </button>

      <Dialog.Portal>
        {/* Capa 1 (z-index: 998): cortina de fondo translúcida con desenfoque de 6px idéntica a Japón */}
        <Dialog.Overlay
          className="backdrop-desenfoque"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            backgroundColor: 'rgba(20, 25, 35, 0.32)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        />

        {/* Capa 2 (z-index: 999): réplica del botón por encima de la cortina, 100% nítido */}
        {open && btnRect && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              top: `${btnRect.top}px`,
              left: `${btnRect.left}px`,
              width: `${btnRect.width}px`,
              height: `${btnRect.height}px`,
            }}
            className="fixed z-[999] flex items-center justify-center gap-2 rounded-full border border-armuna-light bg-armuna/35 text-pergamino ring-2 ring-armuna-light/40 shadow-md transition-all cursor-pointer active:scale-95"
            aria-label={t('search.close') || "Cerrar búsqueda"}
          >
            <Search className="h-5 w-5 sm:h-4.5 sm:w-4.5 shrink-0 text-armuna-light" />
            <span className="hidden sm:inline font-semibold text-sm">{t('common.search') || "Buscar"}</span>
          </button>
        )}

        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus({ preventScroll: true });
          }}
          style={
            coords && typeof window !== 'undefined' && window.innerWidth >= 1024
              ? { top: `${coords.top}px`, right: `${coords.right}px` }
              : undefined
          }
          className="fixed z-[999] overflow-hidden rounded-[26px] border border-noche-border/90 bg-noche-surface shadow-2xl outline-none top-[calc(env(safe-area-inset-top,0px)+64px)] left-2.5 right-2.5 sm:left-4 sm:right-4 w-auto max-h-[82vh] lg:w-[460px] lg:max-w-[460px] lg:top-[72px] lg:right-8 lg:left-auto lg:rounded-2xl p-0"
        >
          <Dialog.Title className="sr-only">{t('search.title') || "Buscar en Moriscos Wiki"}</Dialog.Title>
          <div className="flex items-center gap-2.5 border-b border-noche-border px-4 py-3.5 bg-noche">
            <Search className="h-5 w-5 shrink-0 text-armuna-light" />
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              name="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder') || "Buscar lugares, historia, fiestas, libro, glosario..."}
              style={{ fontSize: '16px' }}
              className="w-full bg-transparent font-body text-[16px] leading-normal text-pergamino outline-none placeholder:text-pergamino-muted/50"
            />
            <Dialog.Close
              aria-label={t('search.close') || "Cerrar buscador"}
              className="rounded-full p-1.5 text-pergamino-muted/70 hover:bg-white/10 hover:text-pergamino transition-colors cursor-pointer shrink-0"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5 space-y-2">
            {!trimmedQuery && (
              <div className="py-1">
                <p className="text-[11px] font-display font-bold uppercase tracking-wider text-armuna-light/85 mb-3">
                  {t('search.frequentSearches') || "Búsquedas frecuentes"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {FREQUENT_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-armuna/25 bg-armuna/10 px-3.5 py-1.5 text-xs font-semibold text-pergamino hover:border-armuna-light hover:bg-armuna/25 active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="mt-4 pt-3 border-t border-noche-border/60 text-xs text-pergamino-muted/65 leading-relaxed">
                  {t('search.minChars') || "Escribe al menos 2 letras. Lugares, historia, personajes, fiestas, curiosidades..."}
                </p>
              </div>
            )}

            {isTooShort && (
              <p className="py-6 text-center text-xs text-pergamino-muted/60">
                {t('search.typeAtLeast2') || "Escribe al menos 2 letras para ver resultados."}
              </p>
            )}

            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.tab, item.target)}
                className="w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl border border-noche-border/60 bg-noche-card hover:border-armuna-light/40 hover:bg-noche transition-all group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-armuna-light bg-armuna/10 px-2 py-0.5 rounded border border-armuna/20">
                      {item.badge}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-pergamino group-hover:text-armuna-light transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-pergamino-muted/70 line-clamp-1">
                    {item.excerpt}
                  </p>
                </div>
                <ChevronRight size={16} className="text-armuna-light shrink-0 opacity-60 group-hover:opacity-100" />
              </button>
            ))}

            {trimmedQuery && !isTooShort && results.length === 0 && (
              <p className="py-8 text-center text-sm text-pergamino-muted/60">
                {t('search.noResultsFor', { query: trimmedQuery })}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

}

export default function SearchModal(props: SearchModalProps) {
  return (
    <ErrorBoundary fallback={null}>
      <SearchModalInner {...props} />
    </ErrorBoundary>
  );
}
