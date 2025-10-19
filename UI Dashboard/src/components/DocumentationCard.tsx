import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export function DocumentationCard() {
  // Simulación de archivos cargados
  const uploadedFiles = [
    { name: "guia_productos.pdf", status: "ready" },
    { name: "faq_soporte.txt", status: "processing" }
  ];

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Additional Documentation</CardTitle>
        <CardDescription>Upload files to enhance AI knowledge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start border-border/50">
            <Upload className="mr-2 h-4 w-4" />
            Subir Documento
          </Button>
          <p className="text-muted-foreground">PDF, TXT, CSV • Máx. 10MB</p>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label className="text-muted-foreground">Documentos Cargados</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{file.name}</span>
                    {file.status === "ready" ? (
                      <Badge variant="outline" className="flex items-center gap-1 border-green-600/50">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Listo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 border-yellow-600/50">
                        <span className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                        Procesando
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>;
}
