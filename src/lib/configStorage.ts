// src/lib/configStorage.ts
import { ChatConfig } from './config';

const CONFIG_STORAGE_KEY = 'ai-chat-config';

// Guardar configuración en localStorage
export const saveConfig = (config: ChatConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    console.log('Configuración guardada:', config);
  } catch (error) {
    console.error('Error al guardar configuración:', error);
  }
};

// Cargar configuración desde localStorage
export const loadConfig = (): ChatConfig | null => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error);
  }
  return null;
};

// Aplicar configuración cargada a los inputs del DOM
export const applyConfigToDOM = (config: ChatConfig): void => {
  const siteIdInput = document.getElementById('siteId') as HTMLInputElement;
  const siteNameInput = document.getElementById('siteName') as HTMLInputElement;
  const chatStatusSelect = document.getElementById('chatStatus') as HTMLSelectElement;
  const toneSelect = document.getElementById('tone') as HTMLSelectElement;
  const systemPromptTextarea = document.getElementById('systemPrompt') as HTMLTextAreaElement;
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
export const resetConfig = (): void => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  // Recargar la página para aplicar valores por defecto
  window.location.reload();
};
