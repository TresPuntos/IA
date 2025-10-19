// src/lib/chat.ts
import { callSupabaseChat } from './supabaseChat';
import { applyLanguageToResponse, limitTokens } from './config';
import { loadConfig } from './configStorage';

export async function testChat(site_id: string, message: string) {
  // Cargar la configuración actual del usuario
  console.log('🔍 DEBUG: Cargando configuración del usuario para testChat...');
  const userConfig = await loadConfig('default');
  
  // Usar configuración del usuario o valores por defecto
  const config = userConfig || {
    siteId: 'default',
    siteName: 'Mi Tienda',
    chatStatus: 'active',
    systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
    tone: 'friendly',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    language: 'es',
    versionTag: 'v1.0'
  };
  
  console.log('🎯 Usando System Prompt del usuario:', config.systemPrompt);
  
  // Verificar consultas sobre configuración
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('configuración') || lowerMessage.includes('config') || lowerMessage.includes('settings')) {
    const configSummary = `Configuración actual:
- Estado del chat: ${config.chatStatus}
- Idioma: ${config.language}
- Tokens máximos: ${config.maxTokens}
- Modelo: ${config.model}
- Temperatura: ${config.temperature}`;
    
    const promptPreview = config.systemPrompt.length > 100 
      ? config.systemPrompt.substring(0, 100) + '...'
      : config.systemPrompt;
    
    const response = `${configSummary}\n\n📝 System Prompt Principal:\n"${promptPreview}"`;
    
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
    // Llamar a la Edge Function de Supabase con la configuración del usuario
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