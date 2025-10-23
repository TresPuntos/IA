#!/bin/bash

echo "🧪 Probando control total desde el prompt..."

echo ""
echo "📋 TEST 1: Pregunta normal (NO debe mostrar tarjeta automática)"
echo "Pregunta: Heavy Wheel Kit para Super-Aladin"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Heavy Wheel Kit para Super-Aladin",
    "systemPrompt": "Responde solo con información del producto, sin tarjeta visual",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "📋 TEST 2: Pregunta con solicitud explícita de tarjeta (SÍ debe mostrar tarjeta)"
echo "Pregunta: Muestra una tarjeta visual del Heavy Wheel Kit"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Muestra una tarjeta visual del Heavy Wheel Kit para Super-Aladin",
    "systemPrompt": "Crea una tarjeta visual del producto",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
echo "📝 Resultado esperado:"
echo "- Test 1: Solo información de texto, SIN tarjeta HTML"
echo "- Test 2: Información + tarjeta HTML con imagen y botón"
