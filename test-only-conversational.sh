#!/bin/bash

echo "🧪 Probando respuesta SOLO conversacional (sin repetir tarjeta)..."

echo ""
echo "📋 TEST: Ahumador de vasos (solo respuesta conversacional)"
echo "Pregunta: Ahumador de vasos"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Ahumador de vasos",
    "systemPrompt": "Da SOLO una respuesta conversacional sobre el producto, sin repetir información de la tarjeta",
    "temperature": 0.7
  }' | jq '.answer'

echo ""
echo "📋 TEST: Disco Luz Led RGB (solo respuesta conversacional)"
echo "Pregunta: Disco Luz Led RGB"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Disco Luz Led RGB",
    "systemPrompt": "Da SOLO una respuesta conversacional sobre el producto, sin repetir información de la tarjeta",
    "temperature": 0.7
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo ""
echo "📝 RESULTADO ESPERADO:"
echo "✅ Tarjeta visual con imagen, precio y botón"
echo "✅ Respuesta SOLO conversacional SIN:"
echo "  ❌ Precio (49€, Precio: 49€)"
echo "  ❌ Descripción técnica (Compatible con vasos...)"
echo "  ❌ SKU o categoría"
echo "  ❌ Imagen (![imagen])"
echo "  ❌ Enlaces ([Ver más])"
echo "  ❌ Listas con guiones (-)"
echo "  ❌ Encabezados (###)"
echo ""
echo "✅ Respuesta SOLO conversacional CON:"
echo "  ✅ Beneficios del producto"
echo "  ✅ Casos de uso prácticos"
echo "  ✅ Sugerencias de productos relacionados"
echo "  ✅ Preguntas útiles para el cliente"
echo "  ✅ Solo texto en párrafos"
echo ""
echo "🚀 Si ves 'null', necesitas desplegar la Edge Function actualizada"



