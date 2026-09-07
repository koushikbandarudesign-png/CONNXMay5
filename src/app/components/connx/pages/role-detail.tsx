import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Search, Phone, MessageSquareText, MoreHorizontal,
  ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, Calendar, Briefcase,
  MapPin, Send, Download, PhoneCall, UserPlus, Mail, X,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { ROLES, CANDIDATES, STAGE_LABELS, CONSENT_LABELS, type ConsentStatus, type RoleStage, type CandidateRow } from "../pass3-mock";
import { ROLE_PIPELINES } from "../dashboard-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

const CONSENT_VARIANT: Record<ConsentStatus, { tone: "success" | "warning" | "danger" | "neutral" | "info"; icon: any }> = {
  accepted: { tone: "success", icon: ShieldCheck },
  pending: { tone: "warning", icon: ShieldQuestion },
  declined: { tone: "danger", icon: ShieldX },
  expired: { tone: "neutral", icon: ShieldAlert },
  scheduled: { tone: "info", icon: Calendar },
};

export default function RoleDetailPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const role = ROLES.find((r) => r.id === roleId);
  const pipeline = ROLE_PIPELINES.find((p) => p.roleId === roleId);

  const roleCandidates = useMemo(() => CANDIDATES.filter((c) => c.roleId === roleId), [roleId]);
  const [activeTab, setActiveTab] = useState<"all" | RoleStage>("all");
  const [query, setQuery] = useState("");
  const [consentFilter, setConsentFilter] = useState<ConsentStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let out = roleCandidates;
    if (activeTab !== "all") out = out.filter((c) => c.stage === activeTab);
    if (consentFilter !== "all") out = out.filter((c) => c.consentStatus === consentFilter);
    if (sourceFilter !== "all") out = out.filter((c) => c.source === sourceFilter);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((c) => c.name.toLowerCase().includes(q) || c.currentCompany.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q)));
    }
    return out;
  }, [roleCandidates, activeTab, consentFilter, sourceFilter, query]);

  const stageCounts = useMemo(() => {
    const c: Record<string, number> = { all: roleCandidates.length };
    (["shortlisted", "consented", "screened", "advanced", "rejected"] as RoleStage[]).forEach((s) => {
      c[s] = roleCandidates.filter((cand) => cand.stage === s).length;
    });
    return c;
  }, [roleCandidates]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((c) => c.id)));
  const toggleOne = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  if (!role || !pipeline) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/roles")} className="gap-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to roles
        </Button>
        <p className="mt-6">Role not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
      <Button variant="ghost" size="sm" className="mb-3 -ml-2 gap-2" onClick={() => navigate("/roles")}>
        <ArrowLeft className="h-3.5 w-3.5" /> All roles
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="mb-2">{role.title}</h1>
          <div className="flex items-center gap-4 t-body-medium text-muted-fg flex-wrap">
            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{role.team}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{role.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{pipeline.daysOpen} days open</span>
            <span className="flex items-center gap-1.5">
              <span className="t-label-small text-muted-fg">HM:</span>
              <NameAvatar name={role.hiringManager} size={20} />
              <span>{role.hiringManager}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate("/bulk")} className="gap-2">
            <Send className="h-3.5 w-3.5" /> Bulk message
          </Button>
          <Button size="sm" onClick={() => navigate("/dialer")} className="gap-2 bg-stellar text-white hover:bg-stellar-700">
            <PhoneCall className="h-3.5 w-3.5" /> Start dialer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <StatCard label="Shortlisted" value={pipeline.shortlisted} />
        <StatCard label="Consented" value={pipeline.consented} percent={pipeline.shortlisted ? Math.round((pipeline.consented / pipeline.shortlisted) * 100) : 0} />
        <StatCard label="Screened" value={pipeline.screened} percent={pipeline.consented ? Math.round((pipeline.screened / pipeline.consented) * 100) : 0} />
        <StatCard label="Advanced" value={pipeline.advanced} highlight />
        <StatCard label="Rejected" value={role.rejected} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="all">All <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{stageCounts.all}</span></TabsTrigger>
          {(["shortlisted", "consented", "screened", "advanced", "rejected"] as RoleStage[]).map((s) => (
            <TabsTrigger key={s} value={s}>{STAGE_LABELS[s]} <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{stageCounts[s]}</span></TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0 space-y-3">
          <Card className="shadow-cx-1">
            <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
                <Input placeholder="Search by name, company, or skill…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Select value={consentFilter} onValueChange={(v) => setConsentFilter(v as any)}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All consent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    <SelectItem value="Workday">Workday</SelectItem>
                    <SelectItem value="Greenhouse">Greenhouse</SelectItem>
                    <SelectItem value="Lever">Lever</SelectItem>
                    <SelectItem value="iCIMS">iCIMS</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
              </div>
            </CardContent>
          </Card>

          {selected.size > 0 && (
            <div className="bg-cosmic text-white rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <span className="t-label-large">{selected.size} candidate{selected.size === 1 ? "" : "s"} selected</span>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 bg-white/15 hover:bg-white/25 text-white"><PhoneCall className="h-3.5 w-3.5" /> Add to queue</Button>
                <Button size="sm" className="gap-1.5 bg-white/15 hover:bg-white/25 text-white"><MessageSquareText className="h-3.5 w-3.5" /> SMS</Button>
                <Button size="sm" className="gap-1.5 bg-white/15 hover:bg-white/25 text-white"><Mail className="h-3.5 w-3.5" /> Email</Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/15 h-7 w-7" onClick={() => setSelected(new Set())} aria-label="Clear selection"><X className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="t-title-medium text-cosmic mb-1">No candidates match</div>
                <p className="t-body-medium text-muted-fg mb-4">Adjust filters or add candidates from your ATS.</p>
                <Button variant="outline" size="sm" className="gap-2"><UserPlus className="h-3.5 w-3.5" /> Add candidate</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-cx-1">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8EBF0] bg-mist/50">
                        <th className="w-10 px-4 py-3"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg">Candidate</th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg hidden lg:table-cell">Current</th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg">Consent</th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg hidden md:table-cell">Stage</th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg hidden xl:table-cell">Source</th>
                        <th className="px-2 py-3 text-left t-label-small text-muted-fg hidden lg:table-cell">Last</th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <CandidateRow
                          key={c.id}
                          candidate={c}
                          isSelected={selected.has(c.id)}
                          onToggle={() => toggleOne(c.id)}
                          onClick={() => navigate(`/candidates/${c.id}`)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, percent, highlight }: { label: string; value: number; percent?: number; highlight?: boolean }) {
  return (
    <Card className={cn("shadow-cx-1", highlight && "bg-success-soft border-success")}>
      <CardContent className="p-4">
        <div className={cn("t-headline-medium tabular-nums leading-none", highlight ? "text-success-ink" : "text-cosmic")}>{value}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="t-body-small text-muted-fg">{label}</span>
          {percent !== undefined && <span className="t-label-small text-muted-fg tabular-nums">{percent}%</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function CandidateRow({ candidate: c, isSelected, onToggle, onClick }: { candidate: CandidateRow; isSelected: boolean; onToggle: () => void; onClick: () => void }) {
  const cfg = CONSENT_VARIANT[c.consentStatus];
  const ConsentIcon = cfg.icon;
  return (
    <tr className={cn("border-b border-[#E8EBF0] last:border-0 hover:bg-mist/50 transition-colors group", isSelected && "bg-stellar-50/40")}>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onToggle} aria-label={`Select ${c.name}`} />
      </td>
      <td className="px-2 py-3 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2.5">
          <NameAvatar name={c.name} size={32} />
          <div className="min-w-0">
            <div className="t-label-large text-dark truncate">{c.name}</div>
            <div className="t-body-small text-muted-fg truncate">{c.location}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3 hidden lg:table-cell cursor-pointer" onClick={onClick}>
        <div className="t-body-medium text-dark truncate max-w-[200px]">{c.currentRole}</div>
        <div className="t-body-small text-muted-fg truncate max-w-[200px]">{c.currentCompany}</div>
      </td>
      <td className="px-2 py-3 cursor-pointer" onClick={onClick}>
        <ChipBadge tone={cfg.tone} size="sm" className="gap-1">
          <ConsentIcon className="h-2.5 w-2.5" />{CONSENT_LABELS[c.consentStatus]}
        </ChipBadge>
      </td>
      <td className="px-2 py-3 hidden md:table-cell cursor-pointer" onClick={onClick}>
        <span className="t-body-medium text-dark">{STAGE_LABELS[c.stage]}</span>
      </td>
      <td className="px-2 py-3 hidden xl:table-cell cursor-pointer" onClick={onClick}>
        <span className="t-body-small text-muted-fg">{c.source}</span>
      </td>
      <td className="px-2 py-3 hidden lg:table-cell cursor-pointer" onClick={onClick}>
        <span className="t-body-small text-muted-fg">{c.lastActivity}</span>
      </td>
      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 justify-end">
          {c.consentStatus === "accepted" && (
            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"><Phone className="h-3.5 w-3.5 text-stellar" /></Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="More"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onClick}>View profile</DropdownMenuItem>
              <DropdownMenuItem>Add to queue</DropdownMenuItem>
              <DropdownMenuItem>Send SMS</DropdownMenuItem>
              <DropdownMenuItem>Send email</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Schedule callback</DropdownMenuItem>
              {c.consentStatus === "expired" && <DropdownMenuItem>Resend consent</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger-ink">Reject</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
