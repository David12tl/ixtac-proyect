"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Share2,
  Navigation,
  Phone,
  Globe,
  ChevronRight,
  Calendar
} from 'lucide-react';
import type { AttractionType } from './SearchBar';

export interface AttractionData {
  id: string;
  name: string;
  type: AttractionType;
  description: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$';
  openingHours: string;
  phone?: string;
  website?: string;
  features: string[];
  bestTimeToVisit: string;
  accessibility: boolean;
}

interface AttractionCardProps {
  attraction: AttractionData;
  onFavorite?: (attractionId: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const typeIcons: Record<AttractionType, string> = {
  todos: '🗺️',
  restaurante: '🍽️',
  sitio_historico: '🏛️',
  taller: '👨‍🎨',
  mirador: '🏔️',
  cascada: '💧',
  museo: '🎭',
  mercado: '🛒'
};

const typeLabels: Record<AttractionType, string> = {
  todos: 'Lugar',
  restaurante: 'Restaurante',
  sitio_historico: 'Sitio Histórico',
  taller: 'Taller',
  mirador: 'Mirador',
  cascada: 'Cascada',
  museo: 'Museo',
  mercado: 'Mercado'
};

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  onFavorite,
  isFavorite = false,
  variant = 'default'
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(attraction.id);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative group bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex">
          {/* Imagen pequeña */}
          <div className="w-32 h-32 flex-shrink-0 relative">
            <Image
              src={attraction.image}
              alt={attraction.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center">
              <span className="text-lg">{typeIcons[attraction.type]}</span>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#1b3022] line-clamp-1">{attraction.name}</h3>
                <button 
                  onClick={handleFavoriteClick}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  <Heart size={12} className={isFavorite ? 'fill-white' : ''} />
                </button>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-stone-400" />
                <span className="text-xs text-stone-500 truncate">{attraction.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-[#1b3022]">{attraction.rating}</span>
                <span className="text-[10px] text-stone-400">({attraction.reviews})</span>
              </div>
              <span className="text-xs font-bold text-[#1b3022]">{attraction.priceRange}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="relative group bg-white rounded-[40px] overflow-hidden shadow-2xl border border-stone-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Imagen grande */}
          <div className="relative h-64 md:h-full min-h-[400px]">
            <Image
              src={attraction.image}
              alt={attraction.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
            
            {/* Badge de tipo */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{typeIcons[attraction.type]}</span>
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full">
                  <span className="text-xs font-black uppercase tracking-widest">
                    {typeLabels[attraction.type]}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de favorito */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart 
                size={24} 
                className={isFavorite ? 'text-red-500 fill-red-500' : 'text-stone-600'} 
              />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#1b3022] tracking-tighter mb-3">
                  {attraction.name}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-[#1b3022]">{attraction.rating}</span>
                    <span className="text-stone-400 text-sm">({attraction.reviews} reseñas)</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500">
                    <MapPin size={14} />
                    <span className="text-sm">{attraction.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-stone-600 font-serif italic leading-relaxed line-clamp-3">
                {attraction.description}
              </p>

              {/* Características */}
              <div className="flex flex-wrap gap-2">
                {attraction.features.slice(0, 4).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#d4e9c7]/30 text-[#1b3022] text-xs font-bold rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4 mt-8 pt-8 border-t border-stone-200">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Clock size={16} className="text-stone-400" />
                <span>{attraction.openingHours}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <span className="font-bold">{attraction.priceRange}</span>
                <span>Rango de precios</span>
              </div>
              {attraction.accessibility && (
                <div className="flex items-center gap-3 text-sm text-emerald-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  <span>Accesible</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-[#1b3022] text-white py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#102015] transition-colors flex items-center justify-center gap-2">
                  <Navigation size={16} />
                  Cómo llegar
                </button>
                <button className="px-6 py-4 bg-[#d4e9c7] text-[#1b3022] rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#c5da9e] transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variante default
  return (
    <div className="relative group bg-white rounded-[36px] border border-stone-100 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-[#d4e9c7]">
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={attraction.image}
          alt={attraction.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge de tipo */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[attraction.type]}</span>
            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              {typeLabels[attraction.type]}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/60 text-stone-600 hover:bg-white'
            }`}
          >
            <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
          </button>
          <button className="w-9 h-9 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-stone-600 hover:bg-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-bold">{attraction.rating}</span>
          </div>
          <span className="text-white/80 text-xs bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-full">
            {attraction.reviews} reseñas
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#1b3022] group-hover:text-[#516349] transition-colors">
            {attraction.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-stone-500">
            <MapPin size={12} />
            <span className="text-xs truncate">{attraction.location}</span>
          </div>
        </div>

        <p className="text-sm text-stone-500 italic font-serif line-clamp-2 leading-relaxed">
          {attraction.description}
        </p>

        {/* Características principales */}
        <div className="flex flex-wrap gap-1.5">
          {attraction.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Información de horario y precio */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Clock size={12} />
            <span className="truncate max-w-[120px]">{attraction.openingHours}</span>
          </div>
          <span className="text-sm font-bold text-[#1b3022]">{attraction.priceRange}</span>
        </div>

        {/* Botón de más información */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 rounded-2xl text-[#1b3022] font-bold text-xs uppercase tracking-widest hover:bg-[#d4e9c7] transition-colors"
        >
          <span>Más información</span>
          <ChevronRight size={16} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        {/* Detalles expandibles */}
        {showDetails && (
          <div className="space-y-3 pt-2 animate-in slide-in-from-top-2">
            {attraction.phone && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Phone size={14} />
                <span>{attraction.phone}</span>
              </div>
            )}
            {attraction.website && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Globe size={14} />
                <span className="truncate">{attraction.website}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Calendar size={14} />
              <span>Mejor época: {attraction.bestTimeToVisit}</span>
            </div>
            {attraction.accessibility && (
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                <span>Accesible para sillas de ruedas</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Datos de ejemplo
export const sampleAttractions: AttractionData[] = [
  {
    id: '1',
    name: 'Cascada de Texolo',
    type: 'cascada',
    description: 'Impresionante cascada de 40 metros de altura rodeada de bosque de niebla. Perfecta para fotografía y conexión con la naturaleza.',
    location: 'Zongolica, Veracruz',
    address: 'Carretera Federal Zongolica - Huiloapan Km 5',
    coordinates: { lat: 18.6234, lng: -96.8567 },
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
    gallery: [],
    rating: 4.8,
    reviews: 234,
    priceRange: '$',
    openingHours: 'Lun - Dom: 8:00 AM - 6:00 PM',
    phone: '+52 271 123 4567',
    features: ['Senderismo', 'Fotografía', 'Naturaleza'],
    bestTimeToVisit: 'Temporada de lluvias (junio-septiembre)',
    accessibility: false
  },
  {
    id: '2',
    name: 'Mercado Artesanal de Ixtac',
    type: 'mercado',
    description: 'Centro de artesanías locales donde podrás encontrar textiles, cerámica, miel y productos típicos de la región.',
    location: 'Ixtaczoquitlán Centro',
    address: 'Calle Principal #123, Centro',
    coordinates: { lat: 18.6533, lng: -96.8267 },
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    gallery: [],
    rating: 4.6,
    reviews: 189,
    priceRange: '$$',
    openingHours: 'Mar - Dom: 9:00 AM - 7:00 PM',
    phone: '+52 271 987 6543',
    features: ['Artesanías', 'Comida local', 'Estacionamiento'],
    bestTimeToVisit: 'Fines de semana',
    accessibility: true
  },
  {
    id: '3',
    name: 'Mirador del Café',
    type: 'mirador',
    description: 'Vista panorámica de 360° del valle de Ixtaczoquitlán y las montañas circundantes. Ideal para amaneceres y atardeceres.',
    location: 'Cuautlapan, Veracruz',
    address: 'Cerro del Vigía, Cuautlapan',
    coordinates: { lat: 18.6789, lng: -96.8123 },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    gallery: [],
    rating: 4.9,
    reviews: 312,
    priceRange: '$',
    openingHours: 'Todos los días: 6:00 AM - 7:00 PM',
    features: ['Vista panorámica', 'Cafetería', 'Sendero'],
    bestTimeToVisit: 'Amanecer o atardecer',
    accessibility: false
  },
  {
    id: '4',
    name: 'Restaurante La Abuela',
    type: 'restaurante',
    description: 'Auténtica cocina veracruzana con recetas tradicionales transmitidas por generaciones. Especialidad en mole y platillos con hoja santa.',
    location: 'Ixtaczoquitlán Centro',
    address: 'Av. Revolución #45, Centro',
    coordinates: { lat: 18.6545, lng: -96.8278 },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    gallery: [],
    rating: 4.7,
    reviews: 456,
    priceRange: '$$',
    openingHours: 'Mié - Lun: 1:00 PM - 9:00 PM',
    phone: '+52 271 555 0123',
    website: 'www.restaurantelaabuela.mx',
    features: ['Comida tradicional', 'Terraza', 'Reservas recomendadas'],
    bestTimeToVisit: 'Comida (1-3 PM)',
    accessibility: true
  }
];