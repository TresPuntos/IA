import { DocumentationCard } from "../components/DocumentationCard";

export function Documentation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Documentation</h1>
        <p className="text-muted-foreground">Upload files to enhance AI knowledge</p>
      </div>

      <div className="max-w-3xl">
        <DocumentationCard />
      </div>
    </div>
  );
}
