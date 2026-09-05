import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Clock, List } from 'lucide-react';
import Markdown from '../components/Markdown';
import ReadingProgress from '../components/ReadingProgress';
import { useContent, useT } from '../i18n';

/** Índice de los apartados del capítulo, con resaltado del apartado visible. */
function ChapterToc({ headings, className }) {
  const t = useT();
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? null);

  useEffect(() => {
    const sections = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el) => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSlug(entry.target.id);
        });
      },
      { root: document.getElementById('main-scroll-container'), rootMargin: '-15% 0px -70% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label={t('book.inThisChapter')} className={className}>
      <p className="kicker mb-3">{t('book.inThisChapter')}</p>
      <ul className="space-y-1.5 border-l border-noche-border text-sm">
        {headings.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveSlug(h.slug);
              }}
              className={`block border-l-2 py-0.5 pl-4 transition-colors ${
                activeSlug === h.slug
                  ? 'border-armuna-light text-armuna-light'
                  : 'border-transparent text-pergamino-muted/60 hover:text-pergamino'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function LibroPage({ onNavigate, target }) {
  const { chapters } = useContent();
  const t = useT();

  const activeChapter = chapters.find((c) => c.id === target) ?? null;
  const currentIndex = chapters.findIndex((c) => c.id === target);
  const [tocOpen, setTocOpen] = useState(false);

  // Al abrir o cambiar de capítulo se empieza a leer desde arriba.
  useEffect(() => {
    setTocOpen(false);
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'auto' });
  }, [target]);

  if (!activeChapter) {
    return (
      <div className="container-editorial py-10 sm:py-16">
        <p className="kicker">{t('book.kicker')}</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
          {t('book.title')}
        </h1>
        <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
          {t('book.description')}
        </p>

        <ol className="mt-12 space-y-4">
          {chapters.map((ch) => (
            <li key={ch.id}>
              <button
                type="button"
                onClick={() => onNavigate('libro', ch.id)}
                className="card-editorial group flex w-full cursor-pointer flex-col justify-between gap-4 p-6 text-left hover:border-armuna-light/50 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 rounded-lg border border-armuna/30 bg-armuna/10 px-3 py-1.5 font-mono text-sm font-bold text-armuna-light">
                    {t('book.chapterPrefix')} {ch.number}
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-pergamino transition-colors group-hover:text-armuna-light sm:text-xl">
                      {ch.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-pergamino-muted/70 sm:text-sm">{ch.dek}</p>
                    {ch.readingMinutes > 0 && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-piedra-300">
                        <Clock size={13} />
                        {t('book.minRead', { minutes: ch.readingMinutes })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 self-end text-sm font-semibold text-armuna-light sm:self-center">
                  <span>{t('book.readChapter')}</span>
                  <ChevronRight size={18} />
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div>
      <ReadingProgress resetKey={activeChapter.id} />

      <div className="container-editorial pb-10 pt-6 sm:pb-16 sm:pt-10">
        <div className="flex items-center justify-between gap-3 border-b border-noche-border pb-4">
          <button
            type="button"
            onClick={() => onNavigate('libro')}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-armuna-light hover:underline"
          >
            <ChevronLeft size={18} />
            <span>{t('book.toc')}</span>
          </button>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-piedra-300">
            {t('book.chapterPrefix')} {activeChapter.number} / {chapters.length}
          </span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <ChapterToc headings={activeChapter.headings} />
            </div>
          </aside>

          <div className="min-w-0">
            <p className="kicker">
              {t('book.chapterPrefix')} {activeChapter.number}
              {activeChapter.readingMinutes > 0 && ` · ${t('book.minRead', { minutes: activeChapter.readingMinutes })}`}
            </p>
            <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-4xl">
              {activeChapter.title}
            </h1>
            {activeChapter.dek && (
              <p className="mt-3 text-lg leading-relaxed text-pergamino-muted/75">{activeChapter.dek}</p>
            )}

            {/* En móvil el índice del capítulo se despliega bajo demanda */}
            {activeChapter.headings.length > 0 && (
              <div className="mt-6 lg:hidden">
                <button
                  type="button"
                  onClick={() => setTocOpen((v) => !v)}
                  aria-expanded={tocOpen}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-noche-border bg-noche-card/80 px-4 py-2.5 text-sm font-semibold text-pergamino-muted"
                >
                  <List size={16} className="text-armuna-light" />
                  <span>{tocOpen ? t('common.close') : t('book.inThisChapter')}</span>
                </button>
                {tocOpen && <ChapterToc headings={activeChapter.headings} className="mt-4" />}
              </div>
            )}

            <Markdown content={activeChapter.content} className="prose-chapter mt-8" />

            <nav className="mt-14 grid gap-4 border-t border-noche-border pt-8 sm:grid-cols-2">
              {prev ? (
                <button
                  type="button"
                  onClick={() => onNavigate('libro', prev.id)}
                  className="cursor-pointer rounded-2xl border border-noche-border p-5 text-left transition-colors hover:border-armuna-light/50"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-armuna-light">
                    &larr; {t('book.chapterPrefix')} {prev.number}
                  </span>
                  <p className="mt-1 font-serif font-semibold text-pergamino">{prev.title}</p>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button
                  type="button"
                  onClick={() => onNavigate('libro', next.id)}
                  className="cursor-pointer rounded-2xl border border-noche-border p-5 text-right transition-colors hover:border-armuna-light/50"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-armuna-light">
                    {t('book.chapterPrefix')} {next.number} &rarr;
                  </span>
                  <p className="mt-1 font-serif font-semibold text-pergamino">{next.title}</p>
                </button>
              ) : (
                <span />
              )}
            </nav>

            <button
              type="button"
              onClick={() => onNavigate('libro')}
              className="btn-secondary mt-10 cursor-pointer"
            >
              <BookOpen size={16} />
              <span>{t('book.backToTOC')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
