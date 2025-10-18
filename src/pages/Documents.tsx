import React from "react";
import { DocumentationCard } from "../components/DocumentationCard";

export function Documents() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
        <p className="text-slate-400">Upload and manage documentation files</p>
      </div>
      
      <DocumentationCard />
    </div>
  );
}
