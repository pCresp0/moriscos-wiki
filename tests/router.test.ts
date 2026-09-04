import { describe, expect, it } from 'vitest';
import { buildHash, DEFAULT_TAB, parseHash, TABS, validateTab } from '../src/utils/router';

describe('enrutado y validación de pestañas', () => {
  it('valida pestañas correctas', () => {
    expect(validateTab('inicio')).toBe('inicio');
    expect(validateTab('glosario')).toBe('glosario');
    expect(validateTab('seccion-inexistente')).toBe(DEFAULT_TAB);
  });

  it('abre el inicio cuando no hay hash', () => {
    expect(parseHash('')).toEqual({ tab: 'inicio', target: null });
    expect(parseHash('#')).toEqual({ tab: 'inicio', target: null });
    expect(parseHash('#/')).toEqual({ tab: 'inicio', target: null });
  });

  it('lee la sección de una ruta simple', () => {
    expect(parseHash('#/lugares')).toEqual({ tab: 'lugares', target: null });
    expect(parseHash('#/sobre-la-web')).toEqual({ tab: 'sobre-la-web', target: null });
  });

  it('lee la sección y el elemento concreto de una ruta profunda', () => {
    expect(parseHash('#/libro/05-despoblado-ribas-flecha')).toEqual({
      tab: 'libro',
      target: '05-despoblado-ribas-flecha',
    });
    expect(parseHash('#/glosario/maquila')).toEqual({ tab: 'glosario', target: 'maquila' });
  });

  it('ignora las barras finales', () => {
    expect(parseHash('#/libro/')).toEqual({ tab: 'libro', target: null });
    expect(parseHash('#/glosario/maquila/')).toEqual({ tab: 'glosario', target: 'maquila' });
  });

  it('cae en el inicio si la sección no existe', () => {
    expect(parseHash('#/seccion-inventada')).toEqual({ tab: 'inicio', target: null });
  });

  it('construye rutas válidas', () => {
    expect(buildHash('inicio')).toBe('#/inicio');
    expect(buildHash('libro', '01-marco-geografico')).toBe('#/libro/01-marco-geografico');
    expect(buildHash('seccion-inventada')).toBe('#/');
  });

  it('ida y vuelta: lo que se construye se vuelve a leer igual', () => {
    for (const tab of TABS) {
      expect(parseHash(buildHash(tab))).toEqual({ tab, target: null });
      expect(parseHash(buildHash(tab, 'un-elemento'))).toEqual({ tab, target: 'un-elemento' });
    }
  });
});
