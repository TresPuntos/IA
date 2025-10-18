-- Crear tabla para almacenar archivos de documentación
CREATE TABLE IF NOT EXISTS documentation_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'txt', 'csv', 'md')),
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_documentation_files_status ON documentation_files(status);
CREATE INDEX IF NOT EXISTS idx_documentation_files_created_at ON documentation_files(created_at);
CREATE INDEX IF NOT EXISTS idx_documentation_files_file_type ON documentation_files(file_type);

-- Habilitar RLS (Row Level Security)
ALTER TABLE documentation_files ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad (permitir lectura y escritura para usuarios autenticados)
-- Para este caso, permitiremos acceso público ya que es un dashboard de configuración
CREATE POLICY "Allow public access to documentation files" ON documentation_files
  FOR ALL USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_documentation_files_updated_at
  BEFORE UPDATE ON documentation_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
