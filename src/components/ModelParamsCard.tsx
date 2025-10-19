import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useConfig } from "../lib/ConfigContext";

export function ModelParamsCard() {
  const { config, updateConfig } = useConfig();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Verificar estado de conexión
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Verificar si la Edge Function está disponible
        const response = await fetch('https://akwobmrcwqbbrdvzyiul.supabase.co/functions/v1/openai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ test: true })
        });
        
        if (response.status === 404) {
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connected');
        }
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  return (
        <Card className="figma-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Parámetros del Modelo</CardTitle>
            <CardDescription className="text-sm">Ajusta el comportamiento de la IA</CardDescription>
          </div>
          <Badge 
            variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
            className={`text-xs ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {connectionStatus === 'connected' ? '🔗 Conectado' : '❌ Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">Modelo de OpenAI</Label>
          <Select 
            value={config.model} 
            onValueChange={(value) => updateConfig({ model: value as any })}
          >
            <SelectTrigger id="model" className="apple-input h-9">
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido)</SelectItem>
              <SelectItem value="gpt-4">GPT-4 (Alta calidad)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Balanceado)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (Más inteligente)</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Económico)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Selecciona el modelo de OpenAI a utilizar</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium">Temperature</Label>
            <span className="text-xs text-muted-foreground">{config.temperature}</span>
          </div>
          <Slider 
            id="temperature"
            value={[config.temperature]} 
            onValueChange={(value) => updateConfig({ temperature: value[0] })}
            max={2} 
            step={0.1} 
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Controla la aleatoriedad (0 = preciso, 2 = creativo)</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="top-p" className="text-sm font-medium">Top-p</Label>
            <span className="text-xs text-muted-foreground">{config.topP}</span>
          </div>
          <Slider 
            id="topP"
            value={[config.topP]} 
            onValueChange={(value) => updateConfig({ topP: value[0] })}
            max={1} 
            step={0.05}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Controla la diversidad de respuestas</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="max-tokens" className="text-sm font-medium">Max Tokens</Label>
            <span className="text-xs text-muted-foreground">{config.maxTokens}</span>
          </div>
          <Slider 
            id="maxTokens"
            value={[config.maxTokens]} 
            onValueChange={(value) => updateConfig({ maxTokens: value[0] })}
            max={4096} 
            step={128}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Longitud máxima de respuesta</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">Idioma por Defecto</Label>
          <Select 
            value={config.language} 
            onValueChange={(value) => updateConfig({ language: value as any })}
          >
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
