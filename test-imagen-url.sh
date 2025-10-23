#!/bin/bash
# Test para verificar que incluye imagen y URL del producto

echo "🧪 TEST: IMAGEN Y URL DEL PRODUCTO"
echo "=================================="
echo ""

# Test para verificar que incluye imagen y URL
echo "📋 Probando que incluye imagen y URL del producto..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa y proporciona TODOS los detalles incluyendo imagen y URL si están disponibles",
    "systemPrompt": "Eres un asistente especializado en buscar productos. Siempre incluye imagen y URL del producto cuando estén disponibles en el catálogo.",
    "temperature": 0.3
  }' | jq '.'

echo ""
echo "✅ Test completado"
