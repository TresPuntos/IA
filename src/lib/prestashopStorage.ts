/**
 * Utilidad para guardar y cargar credenciales de PrestaShop
 * con manejo robusto de errores y validación
 */

export interface PrestashopCredentials {
  url: string;
  apiKey: string;
  isConnected: boolean;
}

const STORAGE_KEYS = {
  url: 'prestashop-url',
  apiKey: 'prestashop-api-key',
  connected: 'prestashop-connected'
} as const;

/**
 * Guarda las credenciales de PrestaShop en localStorage
 */
export function savePrestashopCredentials(url: string, apiKey: string, isConnected: boolean = false): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('⚠️ localStorage no disponible');
      return false;
    }

    localStorage.setItem(STORAGE_KEYS.url, url);
    localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
    localStorage.setItem(STORAGE_KEYS.connected, String(isConnected));
    
    console.log('💾 Credenciales PrestaShop guardadas:', {
      url,
      hasApiKey: !!apiKey,
      isConnected
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error al guardar credenciales:', error);
    
    // Si es un error de cuota excedida, intentar limpiar espacio
    if (error instanceof DOMException && error.code === 22) {
      console.warn('⚠️ localStorage lleno, intentando limpiar espacio...');
      try {
        // Limpiar solo claves de PrestaShop antiguas si existen
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('prestashop-') && !key.startsWith(STORAGE_KEYS.url) && !key.startsWith(STORAGE_KEYS.apiKey)) {
            localStorage.removeItem(key);
          }
        });
        
        // Intentar guardar de nuevo
        localStorage.setItem(STORAGE_KEYS.url, url);
        localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
        localStorage.setItem(STORAGE_KEYS.connected, String(isConnected));
        return true;
      } catch (retryError) {
        console.error('❌ Error al guardar después de limpiar:', retryError);
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Carga las credenciales de PrestaShop desde localStorage
 */
export function loadPrestashopCredentials(): PrestashopCredentials | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('⚠️ localStorage no disponible');
      return null;
    }

    const url = localStorage.getItem(STORAGE_KEYS.url);
    const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    const connected = localStorage.getItem(STORAGE_KEYS.connected) === 'true';

    if (!url && !apiKey) {
      console.log('📭 No hay credenciales guardadas');
      return null;
    }

    console.log('📥 Credenciales PrestaShop cargadas:', {
      hasUrl: !!url,
      hasApiKey: !!apiKey,
      isConnected: connected
    });

    return {
      url: url || '',
      apiKey: apiKey || '',
      isConnected: connected
    };
  } catch (error) {
    console.error('❌ Error al cargar credenciales:', error);
    return null;
  }
}

/**
 * Elimina las credenciales de PrestaShop de localStorage
 */
export function clearPrestashopCredentials(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.url);
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    localStorage.removeItem(STORAGE_KEYS.connected);
    
    console.log('🗑️ Credenciales PrestaShop eliminadas');
  } catch (error) {
    console.error('❌ Error al eliminar credenciales:', error);
  }
}

/**
 * Verifica si localStorage está disponible y funcional
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}


