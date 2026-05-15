"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera,
  MapPin,
  Star,
  Badge,
  Shield,
  Hammer,
  UtensilsCrossed,
  Backpack
} from 'lucide-react';

export type UserRole = 'turista' | 'artesano' | 'guia' | 'admin';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  role: UserRole;
  avatar: string;
  specialties: string[];
  rating: number;
  reviews: number;
  services: number;
  verified: boolean;
}

interface UserProfileProps {
  user: UserProfileData;
  isEditable?: boolean;
  onSave?: (updatedUser: UserProfileData) => void;
  onClose?: () => void;
}

export const roleIcons = {
  turista: User,
  artesano: Hammer,
  guia: Backpack,
  admin: Shield
};

export const roleColors = {
  turista: 'bg-blue-100 text-blue-700',
  artesano: 'bg-amber-100 text-amber-700',
  guia: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-purple-100 text-purple-700'
};

export const roleLabels = {
  turista: 'Turista',
  artesano: 'Artesano',
  guia: 'Guía Local',
  admin: 'Administrador'
};

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isEditable = false,
  onSave,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const RoleIcon = roleIcons[user.role];

  const handleSave = () => {
    if (onSave) {
      onSave(editedUser);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-2xl overflow-hidden">
      {/* Header con gradiente */}
      <div className="relative h-48 bg-gradient-to-br from-[#1b3022] to-[#516349]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800')] bg-cover bg-center" />
        </div>
        
        {/* Botón de cerrar */}
        {onClose && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        )}

        {/* Badge de rol */}
        <div className="absolute bottom-4 left-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${roleColors[user.role]} backdrop-blur-md`}>
            <RoleIcon size={14} />
            <span className="text-xs font-black uppercase tracking-widest">
              {roleLabels[user.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-20 mx-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src={isEditing ? editedUser.avatar : user.avatar}
              alt={user.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#d4e9c7] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera size={18} className="text-[#1b3022]" />
            </button>
          )}
        </div>

        {/* Badge de verificado */}
        {user.verified && (
          <div className="absolute bottom-2 left-28 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
            <Badge size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Información del usuario */}
      <div className="px-8 py-6 space-y-6">
        {/* Nombre y estadísticas */}
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-3xl font-bold text-[#1b3022] bg-transparent border-b-2 border-[#1b3022]/20 focus:border-[#1b3022] outline-none w-full pb-2"
            />
          ) : (
            <h2 className="text-3xl font-bold text-[#1b3022] tracking-tighter">
              {user.name}
            </h2>
          )}

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-[#1b3022]">{user.rating}</span>
              <span className="text-stone-400 text-sm">({user.reviews} reseñas)</span>
            </div>
            <div className="w-px h-4 bg-stone-300" />
            <div className="flex items-center gap-1 text-stone-500">
              <MapPin size={14} />
              <span className="text-sm">{user.location}</span>
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div>
          <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-2 block">
            Sobre mí
          </label>
          {isEditing ? (
            <textarea
              value={editedUser.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full bg-white/40 rounded-2xl p-4 text-stone-600 border border-stone-200 focus:border-[#1b3022] outline-none resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
          ) : (
            <p className="text-stone-600 font-serif italic leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        {/* Especialidades */}
        {isEditing ? (
          <div>
            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-2 block">
              Especialidades (separadas por comas)
            </label>
            <input
              type="text"
              value={editedUser.specialties.join(', ')}
              onChange={(e) => handleInputChange('specialties', e.target.value)}
              className="w-full bg-white/40 rounded-2xl p-4 text-stone-600 border border-stone-200 focus:border-[#1b3022] outline-none"
              placeholder="Textiles, Cerámica, Gastronomía..."
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#d4e9c7]/30 text-[#1b3022] text-xs font-bold rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-stone-200">
          <div className="text-center">
            <div className="text-2xl font-black text-[#1b3022]">{user.services}</div>
            <div className="text-[10px] uppercase text-stone-400 tracking-widest">Servicios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#1b3022]">{user.reviews}</div>
            <div className="text-[10px] uppercase text-stone-400 tracking-widest">Reseñas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#1b3022]">{user.rating}</div>
            <div className="text-[10px] uppercase text-stone-400 tracking-widest">Rating</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#1b3022] text-white py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#102015] transition-colors"
              >
                <Save size={16} />
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-8 py-4 bg-stone-200 text-stone-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-stone-300 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : isEditable ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-[#d4e9c7] text-[#1b3022] py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#c5da9e] transition-colors"
            >
              <Edit3 size={16} />
              Editar Perfil
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Datos de ejemplo para testing
export const sampleUsers: UserProfileData[] = [
  {
    id: '1',
    name: 'Doña Elena Martínez',
    email: 'elena@ixtac.mx',
    bio: 'Maestra artesana con más de 40 años de experiencia en textiles bordados a mano. Preservo las técnicas ancestrales que aprendí de mi abuela y mi madre.',
    location: 'Ixtaczoquitlán, Veracruz',
    role: 'artesano',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    specialties: ['Textiles', 'Bordado', 'Telar de Cintura'],
    rating: 4.9,
    reviews: 127,
    services: 12,
    verified: true
  },
  {
    id: '2',
    name: 'Carlos Hernández',
    email: 'carlos@ixtac.mx',
    bio: 'Guía certificado con conocimiento profundo de las rutas de senderismo y la flora local. Te llevaré a descubrir los secretos del bosque de niebla.',
    location: 'Zongolica, Veracruz',
    role: 'guia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    specialties: ['Senderismo', 'Avistamiento de Aves', 'Fotografía'],
    rating: 4.8,
    reviews: 89,
    services: 8,
    verified: true
  },
  {
    id: '3',
    name: 'María González',
    email: 'maria@email.com',
    bio: 'Amante de la naturaleza y la cultura local. Siempre buscando nuevas experiencias y conectando con artesanos de la región.',
    location: 'Ciudad de México',
    role: 'turista',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    specialties: [],
    rating: 5.0,
    reviews: 12,
    services: 0,
    verified: false
  }
];