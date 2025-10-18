import React from "react";
import { VersionTestingCard } from "../components/VersionTestingCard";

export function Tests() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tests</h1>
        <p className="text-slate-400">Test your chat configuration</p>
      </div>
      
      <VersionTestingCard />
    </div>
  );
}
