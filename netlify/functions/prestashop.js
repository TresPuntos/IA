// Proxy sólido para PrestaShop Webservice
export const handler = async (event, context) => {
  try {
    console.log('🔍 Prestashop function called:', event.path, event.httpMethod);
    
    // Si es POST, el frontend envía las credenciales en el body
    let base, apiKey;
    
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      base = body.apiUrl?.replace(/\/+$/, '');
      apiKey = body.apiKey;
      console.log('📥 Credenciales recibidas del frontend:', { base: !!base, apiKey: !!apiKey });
    } else {
      // Si es GET, usar credenciales de entorno (para pruebas)
      base = process.env.PRESTASHOP_BASE_URL?.replace(/\/+$/, '');
      apiKey = process.env.PRESTASHOP_API_KEY;
      console.log('📥 Usando credenciales de entorno:', { base: !!base, apiKey: !!apiKey });
    }
    
    if (!base || !apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: true, message: 'Missing credentials' })
      };
    }
    
    const path = event.path.replace(/^\/?api\/prestashop\/?/, "") || event.path;     // lo que venga tras /api/prestashop/
    const url = new URL(`${base}/${path}`);

    // Pasa querystring del cliente
    const qp = new URLSearchParams(event.queryStringParameters || {});
    // Si tu tienda usa ws_key por query en vez de Basic Auth, descomenta:
    // qp.set("ws_key", process.env.PRESTASHOP_API_KEY);
    url.search = qp.toString();

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
    const resp = await fetch(url.toString(), {
      method: event.httpMethod === "OPTIONS" ? "GET" : event.httpMethod, // Netlify maneja OPTIONS, evitamos confusiones
      headers: outgoingHeaders,
      body: hasBody ? event.body : undefined,
    });

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
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: true, message: e.message }),
    };
  }
};

