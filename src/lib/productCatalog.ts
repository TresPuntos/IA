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
  source: 'csv' | 'woocommerce' | 'prestashop' | 'manual';
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogUpdate {
  id: string;
  source: 'csv' | 'woocommerce' | 'prestashop';
  status: 'processing' | 'completed' | 'failed';
  products_count: number;
  error_message?: string;
  woocommerce_url?: string;
  prestashop_url?: string;
  csv_filename?: string;
  created_at: string;
  completed_at: string;
}

export interface CatalogStats {
  total_products: number;
  active_products: number;
  csv_products: number;
  woocommerce_products: number;
  prestashop_products: number;
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
  try {
    // Obtener todos los productos para contar
    const { data: products, error: productsError } = await supabase
      .from('product_catalog')
      .select('source, status');

    if (productsError) {
      console.error('Error al obtener productos:', productsError);
      return {
        total_products: 0,
        active_products: 0,
        csv_products: 0,
        woocommerce_products: 0,
        last_update: null
      };
    }

    // Contar productos por fuente y estado
    const csvProducts = products?.filter(p => p.source === 'csv') || [];
    const woocommerceProducts = products?.filter(p => p.source === 'woocommerce') || [];
    const activeProducts = products?.filter(p => p.status === 'active') || [];

    // Obtener la última actualización
    const { data: lastUpdate, error: updateError } = await supabase
      .from('catalog_updates')
      .select('completed_at')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    return {
      total_products: products?.length || 0,
      active_products: activeProducts.length,
      csv_products: csvProducts.length,
      woocommerce_products: woocommerceProducts.length,
      last_update: lastUpdate?.completed_at || null
    };
  } catch (error) {
    console.error('Error inesperado en getCatalogStats:', error);
    return {
      total_products: 0,
      active_products: 0,
      csv_products: 0,
      woocommerce_products: 0,
      last_update: null
    };
  }
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

// Cargar productos desde Supabase
export const loadProductsFromSupabase = async (): Promise<{ success: boolean; products?: Product[]; error?: string }> => {
  try {
    console.log('📥 Cargando productos desde Supabase...');
    
    const { data, error } = await supabase
      .from('product_catalog')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al cargar productos:', error);
      return {
        success: false,
        error: `Error al cargar productos: ${error.message}`
      };
    }

    console.log('✅ Productos cargados desde Supabase:', data?.length || 0);
    
    return {
      success: true,
      products: data || []
    };
  } catch (error) {
    console.error('❌ Error inesperado al cargar productos:', error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Guardar productos CSV en Supabase
export const saveCSVProducts = async (products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]): Promise<{ success: boolean; savedCount?: number; error?: string }> => {
  try {
    console.log('💾 Guardando productos CSV en Supabase:', products.length);
    
    // Preparar productos para Supabase
    const productsToSave = products.map(product => ({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity || 0,
      image_url: product.image_url || '',
      status: product.status || 'active',
      source: product.source || 'csv',
      external_id: product.external_id || null
    }));

    // Insertar productos en lotes de 100 para evitar límites de Supabase
    const batchSize = 100;
    let totalSaved = 0;
    
    for (let i = 0; i < productsToSave.length; i += batchSize) {
      const batch = productsToSave.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('product_catalog')
        .insert(batch)
        .select('id');

      if (error) {
        console.error('❌ Error al guardar lote:', error);
        return {
          success: false,
          error: `Error al guardar productos: ${error.message}`
        };
      }

      totalSaved += data?.length || 0;
      console.log(`✅ Lote ${Math.floor(i/batchSize) + 1} guardado: ${data?.length || 0} productos`);
    }

    console.log('✅ Todos los productos CSV guardados en Supabase:', totalSaved);
    
    return {
      success: true,
      savedCount: totalSaved
    };
  } catch (error) {
    console.error('❌ Error inesperado al guardar productos:', error);
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

// Eliminar TODOS los productos del catálogo
export const clearAllProducts = async (): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    console.log('🗑️ Iniciando limpieza completa del catálogo...');
    
    const { data, error } = await supabase
      .from('product_catalog')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Eliminar todos los productos
      .select('id');

    if (error) {
      console.error('❌ Error al eliminar productos:', error);
      return {
        success: false,
        error: `Error al eliminar productos: ${error.message}`
      };
    }

    console.log('✅ Productos eliminados:', data?.length || 0);
    return {
      success: true,
      deletedCount: data?.length || 0
    };
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Eliminar TODOS los registros de actualización
export const clearAllUpdateHistory = async (): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    console.log('🗑️ Iniciando limpieza del historial de actualizaciones...');
    
    const { data, error } = await supabase
      .from('catalog_updates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Eliminar todos los registros
      .select('id');

    if (error) {
      console.error('❌ Error al eliminar historial:', error);
      return {
        success: false,
        error: `Error al eliminar historial: ${error.message}`
      };
    }

    console.log('✅ Registros de actualización eliminados:', data?.length || 0);
    return {
      success: true,
      deletedCount: data?.length || 0
    };
  } catch (error) {
    console.error('❌ Error inesperado:', error);
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

  console.log('📊 CSV Analysis:');
  console.log('- Total lines:', lines.length);
  console.log('- Expected products:', lines.length - 1);

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
  console.log('- Headers found:', headers);
  
  const products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[] = [];
  let validProductsCount = 0;
  let invalidProductsCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim());
    if (values.length !== headers.length) {
      console.log(`⚠️ Line ${i + 1}: Mismatched columns (${values.length} vs ${headers.length})`);
      invalidProductsCount++;
      continue;
    }

    const product: any = {};
    headers.forEach((header, index) => {
      product[header] = values[index];
    });

    // Validar campos requeridos - usar nombres en inglés
    const hasName = product.name && product.name.trim() !== '';
    const hasPrice = product.price && product.price.trim() !== '';
    
    if (!hasName || !hasPrice) {
      console.log(`⚠️ Line ${i + 1}: Missing required fields - Name: ${hasName}, Price: ${hasPrice}`);
      invalidProductsCount++;
      continue;
    }

    // Convertir precio a número
    const priceValue = parseFloat(product.price);
    if (isNaN(priceValue) || priceValue < 0) {
      console.log(`⚠️ Line ${i + 1}: Invalid price: ${product.price}`);
      invalidProductsCount++;
      continue;
    }

    products.push({
      name: product.name.trim(),
      price: priceValue,
      description: product.description || '',
      category: product.category || '',
      sku: product.sku || '',
      stock_quantity: parseInt(product.stock) || 0,
      status: 'active',
      source: 'csv'
    });
    
    validProductsCount++;
  }

  console.log('📈 CSV Processing Results:');
  console.log('- Valid products:', validProductsCount);
  console.log('- Invalid products:', invalidProductsCount);
  console.log('- Total processed:', validProductsCount + invalidProductsCount);

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

// Eliminar un producto individual
export const deleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('product_catalog')
      .delete()
      .eq('id', productId);

    if (error) {
      return {
        success: false,
        error: `Error al eliminar producto: ${error.message}`
      };
    }

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Interfaces para Prestashop
export interface PrestashopProduct {
  id: number;
  name: string;
  price: string;
  description?: string;
  description_short?: string;
  categories?: Array<{ name: string }>;
  reference?: string;
  ean13?: string;
  upc?: string;
  quantity?: number;
  images?: Array<{ url: string }>;
  combinations?: PrestashopCombination[];
  active?: boolean;
}

export interface PrestashopCombination {
  id: number;
  reference?: string;
  ean13?: string;
  upc?: string;
  price?: string;
  quantity?: number;
  attributes?: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

export interface PrestashopScannedProduct {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sku?: string;
  stock_quantity: number;
  image_url?: string;
  combinations: PrestashopScannedCombination[];
  isActive: boolean;
}

export interface PrestashopScannedCombination {
  id: number;
  reference?: string;
  price: number;
  quantity: number;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

// Función para escanear productos de Prestashop
export const scanPrestashopProducts = async (
  apiUrl: string,
  apiKey: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string; products?: PrestashopScannedProduct[] }> => {
  try {
    console.log('Iniciando escaneo Prestashop:', { apiUrl, apiKey: apiKey ? '***' : 'undefined' });
    
    // Validar URL - PrestaShop puede usar diferentes formatos
    const isValidPrestashopUrl = apiUrl.includes('/api/') || 
                               apiUrl.includes('/webservice/') || 
                               apiUrl.includes('/api') ||
                               apiUrl.includes('/webservice');
    
    if (!isValidPrestashopUrl) {
      return {
        success: false,
        error: 'La URL debe ser una API de Prestashop válida. Formatos soportados: /api/, /webservice/, /api, /webservice'
      };
    }

    onProgress?.(10);

    // Obtener productos
    console.log('Obteniendo productos...');
    const products = await fetchPrestashopProducts(apiUrl, apiKey);
    console.log('Productos obtenidos:', products.length);
    onProgress?.(50);

    if (products.length === 0) {
      return {
        success: false,
        error: 'No se encontraron productos en Prestashop'
      };
    }

    // Procesar productos y combinaciones
    const scannedProducts: PrestashopScannedProduct[] = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const progress = 50 + (i / products.length) * 40;
      onProgress?.(progress);

      // Obtener combinaciones del producto
      const combinations = await fetchPrestashopCombinations(apiUrl, apiKey, product.id);
      
      const scannedProduct: PrestashopScannedProduct = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        description: product.description || product.description_short,
        category: product.categories?.[0]?.name,
        sku: product.reference || product.ean13 || product.upc,
        stock_quantity: product.quantity || 0,
        image_url: product.images?.[0]?.url,
        combinations: combinations.map(combo => ({
          id: combo.id,
          reference: combo.reference,
          price: parseFloat(combo.price || product.price) || 0,
          quantity: combo.quantity || 0,
          attributes: combo.attributes || []
        })),
        isActive: product.active !== false
      };

      scannedProducts.push(scannedProduct);
    }

    onProgress?.(100);
    console.log('Escaneo completado:', scannedProducts.length, 'productos');

    return {
      success: true,
      products: scannedProducts
    };

  } catch (error) {
    console.error('Error en escaneo Prestashop:', error);
    return {
      success: false,
      error: `Error al escanear productos: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Función para obtener productos de Prestashop
const fetchPrestashopProducts = async (
  apiUrl: string,
  apiKey: string
): Promise<PrestashopProduct[]> => {
  const cleanUrl = apiUrl.trim().replace(/\/$/, ''); // Quitar espacios y barra final
  const url = `${cleanUrl}/products?display=full&limit=1000`;
  console.log('Fetching Prestashop products from:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${btoa(`${apiKey}:`)}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Error de Prestashop API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Response data:', data);
  return data.products || [];
};

// Función para obtener combinaciones de un producto
const fetchPrestashopCombinations = async (
  apiUrl: string,
  apiKey: string,
  productId: number
): Promise<PrestashopCombination[]> => {
  try {
    const cleanUrl = apiUrl.trim().replace(/\/$/, ''); // Quitar espacios y barra final
    const url = `${cleanUrl}/products/${productId}/combinations?display=full`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${btoa(`${apiKey}:`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Si no hay combinaciones, devolver array vacío
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Error de Prestashop API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.combinations || [];
  } catch (error) {
    // Si hay error, devolver array vacío (producto sin combinaciones)
    return [];
  }
};

// Función para confirmar y volcar productos de Prestashop
export const confirmPrestashopImport = async (
  products: PrestashopScannedProduct[]
): Promise<{ success: boolean; error?: string; importedCount?: number }> => {
  try {
    // Crear registro de actualización
    const { data: updateRecord, error: updateError } = await supabase
      .from('catalog_updates')
      .insert({
        source: 'prestashop',
        status: 'processing',
        prestashop_url: 'imported_from_scan',
        products_count: products.length
      })
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: `Error al crear registro de actualización: ${updateError.message}`
      };
    }

    // Preparar productos para insertar
    const productsToInsert = products.map(product => ({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      sku: product.sku,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url,
      source: 'prestashop',
      external_id: product.id.toString(),
      status: product.isActive ? 'active' : 'inactive'
    }));

    // Insertar productos principales
    const { error: insertError } = await supabase
      .from('product_catalog')
      .insert(productsToInsert);

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

    // Actualizar registro como completado
    await supabase
      .from('catalog_updates')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', updateRecord.id);

    return {
      success: true,
      importedCount: products.length
    };

  } catch (error) {
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};
