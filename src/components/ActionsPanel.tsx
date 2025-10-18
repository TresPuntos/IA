import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Copy, MessageSquare, RotateCcw } from "lucide-react";
import { getCurrentConfig } from "../lib/config";
import { saveConfig, resetConfig } from "../lib/configStorage";
import { toast } from "sonner";

export function ActionsPanel() {
  const handleSaveConfig = () => {
    try {
      const config = getCurrentConfig();
      saveConfig(config);
      toast.success("Configuración guardada correctamente", {
        description: `Configuración de ${config.siteName} guardada en localStorage`
      });
    } catch (error) {
      toast.error("Error al guardar configuración", {
        description: "No se pudo guardar la configuración"
      });
    }
  };

  const handleTestChat = () => {
    // Scroll to chat section
    const chatSection = document.querySelector('[data-testid="chat-section"]') || 
                       document.querySelector('.space-y-4');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast.info("Prueba el chat en la sección de versiones", {
      description: "Usa el botón 'Probar Chat' en la sección de pruebas"
    });
  };

  const handleDuplicate = () => {
    const config = getCurrentConfig();
    const configText = JSON.stringify(config, null, 2);
    
    navigator.clipboard.writeText(configText).then(() => {
      toast.success("Configuración copiada al portapapeles", {
        description: "Puedes pegar la configuración en otro lugar"
      });
    }).catch(() => {
      toast.error("Error al copiar configuración");
    });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres resetear toda la configuración? Esta acción no se puede deshacer.")) {
      resetConfig();
      toast.success("Configuración reseteada", {
        description: "La página se recargará con valores por defecto"
      });
    }
  };

  return (
    <Card className="shadow-lg border-2 border-primary/30 bg-card/80">
      <CardHeader>
        <CardTitle>Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="lg" onClick={handleSaveConfig}>
          <Save className="mr-2 h-5 w-5" />
          Guardar Configuración
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" size="lg" onClick={handleTestChat}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Probar Chat
          </Button>
          
          <Button variant="outline" className="w-full" size="lg" onClick={handleDuplicate}>
            <Copy className="mr-2 h-5 w-5" />
            Duplicar
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive" 
          size="lg"
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
