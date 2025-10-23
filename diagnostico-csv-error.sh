#!/bin/bash

echo "🔍 Diagnóstico del error de subida CSV..."

echo "📋 Verificando estructura del proyecto:"
echo "- Archivo productCatalog.ts: $(ls -la src/lib/productCatalog.ts 2>/dev/null || echo '❌ No encontrado')"
echo "- Archivo CSVUploader.tsx: $(ls -la src/components/CSVUploader.tsx 2>/dev/null || echo '❌ No encontrado')"

echo ""
echo "🔧 Verificando cambios recientes en productCatalog.ts:"
echo "- Línea 645-646 (mapeo external_id):"
grep -n "external_id.*product_url" src/lib/productCatalog.ts || echo "❌ Mapeo no encontrado"

echo ""
echo "📊 Verificando función parseCSV:"
echo "- Líneas 638-649 (productos.push):"
sed -n '638,649p' src/lib/productCatalog.ts

echo ""
echo "🚀 Para diagnosticar el error específico:"
echo "1. Abre las herramientas de desarrollador del navegador (F12)"
echo "2. Ve a la pestaña 'Console'"
echo "3. Intenta subir el CSV nuevamente"
echo "4. Copia y pega aquí el error que aparece en la consola"
