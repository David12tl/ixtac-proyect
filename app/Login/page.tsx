"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../src/services/auth.service';
import { ArrowLeft, ShieldCheck, TreePine, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      router.push('/'); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión. Por favor intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f0] flex items-center justify-center p-6 font-sans selection:bg-emerald-200">
      
      <Link href="/">
        <motion.button 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-stone-200 text-[10px] font-black uppercase tracking-[0.2em] text-[#061b0e] shadow-sm hover:bg-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </motion.button>
      </Link>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(6,27,14,0.1)] overflow-hidden border border-white">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="relative hidden lg:flex lg:col-span-2 flex-col justify-end p-10 overflow-hidden bg-[#061b0e]">
          <Image 
            src="/fondo-2.jpg" 
            alt="Misty Forest"
            fill
            priority
            className="object-cover opacity-50 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061b0e] via-[#061b0e]/20 to-transparent" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center text-[#061b0e]">
                <TreePine size={18} />
              </div>
              <span className="text-white font-bold text-lg tracking-tighter">Ixtac Eco</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tighter leading-tight">
              Reconecta con <br /> <span className="italic font-serif font-light text-emerald-200 text-2xl">lo esencial.</span>
            </h2>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center relative bg-white">
          <div className="max-w-[320px] mx-auto w-full space-y-8 mt-10">
            <div className="text-center lg:text-left space-y-1">
              <h1 className="text-3xl font-bold tracking-tighter text-[#061b0e]">Bienvenido</h1>
              <p className="text-stone-400 text-xs font-medium">Ingresa tus credenciales para continuar.</p>
            </div>

            {/* Formulario */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <AnimatePresence mode='wait'>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* INPUT DE EMAIL CORREGIDO */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="email-input" 
                  className="text-[9px] font-black uppercase tracking-widest text-emerald-900 ml-2 cursor-pointer"
                >
                  Email
                </label>
                <input 
                  id="email-input"
                  name="email"
                  type="email" 
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full bg-stone-50 border border-stone-100 px-5 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all text-sm text-[#061b0e] disabled:opacity-50"
                />
              </div>

              {/* INPUT DE PASSWORD CORREGIDO */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password-input" 
                  className="text-[9px] font-black uppercase tracking-widest text-emerald-900 ml-2 cursor-pointer"
                >
                  Password
                </label>
                <input 
                  id="password-input"
                  name="password"
                  type="password" 
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-stone-50 border border-stone-100 px-5 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all text-sm text-[#061b0e] disabled:opacity-50"
                />
              </div>

              <motion.button 
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full bg-[#061b0e] text-emerald-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/10 hover:bg-[#0a2b17] transition-all flex items-center justify-center gap-2 disabled:bg-stone-800 disabled:text-stone-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Validando acceso...
                  </>
                ) : (
                  'Acceder ahora'
                )}
              </motion.button>
            </form>

            <div className="pt-4 text-center">
              <Link href="/register">
                <span className="text-[10px] font-bold text-stone-400 hover:text-emerald-700 transition-colors cursor-pointer">
                  ¿No tienes cuenta? <span className="text-[#061b0e] underline decoration-emerald-400 underline-offset-4">Regístrate</span>
                </span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 pt-4 border-t border-stone-50 text-stone-300">
              <ShieldCheck size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest">Secure Eco-System</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}