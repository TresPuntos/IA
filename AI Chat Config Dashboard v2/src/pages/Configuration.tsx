import { SiteInfoCard } from "../components/SiteInfoCard";
import { ToneStyleCard } from "../components/ToneStyleCard";
import { type ChatConfig } from "../utils/api";

interface ConfigurationProps {
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
  onDuplicate: () => void;
}

export function Configuration({ config, setConfig, onDuplicate }: ConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Configuration</h1>
        <p className="text-muted-foreground">Manage your site and AI personality settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteInfoCard config={config} setConfig={setConfig} onDuplicate={onDuplicate} />
        <ToneStyleCard config={config} setConfig={setConfig} />
      </div>
    </div>
  );
}
