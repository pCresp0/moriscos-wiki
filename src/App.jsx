import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Nav, { Sidebar, DesktopTopBar } from './components/Nav';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ErrorBoundary from './components/ErrorBoundary';
import { buildHash, parseHash } from './utils/router';

// Todas las páginas se importan de forma estática: el contenido completo viaja
// en el bundle y cambiar de sección es solo un cambio de estado, sin esperas.
import InicioPage from './pages/InicioPage';
import HistoriaPage from './pages/HistoriaPage';
import LugaresPage from './pages/LugaresPage';
import FiestasPage from './pages/FiestasPage';
import EscudoPage from './pages/EscudoPage';
import IglesiaPage from './pages/IglesiaPage';
import LibroPage from './pages/LibroPage';
import RutaNocturnaPage from './pages/RutaNocturnaPage';
import GenealogiaPage from './pages/GenealogiaPage';
import GlosarioPage from './pages/GlosarioPage';
import ReferenciasPage from './pages/ReferenciasPage';
import SobrePage from './pages/SobrePage';

const PAGES = {
  inicio: InicioPage,
  historia: HistoriaPage,
  lugares: LugaresPage,
  fiestas: FiestasPage,
  escudo: EscudoPage,
  iglesia: IglesiaPage,
  libro: LibroPage,
  'ruta-nocturna': RutaNocturnaPage,
  genealogia: GenealogiaPage,
  glosario: GlosarioPage,
  referencias: ReferenciasPage,
  'sobre-la-web': SobrePage,
};

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // La URL manda: escuchar el hash cubre a la vez la navegación interna, el
  // botón "atrás" del móvil y los enlaces compartidos.
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((tab, target = null) => {
    const nextHash = buildHash(tab, target);
    if (window.location.hash === nextHash) {
      setRoute(parseHash(nextHash));
      return;
    }
    window.location.hash = nextHash;
  }, []);

  // Al cambiar de sección se vuelve arriba. Si la ruta apunta a un elemento
  // concreto (un capítulo, un término), es la propia página la que decide
  // dónde colocar el scroll.
  useEffect(() => {
    if (route.target) return;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.tab, route.target]);

  // Gesto lateral para abrir y cerrar el menú en el móvil.
  const swipeHandlers = useSwipeable({
    onSwipedRight: (e) => {
      // Zona muerta de 30 px en el borde para no pisar el gesto "atrás" de iOS.
      if (e.initial[0] > 30) setMenuOpen(true);
    },
    onSwipedLeft: () => setMenuOpen(false),
    delta: 40,
    preventScrollOnSwipe: false,
    trackMouse: false,
  });

  const Page = PAGES[route.tab] ?? InicioPage;

  return (
    <div
      {...swipeHandlers}
      id="app-shell"
      className="flex h-[100dvh] flex-col overflow-hidden"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[400] focus:rounded focus:bg-soto focus:px-4 focus:py-2 focus:text-pergamino"
      >
        Saltar al contenido principal
      </a>

      <DesktopTopBar onChange={navigate} />
      <Nav active={route.tab} onChange={navigate} open={menuOpen} setOpen={setMenuOpen} />

      <div className="relative flex min-h-0 flex-1">
        <Sidebar active={route.tab} onChange={navigate} />

        <div
          id="main-scroll-container"
          ref={scrollContainerRef}
          className="flex min-w-0 flex-1 flex-col overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <main id="main" className="w-full flex-1">
            <div>
              <ErrorBoundary key={route.tab} label="esta sección">
                <Page onNavigate={navigate} target={route.target} />
              </ErrorBoundary>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <ScrollToTopButton containerRef={scrollContainerRef} resetKey={`${route.tab}/${route.target ?? ''}`} />
    </div>
  );
}
