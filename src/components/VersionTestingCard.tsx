import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, RotateCcw } from "lucide-react";
import { testChat } from "@/lib/chat";

export function VersionTestingCard() {
  const [previewMsg, setPreviewMsg] = useState("Hola, ¿qué me recomiendas?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteId, setSiteId] = useState("exitbcn");

  const onTest = async () => {
    setLoading(true);
    setAnswer("");
    try {
      const r = await testChat(siteId.trim() || "exitbcn", previewMsg || "Hola");
      setAnswer(r.answer || "Sin respuesta");
    } catch (e: any) {
      setAnswer(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setPreviewMsg("Hola, ¿qué me recomiendas?");
    setAnswer("");
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Versión y Pruebas</CardTitle>
        <CardDescription>Control de versiones y testing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="test-site-id">Site ID</Label>
            <Input id="test-site-id" value={siteId} onChange={(e)=>setSiteId(e.target.value)} placeholder="exitbcn" className="bg-input-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version-tag">Version tag</Label>
            <div className="flex items-center gap-2">
              <Input id="version-tag" placeholder="v0.1" defaultValue="v0.1" className="bg-input-background" />
              <Badge variant="secondary">Testing</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preview-message">Mensaje de prueba</Label>
          <Input
            id="preview-message"
            value={previewMsg}
            onChange={(e) => setPreviewMsg(e.target.value)}
            placeholder="Escribe el mensaje de prueba…"
            className="bg-input-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" className="w-full" onClick={onTest} disabled={loading}>
            <Play className="mr-2 h-4 w-4" />
            {loading ? "Probando..." : "Probar Chat"}
          </Button>

          <Button variant="outline" className="w-full" onClick={onReset} disabled={loading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Valores
          </Button>
        </div>

        {!!answer && (
          <div className="rounded border p-3 text-sm whitespace-pre-wrap bg-background/40">
            {answer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}