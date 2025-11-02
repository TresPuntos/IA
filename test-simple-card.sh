#!/bin/bash

echo "🧪 Probando nueva tarjeta simple y elegante..."

echo ""
echo "📋 TEST 1: Pregunta normal (NO debe mostrar tarjeta)"
echo "Pregunta: Campana Jarra"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Campana Jarra",
    "systemPrompt": "Responde solo con información del producto, sin tarjeta visual",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "📋 TEST 2: Solicitud de tarjeta simple (SÍ debe mostrar tarjeta)"
echo "Pregunta: Muestra una tarjeta simple de la Campana Jarra"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Muestra una tarjeta simple de la Campana Jarra",
    "systemPrompt": "Crea una tarjeta simple y elegante del producto",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo "📝 Resultado esperado:"
echo "- Test 1: Solo información de texto, SIN tarjeta HTML"
echo "- Test 2: Información + tarjeta HTML simple y elegante"
echo ""
echo "🚀 Si ves 'null', necesitas desplegar la Edge Function actualizada"









