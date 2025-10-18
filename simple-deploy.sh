#!/bin/bash
# Solución simple para desplegar Edge Function

echo "🚀 SOLUCIÓN SIMPLE PARA DESPLEGAR"
echo "====================================="
echo ""

# Verificar directorio
if [ ! -f "supabase/functions/openai-chat/index.ts" ]; then
    echo "❌ Error: No estás en el directorio correcto"
    exit 1
fi

echo "✅ Directorio correcto"
echo ""

# Crear configuración básica
echo "🔧 Creando configuración básica..."
mkdir -p ~/.supabase

# Crear archivo de configuración
cat > ~/.supabase/config.toml << 'EOF'
[api]
host = "https://api.supabase.com"
port = 443
scheme = "https"

[db]
port = 54322
major_version = 15

[functions]
verify_jwt = false
EOF

echo "✅ Configuración creada"
echo ""

# Intentar método alternativo
echo "🔐 Intentando método alternativo..."
echo ""

# Verificar si podemos acceder sin login
echo "Probando acceso a proyectos..."
if supabase projects list 2>/dev/null | grep -q "akwobmrcwqbbrdvzyiul"; then
    echo "✅ Acceso directo disponible"
    
    # Continuar con despliegue
    echo "🔗 Vinculando proyecto..."
    if supabase link --project-ref akwobmrcwqbbrdvzyiul; then
        echo "✅ Proyecto vinculado"
        
        echo "🚀 Desplegando función..."
        if supabase functions deploy openai-chat; then
            echo "✅ Edge Function desplegada"
            echo ""
            echo "🎉 DESPLIEGUE COMPLETADO"
            echo "====================================="
            echo "Ahora configura la API key en Supabase Dashboard"
            exit 0
        else
            echo "❌ Error al desplegar función"
        fi
    else
        echo "❌ Error al vincular proyecto"
    fi
else
    echo "❌ Necesitas hacer login"
    echo ""
    echo "📋 MÉTODO MÁS SIMPLE:"
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
fi
