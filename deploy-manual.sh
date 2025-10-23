#!/bin/bash
# Manual deployment script for Edge Function

echo "🚀 DESPLIEGUE MANUAL DE EDGE FUNCTION"
echo "====================================="

# Check if we have the updated function
if [ ! -f "supabase/functions/openai-chat/index.ts" ]; then
    echo "❌ Error: Edge Function not found"
    exit 1
fi

echo "✅ Edge Function found"
echo "📝 Changes made:"
echo "   - Limited products to 50 in prompt"
echo "   - Reduced documentation content"
echo "   - Added note about additional products"

echo ""
echo "🔧 MANUAL DEPLOYMENT REQUIRED:"
echo "====================================="
echo "1. Go to: https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/functions"
echo "2. Click on 'openai-chat' function"
echo "3. Click 'Edit' button"
echo "4. Replace the content with the updated code from:"
echo "   supabase/functions/openai-chat/index.ts"
echo "5. Click 'Deploy'"
echo ""
echo "📋 OR USE CLI (if you have access):"
echo "====================================="
echo "supabase login"
echo "supabase link --project-ref akwobmrcwqbbrdvzyiul"
echo "supabase functions deploy openai-chat"
echo ""
echo "🧪 TEST AFTER DEPLOYMENT:"
echo "====================================="
echo "node test-openai-documentation.js"
echo ""
echo "✅ Expected result: Status 200 instead of 400"
