import { ConfigHeader } from "./components/ConfigHeader";
import { SiteInfoCard } from "./components/SiteInfoCard";
import { ToneStyleCard } from "./components/ToneStyleCard";
import { ProductCatalogCard } from "./components/ProductCatalogCard";
import { DocumentationCard } from "./components/DocumentationCard";
import { ModelParamsCard } from "./components/ModelParamsCard";
import { VersionTestingCard } from "./components/VersionTestingCard";
import { FutureFeaturesCard } from "./components/FutureFeaturesCard";
import { ActionsPanel } from "./components/ActionsPanel";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <ConfigHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-6">
            <SiteInfoCard />
            <ToneStyleCard />
            <ProductCatalogCard />
            <DocumentationCard />
          </div>
          
          {/* Column 2 */}
          <div className="space-y-6">
            <ModelParamsCard />
            <VersionTestingCard />
            <FutureFeaturesCard />
            <ActionsPanel />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
