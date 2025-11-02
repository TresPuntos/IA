# 🚀 DESPLEGAR EDGE FUNCTION PRESTASHOP-PROXY

## ✅ PASO 1: Ir al Dashboard de Supabase

**URL:** https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/functions

## ✅ PASO 2: Crear Nueva Función

1. Haz clic en **"New Function"** o **"Create Function"**
2. **Nombre de la función:** `prestashop-proxy`
3. Haz clic en **"Create"**

## ✅ PASO 3: Copiar y Pegar el Código

Copia **TODO** el código de abajo y pégalo en el editor de la función:

---

```typescript
// Supabase Edge Function: Proxy para PrestaShop API
// Esto reemplaza el proxy de Netlify para evitar errores 502

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Prestashop proxy function called')
    
    // Parse body
    let body: { apiUrl?: string; apiKey?: string } = {}
    try {
      body = await req.json()
    } catch (e) {
      console.error('Error parsing body:', e)
      body = {}
    }

    const { apiUrl, apiKey } = body

    console.log('📥 Received:', {
      apiUrl,
      apiKey: apiKey ? 'PRESENT' : 'MISSING',
      path: new URL(req.url).pathname
    })

    if (!apiUrl || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing apiUrl or apiKey' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Construir URL completa para PrestaShop
    let baseUrl = apiUrl.replace(/\/$/, '')
    if (!baseUrl.endsWith('/api')) {
      baseUrl = `${baseUrl}/api`
    }

    // Extraer el recurso del path
    // Puede venir como: /prestashop-proxy/products o /prestashop-proxy/products/123/combinations
    const urlPath = new URL(req.url).pathname
    const pathMatch = urlPath.match(/\/prestashop-proxy\/(.+)/)
    const resourcePath = pathMatch ? pathMatch[1] : 'products'
    console.log('📦 Resource Path:', resourcePath)

    // Obtener parámetros de query
    const urlObj = new URL(req.url)
    const queryParams: string[] = []
    
    // Agregar parámetros estándar
    const display = urlObj.searchParams.get('display') || 'full'
    queryParams.push(`display=${display}`)
    
    if (urlObj.searchParams.get('limit')) {
      queryParams.push(`limit=${urlObj.searchParams.get('limit')}`)
    }
    
    if (urlObj.searchParams.get('language')) {
      queryParams.push(`language=${urlObj.searchParams.get('language')}`)
    }

    const queryString = queryParams.join('&')

    // Construir URL final con ws_key y output_format
    let targetUrl = `${baseUrl}/${resourcePath}${queryString ? '?' + queryString : ''}`
    
    if (!targetUrl.includes('ws_key=')) {
      targetUrl += `${targetUrl.includes('?') ? '&' : '?'}ws_key=${apiKey}`
    }
    if (!targetUrl.includes('output_format=')) {
      targetUrl += `${targetUrl.includes('?') ? '&' : '?'}output_format=JSON`
    }

    console.log('🌐 Target URL:', targetUrl.replace(apiKey, '***'))

    // Preparar headers para autenticación básica
    const basicAuth = btoa(`${apiKey}:`)

    // Realizar petición a PrestaShop
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        'Io-Format': 'JSON',
        'User-Agent': 'PrestaShop Client'
      },
      // Timeout de 25 segundos (Supabase tiene límite de tiempo)
      signal: AbortSignal.timeout(25000)
    })

    console.log('📥 Response status:', response.status)

    let responseBody: any
    const contentType = response.headers.get('content-type') || 'application/json'

    // Leer respuesta
    const data = await response.text()

    // Si hay error, incluir más detalles
    if (response.status >= 400) {
      console.error('❌ Error response from PrestaShop:', response.status)
      console.error('❌ Response data:', data.substring(0, 500))
    }

    // Intentar parsear como JSON
    try {
      if (contentType.includes('xml')) {
        responseBody = { xml: data, error: 'PrestaShop returned XML instead of JSON' }
      } else {
        responseBody = JSON.parse(data)
      }
    } catch (e) {
      console.error('❌ Error parsing response:', e)
      responseBody = {
        error: 'Invalid response format',
        raw: data.substring(0, 500),
        parseError: e instanceof Error ? e.message : 'Unknown error'
      }
    }

    return new Response(
      JSON.stringify(responseBody),
      {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    
    let errorMessage = 'Unknown error'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      if (error.message.includes('timeout') || error.name === 'TimeoutError') {
        statusCode = 504
        errorMessage = 'Request timeout - La petición a PrestaShop excedió el tiempo máximo de espera'
      } else if (error.message.includes('Failed to fetch')) {
        statusCode = 502
        errorMessage = 'No se pudo conectar con el servidor de PrestaShop'
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
```

---

## ✅ PASO 4: Desplegar

1. Haz clic en **"Deploy"** o **"Save & Deploy"**
2. Espera a que termine el despliegue
3. Verifica que aparezca "Deployed" o "Active"

## ✅ PASO 5: Probar

1. Ve a tu aplicación: http://localhost:3000/catalog
2. Ingresa:
   - URL: `https://100x100chef.com/shop`
   - API Key: `E5CUG6DLAD9EA46AIN7Z2LIX1W3IIJKZ`
3. Haz clic en **"Probar Conexión"**
4. Debería funcionar sin errores de CORS

## 🔍 VERIFICACIÓN

Si la función está desplegada correctamente, deberías ver:
- ✅ El botón muestra "Probando..." cuando haces clic
- ✅ Después de unos segundos muestra "✅ Conectado"
- ✅ No hay errores de CORS en la consola
- ✅ No hay errores 404 o 502

## ❌ SI SIGUE FALLANDO

Revisa los logs de la Edge Function en Supabase Dashboard:
1. Ve a Functions > prestashop-proxy > Logs
2. Verifica qué errores aparecen
3. Comparte los logs si necesitas ayuda

