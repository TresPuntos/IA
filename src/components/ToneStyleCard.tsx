import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function ToneStyleCard() {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Tono y Personalidad</CardTitle>
        <CardDescription>Define cómo debe comunicarse la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Selector de Tono</Label>
          <Select defaultValue="friendly">
            <SelectTrigger id="tone" className="bg-input-background">
              <SelectValue placeholder="Seleccionar tono" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Cercano y amigable</SelectItem>
              <SelectItem value="premium">Premium y sofisticado</SelectItem>
              <SelectItem value="technical">Técnico y preciso</SelectItem>
              <SelectItem value="casual">Casual y relajado</SelectItem>
              <SelectItem value="professional">Profesional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="system-prompt">System Prompt</Label>
          <Textarea 
            id="system-prompt" 
            placeholder="Eres un asistente experto en tecnología..."
            rows={6}
            defaultValue="Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible."
            className="resize-none font-mono bg-input-background"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style-instructions">Instrucciones de Estilo o Lenguaje</Label>
          <Input 
            id="style-instructions" 
            placeholder="ej., Siempre usa emojis, Habla en español..."
            defaultValue="Usa un español neutro y profesional"
            className="bg-input-background"
          />
        </div>
      </CardContent>
    </Card>
  );
}
