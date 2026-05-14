"use client";

import React from 'react';
import Image from 'next/image';
import Layout from '../../src/components/page-layaout';
import { AnimatedTabs } from "../../src/components/ui/animated-tabs";
import { TextEffect } from "../../src/components/core/text-effect";
import { 
  UtensilsCrossed, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  Flame, 
  Leaf,
  Clock
} from 'lucide-react';

const TABS = ["Todos", "Aventura", "Marketplace", "Sabores", "Chatbot", "Inicio de sesión"];

const DISHES = [
  {
    id: 1,
    title: "Mole de la Región",
    category: "Herencia",
    price: "$280",
    description: "Sinfonía de 30 especias, chiles secos y cacao local procesado a mano.",
    image: "https://images.unsplash.com/photo-1591389003292-753d07282b81?w=500",
    time: "45 min"
  },
  {
    id: 2,
    title: "Picaditas Tradicionales",
    category: "Maíz Vivo",
    price: "$145",
    description: "Maíz nixtamalizado pellizcado a mano con salsas de molcajete y queso fresco.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
    time: "20 min"
  },
  {
    id: 3,
    title: "Tamales de Hoja Santa",
    category: "Aromas",
    price: "$160",
    description: "Suaves envoltorios que resguardan el aroma del maíz y rellenos de temporada.",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=500",
    time: "30 min"
  },
  {
    id: 4,
    title: "Café de Altura",
    category: "Finca",
    price: "$85",
    description: "Cultivado a 1,200 msnm con notas de chocolate, vainilla y frutos rojos.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
    time: "10 min"
  }
];

export default function SaboresPage() {
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
              
                 <nav className="sticky top-6 z-50 flex justify-center px-4">
                      <div className="bg-black/20 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl inline-block">
                          <AnimatedTabs tabs={TABS} />
                      </div>
                  </nav>
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                          <User size={18} />
                      </button>
                      <button className="p-2 bg-[#d4e9c7] text-black rounded-full hover:scale-110 transition-transform">
                          <ShoppingBag size={18} />
                      </button>
                  
            </nav>

      <main className="max-w-7xl mx-auto px-8">
        
        {/* HERO CULINARIO */}
        <section className="pt-20 pb-12">
            <div className="relative rounded-[60px] overflow-hidden min-h-[500px] flex items-center px-12 border border-black/5 shadow-2xl">
                <Image 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" 
                    alt="Gastronomía de Origen" 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                
                <div className="relative z-10 max-w-2xl space-y-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        <Flame size={12} className="animate-bounce" /> Experiencia Sensorial
                    </div>
                    <TextEffect per='char' as='h1' preset='slide' className="text-7xl font-bold text-white tracking-tighter leading-[0.9]">
                        Sabores del Valle de Niebla
                    </TextEffect>
                    <p className="text-white/70 text-xl font-serif italic max-w-lg leading-relaxed">
                        Descubre la riqueza culinaria de Veracruz a través de ingredientes ancestrales y técnicas de la montaña.
                    </p>
                </div>
            </div>
        </section>

        {/* CATÁLOGO DE PLATILLOS CON GLASS CARDS */}
        <section className="py-24">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Herencia Viva</span>
              <h2 className="text-5xl font-bold text-[#1b3022] tracking-tighter">Platillos del Ecosistema</h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-stone-200 pb-2 hover:border-emerald-500 transition-colors">Ver menú completo</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DISHES.map((dish) => (
              <div key={dish.id} className="group relative">
                {/* GLASS CARD UIVERSE STYLE */}
                <div className="relative h-[450px] bg-white rounded-[40px] border border-stone-100 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] group">
                  
                  {/* Effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                  
                  <div className="p-4 h-full flex flex-col">
                    {/* Badge Categoría */}
                    <div className="absolute top-8 left-8 z-20">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {dish.category}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full h-64 rounded-[32px] overflow-hidden transition-transform duration-700 group-hover:scale-105">
                        <Image 
                            src={dish.image} 
                            alt={dish.title} 
                            fill 
                            className="object-cover"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="px-4 py-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-[#1b3022] tracking-tight">{dish.title}</h3>
                          <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold">
                            <Clock size={12} /> {dish.time}
                          </div>
                        </div>
                        <p className="text-sm text-stone-500 italic font-serif leading-relaxed line-clamp-2">
                            {dish.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto px-4 pb-4 flex justify-between items-center">
                        <span className="text-2xl font-black text-[#1b3022]">{dish.price}</span>
                        <button className="w-12 h-12 bg-[#1b3022] text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:rotate-12">
                            <UtensilsCrossed size={20} />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CULINARY EXPERIENCE (Inmersión) */}
        <section className="py-20">
          <div className="bg-[#f2f4f2] rounded-[80px] p-16 flex flex-col lg:flex-row items-center gap-20 border border-black/5 shadow-inner">
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Inmersión Gastronómica</span>
                <h2 className="text-6xl font-bold text-[#1b3022] tracking-tighter leading-none">Vive la Cocina de Origen</h2>
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
                    <p className="text-stone-500 text-sm italic">Descubre el anisillo de la cocina y las enredaderas silvestres que transforman caldos en manjares.</p>
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
                <span className="text-[10px] text-white/40 uppercase tracking-widest">© 2024 Veracruz, México</span>
            </div>
        </div>
      </footer>
    </Layout>
  );
}