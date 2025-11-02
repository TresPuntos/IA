#!/usr/bin/env node

/**
 * Script para probar la importación de productos de PrestaShop
 * Basado en el código PHP que funciona
 */

const https = require('https');
const http = require('http');

// Credenciales desde obtener_grid_productos.php
const API_KEY = 'E5CUG6DLAD9EA46AIN7Z2LIX1W3IIJKZ';
const PRESTASHOP_URL = 'https://100x100chef.com/shop/api/';
const BASE_URL = 'https://100x100chef.com/shop/';

// Función para hacer petición HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
        'Accept': 'application/json',
        'User-Agent': 'PrestaShop Test Script',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('json')) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: JSON.parse(data)
            });
          } else {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: data
            });
          }
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Función para probar obtener un producto individual (como en PHP)
async function testSingleProduct() {
  console.log('🧪 TEST 1: Obtener un producto individual');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Primero obtener un ID válido de la lista
    const listUrl = `${PRESTASHOP_URL}products?display=full&limit=0,1&output_format=JSON&ws_key=${API_KEY}`;
    const listResponse = await makeRequest(listUrl);
    
    let productId = 21; // ID por defecto si falla
    if (listResponse.status === 200 && listResponse.body.products) {
      const products = Array.isArray(listResponse.body.products) 
        ? listResponse.body.products 
        : [listResponse.body.products];
      if (products.length > 0) {
        productId = products[0].id;
      }
    }
    
    // Probar con el producto ID obtenido
    const url = `${PRESTASHOP_URL}products/${productId}?language=1&output_format=JSON&ws_key=${API_KEY}`;
    
    console.log(`📡 Petición: ${url.replace(API_KEY, '***')}`);
    
    const response = await makeRequest(url);
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200 && response.body.product) {
      const product = response.body.product;
      
      // Procesar como en PHP
      const name = Array.isArray(product.name) ? product.name[0].value : product.name;
      const linkRewrite = Array.isArray(product.link_rewrite) 
        ? product.link_rewrite[0].value 
        : product.link_rewrite;
      
      // Construir URL de imagen como en PHP
      const imageId = product.id_default_image;
      const imageType = 'medium_default';
      const imageUrl = `${BASE_URL}${imageId}-${imageType}/${linkRewrite}.jpg`;
      
      // Construir URL del producto como en PHP
      const categoryPath = 'inicio';
      let productUrl = `${BASE_URL}${categoryPath}/${product.id}-${linkRewrite}`;
      if (product.ean13) {
        productUrl += `-${product.ean13}`;
      }
      productUrl += '.html';
      
      console.log('✅ Producto obtenido:');
      console.log(`   ID: ${product.id}`);
      console.log(`   Nombre: ${name}`);
      console.log(`   link_rewrite: ${linkRewrite}`);
      console.log(`   id_default_image: ${imageId}`);
      console.log(`   ean13: ${product.ean13 || 'N/A'}`);
      console.log(`   📷 URL Imagen: ${imageUrl}`);
      console.log(`   🔗 URL Producto: ${productUrl}`);
      
      return { success: true, product };
    } else {
      console.log('❌ Error: No se obtuvo el producto');
      console.log('Response:', JSON.stringify(response.body, null, 2));
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error };
  }
}

// Función para probar obtener lista de productos
async function testProductsList() {
  console.log('\n🧪 TEST 2: Obtener lista de productos (límite 5)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Probar con límite de 5 productos
    const url = `${PRESTASHOP_URL}products?display=full&limit=0,5&output_format=JSON&ws_key=${API_KEY}`;
    
    console.log(`📡 Petición: ${url.replace(API_KEY, '***')}`);
    
    const response = await makeRequest(url);
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200 && response.body.products) {
      const products = Array.isArray(response.body.products) 
        ? response.body.products 
        : [response.body.products];
      
      console.log(`✅ Productos obtenidos: ${products.length}`);
      
      // Procesar el primer producto como ejemplo
      if (products.length > 0) {
        const product = products[0];
        const name = Array.isArray(product.name) ? product.name[0].value : product.name;
        const linkRewrite = Array.isArray(product.link_rewrite) 
          ? product.link_rewrite[0].value 
          : product.link_rewrite;
        
        const imageId = product.id_default_image;
        const imageUrl = imageId && linkRewrite 
          ? `${BASE_URL}${imageId}-medium_default/${linkRewrite}.jpg`
          : 'N/A';
        
        console.log('\n📦 Primer producto procesado:');
        console.log(`   ID: ${product.id}`);
        console.log(`   Nombre: ${name}`);
        console.log(`   📷 URL Imagen: ${imageUrl}`);
      }
      
      return { success: true, count: products.length };
    } else {
      console.log('❌ Error: No se obtuvieron productos');
      console.log('Response:', JSON.stringify(response.body, null, 2));
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error };
  }
}

// Función principal
async function runTests() {
  console.log('🚀 PRUEBA DE IMPORTACIÓN DE PRESTASHOP');
  console.log('========================================\n');
  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`🌐 URL API: ${PRESTASHOP_URL}`);
  console.log(`🏪 URL Base: ${BASE_URL}\n`);
  
  const test1 = await testSingleProduct();
  const test2 = await testProductsList();
  
  console.log('\n📋 RESUMEN DE PRUEBAS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Test 1 (Producto individual): ${test1.success ? '✅ PASÓ' : '❌ FALLÓ'}`);
  console.log(`Test 2 (Lista de productos): ${test2.success ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  if (test1.success && test2.success) {
    console.log('\n✅ TODAS LAS PRUEBAS PASARON');
    console.log('🎯 La importación debería funcionar correctamente');
    console.log('\n💡 Siguiente paso: Prueba la importación desde la interfaz web');
  } else {
    console.log('\n❌ ALGUNAS PRUEBAS FALLARON');
    console.log('🔍 Revisa los errores arriba');
  }
}

// Ejecutar pruebas
runTests().catch(console.error);

