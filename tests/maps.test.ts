import { describe, expect, it } from 'vitest';
import { routePoints } from '../src/data/route';

describe('módulos y datos de mapas interactivos', () => {
  it('valida que los puntos de la ruta nocturna tienen coordenadas geográficas válidas', () => {
    expect(routePoints.length).toBeGreaterThan(0);
    for (const point of routePoints) {
      expect(point.lat).toBeGreaterThan(40);
      expect(point.lat).toBeLessThan(42);
      expect(point.lng).toBeLessThan(-5);
      expect(point.lng).toBeGreaterThan(-6);
      expect(point.name).toBeTruthy();
      expect(point.order).toBeGreaterThan(0);
    }
  });

  it('valida que los hitos de la ruta están ordenados de forma ascendente', () => {
    for (let i = 0; i < routePoints.length; i++) {
      expect(routePoints[i].order).toBe(i + 1);
    }
  });

  it('carga los componentes de mapas sin errores de variables o sintaxis', async () => {
    const globalAny = globalThis as any;
    if (!globalAny.window) {
      globalAny.window = globalThis;
    }
    if (!globalAny.document) {
      globalAny.document = {
        documentElement: { style: {} },
        createElement: () => ({ style: {} }),
      };
    }
    if (!globalAny.screen) {
      globalAny.screen = { deviceXDPI: 0, deviceYDPI: 0 };
    }

    const { default: TownLocationMap } = await import('../src/components/TownLocationMap');
    const { default: RouteMap } = await import('../src/components/RouteMap');

    expect(typeof TownLocationMap).toBe('function');
    expect(typeof RouteMap).toBe('function');
  });
});
