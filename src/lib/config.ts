// src/lib/config.ts
export interface ChatConfig {
  // Site Info
  siteId: string;
  siteName: string;
  chatStatus: 'active' | 'testing' | 'inactive';
  
  // System Prompts
  systemPrompt: string;
  productPrompt: string;
  supportPrompt: string;
  salesPrompt: string;
  
  // Tone & Style
  tone: 'friendly' | 'premium' | 'technical' | 'casual' | 'professional';
  styleInstructions: string;
  
  // Model Parameters
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini';
  temperature: number;
  topP: number;
  maxTokens: number;
  language: 'es' | 'en' | 'pt' | 'fr' | 'de';
  
  // Additional settings
  versionTag: string;
}

// Configuración por defecto
export const defaultConfig: ChatConfig = {
  siteId: 'default',
  siteName: 'Mi Tienda',
  chatStatus: 'active',
  
  // System Prompts
  systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.',
  productPrompt: 'Cuando el cliente pregunte sobre productos específicos, busca en el catálogo y proporciona información detallada incluyendo precio, descripción y disponibilidad. Si no encuentras el producto exacto, sugiere alternativas similares.',
  supportPrompt: 'Para consultas técnicas o problemas, consulta la documentación disponible y proporciona soluciones paso a paso. Si no tienes la información necesaria, indica claramente que necesitas más detalles.',
  salesPrompt: 'Para ayudar con ventas, destaca las características principales de los productos, menciona ofertas especiales si las hay, y guía al cliente hacia la compra de manera natural y útil.',
  
  // Tone & Style
  tone: 'friendly',
  styleInstructions: 'Usa un español neutro y profesional. Mantén las respuestas concisas pero informativas.',
  
  // Model Parameters
  model: 'gpt-4o-mini',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  language: 'es',
  versionTag: 'v1.0'
};

// Función para obtener configuración actual del DOM
export const getCurrentConfig = (): ChatConfig => {
  // Intentar obtener valores de los inputs del dashboard
  const siteIdInput = document.getElementById('siteId') as HTMLInputElement;
  const siteNameInput = document.getElementById('siteName') as HTMLInputElement;
  const chatStatusSelect = document.getElementById('chatStatus') as HTMLSelectElement;
  const toneSelect = document.getElementById('tone') as HTMLSelectElement;
  const systemPromptTextarea = document.getElementById('systemPrompt') as HTMLTextAreaElement;
  const modelSelect = document.getElementById('model') as HTMLSelectElement;
  const temperatureSlider = document.getElementById('temperature') as HTMLInputElement;
  const topPSlider = document.getElementById('topP') as HTMLInputElement;
  const maxTokensSlider = document.getElementById('maxTokens') as HTMLInputElement;
  const languageSelect = document.getElementById('language') as HTMLSelectElement;
  const versionTagInput = document.getElementById('versionTag') as HTMLInputElement;

  return {
    siteId: siteIdInput?.value || defaultConfig.siteId,
    siteName: siteNameInput?.value || defaultConfig.siteName,
    chatStatus: (chatStatusSelect?.value as any) || defaultConfig.chatStatus,
    tone: (toneSelect?.value as any) || defaultConfig.tone,
    systemPrompt: systemPromptTextarea?.value || defaultConfig.systemPrompt,
    model: (modelSelect?.value as any) || defaultConfig.model,
    temperature: parseFloat(temperatureSlider?.value || '0.7'),
    topP: parseFloat(topPSlider?.value || '0.9'),
    maxTokens: parseInt(maxTokensSlider?.value || '2048'),
    language: (languageSelect?.value as any) || defaultConfig.language,
    versionTag: versionTagInput?.value || defaultConfig.versionTag
  };
};

// Función para generar el prompt final basado en el tono
export const generateFinalPrompt = (config: ChatConfig): string => {
  const basePrompt = config.systemPrompt;
  const toneInstructions = getToneInstructions(config.tone);
  const styleInstructions = config.styleInstructions;
  
  return `${basePrompt}

${toneInstructions}

${styleInstructions}

PROMPTS ESPECÍFICOS:
- Productos: ${config.productPrompt}
- Soporte: ${config.supportPrompt}
- Ventas: ${config.salesPrompt}`;
};

// Función para obtener instrucciones de tono
export const getToneInstructions = (tone: string): string => {
  const toneInstructions: Record<string, string> = {
    friendly: 'Comunícate de manera cercana y amigable. Usa un lenguaje cálido y accesible. Incluye emojis ocasionalmente para hacer la conversación más agradable.',
    premium: 'Mantén un tono sofisticado y elegante. Usa un lenguaje refinado y profesional. Destaca la calidad y exclusividad de los productos.',
    technical: 'Sé preciso y técnico en tus explicaciones. Proporciona detalles específicos y datos concretos. Usa terminología profesional cuando sea apropiado.',
    casual: 'Habla de manera relajada y informal. Usa un lenguaje cotidiano y cercano. Haz que la conversación se sienta natural y sin formalidades.',
    professional: 'Mantén un tono formal y empresarial. Usa un lenguaje claro y directo. Sé eficiente y orientado a resultados.'
  };
  
  return toneInstructions[tone] || toneInstructions.friendly;
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
