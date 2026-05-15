/* eslint-disable react-hooks/set-state-in-effect -- 
   This pattern is intentional for SSR compatibility in Next.js.
   We need to detect when the component mounts on the client to avoid hydration mismatches with Leaflet maps. */
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet with React/Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to handle map events and geolocation
function LocationMarker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const map = useMapEvents({
    locationfound() {
      const latlng = map.getCenter();
      setPosition([latlng.lat, latlng.lng]);
      map.flyTo(latlng, map.getZoom());
      onLocationFound(latlng.lat, latlng.lng);
    },
    locationerror(e) {
      setError((e as L.ErrorEvent).message);
    },
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  if (error) {
    return (
      <div className="absolute top-4 left-4 z-[1000] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Error de geolocalización: {error}
      </div>
    );
  }

  return position ? (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <p className="font-bold text-gray-800">¡Estás aquí!</p>
          <p className="text-sm text-gray-600">
            Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : (
    <div className="absolute top-4 left-4 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
      Obteniendo ubicación...
    </div>
  );
}

interface GeolocationMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onLocationFound?: (lat: number, lng: number) => void;
}

export default function GeolocationMap({
  center = [18.6533, -96.8267], // Default center (Ixtaczoquitlán, Veracruz)
  zoom = 13,
  className = "h-[400px] w-full rounded-3xl",
  onLocationFound,
}: GeolocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-white/10 backdrop-blur-xl flex items-center justify-center`}>
        <div className="text-white/70 animate-pulse">Cargando mapa...</div>
      </div>
    );
  }

  return (
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
      <LocationMarker onLocationFound={onLocationFound || (() => {})} />
    </MapContainer>
  );
}