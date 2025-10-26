// Proxy sólido para PrestaShop Webservice
export const handler = async (event, context) => {
  try {
    console.log('🔍 Prestashop function called:', JSON.stringify({ path: event.path, method: event.httpMethod }));
    
    // Si es POST, el frontend envía las credenciales en el body
    let base, apiKey;
    
    if (event.httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body || '{}');
        base = body.apiUrl?.replace(/\/+$/, '');
        apiKey = body.apiKey;
        console.log('📥 Credenciales recibidas:', { base: base || 'MISSING', apiKey: apiKey ? 'PRESENT' : 'MISSING' });
      } catch (parseError) {
        console.error('❌ Error parseando body:', parseError);
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: true, message: 'Invalid request body' })
        };
      }
    } else {
      // Si es GET, usar credenciales de entorno (para pruebas)
      base = process.env.PRESTASHOP_BASE_URL?.replace(/\/+$/, '');
      apiKey = process.env.PRESTASHOP_API_KEY;
      console.log('📥 Usando credenciales de entorno:', { base: base || 'MISSING', apiKey: apiKey ? 'PRESENT' : 'MISSING' });
    }
    
    if (!base || !apiKey) {
      console.error('❌ Missing credentials:', { base: !!base, apiKey: !!apiKey });
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: true, message: 'Missing credentials', details: { base: !!base, apiKey: !!apiKey } })
      };
    }
    
    // Extraer el endpoint de la ruta
    // event.path: /api/prestashop/products
    const path = event.path.replace(/^\/?api\/prestashop\/?/, ""); // products
    console.log('📍 Path extraído:', path);
    
    // Construir URL completa con el endpoint
    const url = `${base}/${path}`;
    console.log('🔗 URL final:', url);

    // Pasa querystring del cliente (como display=full&limit=1)
    const qp = new URLSearchParams(event.queryStringParameters || {});
    const queryString = qp.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    console.log('🌐 URL completa con query:', fullUrl);

    // Usar Basic Auth con las credenciales obtenidas
    const basic = "Basic " + Buffer.from(`${apiKey}:`).toString("base64");

    // Construye headers hacia PrestaShop
    const outgoingHeaders = new Headers();
    // Content-Type sólo si hay body
    if (["POST","PUT","PATCH"].includes(event.httpMethod) && event.headers["content-type"]) {
      outgoingHeaders.set("Content-Type", event.headers["content-type"]);
    }
    outgoingHeaders.set("Authorization", basic);
    outgoingHeaders.set("Accept", "application/json, application/xml, */*");

    // Body sólo para métodos con payload
    const hasBody = ["POST","PUT","PATCH","DELETE"].includes(event.httpMethod);
    console.log('📡 Llamando a PrestaShop:', fullUrl);
    const resp = await fetch(fullUrl, {
      method: event.httpMethod === "OPTIONS" ? "GET" : event.httpMethod, // Netlify maneja OPTIONS, evitamos confusiones
      headers: outgoingHeaders,
      body: hasBody ? event.body : undefined,
    });
    console.log('📥 Respuesta de PrestaShop:', resp.status, resp.statusText);

    const buf = await resp.arrayBuffer();
    // Copiamos tipo de contenido del backend (JSON o XML)
    const contentType = resp.headers.get("content-type") || "application/octet-stream";

    // Como el front llama a MISMO ORIGEN (/api/prestashop/...), CORS ya no es problema.
    // Pero añadimos por si quieres usar desde otro dominio:
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
    };

    return {
      statusCode: resp.status,
      headers: {
        ...cors,
        "Content-Type": contentType,
      },
      isBase64Encoded: true,
      body: Buffer.from(buf).toString("base64"),
    };
  } catch (e) {
    console.error('❌ Error en Netlify Function:', e);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ 
        error: true, 
        message: e.message,
        stack: e.stack 
      }),
    };
  }
};

