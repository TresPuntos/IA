#!/bin/bash

echo "🧪 Probando que OpenAI lee el PROMPT PRINCIPAL ÚNICO antes de contestar..."

echo ""
echo "📋 TEST: Verificar que el prompt principal se lee"
echo "Pregunta: Heavy Wheel Kit para Super-Aladin"
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Heavy Wheel Kit para Super-Aladin",
    "systemPrompt": "Eres un asistente especializado en herramientas de cocina profesional para 100%Chef. Ayudas a chefs, cocineros y barmen a encontrar el equipo perfecto para sus necesidades culinarias. SIEMPRE proporciona opciones específicas cuando te pregunten por productos. MENCIONA productos reales del catálogo con precios aproximados.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "📋 Para verificar que el prompt se lee correctamente:"
echo "1. Ve al Dashboard de Supabase"
echo "2. Functions > openai-chat > Logs"
echo "3. Busca los mensajes que empiezan con:"
echo "   🔍 PROMPT PRINCIPAL ÚNICO ENVIADO A OPENAI"
echo "   📋 PROMPT PRINCIPAL DEL USUARIO"
echo "   ✅ PROMPT PRINCIPAL ÚNICO COMPLETO ENVIADO A OPENAI"
echo ""
echo "✅ Si ves estos logs, significa que OpenAI está leyendo tu prompt principal antes de contestar"
