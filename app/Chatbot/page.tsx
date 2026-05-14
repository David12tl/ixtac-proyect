"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Send, Bot, ArrowLeft, 
  MessageSquare, Plus, Trash2, MapPin
} from 'lucide-react';

// --- Tipos ---
type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'guia_niebla_conversations';
const CURRENT_CONVERSATION_KEY = 'guia_niebla_current';

const initializeChatState = (): { conversations: Conversation[]; currentConversationId: string } => {
  if (typeof window === 'undefined') return { conversations: [], currentConversationId: "" };

  const storedConversations = localStorage.getItem(STORAGE_KEY);
  const storedCurrentId = localStorage.getItem(CURRENT_CONVERSATION_KEY) || "";

  if (storedConversations) {
    const parsed: Conversation[] = JSON.parse(storedConversations);
    const validId = parsed.some(c => c.id === storedCurrentId) ? storedCurrentId : parsed[0]?.id || "";
    return { conversations: parsed, currentConversationId: validId };
  }

  const timestamp = Date.now();
  const newId = `conv_${timestamp}`;
  const initialMsg: Message = {
    id: timestamp,
    text: "¡Hola! Soy el Guía de Niebla. ¿En qué rincón de Ixtaczoquitlán nos aventuramos hoy?",
    sender: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const newConv: Conversation = {
    id: newId,
    title: 'Nueva charla',
    messages: [initialMsg],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([newConv]));
  localStorage.setItem(CURRENT_CONVERSATION_KEY, newId);

  return { conversations: [newConv], currentConversationId: newId };
};

export default function ChatbotPage() {
  const initialChatState = useMemo(() => initializeChatState(), []);

  const [conversations, setConversations] = useState<Conversation[]>(initialChatState.conversations);
  const [requestedConversationId, setRequestedConversationId] = useState<string>(initialChatState.currentConversationId);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentConversationId = useMemo(() => {
    if (requestedConversationId && conversations.some(c => c.id === requestedConversationId)) {
      return requestedConversationId;
    }
    return conversations[0]?.id || "";
  }, [requestedConversationId, conversations]);

  const messages = useMemo(() => {
    if (currentConversationId) {
      const active = conversations.find(c => c.id === currentConversationId);
      return active?.messages || [];
    }
    return [];
  }, [currentConversationId, conversations]);

  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setConversations(prev => 
      prev.map(c => 
        c.id === currentConversationId ? { ...c, messages: newMessages, updatedAt: new Date().toISOString() } : c
      )
    );
  }, [currentConversationId, messages]);

  // --- NUEVA FUNCIÓN: BORRAR CONVERSACIÓN ---
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se seleccione la conversación al hacer clic en borrar
    
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (id === currentConversationId) {
      if (updated.length > 0) {
        setRequestedConversationId(updated[0].id);
      } else {
        startNewConversation();
      }
    }
  };

  const startNewConversation = useCallback(() => {
    const newId = `conv_${Date.now()}`;
    const initialMsg: Message = {
      id: Date.now(),
      text: "¡Hola! Soy el Guía de Niebla. ¿En qué rincón de Ixtaczoquitlán nos aventuramos hoy?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const newConv: Conversation = {
      id: newId,
      title: 'Nueva charla',
      messages: [initialMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newConv, ...conversations];
    setConversations(updated);
    setRequestedConversationId(newId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_CONVERSATION_KEY, newId);
  }, [conversations]);

  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      const updated = conversations.map(c => 
        c.id === currentConversationId ? { ...c, messages, updatedAt: new Date().toISOString() } : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [messages, currentConversationId, conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.sender === 'bot' ? 'assistant' : m.sender, 
            content: m.text 
          })) 
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.text || "Hubo un error con la niebla.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0d1310] text-gray-100 font-sans">
      {/* Sidebar Historial */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#121a16] border-r border-emerald-900/30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-emerald-900/30 flex justify-between items-center bg-[#0a0f0d]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-xs uppercase tracking-widest text-emerald-500/80">Ixtaczoquitlán</span>
          </div>
          <button onClick={startNewConversation} className="p-2 bg-emerald-900/20 text-emerald-400 rounded-lg hover:bg-emerald-800/40 transition-colors border border-emerald-800/30">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => { setRequestedConversationId(conv.id); setIsSidebarOpen(false); }}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${currentConversationId === conv.id ? 'bg-emerald-900/20 border-emerald-500/40' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className={currentConversationId === conv.id ? "text-emerald-400" : "text-gray-500"} />
                <div className="overflow-hidden">
                  <p className={`text-sm font-medium truncate ${currentConversationId === conv.id ? 'text-white' : 'text-gray-400'}`}>{conv.title}</p>
                  <p className="text-[10px] text-gray-600 font-mono italic">{new Date(conv.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Área del Chat */}
      <main className="flex-1 flex flex-col bg-[#0a0f0d] relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-950/20 blur-[80px] pointer-events-none"></div>

        <header className="h-16 bg-[#121a16]/60 backdrop-blur-xl border-b border-emerald-900/30 flex items-center px-6 justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-emerald-500" onClick={() => setIsSidebarOpen(true)}>
              <MessageSquare size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Bot className="text-emerald-500" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white tracking-tight">Guía de Niebla</h1>
                <p className="text-[10px] text-emerald-500/60 font-medium uppercase tracking-widest">En línea</p>
              </div>
            </div>
          </div>
          <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <ArrowLeft size={20}/>
          </Link>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar z-10">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${msg.sender === 'user' ? 'bg-emerald-600 border-emerald-400/30' : 'bg-[#1a2520] border-emerald-900/40'}`}>
                   {msg.sender === 'user' ? <span className="text-[10px] font-bold">Yo</span> : <MapPin size={14} className="text-emerald-500" />}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl shadow-2xl ${msg.sender === 'user' ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-[#1a2520] text-gray-200 border border-emerald-900/30 rounded-tl-none'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                  <p className={`text-[9px] mt-2 font-mono text-gray-600 uppercase ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-emerald-500/70 italic text-xs animate-pulse">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              Buscando en la espesura...
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Caja de Texto Mejorada */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d] to-transparent z-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input} 
                disabled={isLoading}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda sobre el municipio..."
                className="w-full bg-[#161f1b] border border-emerald-900/40 rounded-2xl pl-5 pr-14 py-4 text-sm text-gray-100 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all shadow-2xl"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-30 disabled:hover:bg-emerald-600 shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
              Turismo Responsable • Ixtaczoquitlán 2026
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #064e3b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}