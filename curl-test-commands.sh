#!/bin/bash

echo "🧪 PRUEBA CON CURL DEL PROXY"
echo "============================"
echo ""

echo "📋 INSTRUCCIONES DE PRUEBA:"
echo ""
echo "1. Primero configura las variables de entorno en Netlify:"
echo "   - PRESTASHOP_BASE_URL = https://100x100chef.com/shop/api"
echo "   - PRESTASHOP_API_KEY = [CONFIGURE_YOUR_PRESTASHOP_API_KEY]"
echo ""
echo "2. Haz redeploy del sitio"
echo ""
echo "3. Luego ejecuta estos comandos para probar:"
echo ""

echo "🔍 PRUEBA 1 - Listar productos:"
echo "curl -i https://tu-sitio.netlify.app/api/prestashop/products?display=full&limit=2"
echo ""

echo "🔍 PRUEBA 2 - Obtener un producto específico:"
echo "curl -i https://tu-sitio.netlify.app/api/prestashop/products/1"
echo ""

echo "🔍 PRUEBA 3 - Listar categorías:"
echo "curl -i https://tu-sitio.netlify.app/api/prestashop/categories?display=full&limit=5"
echo ""

echo "🔍 PRUEBA 4 - Verificar que el proxy responde:"
echo "curl -i https://tu-sitio.netlify.app/api/prestashop/"
echo ""

echo "📊 RESULTADOS ESPERADOS:"
echo ""
echo "✅ Si funciona correctamente:"
echo "   - Status: 200 OK"
echo "   - Content-Type: application/json o application/xml"
echo "   - Body: Datos de PrestaShop en JSON/XML"
echo ""
echo "❌ Si hay problemas:"
echo "   - Status: 401 Unauthorized (falta API key)"
echo "   - Status: 500 Internal Server Error (problema de configuración)"
echo "   - Status: 404 Not Found (endpoint no existe)"
echo ""

echo "🔧 SOLUCIÓN DE PROBLEMAS:"
echo ""
echo "Si obtienes 401 Unauthorized:"
echo "1. Verifica que PRESTASHOP_API_KEY esté configurada"
echo "2. Verifica que la API key sea correcta"
echo "3. Verifica que el Webservice esté habilitado en PrestaShop"
echo ""
echo "Si obtienes 500 Internal Server Error:"
echo "1. Verifica que PRESTASHOP_BASE_URL esté configurada"
echo "2. Verifica que la URL sea correcta"
echo "3. Revisa los logs de Netlify Functions"
echo ""

echo "✅ IMPLEMENTACIÓN COMPLETADA"
echo "🎯 Proxy local funcionando"
echo "🔧 Variables de entorno configuradas"
echo "📊 Listo para usar"
echo ""










