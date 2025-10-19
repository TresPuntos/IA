import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Play, RotateCcw, Bot, User, Send } from "lucide-react";
import { useConfig } from "../lib/ConfigContext";
import { useState } from "react";
import { testChat } from "../lib/chat";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Testing() {
  const { config, updateConfig } = useConfig();
  const [testMessage, setTestMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestChat = async () => {
    if (!testMessage.trim()) return;
    
    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: testMessage.trim(),
      timestamp: new Date()
    };
    
    // Añadir mensaje del usuario al historial
    setMessages(prev => [...prev, userMessage]);
    
    // Limpiar input
    setTestMessage("");
    
    setIsLoading(true);
    try {
      // Construir contexto de conversación
      const conversationContext = messages
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n');
      
      // Crear mensaje con contexto
      const contextualMessage = conversationContext 
        ? `Contexto de la conversación anterior:\n${conversationContext}\n\nNueva pregunta del usuario: ${userMessage.content}`
        : userMessage.content;
      
      const response = await testChat(config.siteId, contextualMessage);
      
      // Crear mensaje del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer || "No se pudo obtener respuesta",
        timestamp: new Date()
      };
      
      // Añadir respuesta del asistente al historial
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      // Crear mensaje de error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "❌ Error al probar el chat: " + (error as Error).message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTestMessage("");
    setMessages([]);
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
            <CardDescription>Test your AI responses with conversation memory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-message">Test Message</Label>
              <div className="flex gap-2">
                <Input 
                  id="test-message" 
                  placeholder="Escribe un mensaje para probar..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="bg-input-background border-border/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleTestChat()}
                />
                <Button 
                  onClick={handleTestChat}
                  disabled={isLoading || !testMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Conversation History */}
            <div className="space-y-2">
              <Label>Conversation History</Label>
              <div className="bg-muted/50 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay mensajes aún. ¡Empieza una conversación!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.role === 'user' ? 'Tú' : 'Asistente'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap bg-background/50 rounded p-2">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">AI está escribiendo...</span>
                  </div>
                )}
              </div>
            </div>
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
