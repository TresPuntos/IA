import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Copy, MessageSquare, RotateCcw } from "lucide-react";

interface ActionsPanelProps {
  onSave: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  loading: boolean;
}

export function ActionsPanel({ onSave, onDuplicate, onReset, loading }: ActionsPanelProps) {
  return (
    <Card className="shadow-lg border-2 border-primary/30 bg-card/80">
      <CardHeader>
        <CardTitle>Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="lg" onClick={onSave} disabled={loading}>
          <Save className="mr-2 h-5 w-5" />
          {loading ? 'Guardando...' : '✅ Guardar Configuración'}
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full border-border/50" size="lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            ✅ Probar Chat
          </Button>
          
          <Button variant="outline" className="w-full border-border/50" size="lg" onClick={onDuplicate} disabled={loading}>
            <Copy className="mr-2 h-5 w-5" />
            ✅ Duplicar
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive" 
          size="lg"
          onClick={onReset}
          disabled={loading}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          ✅ Reset
        </Button>
      </CardContent>
    </Card>
  );
}
