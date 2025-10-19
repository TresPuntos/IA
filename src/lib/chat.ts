// src/lib/chat.ts
import { callSupabaseChat } from './supabaseChat';
import { applyLanguageToResponse, limitTokens } from './config';

export async function testChat(site_id: string, message: string) {
  // Usar valores por defecto en lugar de getCurrentConfig
  const defaultConfig = {
    chatStatus: 'active',
    language: 'es',
    maxTokens: 2048,
    systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.'
  };
  
  // Verificar consultas sobre configuración
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('configuración') || lowerMessage.includes('config') || lowerMessage.includes('settings')) {
    const configSummary = `Configuración actual:
- Estado del chat: ${defaultConfig.chatStatus}
- Idioma: ${defaultConfig.language}
- Tokens máximos: ${defaultConfig.maxTokens}`;
    
    const promptPreview = defaultConfig.systemPrompt.length > 100 
      ? defaultConfig.systemPrompt.substring(0, 100) + '...'
      : defaultConfig.systemPrompt;
    
    const response = `${configSummary}\n\n📝 System Prompt:\n"${promptPreview}"`;
    
    return { 
      answer: limitTokens(response, defaultConfig.maxTokens)
    };
  }
  
  // Verificar si el chat está activo
  if (defaultConfig.chatStatus === 'inactive') {
    return { 
      answer: applyLanguageToResponse(
        "El chat está actualmente desactivado. Por favor, activa el chat en la configuración para poder ayudarte.",
        defaultConfig.language
      )
    };
  }

  // Usar Supabase Edge Function (más seguro)
  try {
    // Llamar a la Edge Function de Supabase
    const chatResponse = await callSupabaseChat(message, defaultConfig.systemPrompt);
    
    if ('error' in chatResponse) {
      // Si hay error, mostrar mensaje de error
      return {
        answer: `❌ Error: ${chatResponse.error}`
      };
    }

    // Aplicar configuración de idioma a la respuesta
    const processedResponse = applyLanguageToResponse(
      chatResponse.answer, 
      defaultConfig.language
    );

    return { 
      answer: limitTokens(processedResponse, defaultConfig.maxTokens),
      usage: chatResponse.usage
    };

  } catch (error) {
    console.error('Error en testChat:', error);
    return {
      answer: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}