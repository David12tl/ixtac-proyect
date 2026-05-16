// @/types/auth.ts

export interface UserSession {
  id: string;
  role: number | string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  // Soportamos ambas variantes de nombres de objeto para evitar fallos distributivos
  user?: UserSession;
  usuario?: UserSession;
  error?: string;
}