#!/bin/bash
# Script para desplegar con token existente

echo "🚀 DESPLEGUE CON TOKEN EXISTENTE"
echo "====================================="
echo ""

# Verificar si hay token configurado
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ No hay token configurado"
    echo ""
    echo "📋 CONFIGURA EL TOKEN PRIMERO:"
    echo "====================================="
    echo "1. Ve a: https://supabase.com/dashboard/account/tokens"
    echo "2. Genera un token"
    echo "3. Ejecuta: export SUPABASE_ACCESS_TOKEN=tu_token"
    echo "4. Vuelve a ejecutar este script"
    exit 1
fi

echo "✅ Token encontrado"
echo ""

# Verificar login
echo "🔍 Verificando login..."
if supabase projects list &> /dev/null; then
    echo "✅ Login exitoso"
else
    echo "❌ Login fallido. Verifica el token"
    exit 1
fi

echo ""

# Link al proyecto
echo "🔗 Vinculando al proyecto..."
if supabase link --project-ref akwobmrcwqbbrdvzyiul; then
    echo "✅ Proyecto vinculado"
else
    echo "❌ Error al vincular proyecto"
    exit 1
fi

echo ""

# Desplegar función
echo "🚀 Desplegando Edge Function..."
if supabase functions deploy openai-chat; then
    echo "✅ Edge Function desplegada"
else
    echo "❌ Error al desplegar"
    exit 1
fi

echo ""
echo "🎉 DESPLIEGUE COMPLETADO"
echo "====================================="
echo ""
echo "📋 PRÓXIMO PASO: CONFIGURAR API KEY"
echo "====================================="
echo "1. Ir a: https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/settings/functions"
echo "2. Sección: Environment Variables"
echo "3. Añadir:"
echo "   - Name: OPENAI_API_KEY"
echo "   - Value: sk-tu-api-key-real-de-openai"
echo ""
echo "🧪 PROBAR CHAT:"
echo "====================================="
echo "1. Ir a: https://stalwart-panda-77e3cb.netlify.app/"
echo "2. Hacer clic en 'Probar Chat'"
echo "3. Verificar respuesta de OpenAI"
