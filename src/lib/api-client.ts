// @/lib/api-client.ts

const BASE_URL = 'https://ixtacproyect.alwaysdata.net';

export const apiClient = {
  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Quitamos la barra inicial si existe para evitar rutas como api//login
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Construimos la URL exacta: https://ixtacproyect.alwaysdata.net/api/login
    const url = `${BASE_URL}/api/${cleanEndpoint}`; 
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.error || responseData.message || 'Error en el servidor');
    }

    return responseData as T;
  },
};