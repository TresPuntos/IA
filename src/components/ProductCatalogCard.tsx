import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Upload, Link as LinkIcon, CheckCircle2, XCircle, Clock, RefreshCw, AlertCircle, Trash2 } from "lucide-react";
import { 
  getCatalogStats, 
  uploadProductsFromCSV, 
  connectWooCommerce,
  getUpdateHistory,
  clearCSVProducts,
  clearWooCommerceProducts,
  clearCatalog,
  getProducts,
  deleteProduct,
  type CatalogStats,
  type CatalogUpdate,
  type Product 
} from "../lib/productCatalog";
import { toast } from "sonner";

export function ProductCatalogCard() {
  const [stats, setStats] = useState<CatalogStats>({
    total_products: 0,
    active_products: 0,
    csv_products: 0,
    woocommerce_products: 0,
    last_update: null
  });
  const [updateHistory, setUpdateHistory] = useState<CatalogUpdate[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [woocommerceUrl, setWooCommerceUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsData, historyData, productsData] = await Promise.all([
        getCatalogStats(),
        getUpdateHistory(),
        getProducts()
      ]);
      setStats(statsData);
      setUpdateHistory(historyData);
      setProducts(productsData);
    } catch (error) {
      toast.error('Error al cargar datos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadProductsFromCSV(file);
      
      if (result.success) {
        toast.success(`${result.productsCount} productos cargados desde CSV`);
        await loadData(); // Recargar datos
      } else {
        toast.error(result.error || 'Error al subir CSV');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleWooCommerceConnect = async () => {
    if (!woocommerceUrl || !consumerKey || !consumerSecret) {
      toast.error('Por favor completa todos los campos de WooCommerce');
      return;
    }

    try {
      setIsConnecting(true);
      const result = await connectWooCommerce(woocommerceUrl, consumerKey, consumerSecret);
      
      if (result.success) {
        toast.success(`${result.productsCount} productos sincronizados desde WooCommerce`);
        await loadData(); // Recargar datos
      } else {
        toast.error(result.error || 'Error al conectar con WooCommerce');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeleteCSVProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todos los productos cargados desde CSV?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await clearCSVProducts();
      
      if (result.success) {
        toast.success(`${result.deletedCount} productos CSV eliminados`);
        await loadData(); // Recargar datos
      } else {
        toast.error(result.error || 'Error al eliminar productos CSV');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteWooCommerceProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todos los productos de WooCommerce?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await clearWooCommerceProducts();
      
      if (result.success) {
        toast.success(`${result.deletedCount} productos WooCommerce eliminados`);
        await loadData(); // Recargar datos
      } else {
        toast.error(result.error || 'Error al eliminar productos WooCommerce');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los productos del catálogo?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await clearCatalog();
      toast.success('Todos los productos eliminados');
      await loadData(); // Recargar datos
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteProduct(productId);
      
      if (result.success) {
        toast.success(`Producto "${productName}" eliminado`);
        await loadData(); // Recargar datos
      } else {
        toast.error(result.error || 'Error al eliminar producto');
      }
    } catch (error) {
      toast.error('Error inesperado: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = () => {
    if (stats.total_products === 0) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <XCircle className="h-3 w-3 text-destructive" />
          No configurado
        </Badge>
      );
    }

    const hasRecentUpdate = stats.last_update && 
      new Date(stats.last_update).getTime() > Date.now() - 24 * 60 * 60 * 1000; // Últimas 24 horas

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3 text-green-500" />
        {hasRecentUpdate ? 'Actualizado' : 'Configurado'}
      </Badge>
    );
  };

  const formatLastUpdate = () => {
    if (!stats.last_update) return 'Nunca';
    
    const date = new Date(stats.last_update);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    
    return date.toLocaleDateString('es-ES');
  };

  return (
        <Card className="figma-card">
      <CardHeader>
        <CardTitle>Catálogo de Productos</CardTitle>
        <CardDescription>Conecta tu base de datos de productos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Subir CSV Manual</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Elegir Archivo CSV
                </>
              )}
            </Button>
          </div>
          <p className="text-muted-foreground">Columnas: nombre, precio, descripción, categoría</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center uppercase">
            <span className="bg-card px-2 text-muted-foreground">o</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="woocommerce-url">URL de API WooCommerce</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="woocommerce-url" 
                placeholder="https://tutienda.com/wp-json/wc/v3"
                value={woocommerceUrl}
                onChange={(e) => setWooCommerceUrl(e.target.value)}
                className="pl-9 bg-input-background"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="consumer-key">Consumer Key</Label>
              <Input 
                id="consumer-key"
                type="password"
                placeholder="ck_..."
                value={consumerKey}
                onChange={(e) => setConsumerKey(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="consumer-secret">Consumer Secret</Label>
              <Input 
                id="consumer-secret"
                type="password"
                placeholder="cs_..."
                value={consumerSecret}
                onChange={(e) => setConsumerSecret(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleWooCommerceConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Conectar
              </>
            )}
          </Button>
        </div>
        
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Cargando...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estado:</span>
                {getStatusBadge()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Productos:</span>
                <span>{stats.total_products} cargados</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Último update:</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatLastUpdate()}</span>
                </div>
              </div>
              {stats.total_products > 0 && (
                <div className="pt-2 border-t border-border/30">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>CSV: {stats.csv_products} productos</div>
                    <div>WooCommerce: {stats.woocommerce_products} productos</div>
                  </div>
                  
                  {/* Botones de eliminación */}
                  <div className="pt-2 space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Gestionar productos:</div>
                    <div className="flex gap-1 flex-wrap">
                      {stats.csv_products > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteCSVProducts}
                          disabled={isDeleting}
                          className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          CSV ({stats.csv_products})
                        </Button>
                      )}
                      {stats.woocommerce_products > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteWooCommerceProducts}
                          disabled={isDeleting}
                          className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          WooCommerce ({stats.woocommerce_products})
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAllProducts}
                        disabled={isDeleting}
                        className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Todos
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Lista de productos individuales */}
        {products.length > 0 && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Productos Cargados ({products.length})</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.price}€ • {product.category} • {product.source.toUpperCase()}
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      product.status === 'active' 
                        ? 'border-green-600/50 text-green-600' 
                        : 'border-red-600/50 text-red-600'
                    }`}>
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {updateHistory.length > 0 && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Historial de Actualizaciones</Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {updateHistory.slice(0, 3).map((update) => (
                <div key={update.id} className="flex items-center justify-between text-xs p-2 rounded border border-border/30">
                  <div className="flex items-center gap-2">
                    {update.status === 'completed' ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : update.status === 'failed' ? (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    ) : (
                      <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin" />
                    )}
                    <span>{update.source === 'csv' ? 'CSV' : 'WooCommerce'}</span>
                    <span className="text-muted-foreground">
                      {update.products_count} productos
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(update.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
