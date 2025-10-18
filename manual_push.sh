#!/bin/bash

echo "🔧 PUSH MANUAL CON TOKEN PERSONAL"
echo "=================================="
echo ""

echo "❌ Problema de autenticación persistente:"
echo "- HTTPS: Permission denied (403)"
echo "- SSH: Permission denied (publickey)"
echo ""

echo "🎯 SOLUCIÓN: Push manual con token"
echo "1. Ve a: https://github.com/settings/tokens"
echo "2. Genera un nuevo token con permisos 'repo'"
echo "3. Copia el token"
echo "4. Ejecuta este comando:"
echo ""
echo "git push https://TU_TOKEN@github.com/TresPuntos/IA.git main"
echo ""
echo "Reemplaza 'TU_TOKEN' con tu token personal"
echo ""

echo "📋 Estado actual:"
echo "- Rama: main"
echo "- Commits pendientes: 2"
echo "- Archivos corregidos: src/main.tsx, src/App.tsx"
echo "- Build exitoso: ✅"
echo ""

echo "🔄 Alternativa: GitHub Desktop"
echo "1. Abre GitHub Desktop"
echo "2. Selecciona el repositorio 'TresPuntos/IA'"
echo "3. Haz clic en 'Push origin'"
echo ""

echo "📱 Alternativa: Interfaz Web"
echo "1. Ve a https://github.com/TresPuntos/IA"
echo "2. Haz clic en 'Add file' → 'Upload files'"
echo "3. Sube: src/main.tsx y src/App.tsx"
echo ""

# Mostrar el estado actual
echo "📊 Estado del repositorio:"
git status --short
echo ""
echo "📝 Últimos commits:"
git log --oneline -3
