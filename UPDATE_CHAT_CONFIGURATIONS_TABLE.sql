-- Actualizar tabla chat_configurations para incluir los nuevos campos de prompts
ALTER TABLE chat_configurations 
ADD COLUMN IF NOT EXISTS product_prompt TEXT DEFAULT 'Cuando el cliente pregunte sobre productos específicos, busca en el catálogo y proporciona información detallada incluyendo precio, descripción y disponibilidad.',
ADD COLUMN IF NOT EXISTS support_prompt TEXT DEFAULT 'Para consultas técnicas o problemas, consulta la documentación disponible y proporciona soluciones paso a paso.',
ADD COLUMN IF NOT EXISTS sales_prompt TEXT DEFAULT 'Para ayudar con ventas, destaca las características principales de los productos y guía al cliente hacia la compra de manera natural.',
ADD COLUMN IF NOT EXISTS style_instructions TEXT DEFAULT 'Usa un español neutro y profesional. Mantén las respuestas concisas pero informativas.';

-- Actualizar la configuración por defecto existente
UPDATE chat_configurations 
SET 
  product_prompt = 'Cuando el cliente pregunte sobre productos específicos, busca en el catálogo y proporciona información detallada incluyendo precio, descripción y disponibilidad.',
  support_prompt = 'Para consultas técnicas o problemas, consulta la documentación disponible y proporciona soluciones paso a paso.',
  sales_prompt = 'Para ayudar con ventas, destaca las características principales de los productos y guía al cliente hacia la compra de manera natural.',
  style_instructions = 'Usa un español neutro y profesional. Mantén las respuestas concisas pero informativas.'
WHERE site_id = 'default';
