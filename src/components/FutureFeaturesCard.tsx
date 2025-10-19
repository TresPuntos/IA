import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, Activity, Gauge, BarChart3 } from "lucide-react";
import { useState } from "react";

export function FutureFeaturesCard() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="figma-card border-dashed">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/10 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <CardTitle>Funciones Avanzadas</CardTitle>
                  <Badge variant="outline" className="border-yellow-600/50 text-yellow-500">Próximamente</Badge>
                </div>
                <CardDescription>Monitoreo y límites (en desarrollo)</CardDescription>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="rounded-lg border border-border/50 bg-muted/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Contador de Tokens</span>
                </div>
                <span className="text-muted-foreground">-</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span>Rate Limit por Site ID</span>
                </div>
                <span className="text-muted-foreground">-</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Registro de Actividad</span>
                </div>
                <span className="text-muted-foreground">-</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-center">
              Estas funcionalidades estarán disponibles próximamente
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
