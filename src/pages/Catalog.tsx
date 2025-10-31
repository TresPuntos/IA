// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { CSVUploader } from "../components/CSVUploader";
import { SimplePrestashopConnection } from "../components/SimplePrestashopConnection";
import { useCatalog } from "../lib/CatalogContext";
import { Product, ProductCategory } from "../lib/catalog";
import { clearCSVProducts, clearWooCommerceProducts, clearCatalog, clearAllProducts, clearAllUpdateHistory, saveCSVProducts, loadProductsFromSupabase } from "../lib/productCatalog";
import { toast } from "sonner";

export function Catalog() {
  const { 
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
    clearAllProducts,
    clearAllCategories
  } = useCatalog();

  const [csvFiles, setCsvFiles] = useState<any[]>([]);

  // Cargar datos desde localStorage y Supabase - SOLO UNA VEZ
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        // Cargar datos de localStorage
        const savedCsvFiles = localStorage.getItem('catalog-csv-files');

        if (savedCsvFiles && isMounted) {
          setCsvFiles(JSON.parse(savedCsvFiles));
        }

        // Cargar productos desde Supabase SOLO si no hay productos ya cargados
        if (products.length === 0 && isMounted) {
          console.log('🔄 Cargando productos desde Supabase...');
          const loadResult = await loadProductsFromSupabase();
          
          if (loadResult.success && loadResult.products && isMounted) {
            console.log('✅ Productos cargados desde Supabase:', loadResult.products.length);
            
            // Limpiar productos locales y cargar desde Supabase
            clearAllProducts();
            
            // Convertir productos de Supabase al formato del CatalogContext
            loadResult.products.forEach(product => {
              if (isMounted) {
                addProduct({
                  name: product.name,
                  price: product.price,
                  description: product.description || '',
                  category: product.category || '',
                  sku: product.sku || '',
                  stock_quantity: product.stock_quantity || 0,
                  image_url: product.image_url || '',
                  isActive: product.status === 'active',
                  source: product.source as any
                });
              }
            });
            
            console.log('✅ Productos sincronizados con CatalogContext');
          } else if (!loadResult.success && isMounted) {
            console.error('❌ Error al cargar productos desde Supabase:', loadResult.error);
          }
        }
      } catch (error) {
        console.error('❌ Error en loadData:', error);
      }
    };

    loadData();
    
    // Cleanup function para evitar actualizaciones en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, []); // SIN DEPENDENCIAS - Solo se ejecuta una vez

  // Debug: Mostrar información de productos al cargar - CON DEBOUNCE
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔍 DEBUG - Estado actual del catálogo:');
      console.log('- Total productos en CatalogContext:', products.length);
      console.log('- Productos CSV:', products.filter(p => p.id.startsWith('csv-product-')).length);
      console.log('- Productos manuales:', products.filter(p => !p.id.startsWith('csv-product-')).length);
      console.log('- Archivos CSV:', csvFiles.length);
      
      // Mostrar algunos productos de ejemplo
      if (products.length > 0) {
        console.log('- Primeros 5 productos:', products.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          source: p.id.startsWith('csv-product-') ? 'CSV' : 'Manual'
        })));
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [products, csvFiles]);
  // useEffect(() => {
  //   const performAutoCleanup = () => {
  //     console.log('🗑️ Ejecutando limpieza automática...');
      
  //     try {
  //       // 1. Limpiar CatalogContext (localStorage) primero
  //       clearAllProducts();
  //       clearAllCategories();

  //       // 2. Limpiar localStorage adicional
  //       localStorage.removeItem('catalog-csv-files');
  //       localStorage.removeItem('catalog-ecommerce-connections');
  //       localStorage.removeItem('catalog-last-sync');

  //       // 3. Limpiar estado local
  //       setCsvFiles([]);
  //       setEcommerceConnections([]);
  //       setLastSync(undefined);
  //       setSyncStatus('idle');

  //       console.log('✅ Limpieza automática completada');
  //       toast.success('✅ Catálogo limpiado completamente - Listo para empezar de cero');
        
  //     } catch (error) {
  //       console.error('❌ Error en limpieza automática:', error);
  //       toast.error('❌ Error durante la limpieza automática');
  //     }
  //   };

  //   // Ejecutar limpieza automática
  //   performAutoCleanup();
  // }, [clearAllProducts, clearAllCategories]);

  const handleCSVUploaded = async (file: any, products: Product[]) => {
    console.log('📥 handleCSVUploaded llamado con:', products.length, 'productos');
    console.log('📊 Estado actual del catálogo ANTES de añadir:', products.length, 'productos');
    
    try {
      // LIMPIAR TODO ANTES DE AÑADIR NUEVOS PRODUCTOS
      console.log('🗑️ Limpiando catálogo antes de añadir nuevos productos...');
      
      // Limpiar productos CSV de Supabase
      const clearResult = await clearCSVProducts();
      if (clearResult.success) {
        console.log('✅ Productos CSV eliminados de Supabase:', clearResult.deletedCount);
      } else {
        console.error('❌ Error al limpiar productos CSV:', clearResult.error);
      }
      
      // Limpiar CatalogContext (localStorage)
      clearAllProducts();
      clearAllCategories();
      
      console.log('📊 Estado actual del catálogo DESPUÉS de limpiar:', products.length, 'productos');
      
      // Guardar productos en Supabase
      console.log('💾 Guardando productos en Supabase...');
      const saveResult = await saveCSVProducts(products);
      
      if (saveResult.success) {
        console.log('✅ Productos guardados en Supabase:', saveResult.savedCount);
        toast.success(`✅ ${saveResult.savedCount} productos guardados correctamente en la base de datos`);
        
        // Añadir productos al CatalogContext (localStorage) para la UI
        products.forEach((product, index) => {
          if (index < 5) { // Solo log los primeros 5 para no saturar
            console.log(`➕ Añadiendo producto ${index + 1} al contexto local:`, product.name);
          }
          addProduct(product);
        });
        
        console.log('📊 Estado actual del catálogo DESPUÉS de añadir:', products.length, 'productos');

        // Actualizar lista de archivos CSV
        const updatedFiles = [...csvFiles, file];
        setCsvFiles(updatedFiles);
        localStorage.setItem('catalog-csv-files', JSON.stringify(updatedFiles));

        
      } else {
        console.error('❌ Error al guardar productos en Supabase:', saveResult.error);
        toast.error(`❌ Error al guardar productos: ${saveResult.error}`);
      }
      
    } catch (error) {
      console.error('❌ Error inesperado en handleCSVUploaded:', error);
      toast.error('❌ Error inesperado al procesar productos');
    }
  };

  const handleCSVDeleted = (fileId: string) => {
    // Eliminar productos del CSV del catálogo
    const productsToDelete = products.filter(product => product.id.startsWith(`csv-product-${fileId}`));
    productsToDelete.forEach(product => {
      deleteProduct(product.id);
    });

    // Actualizar lista de archivos CSV
    const updatedFiles = csvFiles.filter(f => f.id !== fileId);
    setCsvFiles(updatedFiles);
    localStorage.setItem('catalog-csv-files', JSON.stringify(updatedFiles));
    
    console.log(`🗑️ Eliminados ${productsToDelete.length} productos del CSV ${fileId}`);
  };

  const handleDeleteCSVProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos CSV? Esto limpiará el catálogo para una nueva importación.')) {
      return;
    }

    try {
      // Eliminar todos los productos CSV del catálogo
      const csvProducts = products.filter(product => product.id.startsWith('csv-product-'));
      csvProducts.forEach(product => {
        deleteProduct(product.id);
      });

      // Limpiar lista de archivos CSV
      setCsvFiles([]);
      localStorage.removeItem('catalog-csv-files');

      console.log(`🗑️ Eliminados ${csvProducts.length} productos CSV del catálogo`);
      toast.success(`✅ ${csvProducts.length} productos CSV eliminados. El catálogo está listo para una nueva importación.`);
      
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  // Función para limpiar completamente y mostrar debug
  const handleDebugCleanup = () => {
    console.log('🔍 DEBUG - Antes de limpiar:');
    console.log('- Productos en CatalogContext:', products.length);
    console.log('- Productos en localStorage:', localStorage.getItem('catalog-products') ? JSON.parse(localStorage.getItem('catalog-products')!).length : 0);
    
    // Limpiar todo
    clearAllProducts();
    clearAllCategories();
    localStorage.removeItem('catalog-csv-files');
    localStorage.removeItem('catalog-ecommerce-connections');
    localStorage.removeItem('catalog-last-sync');
    
    setCsvFiles([]);
    
    console.log('✅ Limpieza completa realizada');
    toast.success('✅ Limpieza completa realizada - Revisa la consola para ver los números');
  };

  // Calcular productos por fuente
  const csvProducts = products.filter(p => p.source === 'csv');
  const prestashopProducts = products.filter(p => p.source === 'prestashop');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Catálogo de Productos</h1>
        <p className="text-muted-foreground">
          Gestiona tu catálogo de productos desde CSV y conexiones ecommerce
        </p>
      </div>

      {/* Estadísticas simplificadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total Productos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{csvProducts.length}</div>
            <div className="text-sm text-muted-foreground">Productos CSV</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{prestashopProducts.length}</div>
            <div className="text-sm text-muted-foreground">Productos PrestaShop</div>
          </CardContent>
        </Card>
      </div>

      {/* Subir CSV */}
      <Card>
        <CardHeader>
          <CardTitle>1. Subir Catálogo CSV</CardTitle>
          <CardDescription>
            Importa tus productos desde un archivo CSV con las columnas: name, price, category, description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CSVUploader
            onFileUploaded={handleCSVUploaded}
            onFileDeleted={handleCSVDeleted}
          />
        </CardContent>
      </Card>

      {/* Conexión PrestaShop - Todo en un solo componente Card */}
      <SimplePrestashopConnection 
        onImportComplete={(count) => {
          toast.success(`✅ ${count} productos importados desde PrestaShop`);
          // Recargar página para actualizar estadísticas
          setTimeout(() => window.location.reload(), 1000);
        }} 
      />
    </div>
  );
}