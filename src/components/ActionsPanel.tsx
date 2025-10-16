import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Save, Copy, MessageSquare, RotateCcw } from "lucide-react";

export function ActionsPanel() {
  return (
    <Card className="shadow-lg border-2 border-primary/30 bg-card/80">
      <CardHeader>
        <CardTitle>Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="lg">
          <Save className="mr-2 h-5 w-5" />
          Guardar Configuración
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" size="lg">
            <MessageSquare className="mr-2 h-5 w-5" />
            Probar Chat
          </Button>
          
          <Button variant="outline" className="w-full" size="lg">
            <Copy className="mr-2 h-5 w-5" />
            Duplicar
          </Button>
        </div>
        
        <Button variant="outline" className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive" size="lg">
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
