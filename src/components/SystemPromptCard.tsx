import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useConfig } from "../lib/ConfigContext";

export function SystemPromptCard() {
  const { config, updateConfig } = useConfig();

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-card-foreground">System Prompt Principal</CardTitle>
        <CardDescription className="text-muted-foreground">Configura el comportamiento principal de la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="main-system-prompt" className="text-sm font-medium text-card-foreground">System Prompt Principal ÚNICO</Label>
          <Textarea 
            id="main-system-prompt" 
            placeholder="Eres un asistente especializado en ayudar a clientes..."
            rows={10}
            value={config.systemPrompt}
            onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
            className="font-mono resize-none bg-input-background border-border/50"
          />
          <p className="text-xs text-muted-foreground">
            Este es el ÚNICO prompt que seguirá OpenAI para todas las respuestas. 
            Incluye aquí todas las instrucciones sobre cómo debe comportarse la IA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
