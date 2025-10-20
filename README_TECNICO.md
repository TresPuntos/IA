# 🤖 AI Chat Config Dashboard

Sistema de configuración y gestión de chat con IA para múltiples clientes de ecommerce.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Requisitos

- Node.js 18+
- Cuenta Supabase
- API Key OpenAI
- Acceso a tiendas ecommerce (opcional)

## ⚙️ Configuración

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
```

### Supabase Setup
1. Crear proyecto en Supabase
2. Ejecutar migraciones SQL:
```sql
-- Ver DOCUMENTACION_COMPLETA.md para migraciones completas
CREATE TABLE chat_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  client_url TEXT,
  system_prompts JSONB,
  -- ... más campos
);
```

## 🏗️ Arquitectura

```
Frontend (React) → Supabase → OpenAI
     ↓
localStorage (catálogo)
     ↓
CSV/Ecommerce APIs
```

## 📁 Estructura Principal

```
src/
├── components/          # Componentes UI
├── lib/               # Lógica de negocio
│   ├── config.ts      # Configuración por defecto
│   ├── ConfigContext.tsx # Estado global config
│   ├── CatalogContext.tsx # Estado global catálogo
│   └── supabaseChat.ts # Comunicación AI
├── pages/             # Páginas principales
└── utils/             # Utilidades
```

## 🔧 Componentes Clave

### ConfigContext
Maneja configuración de prompts y parámetros AI:
```typescript
const { config, updateConfig, saveConfiguration } = useConfig();
```

### CatalogContext
Gestiona catálogo de productos:
```typescript
const { products, addProduct, updateProduct } = useCatalog();
```

### CSVUploader
Upload de archivos CSV con drag & drop:
```typescript
<CSVUploader 
  onFileUploaded={handleCSVUploaded}
  onFileDeleted={handleCSVDeleted}
/>
```

## 🛒 Conexiones Ecommerce

### WooCommerce
```typescript
// Configurar en WooCommerce > Configuración > REST API
const connection = {
  platform: 'woocommerce',
  url: 'https://mitienda.com',
  apiKey: 'ck_xxxxxxxx',
  apiSecret: 'cs_xxxxxxxx'
};
```

### PrestaShop
```typescript
// Configurar en PrestaShop > Web Service
const connection = {
  platform: 'prestashop',
  url: 'https://mitienda.com',
  apiKey: 'xxxxxxxx'
};
```

### Shopify
```typescript
// Crear aplicación privada en Shopify
const connection = {
  platform: 'shopify',
  url: 'https://mitienda.myshopify.com',
  apiKey: 'xxxxxxxx',
  apiSecret: 'xxxxxxxx'
};
```

## 🤖 Integración AI

### Flujo de Chat
1. Usuario escribe mensaje
2. Sistema carga configuración del usuario
3. Genera prompt basado en tono seleccionado
4. Añade catálogo dinámico
5. Envía a OpenAI vía Supabase Edge Function
6. Procesa respuesta y extrae productos
7. Muestra mensaje mejorado

### Edge Function
```typescript
// supabase/functions/openai-chat/index.ts
export default async function handler(req: Request) {
  const { message, systemPrompt, model, temperature } = await req.json();
  
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    temperature,
    max_tokens: 2048
  });
  
  return new Response(JSON.stringify({
    success: true,
    response: response.choices[0].message.content
  }));
}
```

## 📊 Gestión de Datos

### Persistencia
- **Supabase:** Configuración principal
- **localStorage:** Catálogo y archivos CSV
- **Sincronización:** Automática entre fuentes

### Estructura de Producto
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  sku: string;
  imageUrl?: string;
  productUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🧪 Testing

### Probar Chat
1. Ir a página Testing
2. Configurar prompts en Configuration
3. Probar diferentes tonos
4. Verificar memoria de conversación

### Probar Catálogo
1. Subir CSV de prueba
2. Conectar ecommerce (modo test)
3. Verificar sincronización
4. Probar respuestas con productos

## 🚀 Deployment

### Netlify
1. Conectar repositorio GitHub
2. Configurar build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Añadir variables de entorno

### Supabase
1. Deploy Edge Functions
2. Configurar variables de entorno
3. Ejecutar migraciones

## 🔍 Debugging

### Console Logs
```typescript
console.log('🔍 DEBUG:', variable);
console.error('❌ Error:', error);
console.log('✅ Success:', data);
```

### Problemas Comunes
- **Chat no responde:** Verificar Supabase y OpenAI
- **Config no se guarda:** Revisar permisos RLS
- **CSV no procesa:** Verificar formato y encoding
- **Conexión falla:** Comprobar credenciales API

## 📈 Roadmap

- [ ] Más plataformas ecommerce
- [ ] Sincronización programada
- [ ] Analytics avanzados
- [ ] Templates de prompts
- [ ] API pública

## 📚 Documentación Completa

Ver `DOCUMENTACION_COMPLETA.md` para información detallada sobre:
- Arquitectura completa
- Componentes detallados
- Guías de desarrollo
- Troubleshooting avanzado
- Roadmap completo

---

**¡Listo para desarrollar! 🚀**
