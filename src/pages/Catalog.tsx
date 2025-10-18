import React from "react";
import { ProductCatalogCard } from "../components/ProductCatalogCard";

export function Catalog() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Catalog</h1>
        <p className="text-slate-400">Manage your product inventory</p>
      </div>
      
      <ProductCatalogCard />
    </div>
  );
}
