import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface ChatConfiguration {
  id: string;
  site_id: string;
  site_name: string;
  chat_status: 'active' | 'testing' | 'inactive';
  tone: 'friendly' | 'premium' | 'technical' | 'casual' | 'professional';
  system_prompt: string;
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini';
  temperature: number;
  top_p: number;
  max_tokens: number;
  language: 'es' | 'en' | 'pt' | 'fr' | 'de';
  version_tag: string;
  created_at: string;
  updated_at: string;
}

export interface SaveConfigurationResponse {
  success: boolean;
  configuration?: ChatConfiguration;
  error?: string;
}

export interface LoadConfigurationResponse {
  success: boolean;
  configuration?: ChatConfiguration;
  error?: string;
}

// Guardar configuración en Supabase
export const saveConfigurationToSupabase = async (
  config: Partial<ChatConfiguration>
): Promise<SaveConfigurationResponse> => {
  try {
    console.log('💾 Guardando configuración en Supabase:', config);

    // Si no hay site_id, usar 'default'
    const siteId = config.site_id || 'default';

    // Intentar actualizar primero
    const { data: existingData, error: selectError } = await supabase
      .from('chat_configurations')
      .select('id')
      .eq('site_id', siteId)
      .single();

    let result;

    if (existingData && !selectError) {
      // Actualizar configuración existente
      const { data, error } = await supabase
        .from('chat_configurations')
        .update({
          site_name: config.site_name,
          chat_status: config.chat_status,
          tone: config.tone,
          system_prompt: config.system_prompt,
          model: config.model,
          temperature: config.temperature,
          top_p: config.top_p,
          max_tokens: config.max_tokens,
          language: config.language,
          version_tag: config.version_tag,
          updated_at: new Date().toISOString()
        })
        .eq('site_id', siteId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error al actualizar configuración:', error);
        return {
          success: false,
          error: `Error al actualizar configuración: ${error.message}`
        };
      }

      result = data;
      console.log('✅ Configuración actualizada:', result);
    } else {
      // Crear nueva configuración
      const { data, error } = await supabase
        .from('chat_configurations')
        .insert({
          site_id: siteId,
          site_name: config.site_name || 'Mi Sitio',
          chat_status: config.chat_status || 'active',
          tone: config.tone || 'friendly',
          system_prompt: config.system_prompt || 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
          model: config.model || 'gpt-4o-mini',
          temperature: config.temperature || 0.7,
          top_p: config.top_p || 0.9,
          max_tokens: config.max_tokens || 2048,
          language: config.language || 'es',
          version_tag: config.version_tag || 'v1.0'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error al crear configuración:', error);
        return {
          success: false,
          error: `Error al crear configuración: ${error.message}`
        };
      }

      result = data;
      console.log('✅ Configuración creada:', result);
    }

    return {
      success: true,
      configuration: result
    };

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Cargar configuración desde Supabase
export const loadConfigurationFromSupabase = async (
  siteId: string = 'default'
): Promise<LoadConfigurationResponse> => {
  try {
    console.log('📥 Cargando configuración desde Supabase para site_id:', siteId);

    const { data, error } = await supabase
      .from('chat_configurations')
      .select('*')
      .eq('site_id', siteId)
      .single();

    if (error) {
      console.error('❌ Error al cargar configuración:', error);
      
      // Si no existe la configuración, intentar cargar la por defecto
      if (error.code === 'PGRST116') {
        console.log('🔄 Configuración no encontrada, cargando configuración por defecto...');
        return await loadConfigurationFromSupabase('default');
      }
      
      return {
        success: false,
        error: `Error al cargar configuración: ${error.message}`
      };
    }

    console.log('✅ Configuración cargada:', data);
    return {
      success: true,
      configuration: data
    };

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Obtener todas las configuraciones
export const getAllConfigurations = async (): Promise<{
  success: boolean;
  configurations?: ChatConfiguration[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('chat_configurations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Error al cargar configuraciones: ${error.message}`
      };
    }

    return {
      success: true,
      configurations: data || []
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Eliminar configuración
export const deleteConfiguration = async (siteId: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from('chat_configurations')
      .delete()
      .eq('site_id', siteId);

    if (error) {
      return {
        success: false,
        error: `Error al eliminar configuración: ${error.message}`
      };
    }

    return {
      success: true
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};
