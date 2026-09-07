==============================================================================
CONNX — Build Pass 2 (Recruiter Dashboard, fully built)
==============================================================================

This bundle contains 13 files for Pass 2.
Each file is delimited by:
  >>> FILE: <relative path>
  ... contents ...
  <<< END FILE

INSTALLATION:
  1. You should already have Pass 1 in your Make project.
  2. Add all the new files at the paths shown.
  3. REPLACE src/pages/recruiter/dashboard.tsx with the version below.
  4. No config or dependency changes needed.

==============================================================================
>>> FILE: README.md
==============================================================================
# CONNX — Build Pass 2

The Recruiter Dashboard, fully built. This builds on top of Pass 1's foundation and replaces the dashboard placeholder.

## What's in Pass 2

**12 new files** that replace one (the dashboard) and add ten widgets plus extra mock data.

### New files
```
src/data/dashboard-mock.ts                             # Per-role pipelines, callbacks, LEO suggestions, 30-day trend
src/components/dashboard/hero-greeting.tsx             # Time-aware greeting + primary CTAs
src/components/dashboard/metric-strip.tsx              # 5-metric daily progress strip
src/components/dashboard/action-plan.tsx               # Today's prioritised action list (the most important widget)
src/components/dashboard/leo-assist.tsx                # Gradient surface, paginated AI suggestions
src/components/dashboard/goal-card.tsx                 # Goal vs Actuals — daily / weekly / monthly
src/components/dashboard/pipeline-funnels.tsx          # Per-role mini-funnels, health-coded
src/components/dashboard/callback-tracker.tsx          # Tabbed: Overdue / Today / Upcoming
src/components/dashboard/best-time-heatmap.tsx         # 7×12 heatmap with intensity-mapped cells + tooltips
src/components/dashboard/weekly-trend.tsx              # Recharts area chart (calls + screenings, last 7 days)
src/components/dashboard/recent-activity.tsx           # Vertical timeline of recent events
```

### Replaced file
```
src/pages/recruiter/dashboard.tsx                      # Now composes all 10 widgets in a 3-column responsive layout
```

## How to install on top of Pass 1

1. **Add the new files** to your existing Pass 1 project at the paths shown above.
2. **Replace** `src/pages/recruiter/dashboard.tsx` with the new version.
3. No config or dependency changes — Pass 1 already includes Recharts, Lucide, Radix, etc.

That's it. Refresh and the dashboard is fully alive.

## What you'll see

- **Personalised greeting** ("Good morning, Jordan · Here's what's happening across your roles this Tuesday.") with three primary CTAs
- **5-metric strip**: Calls made, Connect rate, Screenings done, Shortlisted, Voicemails dropped — each with delta vs average
- **Today's action plan** (left, 2/3 width): prioritised list of callbacks, calls, and consent follow-ups, urgency-rail-coded, with hover-revealed call buttons
- **LEO Assist** (right top): gradient surface with paginated next-best-action suggestions ("Prime calling window opens in 5 min" · "Engineering Manager, Mobile is at risk" · "5 consents pending 48+ hours")
- **Goals** (right bottom): daily / weekly / monthly progress with on-pace indicator
- **Pipeline by role** (left, 2/3 width): 4 most active roles with mini funnels (Shortlisted → Consented → Screened → Advanced) and health badges (On track / At risk / Stalled)
- **Callbacks** (right): tabbed Overdue / Today / Upcoming with attempt counts and time-coded chips
- **Best time to call** (left, 2/3 width): 7-day × 12-hour heatmap with hover tooltips, peak-window callout, and legend
- **This week** (right): area chart showing calls and screenings over the past 7 days, totals at the top
- **Recent activity**: vertical timeline of the last 6 events across all roles

## Design decisions worth flagging

1. **The action plan is the visual anchor** — biggest card, top-left, two-thirds wide. Recruiter's eye lands there first because "what should I do next" is the only question that matters at 9am.

2. **LEO is contextual, not chatty** — it's a quiet gradient surface that surfaces 1 idea at a time, dismissable. Not a chatbot tab. Pagination dots tell the recruiter how many other suggestions are queued.

3. **Pipeline funnels use bar widths, not full Sankey** — funnels are noisy at this scale. Four equal-width slots with proportional fill bars communicates the same story cleaner. The recruiter cares about "where's the choke point" and the eye answers that in under a second.

4. **Heatmap shows numeric values only on high-intensity cells** — empty white-space on low-intensity cells is the data. Showing "5%" everywhere would clutter the canvas without adding signal.

5. **Goal card shows pace, not just %** — "31/35 · On pace" is more actionable than "89%". The pace check uses time-of-day, so by 4pm "behind pace" actually means behind, not "you're at 60% of target with 4 hours to go."

6. **Mobile**: 3-column layouts collapse to 1-column on `lg:` (1024px). Metric strip goes from 5-col → 3-col → 2-col. Heatmap horizontal-scrolls inside its card on narrow screens. Action plan rows hide the time column on mobile and let the row stay tight.

## What's next (Pass 3)

Roles & candidates list view, role detail with full candidate table, consent center with audit trail, and the templates library. Three more recruiter surfaces, all fully built.
<<< END FILE

==============================================================================
>>> FILE: src/data/dashboard-mock.ts
==============================================================================
import { ROLES, CANDIDATES } from "./mock";
import type { Candidate } from "@/types";

// Per-role pipeline data for the dashboard funnel widget
export interface RolePipeline {
  roleId: string;
  title: string;
  team: string;
  shortlisted: number;
  consented: number;
  screened: number;
  advanced: number;
  health: "on-track" | "at-risk" | "stalled";
  daysOpen: number;
}

export const ROLE_PIPELINES: RolePipeline[] = ROLES.map((r) => {
  const days = Math.floor((Date.now() - new Date(r.openedAt).getTime()) / 86400000);
  let health: RolePipeline["health"] = "on-track";
  if (days > 25 && r.advanced < r.targetCount) health = "at-risk";
  if (r.consented === 0 && days > 7) health = "stalled";
  return {
    roleId: r.id,
    title: r.title,
    team: r.team,
    shortlisted: r.shortlisted,
    consented: r.consented,
    screened: r.screened,
    advanced: r.advanced,
    health,
    daysOpen: days,
  };
});

// Callbacks — overdue, today, upcoming
export interface CallbackItem {
  id: string;
  candidateName: string;
  roleTitle: string;
  scheduledAt: string;
  category: "overdue" | "today" | "upcoming";
  attempts: number;
  candidateId: string;
}

export const CALLBACKS: CallbackItem[] = [
  {
    id: "cb-1", candidateName: "Aisha Okafor", candidateId: "cand-1001",
    roleTitle: "Senior Backend Engineer",
    scheduledAt: "Yesterday, 4:00 PM",
    category: "overdue", attempts: 2,
  },
  {
    id: "cb-2", candidateName: "Tariq Hassan", candidateId: "cand-1004",
    roleTitle: "Senior Backend Engineer",
    scheduledAt: "2 days ago, 10:30 AM",
    category: "overdue", attempts: 1,
  },
  {
    id: "cb-3", candidateName: "Yuki Tanaka", candidateId: "cand-1010",
    roleTitle: "Senior Backend Engineer",
    scheduledAt: "Today, 3:30 PM",
    category: "today", attempts: 1,
  },
  {
    id: "cb-4", candidateName: "Marcus Reyes", candidateId: "cand-1012",
    roleTitle: "Staff Product Designer",
    scheduledAt: "Today, 5:00 PM",
    category: "today", attempts: 0,
  },
  {
    id: "cb-5", candidateName: "Naomi Petrov", candidateId: "cand-1015",
    roleTitle: "Senior Backend Engineer",
    scheduledAt: "Tomorrow, 11:00 AM",
    category: "upcoming", attempts: 0,
  },
  {
    id: "cb-6", candidateName: "Diego Mendoza", candidateId: "cand-1020",
    roleTitle: "Engineering Manager, Mobile",
    scheduledAt: "Tomorrow, 2:00 PM",
    category: "upcoming", attempts: 0,
  },
  {
    id: "cb-7", candidateName: "Felix Lindqvist", candidateId: "cand-1018",
    roleTitle: "Site Reliability Engineer",
    scheduledAt: "Thu, 9:30 AM",
    category: "upcoming", attempts: 0,
  },
];

// LEO Assist suggestions — context-aware next-best-actions
export interface LeoSuggestion {
  id: string;
  type: "best-time" | "stalled-role" | "ready-to-call" | "follow-up" | "hot-candidate";
  headline: string;
  detail: string;
  cta: string;
  ctaPath: string;
  urgency: "now" | "soon" | "info";
}

export const LEO_SUGGESTIONS: LeoSuggestion[] = [
  {
    id: "leo-1",
    type: "best-time",
    headline: "Prime calling window opens in 5 min",
    detail: "Your connect rate jumps to 64% on Tuesdays between 10:30 AM and 12:00 PM. 8 consented candidates are waiting.",
    cta: "Start dialer",
    ctaPath: "/dialer",
    urgency: "now",
  },
  {
    id: "leo-2",
    type: "stalled-role",
    headline: "Engineering Manager, Mobile is at risk",
    detail: "12 candidates shortlisted, only 7 consented. Consent rate is 58% — well below your 71% average for this role family.",
    cta: "Resend consent",
    ctaPath: "/consent",
    urgency: "soon",
  },
  {
    id: "leo-3",
    type: "follow-up",
    headline: "5 consents pending 48+ hours",
    detail: "Senior Backend Engineer — likely to expire by Friday without a nudge.",
    cta: "Send SMS reminder",
    ctaPath: "/bulk",
    urgency: "soon",
  },
];

// Weekly trend (already in mock.ts as WEEK_TREND, but adding a 30-day version)
export const TREND_30D = (() => {
  const out: { date: string; calls: number; screened: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    const calls = isWeekend ? Math.floor(Math.random() * 8) : 24 + Math.floor(Math.random() * 22);
    const screened = isWeekend ? Math.floor(calls * 0.4) : Math.floor(calls * (0.35 + Math.random() * 0.15));
    out.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      calls, screened,
    });
  }
  return out;
})();

// Candidates ready to call right now
export function getReadyToCall(): Candidate[] {
  return CANDIDATES.filter((c) => c.consentStatus === "accepted" && c.stage === "consented").slice(0, 8);
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/hero-greeting.tsx
==============================================================================
import { useNavigate } from "react-router-dom";
import { PhoneCall, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRENT_RECRUITER } from "@/data/mock";

export function HeroGreeting() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = CURRENT_RECRUITER.name.split(" ")[0];

  // Day-of-week aware secondary copy
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const subline = `Here's what's happening across your roles this ${day}.`;

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="mb-1">{greeting}, {firstName}</h1>
        <p className="text-muted-fg t-body-large">{subline}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate("/bulk")}>
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Compose bulk</span>
          <span className="sm:hidden">Bulk</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate("/dialer")} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-quantum" />
          <span className="hidden sm:inline">Resume queue</span>
          <span className="sm:hidden">Resume</span>
        </Button>
        <Button size="sm" onClick={() => navigate("/dialer")}>
          <PhoneCall className="h-3.5 w-3.5" />
          Start dialer
        </Button>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/metric-strip.tsx
==============================================================================
import { PhoneCall, PhoneOff, MessageSquareText, UserCheck, UserX, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TODAY_METRICS } from "@/data/mock";

interface Metric {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  delta?: { value: string; trend: "up" | "down" | "flat" };
  subdetail?: string;
}

const METRICS: Metric[] = [
  {
    label: "Calls made",
    value: TODAY_METRICS.callsMade,
    icon: PhoneCall,
    delta: { value: "+12% vs avg", trend: "up" },
  },
  {
    label: "Connect rate",
    value: `${Math.round(TODAY_METRICS.connectRate * 100)}%`,
    icon: TrendingUp,
    delta: { value: "+4 pts", trend: "up" },
  },
  {
    label: "Screenings done",
    value: TODAY_METRICS.screeningsCompleted,
    icon: MessageSquareText,
    subdetail: `Avg ${Math.round(TODAY_METRICS.avgCallDurationSec / 60)}m per call`,
  },
  {
    label: "Shortlisted",
    value: TODAY_METRICS.shortlisted,
    icon: UserCheck,
    delta: { value: `${Math.round((TODAY_METRICS.shortlisted / TODAY_METRICS.screeningsCompleted) * 100)}% pass rate`, trend: "flat" },
  },
  {
    label: "Voicemails dropped",
    value: TODAY_METRICS.voicemailDropped,
    icon: PhoneOff,
    delta: { value: "-3 vs avg", trend: "down" },
  },
];

export function MetricStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {METRICS.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </div>
  );
}

function MetricCard({ metric: m }: { metric: Metric }) {
  const Icon = m.icon;
  const TrendIcon = m.delta?.trend === "down" ? TrendingDown : TrendingUp;
  const deltaColor =
    m.delta?.trend === "up"
      ? "text-success-ink"
      : m.delta?.trend === "down"
      ? "text-danger-ink"
      : "text-muted-fg";

  return (
    <Card className="hover:border-stellar/30 transition-colors">
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-muted-fg">
            <Icon className="h-3.5 w-3.5" />
            <span className="t-label-medium">{m.label}</span>
          </div>
        </div>
        <div className="t-headline-medium text-cosmic tabular-nums leading-none mb-2">
          {m.value}
        </div>
        {m.delta && (
          <div className={cn("flex items-center gap-1 t-body-small", deltaColor)}>
            {m.delta.trend !== "flat" && <TrendIcon className="h-3 w-3" />}
            <span>{m.delta.value}</span>
          </div>
        )}
        {m.subdetail && !m.delta && (
          <div className="t-body-small text-muted-fg">{m.subdetail}</div>
        )}
      </CardContent>
    </Card>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/leo-assist.tsx
==============================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEO_SUGGESTIONS } from "@/data/dashboard-mock";
import { cn } from "@/lib/utils";

export function LeoAssist() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const visible = LEO_SUGGESTIONS.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  const current = visible[Math.min(index, visible.length - 1)];

  return (
    <div className="leo-gradient rounded-xl p-5 lg:p-6 text-white relative overflow-hidden">
      {/* Decorative dots — subtle texture */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="2" fill="white" />
          <circle cx="60" cy="40" r="1.5" fill="white" />
          <circle cx="90" cy="60" r="1" fill="white" />
          <circle cx="70" cy="80" r="2" fill="white" />
          <circle cx="40" cy="70" r="1" fill="white" />
        </svg>
      </div>

      <div className="flex items-start gap-3 mb-4 relative">
        <div className="bg-white/20 rounded-md p-1.5 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="t-title-small">LEO Assist</span>
            {current.urgency === "now" && (
              <span className="t-label-small bg-white/20 px-1.5 py-0.5 rounded-pill">
                Act now
              </span>
            )}
          </div>
          <p className="t-body-small text-white/80">Suggestion {index + 1} of {visible.length}</p>
        </div>
        <button
          onClick={() => setDismissed((d) => new Set([...d, current.id]))}
          className="text-white/60 hover:text-white transition-colors -mt-1 -mr-1 p-1 rounded-md hover:bg-white/10 focus-ring"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative min-h-[80px]">
        <h5 className="text-white t-title-large mb-2">{current.headline}</h5>
        <p className="t-body-medium text-white/85 mb-4">{current.detail}</p>
        <Button
          variant="default"
          size="sm"
          className="bg-white text-cosmic hover:bg-white/90 active:scale-[0.98]"
          onClick={() => navigate(current.ctaPath)}
        >
          {current.cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Pagination */}
      {visible.length > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-pill transition-all",
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Suggestion ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm" variant="ghost"
              className="text-white hover:bg-white/15 hover:text-white h-7 w-7"
              onClick={() => setIndex((i) => (i - 1 + visible.length) % visible.length)}
              aria-label="Previous suggestion"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon-sm" variant="ghost"
              className="text-white hover:bg-white/15 hover:text-white h-7 w-7"
              onClick={() => setIndex((i) => (i + 1) % visible.length)}
              aria-label="Next suggestion"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/goal-card.tsx
==============================================================================
import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GOALS } from "@/data/mock";
import { cn } from "@/lib/utils";

export function GoalCard() {
  const dailyPct = (GOALS.daily.actual / GOALS.daily.target) * 100;
  const weeklyPct = (GOALS.weekly.actual / GOALS.weekly.target) * 100;
  const monthlyPct = (GOALS.monthly.actual / GOALS.monthly.target) * 100;

  // Compute hour of day to gauge if pace is on track
  const hour = new Date().getHours();
  const dayProgress = Math.min(((hour - 8) / 10) * 100, 100); // assume 8am-6pm work day
  const onPace = dailyPct >= dayProgress * 0.85;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-stellar" />
          <CardTitle>Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoalRow
          label="Today"
          actual={GOALS.daily.actual}
          target={GOALS.daily.target}
          pct={dailyPct}
          hint={onPace ? "On pace" : "Behind pace"}
          onPace={onPace}
        />
        <GoalRow
          label="This week"
          actual={GOALS.weekly.actual}
          target={GOALS.weekly.target}
          pct={weeklyPct}
        />
        <GoalRow
          label="This month"
          actual={GOALS.monthly.actual}
          target={GOALS.monthly.target}
          pct={monthlyPct}
        />
      </CardContent>
    </Card>
  );
}

function GoalRow({
  label, actual, target, pct, hint, onPace = true,
}: {
  label: string; actual: number; target: number; pct: number; hint?: string; onPace?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="t-label-medium text-muted-fg">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="t-title-medium text-cosmic tabular-nums">{actual}</span>
          <span className="t-body-small text-muted">/ {target}</span>
          {hint && (
            <span className={cn("t-label-small ml-1", onPace ? "text-success-ink" : "text-warning-ink")}>
              {hint}
            </span>
          )}
        </div>
      </div>
      <Progress
        value={Math.min(pct, 100)}
        indicatorClassName={cn(
          pct >= 100 ? "bg-success" : pct >= 70 ? "bg-stellar" : "bg-warning"
        )}
      />
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/action-plan.tsx
==============================================================================
import { useNavigate } from "react-router-dom";
import { Phone, Clock, MessageSquareText, ChevronRight, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import { TODAY_ACTIONS } from "@/data/mock";
import { cn } from "@/lib/utils";

const ICONS = {
  callback: Phone,
  call: Phone,
  "consent-followup": MessageSquareText,
} as const;

const TYPE_LABEL = {
  callback: "Callback",
  call: "Scheduled call",
  "consent-followup": "Consent follow-up",
} as const;

export function ActionPlan() {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Today's action plan</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">
            {TODAY_ACTIONS.length} actions queued · prioritised by urgency and best-time-to-reach
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dialer")}>
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col">
          {TODAY_ACTIONS.map((action, i) => {
            const Icon = ICONS[action.type];
            const isHighUrgency = action.urgency === "high";

            return (
              <div
                key={action.id}
                className={cn(
                  "group flex items-center gap-3 py-3 cursor-pointer hover:bg-mist -mx-5 px-5 transition-colors",
                  i !== TODAY_ACTIONS.length - 1 && "border-b border-border"
                )}
                onClick={() => navigate("/dialer")}
              >
                {/* Urgency rail */}
                <div className={cn(
                  "h-8 w-1 rounded-pill shrink-0",
                  action.urgency === "high" ? "bg-danger" :
                  action.urgency === "medium" ? "bg-warning" : "bg-stellar/30"
                )} />

                {/* Avatar */}
                <NameAvatar name={action.candidateName.startsWith("5 ") ? "5+" : action.candidateName} size={32} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="t-label-large text-dark truncate">{action.candidateName}</span>
                    {isHighUrgency && (
                      <Badge variant="danger" size="sm" className="gap-0.5">
                        <AlertCircle className="h-2.5 w-2.5" /> Overdue
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 t-body-small text-muted-fg">
                    <span>{TYPE_LABEL[action.type]}</span>
                    <span className="text-muted">·</span>
                    <span className="truncate">{action.roleTitle}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 t-label-medium text-cosmic">
                    {action.type === "callback" ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {action.at}
                  </div>
                </div>

                {/* Action button */}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => { e.stopPropagation(); navigate("/dialer"); }}
                  aria-label={`Call ${action.candidateName}`}
                >
                  <Phone className="h-3.5 w-3.5 text-stellar" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Empty state guard */}
        {TODAY_ACTIONS.length === 0 && (
          <div className="text-center py-8">
            <div className="t-title-medium text-cosmic mb-1">All caught up</div>
            <p className="t-body-medium text-muted-fg">No actions for today. Source from a role to start a new queue.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/pipeline-funnels.tsx
==============================================================================
import { useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_PIPELINES } from "@/data/dashboard-mock";
import { cn } from "@/lib/utils";

const HEALTH_CONFIG = {
  "on-track": { label: "On track", icon: CheckCircle2, color: "text-success-ink", bg: "bg-success-soft" },
  "at-risk": { label: "At risk", icon: Clock, color: "text-warning-ink", bg: "bg-warning-soft" },
  "stalled": { label: "Stalled", icon: AlertTriangle, color: "text-danger-ink", bg: "bg-danger-soft" },
} as const;

export function PipelineFunnels() {
  const navigate = useNavigate();
  // Show 4 most active roles
  const visible = [...ROLE_PIPELINES].sort((a, b) => b.shortlisted - a.shortlisted).slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Pipeline by role</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">
            Funnel from shortlisted through advanced
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/roles")}>
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

function PipelineRow({
  pipeline,
  onClick,
}: {
  pipeline: typeof ROLE_PIPELINES[number];
  onClick: () => void;
}) {
  const health = HEALTH_CONFIG[pipeline.health];
  const HealthIcon = health.icon;

  // Stage values for visual funnel
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
      className="group cursor-pointer hover:bg-mist -mx-5 px-5 py-3 transition-colors border-b border-border last:border-0"
    >
      <div className="flex items-center justify-between mb-2.5 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="t-label-large text-dark truncate">{pipeline.title}</span>
            <Badge
              size="sm"
              className={cn("gap-0.5", health.bg, health.color, "border-0")}
            >
              <HealthIcon className="h-2.5 w-2.5" />
              {health.label}
            </Badge>
          </div>
          <div className="t-body-small text-muted-fg">
            {pipeline.team} · {pipeline.daysOpen} days open
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>

      {/* Funnel bars */}
      <div className="grid grid-cols-4 gap-1.5">
        {stages.map((s, i) => {
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
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/callback-tracker.tsx
==============================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Clock, CalendarDays, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CALLBACKS } from "@/data/dashboard-mock";
import { cn } from "@/lib/utils";

export function CallbackTracker() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overdue" | "today" | "upcoming">("overdue");

  const counts = {
    overdue: CALLBACKS.filter((c) => c.category === "overdue").length,
    today: CALLBACKS.filter((c) => c.category === "today").length,
    upcoming: CALLBACKS.filter((c) => c.category === "upcoming").length,
  };

  const filtered = CALLBACKS.filter((c) => c.category === tab);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Callbacks</CardTitle>
        <p className="t-body-small text-muted-fg">
          {counts.overdue} overdue · {counts.today} today · {counts.upcoming} upcoming
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="overdue" className="gap-1.5">
              Overdue
              {counts.overdue > 0 && (
                <span className="t-label-small bg-danger-soft text-danger-ink px-1.5 rounded-pill min-w-[18px]">
                  {counts.overdue}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="today" className="gap-1.5">
              Today
              {counts.today > 0 && (
                <span className="t-label-small bg-warning-soft text-warning-ink px-1.5 rounded-pill min-w-[18px]">
                  {counts.today}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0 space-y-1">
            {filtered.length === 0 ? (
              <EmptyState type={tab} />
            ) : (
              filtered.map((cb) => <CallbackRow key={cb.id} cb={cb} onClick={() => navigate(`/candidates/${cb.candidateId}`)} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function CallbackRow({ cb, onClick }: { cb: typeof CALLBACKS[number]; onClick: () => void }) {
  const isOverdue = cb.category === "overdue";

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 py-2.5 cursor-pointer hover:bg-mist -mx-5 px-5 transition-colors border-b border-border last:border-0"
    >
      <NameAvatar name={cb.candidateName} size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="t-label-large text-dark truncate">{cb.candidateName}</span>
          {cb.attempts > 0 && (
            <Badge variant="outline" size="sm" className="gap-0.5">
              {cb.attempts} {cb.attempts === 1 ? "attempt" : "attempts"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 t-body-small text-muted-fg">
          <span className="truncate">{cb.roleTitle}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        {isOverdue ? <AlertCircle className="h-3 w-3 text-danger" /> : <CalendarDays className="h-3 w-3 text-muted-fg" />}
        <span className={cn("t-label-medium", isOverdue ? "text-danger-ink" : "text-cosmic")}>
          {cb.scheduledAt}
        </span>
      </div>
      <Button
        size="icon-sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={`Call ${cb.candidateName}`}
      >
        <Phone className="h-3.5 w-3.5 text-stellar" />
      </Button>
    </div>
  );
}

function EmptyState({ type }: { type: "overdue" | "today" | "upcoming" }) {
  const COPY = {
    overdue: { title: "No overdue callbacks", desc: "Nice — you're keeping up." },
    today: { title: "Nothing scheduled today", desc: "Free space for new screening calls." },
    upcoming: { title: "No upcoming callbacks", desc: "Schedule one from any candidate's profile." },
  };
  const c = COPY[type];
  return (
    <div className="text-center py-6">
      <div className="t-label-large text-cosmic mb-0.5">{c.title}</div>
      <p className="t-body-small text-muted-fg">{c.desc}</p>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/best-time-heatmap.tsx
==============================================================================
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HEATMAP_DATA } from "@/data/mock";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm"];

// Map connect rate (0..1) to a Stellar Blue intensity
function cellColor(rate: number): { bg: string; text: string } {
  if (rate < 0.1) return { bg: "#F6F9FD", text: "rgba(55,58,64,0.4)" };       // Lunar Mist
  if (rate < 0.25) return { bg: "#EBF2FE", text: "#2D2E67" };                  // Stellar 50
  if (rate < 0.4) return { bg: "#C7DAFD", text: "#2D2E67" };                   // Stellar 100
  if (rate < 0.55) return { bg: "#7BAEFC", text: "#FFFFFF" };                  // Stellar mid
  return { bg: "#3E83FA", text: "#FFFFFF" };                                   // Stellar
}

export function BestTimeHeatmap() {
  // Find peak cell to call out
  const peak = useMemo(() => {
    let max = 0, peakDay = 0, peakHour = 0;
    HEATMAP_DATA.forEach((row, d) => row.forEach((v, h) => {
      if (v > max) { max = v; peakDay = d; peakHour = h; }
    }));
    return { rate: max, day: DAYS[peakDay], hour: HOURS[peakHour] };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle>Best time to call</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">
            Connect rate by day and hour · last 30 days
          </p>
        </div>
        <Badge variant="info" className="gap-1">
          Peak: {peak.day} {peak.hour} ({Math.round(peak.rate * 100)}%)
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Heatmap grid */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="min-w-[460px]">
            {/* Hour labels */}
            <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-0.5 mb-1">
              <div />
              {HOURS.map((h) => (
                <div key={h} className="t-body-small text-muted text-center tabular-nums">
                  {h.replace(/[ap]m/, "")}
                </div>
              ))}
            </div>

            {/* Rows */}
            {DAYS.map((day, di) => (
              <div key={day} className="grid grid-cols-[40px_repeat(12,1fr)] gap-0.5 mb-0.5">
                <div className="t-label-medium text-muted-fg flex items-center">{day}</div>
                {HEATMAP_DATA[di].map((rate, hi) => {
                  const c = cellColor(rate);
                  return (
                    <Tooltip key={hi}>
                      <TooltipTrigger asChild>
                        <div
                          className="aspect-square rounded-sm flex items-center justify-center cursor-default transition-transform hover:scale-110 hover:z-10 relative tabular-nums"
                          style={{ backgroundColor: c.bg, color: c.text, fontSize: "10px", fontWeight: 600, minHeight: 24 }}
                        >
                          {rate >= 0.4 ? Math.round(rate * 100) : ""}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="t-label-medium">{day} · {HOURS[hi]}</div>
                        <div className="t-body-small text-white/80">Connect rate: {Math.round(rate * 100)}%</div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="t-body-small text-muted-fg">
            Tip: Tuesdays 10–12 are your strongest window.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="t-body-small text-muted">Less</span>
            <div className="flex gap-0.5">
              {[0.05, 0.2, 0.35, 0.5, 0.65].map((r) => (
                <div key={r} className="w-3 h-3 rounded-sm" style={{ backgroundColor: cellColor(r).bg }} />
              ))}
            </div>
            <span className="t-body-small text-muted">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/weekly-trend.tsx
==============================================================================
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { WEEK_TREND } from "@/data/mock";

export function WeeklyTrend() {
  const totalCalls = WEEK_TREND.reduce((acc, d) => acc + d.calls, 0);
  const totalScreened = WEEK_TREND.reduce((acc, d) => acc + d.screened, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>This week</CardTitle>
            <p className="t-body-small text-muted-fg mt-0.5">
              Calls and screenings · last 7 days
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Stat label="Calls" value={totalCalls} dotColor="#3E83FA" />
            <Stat label="Screened" value={totalScreened} dotColor="#48E29A" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEK_TREND} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trendCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3E83FA" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3E83FA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendScreened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#48E29A" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#48E29A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#E8EBF0" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(55,58,64,0.5)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(55,58,64,0.5)" }}
                width={32}
              />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#3E83FA"
                strokeWidth={2}
                fill="url(#trendCalls)"
              />
              <Area
                type="monotone"
                dataKey="screened"
                stroke="#16883D"
                strokeWidth={2}
                fill="url(#trendScreened)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, dotColor }: { label: string; value: number; dotColor: string }) {
  return (
    <div className="text-right">
      <div className="flex items-center gap-1.5 t-label-small text-muted-fg justify-end mb-0.5">
        <span className="h-2 w-2 rounded-pill" style={{ backgroundColor: dotColor }} />
        {label}
      </div>
      <div className="t-title-large text-cosmic tabular-nums">{value}</div>
    </div>
  );
}

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cosmic text-white rounded-md px-2.5 py-1.5 shadow-2">
      <div className="t-label-small mb-0.5">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="t-body-small flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-pill" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span className="tabular-nums font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dashboard/recent-activity.tsx
==============================================================================
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Phone, MessageSquareText, Send, ShieldCheck, ChevronRight, Calendar, XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RECENT_ACTIVITY } from "@/data/mock";
import { cn } from "@/lib/utils";

const ICONS = {
  "screening-complete": CheckCircle2,
  "consent-accepted": ShieldCheck,
  "voicemail": Phone,
  "callback-scheduled": Calendar,
  "bulk-sent": Send,
} as const;

const ICON_COLORS = {
  "screening-complete": "text-stellar",
  "consent-accepted": "text-success-ink",
  "voicemail": "text-muted-fg",
  "callback-scheduled": "text-quantum",
  "bulk-sent": "text-stellar",
} as const;

export function RecentActivity() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Recent activity</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/timeline")}>
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Timeline rail */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = ICONS[item.type as keyof typeof ICONS] || MessageSquareText;
              const colorClass = ICON_COLORS[item.type as keyof typeof ICON_COLORS] || "text-muted-fg";
              const isShortlisted = (item as any).outcome === "shortlisted";
              const isRejected = (item as any).outcome === "rejected";
              const FinalIcon = isRejected ? XCircle : isShortlisted ? CheckCircle2 : Icon;
              const finalColor = isRejected ? "text-danger-ink" : isShortlisted ? "text-success-ink" : colorClass;

              return (
                <div key={item.id} className="flex items-start gap-3 relative">
                  <div className="h-6 w-6 rounded-pill bg-white border border-border flex items-center justify-center shrink-0 relative z-10">
                    <FinalIcon className={cn("h-3 w-3", finalColor)} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="t-body-medium text-dark leading-snug">{item.text}</p>
                    <p className="t-body-small text-muted-fg mt-0.5">{item.at}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/dashboard.tsx
==============================================================================
import { HeroGreeting } from "@/components/dashboard/hero-greeting";
import { MetricStrip } from "@/components/dashboard/metric-strip";
import { ActionPlan } from "@/components/dashboard/action-plan";
import { LeoAssist } from "@/components/dashboard/leo-assist";
import { GoalCard } from "@/components/dashboard/goal-card";
import { PipelineFunnels } from "@/components/dashboard/pipeline-funnels";
import { CallbackTracker } from "@/components/dashboard/callback-tracker";
import { BestTimeHeatmap } from "@/components/dashboard/best-time-heatmap";
import { WeeklyTrend } from "@/components/dashboard/weekly-trend";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto space-y-6">
      {/* Hero */}
      <HeroGreeting />

      {/* Metric strip */}
      <MetricStrip />

      {/* Primary row: Action plan + LEO + Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2">
          <ActionPlan />
        </div>
        <div className="space-y-4 lg:space-y-5">
          <LeoAssist />
          <GoalCard />
        </div>
      </div>

      {/* Secondary row: Pipeline + Callbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2">
          <PipelineFunnels />
        </div>
        <CallbackTracker />
      </div>

      {/* Tertiary row: Heatmap + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2">
          <BestTimeHeatmap />
        </div>
        <WeeklyTrend />
      </div>

      {/* Activity feed */}
      <RecentActivity />

      {/* Subtle footer */}
      <div className="text-center pt-2 pb-4">
        <p className="t-body-small text-muted-fg">
          Last synced just now · Auto-refreshes every 5 minutes
        </p>
      </div>
    </div>
  );
}
<<< END FILE