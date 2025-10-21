// Script para limpiar todo el catálogo
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://akwobmrcwqbbrdvzyiul.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzAsImV4cCI6MjA1MDE1MDgzMH0.8QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAll() {
  console.log('🗑️ Iniciando limpieza completa...');
  
  try {
    // 1. Eliminar todos los productos
    console.log('📦 Eliminando productos...');
    const { data: products, error: productsError } = await supabase
      .from('product_catalog')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');
    
    if (productsError) {
      console.error('❌ Error eliminando productos:', productsError);
    } else {
      console.log('✅ Productos eliminados:', products?.length || 0);
    }

    // 2. Eliminar historial de actualizaciones
    console.log('📋 Eliminando historial...');
    const { data: history, error: historyError } = await supabase
      .from('catalog_updates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id');
    
    if (historyError) {
      console.error('❌ Error eliminando historial:', historyError);
    } else {
      console.log('✅ Historial eliminado:', history?.length || 0);
    }

    console.log('🎉 Limpieza completa exitosa!');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

cleanupAll();
