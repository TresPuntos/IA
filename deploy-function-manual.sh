#!/bin/bash

# Script para desplegar la función de chat usando la API de Supabase
echo "🚀 DESPLEGANDO FUNCIÓN DE CHAT USANDO API DE SUPABASE"

# Configuración
PROJECT_ID="akwobmrcwqbbrdvzyiul"
FUNCTION_NAME="openai-chat"
FUNCTION_FILE="supabase/functions/openai-chat/index.ts"

# Verificar que el archivo existe
if [ ! -f "$FUNCTION_FILE" ]; then
  echo "❌ Error: No se encuentra el archivo $FUNCTION_FILE"
  exit 1
fi

echo "✅ Archivo de función encontrado: $FUNCTION_FILE"

# Mostrar el contenido del archivo para verificar los cambios
echo ""
echo "🔍 VERIFICANDO CAMBIOS EN LA FUNCIÓN:"
if grep -q "limit(10000)" "$FUNCTION_FILE"; then
  echo "✅ Límite de 10000 productos encontrado"
else
  echo "❌ Límite de 10000 productos NO encontrado"
fi

echo ""
echo "📋 INSTRUCCIONES PARA DESPLEGAR MANUALMENTE:"
echo "1. Ve a: https://supabase.com/dashboard/project/$PROJECT_ID/functions"
echo "2. Busca la función '$FUNCTION_NAME'"
echo "3. Haz clic en 'Edit' o 'Update'"
echo "4. Copia y pega el contenido del archivo: $FUNCTION_FILE"
echo "5. Haz clic en 'Deploy' o 'Save'"

echo ""
echo "📄 CONTENIDO DEL ARCHIVO (primeras 10 líneas):"
head -10 "$FUNCTION_FILE"

echo ""
echo "📄 CONTENIDO DEL ARCHIVO (líneas 77-85 - consulta de productos):"
sed -n '77,85p' "$FUNCTION_FILE"

echo ""
echo "🎯 CAMBIOS CLAVE QUE DEBES VERIFICAR:"
echo "✅ Línea 81: .limit(10000) // Asegurar que obtenemos todos los productos"
echo "✅ La función debe obtener todos los 1511 productos"
echo "✅ El chat debe reportar 'catalog': 1511 en lugar de 1000"

echo ""
echo "💡 DESPUÉS DEL DESPLIEGUE:"
echo "1. Prueba el chat con: '¿Cuántos productos tienes?'"
echo "2. Debe responder con 1511 productos"
echo "3. El dashboard debe mostrar números consistentes"









