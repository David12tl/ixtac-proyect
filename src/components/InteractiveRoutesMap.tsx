"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = (color: string, type: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}ee, ${color}99);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid rgba(255,255,255,0.8);
        box-shadow: 0 4px 16px ${color}55, 0 0 0 4px ${color}22;
        font-size: 15px;
        backdrop-filter: blur(8px);
      ">
        ${type}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const SERVICE_ICONS: Record<string, { color: string; emoji: string }> = {
  alojamiento: { color: "#60A5FA", emoji: "🏨" },
  restaurante:  { color: "#FBBF24", emoji: "🍽️" },
  aventura:     { color: "#34D399", emoji: "🥾" },
  cultura:      { color: "#A78BFA", emoji: "🏛️" },
  naturaleza:   { color: "#86EFAC", emoji: "🌿" },
  transporte:   { color: "#F87171", emoji: "🚗" },
  otros:        { color: "#94A3B8", emoji: "📍" },
};

const SERVICE_TYPES = [
  { value: "alojamiento", label: "Alojamiento" },
  { value: "restaurante", label: "Restaurante" },
  { value: "aventura", label: "Aventura" },
  { value: "cultura", label: "Cultura" },
  { value: "naturaleza", label: "Naturaleza" },
  { value: "transporte", label: "Transporte" },
  { value: "otros", label: "Otros" },
];

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function FitBounds({ waypoints }: { waypoints: Waypoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints.length >= 2) {
      map.fitBounds(waypoints.map(w => [w.lat, w.lng] as [number, number]), { padding: [50, 50] });
    } else if (waypoints.length === 1) {
      map.setView([waypoints[0].lat, waypoints[0].lng], 14);
    }
  }, [waypoints, map]);
  return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateTotalDistance(waypoints: Waypoint[]): number {
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistance(waypoints[i].lat, waypoints[i].lng, waypoints[i + 1].lat, waypoints[i + 1].lng);
  }
  return total;
}

export interface Waypoint {
  id: string; lat: number; lng: number;
  name: string; description: string; serviceType: string;
}

export interface SavedRoute {
  id: string; name: string; waypoints: Waypoint[];
  createdAt: Date; color: string;
}

interface InteractiveRoutesMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  initialWaypoints?: Waypoint[];
  savedRoutes?: SavedRoute[];
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

// ── Glass panel helper ───────────────────────────────────────────────────────
const glass = {
  panel:  "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
  card:   "bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]",
  input:  "bg-white/[0.07] border border-white/[0.15] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#86efac]/60 focus:bg-white/[0.10] transition-all duration-200",
  btnPrimary: "bg-gradient-to-r from-[#86efac] to-[#4ade80] text-[#052e16] font-bold rounded-full px-6 py-3 text-sm hover:shadow-[0_0_24px_rgba(134,239,172,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-200",
  btnGhost:   "bg-white/[0.07] border border-white/[0.12] text-white/80 font-medium rounded-full px-6 py-3 text-sm hover:bg-white/[0.14] hover:text-white active:scale-95 transition-all duration-200",
};

export default function InteractiveRoutesMap({
  center = [18.6533, -96.8267],
  zoom = 13,
  className = "h-[520px] w-full",
  initialWaypoints = [],
  savedRoutes = [],
  onWaypointsChange,
}: InteractiveRoutesMapProps) {
  const [mounted, setMounted]           = useState(false);
  const [waypoints, setWaypoints]       = useState<Waypoint[]>(initialWaypoints);
  const [routes, setRoutes]             = useState<SavedRoute[]>(savedRoutes);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [newWaypoint, setNewWaypoint]   = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData]         = useState({ name: "", description: "", serviceType: "otros" });
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showRouteList, setShowRouteList] = useState(false);
  const [routeName, setRouteName]       = useState("");
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);
  useEffect(() => { onWaypointsChange?.(waypoints); }, [waypoints, onWaypointsChange]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewWaypoint({ lat, lng });
    setShowAddForm(true);
    setFormData({ name: "", description: "", serviceType: "otros" });
  }, []);

  const handleAddWaypoint = () => {
    if (!newWaypoint || !formData.name.trim()) return;
    setWaypoints(prev => [...prev, {
      id: Date.now().toString(), lat: newWaypoint.lat, lng: newWaypoint.lng,
      name: formData.name, description: formData.description, serviceType: formData.serviceType,
    }]);
    setShowAddForm(false); setNewWaypoint(null);
  };

  const handleRemoveWaypoint = (id: string) => setWaypoints(prev => prev.filter(w => w.id !== id));

  const handleSaveRoute = () => {
    if (waypoints.length < 2 || !routeName.trim()) return;
    const colors = ["#60A5FA","#34D399","#FBBF24","#A78BFA","#F87171","#EC4899"];
    setRoutes(prev => {
      const r: SavedRoute = {
        id: Date.now().toString(), name: routeName, waypoints: [...waypoints],
        createdAt: new Date(), color: colors[prev.length % colors.length],
      };
      return [...prev, r];
    });
    setRouteName(""); setSaveModalOpen(false);
  };

  const handleLoadRoute = (route: SavedRoute) => {
    setWaypoints(route.waypoints); setSelectedRoute(route.id); setShowRouteList(false);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    if (selectedRoute === id) setSelectedRoute(null);
  };

  const totalDistance = calculateTotalDistance(waypoints);

  if (!mounted) return (
    <div className={`${glass.panel} rounded-[32px] flex items-center justify-center h-[600px]`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#86efac]/40 border-t-[#86efac] rounded-full animate-spin" />
        <p className="text-white/40 text-sm tracking-widest uppercase font-light">Iniciando mapa</p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── GLOBAL STYLES ─────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

        .rim-map-root * { font-family: 'DM Sans', sans-serif; }
        .rim-map-root .display-font { font-family: 'Syne', sans-serif; }

        .leaflet-popup-content-wrapper {
          background: rgba(10,20,15,0.85) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
          color: white !important;
        }
        .leaflet-popup-tip { background: rgba(10,20,15,0.85) !important; }
        .leaflet-popup-content { color: white !important; }
        .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
        .custom-marker { background: transparent; border: none; }

        .rim-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 16px 24px;
          display: flex; flex-direction: column; gap: 4px;
          transition: background 0.2s;
        }
        .rim-stat-card:hover { background: rgba(255,255,255,0.07); }

        .rim-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 16px;
          animation: rimFadeIn 0.2s ease;
        }
        .rim-modal {
          background: rgba(8,18,12,0.92);
          backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 28px;
          padding: 36px;
          max-width: 440px; width: 100%;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(134,239,172,0.06);
          animation: rimSlideUp 0.25s ease;
        }
        @keyframes rimFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rimSlideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        .rim-sidebar {
          position: fixed; inset-y: 0; right: 0;
          width: min(400px, 100vw);
          background: rgba(5,14,9,0.90);
          backdrop-filter: blur(32px);
          border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 999;
          overflow-y: auto;
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
          animation: rimSlideLeft 0.28s ease;
        }
        @keyframes rimSlideLeft { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }

        .rim-route-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 16px;
          cursor: pointer; transition: all 0.2s;
        }
        .rim-route-card:hover { background: rgba(255,255,255,0.08); }
        .rim-route-card.active {
          border-color: rgba(134,239,172,0.5);
          background: rgba(134,239,172,0.06);
          box-shadow: 0 0 0 1px rgba(134,239,172,0.15);
        }

        select.rim-select option {
          background: #0a120c;
          color: white;
        }

        .rim-tag {
          font-size: 10px; font-weight: 500; letter-spacing: 0.05em;
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.55);
          border-radius: 999px; padding: 3px 10px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .rim-dot {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block; margin-right: 6px;
        }
      `}} />

      {/* ── ROOT ──────────────────────────────────────────────────────────── */}
      <div className="rim-map-root flex flex-col gap-4">

        {/* ── MAP CARD ──────────────────────────────────────────────────── */}
        <div className={`${glass.panel} rounded-[32px] overflow-hidden relative`}>

          {/* Corner badge */}
          <div className="absolute top-4 left-4 z-[500] flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse inline-block" />
            <span className="display-font text-white/80 text-xs font-semibold tracking-wider uppercase">Modo edición</span>
          </div>

          {/* Hint badge */}
          <div className="absolute top-4 right-4 z-[500] bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
            <span className="text-white/50 text-xs">Toca el mapa para agregar puntos</span>
          </div>

          <MapContainer
            center={center} zoom={zoom}
            style={{ height: "520px", width: "100%", borderRadius: "0" }}
            className={className}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            <FitBounds waypoints={waypoints} />

            {waypoints.map((wp) => {
              const icon = SERVICE_ICONS[wp.serviceType] || SERVICE_ICONS.otros;
              return (
                <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={createCustomIcon(icon.color, icon.emoji)}>
                  <Popup>
                    <div style={{ minWidth: 200, padding: "4px 0" }}>
                      <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "white", margin: "0 0 6px" }}>
                        {wp.name}
                      </p>
                      <span style={{
                        fontSize: 10, background: "rgba(134,239,172,0.15)", color: "#86efac",
                        borderRadius: 999, padding: "2px 10px", border: "1px solid rgba(134,239,172,0.3)",
                        letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                      }}>
                        {SERVICE_TYPES.find(t => t.value === wp.serviceType)?.label}
                      </span>
                      {wp.description && (
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 8, lineHeight: 1.5 }}>{wp.description}</p>
                      )}
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6, fontFamily: "monospace" }}>
                        {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
                      </p>
                      <button
                        onClick={() => handleRemoveWaypoint(wp.id)}
                        style={{
                          marginTop: 10, background: "rgba(248,113,113,0.12)", color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.3)", borderRadius: 999,
                          padding: "4px 14px", fontSize: 11, cursor: "pointer", width: "100%",
                          transition: "background 0.2s",
                        }}
                      >
                        Eliminar punto
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {waypoints.length >= 2 && (
              <Polyline
                positions={waypoints.map(w => [w.lat, w.lng] as [number, number])}
                color="#86efac" weight={3} opacity={0.7} dashArray="8, 8"
              />
            )}

            {routes.map(route => (
              <Polyline
                key={route.id}
                positions={route.waypoints.map(w => [w.lat, w.lng] as [number, number])}
                color={route.color}
                weight={selectedRoute === route.id ? 5 : 2}
                opacity={selectedRoute === route.id ? 0.85 : 0.35}
              />
            ))}
          </MapContainer>
        </div>

        {/* ── STATS + ACTIONS ───────────────────────────────────────────── */}
        <div className={`${glass.panel} rounded-[28px] px-6 py-5 flex flex-wrap items-center justify-between gap-4`}>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Puntos", value: waypoints.length, unit: "" },
              { label: "Distancia", value: totalDistance.toFixed(1), unit: " km" },
              { label: "Rutas", value: routes.length, unit: "" },
            ].map(s => (
              <div key={s.label} className="rim-stat-card">
                <span className="text-white/35 text-[10px] uppercase tracking-widest font-medium">{s.label}</span>
                <span className="display-font text-white text-2xl font-bold leading-none">{s.value}<span className="text-sm text-white/40 font-normal">{s.unit}</span></span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 flex-wrap">
            {Object.entries(SERVICE_ICONS).slice(0, 5).map(([key, val]) => (
              <span key={key} className="flex items-center gap-1.5 text-[11px] text-white/40">
                <span className="rim-dot" style={{ background: val.color }} />
                {SERVICE_TYPES.find(t => t.value === key)?.label}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {waypoints.length >= 2 && (
              <button onClick={() => setSaveModalOpen(true)} className={glass.btnPrimary}>
                Guardar ruta
              </button>
            )}
            {waypoints.length > 0 && (
              <button onClick={() => { setWaypoints([]); setSelectedRoute(null); }} className={glass.btnGhost}>
                Limpiar
              </button>
            )}
            <button onClick={() => setShowRouteList(v => !v)} className={glass.btnGhost}>
              {showRouteList ? "Cerrar panel" : `Mis rutas ${routes.length > 0 ? `(${routes.length})` : ""}`}
            </button>
          </div>
        </div>

        {/* Waypoint list mini */}
        {waypoints.length > 0 && (
          <div className={`${glass.panel} rounded-[24px] px-6 py-4`}>
            <p className="display-font text-white/40 text-[10px] uppercase tracking-widest mb-3">Puntos actuales</p>
            <div className="flex flex-wrap gap-2">
              {waypoints.map((wp, i) => {
                const icon = SERVICE_ICONS[wp.serviceType] || SERVICE_ICONS.otros;
                return (
                  <span key={wp.id} className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1.5 text-xs text-white/70">
                    <span style={{ color: icon.color }}>{icon.emoji}</span>
                    <span className="text-white/30 text-[10px]">{i + 1}.</span>
                    {wp.name}
                    <button onClick={() => handleRemoveWaypoint(wp.id)} className="ml-1 text-white/20 hover:text-red-400 transition-colors">×</button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── ADD WAYPOINT MODAL ─────────────────────────────────────────────── */}
      {showAddForm && newWaypoint && (
        <div className="rim-modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowAddForm(false); setNewWaypoint(null); } }}>
          <div className="rim-modal">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-[#86efac]/10 border border-[#86efac]/20 flex items-center justify-center text-lg">📍</div>
              <div>
                <h3 className="display-font text-white font-bold text-xl leading-none">Nuevo punto</h3>
                <p className="text-white/35 text-xs mt-1 font-mono">{newWaypoint.lat.toFixed(5)}, {newWaypoint.lng.toFixed(5)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block font-medium">Nombre *</label>
                <input
                  type="text" value={formData.name} autoFocus
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full ${glass.input}`}
                  placeholder="Ej: Mirador El Salto"
                  onKeyDown={e => e.key === "Enter" && handleAddWaypoint()}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block font-medium">Tipo</label>
                <select
                  value={formData.serviceType}
                  onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                  className={`w-full rim-select ${glass.input}`}
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  {SERVICE_TYPES.map(t => <option key={t.value} value={t.value}>{SERVICE_ICONS[t.value]?.emoji} {t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block font-medium">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full ${glass.input} resize-none`} rows={3}
                  placeholder="Describe el lugar o servicio…"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => { setShowAddForm(false); setNewWaypoint(null); }} className={`flex-1 ${glass.btnGhost}`}>Cancelar</button>
              <button onClick={handleAddWaypoint} disabled={!formData.name.trim()} className={`flex-1 ${glass.btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none`}>Agregar punto</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAVE ROUTE MODAL ───────────────────────────────────────────────── */}
      {saveModalOpen && (
        <div className="rim-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSaveModalOpen(false); }}>
          <div className="rim-modal">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-2xl bg-[#86efac]/10 border border-[#86efac]/20 flex items-center justify-center text-lg">🗺️</div>
              <h3 className="display-font text-white font-bold text-xl">Guardar ruta</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block font-medium">Nombre de la ruta *</label>
                <input
                  type="text" value={routeName} autoFocus
                  onChange={e => setRouteName(e.target.value)}
                  className={`w-full ${glass.input}`}
                  placeholder="Ej: Ruta de las Cascadas"
                  onKeyDown={e => e.key === "Enter" && handleSaveRoute()}
                />
              </div>

              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 space-y-3">
                <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium">Resumen</p>
                <div className="flex gap-4">
                  <div><p className="text-white font-bold text-lg">{waypoints.length}</p><p className="text-white/35 text-xs">puntos</p></div>
                  <div className="w-px bg-white/10" />
                  <div><p className="text-white font-bold text-lg">{totalDistance.toFixed(1)} km</p><p className="text-white/35 text-xs">distancia</p></div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {waypoints.slice(0, 5).map((w, i) => {
                    const icon = SERVICE_ICONS[w.serviceType] || SERVICE_ICONS.otros;
                    return <span key={w.id} className="rim-tag">{icon.emoji} {w.name}</span>;
                  })}
                  {waypoints.length > 5 && <span className="rim-tag">+{waypoints.length - 5}</span>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setSaveModalOpen(false)} className={`flex-1 ${glass.btnGhost}`}>Cancelar</button>
              <button onClick={handleSaveRoute} disabled={!routeName.trim()} className={`flex-1 ${glass.btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR: ROUTES LIST ───────────────────────────────────────────── */}
      {showRouteList && (
        <div className="rim-sidebar">
          <div className="p-7">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h3 className="display-font text-white font-bold text-xl leading-none">Mis rutas</h3>
                <p className="text-white/35 text-xs mt-1">{routes.length} ruta{routes.length !== 1 ? "s" : ""} guardada{routes.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setShowRouteList(false)} className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.10] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.14] transition-all">
                ✕
              </button>
            </div>

            {routes.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-2xl">🗺️</div>
                <p className="text-white/30 text-sm">Sin rutas guardadas</p>
                <p className="text-white/20 text-xs max-w-[200px] leading-relaxed">Agrega puntos en el mapa y guarda tu primera ruta</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {routes.map(route => (
                  <div
                    key={route.id}
                    className={`rim-route-card ${selectedRoute === route.id ? "active" : ""}`}
                    onClick={() => handleLoadRoute(route)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="rim-dot mt-2 flex-shrink-0" style={{ background: route.color, boxShadow: `0 0 8px ${route.color}66` }} />
                        <div>
                          <p className="display-font text-white font-semibold text-sm leading-snug">{route.name}</p>
                          <p className="text-white/35 text-xs mt-0.5">{route.waypoints.length} puntos · {calculateTotalDistance(route.waypoints).toFixed(1)} km</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {route.waypoints.slice(0, 3).map(w => <span key={w.id} className="rim-tag">{w.name}</span>)}
                            {route.waypoints.length > 3 && <span className="rim-tag">+{route.waypoints.length - 3}</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleDeleteRoute(route.id); }}
                        className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all flex-shrink-0 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* How-to */}
            <div className="mt-8 bg-[#86efac]/[0.04] border border-[#86efac]/[0.10] rounded-2xl p-5">
              <p className="display-font text-[#86efac]/70 text-[10px] uppercase tracking-widest mb-3 font-semibold">Cómo crear una ruta</p>
              <ol className="space-y-2">
                {["Toca el mapa para agregar puntos", "Completa el nombre y tipo de cada punto", "Necesitas al menos 2 puntos", "Usa el botón 'Guardar ruta' para almacenarla"].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/35 text-xs leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-white/[0.07] flex items-center justify-center text-[9px] text-white/40 font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}