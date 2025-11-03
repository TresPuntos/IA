# 🔐 IMPORTANTE: Rotar Clave API de PrestaShop

## ⚠️ ADVERTENCIA DE SEGURIDAD

La clave API de PrestaShop estaba hardcodeada en múltiples archivos del repositorio y fue detectada por Netlify durante el build. **La clave debe ser rotada inmediatamente** ya que estaba comprometida en el historial de Git.

**Esta clave debe ser considerada COMPROMETIDA** y debe rotarse inmediatamente.

## 📋 PASOS A SEGUIR

### 1. Rotar la clave en PrestaShop

1. Ve a tu panel de administración de PrestaShop
2. Navega a: **Configuración Avanzada** → **Web Service**
3. Busca la clave API existente que estaba comprometida
4. **Elimínala o desactívala**
5. **Crea una nueva clave API** con los mismos permisos
6. **Guarda la nueva clave** en un lugar seguro

### 2. Actualizar en Netlify

1. Ve a: https://app.netlify.com/sites/stalwart-panda-77e3cb/configuration/env
2. Busca la variable de entorno: `PRESTASHOP_API_KEY`
3. **Actualiza el valor** con la nueva clave API
4. Guarda los cambios

### 3. Verificar que funcione

1. Ve a: https://stalwart-panda-77e3cb.netlify.app/
2. Navega a la página **Catálogo**
3. Prueba la conexión con PrestaShop usando la nueva clave
4. Verifica que la importación funcione correctamente

## ✅ ESTADO ACTUAL

- ✅ Todas las claves hardcodeadas han sido eliminadas del repositorio
- ✅ Se reemplazaron con placeholders: `TU_PRESTASHOP_API_KEY_AQUI`
- ✅ Los archivos ahora usan variables de entorno o placeholders
- ⚠️ **PENDIENTE**: Rotar la clave en PrestaShop y actualizar en Netlify

## 📝 NOTA

**NO vuelvas a commitear claves API reales en el repositorio**. Las claves deben estar:
- En variables de entorno de Netlify
- En archivos `.env` locales (que NO se commitean)
- Nunca en código fuente o documentación

## 🔍 ARCHIVOS LIMPIADOS

Los siguientes archivos fueron actualizados:
- `test/tabla_productos.php`
- `documentacion/obtener_grid_productos.php`
- `test-prestashop-import.js`
- `SOLUCION_404_NETLIFY.md`
- `DESPLIEGAR_EDGE_FUNCTION_AHORA.md`
- `INSTRUCCIONES_DESPLIEGUE_PASO_A_PASO.md`
- `DESPLEGAR_PRESASHOP_PROXY.md`
- `como-usar-importacion-prestashop.sh`
- `diagnostico-error-502.sh`
- `prestashop-import-test-results.sh`

