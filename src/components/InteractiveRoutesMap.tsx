"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons for different service types
const createCustomIcon = (color: string, type: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${type}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const SERVICE_ICONS: Record<string, { color: string; emoji: string }> = {
  alojamiento: { color: "#3B82F6", emoji: "🏨" },
  restaurante: { color: "#F59E0B", emoji: "🍽️" },
  aventura: { color: "#10B981", emoji: "🥾" },
  cultura: { color: "#8B5CF6", emoji: "🏛️" },
  naturaleza: { color: "#22C55E", emoji: "🌿" },
  transporte: { color: "#EF4444", emoji: "🚗" },
  otros: { color: "#6B7280", emoji: "📍" },
};

// Service type options
const SERVICE_TYPES = [
  { value: "alojamiento", label: "Alojamiento" },
  { value: "restaurante", label: "Restaurante" },
  { value: "aventura", label: "Aventura" },
  { value: "cultura", label: "Cultura" },
  { value: "naturaleza", label: "Naturaleza" },
  { value: "transporte", label: "Transporte" },
  { value: "otros", label: "Otros" },
];

// Map event handler for clicking to add waypoints
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to fit bounds when waypoints change
function FitBounds({ waypoints }: { waypoints: Waypoint[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (waypoints.length >= 2) {
      const bounds = waypoints.map(w => [w.lat, w.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (waypoints.length === 1) {
      map.setView([waypoints[0].lat, waypoints[0].lng], 14);
    }
  }, [waypoints, map]);
  
  return null;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total route distance
function calculateTotalDistance(waypoints: Waypoint[]): number {
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistance(
      waypoints[i].lat,
      waypoints[i].lng,
      waypoints[i + 1].lat,
      waypoints[i + 1].lng
    );
  }
  return total;
}

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  serviceType: string;
}

export interface SavedRoute {
  id: string;
  name: string;
  waypoints: Waypoint[];
  createdAt: Date;
  color: string;
}

interface InteractiveRoutesMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  initialWaypoints?: Waypoint[];
  savedRoutes?: SavedRoute[];
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

export default function InteractiveRoutesMap({
  center = [18.6533, -96.8267],
  zoom = 13,
  className = "h-[500px] w-full rounded-3xl",
  initialWaypoints = [],
  savedRoutes = [],
  onWaypointsChange,
}: InteractiveRoutesMapProps) {
  const [mounted, setMounted] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(initialWaypoints);
  const [routes, setRoutes] = useState<SavedRoute[]>(savedRoutes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWaypoint, setNewWaypoint] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    serviceType: "otros",
  });
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showRouteList, setShowRouteList] = useState(false);
  const [routeName, setRouteName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (onWaypointsChange) {
      onWaypointsChange(waypoints);
    }
  }, [waypoints, onWaypointsChange]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewWaypoint({ lat, lng });
    setShowAddForm(true);
    setFormData({ name: "", description: "", serviceType: "otros" });
  }, []);

  const handleAddWaypoint = () => {
    if (!newWaypoint || !formData.name.trim()) return;

    const newPoint: Waypoint = {
      id: Date.now().toString(),
      lat: newWaypoint.lat,
      lng: newWaypoint.lng,
      name: formData.name,
      description: formData.description,
      serviceType: formData.serviceType,
    };

    setWaypoints([...waypoints, newPoint]);
    setShowAddForm(false);
    setNewWaypoint(null);
  };

  const handleRemoveWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  const handleSaveRoute = () => {
    if (waypoints.length < 2 || !routeName.trim()) return;

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899"];
    const newRoute: SavedRoute = {
      id: Date.now().toString(),
      name: routeName,
      waypoints: [...waypoints],
      createdAt: new Date(),
      color: colors[routes.length % colors.length],
    };

    setRoutes([...routes, newRoute]);
    setRouteName("");
    setSelectedRoute(newRoute.id);
  };

  const handleLoadRoute = (route: SavedRoute) => {
    setWaypoints(route.waypoints);
    setSelectedRoute(route.id);
    setShowRouteList(false);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    if (selectedRoute === id) setSelectedRoute(null);
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
    setSelectedRoute(null);
  };

  const totalDistance = calculateTotalDistance(waypoints);

  if (!mounted) {
    return (
      <div className={`${className} bg-white/10 backdrop-blur-xl flex items-center justify-center`}>
        <div className="text-white/70 animate-pulse">Cargando mapa interactivo...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-[40px] border border-white/10 shadow-2xl">
        <MapContainer
          center={center}
          zoom={zoom}
          className={className}
          style={{ borderRadius: "24px", overflow: "hidden" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          <FitBounds waypoints={waypoints} />

          {/* Render waypoints */}
          {waypoints.map((waypoint) => {
            const iconConfig = SERVICE_ICONS[waypoint.serviceType] || SERVICE_ICONS.otros;
            return (
              <Marker
                key={waypoint.id}
                position={[waypoint.lat, waypoint.lng]}
                icon={createCustomIcon(iconConfig.color, iconConfig.emoji)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-gray-800 text-lg">{waypoint.name}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                      {SERVICE_TYPES.find(t => t.value === waypoint.serviceType)?.label || waypoint.serviceType}
                    </span>
                    {waypoint.description && (
                      <p className="text-sm text-gray-600 mt-2">{waypoint.description}</p>
                    )}
                    <button
                      onClick={() => handleRemoveWaypoint(waypoint.id)}
                      className="mt-3 text-red-500 text-sm hover:underline"
                    >
                      Eliminar punto
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render route polyline */}
          {waypoints.length >= 2 && (
            <Polyline
              positions={waypoints.map(w => [w.lat, w.lng] as [number, number])}
              color="#d4e9c7"
              weight={4}
              opacity={0.8}
              dashArray="10, 10"
            />
          )}

          {/* Render saved routes */}
          {routes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.waypoints.map(w => [w.lat, w.lng] as [number, number])}
              color={selectedRoute === route.id ? route.color : `${route.color}40`}
              weight={selectedRoute === route.id ? 5 : 3}
              opacity={selectedRoute === route.id ? 0.9 : 0.4}
            />
          ))}
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="mt-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Puntos en ruta</p>
              <p className="text-white font-bold text-2xl">{waypoints.length}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Distancia total</p>
              <p className="text-white font-bold text-2xl">{totalDistance.toFixed(1)} km</p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider">Rutas guardadas</p>
              <p className="text-white font-bold text-2xl">{routes.length}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {waypoints.length >= 2 && (
              <button
                onClick={handleSaveRoute}
                className="bg-[#d4e9c7] text-[#1b3022] px-6 py-3 rounded-full font-bold text-sm hover:bg-white transition-all"
              >
                Guardar Ruta
              </button>
            )}
            {waypoints.length > 0 && (
              <button
                onClick={handleClearWaypoints}
                className="bg-white/10 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={() => setShowRouteList(!showRouteList)}
              className="bg-white/10 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all"
            >
              {showRouteList ? "Ocultar Rutas" : "Ver Rutas"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Waypoint Modal */}
      {showAddForm && newWaypoint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-[#1a2e1a] rounded-3xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Agregar Punto de Interés</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Nombre del lugar *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4e9c7] transition-colors"
                  placeholder="Ej: Mirador El Salto"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">Tipo de servicio</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4e9c7] transition-colors"
                >
                  {SERVICE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4e9c7] transition-colors resize-none"
                  rows={3}
                  placeholder="Describe el lugar o servicio..."
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/50 text-xs">Coordenadas</p>
                <p className="text-white font-mono text-sm">
                  {newWaypoint.lat.toFixed(6)}, {newWaypoint.lng.toFixed(6)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewWaypoint(null);
                }}
                className="flex-1 bg-white/10 text-white py-3 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddWaypoint}
                className="flex-1 bg-[#d4e9c7] text-[#1b3022] py-3 rounded-full font-bold hover:bg-white transition-all"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Route Modal */}
      {routeName && waypoints.length >= 2 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-[#1a2e1a] rounded-3xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Guardar Ruta</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Nombre de la ruta *</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4e9c7] transition-colors"
                  placeholder="Ej: Ruta de las Cascadas"
                  autoFocus
                />
              </div>

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <p className="text-white/50 text-xs">Resumen de la ruta</p>
                <p className="text-white text-sm">• {waypoints.length} puntos de interés</p>
                <p className="text-white text-sm">• {totalDistance.toFixed(1)} km totales</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {waypoints.slice(0, 4).map((w, i) => (
                    <span key={w.id} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                      {i + 1}. {w.name}
                    </span>
                  ))}
                  {waypoints.length > 4 && (
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                      +{waypoints.length - 4} más
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setRouteName("")}
                className="flex-1 bg-white/10 text-white py-3 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRoute}
                className="flex-1 bg-[#d4e9c7] text-[#1b3022] py-3 rounded-full font-bold hover:bg-white transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes List Panel */}
      {showRouteList && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-[#1a2e1a] border-l border-white/10 z-[999] shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Rutas Guardadas</h3>
              <button
                onClick={() => setShowRouteList(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {routes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/30">No hay rutas guardadas</p>
                <p className="text-white/20 text-sm mt-2">Haz clic en el mapa para agregar puntos y guarda tu primera ruta</p>
              </div>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`bg-white/5 rounded-2xl p-4 border transition-all cursor-pointer ${
                      selectedRoute === route.id
                        ? "border-[#d4e9c7] bg-white/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    onClick={() => handleLoadRoute(route)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{route.name}</h4>
                        <p className="text-white/50 text-xs mt-1">
                          {route.waypoints.length} puntos • {calculateTotalDistance(route.waypoints).toFixed(1)} km
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {route.waypoints.slice(0, 3).map(w => (
                            <span key={w.id} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/60">
                              {w.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id);
                        }}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-white/5 rounded-2xl p-4">
              <h4 className="font-bold text-white text-sm mb-3">Cómo crear una ruta:</h4>
              <ol className="text-white/50 text-xs space-y-2">
                <li>1. Haz clic en el mapa para agregar puntos de inter&eacute;s</li>
                <li>2. Completa la informaci&oacute;n de cada punto</li>
                <li>3. Agrega al menos 2 puntos</li>
                <li>4. Haz clic en Guardar Ruta para almacenarla</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Trigger for save route modal */}
      {waypoints.length >= 2 && !routeName && (
        <div className="hidden">
          {/* This is just to trigger the modal logic */}
        </div>
      )}

      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .leaflet-popup-content-wrapper {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }
          .leaflet-popup-tip {
            background: white;
          }
          .custom-marker {
            background: transparent;
            border: none;
          }
        `
      }} />
    </div>
  );
}