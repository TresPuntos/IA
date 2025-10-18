import React, { useState } from "react";
import { SiteInfoCard } from "./components/SiteInfoCard";
import { ToneStyleCard } from "./components/ToneStyleCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ModelParamsCard } from "./components/ModelParamsCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "./components/ui/sonner";
import { loadConfig, applyConfigToDOM } from "./lib/configStorage";

type PageType = 'site-info' | 'tone-style' | 'product-catalog' | 'documentation' | 'model-params' | 'version-testing' | 'future-features' | 'actions';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('site-info');

  // Cargar configuración guardada al iniciar
  React.useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      applyConfigToDOM(savedConfig);
    }
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'site-info':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Información del Sitio</h1>
              <p className="text-slate-400">Configura los detalles básicos de tu instancia de chat</p>
            </div>
            <SiteInfoCard />
          </div>
        );
      
      case 'tone-style':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Tono y Personalidad</h1>
              <p className="text-slate-400">Define cómo debe comunicarse la IA</p>
            </div>
            <ToneStyleCard />
          </div>
        );
      
      case 'product-catalog':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Productos</h1>
              <p className="text-slate-400">Gestiona tu inventario de productos</p>
            </div>
            <ProductCatalogCard />
          </div>
        );
      
      case 'documentation':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Documentación</h1>
              <p className="text-slate-400">Sube y gestiona archivos de documentación</p>
            </div>
            <DocumentationCard />
          </div>
        );
      
      case 'model-params':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Parámetros del Modelo</h1>
              <p className="text-slate-400">Ajusta el comportamiento de la IA</p>
            </div>
            <ModelParamsCard />
          </div>
        );
      
      case 'version-testing':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Versión y Pruebas</h1>
              <p className="text-slate-400">Prueba tu configuración de chat</p>
            </div>
            <VersionTestingCard />
          </div>
        );
      
      case 'future-features':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Funciones Futuras</h1>
              <p className="text-slate-400">Próximas funcionalidades en desarrollo</p>
            </div>
            <FutureFeaturesCard />
          </div>
        );
      
      case 'actions':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Acciones Principales</h1>
              <p className="text-slate-400">Gestiona tu configuración</p>
            </div>
            <ActionsPanel />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Información del Sitio</h1>
              <p className="text-slate-400">Configura los detalles básicos de tu instancia de chat</p>
            </div>
            <SiteInfoCard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as PageType)}
      />
      
      <div className="lg:ml-72 min-h-screen">
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}