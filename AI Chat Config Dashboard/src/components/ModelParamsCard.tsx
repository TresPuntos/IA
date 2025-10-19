import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type ChatConfig } from "../utils/api";

interface ModelParamsCardProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function ModelParamsCard({ config, setConfig }: ModelParamsCardProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Parámetros del Modelo</CardTitle>
        <CardDescription>Ajusta el comportamiento de la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input 
              id="temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="bg-input-background border-border/50"
            />
            <p className="text-muted-foreground">0-2</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="top-p">Top-p</Label>
            <Input 
              id="top-p"
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => setConfig({ ...config, topP: parseFloat(e.target.value) })}
              className="bg-input-background border-border/50"
            />
            <p className="text-muted-foreground">0-1</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input 
            id="max-tokens"
            type="number"
            min="1"
            max="4096"
            step="1"
            value={config.maxTokens}
            onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
            className="bg-input-background border-border/50"
          />
          <p className="text-muted-foreground">Longitud máxima de respuesta</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select 
            value={config.language}
            onValueChange={(value) => setConfig({ ...config, language: value })}
          >
            <SelectTrigger id="language" className="bg-input-background border-border/50">
              <SelectValue placeholder="Seleccionar idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español (es)</SelectItem>
              <SelectItem value="en">English (en)</SelectItem>
              <SelectItem value="pt">Português (pt)</SelectItem>
              <SelectItem value="fr">Français (fr)</SelectItem>
              <SelectItem value="de">Deutsch (de)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="border-t border-border pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-message">Mensaje de Bienvenida</Label>
            <Input 
              id="welcome-message" 
              placeholder="¡Hola! ¿En qué puedo ayudarte hoy?"
              value={config.welcomeMessage}
              onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
              className="bg-input-background border-border/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fallback-message">Mensaje Fallback</Label>
            <Textarea 
              id="fallback-message" 
              placeholder="Lo siento, no tengo información sobre eso..."
              rows={2}
              value={config.fallbackMessage}
              onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
              className="resize-none bg-input-background border-border/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
