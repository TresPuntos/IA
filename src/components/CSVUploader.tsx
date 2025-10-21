// src/components/CSVUploader.tsx
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { uploadProductsFromCSV } from '../lib/productCatalog';

interface CSVFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'success' | 'error';
  productsCount?: number;
}

interface CSVUploaderProps {
  onFileUploaded: (file: CSVFile, products: any[]) => void;
  onFileDeleted: (fileId: string) => void;
}

export function CSVUploader({ onFileUploaded, onFileDeleted }: CSVUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<CSVFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFiles = files.filter(file => file.name.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      toast.error('Solo se permiten archivos CSV');
      return;
    }
    
    csvFiles.forEach(file => handleFileUpload(file));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => handleFileUpload(file));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Solo se permiten archivos CSV');
      return;
    }

    const fileId = `csv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newFile: CSVFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'uploading'
    };

    setUploadedFiles(prev => [...prev, newFile]);
    setIsUploading(true);

    try {
      console.log('🚀 Iniciando subida real de CSV:', file.name);
      
      // Usar la función real de subida de CSV
      const result = await uploadProductsFromCSV(file, (progress) => {
        console.log('📊 Progreso:', progress);
      });

      if (result.success) {
        console.log('✅ CSV subido correctamente:', result.productsCount, 'productos');
        
        // Actualizar estado del archivo
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'success', productsCount: result.productsCount }
            : f
        ));

        // Notificar al componente padre con datos simulados para compatibilidad
        const simulatedProducts = Array.from({ length: result.productsCount || 0 }, (_, index) => ({
          id: `csv-product-${fileId}-${index}`,
          name: `Producto ${index + 1}`,
          price: 0,
          category: '',
          description: '',
          sku: `CSV-${index + 1}`,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        onFileUploaded(newFile, simulatedProducts);
        
        toast.success(`✅ CSV procesado correctamente: ${result.productsCount} productos guardados en Supabase`);
      } else {
        throw new Error(result.error || 'Error desconocido al procesar CSV');
      }
      
    } catch (error) {
      console.error('❌ Error processing CSV:', error);
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' }
          : f
      ));
      
      toast.error(`❌ Error al procesar CSV: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onFileDeleted(fileId);
    toast.success('Archivo eliminado');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadTemplate = () => {
    const template = 'name,price,category,description,sku,image_url,product_url\n' +
      'Pacojet 4,2800,maquinaria,Máquina profesional para texturas perfectas,PACO-4-001,https://100x100chef.com/images/pacojet.jpg,https://100x100chef.com/productos/pacojet\n' +
      'Girovap Destiladora,2500,maquinaria,Destilación al vacío profesional,GIRO-001,https://100x100chef.com/images/girovap.jpg,https://100x100chef.com/productos/girovap';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-productos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Catálogo CSV
          </CardTitle>
          <CardDescription>
            Arrastra archivos CSV aquí o haz clic para seleccionar. El archivo debe contener las columnas: name, price, category, description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra archivos CSV aquí'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              o haz clic para seleccionar archivos
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => document.getElementById('csv-input')?.click()}>
                Seleccionar Archivos
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </Button>
            </div>
            <input
              id="csv-input"
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Archivos Subidos ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {file.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleString()}
                        {file.productsCount && ` • ${file.productsCount} productos`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'success' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">✅ Procesado</Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive">❌ Error</Badge>
                    )}
                    {file.status === 'uploading' && (
                      <Badge variant="secondary">⏳ Procesando...</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de que quieres eliminar el archivo "${file.name}"?`)) {
                          handleDeleteFile(file.id);
                        }
                      }}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
