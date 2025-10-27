// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { CSVUploader } from "../components/CSVUploader";
import { EcommerceConnections } from "../components/EcommerceConnections";
import { ProductStats } from "../components/ProductStats";
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
  const [ecommerceConnections, setEcommerceConnections] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<Date | undefined>();
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | 'pending' | 'idle'>('idle');

  // Cargar datos desde localStorage y Supabase - SOLO UNA VEZ
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        // Cargar datos de localStorage
        const savedCsvFiles = localStorage.getItem('catalog-csv-files');
        const savedConnections = localStorage.getItem('catalog-ecommerce-connections');
        const savedLastSync = localStorage.getItem('catalog-last-sync');

        if (savedCsvFiles && isMounted) {
          setCsvFiles(JSON.parse(savedCsvFiles));
        }
        if (savedConnections && isMounted) {
          setEcommerceConnections(JSON.parse(savedConnections));
        }
        if (savedLastSync && isMounted) {
          setLastSync(new Date(savedLastSync));
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
      console.log('- Conexiones ecommerce:', ecommerceConnections.length);
      
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
  }, [products, csvFiles, ecommerceConnections]);
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

        // Actualizar estado de sincronización
        setLastSync(new Date());
        setSyncStatus('success');
        localStorage.setItem('catalog-last-sync', new Date().toISOString());
        
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
    setEcommerceConnections([]);
    setLastSync(undefined);
    setSyncStatus('idle');
    
    console.log('✅ Limpieza completa realizada');
    toast.success('✅ Limpieza completa realizada - Revisa la consola para ver los números');
  };

  const handleConnectionUpdate = (connection: any) => {
    const updatedConnections = ecommerceConnections.map(c => 
      c.id === connection.id ? connection : c
    );
    
    // Si es una nueva conexión, añadirla
    if (!ecommerceConnections.find(c => c.id === connection.id)) {
      updatedConnections.push(connection);
    }
    
    setEcommerceConnections(updatedConnections);
    localStorage.setItem('catalog-ecommerce-connections', JSON.stringify(updatedConnections));

    // Simular sincronización
    if (connection.isConnected) {
      setSyncStatus('pending');
      setTimeout(() => {
        setSyncStatus('success');
        setLastSync(new Date());
        localStorage.setItem('catalog-last-sync', new Date().toISOString());
      }, 2000);
    }
  };

  const activeProducts = products.filter(p => p.isActive).length;
  const connectedEcommerce = ecommerceConnections.filter(c => c.isConnected).length;

  // Calcular productos por fuente
  const csvProducts = products.filter(p => p.source === 'csv');
  const ecommerceProducts = products.filter(p => p.source === 'prestashop' || p.source === 'woocommerce' || p.source === 'shopify');

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
            <div className="text-2xl font-bold">{ecommerceProducts.length}</div>
            <div className="text-sm text-muted-foreground">Productos Ecommerce</div>
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

      {/* Conexiones Ecommerce */}
      <Card>
        <CardHeader>
          <CardTitle>2. Conectar Ecommerce</CardTitle>
          <CardDescription>
            Conecta tu tienda online para sincronizar productos automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EcommerceConnections onConnectionUpdate={handleConnectionUpdate} />
        </CardContent>
      </Card>

      {/* Lista de productos */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Productos del Catálogo</CardTitle>
            <CardDescription>
              Productos importados: {csvProducts.length} desde CSV, {ecommerceProducts.length} desde Ecommerce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.slice(0, 20).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {product.source === 'csv' && '📄 CSV'}
                        {product.source === 'prestashop' && '🛍️ PrestaShop'}
                        {product.source === 'woocommerce' && '🛒 WooCommerce'}
                        {product.source === 'shopify' && '🏪 Shopify'}
                        {!product.source && '📝 Manual'}
                      </Badge>
                      {!product.isActive && (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.category && `${product.category} • `}
                      Precio: ${product.price} • Stock: {product.stock_quantity}
                    </p>
                  </div>
                </div>
              ))}
              {products.length > 20 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ... y {products.length - 20} productos más
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}