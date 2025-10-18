// src/lib/chat.ts
import { callOpenAI, getDocumentationInfoForPrompt } from './openai';
import { getCurrentConfig, applyToneToResponse, applyLanguageToResponse, limitTokens } from './config';
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
      answer: applyToneToResponse(
        applyLanguageToResponse(
          "El chat está actualmente desactivado. Por favor, activa el chat en la configuración para poder ayudarte.",
          config.language
        ),
        config.tone,
        config.language
      )
    };
  }

  // Usar OpenAI con el system prompt personalizado
  try {
    // Obtener información adicional de documentación
    const documentationInfo = await getDocumentationInfoForPrompt();
    
    // Construir system prompt mejorado con documentación
    const enhancedSystemPrompt = `${config.systemPrompt}

${documentationInfo}

IMPORTANTE: Usa SOLO la información proporcionada en el catálogo y documentación. Si no tienes información específica sobre algo, di que no tienes esa información disponible.`;

    // Llamar a OpenAI
    const openaiResponse = await callOpenAI(message, enhancedSystemPrompt);
    
    if ('error' in openaiResponse) {
      // Si hay error con OpenAI, mostrar mensaje de error
      return {
        answer: `❌ Error: ${openaiResponse.error}`
      };
    }

    // Aplicar configuración de tono e idioma a la respuesta de OpenAI
    const processedResponse = applyToneToResponse(
      applyLanguageToResponse(openaiResponse.answer, config.language),
      config.tone,
      config.language
    );

    return { 
      answer: limitTokens(processedResponse, config.maxTokens),
      usage: openaiResponse.usage
    };

  } catch (error) {
    console.error('Error en testChat:', error);
    return {
      answer: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}