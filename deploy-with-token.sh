#!/bin/bash
# Script alternativo para desplegar usando token

echo "🔐 DESPLIEGUE CON TOKEN MANUAL"
echo "====================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "supabase/functions/openai-chat/index.ts" ]; then
    echo "❌ Error: No estás en el directorio correcto"
    echo "   Ejecuta este script desde: /Users/jordi/Documents/GitHub/IA"
    exit 1
fi

echo "✅ Directorio correcto detectado"
echo ""

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no encontrado"
    echo "   Ejecuta primero: ./install-supabase.sh"
    exit 1
fi

echo "✅ Supabase CLI encontrado: $(supabase --version)"
echo ""

# Solicitar token
echo "🔑 PASO 1: CONFIGURAR TOKEN"
echo "====================================="
echo "1. Ve a: https://supabase.com/dashboard/account/tokens"
echo "2. Genera un nuevo token"
echo "3. Copia el token"
echo ""
read -p "Pega tu token aquí: " SUPABASE_TOKEN

if [ -z "$SUPABASE_TOKEN" ]; then
    echo "❌ Token vacío. Saliendo..."
    exit 1
fi

# Configurar token
export SUPABASE_ACCESS_TOKEN="$SUPABASE_TOKEN"
echo "✅ Token configurado"
echo ""

# Verificar login
echo "🔍 PASO 2: VERIFICAR LOGIN"
echo "====================================="
if supabase projects list &> /dev/null; then
    echo "✅ Login exitoso"
else
    echo "❌ Login fallido. Verifica el token"
    exit 1
fi

echo ""

# Paso 3: Link al proyecto
echo "🔗 PASO 3: LINK AL PROYECTO"
echo "====================================="
echo "Vinculando al proyecto akwobmrcwqbbrdvzyiul..."

if supabase link --project-ref akwobmrcwqbbrdvzyiul; then
    echo "✅ Proyecto vinculado correctamente"
else
    echo "❌ Error al vincular proyecto"
    echo "   Verifica que el project-ref sea correcto"
    exit 1
fi

echo ""

# Paso 4: Desplegar función
echo "🚀 PASO 4: DESPLEGAR EDGE FUNCTION"
echo "====================================="
echo "Desplegando openai-chat..."

if supabase functions deploy openai-chat; then
    echo "✅ Edge Function desplegada correctamente"
else
    echo "❌ Error al desplegar función"
    echo "   Verifica que tengas permisos en el proyecto"
    exit 1
fi

echo ""

# Paso 5: Verificar despliegue
echo "🧪 PASO 5: VERIFICAR DESPLIEGUE"
echo "====================================="
echo "Listando funciones desplegadas..."

if supabase functions list; then
    echo ""
    echo "✅ Verificación completada"
else
    echo "❌ Error al verificar funciones"
fi

echo ""

# Instrucciones finales
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
echo ""
echo "✅ ¡La Edge Function está desplegada!"
echo "   Solo falta configurar la API key para que funcione completamente."
