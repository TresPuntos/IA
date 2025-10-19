#!/bin/bash
# Script para verificar el estado del despliegue

echo "🔍 VERIFICANDO ESTADO DEL DESPLIEGUE"
echo "===================================="
echo ""

echo "📋 COMMITS SUBIDOS:"
echo "====================================="
git log --oneline -3
echo ""

echo "🌐 VERIFICANDO NETLIFY:"
echo "====================================="
echo "URL: https://stalwart-panda-77e3cb.netlify.app/"
echo "Estado del despliegue: https://app.netlify.com/sites/stalwart-panda-77e3cb/deploys"
echo ""

echo "🔧 ARCHIVOS MODIFICADOS EN EL ÚLTIMO COMMIT:"
echo "====================================="
git show --name-only HEAD
echo ""

echo "📝 CONTENIDO DE LOS ARCHIVOS CLAVE:"
echo "====================================="
echo ""
echo "1. App.tsx - Layout:"
grep -n "max-w-\[500px\]" src/App.tsx
echo ""
echo "2. ModelParamsCard.tsx - Selector de modelo:"
grep -n "Modelo de OpenAI" src/components/ModelParamsCard.tsx
echo ""
echo "3. ModelParamsCard.tsx - Tag de conexión:"
grep -n "Conectado\|Desconectado" src/components/ModelParamsCard.tsx
echo ""
echo "4. ProductCatalogCard.tsx - Botones de eliminación:"
grep -n "Gestionar productos" src/components/ProductCatalogCard.tsx
echo ""

echo "🎯 POSIBLES PROBLEMAS:"
echo "====================================="
echo "1. Cache del navegador - Prueba Ctrl+F5 o Cmd+Shift+R"
echo "2. Netlify aún desplegando - Espera 2-3 minutos más"
echo "3. CSS no aplicado - Verifica que TailwindCSS esté funcionando"
echo "4. JavaScript no cargado - Verifica la consola del navegador"
echo ""

echo "🔧 SOLUCIONES:"
echo "====================================="
echo "1. Limpiar cache del navegador"
echo "2. Verificar consola del navegador (F12)"
echo "3. Esperar más tiempo para el despliegue"
echo "4. Verificar que Netlify haya completado el build"
