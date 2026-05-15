"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Layout from '../../src/components/page-layaout';
import { AnimatedTabs } from "../../src/components/ui/animated-tabs";
import { TextEffect } from "../../src/components/core/text-effect";
import { ServiceCard, sampleServices, type ServiceData } from '../../src/components/shared/ServiceCard';
import { UserProfile, sampleUsers, type UserProfileData } from '../../src/components/shared/UserProfile';
import { SearchBar, type SearchFilters } from '../../src/components/shared/SearchBar';
import { 
  ShoppingBag, 
  User, 
  Plus, 
  ChevronRight,
  Filter,
  Star,
  TrendingUp,
  Award,
  Clock,
  Calendar as CalendarIcon
} from 'lucide-react';

const TABS = ["Todos", "Aventura", "Marketplace", "Sabores", "Chatbot", "Login"];

export default function MarketplacePage() {
  const [services, setServices] = useState<ServiceData[]>(sampleServices);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);
  const [currentUser] = useState<UserProfileData>(sampleUsers[0]);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookService = (serviceId: string) => {
    console.log('Booking service:', serviceId);
    alert('¡Solicitud de reserva enviada! El proveedor te contactará pronto.');
  };

  const handleToggleFavorite = (serviceId: string) => {
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSaveUserProfile = (updatedUser: UserProfileData) => {
    console.log('User profile updated:', updatedUser);
    // Aquí iría la lógica para guardar en backend
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchQuery(filters.query);
    // Aquí iría la lógica de filtrado real
    console.log('Searching with filters:', filters);
  };

  const filteredServices = services.filter(service => {
    if (activeFilter !== 'todos' && service.category !== activeFilter) return false;
    if (searchQuery && !service.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [
    { id: 'todos', label: 'Todos', icon: '🗺️' },
    { id: 'talleres', label: 'Talleres', icon: '👨‍🎨' },
    { id: 'tours', label: 'Tours', icon: '🥾' },
    { id: 'artesanias', label: 'Artesanías', icon: '🎨' },
    { id: 'gastronomia', label: 'Gastronomía', icon: '🍽️' },
    { id: 'alojamiento', label: 'Alojamiento', icon: '🏠' }
  ];

  return (
    <Layout>
      {/* 1. FONDO ETEREO */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
        <Image 
          src="/fondo-3.jpg" 
          alt="Mist Background" 
          fill 
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[#f8faf8] dark:bg-stone-950/90 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-[#f8faf8]" />
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-6 z-50 flex justify-center px-4">
        <div className="bg-black/20 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl inline-block">
          <AnimatedTabs tabs={TABS} />
        </div>
        <button 
          onClick={() => setSelectedUser(currentUser)}
          className="ml-4 p-2 text-white/70 hover:text-white transition-colors"
        >
          <User size={18} />
        </button>
        <button className="ml-2 p-2 bg-[#d4e9c7] text-black rounded-full hover:scale-110 transition-transform">
          <ShoppingBag size={18} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        
        {/* HERO SECTION - Servicios Turísticos */}
        <section className="pt-20 pb-12">
          <div className="relative rounded-[50px] overflow-hidden min-h-[450px] flex items-center px-12 border border-black/5 shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200" 
              alt="Servicios Turísticos" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1b3022]/90 to-transparent" />
            
            <div className="relative z-10 max-w-xl space-y-6">
              <span className="bg-[#d4e9c7] text-[#1b3022] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                Servicios Locales
              </span>
              <TextEffect per='char' as='h1' preset='slide' className="text-6xl font-bold text-white tracking-tighter">
                Marketplace Ixtac
              </TextEffect>
              <p className="text-white/80 text-lg font-serif italic">
                Conecta con artesanos, guías locales y proveedores de servicios turísticos. 
                Reserva experiencias auténticas y apoya la economía local.
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Star size={18} className="text-[#d4e9c7]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Servicios</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Award size={18} className="text-[#d4e9c7]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">85</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Proveedores</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BARRA DE BÚSQUEDA */}
        <section className="py-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Buscar servicios, talleres, tours..."
            showFilters={true}
          />
        </section>

        {/* FILTROS DE CATEGORÍA */}
        <section className="py-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <div className="flex items-center gap-2 text-stone-400 flex-shrink-0">
              <Filter size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Categorías:</span>
            </div>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === category.id
                    ? 'bg-[#1b3022] text-white shadow-lg shadow-[#1b3022]/20'
                    : 'bg-white/40 text-stone-600 hover:bg-white hover:shadow-md border border-stone-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* LISTADO DE SERVICIOS */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#d4e9c7] font-black text-[10px] uppercase tracking-[0.3em]">
                Experiencias Únicas
              </span>
              <h2 className="text-4xl font-bold text-[#1b3022] tracking-tighter mt-2">
                Servicios Destacados
              </h2>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <TrendingUp size={16} />
              <span className="text-sm font-bold">{filteredServices.length} servicios disponibles</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
                onFavorite={handleToggleFavorite}
                isFavorite={favorites.includes(service.id)}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1b3022] mb-2">No se encontraron servicios</h3>
              <p className="text-stone-500 italic">Intenta con otros términos de búsqueda o filtros</p>
            </div>
          )}
        </section>

        {/* SECCIÓN DE PROVEEDORES DESTACADOS */}
        <section className="py-20">
          <div className="text-center mb-16">
            <span className="text-[#d4e9c7] font-black text-[10px] uppercase tracking-[0.3em]">
              Nuestros Aliados
            </span>
            <h2 className="text-4xl font-bold text-[#1b3022] tracking-tighter mt-2">
              Proveedores Verificados
            </h2>
            <p className="text-stone-500 italic mt-4 max-w-2xl mx-auto">
              Todos nuestros proveedores han pasado por un proceso de verificación para garantizar 
              la calidad y autenticidad de sus servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleUsers.slice(0, 3).map((user) => (
              <div 
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg p-6 cursor-pointer hover:shadow-xl hover:border-[#d4e9c7] transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4e9c7]">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1b3022] group-hover:text-[#516349] transition-colors">
                      {user.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-[#1b3022]">{user.rating}</span>
                      <span className="text-[10px] text-stone-400">({user.reviews})</span>
                    </div>
                  </div>
                  {user.verified && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-stone-500 italic line-clamp-2 mb-4">
                  {user.bio}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {user.specialties.slice(0, 3).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#d4e9c7]/30 text-[#1b3022] text-[10px] font-bold rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA - Publicar Servicio */}
        <section className="py-20">
          <div className="bg-[#1b3022] rounded-[60px] overflow-hidden flex flex-col md:flex-row items-center border border-white/10 shadow-2xl">
            <div className="w-full md:w-1/2 h-[400px] relative">
              <Image 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" 
                alt="Proveedor local" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 p-16 space-y-6">
              <span className="text-[#d4e9c7] font-black text-[10px] uppercase tracking-widest">
                ¿Eres proveedor local?
              </span>
              <h2 className="text-4xl font-bold text-white tracking-tighter">
                Únete a Nuestra Comunidad
              </h2>
              <p className="text-white/80 text-lg font-serif italic">
                Si eres artesano, guía, o proveedor de servicios turísticos, 
                únete a nuestro marketplace y conecta con viajeros de todo el mundo.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock size={16} />
                  <span className="text-sm">Proceso rápido</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Award size={16} />
                  <span className="text-sm">Sin comisiones ocultas</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Star size={16} />
                  <span className="text-sm">Soporte 24/7</span>
                </div>
              </div>
              <button className="group flex items-center gap-3 bg-[#d4e9c7] text-[#1b3022] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-colors mt-4">
                Publicar mi Servicio
                <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* PRÓXIMOS EVENTOS - Compact Calendar */}
        <section className="py-20">
          <div className="text-center mb-12">
            <span className="text-[#d4e9c7] font-black text-[10px] uppercase tracking-[0.3em]">
              No te lo pierdas
            </span>
            <h2 className="text-4xl font-bold text-[#1b3022] tracking-tighter mt-2">
              Próximos Eventos
            </h2>
          </div>
          
          {/* Aquí podríamos integrar el EventsCalendar en modo compact */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#1b3022] tracking-tighter">Eventos de Mayo</h3>
                <p className="text-sm text-stone-500 italic">Ferias, talleres y festivales locales</p>
              </div>
              <button className="px-6 py-3 bg-[#1b3022] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#102015] transition-colors flex items-center gap-2">
                <CalendarIcon size={14} />
                Ver calendario completo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Feria del Café y Cacao', date: '15 Mayo', type: 'Feria', icon: '🎪' },
                { title: 'Taller de Textiles Ancestrales', date: '18 Mayo', type: 'Taller', icon: '👨‍🎨' },
                { title: 'Festival de Jazz en el Bosque', date: '22 Mayo', type: 'Festival', icon: '🎉' },
                { title: 'Degustación de Mieles', date: '25 Mayo', type: 'Degustación', icon: '🍯' }
              ].map((event, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-stone-100 hover:border-[#d4e9c7] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 bg-[#1b3022] rounded-2xl flex items-center justify-center text-2xl">
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1b3022] group-hover:text-[#516349] transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-[#d4e9c7]/30 text-[#1b3022] font-bold px-2 py-0.5 rounded-full">
                        {event.type}
                      </span>
                      <span className="text-xs text-stone-400">{event.date}</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center group-hover:bg-[#d4e9c7] transition-colors">
                    <ChevronRight size={16} className="text-stone-600 group-hover:text-[#1b3022]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Perfil de Usuario */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative max-w-lg w-full">
            <UserProfile
              user={selectedUser}
              isEditable={selectedUser.id === currentUser.id}
              onSave={handleSaveUserProfile}
              onClose={() => setSelectedUser(null)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}