#!/bin/bash
# Test para verificar prioridad del catálogo sobre web

echo "🧪 TEST: PRIORIDAD DEL CATÁLOGO SOBRE WEB"
echo "========================================="
echo ""

# Test para verificar que muestra primero la información del catálogo
echo "📋 Probando que la información del catálogo tiene prioridad..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa y muestra primero la información del catálogo con imagen y URL",
    "systemPrompt": "Eres un asistente especializado en buscar productos. SIEMPRE muestra primero la información del catálogo cuando encuentres un producto.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Test completado"
