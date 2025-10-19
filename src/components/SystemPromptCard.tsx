import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useConfig } from "../lib/ConfigContext";

export function SystemPromptCard() {
  const { config, updateConfig } = useConfig();

  return (
    <Card className="ios26-card">
      <CardHeader className="pb-3">
        <CardTitle className="ios26-subtitle">System Prompt Principal</CardTitle>
        <CardDescription className="ios26-caption">Configura el comportamiento principal de la IA</CardDescription>
      </CardHeader>
      <CardContent className="ios26-spacing-compact">
        <div className="space-y-2">
          <Label htmlFor="tone" className="ios26-body font-medium">Tono de Comunicación</Label>
          <Select 
            value={config.tone} 
            onValueChange={(value) => updateConfig({ tone: value as any })}
          >
            <SelectTrigger id="tone" className="ios26-select h-9">
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
          <Label htmlFor="main-system-prompt" className="ios26-body font-medium">System Prompt Principal</Label>
          <Textarea 
            id="main-system-prompt" 
            placeholder="Eres un asistente especializado en ayudar a clientes..."
            rows={10}
            value={config.systemPrompt}
            onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
            className="ios26-textarea font-mono"
          />
          <p className="ios26-caption">
            Este es el ÚNICO prompt que seguirá OpenAI para todas las respuestas. 
            Incluye aquí todas las instrucciones sobre cómo debe comportarse la IA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
