// src/lib/chat.ts
import { callSupabaseChat } from './supabaseChat';
import { getCurrentConfig, applyLanguageToResponse, limitTokens } from './config';
import { getConfigSummary, getSystemPromptPreview } from './chatConfigDisplay';

export async function testChat(site_id: string, message: string) {
  // Obtener configuración actual del dashboard
  const config = getCurrentConfig();
  
  // Verificar consultas sobre configuración
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('configuración') || lowerMessage.includes('config') || lowerMessage.includes('settings')) {
    const configSummary = getConfigSummary(config);
    const promptPreview = getSystemPromptPreview(config.systemPrompt);
    
    const response = `${configSummary}\n\n📝 System Prompt:\n"${promptPreview}"`;
    
    return { 
      answer: limitTokens(response, config.maxTokens)
    };
  }
  
  // Verificar si el chat está activo
  if (config.chatStatus === 'inactive') {
    return { 
      answer: applyLanguageToResponse(
        "El chat está actualmente desactivado. Por favor, activa el chat en la configuración para poder ayudarte.",
        config.language
      )
    };
  }

  // Usar Supabase Edge Function (más seguro)
  try {
    // Llamar a la Edge Function de Supabase
    const chatResponse = await callSupabaseChat(message, config.systemPrompt);
    
    if ('error' in chatResponse) {
      // Si hay error, mostrar mensaje de error
      return {
        answer: `❌ Error: ${chatResponse.error}`
      };
    }

    // Aplicar configuración de idioma a la respuesta
    const processedResponse = applyLanguageToResponse(
      chatResponse.answer, 
      config.language
    );

    return { 
      answer: limitTokens(processedResponse, config.maxTokens),
      usage: chatResponse.usage
    };

  } catch (error) {
    console.error('Error en testChat:', error);
    return {
      answer: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}