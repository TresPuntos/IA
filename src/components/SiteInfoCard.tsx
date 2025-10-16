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
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Información del Sitio</CardTitle>
            <CardDescription>Detalles básicos de tu instancia de chat</CardDescription>
          </div>
          <Badge variant="default" className="bg-green-600">Activo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-id">Site ID</Label>
          <Input id="site-id" placeholder="sitio_12345" defaultValue="sitio_12345" className="bg-input-background" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-name">Nombre o Alias del Proyecto</Label>
          <Input id="site-name" placeholder="Mi Tienda" defaultValue="Tienda Premium Tech" className="bg-input-background" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chat-status">Estado del Chat</Label>
          <Select defaultValue="active">
            <SelectTrigger id="chat-status" className="bg-input-background">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="testing">En pruebas</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          <Copy className="mr-2 h-4 w-4" />
          Duplicar Configuración
        </Button>
      </CardContent>
    </Card>
  );
}
