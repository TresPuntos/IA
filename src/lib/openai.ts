// src/lib/openai.ts
import { getCurrentConfig } from './config';

export interface OpenAIResponse {
  answer: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIError {
  error: string;
  code?: string;
}

// Función para obtener la API key de OpenAI desde localStorage o variables de entorno
const getOpenAIKey = (): string => {
  // Primero intentar desde localStorage (configurado desde el dashboard)
  const localKey = localStorage.getItem('openai_api_key');
  if (localKey) return localKey;
  
  // Luego intentar desde variables de entorno
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey) return envKey;
  
  // Si no hay ninguna, retornar string vacío para mostrar error
  return '';
};

// Función principal para hacer llamadas a OpenAI
export const callOpenAI = async (
  message: string,
  systemPrompt?: string
): Promise<OpenAIResponse | OpenAIError> => {
  try {
    const config = getCurrentConfig();
    const apiKey = getOpenAIKey();
    
    if (!apiKey) {
      return {
        error: 'API key de OpenAI no configurada. Por favor, configura tu API key en el panel de configuración de OpenAI.'
      };
    }

    // Construir el system prompt con información del catálogo
    const catalogInfo = await getCatalogInfoForPrompt();
    const enhancedSystemPrompt = `${systemPrompt || config.systemPrompt}

INFORMACIÓN DEL CATÁLOGO DISPONIBLE:
${catalogInfo}

INSTRUCCIONES:
- Usa SOLO la información del catálogo proporcionado arriba
- Si no encuentras información relevante en el catálogo, di que no tienes esa información disponible
- Sé específico con nombres de productos, precios y descripciones
- Mantén el tono configurado: ${config.tone}
- Responde en ${config.language === 'es' ? 'español' : config.language === 'en' ? 'inglés' : config.language}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: enhancedSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: config.temperature,
        top_p: config.topP,
        max_tokens: config.maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: `Error de OpenAI API: ${errorData.error?.message || response.statusText}`,
        code: errorData.error?.code
      };
    }

    const data = await response.json();
    
    return {
      answer: data.choices[0]?.message?.content || 'No se pudo generar respuesta',
      usage: data.usage
    };

  } catch (error) {
    return {
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Función para obtener información del catálogo para incluir en el prompt
const getCatalogInfoForPrompt = async (): Promise<string> => {
  try {
    // Importar dinámicamente para evitar dependencias circulares
    const { getProducts } = await import('./productCatalog');
    const products = await getProducts();
    
    if (products.length === 0) {
      return 'No hay productos disponibles en el catálogo.';
    }

    // Formatear productos para el prompt
    const productsInfo = products.map(product => 
      `- ${product.name}: ${product.price}€ | ${product.description || 'Sin descripción'} | Categoría: ${product.category || 'Sin categoría'} | SKU: ${product.sku || 'N/A'}`
    ).join('\n');

    return `PRODUCTOS DISPONIBLES (${products.length} productos):
${productsInfo}

CATEGORÍAS DISPONIBLES:
${[...new Set(products.map(p => p.category).filter(Boolean))].join(', ')}`;

  } catch (error) {
    console.error('Error al obtener información del catálogo:', error);
    return 'Error al obtener información del catálogo.';
  }
};

// Función para obtener información de documentación para incluir en el prompt
export const getDocumentationInfoForPrompt = async (): Promise<string> => {
  try {
    const { getDocumentationFiles } = await import('./documentation');
    const docs = await getDocumentationFiles();
    
    if (docs.length === 0) {
      return 'No hay documentación adicional disponible.';
    }

    const docsInfo = docs.map(doc => 
      `- ${doc.name} (${doc.file_type.toUpperCase()}): ${doc.content.substring(0, 200)}...`
    ).join('\n');

    return `DOCUMENTACIÓN ADICIONAL DISPONIBLE (${docs.length} archivos):
${docsInfo}`;

  } catch (error) {
    console.error('Error al obtener documentación:', error);
    return 'Error al obtener documentación.';
  }
};
