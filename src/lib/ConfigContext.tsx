import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConfig } from '../lib/config';
import { loadConfig, saveConfig } from '../lib/configStorage';

interface ConfigContextType {
  config: ChatConfig;
  updateConfig: (updates: Partial<ChatConfig>) => void;
  saveConfiguration: () => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ChatConfig>({
    siteId: 'default',
    siteName: 'Mi Tienda',
    chatStatus: 'active',
    tone: 'friendly',
    systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    language: 'es',
    versionTag: 'v1.0'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración al montar
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        console.log('🔄 Cargando configuración inicial...');
        const savedConfig = await loadConfig('default');
        console.log('📥 Configuración cargada:', savedConfig);
        if (savedConfig) {
          setConfig(savedConfig);
          console.log('✅ Configuración aplicada al estado');
        } else {
          console.log('⚠️ No se encontró configuración guardada, usando valores por defecto');
        }
      } catch (error) {
        console.error('❌ Error loading config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialConfig();
  }, []);

  const updateConfig = (updates: Partial<ChatConfig>) => {
    console.log('🔄 Actualizando configuración:', updates);
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      console.log('📝 Nueva configuración:', newConfig);
      return newConfig;
    });
  };

  const saveConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('💾 Guardando configuración:', config);
      const result = await saveConfig(config);
      console.log('✅ Resultado del guardado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  return (
    <ConfigContext.Provider value={{
      config,
      updateConfig,
      saveConfiguration,
      isLoading
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
