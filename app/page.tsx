"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../src/components/page-layaout'; 
import Image from 'next/image';
import { MapPin, ArrowRight, MousePointer2 } from 'lucide-react';
import { AnimatedTabs } from "../src/components/ui/animated-tabs";
import PhotoCarousel from "../src/components/ui/photo-carousel";
import { TextEffect } from "../src/components/core/text-effect";

// Importación dinámica del mapa para evitar errores de hidratación
const MapWrapper = dynamic(() => import('../src/components/ui/map-wrapper'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-[40px]" />
});

const TABS = ["Todos", "Aventura", "Relajación", "Senderismo", "Cultura"];

// Componente de Card con Efecto Hover Pro
const AttractionCard = ({ title, tag, img, desc }: { title: string, tag: string, img: string, desc: string }) => (
  <div className="group relative h-[450px] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
    <Image src={img} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
    
    {/* Overlay gradiente que aparece en hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4e9c7] mb-2">{tag}</span>
      <h3 className="text-3xl font-bold text-white mb-3 tracking-tighter">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
        {desc}
      </p>
      <button className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group/btn">
        Explorar ahora <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
      </button>
    </div>
  </div>
);

export default function Home() {
  return (
    <Layout>
      {/* 1. FONDO GLOBAL (FIJO) */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
        <Image 
          src="/fondo-ixtaczoquitlan.jpg" 
          alt="Background" 
          fill 
          priority
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f8faf8]" />
      </div>

      {/* 2. CONTENIDO SCROLLABLE */}
      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.4em] uppercase text-white bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-4">
              <MapPin size={12} className="text-[#d4e9c7]" /> Veracruz • México
            </span>
            
            <TextEffect 
              per='char' 
              as='h1' 
              preset='slide' 
              className="text-6xl md:text-[150px] font-extrabold text-white tracking-tighter leading-[0.8] drop-shadow-2xl"
            >
              Ixtaczoquitlán
            </TextEffect>

            <div className="max-w-2xl mx-auto">
              <TextEffect 
                per='word' 
                as='p' 
                preset='blur' 
                delay={0.5}
                className="text-xl md:text-3xl text-white/90 font-serif italic drop-shadow-md"
              >
                Donde las nubes descansan y la aventura comienza.
              </TextEffect>
            </div>
            
            <div className="pt-12">
              <div className="bg-black/20 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl inline-block">
                <AnimatedTabs tabs={TABS} />
              </div>
            </div>
          </div>

          {/* Mouse Scroll Decorator */}
          <div className="absolute bottom-10 flex flex-col items-center gap-3 opacity-50">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-white font-bold">Scroll para explorar</span>
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-6 space-y-40 pb-40">
          
          {/* SECCIÓN CARDS (Aventura) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AttractionCard 
              title="Mirador del Valle"
              tag="Aventura"
              img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
              desc="Una vista panorámica que corta el aliento, donde el verde de la montaña se une con el cielo."
            />
            <AttractionCard 
              title="Cascadas de Sifón"
              tag="Naturaleza"
              img="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
              desc="Siente la fuerza del agua pura descendiendo por las rocas milenarias del valle."
            />
          </section>

          {/* SECCIÓN PHOTO CAROUSEL */}
          <section>
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="space-y-4 text-white">
                  <h2 className="text-5xl font-bold tracking-tighter">Momentos Eco</h2>
                  <div className="w-20 h-1 bg-[#d4e9c7] rounded-full"></div>
                </div>
                <p className="max-w-md text-white/60 text-lg font-serif italic">
                  Capturas reales de exploradores que han vivido la magia de Ixtaczoquitlán.
                </p>
             </div>
             
             <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[60px] border border-white/10 shadow-inner">
                <PhotoCarousel />
             </div>
          </section>

          {/* SECCIÓN MAPA */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
             <div className="lg:col-span-4 space-y-8 text-white">
                <h2 className="text-5xl font-bold tracking-tighter">Ubica tu ruta</h2>
                <p className="text-lg text-white/70 leading-relaxed font-serif italic">
                  No pierdas el rumbo. Encuentra cada punto de interés, desde cafeterías locales hasta entradas a senderos.
                </p>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#d4e9c7] rounded-full flex items-center justify-center text-[#1b3022]">
                         <MousePointer2 size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Interactividad</p>
                        <p className="font-bold text-sm">Haz clic en los marcadores</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:col-span-8 rounded-[50px] overflow-hidden shadow-2xl border-[12px] border-white/10 backdrop-blur-sm">
                <MapWrapper />
             </div>
          </section>

          {/* FOOTER CTA */}
          <section className="text-center py-20 bg-white/5 backdrop-blur-3xl rounded-[60px] border border-white/10">
             <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-8">¿Listo para el viaje?</h2>
             <button className="bg-[#d4e9c7] text-[#1b3022] px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-xl">
                Empezar aventura
             </button>
          </section>

        </main>
      </div>
    </Layout>
  );
}