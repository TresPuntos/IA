// src/pages/Catalog.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { CSVUploader } from "../components/CSVUploader";
import { EcommerceConnections } from "../components/EcommerceConnections";
import { ProductStats } from "../components/ProductStats";
import { useCatalog } from "../lib/CatalogContext";
import { Product, ProductCategory } from "../lib/catalog";

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