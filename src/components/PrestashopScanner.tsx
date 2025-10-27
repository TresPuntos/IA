import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Package, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  scanPrestashopProducts, 
  confirmPrestashopImport,
  PrestashopScannedProduct 
} from '../lib/productCatalog';
import { PrestashopPreview } from './PrestashopPreview';

interface PrestashopScannerProps {
  onImportComplete?: (importedCount: number) => void;
  initialApiUrl?: string;
  initialApiKey?: string;
}

export function PrestashopScanner({ 
  onImportComplete, 
  initialApiUrl = '', 
  initialApiKey = '' 
}: PrestashopScannerProps) {
  const [apiUrl, setApiUrl] = useState(initialApiUrl);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedProducts, setScannedProducts] = useState<PrestashopScannedProduct[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleScan = async () => {
    if (!apiUrl || !apiKey) {
      setError('Por favor, completa la URL y la API Key');
      return;
    }

    setIsScanning(true);
    setError(null);
    setSuccess(null);
    setScanProgress(0);

    try {
      const result = await scanPrestashopProducts(
        apiUrl,
        apiKey,
        (progress) => setScanProgress(progress)
      );

      if (result.success && result.products) {
        setScannedProducts(result.products);
        setShowPreview(true);
        setSuccess(`Se encontraron ${result.products.length} productos`);
      } else {
        setError(result.error || 'Error desconocido al escanear productos');
      }
    } catch (error) {
      setError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    setError(null);

    try {
      const result = await confirmPrestashopImport(scannedProducts);

      if (result.success) {
        setSuccess(`Se importaron ${result.importedCount} productos exitosamente`);
        setShowPreview(false);
        setScannedProducts([]);
        onImportComplete?.(result.importedCount || 0);
      } else {
        setError(result.error || 'Error al importar productos');
      }
    } catch (error) {
      setError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setScannedProducts([]);
    setError(null);
    setSuccess(null);
  };

  const resetForm = () => {
    setApiUrl('');
    setApiKey('');
    setError(null);
    setSuccess(null);
    setScannedProducts([]);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Escáner de Productos Prestashop
            </CardTitle>
            <CardDescription>
              Escanea todos los productos y combinaciones de tu tienda Prestashop antes de importarlos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL de la API</Label>
              <Input
                id="api-url"
                type="url"
                placeholder="https://100x100chef.com/shop/api/"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={isScanning || isImporting}
              />
              <p className="text-sm text-muted-foreground">
                La URL debe terminar en /api/ para ser válida
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Insert API Key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isScanning || isImporting}
              />
              <p className="text-sm text-muted-foreground">
                Genera tu API Key en PrestaShop &gt; Web Service
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button 
                onClick={handleScan}
                disabled={isScanning || isImporting || !apiUrl || !apiKey}
                className="flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Escaneando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Escanear Productos
                  </>
                )}
              </Button>
              
              {(apiUrl || apiKey) && (
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isScanning || isImporting}
                >
                  Limpiar
                </Button>
              )}
            </div>

            {/* Barra de progreso */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Escaneando productos...</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
              </div>
            )}

            {/* Alertas */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <PrestashopPreview
          products={scannedProducts}
          onConfirm={handleConfirmImport}
          onCancel={handleCancel}
          isImporting={isImporting}
        />
      )}
    </div>
  );
}
