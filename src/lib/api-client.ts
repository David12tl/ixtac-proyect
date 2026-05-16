// @/lib/api-client.ts

const BASE_URL = 'https://ixtacproyect.alwaysdata.net'; // Sin barra al final, sin "api"

export const apiClient = {
  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Si endpoint viene como '/login', quitamos la barra inicial para mandar 'api/login'
    // O si viene como 'login', le anteponemos 'api/'
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${BASE_URL}/api/${cleanEndpoint}`; // Resultado: https://ixtacproyect.alwaysdata.net/api/login
    
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