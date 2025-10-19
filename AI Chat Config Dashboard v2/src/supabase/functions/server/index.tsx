import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-86b0e188/health", (c) => {
  return c.json({ status: "ok" });
});

app.get('/make-server-86b0e188/', (c) => {
  return c.text('AI Chat Config API')
})

// Guardar configuración completa
app.post('/make-server-86b0e188/config/save', async (c) => {
  try {
    const body = await c.req.json()
    const { siteId, config } = body
    
    if (!siteId || !config) {
      return c.json({ error: 'siteId y config son requeridos' }, 400)
    }
    
    const key = `config:${siteId}`
    const configData = {
      ...config,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(key, JSON.stringify(configData))
    
    return c.json({ 
      success: true, 
      message: 'Configuración guardada exitosamente',
      siteId 
    })
  } catch (error) {
    console.error('Error guardando configuración:', error)
    return c.json({ error: 'Error al guardar la configuración', details: error.message }, 500)
  }
})

// Obtener configuración por siteId
app.get('/make-server-86b0e188/config/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    const key = `config:${siteId}`
    
    const config = await kv.get(key)
    
    if (!config) {
      return c.json({ error: 'Configuración no encontrada' }, 404)
    }
    
    return c.json({ 
      success: true, 
      config: JSON.parse(config),
      siteId 
    })
  } catch (error) {
    console.error('Error obteniendo configuración:', error)
    return c.json({ error: 'Error al obtener la configuración', details: error.message }, 500)
  }
})

// Listar todas las configuraciones
app.get('/make-server-86b0e188/config', async (c) => {
  try {
    const configs = await kv.getByPrefix('config:')
    
    const configList = configs.map(item => {
      const config = JSON.parse(item.value)
      return {
        siteId: item.key.replace('config:', ''),
        ...config
      }
    })
    
    return c.json({ 
      success: true, 
      configs: configList,
      count: configList.length
    })
  } catch (error) {
    console.error('Error listando configuraciones:', error)
    return c.json({ error: 'Error al listar configuraciones', details: error.message }, 500)
  }
})

// Duplicar configuración
app.post('/make-server-86b0e188/config/duplicate', async (c) => {
  try {
    const body = await c.req.json()
    const { sourceSiteId, newSiteId } = body
    
    if (!sourceSiteId || !newSiteId) {
      return c.json({ error: 'sourceSiteId y newSiteId son requeridos' }, 400)
    }
    
    const sourceKey = `config:${sourceSiteId}`
    const sourceConfig = await kv.get(sourceKey)
    
    if (!sourceConfig) {
      return c.json({ error: 'Configuración de origen no encontrada' }, 404)
    }
    
    const newKey = `config:${newSiteId}`
    const configData = JSON.parse(sourceConfig)
    configData.siteId = newSiteId
    configData.updatedAt = new Date().toISOString()
    
    await kv.set(newKey, JSON.stringify(configData))
    
    return c.json({ 
      success: true, 
      message: 'Configuración duplicada exitosamente',
      newSiteId 
    })
  } catch (error) {
    console.error('Error duplicando configuración:', error)
    return c.json({ error: 'Error al duplicar la configuración', details: error.message }, 500)
  }
})

// Eliminar configuración
app.delete('/make-server-86b0e188/config/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    const key = `config:${siteId}`
    
    await kv.del(key)
    
    return c.json({ 
      success: true, 
      message: 'Configuración eliminada exitosamente',
      siteId 
    })
  } catch (error) {
    console.error('Error eliminando configuración:', error)
    return c.json({ error: 'Error al eliminar la configuración', details: error.message }, 500)
  }
})

Deno.serve(app.fetch);