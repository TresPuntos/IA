import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useConfig } from "../lib/ConfigContext";

export function SystemPromptCard() {
  const { config, updateConfig } = useConfig();

  return (
    <Card className="figma-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">System Prompt Principal</CardTitle>
        <CardDescription className="text-sm">Escribe aquí el prompt principal que seguirá OpenAI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="main-system-prompt" className="text-sm font-medium">Prompt Principal</Label>
          <Textarea 
            id="main-system-prompt" 
            placeholder="Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente..."
            rows={10}
            value={config.systemPrompt}
            onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
            className="resize-none font-mono apple-input"
          />
          <p className="text-xs text-gray-500">
            Este es el ÚNICO prompt que seguirá OpenAI. Incluye aquí todas las instrucciones sobre cómo debe comportarse la IA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
