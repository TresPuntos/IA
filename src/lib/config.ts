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
  
  // PROMPT PRINCIPAL ÚNICO - Solo información esencial y nuevas instrucciones
  systemPrompt: `Eres un asistente especializado en herramientas de cocina profesional para 100%Chef. Ayudas a chefs, cocineros y barmen a encontrar el equipo perfecto para sus necesidades culinarias.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo completo: maquinaria, herramientas, técnicas, servicio de mesa, cristalería, catering
- Productos para cocina molecular, gastronomía profesional y coctelería avanzada
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

INSTRUCCIONES NUEVAS:
- Proporciona opciones específicas cuando te pregunten por productos
- NO preguntes "¿qué tipo buscas?" si ya te han dado una categoría específica
- Habla de beneficios, usos y características especiales de los productos
- Sugiere casos de uso o combinaciones con otros productos
- Pregunta si necesita más información o productos relacionados`,
  
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

// Función simplificada para generar el prompt final
export const generateFinalPrompt = (config: ChatConfig, catalogPrompt?: string): string => {
  if (!config || !config.systemPrompt) {
    console.error('❌ Error: Configuración incompleta');
    return 'Eres un asistente especializado en ayudar a clientes a encontrar productos.';
  }

  const systemPrompt = config.systemPrompt;
  const urlInfo = config.clientUrl ? `\n\nINFORMACIÓN ADICIONAL DEL CLIENTE:\n- Sitio web: ${config.clientUrl}` : '';
  const catalogInfo = catalogPrompt ? `\n\n${catalogPrompt}` : '';
  
  return `${systemPrompt}${urlInfo}${catalogInfo}`;
};
