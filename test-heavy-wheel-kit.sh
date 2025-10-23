#!/bin/bash

echo "🔍 Probando datos específicos del producto Heavy Wheel Kit..."

# Test específico para Heavy Wheel Kit
curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Heavy Wheel Kit para Super-Aladin",
    "systemPrompt": "Muestra todos los campos del producto incluyendo image_url y external_id",
    "temperature": 0.1
  }' | jq '.answer'

echo ""
echo "📋 Si ves 'null' o error, revisa los logs de la Edge Function"
echo "🔧 Para ver los logs:"
echo "1. Ve al dashboard de Supabase"
echo "2. Functions > openai-chat > Logs"
echo "3. Busca los mensajes que empiezan con 🔍"
