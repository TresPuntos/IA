// src/lib/config.ts
export interface ChatConfig {
  // Site Info
  siteId: string;
  siteName: string;
  chatStatus: 'active' | 'testing' | 'inactive';
  
  // Tone & Style
  tone: 'friendly' | 'premium' | 'technical' | 'casual' | 'professional';
  systemPrompt: string;
  
  // Model Parameters
  temperature: number;
  topP: number;
  maxTokens: number;
  language: 'es' | 'en' | 'pt' | 'fr' | 'de';
  
  // Additional settings
  versionTag: string;
}

// Configuración por defecto
export const defaultConfig: ChatConfig = {
  siteId: 'exitbcn',
  siteName: 'Tienda Premium Tech',
  chatStatus: 'active',
  tone: 'friendly',
  systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  language: 'es',
  versionTag: 'v0.1'
};

// Función para obtener configuración actual del DOM
export const getCurrentConfig = (): ChatConfig => {
  // Intentar obtener valores de los inputs del dashboard
  const siteIdInput = document.getElementById('test-site-id') as HTMLInputElement;
  const siteNameInput = document.getElementById('site-name') as HTMLInputElement;
  const chatStatusSelect = document.getElementById('chat-status') as HTMLSelectElement;
  const toneSelect = document.getElementById('tone') as HTMLSelectElement;
  const systemPromptTextarea = document.getElementById('system-prompt') as HTMLTextAreaElement;
  const temperatureSlider = document.getElementById('temperature') as HTMLInputElement;
  const topPSlider = document.getElementById('top-p') as HTMLInputElement;
  const maxTokensSlider = document.getElementById('max-tokens') as HTMLInputElement;
  const languageSelect = document.getElementById('language') as HTMLSelectElement;
  const versionTagInput = document.getElementById('version-tag') as HTMLInputElement;

  return {
    siteId: siteIdInput?.value || defaultConfig.siteId,
    siteName: siteNameInput?.value || defaultConfig.siteName,
    chatStatus: (chatStatusSelect?.value as any) || defaultConfig.chatStatus,
    tone: (toneSelect?.value as any) || defaultConfig.tone,
    systemPrompt: systemPromptTextarea?.value || defaultConfig.systemPrompt,
    temperature: parseFloat(temperatureSlider?.value || '0.7'),
    topP: parseFloat(topPSlider?.value || '0.9'),
    maxTokens: parseInt(maxTokensSlider?.value || '2048'),
    language: (languageSelect?.value as any) || defaultConfig.language,
    versionTag: versionTagInput?.value || defaultConfig.versionTag
  };
};

// Función para aplicar configuración de tono
export const applyToneToResponse = (response: string, tone: string, language: string): string => {
  const lowerResponse = response.toLowerCase();
  
  // Si ya es una respuesta estructurada (con productos), aplicar tono específico
  if (lowerResponse.includes('encontré') || lowerResponse.includes('•')) {
    switch (tone) {
      case 'premium':
        return `✨ ${response}`;
      case 'technical':
        return `🔧 ${response}`;
      case 'casual':
        return `😊 ${response}`;
      case 'professional':
        return `📋 ${response}`;
      case 'friendly':
      default:
        return `👋 ${response}`;
    }
  }

  // Para respuestas simples, aplicar emoji según tono
  switch (tone) {
    case 'premium':
      return `✨ ${response}`;
    case 'technical':
      return `🔧 ${response}`;
    case 'casual':
      return `😊 ${response}`;
    case 'professional':
      return `📋 ${response}`;
    case 'friendly':
    default:
      return `👋 ${response}`;
  }
};

// Función para aplicar idioma
export const applyLanguageToResponse = (response: string, language: string): string => {
  if (language === 'es') {
    return response; // Ya está en español
  }
  
  // Traducciones básicas para otros idiomas
  const translations: Record<string, Record<string, string>> = {
    en: {
      'Encontré': 'Found',
      'productos': 'products',
      'por debajo de': 'below',
      'en el catálogo': 'in the catalog',
      'No encuentro': 'I cannot find',
      'información relevante': 'relevant information',
      'documentación': 'documentation',
      'disponible': 'available'
    },
    pt: {
      'Encontré': 'Encontrei',
      'productos': 'produtos',
      'por debajo de': 'abaixo de',
      'en el catálogo': 'no catálogo',
      'No encuentro': 'Não encontro',
      'información relevante': 'informação relevante',
      'documentación': 'documentação',
      'disponible': 'disponível'
    }
  };

  let translatedResponse = response;
  const langTranslations = translations[language];
  
  if (langTranslations) {
    Object.entries(langTranslations).forEach(([spanish, translated]) => {
      translatedResponse = translatedResponse.replace(new RegExp(spanish, 'gi'), translated);
    });
  }

  return translatedResponse;
};

// Función para limitar tokens según configuración
export const limitTokens = (response: string, maxTokens: number): string => {
  // Estimación aproximada: 1 token ≈ 4 caracteres
  const maxChars = maxTokens * 4;
  
  if (response.length <= maxChars) {
    return response;
  }
  
  // Truncar manteniendo estructura
  const truncated = response.substring(0, maxChars);
  
  // Intentar cortar en un punto lógico
  const lastNewline = truncated.lastIndexOf('\n');
  const lastPeriod = truncated.lastIndexOf('.');
  const lastBullet = truncated.lastIndexOf('•');
  
  const cutPoint = Math.max(lastNewline, lastPeriod, lastBullet);
  
  if (cutPoint > maxChars * 0.8) {
    return truncated.substring(0, cutPoint + 1) + '...';
  }
  
  return truncated + '...';
};
