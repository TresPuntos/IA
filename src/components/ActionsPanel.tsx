import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Copy, MessageSquare, RotateCcw, Settings } from "lucide-react";
import { toast } from "sonner";
import { useConfig } from "../lib/ConfigContext";

interface ActionsPanelProps {
  onSaveConfig: () => Promise<void>;
  onTestChat: () => Promise<void>;
  onDuplicate: () => void;
  onReset: () => Promise<void>;
  isLoading: boolean;
}

export function ActionsPanel({ onSaveConfig, onTestChat, onDuplicate, onReset, isLoading }: ActionsPanelProps) {

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
          onClick={onSaveConfig}
          disabled={isLoading}
        >
          <Save className="mr-2 h-5 w-5" />
          {isLoading ? "Guardando..." : "Guardar Configuración"}
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full h-12 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium" 
            size="lg" 
            onClick={onTestChat}
            disabled={isLoading}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Probar Chat
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium" 
            size="lg" 
            onClick={onDuplicate}
            disabled={isLoading}
          >
            <Copy className="mr-2 h-5 w-5" />
            Duplicar
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-12 border-red-600 bg-red-900/20 hover:bg-red-800/30 text-red-400 hover:text-red-300 font-medium" 
          size="lg"
          onClick={onReset}
          disabled={isLoading}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
