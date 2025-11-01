import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Scan, Loader2, Save, Download } from 'lucide-react';
import { scanPrestashopProducts, confirmPrestashopImport } from '../lib/productCatalog';
import { toast } from 'sonner';
import { savePrestashopCredentials, loadPrestashopCredentials, isLocalStorageAvailable } from '../lib/prestashopStorage';

interface SimplePrestashopConnectionProps {
  onImportComplete?: (count: number) => void;
}

export function SimplePrestashopConnection({ onImportComplete }: SimplePrestashopConnectionProps) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedProductsCount, setScannedProductsCount] = useState(0);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [productsObtained, setProductsObtained] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [totalProductsEstimate, setTotalProductsEstimate] = useState(0);

  // Cargar credenciales guardadas
  React.useEffect(() => {
    const loadSavedCredentials = () => {
      // Verificar si localStorage está disponible
      if (!isLocalStorageAvailable()) {
        console.warn('⚠️ localStorage no está disponible');
        toast.error('⚠️ localStorage no disponible. Las credenciales no se guardarán automáticamente.');
        return;
      }

      const credentials = loadPrestashopCredentials();
      
      if (credentials) {
        if (credentials.url) {
          setUrl(credentials.url);
          console.log('✅ URL cargada:', credentials.url);
        }
        if (credentials.apiKey) {
          setApiKey(credentials.apiKey);
          console.log('✅ API Key cargada');
        }
        if (credentials.isConnected) {
          setIsConnected(credentials.isConnected);
          console.log('✅ Estado de conexión cargado:', credentials.isConnected);
        }
      } else {
        console.log('📭 No hay credenciales guardadas');
      }
    };
    
    loadSavedCredentials();
    
    // También cargar cuando la ventana recupera el foco (por si se borró)
    window.addEventListener('focus', loadSavedCredentials);
    
    // También intentar cargar después de un pequeño delay (por si hay problemas de timing)
    const timeoutId = setTimeout(loadSavedCredentials, 500);
    
    return () => {
      window.removeEventListener('focus', loadSavedCredentials);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleTestConnection = async () => {
    if (!url || !apiKey) {
      toast.error('Por favor, completa la URL y la API Key');
      return;
    }

    setIsTestingConnection(true);
    setIsConnected(false);

    try {
      // Según el PHP: PRESTASHOP_URL = 'https://100x100chef.com/shop/api/'
      // La URL debe terminar en /api/ pero sin la barra final en la base
      let cleanUrl = url.trim().replace(/\/$/, '');
      // Asegurar que termine en /api (sin barra final, la función de Netlify agregará la barra)
      if (!cleanUrl.endsWith('/api')) {
        // Si ya tiene /api/, quitar la barra final
        cleanUrl = cleanUrl.replace(/\/api\/?$/, '');
      }
      
      // Probar con el producto 1 (como en PHP)
      // Intentar primero con el redirect /api/prestashop/*, si falla usar directamente /.netlify/functions/prestashop
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      
      // Opción 1: Usar redirect (puede no funcionar si la función no está desplegada)
      let proxyUrl = `/api/prestashop/products/1?language=1&output_format=JSON`;
      
      // Si estamos en producción de Netlify, también intentar la ruta directa como fallback
      // Netlify Functions accesibles directamente en: /.netlify/functions/prestashop
      // Pero el path completo se pasa en el body, no en la URL de la función
      
      console.log('🔍 Testing connection:', { 
        cleanUrl, 
        proxyUrl, 
        isProduction,
        hostname: window.location.hostname,
        fullUrl: window.location.href
      });
      
      let response;
      try {
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiUrl: cleanUrl,
            apiKey
          })
        });
        
        // Si el redirect falla con 404, intentar la ruta directa de Netlify
        if (response.status === 404 && isProduction) {
          console.log('⚠️ Redirect falló, intentando ruta directa de Netlify...');
          const directUrl = `/.netlify/functions/prestashop/products/1?language=1&output_format=JSON`;
          response = await fetch(directUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              apiUrl: cleanUrl,
              apiKey
            })
          });
        }
      } catch (fetchError) {
        console.error('❌ Error en fetch:', fetchError);
        throw fetchError;
      }
      
      console.log('📊 Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      // Si es 404, mostrar más detalles
      if (response.status === 404) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error('❌ 404 Error Details:', {
          proxyUrl,
          errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
      }

      if (response.ok) {
        const data = await response.json();
        
        if (data.product || data.products) {
          setIsConnected(true);
          
          const saved = savePrestashopCredentials(url, apiKey, true);
          if (saved) {
            toast.success('✅ Conexión exitosa con PrestaShop');
          } else {
            toast.error('⚠️ Conexión exitosa, pero no se pudieron guardar las credenciales');
          }
          
          // Resetear productos escaneados cuando se conecta
          setScannedProducts([]);
          setScannedProductsCount(0);
        } else {
          throw new Error('Respuesta no válida de PrestaShop');
        }
      } else {
        setIsConnected(false);
        savePrestashopCredentials(url, apiKey, false);
        
        let errorMessage = `Error ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'API Key inválida';
        } else if (response.status === 404) {
          errorMessage = 'URL de PrestaShop no encontrada';
        } else if (response.status === 502) {
          errorMessage = 'Error de conexión con PrestaShop';
        }
        
        toast.error(`❌ Error de conexión: ${errorMessage}`);
      }
    } catch (error) {
      setIsConnected(false);
      savePrestashopCredentials(url, apiKey, false);
      
      let errorMessage = 'Error desconocido';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Error de red. Verifica tu conexión';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(`❌ Error: ${errorMessage}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleScan = async () => {
    if (!url || !apiKey) {
      toast.error('Por favor, completa la URL y la API Key');
      return;
    }

    if (!isConnected) {
      toast.error('Por favor, conecta primero');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScannedProducts([]);
    setScannedProductsCount(0);
    setProductsObtained(0);
    setCurrentProductIndex(0);
    setTotalProductsEstimate(0);

    try {
      const result = await scanPrestashopProducts(
        url,
        apiKey,
        (progress, info) => {
          setScanProgress(progress);
          if (info) {
            if (info.productsObtained !== undefined) {
              setProductsObtained(info.productsObtained);
            }
            if (info.productsTotal !== undefined) {
              setTotalProductsEstimate(info.productsTotal);
            }
            if (info.currentProduct !== undefined) {
              setCurrentProductIndex(info.currentProduct);
            }
          }
        }
      );

      if (result.success && result.products) {
        setScannedProductsCount(result.products.length);
        setScannedProducts(result.products);
        setIsScanning(false);
        toast.success(`✅ Se encontraron ${result.products.length} productos`);
      } else {
        setIsScanning(false);
        toast.error(result.error || 'Error al escanear productos');
      }
    } catch (error) {
      setIsScanning(false);
      toast.error(`❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleImport = async () => {
    if (!scannedProductsCount || scannedProducts.length === 0) return;

    setIsImporting(true);
    try {
      const importResult = await confirmPrestashopImport(scannedProducts);
      
      if (importResult.success) {
        toast.success(`✅ ${importResult.importedCount || 0} productos importados correctamente`);
        setScannedProducts([]);
        setScannedProductsCount(0);
        setProductsObtained(0);
        setScanProgress(0);
        onImportComplete?.(importResult.importedCount || 0);
      } else {
        toast.error(`❌ Error al importar: ${importResult.error}`);
      }
    } catch (error) {
      toast.error(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar desde PrestaShop</CardTitle>
        <CardDescription>
          Conecta tu tienda PrestaShop e importa productos automáticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paso 1: Configuración de conexión */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prestashop-url">URL de PrestaShop</Label>
              <Input
                id="prestashop-url"
                type="url"
                placeholder="https://100x100chef.com/shop"
                value={url}
                onChange={(e) => {
                  const newUrl = e.target.value;
                  setUrl(newUrl);
                  setIsConnected(false);
                  
                  if (newUrl.trim()) {
                    const saved = savePrestashopCredentials(newUrl, apiKey, false);
                    if (!saved) {
                      toast.error('⚠️ No se pudo guardar la URL. Verifica permisos del navegador.');
                    }
                  }
                }}
                disabled={isScanning || isImporting || isTestingConnection}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prestashop-api-key">API Key</Label>
              <Input
                id="prestashop-api-key"
                type="password"
                placeholder="Tu API Key de PrestaShop"
                value={apiKey}
                onChange={(e) => {
                  const newApiKey = e.target.value;
                  setApiKey(newApiKey);
                  setIsConnected(false);
                  
                  if (newApiKey.trim()) {
                    const saved = savePrestashopCredentials(url, newApiKey, false);
                    if (!saved) {
                      toast.error('⚠️ No se pudo guardar la API Key. Verifica permisos del navegador.');
                    }
                  }
                }}
                disabled={isScanning || isImporting || isTestingConnection}
              />
            </div>
          </div>

          {/* Estado de conexión y botón de conectar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Conectado</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">No conectado</span>
                </>
              )}
            </div>

            <Button
              onClick={handleTestConnection}
              disabled={isScanning || isImporting || isTestingConnection || !url || !apiKey}
              variant={isConnected ? "outline" : "default"}
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reconectar
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Paso 2: Obtener productos (solo si está conectado) */}
        {isConnected && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Obtener productos</h3>
                <p className="text-sm text-muted-foreground">
                  Escanea tu tienda para encontrar todos los productos disponibles
                </p>
              </div>
              <Button
                onClick={handleScan}
                disabled={isScanning || isImporting || scannedProductsCount > 0}
                variant="outline"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Escaneando...
                  </>
                ) : scannedProductsCount > 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ya escaneado
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Obtener Productos
                  </>
                )}
              </Button>
            </div>

            {/* Barra de progreso */}
            {isScanning && (
              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    Escaneando productos...
                    {productsObtained > 0 && (
                      <span className="ml-2 text-muted-foreground font-normal">
                        {productsObtained} {totalProductsEstimate > 0 && totalProductsEstimate !== productsObtained ? `de ~${totalProductsEstimate}` : ''} obtenidos
                        {currentProductIndex > 0 && currentProductIndex <= productsObtained && (
                          <span className="ml-2">(procesando {currentProductIndex}/{productsObtained})</span>
                        )}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}

            {/* Productos encontrados */}
            {!isScanning && scannedProductsCount > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg text-green-900">
                      ✅ {scannedProductsCount} productos encontrados
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Listos para importar al catálogo
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Paso 3: Guardar productos (solo si hay productos escaneados) */}
        {!isScanning && scannedProductsCount > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Importar al catálogo</h3>
                <p className="text-sm text-muted-foreground">
                  Guarda los {scannedProductsCount} productos encontrados en tu catálogo
                </p>
              </div>
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="min-w-[150px]"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Productos
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
