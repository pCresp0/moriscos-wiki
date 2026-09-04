import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routePoints } from '../data/route';
import ErrorBoundary from './ErrorBoundary';

const markerIcon = (order: number, active: boolean) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:${active ? 30 : 22}px;height:${active ? 30 : 22}px;
      border-radius:9999px;
      background:${active ? '#8C4A32' : '#B88432'};
      border:2px solid #FDFBF7;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
      color:#FDFBF7;font-family:sans-serif;font-weight:700;font-size:${active ? '13px' : '11px'};
    ">${order}</div>`,
    iconSize: [active ? 30 : 22, active ? 30 : 22],
    iconAnchor: [active ? 15 : 11, active ? 15 : 11],
  });

function FlyToActive({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  // En un efecto y no durante el render: mover el mapa es un efecto secundario.
  useEffect(() => {
    map.flyTo([lat, lng], 14.5, { duration: 0.9 });
  }, [map, lat, lng]);
  return null;
}

export default function RouteMap({ target }: { target?: string | null }) {
  return (
    <ErrorBoundary label="el mapa interactivo">
      <RouteMapInner target={target} />
    </ErrorBoundary>
  );
}

function RouteMapInner({ target }: { target?: string | null }) {
  const [activeId, setActiveId] = useState<string>(
    () => routePoints.find((p) => p.id === target)?.id ?? routePoints[0].id,
  );

  useEffect(() => {
    if (!target) return;
    const point = routePoints.find((p) => p.id === target);
    if (!point) return;
    setActiveId(point.id);
    document.getElementById(point.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [target]);
  const active = routePoints.find((p) => p.id === activeId) ?? routePoints[0];
  const positions = routePoints.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative isolate z-0 h-[420px] overflow-hidden rounded-2xl border border-piedra-border/60 dark:border-noche-border sm:h-[520px]">
        <MapContainer
          center={[routePoints[0].lat, routePoints[0].lng]}
          zoom={13.5}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={positions} pathOptions={{ color: '#b88432', weight: 3.5, dashArray: '6 8' }} />
          {routePoints.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={markerIcon(p.order, p.id === activeId)}
              eventHandlers={{ click: () => setActiveId(p.id) }}
            >
              <Popup>
                <strong>
                  {p.order}. {p.name}
                </strong>
                <br />
                {p.description}
              </Popup>
            </Marker>
          ))}
          <FlyToActive lat={active.lat} lng={active.lng} />
        </MapContainer>
      </div>

      <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
        {routePoints.map((p) => (
          <button
            key={p.id}
            id={p.id}
            onClick={() => setActiveId(p.id)}
            className={`scroll-mt-24 rounded-2xl border p-4 text-left transition-all ${
              p.id === activeId
                ? 'border-piedra-300 bg-piedra-50 dark:border-piedra-400 dark:bg-noche-surface'
                : 'border-piedra-border/60 bg-pergamino hover:border-piedra-200 dark:border-noche-border dark:bg-noche-surface/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-xs tracking-widest text-armuna dark:text-piedra-300">
                HITO {p.order} · KM {p.distanceKm}
              </span>
            </div>
            <p className="mt-1 font-serif text-lg font-semibold text-tinta dark:text-pergamino-muted">{p.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-tinta/70 dark:text-pergamino-muted/70">{p.description}</p>
            {p.quote && (
              <p className="mt-2 border-l-2 border-piedra-300 pl-3 font-serif text-sm italic text-tinta/60 dark:text-pergamino-muted/60">
                {p.quote}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
