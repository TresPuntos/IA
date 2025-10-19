import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConfig, defaultConfig } from '../lib/config';
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
  const [config, setConfig] = useState<ChatConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración al montar
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const savedConfig = await loadConfig('default');
        if (savedConfig) {
          setConfig(savedConfig);
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
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const saveConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await saveConfig(config);
      return result;
    } catch (error) {
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
