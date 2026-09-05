import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { uiStrings } from "./ui";
import { getContent } from "../data/content";

export const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸", short: "ES" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
];

export const DEFAULT_LANG = "es";
const STORAGE_KEY = "moriscos-lang-v1";

const LanguageContext = createContext(null);

function detectInitialLang() {
  // 1) Preferencia guardada explícitamente en localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    /* localStorage puede no estar disponible */
  }

  // 2) Idioma del navegador
  try {
    const nav = (navigator.languages || [navigator.language || ""])
      .map((l) => l.slice(0, 2).toLowerCase());
    for (const code of nav) {
      if (LANGUAGES.some((l) => l.code === code)) return code;
    }
  } catch {
    /* entorno sin navigator */
  }

  // 3) Español por defecto
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  function setLang(code) {
    if (!LANGUAGES.some((l) => l.code === code)) return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignorar error de cuota o modo incógnito */
    }
  }

  // Sincronizar atributo lang en <html>
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const strings = { ...uiStrings.es, ...uiStrings[lang] };

    function t(key, vars) {

      let str = strings[key] ?? uiStrings.es[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, v);
        }
      }
      return str;
    }

    return {
      lang,
      setLang,
      t,
      content: getContent(lang),
      languages: LANGUAGES,
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de <LanguageProvider>");
  return ctx;
}

export function useT() {
  return useLang().t;
}

export function useContent() {
  return useLang().content;
}
