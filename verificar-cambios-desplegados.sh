#!/bin/bash

echo "🔍 VERIFICACIÓN DE CAMBIOS DESPLEGADOS"
echo ""
echo "1️⃣  VERIFICAR ARCHIVOS MODIFICADOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "SimplePrestashopConnection" src/pages/Catalog.tsx; then
  echo "✅ Catalog.tsx actualizado correctamente"
else
  echo "❌ Catalog.tsx NO tiene los cambios"
fi

if [ -f "src/components/SimplePrestashopConnection.tsx" ]; then
  echo "✅ SimplePrestashopConnection.tsx creado"
else
  echo "❌ SimplePrestashopConnection.tsx NO existe"
fi

if ! grep -q "Configuración PrestaShop" src/pages/Configuration.tsx; then
  echo "✅ Configuración.tsx limpiado (sin PrestaShop)"
else
  echo "⚠️  Configuration.tsx aún tiene PrestaShop"
fi

echo ""
echo "2️⃣  VERIFICAR SERVIDOR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Servidor corriendo en http://localhost:3000"
  echo ""
  echo "🌐 Abre en el navegador:"
  echo "   http://localhost:3000/catalog"
else
  echo "❌ Servidor NO está corriendo"
  echo ""
  echo "🚀 Para iniciar el servidor:"
  echo "   npm run dev"
fi

echo ""
echo "3️⃣  SI NO VES LOS CAMBIOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Detén el servidor (Ctrl+C)"
echo "2. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)"
echo "3. Reinicia el servidor: npm run dev"
echo "4. Abre: http://localhost:3000/catalog"
echo ""
echo "✅ Verificación completada"

