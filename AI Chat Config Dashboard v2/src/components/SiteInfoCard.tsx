import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Copy } from "lucide-react";
import { type ChatConfig } from "../utils/api";

interface SiteInfoCardProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
  onDuplicate: () => void;
}

export function SiteInfoCard({ config, setConfig, onDuplicate }: SiteInfoCardProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Site Information</CardTitle>
        <CardDescription>Basic details about your chat instance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-id">Site ID</Label>
          <Input 
            id="site-id" 
            placeholder="site_12345" 
            value={config.siteId}
            onChange={(e) => setConfig({ ...config, siteId: e.target.value })}
            className="bg-input-background border-border/50" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-name">Nombre del Sitio</Label>
          <Input 
            id="site-name" 
            placeholder="Mi Tienda Premium" 
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            className="bg-input-background border-border/50" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-domain">Dominio</Label>
          <Input 
            id="site-domain" 
            placeholder="https://mitienda.com" 
            value={config.domain}
            onChange={(e) => setConfig({ ...config, domain: e.target.value })}
            className="bg-input-background border-border/50" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chat-status">Estado</Label>
          <Select 
            value={config.status}
            onValueChange={(value: 'testing' | 'live') => setConfig({ ...config, status: value })}
          >
            <SelectTrigger id="chat-status" className="bg-input-background border-border/50">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="w-full mt-2 border-border/50" onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar Configuración
        </Button>
      </CardContent>
    </Card>
  );
}
