import { useState, useMemo } from "react";
import {
  CheckCircle2, AlertTriangle, Plus, Search, ExternalLink, Settings,
  Zap, Briefcase, Phone, Mail, MessageSquareText, Calendar, MessageCircle, Building2,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { INTEGRATIONS, CATEGORY_META, type Integration, type IntegrationCategory } from "../pass8-mock";
import { cn } from "../../ui/utils";

const CATEGORY_ICONS: Record<IntegrationCategory, React.ComponentType<{ className?: string }>> = {
  ats:        Briefcase,
  telephony:  Phone,
  email:      Mail,
  sms:        MessageSquareText,
  calendar:   Calendar,
  messaging:  MessageCircle,
  hrms:       Building2,
};

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<IntegrationCategory | "all" | "connected" | "needs-attention">("all");

  const stats = useMemo(() => ({
    connected: INTEGRATIONS.filter((i) => i.status === "connected").length,
    actionNeeded: INTEGRATIONS.filter((i) => i.status === "action-needed").length,
    available: INTEGRATIONS.filter((i) => i.status === "available").length,
  }), []);

  const filtered = useMemo(() => {
    let out = INTEGRATIONS;
    if (tab === "connected") out = out.filter((i) => i.status === "connected");
    else if (tab === "needs-attention") out = out.filter((i) => i.status === "action-needed");
    else if (tab !== "all") out = out.filter((i) => i.category === tab);

    if (query) {
      const q = query.toLowerCase();
      out = out.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return out;
  }, [query, tab]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Integrations</h1>
          <p className="text-muted-fg t-body-large">
            Connect CONNX to your ATS, telephony, email, SMS, calendar, and HRMS. Pre-built integrations covered in BRD section 6.7.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" /> Browse marketplace
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Connected" value={stats.connected} variant="success" icon={CheckCircle2} />
        <StatCard label="Need attention" value={stats.actionNeeded} variant={stats.actionNeeded > 0 ? "warning" : "neutral"} icon={AlertTriangle} />
        <StatCard label="Available to connect" value={stats.available} variant="info" icon={Plus} />
      </div>

      {stats.actionNeeded > 0 && (
        <div className="rounded-lg bg-warning-soft border border-warning-ink/20 p-3 mb-4 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="t-label-large text-warning-ink">{stats.actionNeeded} integration{stats.actionNeeded === 1 ? "" : "s"} need attention</div>
            <p className="t-body-small text-warning-ink/80">Resolve these to keep outreach flowing without disruption.</p>
          </div>
          <Button size="sm" onClick={() => setTab("needs-attention")} className="bg-stellar text-white hover:bg-stellar-700">Review</Button>
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="connected">
            Connected
            <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{stats.connected}</span>
          </TabsTrigger>
          {stats.actionNeeded > 0 && (
            <TabsTrigger value="needs-attention">
              Needs attention
              <span className="ml-1.5 t-label-small bg-warning-soft text-warning-ink px-1.5 rounded-pill">{stats.actionNeeded}</span>
            </TabsTrigger>
          )}
          {(Object.keys(CATEGORY_META) as IntegrationCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORY_META[cat].label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <Card className="mb-4 shadow-cx-1">
            <CardContent className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
                <Input
                  placeholder="Search integrations…"
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="t-title-medium text-cosmic mb-1">No matching integrations</div>
                <p className="t-body-medium text-muted-fg">Try a different search or category.</p>
              </CardContent>
            </Card>
          ) : tab === "all" ? (
            <GroupedView integrations={filtered} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((i) => <IntegrationCard key={i.id} integration={i} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GroupedView({ integrations }: { integrations: Integration[] }) {
  const grouped = integrations.reduce<Record<string, Integration[]>>((acc, i) => {
    if (!acc[i.category]) acc[i.category] = [];
    acc[i.category].push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {(Object.keys(grouped) as IntegrationCategory[]).map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-3.5 w-3.5 text-stellar" />
              <span className="t-label-large text-cosmic">{CATEGORY_META[cat].label}</span>
              <span className="t-body-small text-muted-fg">· {CATEGORY_META[cat].description}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[cat].map((i) => <IntegrationCard key={i.id} integration={i} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IntegrationCard({ integration: i }: { integration: Integration }) {
  const isConnected = i.status === "connected";
  const isActionNeeded = i.status === "action-needed";
  const isComingSoon = i.status === "coming-soon";

  return (
    <Card className={cn(
      "shadow-cx-1 transition-shadow hover:shadow-cx-2",
      isActionNeeded && "border-warning-ink/30 ring-1 ring-warning-ink/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="h-10 w-10 rounded-md flex items-center justify-center text-white t-label-medium shrink-0"
            style={{ backgroundColor: i.iconColor }}
          >
            {i.iconLetter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="t-label-large text-dark truncate">{i.name}</span>
              {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />}
              {isActionNeeded && <AlertTriangle className="h-3.5 w-3.5 text-warning-ink shrink-0" />}
            </div>
            <p className="t-body-small text-muted-fg line-clamp-2">{i.description}</p>
          </div>

          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More actions" className="h-7 w-7">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Configure</DropdownMenuItem>
                <DropdownMenuItem>Test connection</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger-ink">Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isConnected && (
          <div className="space-y-1 mb-3 t-body-small text-muted-fg">
            {i.lastSyncedAt && <DetailRow label="Last sync" value={i.lastSyncedAt} />}
            {i.region && <DetailRow label="Region" value={i.region} />}
            {i.recordsSynced !== undefined && <DetailRow label="Records synced" value={i.recordsSynced.toLocaleString()} />}
            {i.authMethod && <DetailRow label="Auth" value={i.authMethod} />}
          </div>
        )}

        {isActionNeeded && i.issue && (
          <div className="mb-3 p-2 rounded-md bg-warning-soft border border-warning-ink/20">
            <p className="t-body-small text-warning-ink leading-snug">⚠ {i.issue}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">Configure</Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Zap className="h-3 w-3" /> Sync now
              </Button>
            </>
          ) : isActionNeeded ? (
            <Button size="sm" className="flex-1 bg-stellar text-white hover:bg-stellar-700">Resolve</Button>
          ) : isComingSoon ? (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              Coming soon · request access
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <Plus className="h-3 w-3" /> Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="t-label-small text-muted-fg">{label}</span>
      <span className="t-label-medium text-dark text-right tabular-nums truncate">{value}</span>
    </div>
  );
}

function StatCard({
  label, value, variant, icon: Icon,
}: {
  label: string; value: number; variant: "success" | "warning" | "info" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colors = {
    success: { bg: "bg-success-soft", text: "text-success-ink" },
    warning: { bg: "bg-warning-soft", text: "text-warning-ink" },
    info:    { bg: "bg-stellar-50",   text: "text-stellar-700" },
    neutral: { bg: "bg-mist",         text: "text-muted-fg" },
  }[variant];
  return (
    <Card className="shadow-cx-1">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", colors.bg)}>
            <Icon className={cn("h-4 w-4", colors.text)} />
          </div>
          <div>
            <div className="t-headline-medium text-cosmic tabular-nums leading-none">{value}</div>
            <div className="t-body-small text-muted-fg mt-0.5">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
