import { supabase } from './supabaseClient';

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
        prestashop_products: 0,
        last_update: null
      };
    }

    // Contar productos por fuente y estado
    const csvProducts = products?.filter(p => p.source === 'csv') || [];
    const woocommerceProducts = products?.filter(p => p.source === 'woocommerce') || [];
    const prestashopProducts = products?.filter(p => p.source === 'prestashop') || [];
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
      prestashop_products: prestashopProducts.length,
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
      external_id: product.external_id || '',
      status: product.status || 'active',
      source: product.source || 'csv'
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
      image_url: product.image_url || product.image || '',
      external_id: product.product_url || product.url || '',
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
  const allProducts: WooCommerceProduct[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;
  
  console.log('Fetching WooCommerce products with pagination');
  
  while (hasMore) {
    const url = `${apiUrl}/products?per_page=${perPage}&page=${page}`;
    console.log(`Fetching page ${page}...`);
    
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

    const products = await response.json();
    console.log(`✅ Obtained ${products.length} products from page ${page}`);
    
    if (Array.isArray(products)) {
      allProducts.push(...products);
    }
    
    // Si obtuvimos menos productos que perPage, hemos terminado
    if (products.length < perPage) {
      hasMore = false;
    } else {
      page++;
    }
  }
  
  console.log(`✅ Total WooCommerce productos obtenidos: ${allProducts.length}`);
  return allProducts;
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
  id_default_image?: number;
  name: string | Array<{ value: string }>;
  link_rewrite?: string | Array<{ value: string }>;
  price: string;
  description?: string | Array<{ value: string }>;
  description_short?: string | Array<{ value: string }>;
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
  external_id?: string; // URL del producto en PrestaShop
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

// Tipo para el callback de progreso con información adicional
export type ProgressCallback = (progress: number, info?: { productsObtained?: number; productsTotal?: number; currentProduct?: number }) => void;

// Función para escanear productos de Prestashop
export const scanPrestashopProducts = async (
  apiUrl: string,
  apiKey: string,
  onProgress?: ProgressCallback
): Promise<{ success: boolean; error?: string; products?: PrestashopScannedProduct[] }> => {
  try {
    console.log('Iniciando escaneo Prestashop:', { apiUrl, apiKey: apiKey ? '***' : 'undefined' });
    
    // Asegurar que la URL NO termine en /api/
    // La función de Netlify agregará /api/ automáticamente
    let finalApiUrl = apiUrl.trim().replace(/\/$/, '');
    
    // Quitar /api/ o /api si ya existe
    finalApiUrl = finalApiUrl.replace(/\/api\/?$/, '');
    
    console.log('🔧 URL base que se enviará a Netlify:', finalApiUrl);

    onProgress?.(10, { productsObtained: 0 });

    // Obtener productos (pasamos el callback para actualizar progreso durante la obtención)
    console.log('Obteniendo productos...');
    let productsObtainedCount = 0;
    const products = await fetchPrestashopProducts(finalApiUrl, apiKey, (progress, info) => {
      productsObtainedCount = info?.productsObtained || productsObtainedCount;
      onProgress?.(progress, { ...info, productsObtained: productsObtainedCount });
    });
    console.log('Productos obtenidos:', products.length);
    onProgress?.(50, { productsObtained: products.length, productsTotal: products.length });

    if (products.length === 0) {
      return {
        success: false,
        error: 'No se encontraron productos en Prestashop'
      };
    }

    // Extraer BASE_URL (sin /api/) - como en PHP
    let baseUrl = finalApiUrl.trim().replace(/\/$/, '');
    baseUrl = baseUrl.replace(/\/api\/?$/, ''); // Quitar /api si existe
    
    // Procesar productos y combinaciones
    const scannedProducts: PrestashopScannedProduct[] = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const progress = 50 + (i / products.length) * 40;
      onProgress?.(progress, { 
        productsObtained: products.length, 
        productsTotal: products.length, 
        currentProduct: i + 1 
      });

      // Obtener combinaciones del producto
      const combinations = await fetchPrestashopCombinations(finalApiUrl, apiKey, product.id);
      
      // Procesar name y link_rewrite (pueden ser array o string, como en PHP)
      const productName = Array.isArray(product.name) 
        ? product.name[0]?.value || product.name[0] || ''
        : product.name || '';
      
      const linkRewrite = Array.isArray(product.link_rewrite)
        ? product.link_rewrite[0]?.value || product.link_rewrite[0] || ''
        : product.link_rewrite || '';
      
      // Construir URL de imagen según formato PHP: BASE_URL . "{$image_id}-{$image_type}/{$link_rewrite}.jpg"
      let imageUrl = '';
      if (product.id_default_image && linkRewrite) {
        const imageType = 'medium_default'; // como en PHP
        imageUrl = `${baseUrl}/${product.id_default_image}-${imageType}/${linkRewrite}.jpg`;
      } else if (product.images && product.images.length > 0) {
        // Fallback a la URL de la API si no podemos construirla
        imageUrl = product.images[0].url;
      }
      
      // Construir URL del producto según formato PHP: BASE_URL . "{$category_path}/{$product['id']}-{$link_rewrite}" + ean13 si existe + ".html"
      let productUrl = '';
      if (linkRewrite) {
        const categoryPath = 'inicio'; // Categoría fija como en PHP (o puedes usar la primera categoría si existe)
        productUrl = `${baseUrl}/${categoryPath}/${product.id}-${linkRewrite}`;
        if (product.ean13) {
          productUrl += `-${product.ean13}`;
        }
        productUrl += '.html';
      }
      
      // Procesar descripción (puede ser array o string)
      const description = Array.isArray(product.description) 
        ? product.description[0]?.value || product.description[0] || ''
        : product.description || '';
      
      const descriptionShort = Array.isArray(product.description_short)
        ? product.description_short[0]?.value || product.description_short[0] || ''
        : product.description_short || '';
      
      const scannedProduct: PrestashopScannedProduct = {
        id: product.id,
        name: productName,
        price: parseFloat(product.price) || 0,
        description: description || descriptionShort,
        category: product.categories?.[0]?.name,
        sku: product.reference || product.ean13 || product.upc,
        stock_quantity: product.quantity || 0,
        image_url: imageUrl,
        external_id: productUrl,
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

// Función para obtener productos de Prestashop con retry logic
const fetchPrestashopProducts = async (
  apiUrl: string,
  apiKey: string,
  onProgress?: ProgressCallback
): Promise<PrestashopProduct[]> => {
  console.log('Fetching Prestashop products:', apiUrl);
  console.log('API Key:', apiKey ? '***' : 'undefined');
  
  const allProducts: PrestashopProduct[] = [];
  let limit = 10; // Reducir MÁS el límite para evitar exceder el tamaño de payload
  let offset = 0;
  let hasMore = true;
  let consecutiveErrors = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 segundos entre intentos
  
  // Estimar total basado en el primer batch (ajustaremos después)
  let estimatedTotal = 100; // Estimación inicial conservadora
  
  // Helper function para retry con backoff exponencial y mejor manejo de errores
  const fetchWithRetry = async (url: string, options: RequestInit, retryCount = 0): Promise<Response> => {
    try {
      console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries} to fetch:`, url);
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000) // Timeout de 30 segundos
      });
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      // Si es un error del servidor (5xx), lanzar error
      if (!response.ok && response.status >= 500) {
        console.error(`❌ Server error detected: ${response.status}`);
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Si es un error del cliente (4xx), no retry, solo lanzar
      if (!response.ok && response.status >= 400 && response.status < 500) {
        const errorText = await response.text();
        console.error(`❌ Client error: ${response.status}`, errorText);
        throw new Error(`Client error: ${response.status} - ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error(`❌ Error in fetchWithRetry (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        const delay = retryDelay * Math.pow(2, retryCount); // Backoff exponencial
        console.log(`⏳ Retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retryCount + 1);
      }
      
      console.error(`❌ Max retries reached. Final error:`, error);
      throw error;
    }
  };
  
  while (hasMore) {
    // Según la guía de Prestashop, el formato correcto es limit=offset,cantidad
    const prestashopLimit = `${offset},${limit}`;
    console.log(`📥 Fetching batch (PrestaShop format): offset=${offset}, limit=${limit}, format=limit=offset,cantidad`);
    
    try {
      // Usar Netlify Function para evitar problemas de Egress en Supabase
      // URL relativa que funciona tanto en desarrollo como en producción
      const proxyUrl = `/api/prestashop/products?display=full&limit=${prestashopLimit}`;
      
      const response = await fetchWithRetry(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiUrl,
          apiKey
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Si es un error 502 o 503, intentar con un límite más pequeño
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          consecutiveErrors++;
          
          // Obtener más detalles del error
          let errorDetails = '';
          try {
            const errorText = await response.text();
            errorDetails = errorText;
            console.log(`⚠️ Error response details:`, errorDetails);
            
            // Detectar si es un error de tamaño de payload
            if (errorDetails.includes('ResponseSizeTooLarge') || errorDetails.includes('payload size')) {
              console.log(`🚨 PAYLOAD TOO LARGE DETECTED! Reducing batch size aggressively...`);
            }
          } catch (e) {
            console.log('Could not read error response');
          }
          
          console.log(`⚠️ Server error detected (${response.status}). Reducing batch size...`);
          
          if (limit > 5) {
            limit = Math.max(5, Math.floor(limit / 2));
            console.log(`🔄 Retrying with smaller limit: ${limit}`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          } else if (consecutiveErrors >= 3) {
            console.error('❌ Too many consecutive errors. Stopping fetch.');
            break;
          }
        } else {
          throw new Error(`Error de Prestashop API: ${response.status} ${response.statusText}`);
        }
      } else {
        consecutiveErrors = 0; // Resetear contador de errores
      }

      const contentType = response.headers.get('content-type') || '';
      console.log('Content type:', contentType);
      
      let data;
      if (contentType.includes('xml')) {
        console.log('⚠️ PrestaShop devolvió XML, no JSON');
        break;
      } else {
        data = await response.json();
      }
      
      const products = data.products || data || [];
      console.log(`✅ Obtained ${products.length} products in this batch`);
      
      if (Array.isArray(products)) {
        allProducts.push(...products);
      } else if (products && typeof products === 'object') {
        // Si es un objeto único, convertirlo a array
        allProducts.push(products);
      }
      
      // Actualizar estimación del total si es el primer batch
      if (offset === 0 && products.length === limit) {
        // Si obtuvimos un batch completo, estimar que hay más
        estimatedTotal = Math.max(estimatedTotal, offset + limit * 2);
      }
      
      // Si obtuvimos menos productos que el límite, hemos terminado
      const isLastBatch = products.length < limit || products.length === 0;
      
      if (isLastBatch) {
        hasMore = false;
        // Actualizar el total real
        estimatedTotal = allProducts.length;
      } else {
        offset += limit;
        // Aumentar estimación si seguimos obteniendo productos completos
        if (products.length === limit && offset > estimatedTotal) {
          estimatedTotal = offset + limit * 2; // Estimación conservadora
        }
      }
      
      // Calcular progreso estimado (10% inicial + hasta 40% durante obtención)
      // Usamos una estimación progresiva: mientras más productos obtenemos, más seguro estamos del total
      const baseProgress = 10; // Ya tenemos 10% inicial
      const maxProgressDuringFetch = 50; // Queremos llegar al 50% al terminar
      const progressRange = maxProgressDuringFetch - baseProgress; // 40% de rango
      
      // Si es el último batch, llegar directamente al 50%
      if (isLastBatch) {
        onProgress?.(maxProgressDuringFetch, { 
          productsObtained: allProducts.length, 
          productsTotal: allProducts.length 
        });
      } else {
        // Calcular progreso: basado en productos obtenidos vs estimación
        // Usamos una función más suave que progrese gradualmente
        const currentProgress = Math.min(
          baseProgress + (allProducts.length / Math.max(estimatedTotal, allProducts.length + limit * 2)) * progressRange,
          maxProgressDuringFetch - 2 // Dejar un pequeño margen
        );
        
        onProgress?.(Math.round(currentProgress), { 
          productsObtained: allProducts.length, 
          productsTotal: estimatedTotal 
        });
      }
      
      // Pequeña pausa entre requests para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('❌ Error fetching batch:', error);
      console.error('Error details:', {
        offset,
        limit,
        consecutiveErrors,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      
      consecutiveErrors++;
      console.log(`⚠️ Consecutive errors: ${consecutiveErrors}/3`);
      
      if (consecutiveErrors >= 3) {
        console.error('❌ Too many consecutive errors. Stopping fetch.');
        console.error('Last error:', error);
        
        // Proporcionar un mensaje de error más informativo
        const finalError = error instanceof Error 
          ? new Error(`Error persistente al escanear Prestashop. Último error: ${error.message}. Intentó ${consecutiveErrors} veces con diferentes tamaños de batch.`)
          : new Error('Error desconocido al escanear Prestashop');
        
        throw finalError;
      }
      
      // Reducir límite y continuar
      if (limit > 5) {
        limit = Math.max(5, Math.floor(limit / 2));
        console.log(`🔄 Reducing limit from ${limit * 2} to ${limit} due to error`);
      } else {
        console.log(`⚠️ Limit already at minimum (${limit}). Will retry with same size.`);
      }
      
      // Esperar antes de retry
      console.log('⏳ Waiting before retry...');
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  console.log(`✅ Total productos obtenidos: ${allProducts.length}`);
  return allProducts;
};

// Función para obtener combinaciones de un producto
const fetchPrestashopCombinations = async (
  apiUrl: string,
  apiKey: string,
  productId: number
): Promise<PrestashopCombination[]> => {
  try {
    // Usar Netlify Function para evitar problemas de Egress en Supabase
    const cleanUrlWithoutApi = apiUrl.trim().replace(/\/$/, '').replace(/\/api\/?$/, '');
    
    // URL relativa que funciona tanto en desarrollo como en producción
    const proxyUrl = `/api/prestashop/products/${productId}/combinations?display=full`;
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiUrl: cleanUrlWithoutApi,
        apiKey
      })
    });

    if (!response.ok) {
      // Si no hay combinaciones, devolver array vacío
      if (response.status === 404) {
        return [];
      }
      console.warn(`⚠️ Error obteniendo combinaciones para producto ${productId}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.combinations || [];
  } catch (error) {
    // Si hay error, devolver array vacío (producto sin combinaciones)
    console.warn(`⚠️ Error obteniendo combinaciones para producto ${productId}:`, error);
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
      external_id: product.external_id || product.id.toString(), // URL del producto o ID como fallback
      source: 'prestashop',
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
