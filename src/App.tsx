import React, { useState, useEffect } from "react";
import { SiteInfoCard } from "./components/SiteInfoCard";
import { ToneStyleCard } from "./components/ToneStyleCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ModelParamsCard } from "./components/ModelParamsCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { Sidebar, MobileMenuButton } from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import { loadConfig, applyConfigToDOM } from "./lib/configStorage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      applyConfigToDOM(savedConfig);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MobileMenuButton onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-80 min-h-screen">
        <div className="container mx-auto px-8 py-12">
          {/* Header Principal */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Configuración</h1>
                <p className="text-slate-400 text-lg">Gestiona tu asistente de IA con precisión profesional</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Sistema Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Column 1 */}
            <div className="space-y-8">
              <div id="site-info">
                <SiteInfoCard />
              </div>
              <div id="tone-style">
                <ToneStyleCard />
              </div>
              <div id="product-catalog">
                <ProductCatalogCard />
              </div>
              <div id="documentation">
                <DocumentationCard />
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-8">
              <div id="model-params">
                <ModelParamsCard />
              </div>
              <div id="version-testing" data-testid="chat-section">
                <VersionTestingCard />
              </div>
              <div id="future-features">
                <FutureFeaturesCard />
              </div>
              <div id="actions">
                <ActionsPanel />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
