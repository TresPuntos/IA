import React from "react";
import { FutureFeaturesCard } from "../components/FutureFeaturesCard";

export function Usage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Usage</h1>
        <p className="text-slate-400">Usage statistics and future features</p>
      </div>
      
      <FutureFeaturesCard />
    </div>
  );
}
