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
import { SystemPromptCard } from "./components/SystemPromptCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { testChat } from "./lib/chat";
import { loadConfig, saveConfig, resetConfig, applyConfigToDOM } from "./lib/configStorage";
import { initializeTheme } from "./lib/theme";
import { ConfigProvider, useConfig } from "./lib/ConfigContext";

function AppContent() {
  const { config, saveConfiguration } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<string>("");

  // Inicializar tema al montar
  useEffect(() => {
    initializeTheme();
  }, []);

  const handleSaveConfig = async () => {
    console.log('🔍 DEBUG: handleSaveConfig llamado');
    setIsLoading(true);
    try {
      console.log('🔍 DEBUG: Configuración actual:', config);
      const result = await saveConfiguration();
      console.log('🔍 DEBUG: Resultado del guardado:', result);
      if (result.success) {
        setChatResponse("✅ Configuración guardada exitosamente en Supabase");
      } else {
        setChatResponse(`⚠️ ${result.error || 'Error al guardar configuración'}`);
      }
    } catch (error) {
      console.error('❌ Error en handleSaveConfig:', error);
      setChatResponse(`❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestChat = async () => {
    setIsLoading(true);
    try {
      const siteId = config.siteId || 'test_site';
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
    // Crear una copia con un nuevo ID
    const duplicatedConfig = {
      ...config,
      siteId: config.siteId + '_copy',
      siteName: config.siteName + ' (Copia)',
      versionTag: config.versionTag + '_copy'
    };
    
    // Aplicar la configuración duplicada usando la función especializada
    applyConfigToDOM(duplicatedConfig);
    
    setChatResponse("✅ Configuración duplicada exitosamente");
  };

  const handleReset = async () => {
    await resetConfig();
    setChatResponse("✅ Configuración restablecida a valores por defecto");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <ConfigHeader />
      
      <div className="container mx-auto px-8 py-12 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 justify-items-center">
          {/* Primera fila */}
          <div className="w-full max-w-[480px]">
            <SiteInfoCard />
          </div>
          <div className="w-full max-w-[480px]">
            <ModelParamsCard />
          </div>
          
          {/* Segunda fila */}
          <div className="w-full max-w-[480px]">
            <SystemPromptCard />
          </div>
          <div className="w-full max-w-[480px]">
            <DocumentationCard />
          </div>
          
          {/* Tercera fila */}
          <div className="w-full max-w-[480px]">
            <ProductCatalogCard />
          </div>
          <div className="w-full max-w-[480px]">
            <FutureFeaturesCard />
          </div>
          
          {/* Cuarta fila */}
          <div className="w-full max-w-[480px]">
            <VersionTestingCard 
              isLoading={isLoading}
              chatResponse={chatResponse}
              onTestChat={handleTestChat}
            />
          </div>
          <div className="w-full max-w-[480px]">
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

export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}