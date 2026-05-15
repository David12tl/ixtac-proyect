"use client";

import React from 'react';
import Image from 'next/image';
import Layout from '../../src/components/page-layaout'; 
import { AnimatedTabs } from "../../src/components/ui/animated-tabs";
import { TextEffect } from "../../src/components/core/text-effect";
import { InView } from '../../src/components/core/in-view'; // Asegúrate de que esta ruta sea correcta
import { motion } from 'framer-motion'; // Usamos framer-motion (estándar para motion/react)
import { 
  Leaf, 
  Gavel, 
  Cloud, 
  CheckCircle2, 
  XCircle, 
  Droplets, 
  Trees, 
  ArrowRight,
  Search,
  Users,
  MapPin
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to avoid Leaflet SSR issues
const GeolocationMap = dynamic(
  () => import('../../src/components/GeolocationMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
        <div className="text-white/70 animate-pulse">Cargando mapa...</div>
      </div>
    )
  }
);

const TABS = ["Todos", "Aventura", "Marketplace", "Sabores", "Chatbot", "Inicio de sesión"];

const GALLERY_IMAGES = [
  'https://images.beta.cosmos.so/e5ebb6f8-8202-40ec-bc70-976f81153501?format=jpeg',
  'https://images.beta.cosmos.so/1b6f1bee-1b4c-4035-9e93-c93ef4d445e1?format=jpeg',
  'https://images.beta.cosmos.so/9968a6cf-d7f6-4ec9-a56d-ac4eef3f8689?format=jpeg',
  'https://images.beta.cosmos.so/4b88a39c-c657-4911-b843-b473237e83b5?format=jpeg',
  'https://images.beta.cosmos.so/86af92c0-064d-4801-b7ed-232535b03328?format=jpeg',
  'https://images.beta.cosmos.so/399e2a4a-e118-4aaf-9c7e-155ed18f6556?format=jpeg',
  'https://images.beta.cosmos.so/6ff16bc9-dc94-4549-a057-673a603ce203?format=jpeg',
  'https://images.beta.cosmos.so/d67c3185-4480-4408-8f9d-1cbf541e5d91?format=jpeg',
  'https://images.beta.cosmos.so/a7b19274-3370-4080-b734-e8ac268d8c8e.?format=jpeg',
  'https://images.beta.cosmos.so/551daf0d-77e8-472c-9324-468fed15a0ba?format=jpeg',
];

export default function AventuraPage() {
  return (
    <Layout>
      {/* FONDO GLOBAL */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none">
        <Image src="/fondo-2.jpg" alt="Background" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f8faf8]" />
      </div>

      {/* NAVBAR CON ANIMATED TABS */}
      <nav className="sticky top-6 z-50 flex justify-center px-4">
        <div className="bg-black/20 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl inline-block">
            <AnimatedTabs tabs={TABS} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8">
        {/* HERO SECTION */}
        <section className="py-24 flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2 space-y-8">
            <span className="text-[10px] font-black text-[#d4e9c7] uppercase tracking-[0.3em] bg-white/5 border border-white/10 px-4 py-2 rounded-full">Nuestro Compromiso</span>
            <TextEffect per='char' as='h1' preset='slide' className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
              Cultura Sostenible & Eco-Educación
            </TextEffect>
            <p className="text-xl text-white/70 font-serif italic max-w-xl leading-relaxed">
              En el corazón de las montañas de Veracruz, el bosque de niebla susurra secretos de resiliencia.
            </p>
          </div>
          <div className="w-full md:w-1/2 relative">
             <div className="rounded-[40px] overflow-hidden border border-white/10 transform rotate-2">
              <Image src="/fondo-2.jpg" alt="Cloud Forest" width={800} height={500} className="w-full h-[500px] object-cover" />
            </div>
          </div>
        </section>

        {/* MÓDULOS EDUCATIVOS */}
        <section className="py-24">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6">Conocimiento para el Viaje</h2>
            <p className="text-white/60 text-lg font-serif italic">Profundiza tu conexión con la montaña.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
              <div className="w-16 h-16 bg-[#d0e9d4] rounded-2xl flex items-center justify-center mb-8"><Leaf className="text-[#1b3022]" /></div>
              <h3 className="text-2xl font-bold text-white mb-4">Turismo Responsable</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">Acciones simples que aseguran que tu visita beneficie tanto al entorno como a la comunidad local.</p>
              <ul className="space-y-4 text-xs font-bold text-[#d4e9c7] uppercase tracking-wider"><li className="flex items-center gap-3"><CheckCircle2 size={16}/> Residuo Cero</li></ul>
            </div>
            {/* ... Otros módulos se mantienen igual ... */}
          </div>

          {/* EFECTO INVIEW IMAGES GRID */}
          <div className='w-full py-20'>
            <div className='mb-12 text-center'>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Desliza para descubrir</span>
            </div>
            
            <InView
              viewOptions={{ once: true, margin: '0px 0px -250px 0px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              <div className='columns-2 gap-4 px-4 sm:columns-3 lg:columns-4'>
                {GALLERY_IMAGES.map((imgSrc, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
                      visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                    }}
                    className='mb-4 relative group'
                  >
                    <img
                      src={imgSrc}
                      alt={`Ixtac Nature ${index}`}
                      className='w-full rounded-3xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]'
                    />
                  </motion.div>
                ))}
              </div>
            </InView>
          </div>
        </section>

        {/* BENTO GRID FLORA & FAUNA */}
        <section className="py-24">
            <h2 className="text-5xl font-bold text-white tracking-tighter mb-16 text-center">Guardianes de la Bruma</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                <div className="md:col-span-2 md:row-span-2 relative rounded-[40px] overflow-hidden group border border-white/10">
                    <Image src="https://images.unsplash.com/photo-1591824438708-ce405f36bd3d?w=800" alt="Quetzal" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                        <h4 className="text-3xl font-bold text-white mb-2">El Quetzal Resplandeciente</h4>
                    </div>
                </div>
                {/* ... resto del bento se mantiene igual ... */}
            </div>
        </section>

        {/* GEOLOCALIZACIÓN */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MapPin className="text-[#d4e9c7]" size={28} />
                <span className="text-[10px] font-black text-[#d4e9c7] uppercase tracking-[0.3em] bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  Tu Ubicación
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6">
                Explora la Región
              </h2>
              <p className="text-white/60 text-lg font-serif italic">
                Descubre tu posición en el corazón del bosque de niebla de Ixtaczoquitlán.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-[40px] border border-white/10 shadow-2xl">
              <GeolocationMap 
                center={[18.6533, -96.8267]}
                zoom={14}
                className="h-[500px] w-full rounded-3xl"
                onLocationFound={(lat, lng) => {
                  console.log(`Ubicación encontrada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                }}
              />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-white/40 text-sm">
                El mapa se centrará automáticamente en tu ubicación cuando otorgues permisos de geolocalización.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-3xl p-16 rounded-[60px] border border-white/10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8">¿Listo para caminar con propósito?</h2>
            <button className="bg-[#d4e9c7] text-[#1b3022] px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                Reservar Eco-Tour
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-black/40 backdrop-blur-md w-full rounded-t-[60px] mt-24 border-t border-white/10">
        <div className="px-12 py-20 max-w-7xl mx-auto text-center">
            <div className="text-xl font-black text-white tracking-tighter mb-4">Ixtaczoquitlán <span className="text-[#d4e9c7]">Eco-Adventurer</span></div>
            <p className="text-white/30 text-xs font-serif italic">© 2026 Preservando la bruma.</p>
        </div>
      </footer>
    </Layout>
  );
}