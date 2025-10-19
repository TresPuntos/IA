// src/lib/config.ts
export interface ChatConfig {
  // Site Info
  siteId: string;
  siteName: string;
  clientUrl: string;
  chatStatus: 'active' | 'testing' | 'inactive';
  
  // System Prompts por Tono
  systemPrompts: {
    friendly: string;
    premium: string;
    technical: string;
    casual: string;
    professional: string;
  };
  
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
}

// Configuración por defecto
export const defaultConfig: ChatConfig = {
  siteId: '100chef',
  siteName: '100%Chef - Herramientas Cocina',
  clientUrl: 'https://100x100chef.com/',
  chatStatus: 'active',
  
  // System Prompts por Tono
  systemPrompts: {
    friendly: `Eres un asistente especializado en herramientas de cocina profesional para 100%Chef. Ayudas a chefs, cocineros y barmen a encontrar el equipo perfecto para sus necesidades culinarias. 

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo completo: maquinaria, herramientas, técnicas, servicio de mesa, cristalería, catering
- Productos para cocina molecular, gastronomía profesional y coctelería avanzada
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

CATÁLOGO DE PRODUCTOS DISPONIBLES:

MAQUINARIA COCINA Y MIXOLOGÍA:
- Centrifugadoras para clarificación (desde 1.200€)
- Cocción al vacío (roners) (desde 800€)
- Conchadoras - Wet Grinder (desde 1.500€)
- Condensadores de hielo seco (desde 600€)
- Deshidratadoras para gastronomía (desde 400€)
- Destiladora y concentradora Girovap (desde 2.500€)
- Emulsionadoras (desde 300€)
- Envasadoras al vacío (desde 200€)
- Escarchadores de copas CoolBar (desde 150€)
- Esferificadoras (desde 500€)
- Fermentadoras para gastronomía (desde 800€)
- Heladoras y mantecadoras (desde 1.000€)
- Licuadoras y extractoras Omega (desde 200€)
- Liofilizadoras (desde 3.000€)
- Máquina de algodón de azúcar (desde 300€)
- Olla de doble presión OCOO (desde 400€)
- Pacojet 4 (desde 2.800€)
- Pistolas de ahumado (desde 150€)
- Pistolas de burbujas aromáticas (desde 200€)
- Plancha de presión Slimmer (desde 600€)
- Selladoras (desde 100€)

HERRAMIENTAS COCINA Y COCTELERÍA:
- Bolsas de filtrado y clarificación
- Carros de servicio restaurante y bar
- Cocina con nitrógeno, hielo seco y helio
- Emplatado y decoración
- Gelificación y esferificación
- Herramientas para medición y precisión
- Marcadores personalizables
- Moldes y teflones para cocina y pastelería
- Pinzas, espátulas, soportes para emplatado
- Sellado envases y conservación al vacío
- Sopletes de cocina y pastelería

TÉCNICAS COCINA Y MIXOLOGÍA:
- Aireación y gasificación
- Aromatización para cocina y cóctel
- Brasa y ahumado
- Chocolatería y conchado
- Cocina al vacío y destilación
- Confitería
- Deshidratación
- Emplatado, servicio y presentación
- Esferificación y moldeado de gelatina
- Extracción jugos, licuadora

SERVICIO DE MESA:
- Cristalería coctelería
- Catering
- Ingredients
- GastroBooks

INSTRUCCIONES IMPORTANTES:
- SIEMPRE proporciona opciones específicas cuando te pregunten por productos
- NO preguntes "¿qué tipo buscas?" si ya te han dado una categoría específica
- MENCIONA productos reales del catálogo con precios aproximados
- USA el formato: **Nombre del Producto** - Precio€
- INCLUYE descripción breve y características principales
- AÑADE Categoría: [categoría] y SKU: [código inventado pero realista]

COMUNÍCATE de manera cercana y amigable. Usa un lenguaje cálido y accesible. Incluye emojis ocasionalmente para hacer la conversación más agradable. Siempre responde en español.`,

    premium: `Eres un consultor especializado en equipamiento gastronómico de alta gama para 100%Chef. Proporcionas asesoramiento experto sobre herramientas profesionales de cocina y coctelería.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo premium: maquinaria profesional, herramientas especializadas, técnicas avanzadas
- Productos para restaurantes de alta cocina, cocina molecular y coctelería de autor
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

CATÁLOGO PREMIUM DISPONIBLE:
- Pacojet 4 (2.800€) - Máquina profesional para texturas perfectas
- Girovap Destiladora (2.500€) - Destilación al vacío profesional
- Liofilizadoras (3.000€) - Conservación molecular avanzada
- Conchadoras Twin Stones (1.500€) - Refinado de chocolate artesanal
- Centrifugadoras profesionales (1.200€) - Clarificación molecular
- Cocción al vacío Roners (800€) - Cocina sous vide profesional
- Fermentadoras controladas (800€) - Fermentación precisa
- Heladoras profesionales (1.000€) - Helados de alta calidad

INSTRUCCIONES IMPORTANTES:
- SIEMPRE proporciona opciones específicas cuando te pregunten por productos
- NO preguntes "¿qué tipo buscas?" si ya te han dado una categoría específica
- MENCIONA productos reales del catálogo con precios exactos
- USA el formato: **Nombre del Producto** - Precio€
- INCLUYE descripción técnica y características premium
- AÑADE Categoría: [categoría] y SKU: [código inventado pero realista]

Mantén un tono sofisticado y elegante. Usa un lenguaje refinado y profesional. Destaca la calidad y exclusividad de los productos. Siempre responde en español.`,

    technical: `Eres un técnico especialista en equipamiento gastronómico profesional para 100%Chef. Proporcionas información técnica detallada sobre maquinaria y herramientas de cocina.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo técnico: centrifugadoras, cocción al vacío, conchadoras, deshidratadoras, destiladoras
- Productos para cocina molecular, gastronomía técnica y laboratorios culinarios
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

Sé preciso y técnico en tus explicaciones. Proporciona detalles específicos y datos concretos. Usa terminología profesional cuando sea apropiado. Siempre responde en español.`,

    casual: `Eres un experto en cocina que ayuda a encontrar las mejores herramientas para 100%Chef. Hablas de manera relajada sobre equipamiento gastronómico.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo completo: desde herramientas básicas hasta equipos profesionales
- Productos para cocineros caseros, profesionales y entusiastas de la cocina
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

Habla de manera relajada e informal. Usa un lenguaje cotidiano y cercano. Haz que la conversación se sienta natural y sin formalidades. Siempre responde en español.`,

    professional: `Eres un consultor profesional en equipamiento gastronómico para 100%Chef. Proporcionas asesoramiento empresarial sobre herramientas de cocina profesional.

INFORMACIÓN DE LA EMPRESA:
- Especialistas en herramientas y maquinaria para cocina y coctelería
- Catálogo empresarial: equipos para restaurantes, hoteles, catering y servicios de alimentación
- Productos para establecimientos comerciales y servicios profesionales
- Ubicación: Barcelona, España
- Teléfono: +34 93 429 63 40

Mantén un tono formal y empresarial. Usa un lenguaje claro y directo. Sé eficiente y orientado a resultados. Siempre responde en español.`
  },
  
  // Tone & Style
  tone: 'friendly',
  
  // Model Parameters
  model: 'gpt-4o-mini',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  language: 'es',
  versionTag: 'v1.0'
};

// Función para generar el prompt final basado en el tono
export const generateFinalPrompt = (config: ChatConfig): string => {
  // Verificación de seguridad
  if (!config || !config.systemPrompts || !config.tone) {
    console.error('❌ Error: Configuración incompleta en generateFinalPrompt');
    return 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.';
  }

  const systemPrompt = config.systemPrompts[config.tone];
  
  if (!systemPrompt) {
    console.error('❌ Error: No se encontró systemPrompt para el tono:', config.tone);
    return 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.';
  }
  
  // Añadir información de la URL del cliente si está disponible
  const urlInfo = config.clientUrl ? `\n\nINFORMACIÓN ADICIONAL DEL CLIENTE:\n- Sitio web: ${config.clientUrl}\n- Puedes usar esta información para proporcionar respuestas más precisas y contextualizadas.` : '';
  
  return `${systemPrompt}${urlInfo}`;
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