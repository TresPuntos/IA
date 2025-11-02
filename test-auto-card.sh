#!/bin/bash

echo "🧪 Probando generación automática de tarjetas..."

echo ""
echo "📋 TEST 1: Disco Luz Led RGB (debe mostrar tarjeta automáticamente)"
echo "Pregunta: Disco Luz Led RGB"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Disco Luz Led RGB",
    "systemPrompt": "Responde con información del producto",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "📋 TEST 2: Campana Jarra (debe mostrar tarjeta automáticamente)"
echo "Pregunta: Campana Jarra"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Campana Jarra",
    "systemPrompt": "Responde con información del producto",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo "📝 Resultado esperado:"
echo "- Test 1: Tarjeta automática de Disco Luz Led RGB (9.5€)"
echo "- Test 2: Tarjeta automática de Campana Jarra (43.15€)"
echo "- Ambas deben mostrar imagen y botón de compra"
echo ""
echo "🚀 Si ves 'null', necesitas desplegar la Edge Function actualizada"









