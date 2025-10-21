// Script simple para limpiar usando fetch directo
async function cleanupAll() {
  console.log('🗑️ Iniciando limpieza completa...');
  
  try {
    // Usar la función Edge de Supabase directamente
    const response = await fetch('https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog', {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzAsImV4cCI6MjA1MDE1MDgzMH0.8QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzAsImV4cCI6MjA1MDE1MDgzMH0.8QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Productos eliminados exitosamente');
    } else {
      console.error('❌ Error eliminando productos:', response.status, response.statusText);
    }

    // Eliminar historial
    const historyResponse = await fetch('https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/catalog_updates', {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzAsImV4cCI6MjA1MDE1MDgzMH0.8QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzAsImV4cCI6MjA1MDE1MDgzMH0.8QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ',
        'Content-Type': 'application/json'
      }
    });

    if (historyResponse.ok) {
      console.log('✅ Historial eliminado exitosamente');
    } else {
      console.error('❌ Error eliminando historial:', historyResponse.status, historyResponse.statusText);
    }

    console.log('🎉 Limpieza completa!');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

cleanupAll();
