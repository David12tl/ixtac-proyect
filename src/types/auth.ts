// @/types/auth.ts

export interface UserSession {
  id: string;
  role: number | string;
}

export interface AuthResponse {
  status?: string | boolean;
  message?: string;
  mensaje?: string;
  token?: string;
  user?: UserSession;
  usuario?: UserSession;
  error?: string;
  // Soporte para respuestas envueltas en estructuras App\Helpers\Response
  data?: {
    token?: string;
    user?: UserSession;
    [key: string]: unknown;
  };
}