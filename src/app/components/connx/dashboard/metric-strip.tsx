import { PhoneCall, PhoneOff, MessageSquareText, UserCheck, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { cn } from "../../ui/utils";
import { TODAY_METRICS } from "../mock";

interface Metric {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  delta?: { value: string; trend: "up" | "down" | "flat" };
  subdetail?: string;
}

const METRICS: Metric[] = [
  { label: "Calls made", value: TODAY_METRICS.callsMade, icon: PhoneCall, delta: { value: "+12% vs avg", trend: "up" } },
  { label: "Connect rate", value: `${Math.round(TODAY_METRICS.connectRate * 100)}%`, icon: TrendingUp, delta: { value: "+4 pts", trend: "up" } },
  { label: "Screenings done", value: TODAY_METRICS.screeningsCompleted, icon: MessageSquareText, subdetail: `Avg ${Math.round(TODAY_METRICS.avgCallDurationSec / 60)}m per call` },
  { label: "Shortlisted", value: TODAY_METRICS.shortlisted, icon: UserCheck, delta: { value: `${Math.round((TODAY_METRICS.shortlisted / TODAY_METRICS.screeningsCompleted) * 100)}% pass rate`, trend: "flat" } },
  { label: "Voicemails dropped", value: TODAY_METRICS.voicemailDropped, icon: PhoneOff, delta: { value: "-3 vs avg", trend: "down" } },
];

export function MetricStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {METRICS.map((m) => <MetricCard key={m.label} metric={m} />)}
    </div>
  );
}

function MetricCard({ metric: m }: { metric: Metric }) {
  const Icon = m.icon;
  const TrendIcon = m.delta?.trend === "down" ? TrendingDown : TrendingUp;
  const deltaColor = m.delta?.trend === "up" ? "text-success-ink" : m.delta?.trend === "down" ? "text-danger-ink" : "text-muted-fg";

  return (
    <Card className="hover:border-stellar/30 transition-colors gap-0 py-0 shadow-cx-1">
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-muted-fg">
            <Icon className="h-3.5 w-3.5" />
            <span className="t-label-medium">{m.label}</span>
          </div>
        </div>
        <div className="t-headline-medium text-cosmic tabular-nums leading-none mb-2">{m.value}</div>
        {m.delta && (
          <div className={cn("flex items-center gap-1 t-body-small", deltaColor)}>
            {m.delta.trend !== "flat" && <TrendIcon className="h-3 w-3" />}
            <span>{m.delta.value}</span>
          </div>
        )}
        {m.subdetail && !m.delta && <div className="t-body-small text-muted-fg">{m.subdetail}</div>}
      </CardContent>
    </Card>
  );
}
