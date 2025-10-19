// src/lib/configStorage.ts
import { ChatConfig } from './config';
import { 
  saveConfigurationToSupabase, 
  loadConfigurationFromSupabase,
  type ChatConfiguration 
} from './supabaseConfig';

const CONFIG_STORAGE_KEY = 'ai-chat-config';

// Convertir ChatConfiguration de Supabase a ChatConfig local
const convertSupabaseToLocal = (supabaseConfig: ChatConfiguration): ChatConfig => {
  return {
    siteId: supabaseConfig.site_id,
    siteName: supabaseConfig.site_name,
    chatStatus: supabaseConfig.chat_status,
    tone: supabaseConfig.tone,
    systemPrompt: supabaseConfig.system_prompt,
    model: supabaseConfig.model,
    temperature: supabaseConfig.temperature,
    topP: supabaseConfig.top_p,
    maxTokens: supabaseConfig.max_tokens,
    language: supabaseConfig.language,
    versionTag: supabaseConfig.version_tag
  };
};

// Convertir ChatConfig local a formato de Supabase
const convertLocalToSupabase = (localConfig: ChatConfig): Partial<ChatConfiguration> => {
  return {
    site_id: localConfig.siteId,
    site_name: localConfig.siteName,
    chat_status: localConfig.chatStatus,
    tone: localConfig.tone,
    system_prompt: localConfig.systemPrompt,
    model: localConfig.model,
    temperature: localConfig.temperature,
    top_p: localConfig.topP,
    max_tokens: localConfig.maxTokens,
    language: localConfig.language,
    version_tag: localConfig.versionTag
  };
};

// Guardar configuración en Supabase (principal) y localStorage (backup)
export const saveConfig = async (config: ChatConfig): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('💾 Guardando configuración:', config);

    // Guardar en Supabase
    const supabaseResult = await saveConfigurationToSupabase(convertLocalToSupabase(config));
    
    if (supabaseResult.success) {
      console.log('✅ Configuración guardada en Supabase');
      
      // También guardar en localStorage como backup
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        console.log('✅ Backup guardado en localStorage');
      } catch (localError) {
        console.warn('⚠️ No se pudo guardar backup en localStorage:', localError);
      }
      
      return { success: true };
    } else {
      console.error('❌ Error al guardar en Supabase:', supabaseResult.error);
      
      // Fallback: guardar solo en localStorage
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
        console.log('⚠️ Guardado solo en localStorage como fallback');
        return { 
          success: true, 
          error: `Guardado en localStorage (Supabase falló: ${supabaseResult.error})` 
        };
      } catch (localError) {
        return { 
          success: false, 
          error: `Error al guardar: Supabase (${supabaseResult.error}) y localStorage (${localError})` 
        };
      }
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return { 
      success: false, 
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    };
  }
};

// Cargar configuración desde Supabase (principal) o localStorage (fallback)
export const loadConfig = async (siteId?: string): Promise<ChatConfig | null> => {
  try {
    console.log('📥 Cargando configuración para siteId:', siteId || 'default');

    // Intentar cargar desde Supabase primero
    const supabaseResult = await loadConfigurationFromSupabase(siteId);
    
    if (supabaseResult.success && supabaseResult.configuration) {
      console.log('✅ Configuración cargada desde Supabase');
      return convertSupabaseToLocal(supabaseResult.configuration);
    }

    console.log('⚠️ No se pudo cargar desde Supabase, intentando localStorage...');
    
    // Fallback: cargar desde localStorage
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const config = JSON.parse(saved);
        console.log('✅ Configuración cargada desde localStorage');
        return config;
      }
    } catch (localError) {
      console.error('❌ Error al cargar desde localStorage:', localError);
    }

    console.log('❌ No se encontró configuración en ningún lugar');
    return null;

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return null;
  }
};

// Aplicar configuración cargada a los inputs del DOM
export const applyConfigToDOM = (config: ChatConfig): void => {
  const siteIdInput = document.getElementById('siteId') as HTMLInputElement;
  const siteNameInput = document.getElementById('siteName') as HTMLInputElement;
  const chatStatusSelect = document.getElementById('chatStatus') as HTMLSelectElement;
  const toneSelect = document.getElementById('tone') as HTMLSelectElement;
  const systemPromptTextarea = document.getElementById('system-prompt') as HTMLTextAreaElement;
  const modelSelect = document.getElementById('model') as HTMLSelectElement;
  const temperatureSlider = document.getElementById('temperature') as HTMLInputElement;
  const topPSlider = document.getElementById('topP') as HTMLInputElement;
  const maxTokensSlider = document.getElementById('maxTokens') as HTMLInputElement;
  const languageSelect = document.getElementById('language') as HTMLSelectElement;
  const versionTagInput = document.getElementById('versionTag') as HTMLInputElement;

  if (siteIdInput) siteIdInput.value = config.siteId;
  if (siteNameInput) siteNameInput.value = config.siteName;
  if (chatStatusSelect) chatStatusSelect.value = config.chatStatus;
  if (toneSelect) toneSelect.value = config.tone;
  if (systemPromptTextarea) systemPromptTextarea.value = config.systemPrompt;
  if (modelSelect) modelSelect.value = config.model;
  if (temperatureSlider) temperatureSlider.value = config.temperature.toString();
  if (topPSlider) topPSlider.value = config.topP.toString();
  if (maxTokensSlider) maxTokensSlider.value = config.maxTokens.toString();
  if (languageSelect) languageSelect.value = config.language;
  if (versionTagInput) versionTagInput.value = config.versionTag;
};

// Resetear configuración a valores por defecto
export const resetConfig = async (): Promise<void> => {
  try {
    // Eliminar de Supabase
    const siteId = (document.getElementById('siteId') as HTMLInputElement)?.value || 'default';
    const { error } = await import('./supabaseConfig').then(module => 
      module.deleteConfiguration(siteId)
    );
    
    if (error) {
      console.warn('⚠️ No se pudo eliminar configuración de Supabase:', error);
    }
  } catch (error) {
    console.warn('⚠️ Error al eliminar configuración de Supabase:', error);
  }

  // Eliminar de localStorage
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  
  // Recargar la página para aplicar valores por defecto
  window.location.reload();
};
