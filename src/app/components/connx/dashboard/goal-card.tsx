import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { GOALS } from "../mock";
import { cn } from "../../ui/utils";
import { ProgressBar } from "../ui-helpers";

export function GoalCard() {
  const dailyPct = (GOALS.daily.actual / GOALS.daily.target) * 100;
  const weeklyPct = (GOALS.weekly.actual / GOALS.weekly.target) * 100;
  const monthlyPct = (GOALS.monthly.actual / GOALS.monthly.target) * 100;

  const hour = new Date().getHours();
  const dayProgress = Math.min(((hour - 8) / 10) * 100, 100);
  const onPace = dailyPct >= dayProgress * 0.85;

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-stellar" />
          <CardTitle className="t-title-medium text-cosmic">Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoalRow label="Today" actual={GOALS.daily.actual} target={GOALS.daily.target} pct={dailyPct} hint={onPace ? "On pace" : "Behind pace"} onPace={onPace} />
        <GoalRow label="This week" actual={GOALS.weekly.actual} target={GOALS.weekly.target} pct={weeklyPct} />
        <GoalRow label="This month" actual={GOALS.monthly.actual} target={GOALS.monthly.target} pct={monthlyPct} />
      </CardContent>
    </Card>
  );
}

function GoalRow({
  label, actual, target, pct, hint, onPace = true,
}: { label: string; actual: number; target: number; pct: number; hint?: string; onPace?: boolean; }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="t-label-medium text-muted-fg">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="t-title-medium text-cosmic tabular-nums">{actual}</span>
          <span className="t-body-small text-[rgba(55,58,64,0.5)]">/ {target}</span>
          {hint && (
            <span className={cn("t-label-small ml-1", onPace ? "text-success-ink" : "text-warning-ink")}>{hint}</span>
          )}
        </div>
      </div>
      <ProgressBar
        value={Math.min(pct, 100)}
        indicatorClassName={cn(pct >= 100 ? "bg-success" : pct >= 70 ? "bg-stellar" : "bg-warning")}
      />
    </div>
  );
}
