import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, Link as LinkIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { type ChatConfig } from "../utils/api";

interface ProductCatalogCardProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function ProductCatalogCard({ config, setConfig }: ProductCatalogCardProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Catálogo de Productos</CardTitle>
        <CardDescription>Conecta tu base de datos de productos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="catalog-source">Selector de Fuente</Label>
          <Select 
            value={config.catalogSource}
            onValueChange={(value) => setConfig({ ...config, catalogSource: value })}
          >
            <SelectTrigger id="catalog-source" className="bg-input-background border-border/50">
              <SelectValue placeholder="Seleccionar fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No configurado</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="woocommerce">API WooCommerce</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="catalog-url">URL/API o Ruta al Archivo</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="catalog-url" 
                placeholder="https://tutienda.com/wp-json/wc/v3 o /path/products.csv"
                value={config.catalogUrl}
                onChange={(e) => setConfig({ ...config, catalogUrl: e.target.value })}
                className="pl-9 bg-input-background border-border/50"
              />
            </div>
            <Button variant="outline" className="border-border/50">
              <Upload className="mr-2 h-4 w-4" />
              Cargar
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <Badge variant="outline" className="flex items-center gap-1 border-yellow-600/50">
              <XCircle className="h-3 w-3 text-yellow-500" />
              No configurado
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Productos cargados:</span>
            <span>0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
