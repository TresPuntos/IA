#!/bin/bash
# Script para instalar y configurar Supabase CLI

echo "🚀 INSTALANDO SUPABASE CLI..."
echo "====================================="

# Crear directorio para Supabase CLI
mkdir -p ~/.local/bin

# Descargar Supabase CLI
echo "📥 Descargando Supabase CLI..."
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_darwin_amd64.tar.gz -o /tmp/supabase.tar.gz

# Extraer
echo "📦 Extrayendo..."
cd /tmp
tar -xzf supabase.tar.gz

# Mover a directorio local
mv supabase ~/.local/bin/

# Hacer ejecutable
chmod +x ~/.local/bin/supabase

# Añadir al PATH si no está
if ! echo $PATH | grep -q "$HOME/.local/bin"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
    echo "✅ PATH actualizado en ~/.zshrc"
fi

# Verificar instalación
echo "✅ Verificando instalación..."
~/.local/bin/supabase --version

echo ""
echo "🎉 SUPABASE CLI INSTALADO CORRECTAMENTE"
echo "====================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ejecutar: source ~/.zshrc"
echo "2. Ejecutar: supabase login"
echo "3. Ejecutar: supabase link --project-ref akwobmrcwqbbrdvzyiul"
echo "4. Ejecutar: supabase functions deploy openai-chat"
echo ""
echo "💡 Si tienes problemas, reinicia la terminal y vuelve a intentar."
