#!/bin/bash
# Test para verificar que el prompt principal se lee correctamente

echo "🧪 TEST: VERIFICACIÓN DEL PROMPT PRINCIPAL"
echo "=========================================="
echo ""

# Test para verificar que el prompt se lee correctamente
echo "📋 Probando que el prompt principal se lee correctamente..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa y confirma que has leído el prompt principal",
    "systemPrompt": "PROMPT PRINCIPAL ÚNICO: Eres un asistente especializado en productos de cocina. SIEMPRE muestra primero la información del catálogo cuando encuentres un producto. Crea tarjetas visuales con imagen y botón de compra.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Test completado"
