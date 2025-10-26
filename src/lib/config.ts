// src/lib/config.ts
export interface ChatConfig {
  // Site Info
  siteId: string;
  siteName: string;
  clientUrl: string;
  chatStatus: 'active' | 'testing' | 'inactive';
  
  // PROMPT PRINCIPAL ÚNICO
  systemPrompt: string;
  
  // Tone & Style
  tone: 'friendly' | 'premium' | 'technical' | 'casual' | 'professional';
  
  // Model Parameters
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini';
  temperature: number;
  topP: number;
  maxTokens: number;
  language: 'es' | 'en' | 'pt' | 'fr' | 'de';
  
  // Additional settings
  versionTag: string;
   prestashopUrl?: string;
  prestashopApiKey?: string;
}

// Configuración por defecto
export const defaultConfig: ChatConfig = {
  siteId: '100chef',
  siteName: '100%Chef - Herramientas Cocina',
  clientUrl: 'https://100x100chef.com/',
  chatStatus: 'active',
  
  // PROMPT PRINCIPAL ÚNICO
  systemPrompt: `Eres un asistente especializado en herramientas de cocina profesional para 100%Chef. Ayudas a chefs, cocineros y barmen a encontrar el equipo perfecto para sus necesidades culinarias.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo completo: maquinaria, herramientas, técnicas, servicio de mesa, cristalería, catering
- Productos para cocina molecular, gastronomía profesional y coctelería avanzada
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

INSTRUCCIONES CRÍTICAS:
- SIEMPRE proporciona opciones específicas cuando te pregunten por productos
- NO preguntes "¿qué tipo buscas?" si ya te han dado una categoría específica
- MENCIONA productos reales del catálogo con precios aproximados
- USA el formato: **Nombre del Producto** - Precio€
- INCLUYE descripción breve y características principales
- AÑADE Categoría: [categoría] y SKU: [código inventado pero realista]
- SIEMPRE muestra primero la información del catálogo cuando encuentres un producto
- Crea tarjetas visuales con imagen y botón de compra cuando sea posible

COMUNÍCATE de manera cercana y amigable. Usa un lenguaje cálido y accesible. Incluye emojis ocasionalmente para hacer la conversación más agradable. Siempre responde en español.`,
  
  // Tone & Style
  tone: 'friendly',
  
  // Model Parameters
  model: 'gpt-4o-mini',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  language: 'es',
  versionTag: 'v2.0'
};

// Función para generar el prompt final usando el PROMPT PRINCIPAL ÚNICO
export const generateFinalPrompt = (config: ChatConfig, catalogPrompt?: string): string => {
  // Verificación de seguridad
  if (!config || !config.systemPrompt) {
    console.error('❌ Error: Configuración incompleta en generateFinalPrompt');
    return 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.';
  }

  // Usar el PROMPT PRINCIPAL ÚNICO
  const systemPrompt = config.systemPrompt;
  
  // Añadir información de la URL del cliente si está disponible
  const urlInfo = config.clientUrl ? `\n\nINFORMACIÓN ADICIONAL DEL CLIENTE:\n- Sitio web: ${config.clientUrl}\n- Puedes usar esta información para proporcionar respuestas más precisas y contextualizadas.` : '';
  
  // Añadir catálogo dinámico si está disponible
  const catalogInfo = catalogPrompt ? `\n\n${catalogPrompt}` : '';
  
  return `${systemPrompt}${urlInfo}${catalogInfo}`;
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
