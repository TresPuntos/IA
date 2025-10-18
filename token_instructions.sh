#!/bin/bash

echo "🔧 PUSH CON TOKEN PERSONAL - INSTRUCCIONES"
echo "=========================================="
echo ""

echo "❌ El token proporcionado tiene problemas de permisos:"
echo "- Error: Permission denied (403)"
echo "- Posibles causas:"
echo "  • Token expirado"
echo "  • Permisos insuficientes"
echo "  • Token no válido"
echo ""

echo "🎯 SOLUCIÓN: Generar nuevo token"
echo "1. Ve a: https://github.com/settings/tokens"
echo "2. Haz clic en 'Generate new token (classic)'"
echo "3. Selecciona estos permisos:"
echo "   ✅ repo (Full control of private repositories)"
echo "   ✅ workflow (Update GitHub Action workflows)"
echo "4. Copia el nuevo token"
echo "5. Ejecuta este comando:"
echo ""
echo "git push https://NUEVO_TOKEN@github.com/TresPuntos/IA.git main"
echo ""

echo "📋 Estado actual:"
echo "- Rama: main"
echo "- Commits pendientes: 2"
echo "- Archivos corregidos: src/main.tsx, src/App.tsx"
echo "- Build exitoso: ✅"
echo ""

echo "🔄 Alternativa más rápida: GitHub Desktop"
echo "1. Abre GitHub Desktop"
echo "2. Selecciona el repositorio 'TresPuntos/IA'"
echo "3. Haz clic en 'Push origin'"
echo "4. Si hay error de autenticación:"
echo "   • Ve a GitHub Desktop > Preferences > Accounts"
echo "   • Cierra sesión y vuelve a iniciar sesión"
echo ""

echo "📱 Alternativa: Interfaz Web"
echo "1. Ve a https://github.com/TresPuntos/IA"
echo "2. Haz clic en 'Add file' → 'Upload files'"
echo "3. Sube estos archivos:"
echo "   - src/main.tsx"
echo "   - src/App.tsx"
echo "4. Escribe el mensaje: 'fix: Restaurar versión estable completa'"
echo "5. Haz clic en 'Commit changes'"
echo ""

echo "🎉 Después del push:"
echo "- Netlify desplegará automáticamente"
echo "- Dashboard estable funcionando"
echo "- Sin errores de build"
echo ""

# Mostrar el estado actual
echo "📊 Estado del repositorio:"
git status --short
echo ""
echo "📝 Últimos commits:"
git log --oneline -3
