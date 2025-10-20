-- =====================================================
-- MIGRACIONES SQL PARA AI CHAT CONFIG DASHBOARD
-- =====================================================

-- Crear tabla principal de configuraciones
CREATE TABLE IF NOT EXISTS chat_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  client_url TEXT,
  chat_status TEXT NOT NULL DEFAULT 'testing' CHECK (chat_status IN ('active', 'testing', 'inactive')),
  tone TEXT NOT NULL DEFAULT 'friendly' CHECK (tone IN ('friendly', 'premium', 'technical', 'casual', 'professional')),
  system_prompts JSONB,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini' CHECK (model IN ('gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini')),
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  top_p DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (top_p >= 0 AND top_p <= 1),
  max_tokens INTEGER NOT NULL DEFAULT 2048 CHECK (max_tokens > 0 AND max_tokens <= 4096),
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en', 'pt', 'fr', 'de')),
  version_tag TEXT NOT NULL DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de productos del catálogo
CREATE TABLE IF NOT EXISTS catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  description TEXT,
  sku TEXT,
  image_url TEXT,
  product_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'csv', 'woocommerce', 'prestashop', 'shopify')),
  source_id TEXT, -- ID del producto en la fuente original
  metadata JSONB, -- Datos adicionales de la fuente
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de categorías de productos
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de archivos CSV subidos
CREATE TABLE IF NOT EXISTS csv_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  products_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'success', 'error')),
  error_message TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Crear tabla de conexiones ecommerce
CREATE TABLE IF NOT EXISTS ecommerce_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('woocommerce', 'prestashop', 'shopify')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  last_sync TIMESTAMP WITH TIME ZONE,
  products_count INTEGER DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'idle' CHECK (sync_status IN ('idle', 'pending', 'success', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de conversaciones de prueba
CREATE TABLE IF NOT EXISTS test_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para chat_configurations
CREATE INDEX IF NOT EXISTS idx_chat_configurations_site_id ON chat_configurations(site_id);
CREATE INDEX IF NOT EXISTS idx_chat_configurations_created_at ON chat_configurations(created_at);

-- Índices para catalog_products
CREATE INDEX IF NOT EXISTS idx_catalog_products_category ON catalog_products(category);
CREATE INDEX IF NOT EXISTS idx_catalog_products_is_active ON catalog_products(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_products_source ON catalog_products(source);
CREATE INDEX IF NOT EXISTS idx_catalog_products_created_at ON catalog_products(created_at);

-- Índices para product_categories
CREATE INDEX IF NOT EXISTS idx_product_categories_is_active ON product_categories(is_active);

-- Índices para csv_files
CREATE INDEX IF NOT EXISTS idx_csv_files_status ON csv_files(status);
CREATE INDEX IF NOT EXISTS idx_csv_files_uploaded_at ON csv_files(uploaded_at);

-- Índices para ecommerce_connections
CREATE INDEX IF NOT EXISTS idx_ecommerce_connections_platform ON ecommerce_connections(platform);
CREATE INDEX IF NOT EXISTS idx_ecommerce_connections_is_connected ON ecommerce_connections(is_connected);

-- Índices para test_conversations
CREATE INDEX IF NOT EXISTS idx_test_conversations_session_id ON test_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_test_conversations_created_at ON test_conversations(created_at);

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
CREATE TRIGGER update_chat_configurations_updated_at 
  BEFORE UPDATE ON chat_configurations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_products_updated_at 
  BEFORE UPDATE ON catalog_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at 
  BEFORE UPDATE ON product_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ecommerce_connections_updated_at 
  BEFORE UPDATE ON ecommerce_connections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_conversations_updated_at 
  BEFORE UPDATE ON test_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías por defecto
INSERT INTO product_categories (name, description, is_active) VALUES
  ('maquinaria', 'Maquinaria Cocina y Mixología', true),
  ('herramientas', 'Herramientas Cocina y Coctelería', true),
  ('tecnicas', 'Técnicas Cocina y Mixología', true),
  ('servicio', 'Servicio de Mesa', true)
ON CONFLICT (name) DO NOTHING;

-- Insertar configuración por defecto
INSERT INTO chat_configurations (
  site_id, 
  site_name, 
  client_url, 
  chat_status, 
  tone, 
  system_prompts,
  model,
  temperature,
  top_p,
  max_tokens,
  language,
  version_tag
) VALUES (
  '100chef',
  '100%Chef - Herramientas Cocina',
  'https://100x100chef.com/',
  'testing',
  'friendly',
  '{
    "friendly": "Eres un asistente especializado en herramientas de cocina profesional para 100%Chef. Ayudas a chefs, cocineros y barmen a encontrar el equipo perfecto para sus necesidades culinarias. INFORMACIÓN DE LA EMPRESA: - Especialistas en herramientas y maquinaria para cocina y coctelería - Catálogo completo: maquinaria, herramientas, técnicas, servicio de mesa, cristalería, catering - Productos para cocina molecular, gastronomía profesional y coctelería avanzada - Ubicación: Barcelona, España - Teléfono: +34 93 429 63 40 COMUNÍCATE de manera cercana y amigable. Usa un lenguaje cálido y accesible. Incluye emojis ocasionalmente para hacer la conversación más agradable. Siempre responde en español.",
    "premium": "Eres un consultor especializado en equipamiento gastronómico de alta gama para 100%Chef. Proporcionas asesoramiento experto sobre herramientas profesionales de cocina y coctelería. INFORMACIÓN DE LA EMPRESA: - Especialistas en herramientas y maquinaria para cocina y coctelería - Catálogo premium: maquinaria profesional, herramientas especializadas, técnicas avanzadas - Productos para restaurantes de alta cocina, cocina molecular y coctelería de autor - Ubicación: Barcelona, España - Teléfono: +34 93 429 63 40 Mantén un tono sofisticado y elegante. Usa un lenguaje refinado y profesional. Destaca la calidad y exclusividad de los productos. Siempre responde en español.",
    "technical": "Eres un técnico especialista en equipamiento gastronómico profesional para 100%Chef. Proporcionas información técnica detallada sobre maquinaria y herramientas de cocina. INFORMACIÓN DE LA EMPRESA: - Especialistas en herramientas y maquinaria para cocina y coctelería - Catálogo técnico: centrifugadoras, cocción al vacío, conchadoras, deshidratadoras, destiladoras - Productos para cocina molecular, gastronomía técnica y laboratorios culinarios - Ubicación: Barcelona, España - Teléfono: +34 93 429 63 40 Sé preciso y técnico en tus explicaciones. Proporciona detalles específicos y datos concretos. Usa terminología profesional cuando sea apropiado. Siempre responde en español.",
    "casual": "Eres un experto en cocina que ayuda a encontrar las mejores herramientas para 100%Chef. Hablas de manera relajada sobre equipamiento gastronómico. INFORMACIÓN DE LA EMPRESA: - Especialistas en herramientas y maquinaria para cocina y coctelería - Catálogo completo: desde herramientas básicas hasta equipos profesionales - Productos para cocineros caseros, profesionales y entusiastas de la cocina - Ubicación: Barcelona, España - Teléfono: +34 93 429 63 40 Habla de manera relajada e informal. Usa un lenguaje cotidiano y cercano. Haz que la conversación se sienta natural y sin formalidades. Siempre responde en español.",
    "professional": "Eres un consultor profesional en equipamiento gastronómico para 100%Chef. Proporcionas asesoramiento empresarial sobre herramientas de cocina profesional. INFORMACIÓN DE LA EMPRESA: - Especialistas en herramientas y maquinaria para cocina y coctelería - Catálogo empresarial: equipos para restaurantes, hoteles, catering y servicios de alimentación - Productos para establecimientos comerciales y servicios profesionales - Ubicación: Barcelona, España - Teléfono: +34 93 429 63 40 Mantén un tono formal y empresarial. Usa un lenguaje claro y directo. Sé eficiente y orientado a resultados. Siempre responde en español."
  }',
  'gpt-4o-mini',
  0.7,
  1.0,
  2048,
  'es',
  'v1.0'
) ON CONFLICT (site_id) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO catalog_products (name, category, price, description, sku, is_active, source) VALUES
  ('Pacojet 4', 'maquinaria', 2800.00, 'Máquina profesional para texturas perfectas. Ideal para helados, sorbetes y cremas.', 'PACO-4-001', true, 'manual'),
  ('Girovap Destiladora', 'maquinaria', 2500.00, 'Destilación al vacío profesional. Perfecta para extracciones y concentrados.', 'GIRO-001', true, 'manual'),
  ('Conchadora Twin Stones', 'maquinaria', 1500.00, 'Refinado de chocolate artesanal. Piedras de granito para textura perfecta.', 'TWIN-001', true, 'manual'),
  ('Centrifugadora Profesional', 'maquinaria', 1200.00, 'Clarificación molecular profesional. Ideal para caldos y jugos clarificados.', 'CENT-001', true, 'manual'),
  ('Cocción al Vacío Roner', 'maquinaria', 800.00, 'Cocina sous vide profesional. Control de temperatura preciso.', 'RONER-001', true, 'manual'),
  ('Liofilizadora Profesional', 'maquinaria', 3000.00, 'Conservación molecular avanzada. Deshidratación por congelación.', 'LIO-001', true, 'manual')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE chat_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acceso completo para desarrollo)
-- En producción, ajustar según necesidades de seguridad

-- Políticas para chat_configurations
CREATE POLICY "Allow all operations on chat_configurations" ON chat_configurations
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para catalog_products
CREATE POLICY "Allow all operations on catalog_products" ON catalog_products
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para product_categories
CREATE POLICY "Allow all operations on product_categories" ON product_categories
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para csv_files
CREATE POLICY "Allow all operations on csv_files" ON csv_files
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para ecommerce_connections
CREATE POLICY "Allow all operations on ecommerce_connections" ON ecommerce_connections
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para test_conversations
CREATE POLICY "Allow all operations on test_conversations" ON test_conversations
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener estadísticas del catálogo
CREATE OR REPLACE FUNCTION get_catalog_stats()
RETURNS TABLE (
  total_products BIGINT,
  active_products BIGINT,
  inactive_products BIGINT,
  total_categories BIGINT,
  active_categories BIGINT,
  products_by_source JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE is_active = true) as active_products,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_products,
    (SELECT COUNT(*) FROM product_categories) as total_categories,
    (SELECT COUNT(*) FROM product_categories WHERE is_active = true) as active_categories,
    jsonb_object_agg(source, source_count) as products_by_source
  FROM (
    SELECT source, COUNT(*) as source_count
    FROM catalog_products
    GROUP BY source
  ) source_stats;
END;
$$ LANGUAGE plpgsql;

-- Función para sincronizar productos desde CSV
CREATE OR REPLACE FUNCTION sync_products_from_csv(
  p_csv_data JSONB,
  p_file_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  product_record JSONB;
  inserted_count INTEGER := 0;
BEGIN
  -- Actualizar estado del archivo CSV
  UPDATE csv_files 
  SET status = 'processing', processed_at = NOW()
  WHERE id = p_file_id;
  
  -- Insertar productos
  FOR product_record IN SELECT * FROM jsonb_array_elements(p_csv_data)
  LOOP
    INSERT INTO catalog_products (
      name,
      category,
      price,
      description,
      sku,
      image_url,
      product_url,
      is_active,
      source,
      source_id
    ) VALUES (
      product_record->>'name',
      product_record->>'category',
      (product_record->>'price')::DECIMAL,
      product_record->>'description',
      product_record->>'sku',
      product_record->>'image_url',
      product_record->>'product_url',
      COALESCE((product_record->>'is_active')::BOOLEAN, true),
      'csv',
      p_file_id::TEXT
    ) ON CONFLICT DO NOTHING;
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  -- Actualizar contador en csv_files
  UPDATE csv_files 
  SET 
    products_count = inserted_count,
    status = 'success',
    processed_at = NOW()
  WHERE id = p_file_id;
  
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para productos activos con información de categoría
CREATE OR REPLACE VIEW active_products_view AS
SELECT 
  p.id,
  p.name,
  p.price,
  p.description,
  p.sku,
  p.image_url,
  p.product_url,
  p.source,
  p.created_at,
  c.name as category_name,
  c.description as category_description
FROM catalog_products p
JOIN product_categories c ON p.category = c.id
WHERE p.is_active = true AND c.is_active = true;

-- Vista para estadísticas de conexiones ecommerce
CREATE OR REPLACE VIEW ecommerce_stats_view AS
SELECT 
  platform,
  COUNT(*) as total_connections,
  COUNT(*) FILTER (WHERE is_connected = true) as active_connections,
  SUM(products_count) as total_products_synced,
  MAX(last_sync) as last_sync_overall
FROM ecommerce_connections
GROUP BY platform;

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE chat_configurations IS 'Configuraciones de chat para diferentes clientes';
COMMENT ON TABLE catalog_products IS 'Catálogo de productos sincronizado desde múltiples fuentes';
COMMENT ON TABLE product_categories IS 'Categorías de productos';
COMMENT ON TABLE csv_files IS 'Archivos CSV subidos para importar productos';
COMMENT ON TABLE ecommerce_connections IS 'Conexiones a plataformas de ecommerce';
COMMENT ON TABLE test_conversations IS 'Conversaciones de prueba del chat';

COMMENT ON FUNCTION get_catalog_stats() IS 'Obtiene estadísticas del catálogo de productos';
COMMENT ON FUNCTION sync_products_from_csv(JSONB, UUID) IS 'Sincroniza productos desde datos CSV';

-- =====================================================
-- FIN DE MIGRACIONES
-- =====================================================

-- Verificar que todo se creó correctamente
SELECT 
  'chat_configurations' as table_name, 
  COUNT(*) as row_count 
FROM chat_configurations
UNION ALL
SELECT 
  'catalog_products' as table_name, 
  COUNT(*) as row_count 
FROM catalog_products
UNION ALL
SELECT 
  'product_categories' as table_name, 
  COUNT(*) as row_count 
FROM product_categories
UNION ALL
SELECT 
  'csv_files' as table_name, 
  COUNT(*) as row_count 
FROM csv_files
UNION ALL
SELECT 
  'ecommerce_connections' as table_name, 
  COUNT(*) as row_count 
FROM ecommerce_connections
UNION ALL
SELECT 
  'test_conversations' as table_name, 
  COUNT(*) as row_count 
FROM test_conversations;
