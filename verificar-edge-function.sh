#!/bin/bash

echo "🔍 Verificando estado de la Edge Function..."

# Test simple para ver si la función responde
echo "📡 Probando respuesta básica de la Edge Function..."
response=$(curl -s -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "systemPrompt": "test"}')

echo "Respuesta completa: $response"

# Verificar si hay error
if echo "$response" | grep -q "error"; then
  echo "❌ Error detectado en la respuesta"
  echo "$response" | jq '.error' 2>/dev/null || echo "Error no parseable"
else
  echo "✅ La función responde correctamente"
fi

echo ""
echo "🔧 Si hay errores, necesitas desplegar la Edge Function actualizada:"
echo "1. Ve al dashboard de Supabase"
echo "2. Functions > openai-chat"
echo "3. Copia el código de supabase/functions/openai-chat/index.ts"
echo "4. Pégalo en el editor de la función"
echo "5. Guarda y despliega"
