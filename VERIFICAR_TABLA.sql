-- Verificar que la tabla existe y tiene datos
SELECT 
  'Tabla existe' as status,
  COUNT(*) as total_configs
FROM chat_configurations;

-- Ver todas las configuraciones
SELECT 
  site_id,
  site_name,
  system_prompt,
  created_at,
  updated_at
FROM chat_configurations
ORDER BY created_at DESC;

-- Verificar si existe la configuración por defecto
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM chat_configurations WHERE site_id = 'default') 
    THEN 'EXISTE' 
    ELSE 'NO EXISTE' 
  END as default_config_exists;
