#!/bin/bash

echo "🔄 Limpiando productos CSV existentes y re-subiendo con mapeo corregido..."

echo "📋 Pasos para corregir el mapeo de URLs:"
echo "1. Ve a la página de Catálogo en tu dashboard"
echo "2. Haz clic en 'Limpiar productos CSV' para eliminar los productos actuales"
echo "3. Sube nuevamente tu archivo CSV"
echo "4. Ahora el campo 'product_url' se mapeará correctamente a 'external_id'"
echo ""
echo "🔧 Cambios realizados:"
echo "- ✅ Mapeo de 'product_url' → 'external_id' en parseCSV()"
echo "- ✅ Mapeo de 'image_url' → 'image_url' en parseCSV()"
echo "- ✅ Guardado de 'external_id' en saveCSVProducts()"
echo ""
echo "📝 Después de re-subir el CSV, prueba con:"
echo "./test-csv-mapping.sh"
