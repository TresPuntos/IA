// Proxy para PrestaShop API
const https = require('https');
const http = require('http');

exports.handler = async (event, context) => {
  try {
    console.log('🔍 Prestashop function called');
    console.log('📋 Full Event:', JSON.stringify({
      path: event.path,
      httpMethod: event.httpMethod,
      queryStringParameters: event.queryStringParameters,
      pathParameters: event.pathParameters,
      headers: event.headers
    }, null, 2));
    
    // Parse body
    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      console.error('Error parsing body:', e);
      body = {};
    }
    
    const { apiUrl, apiKey } = body;
    
    console.log('📥 Received:', { 
      apiUrl, 
      apiKey: apiKey ? 'PRESENT' : 'MISSING',
      eventPath: event.path,
      queryParams: event.queryStringParameters
    });
    
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
    
    // Construir URL completa para PrestaShop según PHP
    // PHP usa: PRESTASHOP_URL = 'https://100x100chef.com/shop/api/'
    // apiUrl viene sin /api, ejemplo: https://100x100chef.com/shop
    let baseUrl = apiUrl.replace(/\/$/, ''); // Quitar barra final
    
    // Agregar /api/ con barra final (como en PHP)
    if (!baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl}/api`;
    }
    // Asegurar barra final después de /api (como en PHP)
    if (!baseUrl.endsWith('/api/')) {
      baseUrl = `${baseUrl}/`;
    }
    
    // Extraer el recurso del path
    // Netlify redirect con :splat puede venir como:
    // - "/api/prestashop/products/1" (directo)
    // - "/.netlify/functions/prestashop/products/1" (después del redirect)
    // - O el path puede estar en event.pathParameters.splat
    let resourcePath = 'products';
    
    // Intentar obtener desde pathParameters.splat (Netlify lo inyecta con :splat)
    if (event.pathParameters && event.pathParameters.splat) {
      resourcePath = event.pathParameters.splat;
      console.log('📦 Resource Path from splat:', resourcePath);
    } else {
      // Fallback: extraer del path manualmente
      const pathMatch = event.path.match(/(?:api\/prestashop|\.netlify\/functions\/prestashop)\/(.+)/);
      if (pathMatch) {
        resourcePath = pathMatch[1];
      }
      console.log('📦 Resource Path from path:', resourcePath);
    }
    
    console.log('📦 Final Resource Path:', resourcePath);
    console.log('📦 Base URL:', baseUrl);
    
    // Obtener parámetros de query
    const queryParams = event.queryStringParameters || {};
    const params = new URLSearchParams();
    
    // Agregar parámetros estándar de PrestaShop
    params.append('display', queryParams.display || 'full');
    
    if (queryParams.limit) {
      params.append('limit', queryParams.limit);
    }
    
    if (queryParams.offset) {
      params.append('offset', queryParams.offset);
    }
    
    // Agregar language si está presente (importante para PrestaShop)
    if (queryParams.language) {
      params.append('language', queryParams.language);
    }
    
    // Agregar output_format=JSON explícitamente
    if (queryParams.output_format) {
      params.append('output_format', queryParams.output_format);
    }
    
    const queryString = params.toString();
    
    // Construir la URL final exactamente como en PHP
    // PHP: PRESTASHOP_URL . "products/$id_producto?language=$current_lang_code&output_format=JSON&ws_key=" . API_KEY
    // baseUrl ya tiene barra final: "https://100x100chef.com/shop/api/"
    // resourcePath puede ser "products/1" o "products"
    // No agregar barra adicional porque baseUrl ya termina en /
    let targetUrl = `${baseUrl}${resourcePath}`;
    
    // Construir query string como en PHP (language primero, luego output_format, luego ws_key)
    const queryParts = [];
    if (queryParams.language) {
      queryParts.push(`language=${queryParams.language}`);
    }
    queryParts.push('output_format=JSON');
    queryParts.push(`ws_key=${apiKey}`);
    
    // Agregar otros parámetros si existen
    if (queryParams.display) {
      queryParts.push(`display=${queryParams.display}`);
    }
    if (queryParams.limit) {
      queryParts.push(`limit=${queryParams.limit}`);
    }
    
    if (queryParts.length > 0) {
      targetUrl += `?${queryParts.join('&')}`;
    }
    
    console.log('🌐 Target URL:', targetUrl);
    console.log('📋 URL breakdown:', { baseUrl, resourcePath, queryString });
    
    // Preparar headers para autenticación básica (como en PHP)
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
        },
        timeout: 25000 // Timeout de 25 segundos (Netlify tiene límite de 26s)
      };
      
      console.log('📤 Making request:', options.hostname, options.path);
      console.log('🔑 Auth:', basicAuth ? 'Present' : 'Missing');
      
      let timeout;
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (timeout) clearTimeout(timeout);
          
          console.log('📥 Response status:', res.statusCode);
          console.log('📥 Response headers:', res.headers);
          
          let responseBody;
          const contentType = res.headers['content-type'] || 'application/json';
          
          // Si hay error, incluir más detalles
          if (res.statusCode >= 400) {
            console.error('❌ Error response from PrestaShop:', res.statusCode);
            console.error('❌ Response data:', data.substring(0, 500));
          }
          
          // Intentar parsear como JSON o XML
          try {
            if (contentType.includes('xml')) {
              responseBody = { xml: data, error: 'PrestaShop returned XML instead of JSON' };
            } else {
              responseBody = JSON.parse(data);
            }
          } catch (e) {
            console.error('❌ Error parsing response:', e.message);
            responseBody = { 
              error: 'Invalid response format', 
              raw: data.substring(0, 500),
              parseError: e.message
            };
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
      
      // Timeout handler
      timeout = setTimeout(() => {
        req.destroy();
        console.error('❌ Request timeout after 25 seconds');
        resolve({
          statusCode: 504,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          },
          body: JSON.stringify({ 
            error: 'Request timeout',
            message: 'La petición a PrestaShop excedió el tiempo máximo de espera (25 segundos)'
          })
        });
      }, 25000);
      
      req.on('error', (error) => {
        if (timeout) clearTimeout(timeout);
        console.error('❌ Request error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        let errorMessage = error.message;
        if (error.code === 'ENOTFOUND') {
          errorMessage = 'No se pudo resolver el hostname de PrestaShop';
        } else if (error.code === 'ECONNREFUSED') {
          errorMessage = 'PrestaShop rechazó la conexión';
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Timeout al conectar con PrestaShop';
        }
        
        resolve({
          statusCode: 502,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          },
          body: JSON.stringify({ 
            error: errorMessage,
            code: error.code,
            details: 'Error al conectar con el servidor de PrestaShop'
          })
        });
      });
      
      req.setTimeout(25000, () => {
        req.destroy();
        if (timeout) clearTimeout(timeout);
        console.error('❌ Request timeout (setTimeout)');
        resolve({
          statusCode: 504,
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          },
          body: JSON.stringify({ 
            error: 'Request timeout',
            message: 'La petición excedió el tiempo máximo de espera'
          })
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
