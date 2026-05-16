// @/lib/api-client.ts

const BASE_URL = 'https://ixtacproyect.alwaysdata.net/api';

export const apiClient = {
  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Asegura que la URL no tenga doble barra y termine en .php
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}.php`; 
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.error || 'Error en la petición al servidor');
    }

    return responseData as T;
  },
};