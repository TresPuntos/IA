#!/bin/bash

# Script para borrar todos los productos del catálogo
# Uso: ./clear-catalog.sh

echo "🗑️  Borrando todos los productos del catálogo..."

# Credenciales de Supabase
SUPABASE_URL="https://akwobmrcwqbbrdvzyiul.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE"

# Verificar cuántos productos hay antes de borrar
echo "📊 Verificando productos existentes..."
COUNT_BEFORE=$(curl -s -X GET "$SUPABASE_URL/rest/v1/product_catalog?select=count" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "📋 Productos encontrados: $COUNT_BEFORE"

if [ "$COUNT_BEFORE" -eq 0 ]; then
  echo "✅ No hay productos para borrar. El catálogo ya está vacío."
  exit 0
fi

# Borrar todos los productos activos
echo "🗑️  Borrando $COUNT_BEFORE productos..."
RESULT=$(curl -s -X DELETE "$SUPABASE_URL/rest/v1/product_catalog?status=eq.active" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY")

# Verificar el resultado
if [ -z "$RESULT" ]; then
  echo "✅ Productos borrados exitosamente"
else
  echo "❌ Error al borrar productos: $RESULT"
  exit 1
fi

# Verificar que se hayan borrado
echo "🔍 Verificando resultado..."
COUNT_AFTER=$(curl -s -X GET "$SUPABASE_URL/rest/v1/product_catalog?select=count" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "📊 Productos restantes: $COUNT_AFTER"

if [ "$COUNT_AFTER" -eq 0 ]; then
  echo "🎉 ¡Éxito! Todos los productos han sido borrados del catálogo."
  echo "💡 El chat ahora mostrará 'No hay productos disponibles en el catálogo.'"
else
  echo "⚠️  Aún quedan $COUNT_AFTER productos en el catálogo."
fi

echo ""
echo "📝 Nota: Este script borra los productos de la base de datos de Supabase."
echo "🔄 Para restaurar productos, puedes subir un nuevo archivo CSV desde el dashboard."









