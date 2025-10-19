import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Copy, MessageSquare, RotateCcw, Settings } from "lucide-react";
import { getCurrentConfig } from "../lib/config";
import { saveConfig, resetConfig } from "../lib/configStorage";
import { toast } from "sonner";

export function ActionsPanel() {
  const handleSaveConfig = async () => {
    try {
      const config = getCurrentConfig();
      const result = await saveConfig(config);
      
      if (result.success) {
        toast.success("Configuración guardada correctamente", {
          description: `Configuración de ${config.siteName} guardada en Supabase`
        });
      } else {
        toast.warning("Configuración guardada con advertencias", {
          description: result.error || "Se guardó pero con algunos problemas"
        });
      }
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

  const handleReset = async () => {
    if (confirm("¿Estás seguro de que quieres resetear toda la configuración? Esta acción no se puede deshacer.")) {
      await resetConfig();
      toast.success("Configuración reseteada", {
        description: "La configuración ha sido eliminada de Supabase y localStorage"
      });
    }
  };

  return (
    <Card className="figma-card">
      <CardHeader className="pb-4 border-b border-slate-800">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-400" />
          Acciones Principales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Button 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200" 
          size="lg" 
          onClick={handleSaveConfig}
        >
          <Save className="mr-2 h-5 w-5" />
          Guardar Configuración
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full h-12 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium" 
            size="lg" 
            onClick={handleTestChat}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Probar Chat
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium" 
            size="lg" 
            onClick={handleDuplicate}
          >
            <Copy className="mr-2 h-5 w-5" />
            Duplicar
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-12 border-red-600 bg-red-900/20 hover:bg-red-800/30 text-red-400 hover:text-red-300 font-medium" 
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
