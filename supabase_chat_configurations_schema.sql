-- Tabla para almacenar configuraciones de chat
CREATE TABLE IF NOT EXISTS chat_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL UNIQUE,
  site_name TEXT NOT NULL,
  chat_status TEXT NOT NULL DEFAULT 'active' CHECK (chat_status IN ('active', 'testing', 'inactive')),
  tone TEXT NOT NULL DEFAULT 'friendly' CHECK (tone IN ('friendly', 'premium', 'technical', 'casual', 'professional')),
  system_prompt TEXT NOT NULL DEFAULT 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini' CHECK (model IN ('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini')),
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  top_p DECIMAL(3,2) NOT NULL DEFAULT 0.9 CHECK (top_p >= 0 AND top_p <= 1),
  max_tokens INTEGER NOT NULL DEFAULT 2048 CHECK (max_tokens >= 1 AND max_tokens <= 4096),
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en', 'pt', 'fr', 'de')),
  version_tag TEXT NOT NULL DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_configurations_site_id ON chat_configurations(site_id);
CREATE INDEX IF NOT EXISTS idx_chat_configurations_updated_at ON chat_configurations(updated_at);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_chat_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_configurations_updated_at
  BEFORE UPDATE ON chat_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_configurations_updated_at();

-- RLS (Row Level Security) - Permitir acceso público para lectura y escritura
ALTER TABLE chat_configurations ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso público (para simplificar, en producción deberías usar autenticación)
CREATE POLICY "Allow public access to chat configurations" ON chat_configurations
  FOR ALL USING (true);

-- Función para obtener o crear configuración por defecto
CREATE OR REPLACE FUNCTION get_or_create_default_configuration()
RETURNS chat_configurations AS $$
DECLARE
  config_record chat_configurations;
BEGIN
  -- Intentar obtener la configuración por defecto
  SELECT * INTO config_record 
  FROM chat_configurations 
  WHERE site_id = 'default' 
  LIMIT 1;
  
  -- Si no existe, crear una nueva
  IF NOT FOUND THEN
    INSERT INTO chat_configurations (
      site_id, 
      site_name, 
      chat_status, 
      tone, 
      system_prompt, 
      model, 
      temperature, 
      top_p, 
      max_tokens, 
      language, 
      version_tag
    ) VALUES (
      'default',
      'Configuración por Defecto',
      'active',
      'friendly',
      'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
      'gpt-4o-mini',
      0.7,
      0.9,
      2048,
      'es',
      'v1.0'
    ) RETURNING * INTO config_record;
  END IF;
  
  RETURN config_record;
END;
$$ LANGUAGE plpgsql;
