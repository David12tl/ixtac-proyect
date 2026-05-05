"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// El token ahora se toma de una variable de entorno
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapWrapper = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-97.0608, 18.8547], // Centro de Ixtaczoquitlán
      zoom: 12.5,
      pitch: 45,
      bearing: -10,
      antialias: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    map.current.on('load', () => {
      map.current.resize();

      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([-97.0608, 18.8547])
        .setPopup(new mapboxgl.Popup().setHTML("<b>Ixtaczoquitlán</b><br>Corazón del Valle"))
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-[30px] overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute bottom-6 left-6 z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl text-white text-[11px] max-w-[200px] border border-white/10">
        <p className="font-bold text-[#d4e9c7] mb-1 italic">Fisiografía del Valle</p>
        <p className="opacity-80">Zona de transición entre el Eje Neovolcánico y la llanura costera.</p>
      </div>
    </div>
  );
};

export default MapWrapper;
