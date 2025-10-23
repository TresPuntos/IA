#!/bin/bash
# Test para verificar tarjeta del producto con imagen y botón de compra

echo "🧪 TEST: TARJETA DEL PRODUCTO CON IMAGEN Y BOTÓN DE COMPRA"
echo "========================================================"
echo ""

# Test para verificar que genera la tarjeta del producto
echo "📋 Probando generación de tarjeta del producto..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa y muéstrame la tarjeta del producto",
    "systemPrompt": "Eres un asistente especializado en mostrar productos con tarjetas visuales.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Test completado"
