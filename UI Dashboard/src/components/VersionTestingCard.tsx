import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, RotateCcw } from "lucide-react";
import { type ChatConfig } from "../utils/api";

interface VersionTestingCardProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function VersionTestingCard({ config, setConfig }: VersionTestingCardProps) {
  return (
    <Card className="shadow-lg border-border/50">
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
            onChange={(e) => setConfig({ ...config, versionTag: e.target.value })}
            className="bg-input-background border-border/50"
          />
          <p className="text-muted-foreground">Rastrea diferentes configuraciones de prompts</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="default" className="w-full border-border/50">
            <Play className="mr-2 h-4 w-4" />
            Probar Chat
          </Button>
          
          <Button variant="outline" className="w-full border-border/50">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Valores
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
