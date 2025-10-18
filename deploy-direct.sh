#!/bin/bash
# Script para desplegar Edge Function usando archivo de configuración

echo "🚀 DESPLIEGUE DIRECTO DE EDGE FUNCTION"
echo "====================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "supabase/functions/openai-chat/index.ts" ]; then
    echo "❌ Error: No estás en el directorio correcto"
    exit 1
fi

echo "✅ Directorio correcto detectado"
echo ""

# Crear directorio de configuración de Supabase
mkdir -p ~/.supabase

echo "🔑 CONFIGURANDO SUPABASE CLI"
echo "====================================="
echo ""

# Crear archivo de configuración básico
cat > ~/.supabase/config.toml << EOF
[api]
host = "https://api.supabase.com"
port = 443
scheme = "https"

[db]
port = 54322
major_version = 15
EOF

echo "✅ Configuración básica creada"
echo ""

# Intentar hacer login con método alternativo
echo "🔐 INTENTANDO LOGIN ALTERNATIVO"
echo "====================================="
echo ""

# Verificar si podemos acceder a proyectos sin login
if supabase projects list &> /dev/null; then
    echo "✅ Acceso a proyectos disponible"
else
    echo "❌ Necesitas hacer login manualmente"
    echo ""
    echo "📋 INSTRUCCIONES MANUALES:"
    echo "====================================="
    echo "1. Abre una terminal nueva"
    echo "2. Ejecuta: supabase login"
    echo "3. Se abrirá el navegador"
    echo "4. Haz login y autoriza"
    echo "5. Vuelve aquí y ejecuta:"
    echo "   supabase link --project-ref akwobmrcwqbbrdvzyiul"
    echo "   supabase functions deploy openai-chat"
    echo ""
    echo "🔗 O usa el método del token:"
    echo "1. Ve a: https://supabase.com/dashboard/account/tokens"
    echo "2. Genera un token"
    echo "3. Ejecuta: export SUPABASE_ACCESS_TOKEN=tu_token"
    echo "4. Continúa con el despliegue"
    exit 1
fi

# Continuar con el despliegue si el login funciona
echo "🔗 VINCULANDO AL PROYECTO"
echo "====================================="
if supabase link --project-ref akwobmrcwqbbrdvzyiul; then
    echo "✅ Proyecto vinculado"
else
    echo "❌ Error al vincular proyecto"
    exit 1
fi

echo ""
echo "🚀 DESPLEGANDO EDGE FUNCTION"
echo "====================================="
if supabase functions deploy openai-chat; then
    echo "✅ Edge Function desplegada"
else
    echo "❌ Error al desplegar"
    exit 1
fi

echo ""
echo "🎉 DESPLIEGUE COMPLETADO"
echo "====================================="
echo "Ahora configura la API key en Supabase Dashboard"
