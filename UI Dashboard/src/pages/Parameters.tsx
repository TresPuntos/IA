import { ModelParamsCard } from "../components/ModelParamsCard";
import { VersionTestingCard } from "../components/VersionTestingCard";
import { FutureFeaturesCard } from "../components/FutureFeaturesCard";
import { type ChatConfig } from "../utils/api";

interface ParametersProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
}

export function Parameters({ config, setConfig }: ParametersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Model Parameters</h1>
        <p className="text-muted-foreground">Fine-tune AI behavior and testing options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ModelParamsCard config={config} setConfig={setConfig} />
        </div>
        <div className="space-y-6">
          <VersionTestingCard config={config} setConfig={setConfig} />
          <FutureFeaturesCard />
        </div>
      </div>
    </div>
  );
}
