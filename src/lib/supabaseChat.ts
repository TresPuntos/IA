// src/lib/supabaseChat.ts
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { loadConfig } from './configStorage';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface ChatResponse {
  answer: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatError {
  error: string;
  code?: string;
}

// Función principal para hacer llamadas al chat usando Supabase Edge Function
export const callSupabaseChat = async (
  message: string,
  systemPrompt?: string
): Promise<ChatResponse | ChatError> => {
  try {
    // Cargar la configuración actual del usuario
    console.log('🔍 DEBUG: Cargando configuración del usuario...');
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
    
    console.log('🔍 DEBUG: Llamando a Supabase Edge Function...');
    console.log('📝 Mensaje:', message);
    console.log('🎯 System Prompt del usuario:', config.systemPrompt);
    console.log('⚙️ Configuración completa:', {
      temperature: config.temperature,
      topP: config.topP,
      maxTokens: config.maxTokens,
      language: config.language,
      tone: config.tone,
      model: config.model
    });

    // Llamar a la Edge Function de Supabase con la configuración del usuario
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message,
        systemPrompt: systemPrompt || config.systemPrompt, // Usar el System Prompt Principal del usuario
        model: config.model,
        temperature: config.temperature,
        topP: config.topP,
        maxTokens: config.maxTokens,
        language: config.language,
        tone: config.tone
      }
    });

    console.log('📡 Respuesta de Supabase:', { data, error });

    if (error) {
      console.error('❌ Error de Supabase:', error);
      return {
        error: `Error en Supabase Edge Function: ${error.message}`
      };
    }

    if (data.error) {
      console.error('❌ Error en datos:', data.error);
      return {
        error: data.error,
        code: data.code
      };
    }

    console.log('✅ Respuesta exitosa:', data);
    return {
      answer: data.answer,
      usage: data.usage
    };

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return {
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};
