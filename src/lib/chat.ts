// src/lib/chat.ts
import { processProductQuery } from './chatIntegration';
import { getDocumentationFiles } from './documentation';
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

  // Solo usar datos locales - NO conectarse a internet
  
  // 1. Primero buscar productos en el catálogo local
  try {
    const productResponse = await processProductQuery(message, config.systemPrompt);
    if (productResponse && !productResponse.includes('No encuentro')) {
      const processedResponse = applyToneToResponse(
        applyLanguageToResponse(productResponse, config.language),
        config.tone,
        config.language
      );
      
      return { 
        answer: limitTokens(processedResponse, config.maxTokens)
      };
    }
  } catch (error) {
    console.log('Error en búsqueda de productos:', error);
  }

  // 2. Si no encuentra productos, buscar en documentación local
  try {
    const docs = await getDocumentationFiles();
    if (docs.length > 0) {
      // Buscar en el contenido de los documentos
      const relevantDocs = docs.filter(doc => 
        doc.content.toLowerCase().includes(message.toLowerCase()) ||
        doc.name.toLowerCase().includes(message.toLowerCase())
      );
      
      if (relevantDocs.length > 0) {
        const docInfo = relevantDocs.map(doc => 
          `• ${doc.name} (${doc.file_type.toUpperCase()})`
        ).join('\n');
        
        const response = `Encontré información relevante en estos documentos:\n\n${docInfo}\n\n¿Te gustaría que revise el contenido específico de algún documento?`;
        
        const processedResponse = applyToneToResponse(
          applyLanguageToResponse(response, config.language),
          config.tone,
          config.language
        );
        
        return { 
          answer: limitTokens(processedResponse, config.maxTokens)
        };
      }
    }
  } catch (error) {
    console.log('Error en búsqueda de documentación:', error);
  }

  // 3. Si no encuentra nada localmente, respuesta genérica basada en configuración
  const genericResponse = config.systemPrompt.includes('especializado') 
    ? "No encuentro información específica sobre tu consulta en el catálogo de productos ni en la documentación disponible. ¿Podrías ser más específico o verificar que los datos estén cargados?"
    : "No encuentro información específica sobre tu consulta. ¿Podrías ser más específico?";

  const processedResponse = applyToneToResponse(
    applyLanguageToResponse(genericResponse, config.language),
    config.tone,
    config.language
  );

  return { 
    answer: limitTokens(processedResponse, config.maxTokens)
  };
}