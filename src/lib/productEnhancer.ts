// src/lib/productEnhancer.ts
export interface ProductInfo {
  name: string;
  price?: string;
  sku?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  productUrl?: string;
}

export interface EnhancedResponse {
  originalText: string;
  enhancedHtml: string;
  products: ProductInfo[];
}

// Función para detectar productos en la respuesta del AI
export const detectProducts = (text: string): ProductInfo[] => {
  const products: ProductInfo[] = [];
  
  // Patrón para detectar productos con formato: **Nombre** - Precio€
  const productPattern = /\*\*(.*?)\*\*\s*-\s*([0-9,]+\.?[0-9]*€)/g;
  let match;
  
  while ((match = productPattern.exec(text)) !== null) {
    const name = match[1].trim();
    const price = match[2].trim();
    
    // Buscar SKU en el texto después del producto
    const skuMatch = text.match(new RegExp(`${name}[\\s\\S]*?SKU:\\s*([A-Z0-9-]+)`, 'i'));
    const sku = skuMatch ? skuMatch[1] : undefined;
    
    // Buscar categoría
    const categoryMatch = text.match(new RegExp(`${name}[\\s\\S]*?Categoría:\\s*([^\\n]+)`, 'i'));
    const category = categoryMatch ? categoryMatch[1].trim() : undefined;
    
    // Buscar descripción
    const descMatch = text.match(new RegExp(`${name}[\\s\\S]*?\\*\\*[\\s\\S]*?([^.]+)\\.`, 'i'));
    const description = descMatch ? descMatch[1].trim() : undefined;
    
    products.push({
      name,
      price,
      sku,
      category,
      description,
      imageUrl: generateImageUrl(name, sku),
      productUrl: generateProductUrl(name, sku)
    });
  }
  
  return products;
};

// Generar URL de imagen basada en nombre y SKU
const generateImageUrl = (name: string, sku?: string): string => {
  if (sku) {
    return `https://100x100chef.com/images/products/${sku.toLowerCase()}.jpg`;
  }
  
  // Fallback basado en nombre
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  return `https://100x100chef.com/images/products/${slug}.jpg`;
};

// Generar URL del producto
const generateProductUrl = (name: string, sku?: string): string => {
  if (sku) {
    return `https://100x100chef.com/productos/${sku.toLowerCase()}`;
  }
  
  // Fallback basado en nombre
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  return `https://100x100chef.com/productos/${slug}`;
};

// Función principal para mejorar la respuesta
export const enhanceResponse = (text: string): EnhancedResponse => {
  const products = detectProducts(text);
  
  if (products.length === 0) {
    return {
      originalText: text,
      enhancedHtml: text,
      products: []
    };
  }
  
  // Crear HTML mejorado con cards de productos
  let enhancedHtml = text;
  
  products.forEach((product, index) => {
    const productCard = createProductCard(product);
    
    // Reemplazar el texto del producto con la card
    const productTextPattern = new RegExp(
      `\\*\\*${product.name}\\*\\*[\\s\\S]*?(?=\\*\\*|$)`,
      'g'
    );
    
    enhancedHtml = enhancedHtml.replace(productTextPattern, productCard);
  });
  
  return {
    originalText: text,
    enhancedHtml,
    products
  };
};

// Crear card HTML para un producto
const createProductCard = (product: ProductInfo): string => {
  return `
    <div class="product-card" style="
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin: 12px 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    ">
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="flex-shrink: 0;">
          <img 
            src="${product.imageUrl}" 
            alt="${product.name}"
            style="
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 8px;
              background: #f3f4f6;
            "
            onerror="this.src='https://100x100chef.com/images/placeholder.jpg'"
          />
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">
            ${product.name}
          </h3>
          ${product.price ? `
            <div style="font-size: 18px; font-weight: 700; color: #059669; margin-bottom: 8px;">
              ${product.price}
            </div>
          ` : ''}
          ${product.description ? `
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              ${product.description}
            </p>
          ` : ''}
          <div style="display: flex; gap: 12px; align-items: center; margin-top: 12px;">
            <a 
              href="${product.productUrl}" 
              target="_blank"
              style="
                background: #3b82f6;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s ease;
              "
              onmouseover="this.style.background='#2563eb'"
              onmouseout="this.style.background='#3b82f6'"
            >
              Ver Producto
            </a>
            ${product.sku ? `
              <span style="font-size: 12px; color: #9ca3af;">
                SKU: ${product.sku}
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
};
