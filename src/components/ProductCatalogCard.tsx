import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Upload, Link as LinkIcon, CheckCircle2, XCircle, Clock } from "lucide-react";

export function ProductCatalogCard() {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Catálogo de Productos</CardTitle>
        <CardDescription>Conecta tu base de datos de productos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Subir CSV Manual</Label>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Elegir Archivo CSV
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
        
        <div className="space-y-2">
          <Label htmlFor="woocommerce-url">URL de API WooCommerce</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="woocommerce-url" 
                placeholder="https://tutienda.com/wp-json/wc/v3"
                className="pl-9 bg-input-background"
              />
            </div>
            <Button variant="outline">Conectar</Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-destructive" />
              No configurado
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Productos:</span>
            <span>0 cargados</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Último update:</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Nunca</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
