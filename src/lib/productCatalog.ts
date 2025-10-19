import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

export interface CatalogUpdate {
  id: string;
  source: 'csv' | 'woocommerce';
  status: 'processing' | 'completed' | 'failed';
  products_count: number;
  error_message?: string;
  woocommerce_url?: string;
  csv_filename?: string;
  created_at: string;
  completed_at: string;
}

export interface CatalogStats {
  total_products: number;
  active_products: number;
  csv_products: number;
  woocommerce_products: number;
  last_update: string | null;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  description?: string;
  categories?: Array<{ name: string }>;
  sku?: string;
  stock_quantity?: number;
  images?: Array<{ src: string }>;
}

// Obtener estadísticas del catálogo
export const getCatalogStats = async (): Promise<CatalogStats> => {
  const { data, error } = await supabase.rpc('get_catalog_stats');
  
  if (error) {
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
  
  return data || {
    total_products: 0,
    active_products: 0,
    csv_products: 0,
    woocommerce_products: 0,
    last_update: null
  };
};

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('product_catalog')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener productos: ${error.message}`);
  }

  return data || [];
};

// Subir productos desde CSV
export const uploadProductsFromCSV = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string; productsCount?: number }> => {
  try {
    // Validar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return {
        success: false,
        error: 'Solo se permiten archivos CSV.'
      };
    }

    // Leer el contenido del CSV
    const csvContent = await readFileContent(file);
    const products = parseCSV(csvContent);
    
    if (products.length === 0) {
      return {
        success: false,
        error: 'No se encontraron productos válidos en el CSV.'
      };
    }

    // Crear registro de actualización
    const { data: updateRecord, error: updateError } = await supabase
      .from('catalog_updates')
      .insert({
        source: 'csv',
        status: 'processing',
        products_count: products.length,
        csv_filename: file.name
      })
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Error al crear registro de actualización: ${updateError.message}`
      };
    }

    // Insertar productos
    const { error: insertError } = await supabase
      .from('product_catalog')
      .insert(products.map(product => ({
        ...product,
        source: 'csv'
      })));

    if (insertError) {
      // Actualizar estado a fallido
      await supabase
        .from('catalog_updates')
        .update({ 
          status: 'failed',
          error_message: insertError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', updateRecord.id);

      return {
        success: false,
        error: `Error al insertar productos: ${insertError.message}`
      };
    }

    // Actualizar estado a completado
    await supabase
      .from('catalog_updates')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', updateRecord.id);

    return {
      success: true,
      productsCount: products.length
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Conectar con WooCommerce API
export const connectWooCommerce = async (
  apiUrl: string,
  consumerKey: string,
  consumerSecret: string
): Promise<{ success: boolean; error?: string; productsCount?: number }> => {
  try {
    // Validar URL
    if (!apiUrl.includes('wp-json/wc/v3')) {
      return {
        success: false,
        error: 'La URL debe ser una API de WooCommerce válida (wp-json/wc/v3)'
      };
    }

    // Crear registro de actualización
    const { data: updateRecord, error: updateError } = await supabase
      .from('catalog_updates')
      .insert({
        source: 'woocommerce',
        status: 'processing',
        woocommerce_url: apiUrl
      })
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Error al crear registro de actualización: ${updateError.message}`
      };
    }

    // Obtener productos de WooCommerce
    const products = await fetchWooCommerceProducts(apiUrl, consumerKey, consumerSecret);
    
    if (products.length === 0) {
      await supabase
        .from('catalog_updates')
        .update({ 
          status: 'failed',
          error_message: 'No se encontraron productos en WooCommerce',
          completed_at: new Date().toISOString()
        })
        .eq('id', updateRecord.id);

      return {
        success: false,
        error: 'No se encontraron productos en WooCommerce'
      };
    }

    // Insertar productos
    const { error: insertError } = await supabase
      .from('product_catalog')
      .insert(products.map(product => ({
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        category: product.categories?.[0]?.name,
        sku: product.sku,
        stock_quantity: product.stock_quantity || 0,
        image_url: product.images?.[0]?.src,
        source: 'woocommerce',
        external_id: product.id.toString(),
        status: 'active'
      })));

    if (insertError) {
      await supabase
        .from('catalog_updates')
        .update({ 
          status: 'failed',
          error_message: insertError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', updateRecord.id);

      return {
        success: false,
        error: `Error al insertar productos: ${insertError.message}`
      };
    }

    // Actualizar estado a completado
    await supabase
      .from('catalog_updates')
      .update({ 
        status: 'completed',
        products_count: products.length,
        completed_at: new Date().toISOString()
      })
      .eq('id', updateRecord.id);

    return {
      success: true,
      productsCount: products.length
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Eliminar todos los productos
export const clearCatalog = async (): Promise<void> => {
  const { error } = await supabase
    .from('product_catalog')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    throw new Error(`Error al limpiar catálogo: ${error.message}`);
  }
};

// Eliminar solo productos de CSV
export const clearCSVProducts = async (): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .delete()
      .eq('source', 'csv')
      .select('id');

    if (error) {
      return {
        success: false,
        error: `Error al eliminar productos CSV: ${error.message}`
      };
    }

    return {
      success: true,
      deletedCount: data?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Eliminar solo productos de WooCommerce
export const clearWooCommerceProducts = async (): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('product_catalog')
      .delete()
      .eq('source', 'woocommerce')
      .select('id');

    if (error) {
      return {
        success: false,
        error: `Error al eliminar productos WooCommerce: ${error.message}`
      };
    }

    return {
      success: true,
      deletedCount: data?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Obtener historial de actualizaciones
export const getUpdateHistory = async (): Promise<CatalogUpdate[]> => {
  const { data, error } = await supabase
    .from('catalog_updates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Error al obtener historial: ${error.message}`);
  }

  return data || [];
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

const parseCSV = (csvContent: string): Omit<Product, 'id' | 'created_at' | 'updated_at'>[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  // Función para parsear CSV correctamente manejando comillas
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
  const products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim());
    if (values.length !== headers.length) continue;

    const product: any = {};
    headers.forEach((header, index) => {
      product[header] = values[index];
    });

    // Validar campos requeridos
    if (!product.nombre || !product.precio) continue;

    products.push({
      name: product.nombre,
      price: parseFloat(product.precio) || 0,
      description: product.descripcion || '',
      category: product.categoria || '',
      sku: product.sku || '',
      stock_quantity: parseInt(product.stock) || 0,
      status: 'active',
      source: 'csv'
    });
  }

  return products;
};

const fetchWooCommerceProducts = async (
  apiUrl: string,
  consumerKey: string,
  consumerSecret: string
): Promise<WooCommerceProduct[]> => {
  const url = `${apiUrl}/products?per_page=100`;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error de WooCommerce API: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
