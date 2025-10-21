// src/components/EcommerceConnections.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { 
  ShoppingCart, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Key,
  Globe,
  Settings,
  Package,
  Scan
} from 'lucide-react';
import { PrestashopScanner } from './PrestashopScanner';

interface EcommerceConnection {
  id: string;
  platform: 'woocommerce' | 'prestashop' | 'shopify';
  name: string;
  url: string;
  apiKey?: string;
  apiSecret?: string;
  isConnected: boolean;
  lastSync?: Date;
  productsCount?: number;
}

interface EcommerceConnectionsProps {
  onConnectionUpdate: (connection: EcommerceConnection) => void;
}

export function EcommerceConnections({ onConnectionUpdate }: EcommerceConnectionsProps) {
  const [connections, setConnections] = useState<EcommerceConnection[]>([
    {
      id: 'woocommerce-1',
      platform: 'woocommerce',
      name: 'Mi Tienda WooCommerce',
      url: '',
      isConnected: false
    },
    {
      id: 'prestashop-1',
      platform: 'prestashop',
      name: 'Mi Tienda PrestaShop',
      url: '',
      isConnected: false
    },
    {
      id: 'shopify-1',
      platform: 'shopify',
      name: 'Mi Tienda Shopify',
      url: '',
      isConnected: false
    }
  ]);

  const [editingConnection, setEditingConnection] = useState<EcommerceConnection | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [showPrestashopScanner, setShowPrestashopScanner] = useState(false);

  const platformInfo = {
    woocommerce: {
      name: 'WooCommerce',
      description: 'La plataforma de ecommerce más popular para WordPress',
      icon: '🛒',
      color: 'bg-blue-500',
      steps: [
        'Ve a tu panel de WordPress',
        'Instala el plugin WooCommerce si no lo tienes',
        'Ve a WooCommerce > Configuración > Avanzado > REST API',
        'Haz clic en "Crear una clave API"',
        'Copia la URL de tu tienda y las credenciales generadas'
      ]
    },
    prestashop: {
      name: 'PrestaShop',
      description: 'Plataforma de ecommerce open source',
      icon: '🛍️',
      color: 'bg-orange-500',
      steps: [
        'Ve a tu panel de administración de PrestaShop',
        'Navega a Configuración > Avanzado > Web Service',
        'Habilita el Web Service',
        'Ve a Configuración > Avanzado > API Keys',
        'Genera una nueva API Key con permisos de lectura',
        'Copia la URL de tu tienda y la API Key'
      ]
    },
    shopify: {
      name: 'Shopify',
      description: 'Plataforma de ecommerce en la nube',
      icon: '🏪',
      color: 'bg-green-500',
      steps: [
        'Ve a tu panel de administración de Shopify',
        'Navega a Configuración > Apps y canales de venta',
        'Haz clic en "Desarrollar aplicaciones"',
        'Crea una nueva aplicación privada',
        'Habilita los permisos de lectura para productos',
        'Instala la aplicación y copia las credenciales'
      ]
    }
  };

  const handleConnectionUpdate = (connection: EcommerceConnection) => {
    setConnections(prev => prev.map(c => 
      c.id === connection.id ? connection : c
    ));
    onConnectionUpdate(connection);
  };

  const handleTestConnection = async (connection: EcommerceConnection) => {
    console.log('Iniciando prueba de conexión para:', connection.platform, connection.url);
    setIsTesting(connection.id);
    
    try {
      if (connection.platform === 'prestashop') {
        console.log('Probando conexión Prestashop...');
        // Prueba real de conexión Prestashop
        const cleanUrl = connection.url.trim().replace(/\/$/, ''); // Quitar espacios y barra final
        
        // Validar que la URL esté bien formada
        if (!cleanUrl.includes('/api/')) {
          throw new Error('La URL debe contener /api/ para ser una API de Prestashop válida');
        }
        
        console.log('URL limpia:', cleanUrl);
        
        // Probar diferentes formatos de URL
        const testUrls = [
          `${cleanUrl}/products?display=full&limit=1`,
          `${cleanUrl}/products?limit=1`,
          `${cleanUrl}/products`,
          `${cleanUrl}/api/products?display=full&limit=1`
        ];
        
        let lastError = null;
        
        for (const testUrl of testUrls) {
          try {
            console.log('Probando URL:', testUrl);
            
            const cleanApiKey = connection.apiKey?.trim() || '';
            console.log('API Key limpia:', cleanApiKey ? '***' : 'undefined');
            
            const response = await fetch(testUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Basic ${btoa(`${cleanApiKey}:`)}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              mode: 'cors'
            });

            console.log('Respuesta de prueba:', response.status, response.statusText);

            if (response.ok) {
              const data = await response.json();
              console.log('Datos de respuesta:', data);
              const productsCount = data.products ? data.products.length : 0;
              
              const updatedConnection = {
                ...connection,
                isConnected: true,
                lastSync: new Date(),
                productsCount: productsCount
              };
              
              console.log('Actualizando conexión:', updatedConnection);
              handleConnectionUpdate(updatedConnection);
              return; // Salir si funciona
            } else {
              const errorText = await response.text();
              console.log('Error con esta URL:', response.status, errorText);
              lastError = new Error(`Error de conexión: ${response.status} ${response.statusText}`);
            }
          } catch (error) {
            console.log('Error de red con esta URL:', error);
            lastError = error;
          }
        }
        
        // Si llegamos aquí, ninguna URL funcionó
        throw lastError || new Error('No se pudo conectar con ninguna URL de prueba');
      } else {
        console.log('Probando conexión simulada para:', connection.platform);
        // Simular test de conexión para otras plataformas
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const updatedConnection = {
          ...connection,
          isConnected: true,
          lastSync: new Date(),
          productsCount: Math.floor(Math.random() * 1000) + 100
        };
        
        handleConnectionUpdate(updatedConnection);
      }
      
    } catch (error) {
      console.error('Connection test failed:', error);
      // Mantener conexión como desconectada en caso de error
    } finally {
      console.log('Finalizando prueba de conexión');
      setIsTesting(null);
    }
  };

  const handlePrestashopImportComplete = (importedCount: number) => {
    // Actualizar la conexión de Prestashop
    const prestashopConnection = connections.find(c => c.platform === 'prestashop');
    if (prestashopConnection) {
      const updatedConnection = {
        ...prestashopConnection,
        isConnected: true,
        lastSync: new Date(),
        productsCount: (prestashopConnection.productsCount || 0) + importedCount
      };
      
      setConnections(prev => 
        prev.map(c => c.id === prestashopConnection.id ? updatedConnection : c)
      );
      
      onConnectionUpdate(updatedConnection);
    }
    
    setShowPrestashopScanner(false);
  };

  const renderConnectionForm = (connection: EcommerceConnection) => {
    const info = platformInfo[connection.platform];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{info.icon}</span>
            {info.name}
          </CardTitle>
          <CardDescription>{info.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instrucciones */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Pasos para conectar:</strong>
              <ol className="mt-2 list-decimal list-inside space-y-1">
                {info.steps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </AlertDescription>
          </Alert>

          {/* Formulario de conexión */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${connection.id}-name`}>Nombre de la Conexión</Label>
              <Input
                id={`${connection.id}-name`}
                value={connection.name}
                onChange={(e) => setEditingConnection({
                  ...connection,
                  name: e.target.value
                })}
                placeholder={`Mi Tienda ${info.name}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${connection.id}-url`}>URL de la Tienda</Label>
              <Input
                id={`${connection.id}-url`}
                value={connection.url}
                onChange={(e) => setEditingConnection({
                  ...connection,
                  url: e.target.value
                })}
                placeholder="https://mitienda.com"
              />
            </div>

            {connection.platform === 'woocommerce' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${connection.id}-key`}>Consumer Key</Label>
                  <Input
                    id={`${connection.id}-key`}
                    type="password"
                    value={connection.apiKey || ''}
                    onChange={(e) => setEditingConnection({
                      ...connection,
                      apiKey: e.target.value
                    })}
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${connection.id}-secret`}>Consumer Secret</Label>
                  <Input
                    id={`${connection.id}-secret`}
                    type="password"
                    value={connection.apiSecret || ''}
                    onChange={(e) => setEditingConnection({
                      ...connection,
                      apiSecret: e.target.value
                    })}
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </>
            )}

            {connection.platform === 'prestashop' && (
              <div className="space-y-2">
                <Label htmlFor={`${connection.id}-key`}>API Key</Label>
                <Input
                  id={`${connection.id}-key`}
                  type="password"
                  value={connection.apiKey || ''}
                  onChange={(e) => setEditingConnection({
                    ...connection,
                    apiKey: e.target.value
                  })}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            )}

            {connection.platform === 'shopify' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${connection.id}-key`}>API Key</Label>
                  <Input
                    id={`${connection.id}-key`}
                    type="password"
                    value={connection.apiKey || ''}
                    onChange={(e) => setEditingConnection({
                      ...connection,
                      apiKey: e.target.value
                    })}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${connection.id}-secret`}>API Secret</Label>
                  <Input
                    id={`${connection.id}-secret`}
                    type="password"
                    value={connection.apiSecret || ''}
                    onChange={(e) => setEditingConnection({
                      ...connection,
                      apiSecret: e.target.value
                    })}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log('Botón Probar Conexión clickeado');
                  console.log('Connection:', connection);
                  console.log('EditingConnection:', editingConnection);
                  console.log('isTesting:', isTesting);
                  console.log('connection.url:', connection.url);
                  handleTestConnection(editingConnection || connection);
                }}
                disabled={isTesting === connection.id || !connection.url}
              >
                {isTesting === connection.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Probando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Probar Conexión
                  </>
                )}
              </Button>
              
              {connection.platform === 'prestashop' && connection.url && connection.apiKey && (
                <Button 
                  variant="secondary"
                  onClick={() => setShowPrestashopScanner(true)}
                  className="flex items-center gap-2"
                >
                  <Scan className="h-4 w-4" />
                  Escanear Productos
                </Button>
              )}
              
              {connection.isConnected && (
                <Button variant="outline" onClick={() => window.open(connection.url, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Tienda
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Conexiones de Ecommerce</h2>
        <p className="text-muted-foreground">
          Conecta tu tienda online para sincronizar automáticamente el catálogo de productos
        </p>
      </div>

      {/* Estadísticas de conexiones */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{connections.filter(c => c.isConnected).length}</div>
            <div className="text-sm text-muted-foreground">Conexiones Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {connections.reduce((sum, c) => sum + (c.productsCount || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Productos Sincronizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {connections.filter(c => c.lastSync && c.lastSync > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-sm text-muted-foreground">Sincronizados Hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de conexiones */}
      <div className="space-y-4">
        {connections.map(connection => (
          <div key={connection.id}>
            {editingConnection?.id === connection.id ? (
              renderConnectionForm(editingConnection)
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${platformInfo[connection.platform].color} flex items-center justify-center text-white text-xl`}>
                        {platformInfo[connection.platform].icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{connection.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {connection.url || 'No configurado'}
                        </p>
                        {connection.lastSync && (
                          <p className="text-xs text-muted-foreground">
                            Última sincronización: {connection.lastSync.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connection.isConnected ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Conectado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Desconectado
                        </Badge>
                      )}
                      {connection.productsCount && (
                        <Badge variant="outline">
                          {connection.productsCount} productos
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingConnection(connection)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Modal del escáner de Prestashop */}
      <Dialog open={showPrestashopScanner} onOpenChange={setShowPrestashopScanner}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Escáner de Productos Prestashop
            </DialogTitle>
            <DialogDescription>
              Escanea y revisa todos los productos de tu tienda Prestashop antes de importarlos
            </DialogDescription>
          </DialogHeader>
          
          <PrestashopScanner
            onImportComplete={handlePrestashopImportComplete}
            initialApiUrl={connections.find(c => c.platform === 'prestashop')?.url || ''}
            initialApiKey={connections.find(c => c.platform === 'prestashop')?.apiKey || ''}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
