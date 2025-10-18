// src/lib/chatConfigDisplay.ts
import { ChatConfig } from './config';

export const getConfigSummary = (config: ChatConfig): string => {
  const toneEmojis = {
    friendly: '😊',
    premium: '✨',
    technical: '🔧',
    casual: '😎',
    professional: '📋'
  };

  const languageNames = {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    fr: 'Français',
    de: 'Deutsch'
  };

  return `🔧 Configuración actual:
• Site: ${config.siteName} (${config.siteId})
• Tono: ${toneEmojis[config.tone]} ${config.tone}
• Idioma: ${languageNames[config.language]}
• Estado: ${config.chatStatus === 'active' ? '✅ Activo' : '❌ Inactivo'}
• Tokens máx: ${config.maxTokens}
• Versión: ${config.versionTag}`;
};

export const getSystemPromptPreview = (systemPrompt: string): string => {
  if (systemPrompt.length <= 100) {
    return systemPrompt;
  }
  
  return systemPrompt.substring(0, 100) + '...';
};
