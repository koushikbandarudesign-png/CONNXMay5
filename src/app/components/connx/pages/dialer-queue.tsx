import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  PhoneCall, ArrowRight, GripVertical, Sparkles, Clock,
  CheckCircle2, Search, Star, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { CANDIDATES, ROLES } from "../pass3-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

type Priority = "consent-time" | "best-time" | "manual";

export default function DialerQueuePage() {
  const navigate = useNavigate();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(ROLES[0].id);
  const [priority, setPriority] = useState<Priority>("best-time");
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId)!;

  const eligible = useMemo(
    () => CANDIDATES.filter((c) => c.roleId === selectedRoleId && c.consentStatus === "accepted" && c.stage === "consented"),
    [selectedRoleId]
  );

  const filtered = useMemo(() => {
    if (!query) return eligible;
    const q = query.toLowerCase();
    return eligible.filter((c) => c.name.toLowerCase().includes(q) || c.currentCompany.toLowerCase().includes(q));
  }, [eligible, query]);

  const ordered = useMemo(() => {
    const arr = [...filtered];
    if (priority === "consent-time") {
      arr.sort((a, b) => +new Date(a.consentRespondedAt || a.shortlistedAt) - +new Date(b.consentRespondedAt || b.shortlistedAt));
    }
    return arr;
  }, [filtered, priority]);

  const finalQueue = ordered.filter((c) => !excluded.has(c.id));

  const handleStart = () => navigate(`/dialer/customise?role=${selectedRoleId}&count=${finalQueue.length}`);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Build your dialer queue</h1>
          <p className="text-muted-fg t-body-large">
            Pick a role, refine the candidate list, and start screening. The Auto Dialer connects you on answer.
          </p>
        </div>
      </div>

      <Stepper current={1} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5 mt-5">
        <div className="space-y-4">
          <Card className="shadow-cx-1">
            <CardHeader className="pb-3"><CardTitle>1. Pick the role</CardTitle></CardHeader>
            <CardContent>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => {
                    const eligibleCount = CANDIDATES.filter(
                      (c) => c.roleId === r.id && c.consentStatus === "accepted" && c.stage === "consented"
                    ).length;
                    return (
                      <SelectItem key={r.id} value={r.id} disabled={eligibleCount === 0}>
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{r.title}</span>
                          <ChipBadge tone={eligibleCount > 0 ? "info" : "neutral"} size="sm" className="ml-2">{eligibleCount} ready</ChipBadge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3 mt-3 t-body-small text-muted-fg flex-wrap">
                <span>{selectedRole.team}</span>
                <span>·</span>
                <span>{selectedRole.location}</span>
                <span>·</span>
                <span>HM: {selectedRole.hiringManager}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardHeader className="pb-3">
              <CardTitle>2. Choose call order</CardTitle>
              <p className="t-body-small text-muted-fg mt-0.5">
                CONNX dials this order. You can reorder, skip, or pause anytime during the session.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <PriorityCard active={priority === "best-time"} onClick={() => setPriority("best-time")} icon={Zap} recommended label="Best time to reach" desc="Order by candidate's likeliest pickup window. Highest connect rate." />
                <PriorityCard active={priority === "consent-time"} onClick={() => setPriority("consent-time")} icon={Clock} label="Consent-first" desc="Earliest consenter gets called first. Honors candidate eagerness." />
                <PriorityCard active={priority === "manual"} onClick={() => setPriority("manual")} icon={GripVertical} label="Manual order" desc="Drag to set your own sequence below." />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>3. Refine the list</CardTitle>
                <p className="t-body-small text-muted-fg mt-0.5">{finalQueue.length} of {eligible.length} candidates included</p>
              </div>
              <div className="relative w-[200px] shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
                <Input placeholder="Filter…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-8 text-[13px]" />
              </div>
            </CardHeader>
            <CardContent>
              {ordered.length === 0 ? (
                <EmptyEligible roleTitle={selectedRole.title} />
              ) : (
                <div className="space-y-1.5">
                  {ordered.map((c, i) => {
                    const isExcluded = excluded.has(c.id);
                    return (
                      <div
                        key={c.id}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-md border transition-colors",
                          isExcluded ? "border-[#E8EBF0] bg-mist/30 opacity-60" : "border-[#E8EBF0] bg-white hover:border-stellar/30",
                          priority === "manual" && !isExcluded && "cursor-grab"
                        )}
                      >
                        {priority === "manual" && <GripVertical className="h-4 w-4 text-muted-fg shrink-0" />}
                        <span className="t-label-small text-muted-fg w-5 text-right tabular-nums shrink-0">
                          {isExcluded ? "—" : finalQueue.findIndex((cc) => cc.id === c.id) + 1}
                        </span>
                        <Checkbox
                          checked={!isExcluded}
                          onCheckedChange={(v) => {
                            const next = new Set(excluded);
                            if (v) next.delete(c.id); else next.add(c.id);
                            setExcluded(next);
                          }}
                          aria-label={`Include ${c.name}`}
                        />
                        <NameAvatar name={c.name} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="t-label-large text-dark truncate">{c.name}</div>
                          <div className="t-body-small text-muted-fg truncate">{c.currentRole} · {c.currentCompany}</div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 shrink-0">
                          <span className="t-body-small text-muted-fg">{c.location.split(",")[0]}</span>
                          {priority === "best-time" && i < 3 && (
                            <ChipBadge tone="success" size="sm" className="gap-0.5">
                              <Star className="h-2.5 w-2.5" /> Prime
                            </ChipBadge>
                          )}
                        </div>
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
            <CardHeader className="pb-3"><CardTitle>Session summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow label="Role" value={selectedRole.title} />
              <SummaryRow label="Candidates" value={`${finalQueue.length} in queue`} />
              <SummaryRow label="Order" value={priority === "best-time" ? "Best time to reach" : priority === "consent-time" ? "Consent-first" : "Manual"} />
              <SummaryRow label="Estimated duration" value={`~${Math.ceil(finalQueue.length * 8)} min`} hint="8 min avg per call · includes wrap time" />

              <div className="pt-3 border-t border-[#E8EBF0]">
                <div className="flex items-start gap-2 mb-3 p-3 rounded-md leo-gradient text-white">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="t-label-large mb-0.5">LEO recommends</div>
                    <p className="t-body-small text-white/85">
                      Tuesday 10:00–12:00 is your prime window. Starting now should connect to {Math.round(finalQueue.length * 0.62)} of {finalQueue.length}.
                    </p>
                  </div>
                </div>

                <Button size="lg" className="w-full gap-2 bg-stellar text-white hover:bg-stellar-700" disabled={finalQueue.length === 0} onClick={handleStart}>
                  <PhoneCall className="h-4 w-4" />
                  Continue · Customise call view
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="t-body-small text-muted-fg text-center mt-2">
                  You'll review your panel layout before the first call.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-4 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
              <div>
                <div className="t-label-large text-dark">DNC-checked &amp; compliant</div>
                <p className="t-body-small text-muted-fg">
                  Every dial pre-checks against the Do-Not-Call list. Calls are recorded per organisational policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function Stepper({ current }: { current: number }) {
  const steps = [{ n: 1, label: "Build queue" }, { n: 2, label: "Customise view" }, { n: 3, label: "Make calls" }];
  return (
    <div className="flex items-center gap-2 t-body-small">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className={cn(
            "h-6 w-6 rounded-pill flex items-center justify-center t-label-small tabular-nums shrink-0",
            s.n === current ? "bg-stellar text-white"
            : s.n < current ? "bg-success text-white"
            : "bg-mist text-muted-fg"
          )}>
            {s.n < current ? <CheckCircle2 className="h-3 w-3" /> : s.n}
          </div>
          <span className={cn(
            "t-label-medium",
            s.n === current ? "text-cosmic"
            : s.n < current ? "text-muted-fg"
            : "text-muted-fg"
          )}>{s.label}</span>
          {i < steps.length - 1 && <span className="h-px w-8 bg-[#E8EBF0] mx-2" />}
        </div>
      ))}
    </div>
  );
}

function PriorityCard({
  active, onClick, icon: Icon, label, desc, recommended,
}: {
  active: boolean; onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string; desc: string; recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left p-3 rounded-lg border transition-all focus-ring",
        active ? "border-stellar bg-stellar-50 ring-2 ring-stellar/20 shadow-cx-1" : "border-[#E8EBF0] bg-white hover:border-stellar/30 hover:bg-mist"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className={cn("h-4 w-4", active ? "text-stellar" : "text-muted-fg")} />
        {recommended && <ChipBadge tone="success" size="sm">Recommended</ChipBadge>}
      </div>
      <div className="t-label-large text-dark mb-0.5">{label}</div>
      <p className="t-body-small text-muted-fg leading-snug">{desc}</p>
    </button>
  );
}

function SummaryRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="t-label-small text-muted-fg">{label}</div>
      <div className="t-label-large text-dark">{value}</div>
      {hint && <div className="t-body-small text-muted-fg">{hint}</div>}
    </div>
  );
}

function EmptyEligible({ roleTitle }: { roleTitle: string }) {
  return (
    <div className="text-center py-10 px-4">
      <div className="h-12 w-12 rounded-pill bg-mist mx-auto mb-3 flex items-center justify-center">
        <PhoneCall className="h-5 w-5 text-muted-fg" />
      </div>
      <div className="t-title-medium text-cosmic mb-1">No consented candidates yet</div>
      <p className="t-body-medium text-muted-fg max-w-md mx-auto">
        Send consent requests to {roleTitle} candidates first, then come back here once they accept.
      </p>
    </div>
  );
}
