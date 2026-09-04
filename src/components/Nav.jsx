import React, { useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  History,
  MapPin,
  PartyPopper,
  Shield,
  Church,
  BookOpen,
  Map,
  Users,
  BookMarked,
  Library,
  Info,
} from 'lucide-react';
import SearchModal from './SearchModal';

export const navItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'historia', label: 'Historia', icon: History },
  { id: 'lugares', label: 'Lugares', icon: MapPin },
  { id: 'fiestas', label: 'Fiestas', icon: PartyPopper },
  { id: 'escudo', label: 'El Escudo', icon: Shield },
  { id: 'iglesia', label: 'La Iglesia', icon: Church },
  { id: 'libro', label: 'El Libro', icon: BookOpen },
  { id: 'ruta-nocturna', label: 'Ruta Nocturna', icon: Map },
  { id: 'genealogia', label: 'Genealogía', icon: Users },
  { id: 'glosario', label: 'Glosario', icon: BookMarked },
  { id: 'referencias', label: 'Referencias', icon: Library },
  { id: 'sobre-la-web', label: 'Sobre la web', icon: Info },
];

function NavLinkList({ active, onChange, onClose }) {
  return (
    <div className="flex flex-col w-full gap-1 pb-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onChange(item.id);
              onClose?.();
            }}
            data-active={String(isActive)}
            className="nav-item text-left"
          >
            <Icon size={18} strokeWidth={isActive ? 2.4 : 2} className={isActive ? 'text-armuna-light' : 'opacity-80'} />
            <span className="text-[14px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Drawer Deslizante Móvil (0.3s cubic-bezier)
export function Drawer({ active, onChange, open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Fondo oscuro difuminado */}
      <div
        className={`fixed inset-0 z-[200] bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menú deslizante con textura de trigo y calidez de piedra de Villamayor */}
      <aside
        className="fixed top-0 left-0 h-full flex flex-col z-[210] sidebar-panel shadow-[6px_0_32px_rgba(0,0,0,0.55)]"
        style={{
          width: 256,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s linear',
          // Oculto de verdad al cerrarse: así el menú no queda en el orden de
          // tabulación cuando está fuera de pantalla.
          visibility: open ? 'visible' : 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Menú principal de navegación"
      >
        {/* Cabecera del Drawer */}
        <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-4 border-b border-[#b88432]/30">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-wider text-pergamino">
            <img
              src="/moriscos-wiki/images/escudo-moriscos-160.jpg"
              alt="Escudo de Moriscos"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-piedra-300/80 shadow-sm"
              width="32"
              height="32"
            />
            MORISCOS
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="p-1.5 rounded-full text-pergamino-muted/70 hover:bg-white/10 hover:text-pergamino transition-colors cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* Lista de navegación scrolleable */}
        <nav className="flex flex-col p-3 overflow-y-auto flex-1">
          <NavLinkList active={active} onChange={onChange} onClose={onClose} />
        </nav>

        {/* Accesos directos inferiores */}
        <div className="flex items-center justify-around px-3 py-3 border-t border-[#b88432]/30 bg-black/45 backdrop-blur-sm">
          {[
            { id: 'inicio', icon: Home, label: 'Inicio' },
            { id: 'historia', icon: History, label: 'Historia' },
            { id: 'lugares', icon: MapPin, label: 'Lugares' },
            { id: 'libro', icon: BookOpen, label: 'El Libro' },
          ].map((quick) => {
            const Icon = quick.icon;
            const isActive = active === quick.id;
            return (
              <button
                key={quick.id}
                type="button"
                onClick={() => {
                  onChange(quick.id);
                  onClose();
                }}
                title={quick.label}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'bg-armuna-light/25 text-armuna-light shadow-sm' : 'text-pergamino-muted/70 hover:text-pergamino'
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// Barra superior móvil
export default function Nav({ active, onChange, open, setOpen }) {
  return (
    <>
      <header
        className="relative w-full shrink-0 z-40 flex items-center justify-between px-3 sm:px-6 lg:hidden header-panel"
        style={{
          height: 'var(--mobile-topbar, 58px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center w-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="p-1.5 -ml-1 rounded-lg text-pergamino hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Menu size={24} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onChange('inicio')}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 font-display text-xl sm:text-2xl font-black tracking-[0.14em] text-pergamino cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Ir al inicio de Moriscos"
        >
          <img
            src="/moriscos-wiki/images/escudo-moriscos-160.jpg"
            alt="Escudo de Moriscos"
            className="h-7 w-7 rounded-full object-cover ring-2 ring-piedra-300/80 shadow-sm"
            width="28"
            height="28"
          />
          MORISCOS
        </button>

        <div className="flex items-center justify-end w-10">
          <SearchModal onSelectResult={onChange} />
        </div>
      </header>

      <Drawer active={active} onChange={onChange} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// Barra lateral para Desktop (lg:flex) con textura de trigo y arenisca dorada
export function Sidebar({ active, onChange }) {
  return (
    <aside
      className="hidden lg:flex flex-col sidebar-panel shrink-0 z-30"
      style={{ width: 250 }}
      aria-label="Navegación principal"
    >
      <div className="p-4 overflow-y-auto flex-1">
        <NavLinkList active={active} onChange={onChange} />
      </div>
    </aside>
  );
}

// Barra superior para Desktop (lg:flex) con textura de trigo y escudo centrado
export function DesktopTopBar({ onChange }) {
  return (
    <header className="relative hidden lg:flex items-center justify-between px-8 py-3.5 header-panel shrink-0">
      <div className="flex items-center w-36" />

      <button
        type="button"
        onClick={() => onChange('inicio')}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3.5 cursor-pointer group transition-transform duration-200 hover:scale-[1.02]"
        aria-label="Ir al inicio de Moriscos"
      >
        <img
          src="/moriscos-wiki/images/escudo-moriscos-160.jpg"
          alt="Escudo de Moriscos"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-piedra-300/80 shadow-md transition-transform duration-300 group-hover:scale-105"
          width="36"
          height="36"
        />
        <span className="font-display text-[1.85rem] font-black tracking-[0.15em] text-pergamino leading-none drop-shadow-sm">
          MORISCOS
        </span>
      </button>

      <div className="flex items-center justify-end w-36">
        <SearchModal onSelectResult={onChange} />
      </div>
    </header>
  );
}
