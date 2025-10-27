#!/bin/bash

echo "🧪 Probando búsqueda específica de Campana Jarra..."

echo ""
echo "📋 TEST: Solicitud específica de tarjeta para Campana Jarra"
echo "Pregunta: Muestra una tarjeta simple de la Campana Jarra"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Muestra una tarjeta simple de la Campana Jarra",
    "systemPrompt": "Crea una tarjeta simple y elegante del producto específico mencionado",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "📋 TEST ALTERNATIVO: Solo mencionar el producto"
echo "Pregunta: Campana Jarra tarjeta"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Campana Jarra tarjeta",
    "systemPrompt": "Crea una tarjeta simple y elegante del producto específico mencionado",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo "📝 Resultado esperado:"
echo "- Debe mostrar tarjeta de CAMPANA JARRA (no Heavy Wheel Kit)"
echo "- Precio: 43.15€"
echo "- Imagen: campana-jarra.jpg"
echo "- URL: campana-jarra.html"
echo ""
echo "🚀 Si ves 'null', necesitas desplegar la Edge Function actualizada"


