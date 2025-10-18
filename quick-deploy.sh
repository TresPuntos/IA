#!/bin/bash
# Script para configurar token y desplegar

echo "🔑 CONFIGURAR TOKEN Y DESPLEGAR"
echo "====================================="
echo ""

# Solicitar token
echo "Pega tu token de Supabase aquí:"
read -p "Token: " SUPABASE_TOKEN

if [ -z "$SUPABASE_TOKEN" ]; then
    echo "❌ Token vacío. Saliendo..."
    exit 1
fi

# Configurar token
export SUPABASE_ACCESS_TOKEN="$SUPABASE_TOKEN"
echo "✅ Token configurado"
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
