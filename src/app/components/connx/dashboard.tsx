import { ORG } from "./mock";
import { HeroGreeting } from "./dashboard/hero-greeting";
import { MetricStrip } from "./dashboard/metric-strip";
import { ActionPlan } from "./dashboard/action-plan";
import { LeoAssist } from "./dashboard/leo-assist";
import { GoalCard } from "./dashboard/goal-card";
import { PipelineFunnels } from "./dashboard/pipeline-funnels";
import { CallbackTracker } from "./dashboard/callback-tracker";
import { BestTimeHeatmap } from "./dashboard/best-time-heatmap";
import { WeeklyTrend } from "./dashboard/weekly-trend";
import { RecentActivity } from "./dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1280px] mx-auto space-y-6">
      <HeroGreeting />

      <MetricStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActionPlan />
        </div>
        <div className="space-y-4">
          <LeoAssist />
          <GoalCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PipelineFunnels />
        <CallbackTracker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BestTimeHeatmap />
        <WeeklyTrend />
      </div>

      <RecentActivity />

      <p className="t-body-small text-muted-fg text-center pt-2">
        {ORG.name} · {ORG.industry} · {ORG.size}
      </p>
    </div>
  );
}
