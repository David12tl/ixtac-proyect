// @/services/auth.service.ts
import { apiClient } from '../lib/api-client';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', {
      email,
      password,
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      // Compatible si el backend devuelve 'user' o 'usuario'
      const userData = response.user || response.usuario;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', {
      name,
      email,
      password,
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      const userData = response.user || response.usuario;
      localStorage.setItem('user', JSON.stringify(userData));
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