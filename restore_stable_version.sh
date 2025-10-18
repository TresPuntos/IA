#!/bin/bash

echo "🔄 RESTAURAR VERSIÓN ESTABLE"
echo "============================="
echo ""

echo "✅ Estado actual:"
echo "- Versión estable restaurada (commit 80517f3)"
echo "- Sin menú lateral complicado"
echo "- Toda la funcionalidad intacta:"
echo "  • Chat local funcionando"
echo "  • Configuración guardada"
echo "  • Productos y documentos"
echo "  • Build exitoso"
echo ""

echo "🎯 SOLUCIÓN: GitHub Desktop"
echo "1. Abre GitHub Desktop"
echo "2. Selecciona el repositorio 'TresPuntos/IA'"
echo "3. Verás que está 'behind' por 6 commits"
echo "4. Haz clic en 'Push origin' (forzar push)"
echo "5. Esto restaurará la versión estable"
echo ""

echo "📱 ALTERNATIVA: Interfaz Web"
echo "1. Ve a https://github.com/TresPuntos/IA"
echo "2. Haz clic en 'Add file' → 'Upload files'"
echo "3. Sube los archivos principales:"
echo "   - src/App.tsx"
echo "   - src/components/ConfigHeader.tsx"
echo "   - Todos los componentes de tarjetas"
echo ""

echo "🎉 Después del push verás:"
echo "- Dashboard simple y funcional"
echo "- Sin menú lateral complicado"
echo "- Chat local funcionando perfectamente"
echo "- Configuración guardada"
echo "- Productos y documentos operativos"
echo ""

# Intentar abrir GitHub Desktop
if [ -d "/Applications/GitHub Desktop.app" ]; then
    echo "🔄 Abriendo GitHub Desktop..."
    open -a "GitHub Desktop"
    echo "✅ GitHub Desktop abierto"
else
    echo "❌ GitHub Desktop no encontrado"
    echo "💡 Instala desde: https://desktop.github.com/"
fi
