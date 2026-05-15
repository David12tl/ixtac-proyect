"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Calendar,
  User,
  ChevronRight,
  Share2,
  Bookmark
} from 'lucide-react';
import type { UserRole } from './UserProfile';
import { roleColors, roleLabels } from './UserProfile';

export interface ServiceData {
  id: string;
  title: string;
  category: 'artesanias' | 'talleres' | 'tours' | 'gastronomia' | 'alojamiento';
  providerId: string;
  providerName: string;
  providerRole: UserRole;
  providerAvatar: string;
  description: string;
  price: string;
  duration: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  availableDates: string[];
  badge?: string;
  verified?: boolean;
}

interface ServiceCardProps {
  service: ServiceData;
  onBook?: (serviceId: string) => void;
  onFavorite?: (serviceId: string) => void;
  isFavorite?: boolean;
}

const categoryIcons = {
  artesanias: '🎨',
  talleres: '👨‍🎨',
  tours: '🥾',
  gastronomia: '🍽️',
  alojamiento: '🏠'
};

const categoryLabels = {
  artesanias: 'Artesanías',
  talleres: 'Talleres',
  tours: 'Tours',
  gastronomia: 'Gastronomía',
  alojamiento: 'Alojamiento'
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  onFavorite,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleBookClick = () => {
    if (onBook) {
      onBook(service.id);
    }
    setShowCalendar(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(service.id);
    }
  };

  return (
    <div 
      className="relative group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="relative w-full h-[480px] bg-white rounded-[36px] border border-stone-100 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-[#d4e9c7]">
        
        {/* Shine & Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
        <div className="absolute -inset-4 bg-radial-gradient from-[#d4e9c7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="p-5 h-full flex flex-col">
          {/* Header: Badge + Favorito + Compartir */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            {/* Badge de Categoría */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryIcons[service.category]}</span>
              <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                {categoryLabels[service.category]}
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <button 
                onClick={handleFavoriteClick}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/60 text-stone-600 hover:bg-white'
                }`}
              >
                <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
              </button>
              <button className="w-9 h-9 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-stone-600 hover:bg-white transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-5 transition-transform duration-500 group-hover:scale-[1.02] shadow-inner bg-stone-50">
            <Image 
              src={service.image} 
              alt={service.title} 
              fill 
              className="object-cover"
            />
            
            {/* Overlay con información del proveedor */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/80">
                  <Image
                    src={service.providerAvatar}
                    alt={service.providerName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">{service.providerName}</p>
                  <div className={`inline-flex items-center gap-1 ${roleColors[service.providerRole]} rounded-full px-2 py-0.5`}>
                    <span className="text-[8px] font-black uppercase">
                      {roleLabels[service.providerRole]}
                    </span>
                  </div>
                </div>
                {service.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" className="text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información del servicio */}
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-bold text-[#1b3022] group-hover:text-[#516349] transition-colors line-clamp-1">
              {service.title}
            </h3>
            
            <p className="text-sm text-stone-500 italic font-serif line-clamp-2 leading-relaxed">
              {service.description}
            </p>

            {/* Ubicación y duración */}
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span className="truncate">{service.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{service.duration}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-[#1b3022] text-sm">{service.rating}</span>
              </div>
              <span className="text-stone-400 text-xs">({service.reviews} reseñas)</span>
            </div>
          </div>

          {/* Footer: Precio + Botón de reserva */}
          <div className="mt-auto pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xl font-black text-[#1b3022] group-hover:text-[#516349] transition-colors">
                  {service.price}
                </span>
                <span className="text-[10px] text-stone-400 ml-1">MXN</span>
              </div>
              
              <button
                onClick={handleBookClick}
                className="w-12 h-12 bg-[#1b3022] text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(27,48,34,0.3)] hover:bg-[#102015]"
              >
                <Calendar size={20} />
              </button>
            </div>

            {/* Fechas disponibles (se muestra al hacer hover) */}
            {showCalendar && (
              <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <p className="text-[10px] font-black uppercase text-stone-400 mb-3">Fechas disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {service.availableDates.slice(0, 6).map((date, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-2 bg-white rounded-xl text-xs font-bold text-[#1b3022] hover:bg-[#d4e9c7] transition-colors border border-stone-200"
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge flotante (aparece en hover) */}
      {service.badge && (
        <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[10px] font-black px-3 py-1 rounded-full opacity-0 transform scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20">
          {service.badge}
        </div>
      )}
    </div>
  );
};

// Datos de ejemplo
export const sampleServices: ServiceData[] = [
  {
    id: '1',
    title: 'Taller de Textiles Ancestrales',
    category: 'talleres',
    providerId: '1',
    providerName: 'Doña Elena Martínez',
    providerRole: 'artesano',
    providerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    description: 'Aprende las técnicas de bordado y telar de cintura que han pasado de generación en generación en mi familia.',
    price: '450',
    duration: '3 horas',
    location: 'Ixtaczoquitlán Centro',
    image: 'https://images.unsplash.com/photo-1590736910113-f633367909bb?w=500',
    rating: 4.9,
    reviews: 45,
    availableDates: ['15 May', '17 May', '22 May', '29 May', '5 Jun', '12 Jun'],
    badge: 'Popular',
    verified: true
  },
  {
    id: '2',
    title: 'Tour al Bosque de Niebla',
    category: 'tours',
    providerId: '2',
    providerName: 'Carlos Hernández',
    providerRole: 'guia',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    description: 'Descubre la biodiversidad del bosque de niebla con un guía certificado. Avistamiento de aves y fotografía.',
    price: '850',
    duration: '6 horas',
    location: 'Zongolica',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    rating: 4.8,
    reviews: 32,
    availableDates: ['16 May', '18 May', '23 May', '30 May', '6 Jun', '13 Jun'],
    verified: true
  },
  {
    id: '3',
    title: 'Miel de Azahar Orgánica',
    category: 'artesanias',
    providerId: '4',
    providerName: 'Apiarios Ixtac',
    providerRole: 'artesano',
    providerAvatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    description: 'Miel pura de naranjales locales, cosechada de manera sustentable. Incluye degustación.',
    price: '120',
    duration: 'Compra inmediata',
    location: 'Ixtac',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
    rating: 4.7,
    reviews: 89,
    availableDates: ['Disponible siempre'],
    badge: 'Orgánico'
  },
  {
    id: '4',
    title: 'Cena Tradicional Veracruzana',
    category: 'gastronomia',
    providerId: '5',
    providerName: 'Casa de Doña María',
    providerRole: 'artesano',
    providerAvatar: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400',
    description: 'Disfruta de una cena completa con platillos típicos preparados con recetas ancestrales.',
    price: '380',
    duration: '2.5 horas',
    location: 'Cuautlapan',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
    rating: 4.9,
    reviews: 67,
    availableDates: ['15 May', '16 May', '22 May', '23 May', '29 May', '30 May'],
    verified: true
  }
];