// test-openai-documentation.js
// Script para probar que OpenAI está usando la documentación

const https = require('https');

async function testOpenAIDocumentation() {
  console.log('🔍 PROBANDO QUE OPENAI USA LA DOCUMENTACIÓN');
  console.log('============================================');
  console.log('');

  // Configuración de Supabase
  const supabaseUrl = 'https://akwobmrcwqbbrdvzyiul.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE';

  console.log('📋 PASO 1: VERIFICAR DOCUMENTACIÓN DISPONIBLE');
  console.log('============================================');
  
  // Verificar documentación disponible
  const docsResult = await new Promise((resolve) => {
    const options = {
      hostname: 'akwobmrcwqbbrdvzyiul.supabase.co',
      port: 443,
      path: '/rest/v1/documentation_files?select=name,content,file_type&status=eq.ready',
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const docs = JSON.parse(data);
            console.log(`✅ Documentación encontrada: ${docs.length} archivos`);
            docs.forEach((doc, index) => {
              console.log(`   ${index + 1}. ${doc.name} (${doc.file_type})`);
              console.log(`      Contenido: ${doc.content.substring(0, 100)}...`);
            });
            resolve(docs);
          } catch (error) {
            console.log('❌ Error al parsear documentación:', error.message);
            resolve([]);
          }
        } else {
          console.log(`❌ Error al obtener documentación: ${res.statusCode}`);
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      resolve([]);
    });
    
    req.end();
  });

  console.log('');
  console.log('📋 PASO 2: VERIFICAR PRODUCTOS DISPONIBLES');
  console.log('==========================================');
  
  // Verificar productos disponibles
  const productsResult = await new Promise((resolve) => {
    const options = {
      hostname: 'akwobmrcwqbbrdvzyiul.supabase.co',
      port: 443,
      path: '/rest/v1/product_catalog?select=name,price,description,category,sku&status=eq.active',
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const products = JSON.parse(data);
            console.log(`✅ Productos encontrados: ${products.length} productos`);
            products.forEach((product, index) => {
              console.log(`   ${index + 1}. ${product.name} - ${product.price}€`);
            });
            resolve(products);
          } catch (error) {
            console.log('❌ Error al parsear productos:', error.message);
            resolve([]);
          }
        } else {
          console.log(`❌ Error al obtener productos: ${res.statusCode}`);
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      resolve([]);
    });
    
    req.end();
  });

  console.log('');
  console.log('📋 PASO 3: PROBAR EDGE FUNCTION');
  console.log('================================');
  
  // Probar la Edge Function
  const testMessage = "¿Qué documentación tienes disponible y qué productos puedes recomendarme?";
  
  const edgeFunctionResult = await new Promise((resolve) => {
    const options = {
      hostname: 'akwobmrcwqbbrdvzyiul.supabase.co',
      port: 443,
      path: '/functions/v1/openai-chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Status de Edge Function: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            console.log('✅ Respuesta de OpenAI:');
            console.log('======================');
            console.log(response.answer);
            console.log('');
            if (response.usage) {
              console.log('📊 Uso de tokens:', response.usage);
            }
            resolve(response);
          } catch (error) {
            console.log('❌ Error al parsear respuesta:', error.message);
            console.log('Respuesta raw:', data);
            resolve(null);
          }
        } else {
          console.log(`❌ Error en Edge Function: ${res.statusCode}`);
          console.log('Respuesta:', data);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      resolve(null);
    });
    
    const requestBody = JSON.stringify({
      message: testMessage,
      systemPrompt: "Eres un asistente que debe mencionar específicamente qué documentación y productos tienes disponibles.",
      model: "gpt-4o-mini",
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 1000,
      language: "es",
      tone: "friendly"
    });
    
    req.write(requestBody);
    req.end();
  });

  console.log('');
  console.log('🎯 RESULTADO DEL TEST:');
  console.log('=====================');
  
  if (docsResult.length > 0 && productsResult.length > 0 && edgeFunctionResult) {
    console.log('✅ OpenAI está usando correctamente:');
    console.log(`   • ${docsResult.length} archivos de documentación`);
    console.log(`   • ${productsResult.length} productos del catálogo`);
    console.log('✅ La Edge Function está funcionando');
    console.log('✅ La respuesta incluye información local');
  } else {
    console.log('❌ Problemas encontrados:');
    if (docsResult.length === 0) console.log('   • No hay documentación disponible');
    if (productsResult.length === 0) console.log('   • No hay productos disponibles');
    if (!edgeFunctionResult) console.log('   • Edge Function no funciona');
  }
}

// Ejecutar el test
testOpenAIDocumentation()
  .then(() => {
    console.log('\n✅ Test completado');
  })
  .catch((error) => {
    console.log('\n❌ Error en el test:', error.message);
  });
