import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86b0e188`;

export interface ChatConfig {
  siteId: string;
  siteName: string;
  domain: string;
  status: 'testing' | 'live';
  tone: string;
  systemPrompt: string;
  styleInstructions: string;
  catalogSource: string;
  catalogUrl: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  language: string;
  welcomeMessage: string;
  fallbackMessage: string;
  versionTag: string;
  updatedAt?: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }

  return response.json();
}

export async function saveConfig(config: ChatConfig) {
  return fetchAPI('/config/save', {
    method: 'POST',
    body: JSON.stringify({
      siteId: config.siteId,
      config,
    }),
  });
}

export async function getConfig(siteId: string) {
  return fetchAPI(`/config/${siteId}`);
}

export async function getAllConfigs() {
  return fetchAPI('/config');
}

export async function duplicateConfig(sourceSiteId: string, newSiteId: string) {
  return fetchAPI('/config/duplicate', {
    method: 'POST',
    body: JSON.stringify({
      sourceSiteId,
      newSiteId,
    }),
  });
}

export async function deleteConfig(siteId: string) {
  return fetchAPI(`/config/${siteId}`, {
    method: 'DELETE',
  });
}
