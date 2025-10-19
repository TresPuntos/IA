import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useConfig } from "../lib/ConfigContext";

interface ConfigurationProps {
  onDuplicate: () => void;
}

export function Configuration({ onDuplicate }: ConfigurationProps) {
  const { config, updateConfig } = useConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Configuration</h1>
        <p className="text-muted-foreground">Configure your AI chat settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic details about your chat instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-id">Site ID</Label>
              <Input 
                id="site-id" 
                value={config.siteId}
                onChange={(e) => updateConfig({ siteId: e.target.value })}
                placeholder="100chef"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input 
                id="site-name" 
                value={config.siteName}
                onChange={(e) => updateConfig({ siteName: e.target.value })}
                placeholder="100%Chef - Herramientas Cocina"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="client-url">URL del Cliente</Label>
              <Input 
                id="client-url" 
                value={config.clientUrl}
                onChange={(e) => updateConfig({ clientUrl: e.target.value })}
                placeholder="https://100x100chef.com/"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chat-status">Chat Status</Label>
              <Select 
                value={config.chatStatus}
                onValueChange={(value) => updateConfig({ chatStatus: value as any })}
              >
                <SelectTrigger id="chat-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version-tag">Version Tag</Label>
              <Input 
                id="version-tag" 
                value={config.versionTag}
                onChange={(e) => updateConfig({ versionTag: e.target.value })}
                placeholder="v1.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tone and Style</CardTitle>
          <CardDescription>Define how the AI should communicate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select 
              value={config.tone}
              onValueChange={(value) => updateConfig({ tone: value as any })}
            >
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>System Prompts por Tono</Label>
            <div className="space-y-4">
              {Object.entries(config.systemPrompts).map(([toneKey, prompt]) => (
                <div key={toneKey} className="space-y-2">
                  <Label htmlFor={`prompt-${toneKey}`} className="capitalize">
                    {toneKey} Prompt
                  </Label>
                  <Textarea 
                    id={`prompt-${toneKey}`}
                    placeholder={`System prompt for ${toneKey} tone...`}
                    rows={6}
                    value={prompt}
                    onChange={(e) => updateConfig({ 
                      systemPrompts: { 
                        ...config.systemPrompts, 
                        [toneKey]: e.target.value 
                      } 
                    })}
                    className="resize-none font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
