import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useConfig } from "../lib/ConfigContext";

interface ConfigurationProps {
  onDuplicate: () => void;
}

export function Configuration({ onDuplicate }: ConfigurationProps) {
  const { config, updateConfig, isLoading } = useConfig();

  // Verificación de seguridad para systemPrompt
  if (isLoading || !config || !config.systemPrompt) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="tracking-tight mb-2">Configuration</h1>
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Configuration</h1>
        <p className="text-muted-foreground">Configure your AI chat settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic details about your chat instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-id">Site ID</Label>
              <Input 
                id="site-id" 
                value={config.siteId}
                onChange={(e) => updateConfig({ siteId: e.target.value })}
                placeholder="100chef"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input 
                id="site-name" 
                value={config.siteName}
                onChange={(e) => updateConfig({ siteName: e.target.value })}
                placeholder="100%Chef - Herramientas Cocina"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="client-url">URL del Cliente</Label>
              <Input 
                id="client-url" 
                value={config.clientUrl}
                onChange={(e) => updateConfig({ clientUrl: e.target.value })}
                placeholder="https://100x100chef.com/"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chat-status">Chat Status</Label>
              <Select 
                value={config.chatStatus}
                onValueChange={(value) => updateConfig({ chatStatus: value as any })}
              >
                <SelectTrigger id="chat-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version-tag">Version Tag</Label>
              <Input 
                id="version-tag" 
                value={config.versionTag}
                onChange={(e) => updateConfig({ versionTag: e.target.value })}
                placeholder="v1.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Prompt Principal</CardTitle>
          <CardDescription>Configura el comportamiento principal de la IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="main-system-prompt" className="text-sm font-medium">
              Prompt Principal ÚNICO
            </Label>
            <Textarea 
              id="main-system-prompt"
              placeholder="Eres un asistente especializado en ayudar a clientes..."
              rows={8}
              value={config.systemPrompt}
              onChange={(e) => updateConfig({ 
                systemPrompt: e.target.value 
              })}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Solo incluye información esencial de la empresa y nuevas instrucciones específicas. 
              El sistema automáticamente maneja el formato, tono, catálogo y otras funcionalidades.
            </p>
          </div>
        </CardContent>
      </Card>
      
 <Card>
 <CardHeader>
 <CardTitle>Configuración PrestaShop</CardTitle>
 <CardDescription>Credenciales para conectar tu tienda PrestaShop</CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="space-y-2">
 <Label htmlFor="prestashop-url">URL de la API PrestaShop</Label>
 <Input 
 id="prestashop-url" 
 type="url"
 value={config.prestashopUrl || ''}
 onChange={(e) => updateConfig({ prestashopUrl: e.target.value })}
 placeholder="https://tu-tienda.com/api/"
 />
 <p className="text-sm text-muted-foreground">
 La URL debe terminar en /api/ para ser válida
 </p>
 </div>
 <div className="space-y-2">
 <Label htmlFor="prestashop-key">PrestaShop API Key</Label>
 <Input 
 id="prestashop-key" 
 type="password"
 value={config.prestashopApiKey || ''}
 onChange={(e) => updateConfig({ prestashopApiKey: e.target.value })}
 placeholder="Tu API Key aquí"
 />
<p className="text-sm text-muted-foreground">
Genera tu API Key en PrestaShop &gt; Avanzado &gt; Web service
</p>
 </div>
 </CardContent>
 </Card>
    </div>
  );
}
