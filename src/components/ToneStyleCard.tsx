import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function ToneStyleCard() {
  return (
    <Card className="figma-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tono y Personalidad</CardTitle>
        <CardDescription className="text-sm">Define cómo debe comunicarse la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium">Selector de Tono</Label>
          <Select defaultValue="friendly">
            <SelectTrigger id="tone" className="apple-input h-9">
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
          <Label htmlFor="system-prompt" className="text-sm font-medium">System Prompt</Label>
          <Textarea 
            id="system-prompt" 
            placeholder="Eres un asistente experto en tecnología..."
            rows={4}
            defaultValue="Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible."
            className="resize-none font-mono apple-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style-instructions" className="text-sm font-medium">Instrucciones de Estilo</Label>
          <Input 
            id="style-instructions" 
            placeholder="ej., Siempre usa emojis, Habla en español..."
            defaultValue="Usa un español neutro y profesional"
            className="apple-input h-9"
          />
        </div>
      </CardContent>
    </Card>
  );
}
