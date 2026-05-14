"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const PUNTOS = [
  { 
    id: 1,
    name: "Los 500 Escalones", 
    coords: [-97.0485, 18.8412],
    icon: "mountain",
    description: "Impresionante escalinata tallada en la montaña"
  },
  { 
    id: 2,
    name: "Valle de Tuxpanguillo", 
    coords: [-97.0185, 18.8150],
    icon: "valley",
    description: "Exuberante valle con biodiversidad única"
  },
  { 
    id: 3,
    name: "El Malacate", 
    coords: [-97.0510, 18.8580],
    icon: "historic",
    description: "Antiguo sitio histórico de gran valor cultural"
  },
  { 
    id: 4,
    name: "Puente de Metlac", 
    coords: [-97.0580, 18.8650],
    icon: "bridge",
    description: "Imponente puente sobre el cañón del Metlac"
  },
  { 
    id: 5,
    name: "Ojo de Agua", 
    coords: [-97.0550, 18.8450],
    icon: "water",
    description: "Manantial de aguas cristalinas y refrescantes"
  }
];

// Iconos SVG personalizados para cada tipo de punto
const ICONS = {
  mountain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M12 8l4 4-4 4M8 12h8" />
    </svg>
  ),
  valley: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 8l-3 6h6l-3-6z" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  historic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
    </svg>
  ),
  bridge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M4 10a8 8 0 0 1 16 0" />
      <path d="M2 10h20M4 14v6M20 14v6M8 14v4M16 14v4M12 14v4" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
};

// Crear elemento SVG como string para los marcadores
function createMarkerElement(isActive = false) {
  const div = document.createElement('div');
  div.className = `custom-marker transition-all duration-300 ${isActive ? 'scale-125' : ''}`;
  div.innerHTML = `
    <div class="marker-container">
      <div class="marker-pulse"></div>
      <div class="marker-dot"></div>
    </div>
  `;
  return div;
}

// Estilos CSS personalizados para los marcadores
const markerStyles = `
  <style>
    .custom-marker {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .marker-container {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .marker-pulse {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }
    .marker-dot {
      position: relative;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #10b981;
      border: 3px solid #059669;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      transition: all 0.3s ease;
    }
    .custom-marker:hover .marker-dot {
      transform: scale(1.3);
      background: #059669;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.5); opacity: 0; }
    }
    .points-panel {
      backdrop-filter: blur(20px);
      transition: all 0.3s ease;
    }
    .point-item {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .point-item:hover {
      background: rgba(16, 185, 129, 0.1);
      transform: translateX(4px);
    }
    .point-item.active {
      background: rgba(16, 185, 129, 0.15);
      border-left: 3px solid #10b981;
    }
    .mapboxgl-ctrl-group {
      border-radius: 12px !important;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
    }
    .mapboxgl-ctrl {
      border: none !important;
    }
  </style>
`;

export default function MapWrapper() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const [activePoint, setActivePoint] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const flyToPoint = useCallback((punto) => {
    if (map.current) {
      map.current.flyTo({
        center: punto.coords,
        zoom: 14,
        duration: 1500,
        essential: true
      });
      setActivePoint(punto.id);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-97.0350, 18.8400],
      zoom: 11.5,
      pitch: 35,
      bearing: -17.6,
      antialias: true
    });

    // Controles de navegación personalizados
    const navControl = new mapboxgl.NavigationControl({ 
      showCompass: true, 
      visualizePitch: true,
      showZoom: true
    });
    map.current.addControl(navControl, 'top-right');

    // Control de escala
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }),
      'bottom-right'
    );

    map.current.on('load', () => {
      if (map.current) {
        map.current.resize();

        // Agregar Terreno 3D
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
        });
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Agregar capa de atmósfera
        map.current.setFog({
          'color': 'rgb(186, 210, 235)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.35
        });

        // Crear marcadores personalizados
        PUNTOS.forEach((punto) => {
          const markerElement = createMarkerElement();
          
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: false,
            className: 'custom-popup'
          }).setHTML(`
            <div style="padding: 8px;">
              <div style="font-weight: 700; color: #061b0e; font-size: 14px; margin-bottom: 4px;">${punto.name}</div>
              <div style="font-size: 12px; color: #374151;">${punto.description}</div>
            </div>
          `);

          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat(punto.coords)
            .setPopup(popup)
            .addTo(map.current);

          // Guardar referencia al marcador
          markersRef.current[punto.id] = marker;

          // Evento click en el marcador
          markerElement.addEventListener('click', () => {
            flyToPoint(punto);
          });

          // Evento hover
          markerElement.addEventListener('mouseenter', () => {
            marker.togglePopup();
          });
        });

        setIsLoaded(true);
      }
    });

    const timer = setTimeout(() => {
      if (map.current) map.current.resize();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [flyToPoint]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden shadow-2xl bg-stone-200 group">
      {/* Gradiente decorativo en los bordes */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none z-20" 
           style={{ 
             boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1), inset 0 0 20px rgba(16,185,129,0.05)',
             border: '3px solid rgba(255,255,255,0.3)'
           }} 
      />
      
      {/* Contenedor del mapa */}
      <div ref={mapContainer} className="absolute inset-0 h-full w-full rounded-[29px] overflow-hidden" />
      
      {/* Panel lateral de puntos */}
      <div className={`absolute top-4 left-4 z-10 points-panel bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 ${isPanelOpen ? 'w-72' : 'w-auto'}`}>
        {/* Header del panel */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          {isPanelOpen && (
            <div>
              <h3 className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Ixtac Eco-Map</h3>
              <p className="text-gray-500 text-xs mt-0.5">5 puntos de interés</p>
            </div>
          )}
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-2 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-5 h-5 text-emerald-600 transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : ''}`}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Lista de puntos */}
        {isPanelOpen && (
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {PUNTOS.map((punto, index) => (
              <div 
                key={punto.id}
                className={`point-item flex items-center gap-3 p-3 rounded-xl ${activePoint === punto.id ? 'active' : ''}`}
                onClick={() => flyToPoint(punto)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  {ICONS[punto.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{punto.name}</p>
                  <p className="text-gray-500 text-xs truncate">{punto.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge de estado */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/40 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-emerald-700 font-semibold text-xs">3D Terrain</p>
            <p className="text-gray-500 text-[10px]">Activo</p>
          </div>
        </div>
      </div>

      {/* Overlay de carga */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-stone-100 rounded-[32px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Estilos personalizados */}
      <style jsx global>{`
        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.5);
          background: white;
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
        .mapboxgl-ctrl-zoom-in,
        .mapboxgl-ctrl-zoom-out,
        .mapboxgl-ctrl-compass {
          background-color: rgba(255, 255, 255, 0.9) !important;
          color: #059669 !important;
          backdrop-filter: blur(10px);
        }
        .mapboxgl-ctrl-zoom-in:hover,
        .mapboxgl-ctrl-zoom-out:hover,
        .mapboxgl-ctrl-compass:hover {
          background-color: rgba(16, 185, 129, 0.1) !important;
        }
        .mapboxgl-ctrl-scale {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 10px;
          color: #374151;
          border: 1px solid rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
