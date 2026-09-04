import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Copy, Check, Compass, LocateFixed } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

const MORISCOS_COORDS = [41.007944, -5.58325];
const MORISCOS_DMS = '41°00\'28.6"N 5°34\'59.7"W';

const pinIcon = L.divIcon({
  className: 'moriscos-center-pin',
  html: `
    <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; width:42px; height:42px; border-radius:50%; background:rgba(212,163,89,0.4); animation:ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position:relative; width:34px; height:34px; border-radius:50%; background:#8C4A32; border:2.5px solid #FDFBF7; box-shadow:0 4px 12px rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; color:#FDFBF7;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

function MapRecenterController({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) {
      map.flyTo(MORISCOS_COORDS, 14.5, { duration: 1 });
    }
  }, [trigger, map]);
  return null;
}

export default function TownLocationMap({ onNavigateLugares }) {
  return (
    <ErrorBoundary label="el mapa de localización">
      <TownLocationMapInner onNavigateLugares={onNavigateLugares} />
    </ErrorBoundary>
  );
}

function TownLocationMapInner({ onNavigateLugares }) {
  const [copied, setCopied] = useState(false);
  const [recenterCount, setRecenterCount] = useState(0);

  const copyCoordinates = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(MORISCOS_DMS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback si el portapapeles no está disponible
    }
  };

  return (
    <div className="rounded-3xl border border-piedra-border/40 bg-noche-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-noche-border/80 pb-6">
        <div>
          <p className="kicker flex items-center gap-1.5 text-armuna-light">
            <Compass size={16} />
            Ubicación geográfica
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            ¿Dónde nos encontramos?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-pergamino-muted/80 max-w-2xl leading-relaxed">
            Moriscos se halla en la comarca cerealista de <strong>La Armuña</strong>, a tan solo <strong>9 km</strong> al noreste de Salamanca capital, en un enclave privilegiado conectado con el soto de La Flecha y el valle del río Tormes.
          </p>
        </div>

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 self-start md:self-auto shrink-0 shadow-lg cursor-pointer text-sm"
        >
          <Navigation size={17} />
          <span>Abrir en Google Maps</span>
          <ExternalLink size={14} className="opacity-80" />
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] items-stretch">
        {/* Mapa interactivo */}
        <div className="relative isolate z-0 h-[360px] sm:h-[440px] w-full overflow-hidden rounded-2xl border border-piedra-border/50 bg-noche-surface shadow-inner">
          <MapContainer
            center={MORISCOS_COORDS}
            zoom={14}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={MORISCOS_COORDS} icon={pinIcon}>
              <Popup>
                <div className="p-1 text-tinta">
                  <strong className="font-serif text-base block text-soto font-bold">
                    Moriscos (Salamanca)
                  </strong>
                  <p className="text-xs text-tinta-muted mt-0.5">
                    {MORISCOS_DMS}
                  </p>
                  <p className="text-xs text-tinta-muted mt-0.5">
                    Altitud: 844 m · La Armuña
                  </p>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-soto hover:underline"
                  >
                    Cómo llegar <ExternalLink size={12} />
                  </a>
                </div>
              </Popup>
            </Marker>
            <MapRecenterController trigger={recenterCount} />
          </MapContainer>

          {/* Botón flotante para recentrar el mapa */}
          <button
            type="button"
            onClick={() => setRecenterCount((c) => c + 1)}
            title="Volver a centrar en Moriscos"
            aria-label="Volver a centrar en Moriscos"
            className="absolute bottom-4 right-4 z-[10] flex items-center gap-1.5 rounded-xl border border-piedra-400/30 bg-noche-surface/90 px-3 py-2 text-xs font-medium text-pergamino shadow-lg backdrop-blur-md transition-all hover:bg-noche hover:border-armuna-light cursor-pointer active:scale-95"
          >
            <LocateFixed size={15} className="text-armuna-light" />
            <span className="hidden sm:inline">Centrar pueblo</span>
          </button>
        </div>

        {/* Ficha técnica y datos de situación */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-noche-border bg-noche-surface/60 p-5 sm:p-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-armuna-light flex items-center gap-2">
              <MapPin size={18} />
              Datos de localización
            </h3>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-noche-border/80 bg-noche-card/60 p-3.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-piedra-300/80 font-medium">Coordenadas exactas</p>
                  <p className="font-mono text-sm text-pergamino font-semibold mt-0.5">{MORISCOS_DMS}</p>
                  <p className="text-[11px] text-pergamino-muted/60 mt-0.5">41.007944, -5.583250</p>
                </div>
                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="flex items-center gap-1 rounded-lg border border-piedra-400/30 bg-noche/80 px-2.5 py-1.5 text-xs text-pergamino-muted transition-colors hover:border-armuna-light hover:text-pergamino cursor-pointer"
                  title="Copiar coordenadas"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-300 font-medium">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-noche-border/80 bg-noche-card/60 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-piedra-300/80 font-medium">Distancia capital</p>
                  <p className="text-sm font-semibold text-pergamino mt-0.5">9 km</p>
                  <p className="text-[11px] text-pergamino-muted/60">~10 min (A-62 / N-620)</p>
                </div>
                <div className="rounded-xl border border-noche-border/80 bg-noche-card/60 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-piedra-300/80 font-medium">Altitud</p>
                  <p className="text-sm font-semibold text-pergamino mt-0.5">844 m</p>
                  <p className="text-[11px] text-pergamino-muted/60">Sobre el nivel del mar</p>
                </div>
              </div>

              <div className="rounded-xl border border-noche-border/80 bg-noche-card/60 p-3">
                <p className="text-[11px] uppercase tracking-wider text-piedra-300/80 font-medium">Comarca histórica</p>
                <p className="text-sm font-semibold text-pergamino mt-0.5">La Armuña (Salamanca)</p>
                <p className="text-xs text-pergamino-muted/70 mt-1 leading-relaxed">
                  Límite con los despoblados medievales de El Hoyo y Ribas, y próximo al soto de La Flecha a orillas del Tormes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
