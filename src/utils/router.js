/*
 * Enrutado en memoria. La navegación entre secciones es un cambio de
 * estado en React puro (instantáneo, sin recargar nada), manteniendo
 * la barra de direcciones fija en la raíz limpia de la web.
 */

export const TABS = [
  'inicio',
  'historia',
  'lugares',
  'fiestas',
  'escudo',
  'iglesia',
  'libro',
  'ruta-nocturna',
  'genealogia',
  'glosario',
  'referencias',
  'sobre-la-web',
];

export const DEFAULT_TAB = 'inicio';

/** Comprueba si una pestaña dada es válida, o devuelve DEFAULT_TAB. */
export function validateTab(tab) {
  return TABS.includes(tab) ? tab : DEFAULT_TAB;
}

/** Lee una ruta de compatibilidad (#/libro/05-despoblado-ribas-flecha) y devuelve { tab, target }. */
export function parseHash(hash) {
  const clean = String(hash || '')
    .replace(/^#\/?/, '')
    .replace(/\/+$/, '');
  if (!clean) return { tab: DEFAULT_TAB, target: null };

  const [tab, ...rest] = clean.split('/');
  if (!TABS.includes(tab)) return { tab: DEFAULT_TAB, target: null };

  return { tab, target: rest.length ? decodeURIComponent(rest.join('/')) : null };
}

/** Construye una ruta con su ancla opcional. */
export function buildHash(tab, target) {
  if (!TABS.includes(tab)) return '#/';
  if (!target) return `#/${tab}`;
  return `#/${tab}/${encodeURIComponent(target)}`;
}
