# 🔒 GUÍA DE SEGURIDAD - API KEY OPENAI

## ⚠️ **ADVERTENCIA IMPORTANTE**

La configuración actual permite almacenar la API key de OpenAI en localStorage del navegador, lo cual **NO es seguro para producción**.

## 🚨 **RIESGOS DE SEGURIDAD**

### **localStorage (Método actual):**
- ❌ **Vulnerable a XSS attacks**
- ❌ **Accesible por scripts maliciosos**
- ❌ **Visible en DevTools del navegador**
- ❌ **No cifrado**
- ❌ **Extensiones del navegador pueden leerlo**

### **Exposición en Red:**
- ❌ **Headers HTTP visibles**
- ❌ **Logs de red pueden capturarla**
- ❌ **Proxy servers pueden interceptarla**

## ✅ **SOLUCIONES RECOMENDADAS**

### **1. Variables de Entorno (Desarrollo)**
```bash
# Crear archivo .env (NO subir a Git)
VITE_OPENAI_API_KEY=sk-tu-api-key-real

# Añadir .env a .gitignore
echo ".env" >> .gitignore
```

### **2. Supabase Edge Functions (Producción Recomendada)**
```typescript
// Crear función en Supabase Edge Functions
// /supabase/functions/openai-chat/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { message, systemPrompt } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    })
  })
  
  return new Response(JSON.stringify(await response.json()))
})
```

### **3. Backend Proxy (Alternativa)**
```typescript
// Crear endpoint en tu backend
app.post('/api/chat', async (req, res) => {
  const { message, systemPrompt } = req.body
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    })
  })
  
  res.json(await response.json())
})
```

## 🛠️ **IMPLEMENTACIÓN INMEDIATA**

### **Para Desarrollo Local:**
1. **Crear archivo `.env`:**
```bash
VITE_OPENAI_API_KEY=sk-tu-api-key-real
```

2. **Añadir a `.gitignore`:**
```bash
echo ".env" >> .gitignore
```

3. **Configurar en Netlify:**
   - Ve a Site Settings → Environment Variables
   - Añadir `VITE_OPENAI_API_KEY` con tu API key real

### **Para Producción:**
1. **Usar Supabase Edge Functions** (recomendado)
2. **O crear un backend proxy**
3. **Nunca exponer la API key en el frontend**

## 📋 **CHECKLIST DE SEGURIDAD**

- [ ] ✅ API key en variables de entorno
- [ ] ✅ Archivo .env en .gitignore
- [ ] ✅ Variables configuradas en Netlify
- [ ] ✅ No hardcodear API keys en el código
- [ ] ✅ Usar HTTPS en producción
- [ ] ✅ Implementar rate limiting
- [ ] ✅ Monitorear uso de API
- [ ] ✅ Rotar API keys periódicamente

## 🚨 **ACCIÓN INMEDIATA REQUERIDA**

**Para usar en producción, debes:**

1. **Configurar la variable de entorno** en Netlify
2. **Eliminar la funcionalidad de localStorage** del componente
3. **Implementar Supabase Edge Functions** para mayor seguridad

## 💡 **RECOMENDACIÓN FINAL**

**Para máxima seguridad:**
- Usa **Supabase Edge Functions** para manejar las llamadas a OpenAI
- La API key nunca sale del servidor
- Implementa **rate limiting** y **monitoreo**
- Usa **HTTPS** siempre en producción
