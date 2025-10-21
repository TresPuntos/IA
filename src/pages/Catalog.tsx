// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CSVUploader } from "../components/CSVUploader";
import { EcommerceConnections } from "../components/EcommerceConnections";
import { ProductStats } from "../components/ProductStats";
import { useCatalog } from "../lib/CatalogContext";
import { Product, ProductCategory } from "../lib/catalog";
import { clearCSVProducts, clearWooCommerceProducts, clearCatalog, clearAllProducts, clearAllUpdateHistory } from "../lib/productCatalog";
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

  // Cargar datos desde localStorage
  useEffect(() => {
    const savedCsvFiles = localStorage.getItem('catalog-csv-files');
    const savedConnections = localStorage.getItem('catalog-ecommerce-connections');
    const savedLastSync = localStorage.getItem('catalog-last-sync');

    if (savedCsvFiles) {
      setCsvFiles(JSON.parse(savedCsvFiles));
    }
    if (savedConnections) {
      setEcommerceConnections(JSON.parse(savedConnections));
    }
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync));
    }
  // Debug: Mostrar información de productos al cargar
  useEffect(() => {
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

  const handleCSVUploaded = (file: any, products: Product[]) => {
    console.log('📥 handleCSVUploaded llamado con:', products.length, 'productos');
    console.log('📊 Estado actual del catálogo ANTES de añadir:', products.length, 'productos');
    
    // LIMPIAR TODO ANTES DE AÑADIR NUEVOS PRODUCTOS
    console.log('🗑️ Limpiando catálogo antes de añadir nuevos productos...');
    clearAllProducts();
    clearAllCategories();
    
    console.log('📊 Estado actual del catálogo DESPUÉS de limpiar:', products.length, 'productos');
    
    // Añadir productos del CSV al catálogo
    products.forEach((product, index) => {
      if (index < 5) { // Solo log los primeros 5 para no saturar
        console.log(`➕ Añadiendo producto ${index + 1}:`, product.name);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Gestión de Catálogo</h1>
        <p className="text-muted-foreground">
          Administra tu catálogo de productos desde múltiples fuentes: CSV, ecommerce y manual
        </p>
      </div>

      {/* Estadísticas generales */}
      <ProductStats
        totalProducts={products.length}
        activeProducts={activeProducts}
        csvFiles={csvFiles.length}
        ecommerceConnections={connectedEcommerce}
        lastSync={lastSync}
        syncStatus={syncStatus}
        onDeleteCSV={handleDeleteCSVProducts}
        onClearAll={handleDebugCleanup}
      />

      {/* Tabs para diferentes funcionalidades */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Subir CSV</TabsTrigger>
          <TabsTrigger value="ecommerce">Conexiones Ecommerce</TabsTrigger>
          <TabsTrigger value="manual">Gestión Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Catálogo desde CSV</CardTitle>
              <CardDescription>
                Sube archivos CSV con tu catálogo de productos. El archivo debe contener las columnas: name, price, category, description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader
                onFileUploaded={handleCSVUploaded}
                onFileDeleted={handleCSVDeleted}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <EcommerceConnections onConnectionUpdate={handleConnectionUpdate} />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión Manual de Productos</CardTitle>
              <CardDescription>
                Añade, edita o elimina productos manualmente. Estos productos se sincronizarán con el AI automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Resumen de productos por categoría */}
                {categories.map(category => {
                  const categoryProducts = products.filter(p => p.category === category.id);
                  return (
                    <div key={category.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {categoryProducts.length} productos
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {category.description}
                      </div>
                      {categoryProducts.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {categoryProducts.slice(0, 3).map(product => (
                            <div key={product.id} className="flex items-center justify-between text-sm">
                              <span>{product.name}</span>
                              <span className="text-muted-foreground">{product.price}€</span>
                            </div>
                          ))}
                          {categoryProducts.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... y {categoryProducts.length - 3} productos más
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Fuentes de Datos Soportadas:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Archivos CSV con productos</li>
                <li>• WooCommerce (WordPress)</li>
                <li>• PrestaShop</li>
                <li>• Shopify</li>
                <li>• Gestión manual</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Funcionalidades:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Sincronización automática</li>
                <li>• Activar/desactivar productos</li>
                <li>• Gestión por categorías</li>
                <li>• Integración con AI</li>
                <li>• Respaldos automáticos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}