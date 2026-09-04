import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Fuse from 'fuse.js';
import { Search, X, Compass, ChevronRight } from 'lucide-react';
import { searchIndex } from '../data/searchIndex';
import { MIN_QUERY_LENGTH, SEARCH_OPTIONS } from '../utils/search';
import ErrorBoundary from './ErrorBoundary';

interface SearchModalProps {
  onSelectResult?: (tab: string, target?: string | null) => void;
}

export function SearchModalInner({ onSelectResult }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 sm:w-auto sm:px-3.5 items-center justify-center gap-2 rounded-full border border-piedra-300/40 bg-black/35 text-sm font-semibold text-pergamino shadow-sm backdrop-blur-sm transition-all hover:border-piedra-300 hover:bg-black/50 cursor-pointer"
        aria-label="Buscar en el sitio"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Buscar</span>
      </button>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-sm dialog-overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="fixed z-[260] overflow-hidden rounded-2xl border border-noche-border bg-noche-surface shadow-2xl outline-none top-[12vh] left-1/2 -translate-x-1/2 w-[94vw] max-w-lg p-0"
        >
          <Dialog.Title className="sr-only">Buscar en Moriscos Wiki</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-noche-border px-4 py-3 bg-noche">
            <Search className="h-5 w-5 shrink-0 text-armuna-light" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar lugares, historia, fiestas, libro, glosario..."
              className="w-full bg-transparent font-body text-base text-pergamino outline-none placeholder:text-pergamino-muted/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Borrar texto"
                className="rounded-full p-1 text-pergamino-muted/70 hover:bg-noche-card hover:text-pergamino cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Dialog.Close
              aria-label="Cerrar"
              className="rounded-full p-1 text-pergamino-muted/70 hover:bg-noche-card hover:text-pergamino cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {!trimmedQuery && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-pergamino-muted/60">
                <Compass className="h-10 w-10 mb-2 opacity-40 text-armuna-light" />
                <p className="text-sm">Escribe al menos 2 letras para buscar en toda la enciclopedia.</p>
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
