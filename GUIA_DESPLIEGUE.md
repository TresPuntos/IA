# 🚀 GUÍA COMPLETA PARA DESPLEGAR EDGE FUNCTION

## ✅ **PASO 1 COMPLETADO:**
- ✅ Supabase CLI instalado (versión 2.51.0)

## 🔐 **PASO 2: LOGIN EN SUPABASE**

### **Opción A: Login Manual (Recomendado)**
1. **Abrir terminal nueva** (para tener PATH actualizado)
2. **Ejecutar:** `supabase login`
3. **Se abrirá el navegador** automáticamente
4. **Hacer login** en tu cuenta de Supabase
5. **Autorizar** la aplicación CLI

### **Opción B: Token Manual**
1. **Ir a:** https://supabase.com/dashboard/account/tokens
2. **Crear nuevo token** con permisos de proyecto
3. **Copiar el token**
4. **Ejecutar:** `supabase login --token TU_TOKEN_AQUI`

## 🔗 **PASO 3: LINK AL PROYECTO**
```bash
supabase link --project-ref akwobmrcwqbbrdvzyiul
```

## 🚀 **PASO 4: DESPLEGAR EDGE FUNCTION**
```bash
supabase functions deploy openai-chat
```

## 🔑 **PASO 5: CONFIGURAR API KEY**

### **En Supabase Dashboard:**
1. **Ir a:** https://supabase.com/dashboard/project/akwobmrcwqbbrdvzyiul/settings/functions
2. **Sección:** Environment Variables
3. **Añadir variable:**
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-tu-api-key-real-de-openai`

## 🧪 **PASO 6: PROBAR**

### **Opción A: Desde el Dashboard**
1. **Ir a:** https://stalwart-panda-77e3cb.netlify.app/
2. **Hacer clic en "Probar Chat"**
3. **Verificar respuesta de OpenAI**

### **Opción B: Script de Prueba**
```bash
node test-edge-function-direct.js
```

## 📋 **COMANDOS COMPLETOS:**

```bash
# 1. Login (abrirá navegador)
supabase login

# 2. Link al proyecto
supabase link --project-ref akwobmrcwqbbrdvzyiul

# 3. Desplegar función
supabase functions deploy openai-chat

# 4. Verificar despliegue
supabase functions list
```

## ⚠️ **POSIBLES PROBLEMAS:**

### **Error de Login:**
- **Solución:** Abrir terminal nueva y ejecutar `supabase login`
- **Alternativa:** Usar token manual

### **Error de Link:**
- **Verificar:** Que el project-ref sea correcto
- **Comando:** `supabase projects list`

### **Error de Deploy:**
- **Verificar:** Que estés en el directorio correcto
- **Comando:** `ls supabase/functions/`

## 🎯 **RESULTADO ESPERADO:**

Una vez completado:
- ✅ **Edge Function desplegada**
- ✅ **API Key configurada**
- ✅ **Chat funcionando con OpenAI**
- ✅ **Respuestas inteligentes y contextuales**

## 📞 **SI NECESITAS AYUDA:**

1. **Ejecutar cada comando paso a paso**
2. **Copiar y pegar errores exactos**
3. **Verificar que estés en el directorio correcto**
4. **Reiniciar terminal si hay problemas de PATH**
