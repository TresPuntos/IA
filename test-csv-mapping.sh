#!/bin/bash

echo "🔍 Probando mapeo de CSV con product_url..."

# Test con producto específico que tiene URL
curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Heavy Wheel Kit para Super-Aladin y muestra todos los datos incluyendo URL del producto",
    "systemPrompt": "Muestra todos los campos del producto incluyendo external_id y image_url",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Test completado"
