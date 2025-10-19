import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { DocumentationCard } from "../components/DocumentationCard";

export function Documentation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Documentation</h1>
        <p className="text-muted-foreground">Upload and manage documentation for your AI assistant</p>
      </div>

      <DocumentationCard />
    </div>
  );
}
