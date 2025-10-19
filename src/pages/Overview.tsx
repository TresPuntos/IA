import React from "react";
import { SiteInfoCard } from "../components/SiteInfoCard";
import { SystemPromptCard } from "../components/SystemPromptCard";

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-slate-400">General information and basic configuration</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteInfoCard />
        <SystemPromptCard />
      </div>
    </div>
  );
}
