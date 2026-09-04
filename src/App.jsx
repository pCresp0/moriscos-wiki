import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Nav, { Sidebar, DesktopTopBar } from './components/Nav';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import ErrorBoundary from './components/ErrorBoundary';
import { DEFAULT_TAB, TABS } from './utils/router';

// Todas las páginas se importan de forma estática: el contenido completo viaja
// en el bundle y cambiar de sección es solo un cambio de estado, sin esperas.
import InicioPage from './pages/InicioPage';
import HistoriaPage from './pages/HistoriaPage';
import EconomiaPage from './pages/EconomiaPage';
import LugaresPage from './pages/LugaresPage';
import FiestasPage from './pages/FiestasPage';
import EscudoPage from './pages/EscudoPage';
import IglesiaPage from './pages/IglesiaPage';
import LibroPage from './pages/LibroPage';
import RutaNocturnaPage from './pages/RutaNocturnaPage';
import GaleriaPage from './pages/GaleriaPage';
import GlosarioPage from './pages/GlosarioPage';
import ReferenciasPage from './pages/ReferenciasPage';
import SobrePage from './pages/SobrePage';

const PAGES = {
  inicio: InicioPage,
  historia: HistoriaPage,
  economia: EconomiaPage,
  lugares: LugaresPage,
  fiestas: FiestasPage,
  escudo: EscudoPage,
  iglesia: IglesiaPage,
  libro: LibroPage,
  'ruta-nocturna': RutaNocturnaPage,
  galeria: GaleriaPage,
  glosario: GlosarioPage,
  referencias: ReferenciasPage,
  'sobre-la-web': SobrePage,
};

export default function App() {
  // Navegación puramente en memoria: la URL se mantiene siempre fija y limpia.
  const [route, setRoute] = useState({ tab: DEFAULT_TAB, target: null });
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  // Asegurar que la barra de direcciones quede limpia y fija en la raíz si traía hash previo
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const navigate = useCallback((tab, target = null) => {
    const validTab = TABS.includes(tab) ? tab : DEFAULT_TAB;
    setRoute({ tab: validTab, target });
  }, []);

  // Al cambiar de sección se vuelve arriba si no hay un target específico.
  useEffect(() => {
    if (route.target) return;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.tab, route.target]);

  // Al seleccionar un resultado del buscador con destino concreto (target),
  // se busca el elemento en el DOM, se desplaza suavemente hasta él y se
  // sobresalta con el halo visual distintivo.
  useEffect(() => {
    if (!route.target) return;
    const targetId = route.target;
    let attempts = 0;
    let removeTimer = null;

    const tryHighlight = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('search-target', 'target-highlight');
        void el.offsetWidth;
        el.classList.add('search-target', 'target-highlight');

        removeTimer = setTimeout(() => {
          el.classList.remove('target-highlight');
        }, 3600);
        return true;
      }
      return false;
    };

    // Intentar de inmediato o reintentar en los primeros frames si la página está montándose
    if (!tryHighlight()) {
      const interval = setInterval(() => {
        attempts += 1;
        if (tryHighlight() || attempts >= 12) {
          clearInterval(interval);
        }
      }, 70);

      return () => {
        clearInterval(interval);
        if (removeTimer) clearTimeout(removeTimer);
      };
    }

    return () => {
      if (removeTimer) clearTimeout(removeTimer);
    };
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
