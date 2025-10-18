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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MobileMenuButton onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Column 1 */}
            <div className="space-y-6">
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
            <div className="space-y-6">
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
