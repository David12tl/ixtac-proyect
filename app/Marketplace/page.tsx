"use client";

import React from 'react';
import Image from 'next/image';
import Layout from '../../src/components/page-layaout';
import { AnimatedTabs } from "../../src/components/ui/animated-tabs";
import { TextEffect } from "../../src/components/core/text-effect";
import { 
  ShoppingBag, 
  User, 
  Search, 
  Plus, 
  ChevronRight, 
  Filter,
  Heart
} from 'lucide-react';

const TABS = ["Todos", "Aventura", "Marketplace", "Senderismo", "Cultura"];

const PRODUCTS = [
  {
    id: 1,
    title: "Café de Altura",
    origin: "Cuautlapan",
    price: "$180",
    description: "Orgánico cultivado bajo sombra.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    badge: "Sustentable"
  },
  {
    id: 2,
    title: "Textiles de Lana",
    origin: "Zongolica",
    price: "$450",
    description: "Bordado a mano ancestral.",
    image: "https://images.unsplash.com/photo-1590736910113-f633367909bb?w=500",
    badge: "Artesanal"
  },
  {
    id: 3,
    title: "Miel de Azahar",
    origin: "Ixtac",
    price: "$120",
    description: "Pura de naranjales locales.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
    badge: "Pura"
  },
  {
    id: 4,
    title: "Máscara Cedro",
    origin: "Tuxpanguillo",
    price: "$350",
    description: "Madera tallada a mano.",
    image: "https://images.unsplash.com/photo-1524292332606-231283220793?w=500",
    badge: "Tradición"
  }
];

export default function MarketplacePage() {
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

      {/* 2. NAVIGATION BAR (Consistencia con Aventura) */}
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
        
        {/* HERO SECTION */}
        <section className="pt-20 pb-12">
            <div className="relative rounded-[50px] overflow-hidden min-h-[450px] flex items-center px-12 border border-black/5 shadow-2xl">
                <Image 
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200" 
                    alt="Coffee" 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1b3022]/90 to-transparent" />
                
                <div className="relative z-10 max-w-xl space-y-6">
                    <span className="bg-[#d4e9c7] text-[#1b3022] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        Comercio Justo
                    </span>
                    <TextEffect per='char' as='h1' preset='slide' className="text-6xl font-bold text-white tracking-tighter">
                        Tierras de Niebla
                    </TextEffect>
                    <p className="text-white/80 text-lg font-serif italic">
                        Apoyamos a los artesanos de Ixtaczoquitlán para preservar tradiciones ancestrales entre las nubes.
                    </p>
                </div>
            </div>
        </section>

        {/* MARKETPLACE CONTENT */}
        <section className="py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm">
                <div className="flex items-center gap-2 mb-8 text-[#1b3022]">
                    <Filter size={20} />
                    <h3 className="font-bold uppercase text-xs tracking-widest">Filtrar</h3>
                </div>
                
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-stone-400">Origen</label>
                        {['Cuautlapan', 'Zongolica', 'Tuxpanguillo'].map(loc => (
                            <label key={loc} className="flex items-center gap-3 group cursor-pointer">
                                <input type="checkbox" className="rounded-full border-stone-300 text-[#1b3022] focus:ring-0" />
                                <span className="text-sm text-stone-600 group-hover:text-black transition-colors">{loc}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
          </aside>

          {/* PRODUCT GRID - USANDO LAS CARDS DE UIVERSE */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="relative group perspective-1000">
                  {/* CARD CONTAINER CON ESTILOS UIVERSE ADAPTADOS */}
                  <div className="relative w-full h-[400px] bg-white rounded-[30px] border border-stone-100 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-[#d4e9c7]">
                    
                    {/* Shine & Glow Effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                    <div className="absolute -inset-4 bg-radial-gradient from-[#d4e9c7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    <div className="p-6 h-full flex flex-col">
                        {/* Badge */}
                        <div className="absolute top-4 right-4 bg-[#10b981] text-white text-[10px] font-black px-3 py-1 rounded-full opacity-0 transform scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20">
                            {product.badge}
                        </div>

                        {/* Image Area */}
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-[1.02] shadow-inner bg-stone-50">
                            <Image 
                                src={product.image} 
                                alt={product.title} 
                                fill 
                                className="object-cover"
                            />
                        </div>

                        {/* Text Area */}
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-[#1b3022] transition-colors group-hover:text-[#516349]">
                                {product.title}
                            </h3>
                            <p className="text-xs text-stone-400 font-medium uppercase tracking-tighter">
                                {product.origin}
                            </p>
                            <p className="text-sm text-stone-500 italic font-serif py-2">
                                {product.description}
                            </p>
                        </div>

                        {/* Footer Card */}
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-stone-50">
                            <span className="text-xl font-black text-[#1b3022] group-hover:text-[#516349] transition-colors">
                                {product.price} <span className="text-[10px] text-stone-400">MXN</span>
                            </span>
                            <button className="w-10 h-10 bg-[#1b3022] text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(27,48,34,0.3)] hover:bg-black">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED ARTISAN SECTION */}
        <section className="py-20">
            <div className="bg-[#1b3022] rounded-[60px] overflow-hidden flex flex-col md:flex-row items-center border border-white/10 shadow-2xl">
                <div className="w-full md:w-1/2 h-[500px] relative">
                    <Image 
                        src="https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800" 
                        alt="Doña Elena" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="w-full md:w-1/2 p-16 space-y-6">
                    <span className="text-[#d4e9c7] font-black text-[10px] uppercase tracking-widest">Maestros Artesanos</span>
                    <h2 className="text-5xl font-bold text-white tracking-tighter">Doña Elena</h2>
                    <p className="text-white/80 text-lg font-serif italic">
                        Con más de 40 años de experiencia, Doña Elena es una maestra artesana de Ixtaczoquitlán especializada en textiles bordados a mano, preservando técnicas ancestrales que han pasado de generación en generación.
                    </p>
                    <button className="group flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em] pt-4">
                        Leer su Historia <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
      </main>

    
    </Layout>
  );
}