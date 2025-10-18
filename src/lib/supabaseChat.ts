// src/lib/supabaseChat.ts
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getCurrentConfig } from './config';

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
    const config = getCurrentConfig();
    
    console.log('🔍 DEBUG: Llamando a Supabase Edge Function...');
    console.log('📝 Mensaje:', message);
    console.log('⚙️ Configuración:', {
      temperature: config.temperature,
      topP: config.topP,
      maxTokens: config.maxTokens,
      language: config.language,
      tone: config.tone
    });

    // Llamar a la Edge Function de Supabase
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message,
        systemPrompt: systemPrompt || config.systemPrompt,
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
