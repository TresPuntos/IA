import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { 
  uploadDocumentation, 
  getDocumentationFiles, 
  deleteDocumentationFile,
  type DocumentationFile 
} from "../lib/documentation";
import { toast } from "sonner";

export function DocumentationCard() {
  const [uploadedFiles, setUploadedFiles] = useState<DocumentationFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar archivos al montar el componente
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const files = await getDocumentationFiles();
      setUploadedFiles(files);
    } catch (error) {
      toast.error('Error al cargar archivos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validación adicional para PDFs
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (isPDF) {
      console.log('📄 PDF detectado en frontend:', file.name);
    }

    try {
      setIsUploading(true);
      console.log('🚀 Iniciando subida desde frontend:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isPDF: isPDF
      });
      
      const result = await uploadDocumentation(file);
      
      if (result.success && result.file) {
        setUploadedFiles(prev => [result.file!, ...prev]);
        toast.success(`Archivo "${file.name}" subido correctamente`);
        console.log('✅ Subida exitosa desde frontend');
      } else {
        toast.error(result.error || 'Error al subir el archivo');
        console.error('❌ Error en subida desde frontend:', result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error inesperado: ' + errorMessage);
      console.error('❌ Error inesperado desde frontend:', errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = async (id: string, fileName: string) => {
    try {
      await deleteDocumentationFile(id);
      setUploadedFiles(prev => prev.filter(file => file.id !== id));
      toast.success(`Archivo "${fileName}" eliminado correctamente`);
    } catch (error) {
      toast.error('Error al eliminar archivo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-600/50">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Listo
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-yellow-600/50">
            <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin" />
            Procesando
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-red-600/50">
            <AlertCircle className="h-3 w-3 text-red-500" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
        <Card className="figma-card">
      <CardHeader>
        <CardTitle>Documentación Adicional</CardTitle>
        <CardDescription>Sube archivos para mejorar el conocimiento de la IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.csv,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Documentos (PDF, TXT, CSV, MD)
              </>
            )}
          </Button>
          <p className="text-muted-foreground">Máx. 5MB por archivo</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando archivos...</span>
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div className="space-y-2 pt-2">
            <Label className="text-muted-foreground">Documentos Cargados ({uploadedFiles.length})</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)} • {file.file_type.toUpperCase()}
                      </div>
                    </div>
                    {getStatusBadge(file.status)}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteFile(file.id, file.name)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay archivos subidos aún</p>
            <p className="text-sm">Sube tu primer documento para comenzar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>;
}
