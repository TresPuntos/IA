// supabase/functions/openai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  language?: string;
  tone?: string;
}

interface Product {
  name: string;
  price: number;
  description?: string;
  category?: string;
  sku?: string;
  image_url?: string;
  external_id?: string;
  stock_quantity?: number;
}

interface DocumentationFile {
  name: string;
  content: string;
  file_type: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { message, systemPrompt, model = 'gpt-4o-mini', temperature = 0.7, topP = 0.9, maxTokens = 2048, language = 'es', tone = 'friendly' }: ChatRequest = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get products from Supabase
    const { data: products, error: productsError } = await supabaseClient
      .from('product_catalog')
      .select('name, price, description, category, sku, image_url, external_id, stock_quantity')
      .eq('status', 'active')

    if (productsError) {
      console.error('Error fetching products:', productsError)
    }

    // Log products data for debugging
    console.log('🔍 PRODUCTOS OBTENIDOS DE LA BASE DE DATOS:');
    console.log('📊 Total productos:', products?.length || 0);
    if (products && products.length > 0) {
      console.log('📋 Primeros 3 productos:');
      products.slice(0, 3).forEach((p, i) => {
        console.log(`Producto ${i + 1}:`, {
          name: p.name,
          price: p.price,
          image_url: p.image_url,
          external_id: p.external_id,
          category: p.category
        });
      });
      
      // Buscar específicamente el producto Heavy Wheel Kit
      const heavyWheelKit = products.find(p => p.name.toLowerCase().includes('heavy wheel kit'));
      if (heavyWheelKit) {
        console.log('🎯 HEAVY WHEEL KIT ENCONTRADO:', heavyWheelKit);
      } else {
        console.log('❌ Heavy Wheel Kit NO encontrado en la base de datos');
      }
    }

    // Get documentation from Supabase
    const { data: docs, error: docsError } = await supabaseClient
      .from('documentation_files')
      .select('name, content, file_type')
      .eq('status', 'ready')

    if (docsError) {
      console.error('Error fetching documentation:', docsError)
    }

    // Build catalog info for prompt with smart product selection
    const maxProducts = 50;
    let selectedProducts = products ? products.slice(0, maxProducts) : [];
    
    // If user asks for a specific product, try to find it
    const messageLower = message.toLowerCase();
    const specificProduct = products?.find(p => 
      p.name.toLowerCase().includes(messageLower) || 
      messageLower.includes(p.name.toLowerCase())
    );
    
    // If specific product found, include it in the list
    if (specificProduct && !selectedProducts.find(p => p.name === specificProduct.name)) {
      selectedProducts = [specificProduct, ...selectedProducts.slice(0, maxProducts - 1)];
    }
    
    const catalogInfo = products && products.length > 0 
      ? `🏪 CATÁLOGO DE PRODUCTOS (${products.length} productos total, mostrando ${selectedProducts.length} productos relevantes):
${selectedProducts.map((p: Product) => {
  let productInfo = `📦 ${p.name}`;
  productInfo += `\n   💰 Precio: ${p.price}€`;
  productInfo += `\n   📝 Descripción: ${p.description || 'Sin descripción'}`;
  productInfo += `\n   🏷️ Categoría: ${p.category || 'Sin categoría'}`;
  productInfo += `\n   🔢 SKU: ${p.sku || 'N/A'}`;
  
  if (p.image_url) {
    productInfo += `\n   🖼️ Imagen: ${p.image_url}`;
  }
  
  if (p.external_id) {
    productInfo += `\n   🔗 URL Producto: ${p.external_id}`;
  }
  
  if (p.stock_quantity !== undefined) {
    productInfo += `\n   📊 Stock: ${p.stock_quantity}`;
  }
  
  return productInfo;
}).join('\n\n')}

📂 CATEGORÍAS DISPONIBLES:
${[...new Set(products.map((p: Product) => p.category).filter(Boolean))].join(', ')}

⚠️ REGLA CRÍTICA: Si el usuario pregunta por un producto específico y no aparece en la lista de arriba, busca en TODOS los ${products.length} productos disponibles usando palabras clave del nombre del producto. SIEMPRE prioriza la información del catálogo sobre cualquier otra fuente.`
      : 'No hay productos disponibles en el catálogo.'

    // Build documentation info for prompt (limit content to avoid token limit)
    const documentationInfo = docs && docs.length > 0
      ? `DOCUMENTACIÓN ADICIONAL DISPONIBLE (${docs.length} archivos):
${docs.map((doc: DocumentationFile) => 
  `- ${doc.name} (${doc.file_type.toUpperCase()}): ${doc.content.substring(0, 200)}...`
).join('\n')}`
      : 'No hay documentación adicional disponible.'

    // Add web search capability note
    const webSearchInfo = `INFORMACIÓN WEB DISPONIBLE:
- Puedes acceder a información actualizada de la web para complementar las respuestas
- Usa esta información para datos actuales, precios de mercado, especificaciones técnicas, etc.
- Combina la información del catálogo con datos web para dar respuestas más completas`

    // Build enhanced system prompt - PROMPT PRINCIPAL ÚNICO
    const enhancedSystemPrompt = `${systemPrompt || 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.'}

${catalogInfo}

${documentationInfo}

${webSearchInfo}

INSTRUCCIONES CRÍTICAS DEL PROMPT PRINCIPAL:
1. REGLA DE PRIORIDAD ABSOLUTA: Si encuentras un producto en el catálogo, SIEMPRE muestra PRIMERO la información del catálogo
2. ANTES DE RESPONDER, revisa cuidadosamente TODA la información disponible:
   - ✅ CATÁLOGO: Revisa todos los productos disponibles (PRIORIDAD MÁXIMA)
   - ✅ DOCUMENTACIÓN: Consulta los archivos de documentación
   - ✅ WEB: Usa información web SOLO para complementar, NUNCA para reemplazar datos del catálogo
3. Si el usuario pregunta por un producto específico:
   - Busca en la lista de productos mostrada arriba
   - Si lo encuentras en el catálogo, muestra SIEMPRE primero esa información
   - Si no lo encuentras, usa palabras clave para buscar productos similares
   - Si hay ${products.length} productos en total, es posible que el producto esté disponible pero no aparezca en los primeros 50
4. Para búsquedas de productos:
   - Usa palabras clave del nombre del producto
   - Busca variaciones del nombre (ej: "noodle" para "Noodle Boxes")
   - Revisa categorías relacionadas
5. CONTROL TOTAL DESDE EL PROMPT: 
   - NO generes tarjetas de producto automáticamente
   - Solo crea tarjetas visuales si el usuario lo solicita EXPLÍCITAMENTE en su mensaje
   - El usuario tiene control total sobre el formato de la respuesta
   - Si el usuario dice "muestra una tarjeta" o "crea una tarjeta visual", entonces sí genera la tarjeta HTML
6. Si el usuario solicita una tarjeta visual del producto:
   - Usa la información del catálogo (imagen, URL, precio, descripción)
   - Crea formato HTML para mostrar la tarjeta correctamente
7. Después de cualquier tarjeta solicitada, proporciona información adicional:
   - Categoría del catálogo
   - SKU del catálogo
   - Stock del catálogo (si disponible)
   - SOLO DESPUÉS puedes añadir información web como complemento
7. Si no encuentras información específica, di exactamente qué has buscado y qué información tienes disponible
8. AL FINAL DE CADA RESPUESTA, el sistema añadirá automáticamente un disclaimer específico indicando las fuentes exactas de tu respuesta
9. Mantén el tono: ${tone}
10. Responde en ${language === 'es' ? 'español' : language === 'en' ? 'inglés' : language}

IMPORTANTE: Este es el PROMPT PRINCIPAL ÚNICO. Todas las instrucciones están aquí. No hay otros prompts adicionales.`

    // Log para verificar que el prompt se lee correctamente
    console.log('🔍 PROMPT PRINCIPAL ÚNICO ENVIADO A OPENAI:');
    console.log('📝 Longitud del prompt:', enhancedSystemPrompt.length, 'caracteres');
    console.log('📋 PROMPT PRINCIPAL DEL USUARIO (primeros 300 caracteres):', systemPrompt?.substring(0, 300) || 'NO HAY PROMPT PRINCIPAL');
    console.log('📋 INSTRUCCIONES CRÍTICAS AÑADIDAS:', enhancedSystemPrompt.substring(systemPrompt?.length || 0, (systemPrompt?.length || 0) + 200));
    console.log('📋 Últimos 200 caracteres:', enhancedSystemPrompt.substring(enhancedSystemPrompt.length - 200));
    console.log('✅ PROMPT PRINCIPAL ÚNICO COMPLETO ENVIADO A OPENAI - OPENAI LEERÁ ESTE PROMPT ANTES DE CONTESTAR');

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: enhancedSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: temperature,
        top_p: topP,
        max_tokens: maxTokens,
        stream: false
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${errorData.error?.message || openaiResponse.statusText}`,
          code: errorData.error?.code
        }),
        { 
          status: openaiResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openaiData = await openaiResponse.json()
    
    // Apply tone to response and analyze sources
    const tonePrefix = getTonePrefix(tone)
    let responseContent = openaiData.choices[0]?.message?.content || 'No se pudo generar respuesta'
    
    // Check if user explicitly requested a product card
    const userRequestedCard = message.toLowerCase().includes('tarjeta') || 
                             message.toLowerCase().includes('muestra') ||
                             message.toLowerCase().includes('crea') ||
                             message.toLowerCase().includes('visual') ||
                             message.toLowerCase().includes('card')
    
    // Only generate product card if user explicitly requested it
    if (userRequestedCard && products && products.length > 0) {
      const mentionedProduct = products.find(p => {
        const productName = p.name.toLowerCase()
        const messageLower = message.toLowerCase()
        return messageLower.includes(productName) || 
               productName.split(' ').some(word => word.length > 3 && messageLower.includes(word))
      })
      
      if (mentionedProduct) {
        const productCard = generateProductCard(mentionedProduct)
        // Insert product card at the beginning of the response
        responseContent = productCard + '\n\n' + responseContent
      }
    }
    
    // Analyze response content to determine sources
    const sources = []
    
    // Check if response mentions specific products from catalog
    if (products && products.some(p => {
      const productName = p.name.toLowerCase()
      const responseLower = responseContent.toLowerCase()
      return responseLower.includes(productName) || 
             productName.split(' ').some(word => word.length > 3 && responseLower.includes(word))
    })) {
      sources.push("Catálogo de productos")
    }
    
    // Check if response mentions documentation content
    if (docs && docs.some(doc => {
      const docName = doc.name.toLowerCase()
      const docContent = doc.content.toLowerCase()
      const responseLower = responseContent.toLowerCase()
      
      return responseLower.includes(docName) || 
             docContent.split(' ').some(word => 
               word.length > 4 && responseLower.includes(word) && 
               !['producto', 'precio', 'categoría', 'descripción'].includes(word)
             )
    })) {
      sources.push("Documentación interna")
    }
    
    // Check if response contains web-like information
    const webIndicators = [
      'http', 'www.', 'precio de mercado', 'actualizado', 'según', 'fuente externa',
      'investigación', 'estudio', 'tendencia', 'análisis', 'comparativa'
    ]
    
    if (webIndicators.some(indicator => responseContent.toLowerCase().includes(indicator))) {
      sources.push("Información web")
    }
    
    // Check if response contains product-specific information (prices, SKUs, etc.)
    if (responseContent.includes('€') || responseContent.includes('SKU') || 
        responseContent.includes('stock') || responseContent.includes('categoría')) {
      if (!sources.includes("Catálogo de productos")) {
        sources.push("Catálogo de productos")
      }
    }
    
    // If no specific sources detected, assume general knowledge
    if (sources.length === 0) {
      sources.push("Conocimiento general")
    }
    
    // Create specific disclaimer based on detected sources
    const disclaimer = `📋 Fuentes de esta respuesta: ${sources.join(', ')}`
    
    // Ensure disclaimer is always included
    if (!responseContent.includes("📋 Fuentes de esta respuesta")) {
      responseContent += `\n\n${disclaimer}`
    }
    
    const finalAnswer = `${tonePrefix} ${responseContent}`

    return new Response(
      JSON.stringify({
        answer: finalAnswer,
        usage: openaiData.usage,
        sources: {
          catalog: products ? products.length : 0,
          documentation: docs ? docs.length : 0,
          web: true
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in OpenAI chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to apply tone prefix
function getTonePrefix(tone: string): string {
  switch (tone) {
    case 'premium':
      return '✨'
    case 'technical':
      return '🔧'
    case 'casual':
      return '😊'
    case 'professional':
      return '📋'
    case 'friendly':
    default:
      return '👋'
  }
}

// Helper function to generate product card HTML
function generateProductCard(product: Product): string {
  // Mejorar la imagen - usar placeholder más atractivo
  const imageHtml = product.image_url 
    ? `<img src="${product.image_url}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">`
    : `<div style="width: 200px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; color: white; font-size: 48px;">📦</div>`
  
  // Mejorar el botón - usar URL del sitio web si no hay external_id
  const buyButtonHtml = product.external_id 
    ? `<a href="${product.external_id}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">🛒 Comprar Producto</a>`
    : `<a href="https://100x100chef.com/" target="_blank" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">🛒 Ver en Tienda</a>`
  
  // Añadir información adicional si está disponible
  const additionalInfo = []
  if (product.category) {
    additionalInfo.push(`<p style="color: #888; font-size: 14px; margin: 5px 0;"><strong>Categoría:</strong> ${product.category}</p>`)
  }
  if (product.sku) {
    additionalInfo.push(`<p style="color: #888; font-size: 14px; margin: 5px 0;"><strong>SKU:</strong> ${product.sku}</p>`)
  }
  if (product.stock_quantity !== undefined) {
    additionalInfo.push(`<p style="color: #888; font-size: 14px; margin: 5px 0;"><strong>Stock:</strong> ${product.stock_quantity}</p>`)
  }
  
  return `
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin: 20px 0; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 400px;">
  <h3 style="margin-top: 0; color: #333;">${product.name}</h3>
  ${imageHtml}
  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0;">${product.price}€</p>
  <p style="color: #666; margin: 10px 0;">${product.description || 'Sin descripción'}</p>
  ${additionalInfo.join('')}
  ${buyButtonHtml}
</div>`
}
