// src/lib/theme.ts
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  systemTheme: 'light' | 'dark';
}

const THEME_STORAGE_KEY = 'ai-chat-theme';

// Función para obtener el tema del sistema
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Función para obtener el tema actual
export const getCurrentTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return stored || 'system';
  }
  return 'system';
};

// Función para obtener el tema efectivo (resuelve 'system')
export const getEffectiveTheme = (): 'light' | 'dark' => {
  const currentTheme = getCurrentTheme();
  if (currentTheme === 'system') {
    return getSystemTheme();
  }
  return currentTheme;
};

// Función para aplicar el tema al documento
export const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;
  
  // Remover clases anteriores
  root.classList.remove('light', 'dark');
  
  // Añadir nueva clase
  root.classList.add(effectiveTheme);
  
  // Guardar preferencia
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Actualizar meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#000000' : '#ffffff');
  }
};

// Función para inicializar el tema
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  
  // Escuchar cambios en el tema del sistema
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (getCurrentTheme() === 'system') {
        applyTheme('system');
      }
    });
  }
};

// Función para cambiar tema
export const setTheme = (theme: Theme) => {
  applyTheme(theme);
};

// Función para alternar entre light y dark
export const toggleTheme = () => {
  const current = getCurrentTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
};
