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
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'text/plain', 'text/csv', 'text/markdown'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de archivo no permitido. Solo se permiten PDF, TXT, CSV y MD.'
      };
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'El archivo es demasiado grande. Máximo 10MB.'
      };
    }

    // Leer el contenido del archivo
    const content = await readFileContent(file);
    
    // Determinar el tipo de archivo
    const fileType = getFileType(file.type);
    
    // Crear registro en la base de datos
    const { data, error } = await supabase
      .from('documentation_files')
      .insert({
        name: file.name,
        content: content,
        file_type: fileType,
        file_size: file.size,
        status: 'processing'
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Error al guardar en la base de datos: ${error.message}`
      };
    }

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
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
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
