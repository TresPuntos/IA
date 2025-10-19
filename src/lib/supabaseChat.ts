// src/lib/supabaseChat.ts
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
    // Usar valores por defecto en lugar de getCurrentConfig
    const defaultConfig = {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      language: 'es',
      tone: 'friendly',
      model: 'gpt-4o-mini',
      systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.'
    };
    
    console.log('🔍 DEBUG: Llamando a Supabase Edge Function...');
    console.log('📝 Mensaje:', message);
    console.log('⚙️ Configuración:', {
      temperature: defaultConfig.temperature,
      topP: defaultConfig.topP,
      maxTokens: defaultConfig.maxTokens,
      language: defaultConfig.language,
      tone: defaultConfig.tone
    });

    // Llamar a la Edge Function de Supabase
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        message,
        systemPrompt: systemPrompt || defaultConfig.systemPrompt,
        model: defaultConfig.model,
        temperature: defaultConfig.temperature,
        topP: defaultConfig.topP,
        maxTokens: defaultConfig.maxTokens,
        language: defaultConfig.language,
        tone: defaultConfig.tone
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
