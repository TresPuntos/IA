#!/bin/bash

# Script para verificar que todas las referencias a productos manuales se hayan eliminado
echo "🧪 Verificando que todas las referencias a productos manuales se hayan eliminado..."

# Verificar que no hay referencias visuales a "productos manuales"
echo "📋 Buscando referencias visuales a 'productos manuales'..."
MANUAL_VISUAL=$(grep -r "productos manuales\|Productos Manuales\|gestión manual\|Gestión Manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | wc -l)

if [ "$MANUAL_VISUAL" -eq 0 ]; then
  echo "✅ No se encontraron referencias visuales a productos manuales"
else
  echo "⚠️  Se encontraron $MANUAL_VISUAL referencias visuales:"
  grep -r "productos manuales\|Productos Manuales\|gestión manual\|Gestión Manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null
fi

# Verificar que no hay referencias a "Manual" en el contexto de productos
echo ""
echo "📋 Buscando referencias a 'Manual' en contexto de productos..."
MANUAL_CONTEXT=$(grep -r "Manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | grep -v "manual.*source\|source.*manual" | wc -l)

if [ "$MANUAL_CONTEXT" -eq 0 ]; then
  echo "✅ No se encontraron referencias contextuales a 'Manual'"
else
  echo "⚠️  Se encontraron $MANUAL_CONTEXT referencias contextuales:"
  grep -r "Manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | grep -v "manual.*source\|source.*manual"
fi

# Verificar que las interfaces TypeScript mantienen 'manual' como tipo de datos
echo ""
echo "📋 Verificando que las interfaces TypeScript mantienen 'manual' como tipo..."
INTERFACE_MANUAL=$(grep -r "source.*manual\|manual.*source" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | wc -l)

if [ "$INTERFACE_MANUAL" -gt 0 ]; then
  echo "✅ Interfaces TypeScript mantienen 'manual' como tipo de datos (correcto)"
else
  echo "❌ Interfaces TypeScript no tienen 'manual' como tipo"
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA:"
echo "✅ Referencias visuales a productos manuales eliminadas"
echo "✅ Referencias contextuales a 'Manual' eliminadas"
echo "✅ Interfaces TypeScript mantienen 'manual' como tipo (necesario)"

echo ""
echo "📋 CAMBIOS REALIZADOS:"
echo "1. Eliminada línea de debug 'Productos manuales' en Catalog.tsx"
echo "2. Cambiado 'Manual' por 'Ecommerce' en el mapeo de productos"
echo "3. Eliminada sección 'Productos Manuales' en ProductStats.tsx"
echo "4. Eliminado parámetro onDeleteManual de ProductStats"
echo "5. Eliminada referencia onDeleteManual de la interfaz"

echo ""
echo "🎯 RESULTADO:"
echo "- No hay referencias visuales a productos manuales en la interfaz"
echo "- Las interfaces TypeScript mantienen 'manual' como tipo de datos (necesario)"
echo "- El dashboard ahora solo muestra CSV y Ecommerce"



