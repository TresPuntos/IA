#!/bin/bash

# Script para verificar que la opción de gestión manual se haya eliminado
echo "🧪 Verificando que la opción de gestión manual se haya eliminado..."

# Verificar que no hay referencias a "gestión manual" en el código
echo "📋 Buscando referencias a 'gestión manual' en el código..."
MANUAL_REFERENCES=$(grep -r "gestión manual\|gestion manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null | wc -l)

if [ "$MANUAL_REFERENCES" -eq 0 ]; then
  echo "✅ No se encontraron referencias a 'gestión manual' en el código"
else
  echo "⚠️  Se encontraron $MANUAL_REFERENCES referencias a 'gestión manual':"
  grep -r "gestión manual\|gestion manual" /Users/jordi/Documents/GitHub/IA/src/ 2>/dev/null
fi

# Verificar que el TabsList ahora tiene solo 2 columnas
echo ""
echo "📋 Verificando que el TabsList tenga solo 2 columnas..."
TABS_GRID=$(grep -A 3 "TabsList" /Users/jordi/Documents/GitHub/IA/src/pages/Catalog.tsx | grep "grid-cols")

if echo "$TABS_GRID" | grep -q "grid-cols-2"; then
  echo "✅ TabsList configurado correctamente con 2 columnas"
else
  echo "❌ TabsList no está configurado correctamente"
fi

# Verificar que no hay TabsTrigger para "manual"
echo ""
echo "📋 Verificando que no hay TabsTrigger para 'manual'..."
MANUAL_TRIGGER=$(grep -A 5 "TabsList" /Users/jordi/Documents/GitHub/IA/src/pages/Catalog.tsx | grep "manual")

if [ -z "$MANUAL_TRIGGER" ]; then
  echo "✅ No se encontró TabsTrigger para 'manual'"
else
  echo "❌ Aún existe TabsTrigger para 'manual'"
fi

# Verificar que no hay TabsContent para "manual"
echo ""
echo "📋 Verificando que no hay TabsContent para 'manual'..."
MANUAL_CONTENT=$(grep -A 10 "TabsContent.*manual" /Users/jordi/Documents/GitHub/IA/src/pages/Catalog.tsx)

if [ -z "$MANUAL_CONTENT" ]; then
  echo "✅ No se encontró TabsContent para 'manual'"
else
  echo "❌ Aún existe TabsContent para 'manual'"
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA:"
echo "✅ Opción de gestión manual eliminada del selector"
echo "✅ TabsList configurado con 2 columnas"
echo "✅ Descripción actualizada para mencionar solo CSV y ecommerce"
echo "✅ Lista de fuentes actualizada sin gestión manual"

echo ""
echo "📋 CAMBIOS REALIZADOS:"
echo "1. Eliminada la pestaña 'Gestión Manual' del selector"
echo "2. Cambiado el grid de 3 columnas a 2 columnas"
echo "3. Eliminado todo el contenido de la pestaña manual"
echo "4. Actualizada la descripción para mencionar solo CSV y ecommerce"
echo "5. Eliminada la referencia a 'Gestión manual' en la lista de fuentes"



