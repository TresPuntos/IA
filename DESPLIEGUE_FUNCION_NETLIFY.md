# 🚀 DESPLEGAR FUNCIÓN NETLIFY - prestashop

## ❌ PROBLEMA ACTUAL
La función de Netlify `prestashop` no está desplegada, por eso da error 404.

## ✅ SOLUCIÓN: VERIFICAR Y DESPLEGAR

### 1️⃣ VERIFICAR QUE EL ARCHIVO EXISTE
```bash
ls -la netlify/functions/prestashop.js
```
✅ Debe existir y tener contenido

### 2️⃣ VERIFICAR QUE ESTÁ EN GIT
```bash
git ls-files | grep prestashop
```
✅ Debe mostrar: `netlify/functions/prestashop.js`

### 3️⃣ VERIFICAR NETLIFY.TOML
```bash
cat netlify.toml
```
✅ Debe mostrar:
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/prestashop/*"
  to = "/.netlify/functions/prestashop/:splat"
  status = 200
```

### 4️⃣ DESPLEGAR EN NETLIFY

**Opción A: Despliegue Automático (Recomendado)**
1. Asegúrate de que el archivo está commiteado:
   ```bash
   git add netlify/functions/prestashop.js netlify.toml
   git commit -m "Añadir función Netlify prestashop"
   git push
   ```
2. Netlify detectará automáticamente el push
3. Espera 2-3 minutos a que complete el build
4. Verifica en: https://app.netlify.com/sites/stalwart-panda-77e3cb/deploys

**Opción B: Despliegue Manual desde Dashboard**
1. Ve a: https://app.netlify.com/sites/stalwart-panda-77e3cb/functions
2. Si ves la función `prestashop`, está desplegada
3. Si NO ves la función:
   - Ve a Deploys
   - Haz clic en "Trigger deploy" → "Deploy site"
   - O espera a que Netlify detecte el push automático

### 5️⃣ VERIFICAR QUE FUNCIONA

Una vez desplegado, prueba directamente:
```bash
curl -X POST https://stalwart-panda-77e3cb.netlify.app/.netlify/functions/prestashop/products/1?language=1&output_format=JSON \
  -H "Content-Type: application/json" \
  -d '{"apiUrl":"https://100x100chef.com/shop","apiKey":"TU_API_KEY"}'
```

Si funciona, deberías ver una respuesta JSON con datos del producto.

## 🔍 DIAGNÓSTICO

Si después de desplegar sigue dando 404:

1. **Verifica los logs del deploy:**
   - https://app.netlify.com/sites/stalwart-panda-77e3cb/deploys
   - Busca errores en el build

2. **Verifica que la función aparece:**
   - https://app.netlify.com/sites/stalwart-panda-77e3cb/functions
   - Debe aparecer `prestashop` en la lista

3. **Revisa los logs de la función:**
   - Functions → prestashop → Logs
   - Si no hay logs, la función no se está ejecutando

4. **Verifica el build:**
   - En el deploy, verifica que aparece "Functions" en el proceso
   - Busca mensajes como "Packaging functions" o "Creating serverless functions"

## 📋 CHECKLIST

- [ ] Archivo `netlify/functions/prestashop.js` existe
- [ ] Archivo está commiteado en Git
- [ ] `netlify.toml` está configurado correctamente
- [ ] Push a GitHub completado
- [ ] Netlify ha completado el deploy (2-3 minutos)
- [ ] Función aparece en Netlify Dashboard → Functions
- [ ] Prueba directa con curl funciona

## 🆘 SI NADA FUNCIONA

1. Verifica que tu sitio en Netlify está conectado a GitHub
2. Verifica que el build está configurado correctamente
3. Verifica que no hay errores en el build de Netlify
4. Intenta un redeploy manual desde el dashboard


