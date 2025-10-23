#!/bin/bash
# Test completo para verificar fuentes de información y disclaimer

echo "🧪 TEST COMPLETO: FUENTES DE INFORMACIÓN Y DISCLAIMER"
echo "=================================================="
echo ""

# Test para verificar que consulta todas las fuentes
echo "📋 Probando consulta completa de fuentes..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca información sobre Noodle Boxes con asa y dime qué fuentes consultaste",
    "systemPrompt": "Eres un asistente especializado en buscar productos. Siempre revisa el catálogo, documentación y web antes de responder.",
    "temperature": 0.3
  }' | jq '.'

echo ""
echo "✅ Test completado"
