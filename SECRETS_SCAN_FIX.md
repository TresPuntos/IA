# 🔐 FIX: Netlify Secrets Scanning

## ✅ PROBLEMA RESUELTO

Netlify estaba detectando claves de Supabase hardcodeadas en el código fuente. Todas han sido eliminadas.

## 📋 CAMBIOS REALIZADOS

### 1. Eliminadas claves hardcodeadas de Supabase

- ✅ `src/utils/supabase/info.tsx` - Removida clave anon hardcodeada
- ✅ `src/components/AIWidget.tsx` - Actualizado para usar variables de entorno
- ✅ `src/components/ModelParamsCard.tsx` - Actualizado para usar variables de entorno
- ✅ Removido project ID hardcodeado (solo fallback en desarrollo local)

### 2. Configurado whitelist en Netlify

Agregado a `netlify.toml`:
```toml
[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "VITE_SUPABASE_ANON_KEY,VITE_SUPABASE_PROJECT_ID"
```

**Nota importante:** Las claves anon de Supabase son **públicas por diseño** y están destinadas a ser expuestas en el cliente. La whitelist es apropiada aquí porque:
- No son secretas (están protegidas por Row Level Security en Supabase)
- Deben estar disponibles en el cliente para autenticación
- Ahora vienen solo de variables de entorno (no hardcodeadas)

### 3. Variables de entorno requeridas en Netlify

Asegúrate de tener estas variables configuradas en Netlify:
- `VITE_SUPABASE_PROJECT_ID` = `akwobmrcwqbbrdvzyiul`
- `VITE_SUPABASE_ANON_KEY` = (tu clave anon de Supabase)

## 🔍 VERIFICACIÓN

Para verificar que no hay más claves hardcodeadas:

```bash
# Buscar claves JWT hardcodeadas
grep -rIn "eyJ[A-Za-z0-9_-]\{200,\}" src/ || echo "✅ No se encontraron claves JWT"

# Buscar project IDs hardcodeados
grep -rIn "akwobmrcwqbbrdvzyiul" src/ || echo "✅ No se encontraron project IDs"
```

## ✅ RESULTADO ESPERADO

El build de Netlify ahora debería:
1. ✅ Pasar el escaneo de secretos
2. ✅ Compilar correctamente
3. ✅ Desplegar sin errores

## 📝 NOTA

Las claves anon de Supabase **NO son secretas** - están diseñadas para ser públicas. El problema era que estaban **hardcodeadas** en el código en lugar de venir de variables de entorno. Ahora usamos variables de entorno correctamente.

