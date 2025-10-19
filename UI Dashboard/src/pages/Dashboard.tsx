import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Activity, Clock, Database, FileText } from "lucide-react";
import { type ChatConfig } from "../utils/api";

interface DashboardProps {
  config: ChatConfig;
}

export function Dashboard({ config }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your AI chat configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Status
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={config.status === 'live' ? 'bg-green-600' : 'bg-yellow-600'}>
              {config.status === 'live' ? 'Live' : 'Testing'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Catalog
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {config.catalogSource === 'none' ? 'Not configured' : config.catalogSource.toUpperCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Version
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{config.versionTag}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Updated
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {config.updatedAt ? new Date(config.updatedAt).toLocaleDateString() : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic details about your chat instance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground mb-1">Site ID</p>
              <p>{config.siteId}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Site Name</p>
              <p>{config.siteName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Domain</p>
              <p className="text-primary">{config.domain}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Language</p>
              <p>{config.language.toUpperCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>Current model settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-muted-foreground mb-1">Temperature</p>
              <p className="text-2xl">{config.temperature}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Top-p</p>
              <p className="text-2xl">{config.topP}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Max Tokens</p>
              <p className="text-2xl">{config.maxTokens}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
