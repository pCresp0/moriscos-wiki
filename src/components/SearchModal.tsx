import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Fuse from 'fuse.js';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchIndex } from '../data/searchIndex';
import { MIN_QUERY_LENGTH, SEARCH_OPTIONS } from '../utils/search';
import ErrorBoundary from './ErrorBoundary';

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
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
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
    const onResize = () => updateCoords();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          updateCoords();
          setOpen(true);
        }}
        className="flex h-10 w-10 sm:w-auto sm:px-3.5 items-center justify-center gap-2 rounded-full border border-piedra-300/40 bg-black/35 text-sm font-semibold text-pergamino shadow-sm backdrop-blur-sm transition-all hover:border-piedra-300 hover:bg-black/50 cursor-pointer"
        aria-label="Buscar en el sitio"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Buscar</span>
      </button>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm lg:bg-black/15 lg:backdrop-blur-[1px] dialog-overlay" />
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
          className="fixed z-[260] overflow-hidden rounded-[26px] border border-noche-border/90 bg-noche-surface shadow-2xl outline-none top-[calc(env(safe-area-inset-top,0px)+64px)] left-2.5 right-2.5 sm:left-4 sm:right-4 w-auto max-h-[82vh] lg:w-[460px] lg:max-w-[460px] lg:top-[72px] lg:right-8 lg:left-auto lg:rounded-2xl p-0"
        >
          <Dialog.Title className="sr-only">Buscar en Moriscos Wiki</Dialog.Title>
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
              placeholder="Buscar lugares, historia, fiestas, libro, glosario..."
              style={{ fontSize: '16px' }}
              className="w-full bg-transparent font-body text-[16px] leading-normal text-pergamino outline-none placeholder:text-pergamino-muted/50"
            />
            <Dialog.Close
              aria-label="Cerrar buscador"
              className="rounded-full p-1.5 text-pergamino-muted/70 hover:bg-white/10 hover:text-pergamino transition-colors cursor-pointer shrink-0"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5 space-y-2">
            {!trimmedQuery && (
              <div className="py-1">
                <p className="text-[11px] font-display font-bold uppercase tracking-wider text-armuna-light/85 mb-3">
                  Búsquedas frecuentes
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
                  Escribe al menos 2 letras. Lugares, historia, personajes, fiestas, curiosidades...
                </p>
              </div>
            )}

            {isTooShort && (
              <p className="py-6 text-center text-xs text-pergamino-muted/60">
                Escribe al menos 2 letras para ver resultados.
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
                No se encontraron resultados para «<strong>{trimmedQuery}</strong>».
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
