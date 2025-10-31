import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Scan, Loader2 } from 'lucide-react';
import { scanPrestashopProducts, confirmPrestashopImport } from '../lib/productCatalog';
import { toast } from 'sonner';
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Cargar credenciales guardadas
  React.useEffect(() => {
    const savedUrl = localStorage.getItem('prestashop-url');
    const savedApiKey = localStorage.getItem('prestashop-api-key');
    const savedConnected = localStorage.getItem('prestashop-connected') === 'true';
    
    if (savedUrl) setUrl(savedUrl);
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedConnected) setIsConnected(savedConnected);
  }, []);

  const handleTestConnection = async () => {
    console.log('🔍 handleTestConnection llamado', { url, apiKey: apiKey ? '***' : 'empty' });
    
    if (!url || !apiKey) {
      console.log('❌ Faltan URL o API Key');
      toast.error('Por favor, completa la URL y la API Key');
      return;
    }

    setIsTestingConnection(true);
    setIsConnected(false);

    try {
      console.log('📡 Probando conexión con PrestaShop...');
      
      // Usar Netlify Function para evitar CORS y problemas de Egress en Supabase
      const cleanUrl = url.trim().replace(/\/$/, '').replace(/\/api\/?$/, '');
      // URL relativa que funciona tanto en desarrollo como en producción
      const proxyUrl = `/api/prestashop/products/1?language=1&output_format=JSON`;
      
      console.log('📡 URL de prueba (via Netlify):', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiUrl: cleanUrl,
          apiKey
        })
      });

      console.log('📊 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta exitosa:', data);
        
        // Verificar que tenemos datos válidos de PrestaShop
        if (data.product || data.products) {
          setIsConnected(true);
          localStorage.setItem('prestashop-url', url);
          localStorage.setItem('prestashop-api-key', apiKey);
          localStorage.setItem('prestashop-connected', 'true');
          toast.success('✅ Conexión exitosa con PrestaShop');
        } else {
          throw new Error('Respuesta no válida de PrestaShop');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        console.error('❌ Error de respuesta:', response.status, errorData);
        setIsConnected(false);
        localStorage.setItem('prestashop-connected', 'false');
        
        let errorMessage = `Error ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'API Key inválida';
        } else if (response.status === 404) {
          errorMessage = 'URL de PrestaShop no encontrada o Netlify Function no desplegada';
        } else if (response.status === 502) {
          errorMessage = 'Error de conexión con PrestaShop. Verifica la URL o que el servidor esté disponible';
        } else if (response.status === 500) {
          errorMessage = 'Error en el servidor. Verifica que la Netlify Function esté desplegada';
        }
        
        toast.error(`❌ Error de conexión: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Error en handleTestConnection:', error);
      setIsConnected(false);
      localStorage.setItem('prestashop-connected', 'false');
      
      let errorMessage = 'Error desconocido';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Error de red o Netlify Function no disponible. Verifica que estés desplegado en Netlify o usando netlify dev';
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
      toast.error('Por favor, prueba la conexión primero');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setShowConfirm(false);
    setScannedProductsCount(0);

    try {
      const result = await scanPrestashopProducts(
        url,
        apiKey,
        (progress) => setScanProgress(progress)
      );

      if (result.success && result.products) {
        setScannedProductsCount(result.products.length);
        setScannedProducts(result.products);
        setShowConfirm(true);
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

  const handleConfirmImport = async () => {
    if (!scannedProductsCount || scannedProducts.length === 0) return;

    setIsImporting(true);
    try {
      const importResult = await confirmPrestashopImport(scannedProducts);
      
      if (importResult.success) {
        toast.success(`✅ ${importResult.importedCount || 0} productos importados correctamente`);
        setShowConfirm(false);
        setScannedProductsCount(0);
        setScannedProducts([]);
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

  const handleCancel = () => {
    setShowConfirm(false);
    setScannedProductsCount(0);
    setScannedProducts([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prestashop-url">URL de PrestaShop</Label>
          <Input
            id="prestashop-url"
            type="url"
            placeholder="https://100x100chef.com/shop"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setIsConnected(false);
              localStorage.setItem('prestashop-url', e.target.value);
            }}
            disabled={isScanning || isImporting}
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
              setApiKey(e.target.value);
              setIsConnected(false);
              localStorage.setItem('prestashop-api-key', e.target.value);
            }}
            disabled={isScanning || isImporting}
          />
        </div>

        {/* Estado de conexión */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-500">Conectado</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">No conectado</span>
            </>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isScanning || isImporting || isTestingConnection || !url || !apiKey}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Probar Conexión
              </>
            ) : (
              'Probar Conexión'
            )}
          </Button>

          <Button
            onClick={handleScan}
            disabled={!isConnected || isScanning || isImporting}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Escaneando...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Escanear Productos
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Barra de progreso */}
      {isScanning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Escaneando productos...</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} />
        </div>
      )}

      {/* Confirmación de importación */}
      {showConfirm && scannedProductsCount > 0 && (
        <Alert>
          <AlertDescription className="space-y-4">
            <div>
              <p className="font-semibold text-lg">
                ✅ Se encontraron {scannedProductsCount} productos
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ¿Deseas importar estos productos al catálogo?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleConfirmImport}
                disabled={isImporting}
                className="flex-1"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  '✅ Sí, Importar'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isImporting}
              >
                ❌ Cancelar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

