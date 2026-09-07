import { useNavigate } from "react-router";
import { ChevronRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ROLE_PIPELINES, type RolePipeline } from "../dashboard-mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";

const HEALTH_CONFIG = {
  "on-track": { label: "On track", icon: CheckCircle2, tone: "success" as const },
  "at-risk": { label: "At risk", icon: Clock, tone: "warning" as const },
  "stalled": { label: "Stalled", icon: AlertTriangle, tone: "danger" as const },
};

export function PipelineFunnels() {
  const navigate = useNavigate();
  const visible = [...ROLE_PIPELINES].sort((a, b) => b.shortlisted - a.shortlisted).slice(0, 4);

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="t-title-medium text-cosmic">Pipeline by role</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">Funnel from shortlisted through advanced</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/roles")} className="gap-1">
          All roles
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {visible.map((p) => (
          <PipelineRow key={p.roleId} pipeline={p} onClick={() => navigate(`/roles/${p.roleId}`)} />
        ))}
      </CardContent>
    </Card>
  );
}

function PipelineRow({ pipeline, onClick }: { pipeline: RolePipeline; onClick: () => void }) {
  const health = HEALTH_CONFIG[pipeline.health];
  const HealthIcon = health.icon;

  const stages = [
    { label: "Shortlisted", value: pipeline.shortlisted, color: "bg-cosmic/15" },
    { label: "Consented", value: pipeline.consented, color: "bg-stellar/30" },
    { label: "Screened", value: pipeline.screened, color: "bg-stellar/55" },
    { label: "Advanced", value: pipeline.advanced, color: "bg-success" },
  ];
  const max = pipeline.shortlisted || 1;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer hover:bg-mist -mx-6 px-6 py-3 transition-colors border-b border-[#E8EBF0] last:border-0"
    >
      <div className="flex items-center justify-between mb-2.5 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="t-label-large text-dark truncate">{pipeline.title}</span>
            <ChipBadge tone={health.tone} size="sm" className="gap-0.5">
              <HealthIcon className="h-2.5 w-2.5" />
              {health.label}
            </ChipBadge>
          </div>
          <div className="t-body-small text-muted-fg">
            {pipeline.team} · {pipeline.daysOpen} days open
          </div>
        </div>
        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-fg" />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {stages.map((s) => {
          const widthPct = (s.value / max) * 100;
          return (
            <div key={s.label}>
              <div className="h-1.5 rounded-pill bg-mist overflow-hidden mb-1.5">
                <div
                  className={cn("h-full rounded-pill transition-all duration-500", s.color)}
                  style={{ width: `${Math.max(widthPct, 4)}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="t-body-small text-muted-fg truncate">{s.label}</span>
                <span className="t-label-medium text-dark tabular-nums">{s.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
