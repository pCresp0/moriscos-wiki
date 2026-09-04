import { describe, expect, it } from 'vitest';
import Fuse from 'fuse.js';
import { searchIndex } from '../src/data/searchIndex';
import { MIN_QUERY_LENGTH, SEARCH_OPTIONS } from '../src/utils/search';
import { TABS } from '../src/utils/router';

const fuse = new Fuse(searchIndex, SEARCH_OPTIONS);
const search = (q: string) => fuse.search(q).map((r) => r.item);

describe('buscador global (Fuse.js sobre el índice real)', () => {
  it('el índice apunta siempre a secciones que existen', () => {
    expect(searchIndex.length).toBeGreaterThan(20);
    for (const item of searchIndex) {
      expect(TABS).toContain(item.tab);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it('encuentra un término del glosario y sabe a qué ficha saltar', () => {
    const [first] = search('maquila');
    expect(first.tab).toBe('glosario');
    expect(first.target).toBe('maquila');
  });

  it('tolera una errata leve', () => {
    expect(search('maqila').some((r) => r.target === 'maquila')).toBe(true);
  });

  it('encuentra un capítulo por su extracto y devuelve su slug', () => {
    const results = search('Fray Luis');
    expect(results.some((r) => r.tab === 'libro' && r.target === '05-despoblado-ribas-flecha')).toBe(true);
  });

  it('encuentra contenido que solo aparece en el cuerpo del capítulo', () => {
    expect(search('penillanura').some((r) => r.tab === 'libro')).toBe(true);
  });

  it('encuentra la sección de economía y sustento', () => {
    const results = search('secano');
    expect(results.some((r) => r.tab === 'economia')).toBe(true);
  });

  it('no devuelve resultados para un término sin relación', () => {
    expect(search('xilófono intergaláctico')).toHaveLength(0);
  });

  it('exige un mínimo de 2 letras antes de buscar', () => {
    const isTooShort = (q: string) => q.trim().length > 0 && q.trim().length < MIN_QUERY_LENGTH;
    expect(isTooShort('m')).toBe(true);
    expect(isTooShort('ma')).toBe(false);
    expect(isTooShort('')).toBe(false);
  });
});
