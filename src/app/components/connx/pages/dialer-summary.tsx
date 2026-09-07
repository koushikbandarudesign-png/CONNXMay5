import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  CheckCircle2, Clock, Pause, X, PhoneOff, Sparkles,
  ArrowRight, Home, RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ROLES, CANDIDATES } from "../pass3-mock";
import { NameAvatar, ChipBadge } from "../ui-helpers";
import { Stepper } from "./dialer-queue";

type Disp = "shortlisted" | "rejected" | "on-hold" | "callback" | "no-answer";

const TONE: Record<Disp, { label: string; tone: "success" | "danger" | "warning" | "info" | "neutral"; icon: React.ComponentType<{ className?: string }> }> = {
  shortlisted: { label: "Shortlisted",  tone: "success", icon: CheckCircle2 },
  callback:    { label: "Callback",     tone: "info",    icon: Clock },
  "on-hold":   { label: "On hold",      tone: "warning", icon: Pause },
  rejected:    { label: "Rejected",     tone: "danger",  icon: X },
  "no-answer": { label: "No answer",    tone: "neutral", icon: PhoneOff },
};

export default function DialerSummaryPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleId = params.get("role") || ROLES[0].id;
  const role = ROLES.find((r) => r.id === roleId) || ROLES[0];

  const dispositions = useMemo<Record<string, Disp>>(() => {
    try { return JSON.parse(params.get("dispositions") || "{}"); } catch { return {}; }
  }, [params]);

  const entries = Object.entries(dispositions) as [string, Disp][];
  const counts = entries.reduce((acc, [, d]) => { acc[d] = (acc[d] || 0) + 1; return acc; }, {} as Record<Disp, number>);
  const total = entries.length;
  const connected = total - (counts["no-answer"] || 0);
  const connectRate = total > 0 ? Math.round((connected / total) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="mb-5">
        <h1 className="mb-1">Session complete</h1>
        <p className="text-muted-fg t-body-large">
          Here's how the {role.title} dialing session went. All outcomes are saved to candidate timelines.
        </p>
      </div>

      <Stepper current={3} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5 mt-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Calls made" value={total} />
            <StatCard label="Connected" value={connected} sub={`${connectRate}%`} />
            <StatCard label="Shortlisted" value={counts.shortlisted || 0} tone="success" />
            <StatCard label="No answer" value={counts["no-answer"] || 0} tone="muted" />
          </div>

          <Card className="shadow-cx-1">
            <CardHeader className="pb-3"><CardTitle>Outcomes</CardTitle></CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="t-body-medium text-muted-fg py-6 text-center">No calls were logged in this session.</p>
              ) : (
                <div className="space-y-1.5">
                  {entries.map(([id, disp]) => {
                    const c = CANDIDATES.find((x) => x.id === id);
                    if (!c) return null;
                    const t = TONE[disp];
                    const Icon = t.icon;
                    return (
                      <div key={id} className="flex items-center gap-3 p-2.5 rounded-md border border-[#E8EBF0] bg-white">
                        <NameAvatar name={c.name} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="t-label-large text-dark truncate">{c.name}</div>
                          <div className="t-body-small text-muted-fg truncate">{c.currentRole} · {c.currentCompany}</div>
                        </div>
                        <ChipBadge tone={t.tone} size="sm" className="gap-1">
                          <Icon className="h-2.5 w-2.5" /> {t.label}
                        </ChipBadge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20 self-start space-y-4">
          <Card className="shadow-cx-1">
            <CardContent className="p-4 leo-gradient text-white rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="t-label-large">LEO recap</div>
              </div>
              <p className="t-body-small text-white/90 leading-relaxed">
                You connected with {connected} of {total} candidates ({connectRate}%).
                {(counts.shortlisted || 0) > 0 && ` ${counts.shortlisted} advanced to onsite.`}
                {(counts["no-answer"] || 0) > 0 && ` Try reaching the ${counts["no-answer"]} no-answers tomorrow at 11am — historically 2× pickup rate.`}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-4 space-y-2">
              <Button className="w-full gap-2 bg-stellar text-white hover:bg-stellar-700" onClick={() => navigate("/dialer")}>
                <RotateCcw className="h-4 w-4" /> Start new session
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate(`/roles/${roleId}`)}>
                Back to role
              </Button>
              <Button variant="ghost" className="w-full gap-2" onClick={() => navigate("/")}>
                <Home className="h-4 w-4" /> Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, tone }: { label: string; value: number; sub?: string; tone?: "success" | "muted" }) {
  return (
    <div className="bg-white rounded-lg border border-[#E8EBF0] p-3 shadow-cx-1">
      <div className="t-label-small text-muted-fg">{label}</div>
      <div className={`t-headline-small tabular-nums ${tone === "success" ? "text-success-ink" : tone === "muted" ? "text-muted-fg" : "text-cosmic"}`}>
        {value}
      </div>
      {sub && <div className="t-body-small text-muted-fg">{sub}</div>}
    </div>
  );
}
