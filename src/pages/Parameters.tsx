import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { useConfig } from "../lib/ConfigContext";

export function Parameters() {
  const { config, updateConfig } = useConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Parameters</h1>
        <p className="text-muted-foreground">Fine-tune your AI model settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Settings</CardTitle>
          <CardDescription>Configure OpenAI model parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select 
              value={config.model}
              onValueChange={(value) => updateConfig({ model: value as any })}
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select 
              value={config.language}
              onValueChange={(value) => updateConfig({ language: value as any })}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generation Parameters</CardTitle>
          <CardDescription>Control creativity and response length</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">{config.temperature}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[config.temperature]}
              onValueChange={(value) => updateConfig({ temperature: value[0] })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness. Lower values make responses more focused and deterministic.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="top-p">Top-p</Label>
              <span className="text-sm text-muted-foreground">{config.topP}</span>
            </div>
            <Slider
              id="top-p"
              min={0}
              max={1}
              step={0.05}
              value={[config.topP]}
              onValueChange={(value) => updateConfig({ topP: value[0] })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls diversity via nucleus sampling. Lower values make responses more focused.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <span className="text-sm text-muted-foreground">{config.maxTokens}</span>
            </div>
            <Slider
              id="max-tokens"
              min={100}
              max={4000}
              step={100}
              value={[config.maxTokens]}
              onValueChange={(value) => updateConfig({ maxTokens: value[0] })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens to generate in the response.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
