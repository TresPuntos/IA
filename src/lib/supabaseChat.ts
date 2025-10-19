// src/lib/supabaseChat.ts
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { loadConfig } from './configStorage';
import { generateFinalPrompt } from './config';
import { generateCatalogPrompt } from './catalog';

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
    let config = userConfig;
    
    if (!config || !config.systemPrompts) {
      console.log('⚠️ Configuración incompleta, usando defaultConfig');
      const { defaultConfig } = await import('./config');
      config = defaultConfig;
    }
    
    // Generar catálogo dinámico desde localStorage
    let catalogPrompt = '';
    try {
      const savedProducts = localStorage.getItem('catalog-products');
      const savedCategories = localStorage.getItem('catalog-categories');
      
      if (savedProducts && savedCategories) {
        const products = JSON.parse(savedProducts);
        const categories = JSON.parse(savedCategories);
        catalogPrompt = generateCatalogPrompt(products, categories);
      }
    } catch (error) {
      console.error('Error loading catalog:', error);
    }

    // Generar el prompt final basado en el tono seleccionado
    const finalSystemPrompt = generateFinalPrompt(config, catalogPrompt);
    
    console.log('🔍 DEBUG: Llamando a Supabase Edge Function...');
    console.log('📝 Mensaje:', message);
    console.log('🎯 System Prompt generado:', finalSystemPrompt);
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
        systemPrompt: systemPrompt || finalSystemPrompt, // Usar el System Prompt generado del usuario
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
