import { chapters } from "./chaptersData";
import { glosario } from "./glosarioData";
import { personajes } from "./personajesData";
import { referencesData } from "./references";

import en from "./locales/en";
import fr from "./locales/fr";

const overlays = { en, fr };

// Conjunto base en español
const base = {
  chapters,
  glosario,
  personajes,
  referencesData,
};

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Merge profundo de `patch` sobre `source`.
 * Para arrays de objetos con `id` o `number`, busca el objeto coincidente en el patch.
 */
function deepMerge(source, patch) {
  if (patch === undefined) return source;

  if (Array.isArray(source)) {
    if (!Array.isArray(patch)) return source;
    return source.map((item, i) => {
      if (item && typeof item === "object") {
        const patchItem = patch.find((p) => {
          if (item.id && p.id) return item.id === p.id;
          if (item.number !== undefined && p.number !== undefined) return item.number === p.number;
          return false;
        }) || patch[i];
        return deepMerge(item, patchItem);
      }
      return patch[i] !== undefined ? patch[i] : item;
    });
  }

  if (isPlainObject(source)) {
    if (!isPlainObject(patch)) return source;
    const out = { ...source };
    for (const key of Object.keys(patch)) {
      out[key] = deepMerge(source[key], patch[key]);
    }
    return out;
  }

  return patch !== undefined ? patch : source;
}

const cache = new Map();

export function getContent(locale) {
  if (locale === "es" || !overlays[locale]) return base;

  if (cache.has(locale)) return cache.get(locale);

  const merged = deepMerge(base, overlays[locale]);
  cache.set(locale, merged);
  return merged;
}

export { base as contentEs };
