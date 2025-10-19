import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useConfig } from "../lib/ConfigContext";

export function ToneStyleCard() {
  const { config, updateConfig } = useConfig();

  return (
    <Card className="figma-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sistema de Prompts y Tono</CardTitle>
        <CardDescription className="text-sm">Configura cómo debe comportarse la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Prompt Principal</TabsTrigger>
            <TabsTrigger value="specific">Prompts Específicos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-4">
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
                rows={4}
                value={config.systemPrompt}
                onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                className="resize-none font-mono apple-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style-instructions" className="text-sm font-medium">Instrucciones de Estilo</Label>
              <Input 
                id="style-instructions" 
                placeholder="ej., Siempre usa emojis, Habla en español..."
                value={config.styleInstructions}
                onChange={(e) => updateConfig({ styleInstructions: e.target.value })}
                className="apple-input h-9"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="specific" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-prompt" className="text-sm font-medium">Prompt para Productos</Label>
              <Textarea 
                id="product-prompt" 
                placeholder="Cuando el cliente pregunte sobre productos..."
                rows={3}
                value={config.productPrompt}
                onChange={(e) => updateConfig({ productPrompt: e.target.value })}
                className="resize-none font-mono apple-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="support-prompt" className="text-sm font-medium">Prompt para Soporte</Label>
              <Textarea 
                id="support-prompt" 
                placeholder="Para consultas técnicas o problemas..."
                rows={3}
                value={config.supportPrompt}
                onChange={(e) => updateConfig({ supportPrompt: e.target.value })}
                className="resize-none font-mono apple-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sales-prompt" className="text-sm font-medium">Prompt para Ventas</Label>
              <Textarea 
                id="sales-prompt" 
                placeholder="Para ayudar con ventas..."
                rows={3}
                value={config.salesPrompt}
                onChange={(e) => updateConfig({ salesPrompt: e.target.value })}
                className="resize-none font-mono apple-input"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}