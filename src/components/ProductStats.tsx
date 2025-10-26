// src/components/ProductStats.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  Database,
  FileText,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  csvFiles: number;
  ecommerceConnections: number;
  lastSync?: Date;
  syncStatus: 'success' | 'error' | 'pending' | 'idle';
  onDeleteCSV?: () => void;
  onDeleteWooCommerce?: () => void;
  onClearAll?: () => void;
}

export function ProductStats({
  totalProducts,
  activeProducts,
  csvFiles,
  ecommerceConnections,
  lastSync,
  syncStatus,
  onDeleteCSV,
  onDeleteWooCommerce,
  onClearAll
}: ProductStatsProps) {
  const getSyncStatusInfo = () => {
    switch (syncStatus) {
      case 'success':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: 'Sincronizado',
          variant: 'default' as const
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          text: 'Error',
          variant: 'destructive' as const
        };
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          text: 'Sincronizando...',
          variant: 'secondary' as const
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          text: 'Sin sincronizar',
          variant: 'outline' as const
        };
    }
  };

  const syncInfo = getSyncStatusInfo();

  return (
    <div className="space-y-4">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Productos</span>
            </div>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="text-xs text-muted-foreground">
              {activeProducts} activos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Productos Activos</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-xs text-muted-foreground">
              {totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}% del total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Archivos CSV</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{csvFiles}</div>
            <div className="text-xs text-muted-foreground">
              archivos subidos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Conexiones</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{ecommerceConnections}</div>
            <div className="text-xs text-muted-foreground">
              plataformas conectadas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de sincronización */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado de Sincronización
          </CardTitle>
          <CardDescription>
            Información sobre la última sincronización de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {syncInfo.icon}
              <div>
                <p className="font-medium">Estado: {syncInfo.text}</p>
                {lastSync && (
                  <p className="text-sm text-muted-foreground">
                    Última sincronización: {lastSync.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={syncInfo.variant}>
              {syncInfo.text}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de fuentes de datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fuentes de Datos
          </CardTitle>
          <CardDescription>
            Resumen de todas las fuentes que alimentan el catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Archivos CSV</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{csvFiles} archivos</Badge>
                {onDeleteCSV && csvFiles > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDeleteCSV}
                    className="h-7 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Conexiones Ecommerce</span>
              </div>
              <Badge variant="outline">{ecommerceConnections} plataformas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Limpiar Todo */}
      {onClearAll && (totalProducts > 0 || csvFiles > 0 || ecommerceConnections > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-800">⚠️ Zona de Peligro</h3>
                <p className="text-sm text-red-600">Eliminar todos los productos y conexiones</p>
              </div>
              <Button
                variant="destructive"
                onClick={onClearAll}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Todo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
