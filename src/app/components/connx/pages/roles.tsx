import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Briefcase, MapPin, Calendar, ChevronRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { ROLES } from "../pass3-mock";
import { ROLE_PIPELINES } from "../dashboard-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

const HEALTH = {
  "on-track": { label: "On track", icon: CheckCircle2, tone: "success" as const },
  "at-risk": { label: "At risk", icon: Clock, tone: "warning" as const },
  "stalled": { label: "Stalled", icon: AlertTriangle, tone: "danger" as const },
};

type SortKey = "newest" | "stage" | "stalled" | "open";

export default function RolesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const enriched = useMemo(() => ROLES.map((r) => {
    const p = ROLE_PIPELINES.find((pp) => pp.roleId === r.id)!;
    return { ...r, ...p };
  }), []);

  const filtered = useMemo(() => {
    let out = enriched;
    if (team !== "all") out = out.filter((r) => r.team === team);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((r) => r.title.toLowerCase().includes(q) || r.team.toLowerCase().includes(q));
    }
    if (sort === "newest") out = [...out].sort((a, b) => +new Date(b.openedAt) - +new Date(a.openedAt));
    if (sort === "open") out = [...out].sort((a, b) => b.daysOpen - a.daysOpen);
    if (sort === "stage") out = [...out].sort((a, b) => b.advanced - a.advanced);
    if (sort === "stalled") {
      const order = { stalled: 0, "at-risk": 1, "on-track": 2 } as const;
      out = [...out].sort((a, b) => order[a.health] - order[b.health]);
    }
    return out;
  }, [enriched, team, query, sort]);

  const totals = {
    open: ROLES.length,
    candidates: enriched.reduce((a, r) => a + r.shortlisted, 0),
    advanced: enriched.reduce((a, r) => a + r.advanced, 0),
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Roles &amp; candidates</h1>
          <p className="text-muted-fg t-body-large">
            {totals.open} open roles · {totals.candidates} candidates in flight · {totals.advanced} advanced
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-stellar text-white hover:bg-stellar-700">
          <Plus className="h-3.5 w-3.5" /> New role
        </Button>
      </div>

      <Card className="mb-5 shadow-cx-1">
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
            <Input placeholder="Search by title or team…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Team" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                <SelectItem value="Platform">Platform</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="open">Longest open</SelectItem>
                <SelectItem value="stage">Most advanced</SelectItem>
                <SelectItem value="stalled">Health: worst first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="t-title-medium text-cosmic mb-1">No roles match your filters</div>
            <p className="t-body-medium text-muted-fg mb-4">Try clearing filters or changing the search query.</p>
            <Button variant="outline" size="sm" onClick={() => { setQuery(""); setTeam("all"); }}>Clear filters</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const health = HEALTH[r.health];
            const HealthIcon = health.icon;
            const consentRate = r.shortlisted ? Math.round((r.consented / r.shortlisted) * 100) : 0;
            const screenRate = r.consented ? Math.round((r.screened / r.consented) * 100) : 0;
            return (
              <Card key={r.id} className="cursor-pointer shadow-cx-1 hover:shadow-cx-2 transition-shadow" onClick={() => navigate(`/roles/${r.id}`)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h5 className="t-title-medium text-cosmic truncate">{r.title}</h5>
                        <ChipBadge tone={health.tone} size="sm" className="gap-0.5">
                          <HealthIcon className="h-2.5 w-2.5" /> {health.label}
                        </ChipBadge>
                      </div>
                      <div className="flex items-center gap-3 t-body-small text-muted-fg flex-wrap">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{r.team}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{r.daysOpen}d open</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-fg shrink-0 mt-1" />
                  </div>

                  <p className="t-body-small text-muted-fg mb-4 line-clamp-2">{r.jdSummary}</p>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <Step label="Shortlisted" value={r.shortlisted} />
                    <Step label="Consented" value={r.consented} caption={`${consentRate}%`} />
                    <Step label="Screened" value={r.screened} caption={`${screenRate}%`} />
                    <Step label="Advanced" value={r.advanced} highlight />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8EBF0]">
                    <div className="flex items-center gap-2">
                      <span className="t-label-small text-muted-fg">HM:</span>
                      <NameAvatar name={r.hiringManager} size={22} />
                      <span className="t-body-small text-dark">{r.hiringManager}</span>
                    </div>
                    <ChipBadge tone="outline" size="sm">{r.advanced}/{r.targetCount} target</ChipBadge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step({ label, value, caption, highlight }: { label: string; value: number; caption?: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-md p-2", highlight ? "bg-success-soft" : "bg-mist")}>
      <div className={cn("t-headline-small tabular-nums leading-none", highlight ? "text-success-ink" : "text-cosmic")}>{value}</div>
      <div className="flex items-center justify-between mt-1 gap-1">
        <span className="t-body-small text-muted-fg truncate">{label}</span>
        {caption && <span className="t-label-small text-muted-fg shrink-0">{caption}</span>}
      </div>
    </div>
  );
}
