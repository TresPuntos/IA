// src/lib/chat.ts
import { processProductQuery } from './chatIntegration';
import { getDocumentationFiles } from './documentation';

export async function testChat(site_id: string, message: string) {
  // Solo usar datos locales - NO conectarse a internet
  
  // 1. Primero buscar productos en el catálogo local
  try {
    const productResponse = await processProductQuery(message);
    if (productResponse && !productResponse.includes('No encuentro')) {
      return { answer: productResponse };
    }
  } catch (error) {
    console.log('Error en búsqueda de productos:', error);
  }

  // 2. Si no encuentra productos, buscar en documentación local
  try {
    const docs = await getDocumentationFiles();
    if (docs.length > 0) {
      // Buscar en el contenido de los documentos
      const relevantDocs = docs.filter(doc => 
        doc.content.toLowerCase().includes(message.toLowerCase()) ||
        doc.name.toLowerCase().includes(message.toLowerCase())
      );
      
      if (relevantDocs.length > 0) {
        const docInfo = relevantDocs.map(doc => 
          `• ${doc.name} (${doc.file_type.toUpperCase()})`
        ).join('\n');
        
        return { 
          answer: `Encontré información relevante en estos documentos:\n\n${docInfo}\n\n¿Te gustaría que revise el contenido específico de algún documento?` 
        };
      }
    }
  } catch (error) {
    console.log('Error en búsqueda de documentación:', error);
  }

  // 3. Si no encuentra nada localmente, respuesta genérica
  return { 
    answer: "No encuentro información específica sobre tu consulta en el catálogo de productos ni en la documentación disponible. ¿Podrías ser más específico o verificar que los datos estén cargados?" 
  };
}