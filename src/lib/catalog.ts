// src/lib/catalog.ts
export interface Product {
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

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const defaultCategories: ProductCategory[] = [
  { id: 'maquinaria', name: 'Maquinaria Cocina y Mixología', description: 'Equipos profesionales de cocina', isActive: true },
  { id: 'herramientas', name: 'Herramientas Cocina y Coctelería', description: 'Herramientas especializadas', isActive: true },
  { id: 'tecnicas', name: 'Técnicas Cocina y Mixología', description: 'Técnicas culinarias avanzadas', isActive: true },
  { id: 'servicio', name: 'Servicio de Mesa', description: 'Cristalería y servicio', isActive: true },
];

export const defaultProducts: Product[] = [
  {
    id: 'pacojet-4',
    name: 'Pacojet 4',
    category: 'maquinaria',
    price: 2800,
    description: 'Máquina profesional para texturas perfectas. Ideal para helados, sorbetes y cremas.',
    sku: 'PACO-4-001',
    imageUrl: 'https://100x100chef.com/images/pacojet-4.jpg',
    productUrl: 'https://100x100chef.com/productos/pacojet-4',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'girovap-destiladora',
    name: 'Girovap Destiladora',
    category: 'maquinaria',
    price: 2500,
    description: 'Destilación al vacío profesional. Perfecta para extracciones y concentrados.',
    sku: 'GIRO-001',
    imageUrl: 'https://100x100chef.com/images/girovap.jpg',
    productUrl: 'https://100x100chef.com/productos/girovap',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'conchadora-twin-stones',
    name: 'Conchadora Twin Stones',
    category: 'maquinaria',
    price: 1500,
    description: 'Refinado de chocolate artesanal. Piedras de granito para textura perfecta.',
    sku: 'TWIN-001',
    imageUrl: 'https://100x100chef.com/images/twin-stones.jpg',
    productUrl: 'https://100x100chef.com/productos/twin-stones',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'centrifugadora-profesional',
    name: 'Centrifugadora Profesional',
    category: 'maquinaria',
    price: 1200,
    description: 'Clarificación molecular profesional. Ideal para caldos y jugos clarificados.',
    sku: 'CENT-001',
    imageUrl: 'https://100x100chef.com/images/centrifugadora.jpg',
    productUrl: 'https://100x100chef.com/productos/centrifugadora',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'coccion-vacio-roner',
    name: 'Cocción al Vacío Roner',
    category: 'maquinaria',
    price: 800,
    description: 'Cocina sous vide profesional. Control de temperatura preciso.',
    sku: 'RONER-001',
    imageUrl: 'https://100x100chef.com/images/roner.jpg',
    productUrl: 'https://100x100chef.com/productos/roner',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'liofilizadora-profesional',
    name: 'Liofilizadora Profesional',
    category: 'maquinaria',
    price: 3000,
    description: 'Conservación molecular avanzada. Deshidratación por congelación.',
    sku: 'LIO-001',
    imageUrl: 'https://100x100chef.com/images/liofilizadora.jpg',
    productUrl: 'https://100x100chef.com/productos/liofilizadora',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Función para generar prompt con catálogo dinámico
export const generateCatalogPrompt = (products: Product[], categories: ProductCategory[]): string => {
  const activeProducts = products.filter(p => p.isActive);
  const activeCategories = categories.filter(c => c.isActive);
  
  let catalogText = 'CATÁLOGO DE PRODUCTOS DISPONIBLES:\n\n';
  
  activeCategories.forEach(category => {
    const categoryProducts = activeProducts.filter(p => p.category === category.id);
    if (categoryProducts.length > 0) {
      catalogText += `${category.name.toUpperCase()}:\n`;
      categoryProducts.forEach(product => {
        catalogText += `- ${product.name} (${product.price}€) - ${product.description}\n`;
      });
      catalogText += '\n';
    }
  });
  
  return catalogText;
};

// Función para formatear producto para respuesta del AI
export const formatProductForAI = (product: Product): string => {
  return `**${product.name}** - ${product.price}€
${product.description}
Categoría: ${product.category}
SKU: ${product.sku}`;
};
