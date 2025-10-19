import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ProductCatalogCard } from "../components/ProductCatalogCard";

export function Catalog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Product Catalog</h1>
        <p className="text-muted-foreground">Manage your product catalog for AI recommendations</p>
      </div>

      <ProductCatalogCard />
    </div>
  );
}