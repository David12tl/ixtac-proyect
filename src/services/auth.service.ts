// @/services/auth.service.ts
import { apiClient } from '../lib/api-client';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Esto llamará internamente a BASE_URL + /api/login
    const response = await apiClient.post<AuthResponse>('/login', {
      email,
      password,
    });
    
    // Si tu backend usa un helper Response, el token podría venir directamente
    // o dentro de response.data. Extraemos el token de forma segura:
    const token = response.token || (response.data?.token);
    const user = response.user || response.usuario || (response.data?.user);

    if (token) {
      localStorage.setItem('auth_token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return response;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', {
      name,
      email,
      password,
    });
    
    const token = response.token || (response.data?.token);
    const user = response.user || response.usuario || (response.data?.user);

    if (token) {
      localStorage.setItem('auth_token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return response;
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  }
};