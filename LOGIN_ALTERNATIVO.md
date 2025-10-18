# 🔐 ALTERNATIVA: LOGIN CON TOKEN

## **PROBLEMA:**
El login automático no funciona en este entorno.

## **SOLUCIÓN: USAR TOKEN MANUAL**

### **PASO 1: OBTENER TOKEN**
1. **Ir a:** https://supabase.com/dashboard/account/tokens
2. **Hacer clic en "Generate new token"**
3. **Nombre:** "CLI Token"
4. **Copiar el token generado**

### **PASO 2: CONFIGURAR TOKEN**
```bash
export SUPABASE_ACCESS_TOKEN=tu_token_aqui
```

### **PASO 3: VERIFICAR LOGIN**
```bash
supabase projects list
```

### **PASO 4: CONTINUAR CON DESPLIEGUE**
```bash
supabase link --project-ref akwobmrcwqbbrdvzyiul
supabase functions deploy openai-chat
```

## **ALTERNATIVA MÁS SIMPLE:**

### **OPCIÓN A: USAR NAVEGADOR**
1. **Abrir terminal nueva** (no esta sesión)
2. **Ejecutar:** `supabase login`
3. **Se abrirá navegador automáticamente**
4. **Hacer login y autorizar**

### **OPCIÓN B: CONFIGURAR TOKEN EN ARCHIVO**
Crear archivo `~/.supabase/access-token` con tu token.

## **¿QUÉ PREFIERES?**

1. **Token manual** (más rápido)
2. **Terminal nueva** (más fácil)
3. **Continuar con error** (para debuggear)
