// Proxy simplificado para PrestaShop - TEST
exports.handler = async (event, context) => {
  try {
    console.log('🔍 Prestashop function called');
    
    // Parse body
    const body = JSON.parse(event.body || '{}');
    const { apiUrl, apiKey } = body;
    
    console.log('📥 Received:', { apiUrl, apiKey: apiKey ? 'PRESENT' : 'MISSING' });
    
    if (!apiUrl || !apiKey) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: 'Missing apiUrl or apiKey' })
      };
    }
    
    // Build URL
    const path = event.path.replace(/^\/?api\/prestashop\/?/, '');
    const queryString = new URLSearchParams(event.queryStringParameters || {}).toString();
    const targetUrl = `${apiUrl}/${path}${queryString ? '?' + queryString : ''}`;
    
    console.log('🌐 Target URL:', targetUrl);
    
    // Call PrestaShop
    const basicAuth = "Basic " + Buffer.from(`${apiKey}:`).toString("base64");
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': basicAuth,
        'Accept': 'application/json'
      }
    });
    
    console.log('📥 Response status:', response.status);
    const contentType = response.headers.get('content-type') || '';
    
    // Get content type
    const data = contentType.includes('xml') 
      ? await response.text()
      : await response.json();
    
    console.log('📦 Content type:', contentType);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 
          "Content-Type": contentType || "application/json", 
          "Access-Control-Allow-Origin": "*" 
        },
        body: typeof data === 'string' ? data : JSON.stringify(data)
      };
    }
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": contentType || "application/json", 
        "Access-Control-Allow-Origin": "*" 
      },
      body: typeof data === 'string' ? data : JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
