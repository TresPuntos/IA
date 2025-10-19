// src/lib/CatalogContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductCategory, defaultProducts, defaultCategories } from './catalog';

interface CatalogContextType {
  products: Product[];
  categories: ProductCategory[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryActive: (id: string) => void;
  isLoading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

interface CatalogProviderProps {
  children: ReactNode;
}

export const CatalogProvider: React.FC<CatalogProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar catálogo desde localStorage al inicio
  useEffect(() => {
    const loadCatalog = () => {
      try {
        const savedProducts = localStorage.getItem('catalog-products');
        const savedCategories = localStorage.getItem('catalog-categories');
        
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
        
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
      } catch (error) {
        console.error('Error loading catalog:', error);
      }
    };

    loadCatalog();
  }, []);

  // Guardar catálogo en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('catalog-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('catalog-categories', JSON.stringify(categories));
  }, [categories]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, isActive: !product.isActive, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const addCategory = (categoryData: Omit<ProductCategory, 'id'>) => {
    const newCategory: ProductCategory = {
      ...categoryData,
      id: `category-${Date.now()}`
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const toggleCategoryActive = (id: string) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, isActive: !category.isActive } : category
    ));
  };

  return (
    <CatalogContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductActive,
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryActive,
      isLoading
    }}>
      {children}
    </CatalogContext.Provider>
  );
};
