// Proxy para PrestaShop API
const https = require('https');
const http = require('http');

exports.handler = async (event, context) => {
  try {
    console.log('🔍 Prestashop function called');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Parse body
    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      body = {};
    }
    
    const { apiUrl, apiKey } = body;
    
    console.log('📥 Received:', { apiUrl, apiKey: apiKey ? 'PRESENT' : 'MISSING' });
    
    if (!apiUrl || !apiKey) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ error: 'Missing apiUrl or apiKey' })
      };
    }
    
    // Construir URL completa para PrestaShop según documentación oficial
    // Formato requerido: https://domain.com/api/RESOURCE?params
    // apiUrl debe ser la URL base SIN /api al final
    let baseUrl = apiUrl.replace(/\/$/, ''); // Quitar barra final
    
    // Agregar /api/ si no está presente
    if (!baseUrl.includes('/api')) {
      baseUrl = `${baseUrl}/api`;
    }
    
    // Extraer el recurso del path (products, categories, etc.)
    const resourcePath = event.path.replace(/^\/?api\/prestashop\/?/, '') || 'products';
    console.log('📦 Resource:', resourcePath);
    
    // Obtener parámetros de query y agregar output_format=JSON por defecto
    const queryParams = event.queryStringParameters || {};
    const params = new URLSearchParams();
    
    // Agregar parámetros estándar de PrestaShop
    if (queryParams.display) {
      params.append('display', queryParams.display);
    } else {
      params.append('display', 'full'); // Por defecto obtener todos los campos
    }
    
    if (queryParams.limit) {
      params.append('limit', queryParams.limit);
    }
    
    if (queryParams.offset) {
      params.append('offset', queryParams.offset);
    }
    
    const queryString = params.toString();
    
    // Construir la URL final
    const targetUrl = `${baseUrl}/${resourcePath}${queryString ? '?' + queryString : ''}`;
    
    console.log('🌐 Target URL:', targetUrl);
    console.log('📋 URL parts:', { baseUrl, resourcePath, queryString });
    
    // Preparar headers para autenticación básica
    const basicAuth = Buffer.from(`${apiKey}:`).toString('base64');
    
    // Realizar petición
    const url = new URL(targetUrl);
    const client = url.protocol === 'https:' ? https : http;
    
    return new Promise((resolve) => {
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Accept': 'application/json',
          'Io-Format': 'JSON',
          'User-Agent': 'PrestaShop Client'
        }
      };
      
      console.log('📤 Making request:', options.hostname, options.path);
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log('📥 Response status:', res.statusCode);
          console.log('📥 Response headers:', res.headers);
          
          let responseBody;
          const contentType = res.headers['content-type'] || 'application/json';
          
          // Intentar parsear como JSON o XML
          try {
            if (contentType.includes('xml')) {
              responseBody = data;
            } else {
              responseBody = JSON.parse(data);
            }
          } catch (e) {
            responseBody = data;
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: { 
              "Content-Type": "application/json", 
              "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(responseBody)
          });
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ Request error:', error);
        resolve({
          statusCode: 500,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          },
          body: JSON.stringify({ error: error.message })
        });
      });
      
      req.end();
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
