#!/bin/bash
# Test específico para verificar búsqueda de productos

echo "🧪 TEST ESPECÍFICO: BÚSQUEDA DE PRODUCTOS"
echo "========================================="
echo ""

# Test para "Noodle Boxes con asa"
echo "📋 Probando búsqueda de 'Noodle Boxes con asa'..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa",
    "systemPrompt": "Eres un asistente especializado en buscar productos en el catálogo. Siempre revisa toda la información disponible antes de responder.",
    "temperature": 0.3
  }' | jq '.'

echo ""
echo "✅ Test completado"
