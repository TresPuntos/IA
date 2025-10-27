#!/bin/bash

# Script para diagnosticar y arreglar completamente el problema de gestión manual
echo "🔍 DIAGNÓSTICO COMPLETO DEL PROBLEMA DE GESTIÓN MANUAL"

# Verificar estado de la base de datos
echo ""
echo "📊 ESTADO DE LA BASE DE DATOS:"
DB_COUNT=$(curl -s -X GET "https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "✅ Productos en base de datos: $DB_COUNT"

# Verificar respuesta del chat
echo ""
echo "🤖 RESPUESTA DEL CHAT:"
CHAT_RESPONSE=$(curl -s -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuántos productos tienes disponibles?"}')

CATALOG_COUNT=$(echo "$CHAT_RESPONSE" | grep -o '"catalog":[0-9]*' | cut -d':' -f2)
echo "✅ Productos en chat: $CATALOG_COUNT"

# Buscar referencias a gestión manual en todas las carpetas
echo ""
echo "🔍 BUSCANDO REFERENCIAS A GESTIÓN MANUAL EN TODAS LAS CARPETAS:"

# Buscar en src/ (principal)
echo "📁 Buscando en src/ (principal)..."
MANUAL_SRC=$(grep -r "gestión manual\|gestion manual\|Gestión Manual\|Gestion Manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | wc -l)
echo "   Referencias encontradas: $MANUAL_SRC"

# Buscar en AI Chat Config Dashboard v2/
echo "📁 Buscando en AI Chat Config Dashboard v2/..."
MANUAL_V2=$(grep -r "gestión manual\|gestion manual\|Gestión Manual\|Gestion Manual" "/Users/jordi/Documents/GitHub/IA/AI Chat Config Dashboard v2/src/" 2>/dev/null | wc -l)
echo "   Referencias encontradas: $MANUAL_V2"

# Buscar en UI Dashboard/
echo "📁 Buscando en UI Dashboard/..."
MANUAL_UI=$(grep -r "gestión manual\|gestion manual\|Gestión Manual\|Gestion Manual" "/Users/jordi/Documents/GitHub/IA/UI Dashboard/src/" 2>/dev/null | wc -l)
echo "   Referencias encontradas: $MANUAL_UI"

# Buscar por números específicos
echo ""
echo "🔍 BUSCANDO NÚMEROS ESPECÍFICOS (1000, 990):"
echo "📁 Buscando en src/ (principal)..."
NUMBERS_SRC=$(grep -r "1000\|990" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | grep -v "1000.*60.*60\|duration-1000" | wc -l)
echo "   Referencias encontradas: $NUMBERS_SRC"

echo "📁 Buscando en AI Chat Config Dashboard v2/..."
NUMBERS_V2=$(grep -r "1000\|990" "/Users/jordi/Documents/GitHub/IA/AI Chat Config Dashboard v2/src/" 2>/dev/null | grep -v "1000.*60.*60\|duration-1000" | wc -l)
echo "   Referencias encontradas: $NUMBERS_V2"

echo "📁 Buscando en UI Dashboard/..."
NUMBERS_UI=$(grep -r "1000\|990" "/Users/jordi/Documents/GitHub/IA/UI Dashboard/src/" 2>/dev/null | grep -v "1000.*60.*60\|duration-1000" | wc -l)
echo "   Referencias encontradas: $NUMBERS_UI"

echo ""
echo "🎯 DIAGNÓSTICO:"
echo "✅ Base de datos: $DB_COUNT productos"
echo "✅ Chat: $CATALOG_COUNT productos"
echo "📋 Referencias a gestión manual:"
echo "   - src/ (principal): $MANUAL_SRC"
echo "   - AI Chat Config Dashboard v2/: $MANUAL_V2"
echo "   - UI Dashboard/: $MANUAL_UI"
echo "📋 Referencias a números específicos:"
echo "   - src/ (principal): $NUMBERS_SRC"
echo "   - AI Chat Config Dashboard v2/: $NUMBERS_V2"
echo "   - UI Dashboard/: $NUMBERS_UI"

echo ""
echo "💡 POSIBLES CAUSAS:"
echo "1. Estás viendo una versión diferente del dashboard"
echo "2. Hay caché del navegador"
echo "3. Hay componentes que no hemos modificado"
echo "4. Hay múltiples versiones ejecutándose"

echo ""
echo "🔧 SOLUCIONES RECOMENDADAS:"
echo "1. Verificar qué URL estás usando para acceder al dashboard"
echo "2. Limpiar caché del navegador (Ctrl+F5)"
echo "3. Verificar que estás usando la versión correcta"
echo "4. Revisar si hay múltiples servidores ejecutándose"


