import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function ModelParamsCard() {
  return (
    <Card className="premium-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Parámetros del Modelo</CardTitle>
        <CardDescription className="text-sm">Ajusta el comportamiento de la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium">Temperature</Label>
            <span className="text-xs text-muted-foreground">0.7</span>
          </div>
          <Slider 
            id="temperature"
            defaultValue={[0.7]} 
            max={2} 
            step={0.1} 
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Controla la aleatoriedad (0 = preciso, 2 = creativo)</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="top-p" className="text-sm font-medium">Top-p</Label>
            <span className="text-xs text-muted-foreground">0.9</span>
          </div>
          <Slider 
            id="top-p"
            defaultValue={[0.9]} 
            max={1} 
            step={0.05}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Controla la diversidad de respuestas</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-tokens" className="text-sm font-medium">Max Tokens</Label>
            <span className="text-xs text-muted-foreground">2048</span>
          </div>
          <Slider 
            id="max-tokens"
            defaultValue={[2048]} 
            max={4096} 
            step={128}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Longitud máxima de respuesta</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">Idioma por Defecto</Label>
          <Select defaultValue="es">
            <SelectTrigger id="language" className="apple-input h-9">
              <SelectValue placeholder="Seleccionar idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="border-t border-border/50 pt-3 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="welcome-message" className="text-sm font-medium">Mensaje de Bienvenida</Label>
            <Textarea 
              id="welcome-message" 
              placeholder="¡Hola! ¿En qué puedo ayudarte hoy?"
              rows={2}
              defaultValue="¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
              className="resize-none apple-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fallback-message" className="text-sm font-medium">Mensaje Fallback</Label>
            <Textarea 
              id="fallback-message" 
              placeholder="Lo siento, no tengo información sobre eso..."
              rows={2}
              defaultValue="Disculpa, no tengo información específica sobre eso. ¿Puedo ayudarte con algo más?"
              className="resize-none apple-input"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
