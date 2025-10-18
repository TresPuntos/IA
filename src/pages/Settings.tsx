import React from "react";
import { ModelParamsCard } from "../components/ModelParamsCard";
import { ActionsPanel } from "../components/ActionsPanel";

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Configure model parameters and system actions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelParamsCard />
        <ActionsPanel />
      </div>
    </div>
  );
}
