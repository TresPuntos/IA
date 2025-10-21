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
    toggleCategoryActive
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
  }, []);

  // Limpieza automática al cargar la página
  useEffect(() => {
    const performAutoCleanup = async () => {
      console.log('🗑️ Ejecutando limpieza automática...');
      
      try {
        // 1. Eliminar todos los productos de Supabase
        const productsResult = await clearAllProducts();
        console.log('📦 Productos eliminados:', productsResult.deletedCount || 0);

        // 2. Eliminar historial de actualizaciones
        const historyResult = await clearAllUpdateHistory();
        console.log('📋 Historial eliminado:', historyResult.deletedCount || 0);

        // 3. Limpiar localStorage
        localStorage.removeItem('catalog-csv-files');
        localStorage.removeItem('catalog-ecommerce-connections');
        localStorage.removeItem('catalog-last-sync');

        // 4. Limpiar estado local
        setCsvFiles([]);
        setEcommerceConnections([]);
        setLastSync(undefined);
        setSyncStatus('idle');

        console.log('✅ Limpieza automática completada');
        toast.success('✅ Catálogo limpiado completamente - Listo para empezar de cero');
        
      } catch (error) {
        console.error('❌ Error en limpieza automática:', error);
        toast.error('❌ Error durante la limpieza automática');
      }
    };

    // Ejecutar limpieza automática
    performAutoCleanup();
  }, []);

  const handleCSVUploaded = (file: any, products: Product[]) => {
    // Añadir productos del CSV al catálogo
    products.forEach(product => {
      addProduct(product);
    });

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
    const updatedFiles = csvFiles.filter(f => f.id !== fileId);
    setCsvFiles(updatedFiles);
    localStorage.setItem('catalog-csv-files', JSON.stringify(updatedFiles));
  };

  const handleDeleteCSVProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos CSV? Esto limpiará el catálogo para una nueva importación.')) {
      return;
    }

    try {
      const result = await clearCSVProducts();
      
      if (result.success) {
        toast.success(`✅ ${result.deletedCount} productos CSV eliminados. El catálogo está listo para una nueva importación.`);
        // Recargar la página para actualizar las estadísticas
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al eliminar productos CSV');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ ¿Estás SEGURO de que quieres eliminar TODOS los productos y conexiones?\n\nEsto eliminará:\n- Todos los productos del catálogo\n- Todas las conexiones ecommerce\n- Todo el historial de actualizaciones\n- Todos los archivos CSV locales\n\nEsta acción NO se puede deshacer.')) {
      return;
    }

    try {
      toast.info('🗑️ Iniciando limpieza completa...');
      
      // 1. Eliminar todos los productos de Supabase
      const productsResult = await clearAllProducts();
      if (!productsResult.success) {
        throw new Error(`Error al eliminar productos: ${productsResult.error}`);
      }

      // 2. Eliminar historial de actualizaciones
      const historyResult = await clearAllUpdateHistory();
      if (!historyResult.success) {
        console.warn('⚠️ Error al eliminar historial:', historyResult.error);
      }

      // 3. Limpiar localStorage
      localStorage.removeItem('catalog-csv-files');
      localStorage.removeItem('catalog-ecommerce-connections');
      localStorage.removeItem('catalog-last-sync');

      // 4. Limpiar estado local
      setCsvFiles([]);
      setEcommerceConnections([]);
      setLastSync(undefined);
      setSyncStatus('idle');

      toast.success(`✅ Limpieza completa exitosa!\n- ${productsResult.deletedCount} productos eliminados\n- Historial limpiado\n- Conexiones eliminadas\n- Archivos CSV eliminados`);
      
      // Recargar la página para asegurar estado limpio
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast.error('❌ Error durante la limpieza: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
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
        onClearAll={handleClearAll}
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