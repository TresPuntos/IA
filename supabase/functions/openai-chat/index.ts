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
    const { message, systemPrompt, temperature = 0.7, topP = 0.9, maxTokens = 2048, language = 'es', tone = 'friendly' }: ChatRequest = await req.json()

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
      .select('name, price, description, category, sku')
      .eq('status', 'active')

    if (productsError) {
      console.error('Error fetching products:', productsError)
    }

    // Get documentation from Supabase
    const { data: docs, error: docsError } = await supabaseClient
      .from('documentation_files')
      .select('name, content, file_type')
      .eq('status', 'ready')

    if (docsError) {
      console.error('Error fetching documentation:', docsError)
    }

    // Build catalog info for prompt
    const catalogInfo = products && products.length > 0 
      ? `PRODUCTOS DISPONIBLES (${products.length} productos):
${products.map((p: Product) => 
  `- ${p.name}: ${p.price}€ | ${p.description || 'Sin descripción'} | Categoría: ${p.category || 'Sin categoría'} | SKU: ${p.sku || 'N/A'}`
).join('\n')}

CATEGORÍAS DISPONIBLES:
${[...new Set(products.map((p: Product) => p.category).filter(Boolean))].join(', ')}`
      : 'No hay productos disponibles en el catálogo.'

    // Build documentation info for prompt
    const documentationInfo = docs && docs.length > 0
      ? `DOCUMENTACIÓN ADICIONAL DISPONIBLE (${docs.length} archivos):
${docs.map((doc: DocumentationFile) => 
  `- ${doc.name} (${doc.file_type.toUpperCase()}): ${doc.content.substring(0, 200)}...`
).join('\n')}`
      : 'No hay documentación adicional disponible.'

    // Build enhanced system prompt
    const enhancedSystemPrompt = `${systemPrompt || 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.'}

${catalogInfo}

${documentationInfo}

INSTRUCCIONES:
- Usa SOLO la información del catálogo y documentación proporcionada arriba
- Si no tienes información específica sobre algo, di que no tienes esa información disponible
- Sé específico con nombres de productos, precios y descripciones
- Mantén el tono: ${tone}
- Responde en ${language === 'es' ? 'español' : language === 'en' ? 'inglés' : language}`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
    
    // Apply tone to response
    const tonePrefix = getTonePrefix(tone)
    const finalAnswer = `${tonePrefix} ${openaiData.choices[0]?.message?.content || 'No se pudo generar respuesta'}`

    return new Response(
      JSON.stringify({
        answer: finalAnswer,
        usage: openaiData.usage
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
