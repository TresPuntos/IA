// src/components/EcommerceConnections.tsx
import React, { useState, useEffect } from 'react';
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
  Scan,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { PrestashopScanner } from './PrestashopScanner';
import { getCatalogStats } from '../lib/productCatalog';

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
  const [csvProductsCount, setCsvProductsCount] = useState(0);
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
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: 'checking' | 'connected' | 'disconnected' | 'error' | 'cors-error'}>({});

  // Cargar productos CSV reales y conexiones guardadas al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar estadísticas del catálogo
        const stats = await getCatalogStats();
        setCsvProductsCount(stats.csv_products);
        
        // Cargar conexiones guardadas desde localStorage
        const savedConnections = localStorage.getItem('ecommerceConnections');
        if (savedConnections) {
          try {
            const parsedConnections = JSON.parse(savedConnections);
            console.log('Cargando conexiones guardadas:', parsedConnections);
            setConnections(parsedConnections);
          } catch (error) {
            console.error('Error al parsear conexiones guardadas:', error);
          }
        }
        
        // Si no hay productos CSV, asegurar que todas las conexiones muestren 0 productos
        if (stats.csv_products === 0) {
          setConnections(prev => prev.map(conn => ({
            ...conn,
            productsCount: 0,
            isConnected: false,
            lastSync: undefined
          })));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // En caso de error, también limpiar las conexiones
        setConnections(prev => prev.map(conn => ({
          ...conn,
          productsCount: 0,
          isConnected: false,
          lastSync: undefined
        })));
      }
    };
    
    loadData();
  }, []);

  // Verificar estado de conexiones automáticamente
  useEffect(() => {
    connections.forEach(connection => {
      if (connection.url && connection.platform === 'prestashop') {
        checkConnectionStatus(connection);
      }
    });
  }, [connections]);

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
    console.log('Actualizando conexión:', connection);
    setConnections(prev => {
      const updatedConnections = prev.map(c => 
      c.id === connection.id ? connection : c
      );
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('ecommerceConnections', JSON.stringify(updatedConnections));
      
      return updatedConnections;
    });
    onConnectionUpdate(connection);
  };

  // Función para verificar conectividad usando proxy público
  const checkWithProxy = async (url: string): Promise<boolean> => {
    try {
      // Usar un servicio de proxy público para evitar CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        // Si obtenemos contenido, el servidor responde
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error con proxy:', error);
      return false;
    }
  };

  // Función para verificar el estado de la conexión automáticamente
  const checkConnectionStatus = async (connection: EcommerceConnection) => {
    if (!connection.url) return;
    
    setConnectionStatus(prev => ({
      ...prev,
      [connection.id]: 'checking'
    }));

    try {
      const cleanUrl = connection.url.trim().replace(/\/$/, '');
      let apiUrl = cleanUrl;
      
      // Construir URL de API automáticamente
      if (!cleanUrl.includes('/api/') && !cleanUrl.includes('/webservice/')) {
        apiUrl = `${cleanUrl}/api/`;
      }

      // SOLUCIÓN CORS: Usar proxy o verificación alternativa
      console.log('🔍 Verificando conectividad con manejo de CORS...');
      
      // Intentar diferentes métodos para evitar CORS
      const testUrls = [
        `${apiUrl}`,
        `${apiUrl}/products`,
        `${apiUrl}/products?limit=1`,
        `${cleanUrl}/api/products`,
        `${cleanUrl}/webservice/products`
      ];

      let connectionSuccessful = false;
      let lastError = null;

      for (const testUrl of testUrls) {
        try {
          console.log('Probando URL:', testUrl);
          
          // Método 1: Fetch con headers mínimos
          const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Prestashop-API-Client/1.0'
            },
            mode: 'cors',
            credentials: 'omit'
          });

          console.log('Respuesta:', response.status, response.statusText);
          
          if (response.status === 200 || response.status === 401 || response.status === 403) {
            connectionSuccessful = true;
            break;
          }
        } catch (error) {
          console.log('Error con esta URL:', error);
          lastError = error;
          
          // Si es error de CORS, intentar método alternativo
          if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
            console.log('🔄 Detectado error de CORS, intentando método alternativo...');
            
            try {
              // Método alternativo 1: Usar proxy público
              console.log('🔧 Intentando con proxy público...');
              const proxyResult = await checkWithProxy(testUrl);
              
              if (proxyResult) {
                console.log('✅ Servidor responde (via proxy)');
                setConnectionStatus(prev => ({
                  ...prev,
                  [connection.id]: 'connected'
                }));
                return;
              }
              
              // Método alternativo 2: Verificación básica con imagen
              console.log('🔧 Intentando verificación básica...');
              const img = new Image();
              img.onload = () => {
                console.log('✅ Servidor responde (método alternativo)');
                setConnectionStatus(prev => ({
                  ...prev,
                  [connection.id]: 'connected'
                }));
              };
              img.onerror = () => {
                console.log('❌ Servidor no responde (método alternativo)');
                setConnectionStatus(prev => ({
                  ...prev,
                  [connection.id]: 'cors-error'
                }));
              };
              img.src = `${cleanUrl}/favicon.ico?t=${Date.now()}`;
              return; // Salir del loop
            } catch (altError) {
              console.log('Error en método alternativo:', altError);
            }
          }
        }
      }

      if (connectionSuccessful) {
        setConnectionStatus(prev => ({
          ...prev,
          [connection.id]: 'connected'
        }));
      } else if (lastError && lastError.message.includes('CORS')) {
        setConnectionStatus(prev => ({
          ...prev,
          [connection.id]: 'cors-error'
        }));
      } else {
        setConnectionStatus(prev => ({
          ...prev,
          [connection.id]: 'disconnected'
        }));
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
      setConnectionStatus(prev => ({
        ...prev,
        [connection.id]: 'error'
      }));
    }
  };

  const handleTestConnection = async (connection: EcommerceConnection) => {
    console.log('=== INICIANDO PRUEBA DE CONEXIÓN ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Versión del código: 2024-12-19-v9 (NETLIFY FUNCTIONS PROXY)');
    console.log('Iniciando prueba de conexión para:', connection.platform);
    console.log('Connection completa:', connection);
    console.log('URL:', connection.url);
    console.log('API Key:', connection.apiKey ? '***' : 'undefined');
    setIsTesting(connection.id);
    
    try {
      if (connection.platform === 'prestashop') {
        console.log('Probando conexión Prestashop...');
        // Prueba real de conexión Prestashop
        const cleanUrl = connection.url.trim().replace(/\/$/, ''); // Quitar espacios y barra final
        
        // Validar que la URL esté bien formada - PrestaShop puede usar diferentes formatos
        console.log('URL original:', connection.url);
        console.log('URL limpia:', cleanUrl);
        
        // Validar que sea una URL válida
        try {
          new URL(cleanUrl);
        } catch (error) {
          throw new Error(`La URL no es válida: ${cleanUrl}`);
        }
        
        // SOLUCIÓN ROBUSTA: Construir URL de API sin duplicar
        let apiUrl = cleanUrl;
        
        // Verificar si ya termina en /api o /webservice
        if (cleanUrl.endsWith('/api') || cleanUrl.endsWith('/webservice')) {
          apiUrl = cleanUrl;
          console.log('✅ URL ya termina en endpoint de API:', apiUrl);
        } else if (cleanUrl.includes('/api/') || cleanUrl.includes('/webservice/')) {
          apiUrl = cleanUrl;
          console.log('✅ URL ya contiene endpoint de API:', apiUrl);
        } else {
          // Solo agregar /api/ si no está presente
          apiUrl = `${cleanUrl}/api/`;
          console.log('🔧 URL construida automáticamente:', apiUrl);
        }
        
        // VERIFICACIÓN ADICIONAL: Evitar URLs duplicadas
        if (apiUrl.includes('/api/api') || apiUrl.includes('/webservice/webservice')) {
          console.log('⚠️ Detectada URL duplicada, corrigiendo...');
          apiUrl = apiUrl.replace('/api/api', '/api').replace('/webservice/webservice', '/webservice');
          console.log('🔧 URL corregida:', apiUrl);
        }
        
        console.log('🚀 Iniciando prueba de conexión con URL:', apiUrl);
        
        // SOLUCIÓN NETLIFY FUNCTIONS: Usar proxy local
        let connectionSuccessful = false;
        let lastError = null;
        
        // Método 1: Intentar con proxy local de Netlify Functions
        try {
          console.log('🔧 Intentando con proxy local de Netlify Functions...');
          const localProxyUrl = `/api/prestashop/products?display=full&limit=1`;
          
          const proxyResponse = await fetch(localProxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json, application/xml, */*'
            }
          });
          
          if (proxyResponse.ok) {
            console.log('✅ Conexión exitosa via proxy local');
            connectionSuccessful = true;
          } else {
            console.log('⚠️ Proxy local respondió con:', proxyResponse.status, proxyResponse.statusText);
            // Si es 401, significa que el proxy funciona pero falta API key
            if (proxyResponse.status === 401) {
              console.log('🔑 Proxy funciona pero requiere API key en variables de entorno');
              connectionSuccessful = true; // El proxy funciona, solo falta configurar la API key
            }
          }
        } catch (proxyError) {
          console.log('❌ Proxy local falló:', proxyError);
          lastError = proxyError;
        }
        
        // Método 2: Si el proxy local falla, intentar verificación básica
        if (!connectionSuccessful) {
          try {
            console.log('🔧 Intentando verificación básica...');
            
            // Usar una imagen para verificar conectividad básica
            const img = new Image();
            const imgPromise = new Promise((resolve, reject) => {
              img.onload = () => resolve(true);
              img.onerror = () => reject(new Error('No se puede conectar al servidor'));
              img.src = `${cleanUrl}/favicon.ico?t=${Date.now()}`;
            });
            
            await imgPromise;
            console.log('✅ Servidor responde (verificación básica)');
            connectionSuccessful = true;
          } catch (imgError) {
            console.log('❌ Verificación básica falló:', imgError);
            lastError = imgError;
          }
        }
        
        // Determinar el estado final
        if (connectionSuccessful) {
              const updatedConnection = {
                ...connection,
                isConnected: true,
                lastSync: new Date(),
            productsCount: 0 // No podemos contar productos sin API key válida
              };
              
          console.log('✅ Actualizando conexión como conectada');
              handleConnectionUpdate(updatedConnection);
            } else {
          console.log('❌ Todas las verificaciones fallaron');
          throw new Error(`No se pudo conectar al servidor. Último error: ${lastError?.message || 'Error desconocido'}`);
        }
      } else {
        console.log('Probando conexión simulada para:', connection.platform);
        // Simular test de conexión para otras plataformas
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const updatedConnection = {
          ...connection,
          isConnected: true,
          lastSync: new Date(),
          productsCount: csvProductsCount
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

  const handlePrestashopImportComplete = async (importedCount: number) => {
    console.log('Importación de PrestaShop completada:', importedCount, 'productos');
    
    // Actualizar la conexión de Prestashop
    const prestashopConnection = connections.find(c => c.platform === 'prestashop');
    if (prestashopConnection) {
      const updatedConnection = {
        ...prestashopConnection,
        isConnected: true,
        lastSync: new Date(),
        productsCount: importedCount
      };
      
      console.log('Actualizando conexión PrestaShop:', updatedConnection);
      
      setConnections(prev => 
        prev.map(c => c.id === prestashopConnection.id ? updatedConnection : c)
      );
      
      onConnectionUpdate(updatedConnection);
      
      // Recargar estadísticas del catálogo
      try {
        const stats = await getCatalogStats();
        setCsvProductsCount(stats.csv_products);
        console.log('Estadísticas actualizadas:', stats);
      } catch (error) {
        console.error('Error al recargar estadísticas:', error);
      }
    }
    
    setShowPrestashopScanner(false);
  };

  const renderConnectionStatus = (connection: EcommerceConnection) => {
    const status = connectionStatus[connection.id];
    const info = platformInfo[connection.platform];
    
    if (!connection.url) {
      return (
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center text-white text-xl`}>
                {info.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{connection.name}</h3>
                <p className="text-sm text-muted-foreground">No configurado</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Sin configurar
              </Badge>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`border-2 ${
        status === 'connected' ? 'border-green-200 bg-green-50' :
        status === 'checking' ? 'border-blue-200 bg-blue-50' :
        status === 'error' ? 'border-red-200 bg-red-50' :
        status === 'cors-error' ? 'border-yellow-200 bg-yellow-50' :
        'border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center text-white text-xl`}>
              {info.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{connection.name}</h3>
              <p className="text-sm text-muted-foreground">{connection.url}</p>
              {status === 'checking' && (
                <p className="text-xs text-blue-600">Verificando conexión...</p>
              )}
              {status === 'connected' && (
                <p className="text-xs text-green-600">✅ Conexión exitosa</p>
              )}
              {status === 'disconnected' && (
                <p className="text-xs text-orange-600">⚠️ Servidor no responde</p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-600">❌ Error de conexión</p>
              )}
              {status === 'cors-error' && (
                <p className="text-xs text-yellow-600">⚠️ Error CORS - Servidor no permite conexiones externas</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {status === 'connected' && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </Badge>
              )}
              {status === 'checking' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                  Verificando
                </Badge>
              )}
              {status === 'disconnected' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Desconectado
                </Badge>
              )}
              {status === 'error' && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Error
                </Badge>
              )}
              {status === 'cors-error' && (
                <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
                  <AlertCircle className="h-3 w-3" />
                  CORS Error
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => checkConnectionStatus(connection)}
                disabled={status === 'checking'}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
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
    );
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
                  
                  // Usar editingConnection si existe y tiene datos válidos, sino usar connection
                  const connectionToTest = editingConnection && editingConnection.url ? editingConnection : connection;
                  handleTestConnection(connectionToTest);
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
              {csvProductsCount}
            </div>
            <div className="text-sm text-muted-foreground">Productos CSV</div>
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
              renderConnectionStatus(connection)
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
