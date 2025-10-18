#!/bin/bash

# Script para abrir GitHub Desktop y hacer push
echo "🚀 Abriendo GitHub Desktop..."

# Verificar si GitHub Desktop está instalado
if [ -d "/Applications/GitHub Desktop.app" ]; then
    echo "✅ GitHub Desktop encontrado"
    open -a "GitHub Desktop"
    echo "📂 Navegando al directorio del proyecto..."
    cd /Users/jordi/Documents/GitHub/IA
    echo "📋 Estado actual del repositorio:"
    git status
    echo ""
    echo "🎯 Instrucciones:"
    echo "1. GitHub Desktop debería abrirse automáticamente"
    echo "2. Selecciona el repositorio 'TresPuntos/IA'"
    echo "3. Verás 2 commits pendientes de subir"
    echo "4. Haz clic en 'Push origin'"
    echo "5. Espera a que termine el push"
    echo ""
    echo "⏰ Tiempo estimado: 1-2 minutos"
else
    echo "❌ GitHub Desktop no encontrado en /Applications/"
    echo "💡 Alternativas:"
    echo "1. Instalar GitHub Desktop desde: https://desktop.github.com/"
    echo "2. Usar la interfaz web de GitHub"
    echo "3. Configurar SSH keys para git"
fi
