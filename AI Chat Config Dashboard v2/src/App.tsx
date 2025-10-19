import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ThemeProvider } from "./utils/theme-provider";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Save, Copy, RotateCcw } from "lucide-react";
import { saveConfig, getConfig, duplicateConfig, type ChatConfig } from "./utils/api";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { Configuration } from "./pages/Configuration";
import { Catalog } from "./pages/Catalog";
import { Documentation } from "./pages/Documentation";
import { Parameters } from "./pages/Parameters";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
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
          toast.success("Configuration loaded");
        }
      } catch (error) {
        console.log("No saved configuration, using defaults");
      }
    };
    
    loadConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveConfig(config);
      toast.success("✅ Configuration saved successfully");
    } catch (error) {
      toast.error("Error saving: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    const newSiteId = prompt("Enter the ID for the new site:", `${config.siteId}_copy`);
    if (!newSiteId) return;
    
    setLoading(true);
    try {
      await duplicateConfig(config.siteId, newSiteId);
      toast.success(`✅ Configuration duplicated as ${newSiteId}`);
    } catch (error) {
      toast.error("Error duplicating: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset to default values?")) return;
    
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
    
    toast.success("Values reset to defaults");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard config={config} />;
      case "configuration":
        return <Configuration config={config} setConfig={setConfig} onDuplicate={handleDuplicate} />;
      case "catalog":
        return <Catalog config={config} setConfig={setConfig} />;
      case "documentation":
        return <Documentation />;
      case "parameters":
        return <Parameters config={config} setConfig={setConfig} />;
      default:
        return <Dashboard config={config} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <main className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
              <SidebarTrigger />
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicate}
                  disabled={loading}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </header>
            
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {renderPage()}
              </div>
            </div>
          </main>
        </div>
        
        <Toaster position="top-right" />
      </SidebarProvider>
    </ThemeProvider>
  );
}
