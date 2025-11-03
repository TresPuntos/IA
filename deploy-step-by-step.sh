#!/bin/bash

# Script para desplegar la función de chat paso a paso
echo "🚀 DESPLIEGUE PASO A PASO DE LA FUNCIÓN DE CHAT"
echo "==============================================="

echo ""
echo "📋 PASOS PARA DESPLEGAR:"
echo "1. Ve a: https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/functions"
echo "2. Busca la función 'openai-chat'"
echo "3. Haz clic en 'Edit' o 'Update'"
echo "4. Borra todo el contenido existente"
echo "5. Copia y pega el contenido de abajo"
echo "6. Haz clic en 'Deploy' o 'Save'"

echo ""
echo "📄 CONTENIDO PARA COPIAR (líneas 77-81 - LA PARTE CRÍTICA):"
echo "============================================================"
sed -n '77,81p' supabase/functions/openai-chat/index.ts

echo ""
echo "🎯 VERIFICACIÓN DESPUÉS DEL DESPLIEGUE:"
echo "1. Prueba el chat con: '¿Cuántos productos tienes?'"
echo "2. Debe responder con 1511 productos (no 1000)"
echo "3. El dashboard debe mostrar números consistentes"

echo ""
echo "💡 NOTA IMPORTANTE:"
echo "El cambio clave está en la línea 81: .limit(10000)"
echo "Esto asegura que obtengamos todos los 1511 productos de la base de datos."

echo ""
echo "🔧 SI NO FUNCIONA:"
echo "1. Verifica que copiaste todo el contenido"
echo "2. Asegúrate de hacer clic en 'Deploy' después de pegar"
echo "3. Espera unos minutos para que se propague el cambio"
echo "4. Prueba de nuevo el chat"

echo ""
echo "📊 ESTADO ACTUAL:"
echo "✅ Función modificada con límite de 10000 productos"
echo "✅ Lista para desplegar"
echo "⚠️  Necesita despliegue manual en Supabase"










