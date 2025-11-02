# 🔧 FIX: Credenciales de PrestaShop se borran al recargar

## ✅ CAMBIOS IMPLEMENTADOS

### 1. Nueva utilidad `prestashopStorage.ts`
- Manejo robusto de errores de localStorage
- Detección de localStorage no disponible
- Manejo de cuota excedida (limpieza automática)
- Logging detallado para debugging

### 2. Mejoras en `SimplePrestashopConnection.tsx`
- Uso de la nueva utilidad de almacenamiento
- Carga automática al montar el componente
- Carga cuando la ventana recupera el foco
- Carga con delay (por problemas de timing)
- Notificaciones cuando no se puede guardar

## 🔍 POSIBLES CAUSAS DEL PROBLEMA

### Causa 1: localStorage bloqueado o no disponible
**Síntoma:** Las credenciales no se guardan nunca
**Solución:** El código ahora detecta esto y muestra un error

### Causa 2: localStorage lleno
**Síntoma:** Las credenciales se borran al guardar otra cosa
**Solución:** El código intenta limpiar espacio automáticamente

### Causa 3: Modo privado/incógnito
**Síntoma:** localStorage funciona de forma limitada
**Solución:** El código detecta esto y muestra una advertencia

### Causa 4: Hot reload en desarrollo
**Síntoma:** Las credenciales se borran en desarrollo local
**Solución:** El código recarga las credenciales cuando la ventana recupera el foco

## 🧪 VERIFICACIÓN

Para verificar si el problema está resuelto:

1. **Abre la consola del navegador** (F12)
2. **Añade las credenciales** (URL y API Key)
3. **Verifica en la consola:**
   - Debe aparecer: `💾 URL guardada en localStorage`
   - Debe aparecer: `💾 API Key guardada en localStorage`
4. **Recarga la página** (F5)
5. **Verifica en la consola:**
   - Debe aparecer: `📥 Credenciales PrestaShop cargadas`
   - Debe aparecer: `✅ URL cargada: ...`
   - Debe aparecer: `✅ API Key cargada`

## 🔍 DEBUGGING

Si sigue sin funcionar, ejecuta esto en la consola:

```javascript
// Verificar si localStorage está disponible
console.log('localStorage disponible:', typeof Storage !== 'undefined' && typeof window.localStorage !== 'undefined');

// Verificar las credenciales guardadas
console.log('URL guardada:', localStorage.getItem('prestashop-url'));
console.log('API Key guardada:', localStorage.getItem('prestashop-api-key') ? 'SÍ (oculta)' : 'NO');
console.log('Conectado:', localStorage.getItem('prestashop-connected'));

// Verificar si hay espacio en localStorage
try {
  const test = '__test__';
  localStorage.setItem(test, test);
  localStorage.removeItem(test);
  console.log('✅ localStorage tiene espacio disponible');
} catch (e) {
  console.error('❌ localStorage lleno o bloqueado:', e);
}
```

## 📋 CHECKLIST

- [ ] Las credenciales se guardan cuando escribes (ver consola)
- [ ] Las credenciales persisten después de recargar
- [ ] No hay errores en la consola relacionados con localStorage
- [ ] Las notificaciones aparecen si hay problemas

## 🆘 SI SIGUE SIN FUNCIONAR

1. **Verifica en la consola** si hay errores relacionados con localStorage
2. **Verifica el modo del navegador** (no usar modo incógnito)
3. **Verifica las políticas del sitio** (algunos sitios bloquean localStorage)
4. **Prueba en otro navegador** para descartar problemas específicos del navegador

