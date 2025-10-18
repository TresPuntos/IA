import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/sonner";
import { ConfigHeader } from "./components/ConfigHeader";
import { SiteInfoCard } from "./components/SiteInfoCard";
import { ModelParamsCard } from "./components/ModelParamsCard";
import { ToneStyleCard } from "./components/ToneStyleCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { OpenAIConfigCard } from "./components/OpenAIConfigCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { testChat } from "./lib/chat";
import { loadConfig, saveConfig, resetConfig } from "./lib/configStorage";

type PageType = 'overview' | 'settings' | 'documents' | 'catalog' | 'tests' | 'usage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<string>("");

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      // Aplicar configuración guardada a los elementos del DOM
      Object.entries(savedConfig).forEach(([key, value]) => {
        const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (element) {
          if (element.type === 'checkbox') {
            (element as HTMLInputElement).checked = value as boolean;
          } else {
            element.value = value as string;
          }
        }
      });
    }
  }, []);

  const handleSaveConfig = () => {
    const config = {
      siteId: (document.getElementById('siteId') as HTMLInputElement)?.value || '',
      siteName: (document.getElementById('siteName') as HTMLInputElement)?.value || '',
      chatStatus: (document.getElementById('chatStatus') as HTMLSelectElement)?.value || 'active',
      temperature: parseFloat((document.getElementById('temperature') as HTMLInputElement)?.value || '0.7'),
      topP: parseFloat((document.getElementById('topP') as HTMLInputElement)?.value || '0.9'),
      maxTokens: parseInt((document.getElementById('maxTokens') as HTMLInputElement)?.value || '2048'),
      language: (document.getElementById('language') as HTMLSelectElement)?.value || 'es',
      tone: (document.getElementById('tone') as HTMLSelectElement)?.value || 'friendly',
      systemPrompt: (document.getElementById('systemPrompt') as HTMLTextAreaElement)?.value || '',
      welcomeMessage: (document.getElementById('welcomeMessage') as HTMLTextAreaElement)?.value || '',
      versionTag: (document.getElementById('versionTag') as HTMLInputElement)?.value || 'v0.0'
    };
    
    saveConfig(config);
    setChatResponse("✅ Configuración guardada exitosamente");
  };

  const handleTestChat = async () => {
    setIsLoading(true);
    try {
      const siteId = (document.getElementById('siteId') as HTMLInputElement)?.value || 'test_site';
      const message = "Hola, ¿puedes ayudarme a encontrar productos?";
      const response = await testChat(siteId, message);
      setChatResponse(response.answer || "No se pudo obtener respuesta");
    } catch (error) {
      setChatResponse("❌ Error al probar el chat: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = () => {
    const config = {
      siteId: (document.getElementById('siteId') as HTMLInputElement)?.value || '',
      siteName: (document.getElementById('siteName') as HTMLInputElement)?.value || '',
      chatStatus: (document.getElementById('chatStatus') as HTMLSelectElement)?.value || 'active',
      temperature: parseFloat((document.getElementById('temperature') as HTMLInputElement)?.value || '0.7'),
      topP: parseFloat((document.getElementById('topP') as HTMLInputElement)?.value || '0.9'),
      maxTokens: parseInt((document.getElementById('maxTokens') as HTMLInputElement)?.value || '2048'),
      language: (document.getElementById('language') as HTMLSelectElement)?.value || 'es',
      tone: (document.getElementById('tone') as HTMLSelectElement)?.value || 'friendly',
      systemPrompt: (document.getElementById('systemPrompt') as HTMLTextAreaElement)?.value || '',
      welcomeMessage: (document.getElementById('welcomeMessage') as HTMLTextAreaElement)?.value || '',
      versionTag: (document.getElementById('versionTag') as HTMLInputElement)?.value || 'v0.0'
    };
    
    // Crear una copia con un nuevo ID
    const duplicatedConfig = {
      ...config,
      siteId: config.siteId + '_copy',
      siteName: config.siteName + ' (Copia)',
      versionTag: config.versionTag + '_copy'
    };
    
    // Aplicar la configuración duplicada al DOM
    Object.entries(duplicatedConfig).forEach(([key, value]) => {
      const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element) {
        if (element.type === 'checkbox') {
          (element as HTMLInputElement).checked = value as boolean;
        } else {
          element.value = value as string;
        }
      }
    });
    
    setChatResponse("✅ Configuración duplicada exitosamente");
  };

  const handleReset = () => {
    resetConfig();
    setChatResponse("✅ Configuración restablecida a valores por defecto");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <ConfigHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            <SiteInfoCard />
            <ModelParamsCard />
            <ToneStyleCard />
            <OpenAIConfigCard />
            <DocumentationCard />
            <ProductCatalogCard />
          </div>
          
          {/* Columna derecha */}
          <div className="space-y-6">
            <FutureFeaturesCard />
            <VersionTestingCard 
              isLoading={isLoading}
              chatResponse={chatResponse}
              onTestChat={handleTestChat}
            />
            <ActionsPanel 
              onSaveConfig={handleSaveConfig}
              onTestChat={handleTestChat}
              onDuplicate={handleDuplicate}
              onReset={handleReset}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}