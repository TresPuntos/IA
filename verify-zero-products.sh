#!/bin/bash

# Script para verificar que el dashboard muestre 0 productos después del borrado
echo "🧪 Verificando que el dashboard muestre 0 productos..."

# Verificar que la base de datos está vacía
echo "📊 Verificando base de datos..."
DB_COUNT=$(curl -s -X GET "https://akwobmrcwqbbrdvzyiul.supabase.co/rest/v1/product_catalog?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d':' -f2)

echo "✅ Productos en base de datos: $DB_COUNT"

# Verificar que el chat responde correctamente
echo "🤖 Verificando respuesta del chat..."
CHAT_RESPONSE=$(curl -s -X POST "https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd29ibXJjd3FiYnJkdnp5aXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk0MjUsImV4cCI6MjA3NjE1NTQyNX0.jShGYQkTaO7C0fEjsrsIbVUd0rTOmZvYHffhXJIW7SE" \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuántos productos tienes?"}')

CATALOG_COUNT=$(echo "$CHAT_RESPONSE" | grep -o '"catalog":[0-9]*' | cut -d':' -f2)
echo "✅ Productos en chat: $CATALOG_COUNT"

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA:"
echo "✅ Base de datos: $DB_COUNT productos"
echo "✅ Chat: $CATALOG_COUNT productos"
echo "✅ Dashboard: Ahora debería mostrar 0 productos CSV"
echo "✅ Conexiones: Todas deberían mostrar 0 productos"

if [ "$DB_COUNT" -eq 0 ] && [ "$CATALOG_COUNT" -eq 0 ]; then
  echo ""
  echo "🎯 ¡PERFECTO! Todo está funcionando correctamente:"
  echo "- No hay productos en la base de datos"
  echo "- El chat responde que no hay productos disponibles"
  echo "- El dashboard debería mostrar 0 productos CSV"
  echo "- Las conexiones de ecommerce deberían mostrar 0 productos"
else
  echo ""
  echo "⚠️  Hay inconsistencias que necesitan revisión"
fi


