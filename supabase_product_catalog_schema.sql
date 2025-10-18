-- Crear tabla para almacenar productos del catálogo
CREATE TABLE IF NOT EXISTS product_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  source TEXT NOT NULL CHECK (source IN ('csv', 'woocommerce', 'manual')),
  external_id TEXT, -- Para productos de WooCommerce
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para tracking de actualizaciones del catálogo
CREATE TABLE IF NOT EXISTS catalog_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('csv', 'woocommerce')),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  products_count INTEGER DEFAULT 0,
  error_message TEXT,
  woocommerce_url TEXT,
  csv_filename TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_product_catalog_category ON product_catalog(category);
CREATE INDEX IF NOT EXISTS idx_product_catalog_status ON product_catalog(status);
CREATE INDEX IF NOT EXISTS idx_product_catalog_source ON product_catalog(source);
CREATE INDEX IF NOT EXISTS idx_product_catalog_created_at ON product_catalog(created_at);
CREATE INDEX IF NOT EXISTS idx_catalog_updates_status ON catalog_updates(status);
CREATE INDEX IF NOT EXISTS idx_catalog_updates_created_at ON catalog_updates(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_updates ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad (acceso público para el dashboard)
CREATE POLICY "Allow public access to product_catalog" ON product_catalog
  FOR ALL USING (true);

CREATE POLICY "Allow public access to catalog_updates" ON catalog_updates
  FOR ALL USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_product_catalog_updated_at
  BEFORE UPDATE ON product_catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_updates_updated_at
  BEFORE UPDATE ON catalog_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener estadísticas del catálogo
CREATE OR REPLACE FUNCTION get_catalog_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_products', COUNT(*),
    'active_products', COUNT(*) FILTER (WHERE status = 'active'),
    'csv_products', COUNT(*) FILTER (WHERE source = 'csv'),
    'woocommerce_products', COUNT(*) FILTER (WHERE source = 'woocommerce'),
    'last_update', (
      SELECT MAX(completed_at) 
      FROM catalog_updates 
      WHERE status = 'completed'
    )
  ) INTO result
  FROM product_catalog;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
