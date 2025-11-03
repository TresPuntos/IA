import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle, RefreshCw, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

// Importar funciones de Supabase
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase (deberías mover esto a variables de entorno)
// Usar variables de entorno - no hardcodear claves
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || ''}.supabase.co`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY no está configurado');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ChatConfig {
  siteId: string;
  siteName: string;
  chatStatus: 'active' | 'testing' | 'inactive';
  tone: 'friendly' | 'premium' | 'technical' | 'casual' | 'professional';
  systemPrompt: string;
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini';
  temperature: number;
  topP: number;
  maxTokens: number;
  language: 'es' | 'en' | 'pt' | 'fr' | 'de';
  versionTag: string;
}

interface DocumentationFile {
  id: string;
  name: string;
  content: string;
  file_type: 'pdf' | 'txt' | 'csv' | 'md';
  file_size: number;
  status: 'processing' | 'ready' | 'error';
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sku: string;
  stock_quantity: number;
  status: 'active' | 'inactive';
  source: 'csv' | 'woocommerce';
  created_at: string;
  updated_at: string;
}

interface CatalogStats {
  total_products: number;
  active_products: number;
  csv_products: number;
  woocommerce_products: number;
  last_update: string | null;
}

export function AIWidget() {
  const [config, setConfig] = useState<ChatConfig>({
    siteId: 'mi-sitio',
    siteName: 'Mi Tienda',
    chatStatus: 'active',
    tone: 'friendly',
    systemPrompt: 'Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente.',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    language: 'es',
    versionTag: 'v1.0'
  });

  const [uploadedFiles, setUploadedFiles] = useState<DocumentationFile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<CatalogStats>({
    total_products: 0,
    active_products: 0,
    csv_products: 0,
    woocommerce_products: 0,
    last_update: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDocumentation();
    loadProducts();
    loadStats();
  }, []);

  const loadDocumentation = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedFiles(data || []);
    } catch (error) {
      console.error('Error loading documentation:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('product_catalog')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('product_catalog')
        .select('source, status, updated_at');

      if (error) throw error;

      const stats = {
        total_products: data?.length || 0,
        active_products: data?.filter(p => p.status === 'active').length || 0,
        csv_products: data?.filter(p => p.source === 'csv').length || 0,
        woocommerce_products: data?.filter(p => p.source === 'woocommerce').length || 0,
        last_update: data?.[0]?.updated_at || null
      };

      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('openai-chat', {
        body: {
          message: chatMessage,
          systemPrompt: config.systemPrompt,
          model: config.model,
          temperature: config.temperature,
          topP: config.topP,
          maxTokens: config.maxTokens,
          language: config.language,
          tone: config.tone
        }
      });

      if (response.error) throw response.error;
      setChatResponse(response.data?.answer || 'No se pudo obtener respuesta');
    } catch (error) {
      setChatResponse('❌ Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileContent(file);
      const fileType = getFileType(file.type);

      const { data, error } = await supabase
        .from('documentation_files')
        .insert({
          name: file.name,
          content: content,
          file_type: fileType,
          file_size: file.size,
          status: 'ready'
        })
        .select()
        .single();

      if (error) throw error;
      
      setUploadedFiles(prev => [data, ...prev]);
      toast.success(`Archivo "${file.name}" subido correctamente`);
    } catch (error) {
      toast.error('Error al subir archivo: ' + (error as Error).message);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsText(file);
    });
  };

  const getFileType = (mimeType: string): 'pdf' | 'txt' | 'csv' | 'md' => {
    switch (mimeType) {
      case 'application/pdf': return 'pdf';
      case 'text/plain': return 'txt';
      case 'text/csv': return 'csv';
      case 'text/markdown': return 'md';
      default: return 'txt';
    }
  };

  return (
    <div className="ai-widget-container">
      <style jsx>{`
        .ai-widget-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .widget-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .widget-title {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        
        .widget-subtitle {
          font-size: 14px;
          color: #666;
        }
        
        .widget-section {
          margin-bottom: 24px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e1e5e9;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }
        
        .form-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #4b5563;
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-success:hover {
          background: #059669;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .btn-danger:hover {
          background: #dc2626;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .stat-item {
          text-align: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }
        
        .stat-number {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        
        .file-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e1e5e9;
        }
        
        .file-item:last-child {
          border-bottom: none;
        }
        
        .file-info {
          flex: 1;
        }
        
        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }
        
        .file-size {
          font-size: 12px;
          color: #666;
        }
        
        .chat-container {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chat-messages {
          height: 200px;
          overflow-y: auto;
          padding: 16px;
          background: #f8f9fa;
        }
        
        .chat-input-container {
          display: flex;
          padding: 12px;
          background: white;
          border-top: 1px solid #e1e5e9;
        }
        
        .chat-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          margin-right: 8px;
        }
        
        .loading {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }
        
        .badge-error {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>

      <div className="widget-header">
        <h1 className="widget-title">🤖 AI Chat Widget</h1>
        <p className="widget-subtitle">Configuración y prueba de tu asistente IA</p>
      </div>

      {/* Configuración Básica */}
      <div className="widget-section">
        <h3 className="section-title">⚙️ Configuración</h3>
        
        <div className="form-group">
          <label className="form-label">Site ID</label>
          <input
            type="text"
            className="form-input"
            value={config.siteId}
            onChange={(e) => setConfig(prev => ({ ...prev, siteId: e.target.value }))}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Nombre del Sitio</label>
          <input
            type="text"
            className="form-input"
            value={config.siteName}
            onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tono</label>
          <select
            className="form-select"
            value={config.tone}
            onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as any }))}
          >
            <option value="friendly">Amigable</option>
            <option value="premium">Premium</option>
            <option value="technical">Técnico</option>
            <option value="casual">Casual</option>
            <option value="professional">Profesional</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="widget-section">
        <h3 className="section-title">📊 Estadísticas</h3>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.total_products}</div>
            <div className="stat-label">Productos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{uploadedFiles.length}</div>
            <div className="stat-label">Documentos</div>
          </div>
        </div>
      </div>

      {/* Documentación */}
      <div className="widget-section">
        <h3 className="section-title">📄 Documentación</h3>
        
        <div className="form-group">
          <input
            type="file"
            accept=".pdf,.txt,.csv,.md"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn btn-secondary">
            📁 Subir Archivo
          </label>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="file-list">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {Math.round(file.file_size / 1024)} KB • {file.file_type.toUpperCase()}
                  </div>
                </div>
                <span className={`badge ${
                  file.status === 'ready' ? 'badge-success' :
                  file.status === 'processing' ? 'badge-warning' : 'badge-error'
                }`}>
                  {file.status === 'ready' ? 'Listo' :
                   file.status === 'processing' ? 'Procesando' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat de Prueba */}
      <div className="widget-section">
        <h3 className="section-title">💬 Chat de Prueba</h3>
        
        <div className="chat-container">
          <div className="chat-messages">
            {chatResponse && (
              <div style={{ marginBottom: '12px', padding: '8px', background: 'white', borderRadius: '6px' }}>
                <strong>IA:</strong> {chatResponse}
              </div>
            )}
            {!chatResponse && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                Escribe un mensaje para probar el chat...
              </div>
            )}
          </div>
          
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe tu mensaje..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            />
            <button
              className="btn btn-primary"
              onClick={handleChatSubmit}
              disabled={isLoading || !chatMessage.trim()}
            >
              {isLoading ? <div className="loading"></div> : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
