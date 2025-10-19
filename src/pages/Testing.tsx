import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Play, RotateCcw, Bot, User } from "lucide-react";
import { useConfig } from "../lib/ConfigContext";
import { useState } from "react";
import { testChat } from "../lib/chat";

export function Testing() {
  const { config, updateConfig } = useConfig();
  const [testMessage, setTestMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTestChat = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await testChat(config.siteId, testMessage);
      setChatResponse(response.answer || "No se pudo obtener respuesta");
    } catch (error) {
      setChatResponse("❌ Error al probar el chat: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTestMessage("");
    setChatResponse("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Testing</h1>
        <p className="text-muted-foreground">Test your AI chat configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Version & Testing</CardTitle>
            <CardDescription>Version control and testing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="version-tag">Version Tag</Label>
                <Badge variant="secondary" className="bg-primary/20 text-primary">{config.versionTag}</Badge>
              </div>
              <Input 
                id="version-tag" 
                placeholder="ej., v1.0, producción, prueba-A/B-2"
                value={config.versionTag}
                onChange={(e) => updateConfig({ versionTag: e.target.value })}
                className="bg-input-background border-border/50"
              />
              <p className="text-muted-foreground">Rastrea diferentes configuraciones de prompts</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="default" 
                className="w-full border-border/50"
                onClick={handleTestChat}
                disabled={isLoading || !testMessage.trim()}
              >
                <Play className="mr-2 h-4 w-4" />
                {isLoading ? 'Testing...' : 'Probar Chat'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-border/50"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Valores
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Test Card */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Test</CardTitle>
            <CardDescription>Test your AI responses in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-message">Test Message</Label>
              <Input 
                id="test-message" 
                placeholder="Escribe un mensaje para probar..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="bg-input-background border-border/50"
                onKeyPress={(e) => e.key === 'Enter' && handleTestChat()}
              />
            </div>

            {chatResponse && (
              <div className="space-y-2">
                <Label>AI Response</Label>
                <div className="bg-muted/50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{chatResponse}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Testing chat...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Active settings being tested</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-muted-foreground mb-1">Model</p>
              <p className="font-medium">{config.model}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Temperature</p>
              <p className="font-medium">{config.temperature}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Tone</p>
              <p className="font-medium capitalize">{config.tone}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Language</p>
              <p className="font-medium uppercase">{config.language}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
