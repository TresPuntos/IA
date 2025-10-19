import { useState, useEffect } from "react";
import { ConfigHeader } from "./components/ConfigHeader";
import { SiteInfoCard } from "./components/SiteInfoCard";
import { ToneStyleCard } from "./components/ToneStyleCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ModelParamsCard } from "./components/ModelParamsCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { saveConfig, getConfig, duplicateConfig, type ChatConfig } from "./utils/api";

export default function App() {
  const [config, setConfig] = useState<ChatConfig>({
    siteId: "site_12345",
    siteName: "Tienda Premium Tech",
    domain: "https://premiumtech.shop",
    status: "live",
    tone: "friendly",
    systemPrompt: "Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.",
    styleInstructions: "Usa un español neutro y profesional",
    catalogSource: "none",
    catalogUrl: "",
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    language: "es",
    welcomeMessage: "¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    fallbackMessage: "Disculpa, no tengo información específica sobre eso. ¿Puedo ayudarte con algo más?",
    versionTag: "v1.2",
  });

  const [loading, setLoading] = useState(false);

  // Cargar configuración al inicio
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await getConfig(config.siteId);
        if (response.success) {
          setConfig(response.config);
          toast.success("Configuración cargada");
        }
      } catch (error) {
        console.log("No hay configuración guardada, usando valores por defecto");
      }
    };
    
    loadConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveConfig(config);
      toast.success("✅ Configuración guardada exitosamente");
    } catch (error) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    const newSiteId = prompt("Ingresa el ID del nuevo sitio:", `${config.siteId}_copy`);
    if (!newSiteId) return;
    
    setLoading(true);
    try {
      await duplicateConfig(config.siteId, newSiteId);
      toast.success(`✅ Configuración duplicada como ${newSiteId}`);
    } catch (error) {
      toast.error("Error al duplicar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirm("¿Estás seguro de restablecer a valores por defecto?")) return;
    
    setConfig({
      ...config,
      tone: "friendly",
      systemPrompt: "Eres un asistente especializado en ayudar a clientes a encontrar productos. Siempre sé amable, directo y enfócate en las necesidades del cliente. Proporciona recomendaciones basadas en el catálogo disponible.",
      styleInstructions: "Usa un español neutro y profesional",
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      language: "es",
      welcomeMessage: "¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      fallbackMessage: "Disculpa, no tengo información específica sobre eso. ¿Puedo ayudarte con algo más?",
    });
    
    toast.success("Valores restablecidos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <ConfigHeader />
      <Toaster position="top-right" />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-6">
            <SiteInfoCard config={config} setConfig={setConfig} onDuplicate={handleDuplicate} />
            <ToneStyleCard config={config} setConfig={setConfig} />
            <ProductCatalogCard config={config} setConfig={setConfig} />
            <DocumentationCard />
          </div>
          
          {/* Column 2 */}
          <div className="space-y-6">
            <ModelParamsCard config={config} setConfig={setConfig} />
            <VersionTestingCard config={config} setConfig={setConfig} />
            <FutureFeaturesCard />
            <ActionsPanel 
              onSave={handleSave} 
              onDuplicate={handleDuplicate}
              onReset={handleReset}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
