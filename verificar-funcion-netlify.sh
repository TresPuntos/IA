#!/bin/bash

echo "🔍 VERIFICANDO FUNCIÓN NETLIFY"
echo "==============================="
echo ""

echo "1️⃣ Verificando archivo existe:"
if [ -f "netlify/functions/prestashop.js" ]; then
  echo "✅ Archivo existe: netlify/functions/prestashop.js"
  echo "   Tamaño: $(wc -l < netlify/functions/prestashop.js) líneas"
else
  echo "❌ Archivo NO existe"
  exit 1
fi

echo ""
echo "2️⃣ Verificando estructura (exports.handler):"
if grep -q "exports.handler" netlify/functions/prestashop.js; then
  echo "✅ Tiene exports.handler"
else
  echo "❌ NO tiene exports.handler"
  exit 1
fi

echo ""
echo "3️⃣ Verificando netlify.toml:"
if [ -f "netlify.toml" ]; then
  echo "✅ netlify.toml existe"
  if grep -q "functions = \"netlify/functions\"" netlify.toml; then
    echo "✅ Configuración de functions correcta"
  else
    echo "❌ Configuración de functions INCORRECTA"
  fi
  if grep -q "/api/prestashop/\*" netlify.toml; then
    echo "✅ Redirect configurado"
  else
    echo "❌ Redirect NO configurado"
  fi
else
  echo "❌ netlify.toml NO existe"
fi

echo ""
echo "4️⃣ Verificando en Git:"
if git ls-files | grep -q "netlify/functions/prestashop.js"; then
  echo "✅ Archivo está en Git"
else
  echo "❌ Archivo NO está en Git - Necesitas hacer: git add netlify/functions/prestashop.js"
fi

if git ls-files | grep -q "netlify.toml"; then
  echo "✅ netlify.toml está en Git"
else
  echo "❌ netlify.toml NO está en Git"
fi

echo ""
echo "5️⃣ Verificando último commit:"
git log -1 --oneline -- netlify/functions/prestashop.js

echo ""
echo "✅ VERIFICACIÓN COMPLETA"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a: https://app.netlify.com/sites/stalwart-panda-77e3cb/functions"
echo "2. Verifica si aparece 'prestashop' en la lista"
echo "3. Si NO aparece, haz un redeploy manual"
echo "4. Espera 2-3 minutos y prueba de nuevo"

