import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Copy } from "lucide-react";

export function SiteInfoCard() {
  return (
    <Card className="figma-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Información del Sitio</CardTitle>
            <CardDescription className="text-sm">Detalles básicos de tu instancia de chat</CardDescription>
          </div>
          <Badge variant="default" className="bg-green-600 text-xs">Activo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="site-id" className="text-sm font-medium">Site ID</Label>
          <Input id="site-id" placeholder="sitio_12345" defaultValue="sitio_12345" className="apple-input h-9" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-name" className="text-sm font-medium">Nombre o Alias del Proyecto</Label>
          <Input id="site-name" placeholder="Mi Tienda" defaultValue="Tienda Premium Tech" className="apple-input h-9" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chat-status" className="text-sm font-medium">Estado del Chat</Label>
          <Select defaultValue="active">
            <SelectTrigger id="chat-status" className="apple-input h-9">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="testing">En pruebas</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="w-full mt-3 h-9 apple-button">
          <Copy className="mr-2 h-4 w-4" />
          Duplicar Configuración
        </Button>
      </CardContent>
    </Card>
  );
}
