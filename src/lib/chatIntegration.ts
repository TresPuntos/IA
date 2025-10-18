import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getDocumentationFiles } from './documentation';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sku?: string;
  stock_quantity: number;
  image_url?: string;
  status: 'active' | 'inactive' | 'draft';
  source: 'csv' | 'woocommerce' | 'manual';
  external_id?: string;
  created_at: string;
  updated_at: string;
}

// Buscar productos por texto
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(10);

    if (error) {
      throw new Error(`Error al buscar productos: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchProducts:', error);
    return [];
  }
};

// Buscar productos por precio máximo
export const searchProductsByMaxPrice = async (maxPrice: number): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .eq('status', 'active')
      .lte('price', maxPrice)
      .order('price', { ascending: true })
      .limit(10);

    if (error) {
      throw new Error(`Error al buscar productos por precio: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchProductsByMaxPrice:', error);
    return [];
  }
};

// Buscar productos por categoría
export const searchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .eq('status', 'active')
      .ilike('category', `%${category}%`)
      .limit(10);

    if (error) {
      throw new Error(`Error al buscar productos por categoría: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchProductsByCategory:', error);
    return [];
  }
};

// Buscar en documentación local
export const searchInDocumentation = async (query: string): Promise<string> => {
  try {
    const docs = await getDocumentationFiles();
    if (docs.length === 0) {
      return "No hay documentación disponible.";
    }

    const lowerQuery = query.toLowerCase();
    const relevantDocs = docs.filter(doc => 
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.name.toLowerCase().includes(lowerQuery)
    );

    if (relevantDocs.length === 0) {
      return "No encuentro información relevante en la documentación disponible.";
    }

    // Si encuentra documentos relevantes, mostrar extractos del contenido
    const docResults = relevantDocs.map(doc => {
      const content = doc.content;
      const queryIndex = content.toLowerCase().indexOf(lowerQuery);
      
      // Extraer contexto alrededor de la búsqueda
      const start = Math.max(0, queryIndex - 100);
      const end = Math.min(content.length, queryIndex + 200);
      const excerpt = content.substring(start, end);
      
      return `📄 ${doc.name} (${doc.file_type.toUpperCase()}):\n"${excerpt}..."`;
    }).join('\n\n');

    return `Encontré información relevante en la documentación:\n\n${docResults}`;
    
  } catch (error) {
    console.error('Error en searchInDocumentation:', error);
    return "Error al buscar en la documentación.";
  }
};

// Función principal para procesar consultas de productos
export const processProductQuery = async (query: string, systemPrompt?: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  
  try {
    // Buscar productos específicos mencionados directamente
    const specificProductMatch = lowerQuery.match(/(?:recomiéndame|recomienda|busca|encuentra|muestra)\s+(?:un|una|el|la)?\s*([a-zA-Z\s]+)/);
    if (specificProductMatch) {
      const productName = specificProductMatch[1].trim();
      const products = await searchProducts(productName);
      
      if (products.length > 0) {
        // Eliminar duplicados por nombre
        const uniqueProducts = products.filter((product, index, self) => 
          index === self.findIndex(p => p.name === product.name)
        );
        
        if (uniqueProducts.length === 1) {
          const product = uniqueProducts[0];
          return `¡Perfecto! Te recomiendo el ${product.name}:\n\n✨ ${product.name} - ${product.price}€\n📝 ${product.description}\n\n💡 Es una excelente opción por su calidad y precio.`;
        } else if (uniqueProducts.length > 1) {
          const productList = uniqueProducts.slice(0, 3).map(p => 
            `• ${p.name} - ${p.price}€${p.description ? ` (${p.description})` : ''}`
          ).join('\n');
          
          return `Encontré ${uniqueProducts.length} opciones relacionadas con ${productName}:\n\n${productList}\n\n💡 Te recomiendo especialmente el ${uniqueProducts[0].name} por su excelente relación calidad-precio.`;
        }
      }
    }
    
    // Buscar por precio máximo (ej: "menos de 80€", "por debajo de 100")
    const priceMatch = lowerQuery.match(/(?:menos de|por debajo de|máximo|hasta)\s*(\d+)/);
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1]);
      const products = await searchProductsByMaxPrice(maxPrice);
      
      if (products.length === 0) {
        return `No encuentro productos por debajo de ${maxPrice}€ en el catálogo.`;
      }
      
      // Eliminar duplicados
      const uniqueProducts = products.filter((product, index, self) => 
        index === self.findIndex(p => p.name === product.name)
      );
      
      const productList = uniqueProducts.slice(0, 5).map(p => 
        `• ${p.name} - ${p.price}€${p.description ? ` (${p.description})` : ''}`
      ).join('\n');
      
      // Personalizar respuesta según system prompt
      const baseResponse = `Encontré ${uniqueProducts.length} productos por debajo de ${maxPrice}€:\n\n${productList}`;
      
      if (systemPrompt?.includes('recomendaciones')) {
        return `${baseResponse}\n\n💡 Recomendación: Te sugiero el ${uniqueProducts[0].name} por su excelente relación calidad-precio.`;
      }
      
      return baseResponse;
    }
    
    // Buscar por categoría (ej: "ratón", "mouse", "smartphone")
    const categoryKeywords = {
      'ratón': 'Accesorios',
      'mouse': 'Accesorios',
      'smartphone': 'Smartphones',
      'teléfono': 'Smartphones',
      'iphone': 'Smartphones',
      'portátil': 'Computadoras',
      'laptop': 'Computadoras',
      'macbook': 'Computadoras',
      'auriculares': 'Audio',
      'airpods': 'Audio',
      'tablet': 'Tablets',
      'ipad': 'Tablets',
      'reloj': 'Wearables',
      'watch': 'Wearables',
      'teclado': 'Accesorios',
      'keyboard': 'Accesorios',
      'monitor': 'Monitores',
      'pantalla': 'Monitores'
    };
    
    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (lowerQuery.includes(keyword)) {
        const products = await searchProductsByCategory(category);
        
        if (products.length === 0) {
          return `No encuentro productos de ${category.toLowerCase()} en el catálogo.`;
        }
        
        // Eliminar duplicados
        const uniqueProducts = products.filter((product, index, self) => 
          index === self.findIndex(p => p.name === product.name)
        );
        
        const productList = uniqueProducts.slice(0, 5).map(p => 
          `• ${p.name} - ${p.price}€${p.description ? ` (${p.description})` : ''}`
        ).join('\n');
        
        return `Encontré ${uniqueProducts.length} productos de ${category.toLowerCase()}:\n\n${productList}`;
      }
    }
    
    // Búsqueda general por texto
    const products = await searchProducts(query);
    
    if (products.length === 0) {
      return `No encuentro productos que coincidan con "${query}" en el catálogo.`;
    }
    
    // Eliminar duplicados
    const uniqueProducts = products.filter((product, index, self) => 
      index === self.findIndex(p => p.name === product.name)
    );
    
    const productList = uniqueProducts.slice(0, 5).map(p => 
      `• ${p.name} - ${p.price}€${p.description ? ` (${p.description})` : ''}`
    ).join('\n');
    
    return `Encontré ${uniqueProducts.length} productos relacionados con "${query}":\n\n${productList}`;
    
  } catch (error) {
    console.error('Error en processProductQuery:', error);
    return `Error al buscar productos: ${error instanceof Error ? error.message : 'Error desconocido'}`;
  }
};

// Obtener estadísticas del catálogo para el chat
export const getCatalogStatsForChat = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .select('category, price')
      .eq('status', 'active');

    if (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return "No hay productos disponibles en el catálogo.";
    }

    const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
    const avgPrice = data.reduce((sum, p) => sum + p.price, 0) / data.length;
    const minPrice = Math.min(...data.map(p => p.price));
    const maxPrice = Math.max(...data.map(p => p.price));

    return `Catálogo disponible con ${data.length} productos:\n` +
           `• Categorías: ${categories.join(', ')}\n` +
           `• Precio promedio: ${avgPrice.toFixed(2)}€\n` +
           `• Rango de precios: ${minPrice}€ - ${maxPrice}€`;
    
  } catch (error) {
    console.error('Error en getCatalogStatsForChat:', error);
    return "Error al obtener información del catálogo.";
  }
};