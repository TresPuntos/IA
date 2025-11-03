// Configuración de Supabase usando variables de entorno
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "akwobmrcwqbbrdvzyiul"
// La clave anon debe venir de variables de entorno - no hardcodear aquí
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""