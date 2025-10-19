import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type ChatConfig } from "../utils/api";

interface ToneStyleCardProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function ToneStyleCard({ config, setConfig }: ToneStyleCardProps) {
  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Tone & Personality</CardTitle>
        <CardDescription>Define how the AI should communicate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Selector de Tono</Label>
          <Select 
            value={config.tone}
            onValueChange={(value) => setConfig({ ...config, tone: value })}
          >
            <SelectTrigger id="tone" className="bg-input-background border-border/50">
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
            value={config.systemPrompt}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            className="resize-none font-mono bg-input-background border-border/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style-instructions">Instrucciones de Estilo o Lenguaje</Label>
          <Input 
            id="style-instructions" 
            placeholder="ej., Siempre usa emojis, Habla en español..."
            value={config.styleInstructions}
            onChange={(e) => setConfig({ ...config, styleInstructions: e.target.value })}
            className="bg-input-background border-border/50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
