"use client";

import React, { useState } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Filter,
  ChevronDown,
  Sliders
} from 'lucide-react';

export type AttractionType = 'todos' | 'restaurante' | 'sitio_historico' | 'taller' | 'mirador' | 'cascada' | 'museo' | 'mercado';

export interface SearchFilters {
  query: string;
  type: AttractionType;
  location: string;
  priceRange: 'todos' | 'economico' | 'medio' | 'premium';
  sortBy: 'relevancia' | 'rating' | 'precio_menor' | 'precio_mayor';
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const attractionTypes: { value: AttractionType; label: string; icon: string }[] = [
  { value: 'todos', label: 'Todos', icon: '🗺️' },
  { value: 'restaurante', label: 'Restaurantes', icon: '🍽️' },
  { value: 'sitio_historico', label: 'Sitios Históricos', icon: '🏛️' },
  { value: 'taller', label: 'Talleres', icon: '👨‍🎨' },
  { value: 'mirador', label: 'Miradores', icon: '🏔️' },
  { value: 'cascada', label: 'Cascadas', icon: '💧' },
  { value: 'museo', label: 'Museos', icon: '🎭' },
  { value: 'mercado', label: 'Mercados', icon: '🛒' }
];

const locations = [
  'Todos',
  'Ixtaczoquitlán',
  'Zongolica',
  'Cuautlapan',
  'Tuxpanguillo',
  'Ciudad Mendoza'
];

const priceRanges: { value: SearchFilters['priceRange']; label: string; symbol: string }[] = [
  { value: 'todos', label: 'Todos', symbol: '' },
  { value: 'economico', label: 'Económico', symbol: '$' },
  { value: 'medio', label: 'Medio', symbol: '$$' },
  { value: 'premium', label: 'Premium', symbol: '$$$' }
];

const sortOptions: { value: SearchFilters['sortBy']; label: string }[] = [
  { value: 'relevancia', label: 'Más relevantes' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'precio_menor', label: 'Precio menor' },
  { value: 'precio_mayor', label: 'Precio mayor' }
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar lugares, restaurantes, talleres...',
  showFilters = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'todos',
    location: 'Todos',
    priceRange: 'todos',
    sortBy: 'relevancia'
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      type: 'todos' as AttractionType,
      location: 'Todos',
      priceRange: 'todos' as SearchFilters['priceRange'],
      sortBy: 'relevancia' as SearchFilters['sortBy']
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const selectedType = attractionTypes.find(t => t.value === filters.type);
  const hasActiveFilters = filters.query || filters.type !== 'todos' || filters.location !== 'Todos' || filters.priceRange !== 'todos';

  return (
    <div className={`relative ${className}`}>
      {/* Barra de búsqueda principal */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl p-3">
        <div className="flex items-center gap-3">
          {/* Input de búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-3 bg-white/40 rounded-full border border-stone-200 focus:border-[#1b3022] focus:outline-none text-[#1b3022] placeholder-stone-400"
            />
            {filters.query && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
              >
                <X size={12} className="text-stone-600" />
              </button>
            )}
          </div>

          {/* Botón de búsqueda */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#1b3022] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#102015] transition-colors flex items-center gap-2"
          >
            <Search size={16} />
            Buscar
          </button>

          {/* Botón de filtros (toggle) */}
          {showFilters && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`px-4 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                isOpen || hasActiveFilters
                  ? 'bg-[#d4e9c7] text-[#1b3022]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sliders size={16} />
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#1b3022] rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* Panel de filtros expandible */}
        {isOpen && showFilters && (
          <div className="mt-4 pt-4 border-t border-stone-200 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                Filtros de búsqueda
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-stone-500 hover:text-[#1b3022] font-bold flex items-center gap-1"
                >
                  <X size={12} />
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Tipo de atractivo */}
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">
                  Tipo de lugar
                </label>
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/40 rounded-2xl border border-stone-200 hover:border-[#1b3022] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{selectedType?.icon}</span>
                    <span className="text-sm font-bold text-[#1b3022]">{selectedType?.label}</span>
                  </span>
                  <ChevronDown size={16} className={`text-stone-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 max-h-64 overflow-y-auto">
                    {attractionTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, type: type.value }));
                          setShowTypeDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors ${
                          filters.type === type.value ? 'bg-[#d4e9c7]/20' : ''
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span className={`text-sm font-bold ${filters.type === type.value ? 'text-[#1b3022]' : 'text-stone-600'}`}>
                          {type.label}
                        </span>
                        {filters.type === type.value && (
                          <svg className="ml-auto w-5 h-5 text-[#1b3022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">
                  Ubicación
                </label>
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/40 rounded-2xl border border-stone-200 hover:border-[#1b3022] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-stone-400" />
                    <span className="text-sm font-bold text-[#1b3022]">{filters.location}</span>
                  </span>
                  <ChevronDown size={16} className={`text-stone-400 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showLocationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl z-50">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, location: loc }));
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors ${
                          filters.location === loc ? 'bg-[#d4e9c7]/20' : ''
                        }`}
                      >
                        <MapPin size={16} className="text-stone-400" />
                        <span className={`text-sm font-bold ${filters.location === loc ? 'text-[#1b3022]' : 'text-stone-600'}`}>
                          {loc}
                        </span>
                        {filters.location === loc && (
                          <svg className="ml-auto w-5 h-5 text-[#1b3022]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rango de precios */}
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">
                  Rango de precios
                </label>
                <div className="flex gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                      className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${
                        filters.priceRange === range.value
                          ? 'bg-[#1b3022] text-white'
                          : 'bg-white/40 text-stone-600 border border-stone-200 hover:border-[#1b3022]'
                      }`}
                    >
                      {range.symbol || range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                  className="w-full px-4 py-3 bg-white/40 rounded-2xl border border-stone-200 focus:border-[#1b3022] focus:outline-none text-sm font-bold text-[#1b3022]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showTypeDropdown || showLocationDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowTypeDropdown(false);
            setShowLocationDropdown(false);
          }}
        />
      )}
    </div>
  );
};