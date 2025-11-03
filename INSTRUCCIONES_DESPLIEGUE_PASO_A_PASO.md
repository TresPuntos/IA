# 🚀 INSTRUCCIONES PASO A PASO - DESPLEGAR PRESTASHOP-PROXY

## ❌ ERROR ACTUAL
**404 - La Edge Function no está desplegada**

## ✅ SOLUCIÓN: DESPLEGAR LA EDGE FUNCTION

### 📋 PASO 1: Abrir Supabase Dashboard

Abre este enlace en tu navegador:
```
https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/functions
```

### 📋 PASO 2: Crear Nueva Función

1. Busca el botón **"New Function"** o **"Create Function"** (arriba a la derecha)
2. Haz clic en él
3. En el campo **"Function name"**, escribe exactamente:
   ```
   prestashop-proxy
   ```
4. Haz clic en **"Create"** o **"Create Function"**

### 📋 PASO 3: Copiar el Código

1. Abre el archivo en tu editor:
   ```
   supabase/functions/prestashop-proxy/index.ts
   ```
2. Selecciona **TODO** el contenido (Ctrl+A o Cmd+A)
3. Copia (Ctrl+C o Cmd+C)

### 📋 PASO 4: Pegar en Supabase

1. En el editor de Supabase (área de código grande)
2. Selecciona TODO el contenido que hay (Ctrl+A)
3. Pega el código que copiaste (Ctrl+V o Cmd+V)
4. Verifica que el código completo esté pegado (debe tener ~171 líneas)

### 📋 PASO 5: Desplegar

1. Busca el botón **"Deploy"** o **"Save & Deploy"**
2. Haz clic en él
3. Espera a que aparezca "Deployed" o "Active" (puede tardar 30-60 segundos)

### 📋 PASO 6: Verificar

1. Deberías ver la función `prestashop-proxy` en la lista
2. Debe aparecer como **"Active"** o **"Deployed"**
3. Haz clic en la función para ver sus detalles

### 📋 PASO 7: Probar

1. Ve a tu aplicación: http://localhost:3000/catalog
2. Recarga la página (Ctrl+R o Cmd+R)
3. Ingresa:
   - **URL:** `https://100x100chef.com/shop`
   - **API Key:** `E5CUG6DLAD9EA46AIN7Z2LIX1W3IIJKZ`
4. Haz clic en **"Probar Conexión"**
5. Ya NO debería aparecer error 404

## 🔍 VERIFICACIÓN RÁPIDA

Si la función está desplegada correctamente:
- ✅ URL: `https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/prestashop-proxy/products/1?language=1&output_format=JSON`
- ✅ Debería responder (no 404)
- ✅ El botón "Probar Conexión" debería funcionar

## ❌ SI SIGUES VIENDO 404

1. Verifica que la función se llama exactamente: `prestashop-proxy` (sin espacios, con guión)
2. Verifica que el código está completamente pegado (no cortado)
3. Verifica que está desplegada (debe decir "Active" o "Deployed")
4. Espera 1-2 minutos después del despliegue y prueba de nuevo
5. Revisa los logs de la función en Supabase Dashboard

## 📞 CÓDIGO COMPLETO

El código completo está en:
```
supabase/functions/prestashop-proxy/index.ts
```

O puedes leerlo en: `DESPLEGAR_PRESASHOP_PROXY.md`


