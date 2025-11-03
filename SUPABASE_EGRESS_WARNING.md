# ⚠️ ADVERTENCIA: Egress de Supabase al 1035%

## 🚨 PROBLEMA CRÍTICO

Tu proyecto Supabase ha excedido el límite de **Egress** del plan gratuito:
- **Usado:** 51.7 GB
- **Límite:** 5 GB
- **Porcentaje:** 1035% ❌

## 🔍 QUÉ ES EGRESS

**Egress** = Datos que salen de Supabase hacia internet. Cada vez que:
- Tu aplicación hace consultas a Supabase
- Edge Functions hacen peticiones externas (como a PrestaShop)
- Se descargan archivos o datos

## ✅ SOLUCIÓN YA IMPLEMENTADA

Ya hemos migrado las llamadas a PrestaShop de Supabase Edge Functions a **Netlify Functions** para evitar consumir más Egress.

### Verificación

1. ✅ PrestaShop usa Netlify Functions (`/api/prestashop/*`)
2. ✅ No usa Supabase Edge Functions para PrestaShop
3. ⚠️ Pero Supabase aún se usa para:
   - Base de datos (productos, configuración)
   - Edge Functions para chat (si están activas)

## 🔧 QUÉ HACER

### Opción 1: Esperar al próximo ciclo de facturación
- El límite se reinicia cada mes
- Supabase puede imponer restricciones mientras tanto

### Opción 2: Reducir uso inmediato
- Limitar llamadas a Supabase
- Usar más localStorage para datos temporales
- Reducir uso de Edge Functions

### Opción 3: Actualizar plan (recomendado si es crítico)
- Plan Pro: $25/mes con más límites

## 📊 IMPACTO EN EL PROYECTO

### NO afecta:
- ✅ Importación de PrestaShop (usa Netlify Functions)
- ✅ Funciones de Netlify
- ✅ Frontend estático

### SÍ puede afectar:
- ⚠️ Consultas a la base de datos de Supabase
- ⚠️ Edge Functions de chat (si están activas)
- ⚠️ Sincronización de productos/configuración

## 🎯 VERIFICACIÓN RÁPIDA

Verifica que estés usando Netlify Functions:

```javascript
// ✅ CORRECTO (Netlify Function)
fetch('/api/prestashop/products/...')

// ❌ INCORRECTO (Supabase Edge Function - consume Egress)
fetch('https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/prestashop-proxy/...')
```

## 💡 RECOMENDACIÓN

El código actual debería estar bien porque usamos Netlify Functions. Sin embargo, el Egress ya consumido puede causar restricciones temporales en Supabase.

**Solución inmediata:** Verificar que no haya llamadas pendientes a Supabase Edge Functions para PrestaShop.

