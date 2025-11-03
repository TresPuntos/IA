// Cliente único de Supabase compartido para evitar múltiples instancias
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Cliente único compartido
export const supabase = createClient(supabaseUrl, publicAnonKey);

// Exportar también la URL y key por si se necesitan
export { projectId, publicAnonKey, supabaseUrl };


