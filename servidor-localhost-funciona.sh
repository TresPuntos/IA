#!/bin/bash

echo "🔍 DIAGNÓSTICO: ¿POR QUÉ NO FUNCIONA LOCALHOST?"
echo ""
echo "1️⃣  VERIFICAR SERVIDOR:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Servidor respondiendo en http://localhost:3000"
else
  echo "❌ Servidor NO responde en http://localhost:3000"
  echo ""
  echo "🔧 SOLUCIÓN:"
  echo "   Ejecuta: npm run dev"
  echo "   Espera a que aparezca: 'Local: http://localhost:3000'"
fi

echo ""
echo "2️⃣  VERIFICAR PUERTOS ALTERNATIVOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for port in 3000 5173 5174; do
  if curl -s http://localhost:$port > /dev/null 2>&1; then
    echo "✅ Servidor encontrado en: http://localhost:$port"
  fi
done

echo ""
echo "3️⃣  VERIFICAR PROCESOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if pgrep -f "vite" > /dev/null; then
  echo "✅ Proceso Vite encontrado"
  pgrep -f "vite" | head -1 | xargs ps -p 2>/dev/null | tail -1
else
  echo "❌ Proceso Vite NO encontrado"
  echo "   Ejecuta: npm run dev"
fi

echo ""
echo "4️⃣  SOLUCIONES COMUNES:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Si el puerto 3000 está ocupado, Vite usará otro puerto"
echo "• Revisa la terminal donde ejecutaste 'npm run dev'"
echo "• Busca la línea que dice: 'Local: http://localhost:XXXX'"
echo "• Usa ese puerto en lugar de 3000"
echo ""
echo "• Si no ves ningún servidor:"
echo "  1. Detén procesos anteriores: pkill -f vite"
echo "  2. Inicia de nuevo: npm run dev"
echo ""
echo "• Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)"

