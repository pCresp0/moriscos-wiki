import { test, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App.jsx';
import { LanguageProvider } from '../src/i18n';
import InicioPage from '../src/pages/InicioPage.jsx';
import HistoriaPage from '../src/pages/HistoriaPage.jsx';
import EconomiaPage from '../src/pages/EconomiaPage.jsx';
import LugaresPage from '../src/pages/LugaresPage.jsx';
import FiestasPage from '../src/pages/FiestasPage.jsx';
import EscudoPage from '../src/pages/EscudoPage.jsx';
import IglesiaPage from '../src/pages/IglesiaPage.jsx';
import LibroPage from '../src/pages/LibroPage.jsx';
import RutaNocturnaPage from '../src/pages/RutaNocturnaPage.jsx';
import GaleriaPage from '../src/pages/GaleriaPage.jsx';
import GlosarioPage from '../src/pages/GlosarioPage.jsx';
import ReferenciasPage from '../src/pages/ReferenciasPage.jsx';
import SobrePage from '../src/pages/SobrePage.jsx';

test('App root renders cleanly', () => {
  const html = renderToString(<App />);
  expect(html).toContain('MORISCOS');
});

const pages = [
  ['Inicio', InicioPage],
  ['Historia', HistoriaPage],
  ['Economia', EconomiaPage],
  ['Lugares', LugaresPage],
  ['Fiestas', FiestasPage],
  ['Escudo', EscudoPage],
  ['Iglesia', IglesiaPage],
  ['Libro', LibroPage],
  ['RutaNocturna', RutaNocturnaPage],
  ['Galeria', GaleriaPage],
  ['Glosario', GlosarioPage],
  ['Referencias', ReferenciasPage],
  ['Sobre', SobrePage],
];

for (const [name, Component] of pages) {
  test(`Page ${name} renders in LanguageProvider without crashing`, () => {
    const html = renderToString(
      <LanguageProvider>
        <Component onNavigate={() => {}} />
      </LanguageProvider>
    );
    expect(html).toBeTruthy();
  });
}
