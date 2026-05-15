"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Ticket,
  ExternalLink,
  Filter
} from 'lucide-react';

export type EventType = 'todos' | 'feria' | 'taller' | 'festival' | 'degustacion' | 'concierto' | 'exposicion';

export interface EventData {
  id: string;
  title: string;
  type: EventType;
  description: string;
  date: Date;
  endDate?: Date;
  time: string;
  location: string;
  address: string;
  image: string;
  price: string;
  capacity: number;
  availableSpots: number;
  organizer: string;
  features: string[];
  isRecurring: boolean;
  recurringDays?: string[];
}

interface EventsCalendarProps {
  events: EventData[];
  onBookEvent?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  compact?: boolean;
}

const typeIcons: Record<EventType, string> = {
  todos: '📅',
  feria: '🎪',
  taller: '👨‍🎨',
  festival: '🎉',
  degustacion: '🍷',
  concierto: '🎵',
  exposicion: '🎨'
};

const typeLabels: Record<EventType, string> = {
  todos: 'Todos',
  feria: 'Feria',
  taller: 'Taller',
  festival: 'Festival',
  degustacion: 'Degustación',
  concierto: 'Concierto',
  exposicion: 'Exposición'
};

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  onBookEvent,
  onViewDetails,
  compact = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState<EventType>('todos');
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (selectedType !== 'todos' && event.type !== selectedType) return false;
      return isSameDay(eventDate, date);
    });
  };

  const getEventsForMonth = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (selectedType !== 'todos' && event.type !== selectedType) return false;
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredEvents = getEventsForMonth();
  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const hasEvents = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getEventsForDate(date).length > 0;
  };

  const renderEventBadge = (type: EventType) => {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#d4e9c7]/30 text-[#1b3022] text-[10px] font-bold rounded-full">
        <span>{typeIcons[type]}</span>
        {typeLabels[type]}
      </span>
    );
  };

  if (compact) {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#1b3022] tracking-tighter">Próximos Eventos</h3>
            <p className="text-sm text-stone-500 italic">No te pierdas las experiencias locales</p>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'month' ? 'list' : 'month')}
            className="px-4 py-2 bg-stone-100 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors"
          >
            {viewMode === 'month' ? 'Ver lista' : 'Ver calendario'}
          </button>
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.entries(typeLabels).map(([type, label]) => (
            type !== 'todos' && (
              <button
                key={type}
                onClick={() => setSelectedType(type as EventType)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-[#1b3022] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {typeIcons[type as EventType]} {label}
              </button>
            )
          ))}
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 italic">No hay eventos programados</p>
            </div>
          ) : (
            filteredEvents.slice(0, 6).map(event => (
              <div
                key={event.id}
                className="flex gap-4 p-4 bg-white/40 rounded-2xl border border-stone-100 hover:border-[#d4e9c7] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onViewDetails && onViewDetails(event.id)}
              >
                {/* Fecha */}
                <div className="flex-shrink-0 w-16 h-16 bg-[#1b3022] rounded-2xl flex flex-col items-center justify-center text-white">
                  <span className="text-[10px] font-black uppercase">
                    {monthNames[new Date(event.date).getMonth()].slice(0, 3)}
                  </span>
                  <span className="text-2xl font-bold">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-[#1b3022] line-clamp-1 group-hover:text-[#516349] transition-colors">
                      {event.title}
                    </h4>
                    {renderEventBadge(event.type)}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1b3022] tracking-tighter">Calendario de Eventos</h2>
          <p className="text-stone-500 italic mt-1">Descubre qué está pasando en Ixtaczoquitlán</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === 'month'
                ? 'bg-[#1b3022] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              viewMode === 'list'
                ? 'bg-[#1b3022] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-stone-400">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Tipo:</span>
        </div>
        <div className="flex gap-2">
          {Object.entries(typeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as EventType)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-[#d4e9c7] text-[#1b3022]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {typeIcons[type as EventType]} {label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'month' ? (
        /* Vista de calendario mensual */
        <div>
          {/* Navegación del mes */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
            >
              <ChevronLeft size={20} className="text-stone-600" />
            </button>
            <h3 className="text-xl font-bold text-[#1b3022]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
            >
              <ChevronRight size={20} className="text-stone-600" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 text-[10px] font-black uppercase text-stone-400 tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {/* Días vacíos del inicio */}
            {Array.from({ length: startingDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Días del mes */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayHasEvents = hasEvents(day);
              const dayIsToday = isToday(date);
              const dayIsSelected = selectedDate && isSameDay(date, selectedDate);
              const dayEvents = getEventsForDate(date);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dayIsSelected ? null : date)}
                  className={`aspect-square relative p-1 rounded-2xl transition-all ${
                    dayIsSelected
                      ? 'bg-[#1b3022] text-white'
                      : dayIsToday
                      ? 'bg-[#d4e9c7] text-[#1b3022]'
                      : 'hover:bg-stone-100'
                  }`}
                >
                  <span className={`text-sm font-bold ${dayIsToday && !dayIsSelected ? 'text-[#1b3022]' : ''}`}>
                    {day}
                  </span>
                  {dayHasEvents && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${dayIsSelected ? 'bg-white' : 'bg-[#10b981]'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Eventos del día seleccionado */}
          {selectedDate && (
            <div className="mt-8 pt-8 border-t border-stone-200 animate-in slide-in-from-bottom-2">
              <h4 className="text-lg font-bold text-[#1b3022] mb-4">
                Eventos del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-stone-500 italic col-span-full">No hay eventos programados para este día</p>
                ) : (
                  getEventsForDate(selectedDate).map(event => (
                    <EventCard key={event.id} event={event} onBook={onBookEvent} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Vista de lista */
        <div className="space-y-4 max-h-[700px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 italic">No hay eventos programados este mes</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onBook={onBookEvent} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Función helper para renderizar badge de evento
const renderEventBadge = (type: EventType) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#d4e9c7]/30 text-[#1b3022] text-[10px] font-bold rounded-full">
      <span>{typeIcons[type]}</span>
      {typeLabels[type]}
    </span>
  );
};

// Componente de tarjeta de evento individual
const EventCard: React.FC<{ event: EventData; onBook?: (eventId: string) => void }> = ({
  event,
  onBook
}) => {
  const eventDate = new Date(event.date);

  return (
    <div className="flex gap-4 p-4 bg-white/40 rounded-2xl border border-stone-100 hover:border-[#d4e9c7] hover:shadow-lg transition-all group">
      {/* Imagen */}
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden relative">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-bold text-[#1b3022] group-hover:text-[#516349] transition-colors line-clamp-1">
              {event.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {renderEventBadge(event.type)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{eventDate.getDate()} {monthNames[eventDate.getMonth()].slice(0, 3)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1b3022]">{event.price}</span>
            {event.availableSpots < 10 && (
              <span className="text-[10px] text-amber-600 font-bold">
                ¡Solo {event.availableSpots} lugares!
              </span>
            )}
          </div>
          <button
            onClick={() => onBook && onBook(event.id)}
            className="px-4 py-2 bg-[#1b3022] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#102015] transition-colors flex items-center gap-2"
          >
            <Ticket size={14} />
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo
export const sampleEvents: EventData[] = [
  {
    id: '1',
    title: 'Feria del Café y Cacao',
    type: 'feria',
    description: 'Festival anual dedicado a los productores locales de café y cacao. Degustaciones, talleres y música en vivo.',
    date: new Date(2026, 5, 15),
    time: '10:00 AM - 8:00 PM',
    location: 'Plaza Principal, Ixtaczoquitlán',
    address: 'Zócalo Central s/n',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400',
    price: 'Entrada libre',
    capacity: 5000,
    availableSpots: 5000,
    organizer: 'Municipio de Ixtaczoquitlán',
    features: ['Degustaciones', 'Música en vivo', 'Artesanías'],
    isRecurring: false
  },
  {
    id: '2',
    title: 'Taller de Textiles Ancestrales',
    type: 'taller',
    description: 'Aprende las técnicas de bordado y telar de cintura con la maestra artesana Doña Elena Martínez.',
    date: new Date(2026, 5, 18),
    time: '9:00 AM - 2:00 PM',
    location: 'Casa de la Cultura',
    address: 'Calle Revolución #78',
    image: 'https://images.unsplash.com/photo-1590736910113-f633367909bb?w=400',
    price: '$450 MXN',
    capacity: 15,
    availableSpots: 3,
    organizer: 'Doña Elena Martínez',
    features: ['Materiales incluidos', 'Nivel principiante', 'Certificado'],
    isRecurring: true,
    recurringDays: ['Sábados']
  },
  {
    id: '3',
    title: 'Festival de Jazz en el Bosque',
    type: 'festival',
    description: 'Noche mágica de jazz con artistas locales e internacionales en el corazón del bosque de niebla.',
    date: new Date(2026, 5, 22),
    time: '6:00 PM - 11:00 PM',
    location: 'Jardín Botánico',
    address: 'Carretera a Zongolica Km 3',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    price: '$250 - $500 MXN',
    capacity: 300,
    availableSpots: 87,
    organizer: 'Cultura Ixtac',
    features: ['Zona de alimentos', 'Estacionamiento', 'Accesible'],
    isRecurring: false
  },
  {
    id: '4',
    title: 'Degustación de Mieles Artesanales',
    type: 'degustacion',
    description: 'Recorrido por los diferentes tipos de miel producidos en la región, acompañado de maridajes especiales.',
    date: new Date(2026, 5, 25),
    time: '4:00 PM - 7:00 PM',
    location: 'Apiarios Ixtac',
    address: 'Colonia El Carmen',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    price: '$180 MXN',
    capacity: 25,
    availableSpots: 12,
    organizer: 'Apiarios Ixtac',
    features: ['Incluye degustación', 'Visita al apiario', 'Producto para llevar'],
    isRecurring: false
  },
  {
    id: '5',
    title: 'Exposición de Arte Popular',
    type: 'exposicion',
    description: 'Muestra de las mejores piezas de arte popular de la región, incluyendo máscaras, textiles y cerámica.',
    date: new Date(2026, 5, 1),
    endDate: new Date(2026, 5, 30),
    time: '10:00 AM - 6:00 PM',
    location: 'Galería Municipal',
    address: 'Av. Constitución #12',
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400',
    price: 'Entrada libre',
    capacity: 200,
    availableSpots: 200,
    organizer: 'Instituto de Cultura',
    features: ['Guías disponibles', 'Visitas guiadas', 'Tienda de souvenirs'],
    isRecurring: false
  }
];