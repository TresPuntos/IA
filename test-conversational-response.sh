#!/bin/bash

echo "🧪 Probando respuesta conversacional mejorada..."

echo ""
echo "📋 TEST: Disco Luz Led RGB (respuesta conversacional)"
echo "Pregunta: Disco Luz Led RGB"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Disco Luz Led RGB",
    "systemPrompt": "Da una respuesta conversacional sobre el producto, sin repetir información de la tarjeta",
    "temperature": 0.7
  }' | jq '.answer'

echo ""
echo "📋 TEST: Campana Jarra (respuesta conversacional)"
echo "Pregunta: Campana Jarra"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Campana Jarra",
    "systemPrompt": "Da una respuesta conversacional sobre el producto, sin repetir información de la tarjeta",
    "temperature": 0.7
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo "📝 Resultado esperado:"
echo "- Tarjeta visual con imagen, precio y botón"
echo "- Respuesta conversacional SIN repetir:"
echo "  ❌ Precio"
echo "  ❌ Descripción técnica"
echo "  ❌ SKU o categoría"
echo "  ❌ Imagen o enlaces"
echo "- Respuesta conversacional CON:"
echo "  ✅ Beneficios del producto"
echo "  ✅ Casos de uso prácticos"
echo "  ✅ Sugerencias de productos relacionados"
echo "  ✅ Preguntas útiles para el cliente"
echo ""
echo "🚀 Si ves 'null', necesitas desplegar la Edge Function actualizada"










