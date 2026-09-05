import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { useLang, useT } from "../i18n";

export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useLang();

  const t = useT();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);

  const current = languages.find((l) => l.code === lang) || languages[0];

  function updateCoords() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({
        top: r.bottom + 8,
        right: Math.max(12, window.innerWidth - r.right),
      });
    }
  }

  function toggle() {
    if (!open) {
      updateCoords();
    }
    setOpen((prev) => !prev);
  }

  // Cerrar con tecla Escape y reposicionar en resize / scroll
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScrollOrResize() {
      updateCoords();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={t("common.selectLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 px-2.5 sm:h-10 sm:px-3 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-piedra-300/40 bg-black/40 text-pergamino hover:border-piedra-300 hover:bg-black/55 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0 select-none"
      >
        <span className="text-[17px] sm:text-[18px] leading-none select-none" role="img" aria-hidden="true">
          {current.flag}
        </span>
        <span className="font-bold text-xs sm:text-sm text-pergamino tracking-wider uppercase">
          {current.short}
        </span>
      </button>

      {open && coords && createPortal(
        <>
          {/* Fondo invisible para cerrar al tocar fuera */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[1001]"
            aria-hidden="true"
          />

          {/* Menú desplegable estilo pergamino noble con borde dorado */}
          <div
            role="listbox"
            aria-label={t("common.selectLanguage")}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              right: `${coords.right}px`,
              zIndex: 1002,
            }}
            className="w-48 overflow-hidden rounded-2xl border border-[#b88432]/50 bg-[#1e1513]/95 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.65)] animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3.5 py-2 border-b border-white/10 text-[11px] font-medium text-pergamino-muted tracking-wider uppercase">
              {t("common.selectLanguage")}
            </div>

            <div className="p-1.5 flex flex-col gap-0.5">
              {languages.map((l) => {
                const active = l.code === lang;
                return (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      active
                        ? "bg-[#b88432]/25 text-pergamino font-semibold shadow-inner"
                        : "text-pergamino-muted hover:bg-white/10 hover:text-pergamino font-normal"
                    }`}
                  >
                    <span className="text-xl leading-none" role="img" aria-hidden="true">
                      {l.flag}
                    </span>
                    <span className="flex-1 text-sm tracking-wide">
                      {l.label}
                    </span>
                    {active && (
                      <Check className="w-4 h-4 text-armuna-light shrink-0" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
