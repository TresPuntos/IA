import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface DocumentationFile {
  id: string;
  name: string;
  content: string;
  file_type: 'pdf' | 'txt' | 'csv' | 'md';
  file_size: number;
  status: 'processing' | 'ready' | 'error';
  created_at: string;
  updated_at: string;
}

export interface UploadDocumentationResponse {
  success: boolean;
  file?: DocumentationFile;
  error?: string;
}

// Crear tabla de documentación (esto se ejecutará en Supabase)
export const createDocumentationTable = async () => {
  const { data, error } = await supabase.rpc('create_documentation_table');
  return { data, error };
};

// Subir un archivo de documentación
export const uploadDocumentation = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadDocumentationResponse> => {
  try {
    console.log('🔍 Iniciando subida de archivo:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'text/plain', 'text/csv', 'text/markdown'];
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (!allowedTypes.includes(file.type) && !isPDF) {
      console.log('❌ Tipo de archivo no permitido:', file.type);
      return {
        success: false,
        error: 'Tipo de archivo no permitido. Solo se permiten PDF, TXT, CSV y MD.'
      };
    }
    
    // Si es PDF, asegurar que se trate como tal
    if (isPDF) {
      console.log('📄 Archivo PDF detectado:', file.name);
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('❌ Archivo demasiado grande:', file.size, 'bytes (', Math.round(file.size / 1024 / 1024), 'MB)');
      return {
        success: false,
        error: `El archivo es demasiado grande. Máximo 5MB. Tu archivo: ${Math.round(file.size / 1024 / 1024)}MB.`
      };
    }

    // Leer el contenido del archivo
    let content: string;
    
    if (isPDF) {
      // Para PDFs, usar una representación más simple SIN intentar leer el contenido binario
      content = `[PDF: ${file.name}]\n\nEste es un archivo PDF. El contenido completo se procesará cuando se implemente el parser de PDF.\n\nTamaño: ${file.size} bytes\nTipo: ${file.type}\nFecha: ${new Date().toISOString()}`;
      console.log('📄 Archivo PDF procesado (sin lectura de contenido binario)');
    } else {
      // Para archivos de texto, leer normalmente
      console.log('📄 Leyendo archivo de texto...');
      try {
        content = await readFileContent(file);
        console.log('📄 Archivo leído, longitud:', content.length);
        
        // Si el contenido está vacío o es muy corto, puede haber un problema
        if (content.length === 0) {
          console.log('⚠️  Contenido vacío, intentando método alternativo...');
          content = await readFileContentFallback(file);
        }
        
      } catch (error) {
        console.error('❌ Error al leer archivo, intentando método alternativo:', error);
        try {
          content = await readFileContentFallback(file);
          console.log('✅ Método alternativo exitoso');
        } catch (fallbackError) {
          console.error('❌ Método alternativo también falló:', fallbackError);
          return {
            success: false,
            error: `Error al leer el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
          };
        }
      }
    }
    
    // Determinar el tipo de archivo
    const fileType = isPDF ? 'pdf' : getFileType(file.type);
    
    // Validar y limpiar el contenido antes de guardar
    console.log('🧹 Limpiando contenido...');
    const cleanedContent = content
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remover caracteres de control
      .replace(/\uFEFF/g, '') // Remover BOM
      .trim();
    
    console.log('🧹 Contenido limpiado, nueva longitud:', cleanedContent.length);

    // Crear registro en la base de datos
    console.log('💾 Guardando en la base de datos...');
    const { data, error } = await supabase
      .from('documentation_files')
      .insert({
        name: file.name,
        content: cleanedContent,
        file_type: fileType,
        file_size: file.size,
        status: 'processing'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      console.error('❌ Detalles del error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return {
        success: false,
        error: `Error al guardar en la base de datos: ${error.message}`
      };
    }
    
    console.log('✅ Archivo guardado exitosamente:', data.id);

    // Simular procesamiento (en una implementación real, esto podría ser un webhook o job)
    setTimeout(() => {
      updateDocumentationStatus(data.id, 'ready');
    }, 2000);

    return {
      success: true,
      file: data
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Obtener todos los archivos de documentación
export const getDocumentationFiles = async (): Promise<DocumentationFile[]> => {
  const { data, error } = await supabase
    .from('documentation_files')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener archivos: ${error.message}`);
  }

  return data || [];
};

// Actualizar el estado de un archivo
export const updateDocumentationStatus = async (
  id: string, 
  status: 'processing' | 'ready' | 'error'
): Promise<void> => {
  const { error } = await supabase
    .from('documentation_files')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Error al actualizar estado: ${error.message}`);
  }
};

// Eliminar un archivo de documentación
export const deleteDocumentationFile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('documentation_files')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error al eliminar archivo: ${error.message}`);
  }
};

// Obtener el contenido de un archivo
export const getDocumentationContent = async (id: string): Promise<string> => {
  const { data, error } = await supabase
    .from('documentation_files')
    .select('content')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error al obtener contenido: ${error.message}`);
  }

  return data?.content || '';
};

// Funciones auxiliares
const readFileContentFallback = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(result);
        let content = '';
        
        // Convertir a string de forma más segura
        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i];
          // Solo incluir caracteres ASCII imprimibles
          if (byte >= 32 && byte <= 126) {
            content += String.fromCharCode(byte);
          } else if (byte === 10 || byte === 13) {
            content += '\n'; // Convertir saltos de línea
          } else if (byte === 9) {
            content += ' '; // Convertir tabs a espacios
          }
        }
        
        resolve(content.trim());
      } catch (error) {
        reject(new Error('Error al procesar el archivo con método alternativo'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo con método alternativo'));
    reader.readAsArrayBuffer(file);
  });
};

const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let content = reader.result as string;
        
        // Limpiar y normalizar caracteres Unicode problemáticos de forma más agresiva
        content = content
          // Remover caracteres de control
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
          // Remover BOM y otros caracteres problemáticos
          .replace(/\uFEFF/g, '')
          .replace(/\u200B/g, '') // Zero-width space
          .replace(/\u200C/g, '') // Zero-width non-joiner
          .replace(/\u200D/g, '') // Zero-width joiner
          .replace(/\u2060/g, '') // Word joiner
          // Manejar secuencias de escape Unicode
          .replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
            try {
              const charCode = parseInt(code, 16);
              // Solo convertir si es un carácter válido
              if (charCode >= 32 && charCode <= 1114111) {
                return String.fromCharCode(charCode);
              }
              return ''; // Remover caracteres inválidos
            } catch {
              return ''; // Remover si no se puede convertir
            }
          })
          // Manejar secuencias de escape hexadecimal
          .replace(/\\x([0-9a-fA-F]{2})/g, (match, code) => {
            try {
              const charCode = parseInt(code, 16);
              if (charCode >= 32 && charCode <= 126) {
                return String.fromCharCode(charCode);
              }
              return ''; // Remover caracteres no imprimibles
            } catch {
              return ''; // Remover si no se puede convertir
            }
          })
          // Limpiar espacios múltiples
          .replace(/\s+/g, ' ')
          .trim();
        
        resolve(content);
      } catch (error) {
        console.error('Error al procesar contenido:', error);
        reject(new Error('Error al procesar el contenido del archivo'));
      }
    };
    reader.onerror = () => {
      console.error('Error al leer archivo');
      reject(new Error('Error al leer el archivo'));
    };
    
    // Intentar leer con diferentes encodings
    try {
      reader.readAsText(file, 'UTF-8');
    } catch (error) {
      console.error('Error con UTF-8, intentando sin especificar encoding:', error);
      reader.readAsText(file);
    }
  });
};

const getFileType = (mimeType: string): 'pdf' | 'txt' | 'csv' | 'md' => {
  switch (mimeType) {
    case 'application/pdf':
      return 'pdf';
    case 'text/plain':
      return 'txt';
    case 'text/csv':
      return 'csv';
    case 'text/markdown':
      return 'md';
    default:
      return 'txt';
  }
};
