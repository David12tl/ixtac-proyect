"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '../../src/components/page-layaout';
import { AnimatedTabs } from "../../src/components/ui/animated-tabs";
import { TextEffect } from "../../src/components/core/text-effect";
import { AttractionCard, sampleAttractions, type AttractionData } from '../../src/components/shared/AttractionCard';
import { SearchBar, type SearchFilters, type AttractionType } from '../../src/components/shared/SearchBar';
import { EventsCalendar, sampleEvents, type EventData } from '../../src/components/shared/EventsCalendar';
import { 
  UtensilsCrossed, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  Flame, 
  Leaf,
  Clock,
  MapPin,
  Star,
  Heart,
  ChevronRight,
  Calendar as CalendarIcon,
  Navigation
} from 'lucide-react';

const TABS = ["Todos", "Aventura", "Marketplace", "Sabores", "Chatbot", "Inicio de sesión"];

export default function SaboresPage() {
  const [attractions, setAttractions] = useState<AttractionData[]>(sampleAttractions);
  const [events] = useState<EventData[]>(sampleEvents);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Aquí iría la lógica de filtrado real
    console.log('Searching attractions with filters:', filters);
  };

  const handleToggleFavorite = (attractionId: string) => {
    setFavorites(prev => 
      prev.includes(attractionId) 
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    );
  };

  const handleBookEvent = (eventId: string) => {
    console.log('Booking event:', eventId);
    alert('¡Reserva iniciada! Te redirigiremos al proceso de pago.');
  };

  const filteredAttractions = attractions.filter(attraction => {
    if (!searchFilters) return true;
    const { query, type, location, priceRange, sortBy } = searchFilters;
    
    // Filtro por búsqueda de texto
    if (query && !attraction.name.toLowerCase().includes(query.toLowerCase()) &&
        !attraction.description.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    // Filtro por tipo
    if (type !== 'todos' && attraction.type !== type) {
      return false;
    }
    
    // Filtro por ubicación
    if (location !== 'Todos' && !attraction.location.includes(location)) {
      return false;
    }
    
    // Filtro por rango de precios (mapeo de filtros a símbolos)
    const priceMap: Record<string, '$' | '$$' | '$$$'> = {
      economico: '$',
      medio: '$$',
      premium: '$$$'
    };
    if (priceRange !== 'todos' && attraction.priceRange !== priceMap[priceRange]) {
      return false;
    }
    
    return true;
  });

  // Ordenar resultados
  if (searchFilters?.sortBy) {
    filteredAttractions.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'precio_menor':
          return a.priceRange.length - b.priceRange.length;
        case 'precio_mayor':
          return b.priceRange.length - a.priceRange.length;
        default:
          return 0;
      }
    });
  }

  const attractionTypes = [
    { id: 'todos', label: 'Todos', icon: '🗺️' },
    { id: 'restaurante', label: 'Restaurantes', icon: '🍽️' },
    { id: 'sitio_historico', label: 'Sitios Históricos', icon: '🏛️' },
    { id: 'mirador', label: 'Miradores', icon: '🏔️' },
    { id: 'cascada', label: 'Cascadas', icon: '💧' },
    { id: 'mercado', label: 'Mercados', icon: '🛒' }
  ];

  return (
    <Layout>
      {/* 1. FONDO AMBIENTAL */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
        <Image 
          src="/fondo-ixtaczoquitlan.jpg" 
          alt="Mist Background" 
          fill 
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#f8faf8] dark:bg-stone-950/90 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-[#f8faf8]" />
      </div>

      {/* 2. NAV DE CÁPSULA REDISEÑADO */}
      <nav className="sticky top-6 z-50 flex justify-center px-4">
        <div className="bg-black/20 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl inline-block">
          <AnimatedTabs tabs={TABS} />
        </div>
        <button className="ml-4 p-2 text-white/70 hover:text-white transition-colors">
          <User size={18} />
        </button>
        <button className="ml-2 p-2 bg-[#d4e9c7] text-black rounded-full hover:scale-110 transition-transform">
          <ShoppingBag size={18} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        
        {/* HERO CULINARIO Y DE ATRACTIVOS */}
        <section className="pt-20 pb-12">
          <div className="relative rounded-[60px] overflow-hidden min-h-[500px] flex items-center px-12 border border-black/5 shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" 
              alt="Atractivos y Sabores" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            <div className="relative z-10 max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                <Flame size={12} className="animate-bounce" /> Descubre Ixtac
              </div>
              <TextEffect per='char' as='h1' preset='slide' className="text-6xl font-bold text-white tracking-tighter leading-[0.9]">
                Sabores y Lugares
              </TextEffect>
              <p className="text-white/70 text-xl font-serif italic max-w-lg leading-relaxed">
                Explora los atractivos turísticos, restaurantes y experiencias que hacen único a Ixtaczoquitlán. 
                Cada rincón tiene una historia que contar.
              </p>
              
              {/* Estadísticas */}
              <div className="flex gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <MapPin size={18} className="text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">25+</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Lugares</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <UtensilsCrossed size={18} className="text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">18</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Restaurantes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <CalendarIcon size={18} className="text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Eventos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BARRA DE BÚSQUEDA INTELIGENTE */}
        <section className="py-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Buscar restaurantes, miradores, cascadas..."
            showFilters={true}
          />
        </section>

        {/* FILTROS RÁPIDOS POR TIPO */}
        <section className="py-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <div className="flex items-center gap-2 text-stone-400 flex-shrink-0">
              <MapPin size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Tipos:</span>
            </div>
            {attractionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleSearch({
                  ...searchFilters,
                  type: type.id as AttractionType,
                  query: searchFilters?.query || '',
                  location: searchFilters?.location || 'Todos',
                  priceRange: searchFilters?.priceRange || 'todos',
                  sortBy: searchFilters?.sortBy || 'relevancia'
                })}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  searchFilters?.type === type.id
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/40 text-stone-600 hover:bg-white hover:shadow-md border border-stone-200'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </section>

        {/* LISTADO DE ATRACTIVOS TURÍSTICOS */}
        <section className="py-12">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                Explora la Región
              </span>
              <h2 className="text-5xl font-bold text-[#1b3022] tracking-tighter">
                Atractivos Turísticos
              </h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-stone-200 pb-2 hover:border-emerald-500 transition-colors flex items-center gap-2">
              Ver todos <ArrowRight size={12} />
            </button>
          </div>

          {/* Featured Attraction */}
          {filteredAttractions.length > 0 && (
            <div className="mb-12">
              <AttractionCard 
                attraction={filteredAttractions[0]} 
                variant="featured"
                onFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(filteredAttractions[0].id)}
              />
            </div>
          )}

          {/* Grid de atractivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAttractions.slice(1).map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                onFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(attraction.id)}
              />
            ))}
          </div>

          {filteredAttractions.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1b3022] mb-2">No se encontraron lugares</h3>
              <p className="text-stone-500 italic">Intenta con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </section>

        {/* CALENDARIO DE EVENTOS LOCALES */}
        <section className="py-20">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
              Agenda Cultural
            </span>
            <h2 className="text-5xl font-bold text-[#1b3022] tracking-tighter mt-2">
              Eventos Locales
            </h2>
            <p className="text-stone-500 italic mt-4 max-w-2xl mx-auto">
              Ferias, talleres, festivales y más. No te pierdas nada de lo que sucede en Ixtaczoquitlán.
            </p>
          </div>
          
          <EventsCalendar 
            events={events}
            onBookEvent={handleBookEvent}
          />
        </section>

        {/* CULINARY EXPERIENCE (Inmersión) */}
        <section className="py-20">
          <div className="bg-[#f2f4f2] rounded-[80px] p-16 flex flex-col lg:flex-row items-center gap-20 border border-black/5 shadow-inner">
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                  Inmersión Gastronómica
                </span>
                <h2 className="text-6xl font-bold text-[#1b3022] tracking-tighter leading-none">
                  Vive la Cocina de Origen
                </h2>
                <p className="text-xl text-stone-600 font-serif italic">
                  Aprende a escribir la historia de nuestra tierra con tus manos en talleres diseñados para el viajero consciente.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-6 p-8 bg-white/60 rounded-[40px] hover:bg-white transition-colors duration-500 cursor-default shadow-sm border border-black/5">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-[#1b3022]">Hoja Santa & Xonequi</h4>
                    <p className="text-stone-500 text-sm italic">
                      Descubre el anisillo de la cocina y las enredaderas silvestres que transforman caldos en manjares.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 bg-white/60 rounded-[40px] hover:bg-white transition-colors duration-500 cursor-default shadow-sm border border-black/5">
                  <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <UtensilsCrossed size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-[#1b3022]">Mole Ancestral</h4>
                    <p className="text-stone-500 text-sm italic">
                      Aprende a preparar el mole tradicional con más de 30 ingredientes, una receta que ha pasado de generación en generación.
                    </p>
                  </div>
                </div>
              </div>

              <button className="bg-[#1b3022] text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform flex items-center gap-4">
                Reservar Taller <ArrowRight size={16} />
              </button>
            </div>

            <div className="w-full lg:w-1/2 relative aspect-square">
              <div className="absolute inset-0 bg-emerald-200 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-pulse opacity-20" />
              <div className="relative w-full h-full rounded-[60px] overflow-hidden shadow-2xl border-8 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800" 
                  alt="Cooking Workshop" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RUTAS SUGERIDAS */}
        <section className="py-20">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
              Itinerarios
            </span>
            <h2 className="text-5xl font-bold text-[#1b3022] tracking-tighter mt-2">
              Rutas Sugeridas
            </h2>
            <p className="text-stone-500 italic mt-4 max-w-2xl mx-auto">
              Te ayudamos a planear tu visita con rutas temáticas diseñadas para aprovechar al máximo tu experiencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ruta del Café',
                duration: '1 día',
                stops: 4,
                description: 'Visita fincas cafetaleras, participa en cata de cafés y conoce el proceso desde el grano hasta la taza.',
                icon: '☕',
                color: 'bg-amber-100'
              },
              {
                title: 'Ruta de las Cascadas',
                duration: '2 días',
                stops: 3,
                description: 'Descubre las cascadas más impresionantes de la región, incluyendo Texolo y sus 40 metros de caída.',
                icon: '💧',
                color: 'bg-blue-100'
              },
              {
                title: 'Ruta Artesanal',
                duration: '1 día',
                stops: 5,
                description: 'Conoce a los maestros artesanos, participa en talleres y lleva contigo piezas únicas hechas a mano.',
                icon: '🎨',
                color: 'bg-emerald-100'
              }
            ].map((route, idx) => (
              <div 
                key={idx}
                className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg p-8 hover:shadow-xl hover:border-emerald-200 transition-all group cursor-pointer"
              >
                <div className={`w-16 h-16 ${route.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {route.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1b3022] mb-2">{route.title}</h3>
                <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{route.stops} paradas</span>
                  </div>
                </div>
                <p className="text-stone-600 italic mb-6 line-clamp-2">{route.description}</p>
                <button className="flex items-center gap-2 text-[#10b981] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                  Ver ruta <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER PREMIUM */}
      <footer className="bg-[#1b3022] text-white py-24 mt-20 rounded-t-[100px]">
        <div className="max-w-7xl mx-auto px-12 text-center space-y-12">
            <h2 className="text-5xl font-bold tracking-tighter">¿Listo para un viaje al paladar?</h2>
            <p className="text-white/60 max-w-xl mx-auto font-serif italic text-lg">
                Nuestras degustaciones son limitadas para garantizar una conexión auténtica con los productores locales.
            </p>
            <button className="bg-emerald-400 text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-colors shadow-2xl shadow-emerald-400/20">
              Solicitar Reservación
            </button>
            <div className="pt-20 flex justify-between items-center border-t border-white/10">
                <span className="font-black text-xl tracking-tighter">Ixtac Eco <span className="text-emerald-400">Sabores</span></span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">© 2026 Veracruz, México</span>
            </div>
        </div>
      </footer>
    </Layout>
  );
}