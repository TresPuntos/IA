// src/components/OpenAIConfigCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OpenAIConfigCard() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Cargar API key guardada al montar el componente
  useState(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  });

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error('Por favor, introduce una API key válida');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('La API key debe comenzar con "sk-"');
      return;
    }

    try {
      localStorage.setItem('openai_api_key', apiKey);
      setIsValid(true);
      toast.success('API key guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar la API key');
    }
  };

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Por favor, introduce una API key');
      return;
    }

    setIsValidating(true);
    
    try {
      // Hacer una llamada de prueba a OpenAI
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });

      if (response.ok) {
        setIsValid(true);
        toast.success('API key válida ✅');
      } else {
        setIsValid(false);
        toast.error('API key inválida ❌');
      }
    } catch (error) {
      setIsValid(false);
      toast.error('Error al validar la API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsValid(null);
    toast.success('API key eliminada');
  };

  const getStatusBadge = () => {
    if (isValid === null) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Key className="h-3 w-3 text-muted-foreground" />
          No configurado
        </Badge>
      );
    }
    
    if (isValid) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 border-green-600/50">
          <CheckCircle className="h-3 w-3 text-green-500" />
          Configurado
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 border-red-600/50">
        <AlertCircle className="h-3 w-3 text-red-500" />
        Inválida
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configuración OpenAI
        </CardTitle>
        <CardDescription>
          Configura tu API key de OpenAI para usar GPT en el chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openai-key">API Key de OpenAI</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="openai-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleValidateKey}
              disabled={isValidating || !apiKey.trim()}
            >
              {isValidating ? 'Validando...' : 'Validar'}
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Obtén tu API key desde: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com/api-keys</a>
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
            Guardar API Key
          </Button>
          {isValid && (
            <Button variant="outline" onClick={handleRemoveKey}>
              Eliminar
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado:</span>
            {getStatusBadge()}
          </div>
          {isValid && (
            <div className="mt-2 text-xs text-muted-foreground">
              ✅ La API key está configurada y funcionando
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Nota:</strong> Tu API key se guarda localmente en tu navegador.</p>
          <p><strong>Seguridad:</strong> Nunca compartas tu API key con terceros.</p>
          <p><strong>Costo:</strong> El uso de OpenAI genera costos según el modelo utilizado.</p>
        </div>
      </CardContent>
    </Card>
  );
}
