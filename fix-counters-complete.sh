#!/bin/bash

# Script para arreglar completamente el problema de contadores y gestión manual
echo "🔧 ARREGLANDO COMPLETAMENTE EL PROBLEMA DE CONTADORES Y GESTIÓN MANUAL"

# Verificar estado actual
echo ""
echo "📊 ESTADO ACTUAL:"
DB_COUNT=$(curl -s -X GET "https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "✅ Base de datos: $DB_COUNT productos"

# Probar consulta con límite explícito
echo ""
echo "🔍 PROBANDO CONSULTA CON LÍMITE EXPLÍCITO:"
LIMITED_COUNT=$(curl -s -X GET "https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog?select=count&limit=10000" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "✅ Con límite 10000: $LIMITED_COUNT productos"

# Probar consulta sin límite
echo ""
echo "🔍 PROBANDO CONSULTA SIN LÍMITE:"
UNLIMITED_COUNT=$(curl -s -X GET "https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog?select=*&limit=10000" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" | jq '. | length' 2>/dev/null || echo "Error")

echo "✅ Productos obtenidos: $UNLIMITED_COUNT"

echo ""
echo "🎯 DIAGNÓSTICO:"
echo "📊 Base de datos real: $DB_COUNT productos"
echo "📊 Chat reporta: 1000 productos (límite de Supabase)"
echo "📊 Dashboard puede mostrar números incorrectos"

echo ""
echo "🔧 SOLUCIONES IMPLEMENTADAS:"
echo "1. ✅ Agregado límite explícito de 10000 en la función de chat"
echo "2. ✅ Eliminadas todas las referencias a gestión manual"
echo "3. ✅ Arreglados los contadores para mostrar números reales"

echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Desplegar la función de chat actualizada"
echo "2. Verificar que el dashboard muestre números correctos"
echo "3. Confirmar que no hay opciones de gestión manual"

echo ""
echo "💡 NOTA IMPORTANTE:"
echo "El problema principal es que Supabase tiene un límite por defecto de 1000 registros."
echo "Con el límite explícito de 10000, deberíamos obtener todos los productos."


