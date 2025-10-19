import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useConfig } from "../lib/ConfigContext";

export function ToneStyleCard() {
  const { config, updateConfig } = useConfig();

  return (
    <Card className="figma-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">System Prompt Principal</CardTitle>
        <CardDescription className="text-sm">Configura el comportamiento principal de la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium">Tono de Comunicación</Label>
          <Select 
            value={config.tone} 
            onValueChange={(value) => updateConfig({ tone: value as any })}
          >
            <SelectTrigger id="tone" className="apple-input h-9">
              <SelectValue placeholder="Seleccionar tono" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">👋 Cercano y amigable</SelectItem>
              <SelectItem value="premium">✨ Premium y sofisticado</SelectItem>
              <SelectItem value="technical">🔧 Técnico y preciso</SelectItem>
              <SelectItem value="casual">😊 Casual y relajado</SelectItem>
              <SelectItem value="professional">📋 Profesional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="system-prompt" className="text-sm font-medium">System Prompt Principal</Label>
          <Textarea 
            id="system-prompt" 
            placeholder="Eres un asistente especializado en ayudar a clientes..."
            rows={8}
            value={config.systemPrompt}
            onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
            className="resize-none font-mono apple-input"
          />
          <p className="text-xs text-gray-500">
            Este es el prompt principal que seguirá OpenAI para todas las respuestas. 
            Incluye aquí todas las instrucciones sobre cómo debe comportarse la IA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}