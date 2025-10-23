#!/bin/bash
# Test para verificar disclaimer específico de fuentes

echo "🧪 TEST: DISCLAIMER ESPECÍFICO DE FUENTES"
echo "========================================"
echo ""

# Test 1: Pregunta sobre producto específico (debería mostrar "Catálogo de productos")
echo "📋 Test 1: Pregunta sobre producto específico..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Busca Noodle Boxes con asa",
    "systemPrompt": "Eres un asistente especializado en buscar productos.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo ""

# Test 2: Pregunta general (debería mostrar "Conocimiento general")
echo "📋 Test 2: Pregunta general..."
echo ""

curl -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NzQ4MzQsImV4cCI6MjA1MDE1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué es la gastronomía molecular?",
    "systemPrompt": "Eres un asistente especializado en gastronomía.",
    "temperature": 0.3
  }' | jq '.answer'

echo ""
echo "✅ Tests completados"
