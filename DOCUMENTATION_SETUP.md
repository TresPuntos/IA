# Configuración de Documentación en Supabase

## Pasos para habilitar la funcionalidad de subida de documentación

### 1. Crear la tabla en Supabase

Ejecuta el siguiente SQL en el editor SQL de Supabase (Dashboard > SQL Editor):

```sql
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

-- Crear políticas de seguridad (permitir acceso público para el dashboard)
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
```

### 2. Verificar la configuración

Después de ejecutar el SQL, verifica que:

1. La tabla `documentation_files` se haya creado correctamente
2. Los índices estén presentes
3. Las políticas de seguridad estén activas
4. El trigger funcione correctamente

### 3. Funcionalidades disponibles

Una vez configurada la tabla, la aplicación permitirá:

- **Subir archivos**: PDF, TXT, CSV, MD (máximo 10MB por archivo)
- **Ver archivos subidos**: Lista con estado, tamaño y tipo
- **Eliminar archivos**: Botón de eliminación para cada archivo
- **Estados de procesamiento**: 
  - `processing`: Archivo siendo procesado
  - `ready`: Archivo listo para usar
  - `error`: Error en el procesamiento

### 4. Estructura de datos

```typescript
interface DocumentationFile {
  id: string;           // UUID único
  name: string;         // Nombre del archivo
  content: string;      // Contenido del archivo (texto)
  file_type: 'pdf' | 'txt' | 'csv' | 'md';
  file_size: number;    // Tamaño en bytes
  status: 'processing' | 'ready' | 'error';
  created_at: string;   // Timestamp de creación
  updated_at: string;   // Timestamp de última actualización
}
```

### 5. Notas importantes

- Los archivos se almacenan como texto en la base de datos
- Para archivos PDF, se extrae el texto antes de almacenar
- El procesamiento es simulado (2 segundos) - en producción se podría integrar con servicios de IA
- La aplicación usa notificaciones toast para feedback del usuario
- Todos los archivos son públicos (sin autenticación requerida)

### 6. Próximos pasos sugeridos

1. **Integración con IA**: Conectar con servicios de procesamiento de documentos
2. **Autenticación**: Implementar sistema de usuarios si es necesario
3. **Almacenamiento de archivos**: Usar Supabase Storage para archivos grandes
4. **Procesamiento asíncrono**: Implementar jobs en background para archivos grandes
5. **Búsqueda**: Agregar funcionalidad de búsqueda en el contenido de los archivos
