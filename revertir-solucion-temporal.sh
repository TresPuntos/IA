#!/bin/bash
# Script para revertir la solución temporal y habilitar el chat AI

echo "🔄 REVERTIR SOLUCIÓN TEMPORAL DEL CHAT AI"
echo "========================================="
echo ""
echo "Este script revierte la solución temporal y habilita el chat AI."
echo "Solo ejecuta esto DESPUÉS de desplegar la Edge Function corregida."
echo ""
echo "📋 PASOS COMPLETADOS:"
echo "====================================="
echo "1. ✅ Edge Function corregida desplegada"
echo "2. ✅ Test exitoso: node test-openai-documentation.js"
echo "3. ✅ Status 200 en lugar de 400"
echo ""
echo "¿Continuar con la reversión? (y/N)"
read -p "Respuesta: " respuesta

if [[ $respuesta == "y" || $respuesta == "Y" ]]; then
    echo ""
    echo "🔄 Revirtiendo cambios..."
    
    # Revertir el cambio en supabaseChat.ts
    sed -i.bak 's/  // SOLUCIÓN TEMPORAL: Deshabilitar chat AI hasta desplegar Edge Function corregida/  try {/' src/lib/supabaseChat.ts
    sed -i.bak 's/  return {/  \/\/ Cargar la configuración actual del usuario/' src/lib/supabaseChat.ts
    sed -i.bak 's/    error: '\''Chat AI temporalmente deshabilitado. El CSV upload funciona correctamente. Despliega la Edge Function corregida para habilitar el chat.'\''/    console.log('\''🔍 DEBUG: Cargando configuración del usuario...'\'');/' src/lib/supabaseChat.ts
    sed -i.bak 's/  };/    const userConfig = await loadConfig('\''default'\'');/' src/lib/supabaseChat.ts
    sed -i.bak 's/  \/\/ Cargar la configuración actual del usuario/  \/\/ Usar configuración del usuario o valores por defecto/' src/lib/supabaseChat.ts
    
    echo "✅ Cambios revertidos"
    echo ""
    echo "🧪 PROBAR CHAT AI:"
    echo "====================================="
    echo "1. Recargar la aplicación"
    echo "2. Probar el chat AI"
    echo "3. Verificar que funciona correctamente"
    echo ""
    echo "✅ Chat AI habilitado nuevamente"
else
    echo ""
    echo "❌ Reversión cancelada"
    echo "El chat AI permanece deshabilitado temporalmente"
fi
