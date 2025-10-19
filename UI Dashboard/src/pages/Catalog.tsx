import { ProductCatalogCard } from "../components/ProductCatalogCard";
import { type ChatConfig } from "../utils/api";

interface CatalogProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function Catalog({ config, setConfig }: CatalogProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Product Catalog</h1>
        <p className="text-muted-foreground">Connect and manage your product database</p>
      </div>

      <div className="max-w-3xl">
        <ProductCatalogCard config={config} setConfig={setConfig} />
      </div>
    </div>
  );
}
