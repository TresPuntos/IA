import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { PrestashopScannedProduct } from '../lib/productCatalog';

interface PrestashopPreviewProps {
  products: PrestashopScannedProduct[];
  onConfirm: () => void;
  onCancel: () => void;
  isImporting?: boolean;
}

export function PrestashopPreview({ 
  products, 
  onConfirm, 
  onCancel, 
  isImporting = false 
}: PrestashopPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const itemsPerPage = 10;

  // Calcular estadísticas
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;
  const totalCombinations = products.reduce((sum, p) => sum + p.combinations.length, 0);
  const productsWithCombinations = products.filter(p => p.combinations.length > 0).length;

  // Calcular páginas
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const toggleProductExpansion = (productId: number) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatAttributes = (attributes: Array<{ name: string; value: string }>) => {
    return attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumen de Productos Escaneados
          </CardTitle>
          <CardDescription>
            Revisa los productos antes de importarlos a tu catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-muted-foreground">Total Productos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalCombinations}</div>
              <div className="text-sm text-muted-foreground">Combinaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{productsWithCombinations}</div>
              <div className="text-sm text-muted-foreground">Con Variantes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Encontrados</CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - {totalProducts} productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Combinaciones</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{product.name}</div>
                          {product.sku && (
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku}
                            </div>
                          )}
                          {product.category && (
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatPrice(product.price)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.stock_quantity}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.isActive ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {product.isActive ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {product.combinations.length}
                          </Badge>
                          {product.combinations.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleProductExpansion(product.id)}
                              className="h-6 w-6 p-0"
                            >
                              {expandedProducts.has(product.id) ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProductExpansion(product.id)}
                        >
                          {expandedProducts.has(product.id) ? 'Ocultar' : 'Ver'} Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Detalles expandidos */}
                    {expandedProducts.has(product.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/50">
                          <div className="space-y-4 p-4">
                            {/* Información del producto */}
                            <div>
                              <h4 className="font-medium mb-2">Información del Producto</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">ID:</span> {product.id}
                                </div>
                                {product.description && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Descripción:</span>
                                    <p className="mt-1 text-muted-foreground">
                                      {product.description}
                                    </p>
                                  </div>
                                )}
                                {product.image_url && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Imagen:</span>
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name}
                                      className="mt-1 h-20 w-20 object-cover rounded border"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Combinaciones */}
                            {product.combinations.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Combinaciones ({product.combinations.length})</h4>
                                <div className="space-y-2">
                                  {product.combinations.map((combo) => (
                                    <div 
                                      key={combo.id}
                                      className="flex items-center justify-between p-3 bg-background rounded border"
                                    >
                                      <div className="space-y-1">
                                        <div className="font-medium">
                                          {combo.reference || `Combinación ${combo.id}`}
                                        </div>
                                        {combo.attributes.length > 0 && (
                                          <div className="text-sm text-muted-foreground">
                                            {formatAttributes(combo.attributes)}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right space-y-1">
                                        <div className="font-medium">
                                          {formatPrice(combo.price)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Stock: {combo.quantity}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, totalProducts)} de {totalProducts} productos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas */}
      {inactiveProducts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Se encontraron {inactiveProducts} productos inactivos que no se importarán.
          </AlertDescription>
        </Alert>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isImporting}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={isImporting || totalProducts === 0}
          className="flex items-center gap-2"
        >
          {isImporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Importando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Importar {activeProducts} Productos
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
