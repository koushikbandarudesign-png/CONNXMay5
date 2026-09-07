import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ShieldCheck, ShieldX, ShieldAlert, ShieldQuestion, Calendar, Search,
  Send, RefreshCcw, Globe, Clock, Download, ChevronRight,
  History, MessageSquareText, Mail, Settings,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { CANDIDATES, ROLES, AUDIT_LOG, CONSENT_LABELS, type ConsentStatus, type AuditEntry } from "../pass3-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

const STATUS_CFG: Record<ConsentStatus, { icon: any; tone: "success" | "warning" | "danger" | "neutral" | "info"; bg: string; iconColor: string }> = {
  accepted: { icon: ShieldCheck, tone: "success", bg: "bg-success-soft", iconColor: "text-success-ink" },
  pending: { icon: ShieldQuestion, tone: "warning", bg: "bg-warning-soft", iconColor: "text-warning-ink" },
  declined: { icon: ShieldX, tone: "danger", bg: "bg-danger-soft", iconColor: "text-danger-ink" },
  expired: { icon: ShieldAlert, tone: "neutral", bg: "bg-mist", iconColor: "text-muted-fg" },
  scheduled: { icon: Calendar, tone: "info", bg: "bg-stellar-50", iconColor: "text-stellar-700" },
};

export default function ConsentCenterPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"queue" | "audit">("queue");
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const counts = {
      pending: CANDIDATES.filter((c) => c.consentStatus === "pending").length,
      accepted: CANDIDATES.filter((c) => c.consentStatus === "accepted").length,
      declined: CANDIDATES.filter((c) => c.consentStatus === "declined").length,
      expired: CANDIDATES.filter((c) => c.consentStatus === "expired").length,
    };
    const denom = counts.accepted + counts.declined + counts.expired || 1;
    return { ...counts, acceptanceRate: Math.round((counts.accepted / denom) * 100) };
  }, []);

  const filtered = useMemo(() => {
    let out = CANDIDATES;
    if (statusFilter !== "all") out = out.filter((c) => c.consentStatus === statusFilter);
    if (roleFilter !== "all") out = out.filter((c) => c.roleId === roleFilter);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((c) => c.name.toLowerCase().includes(q));
    }
    return out.slice(0, 40);
  }, [statusFilter, roleFilter, query]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Consent center</h1>
          <p className="text-muted-fg t-body-large">
            Track consent status, resend reminders, audit every interaction. GDPR / DPDP / PDPA / TCPA compliant.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2"><Settings className="h-3.5 w-3.5" /> Reminder rules</Button>
          <Button variant="outline" size="sm" className="gap-2"><Globe className="h-3.5 w-3.5" /> Languages</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <ConsentStat label="Pending" value={stats.pending} cfg={STATUS_CFG.pending} hint="Awaiting reply" />
        <ConsentStat label="Accepted" value={stats.accepted} cfg={STATUS_CFG.accepted} hint="Ready to call" />
        <ConsentStat label="Declined" value={stats.declined} cfg={STATUS_CFG.declined} hint="Auto-suppressed" />
        <ConsentStat label="Expired" value={stats.expired} cfg={STATUS_CFG.expired} hint="Eligible for re-consent" />
        <Card className="shadow-cx-1">
          <CardContent className="p-4">
            <div className="t-headline-medium text-cosmic tabular-nums leading-none">{stats.acceptanceRate}%</div>
            <div className="flex items-center justify-between mt-2">
              <span className="t-body-small text-muted-fg">Acceptance rate</span>
              <ChipBadge tone="info" size="sm">+4 vs avg</ChipBadge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="queue">Consent queue</TabsTrigger>
          <TabsTrigger value="audit">Audit trail <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{AUDIT_LOG.length}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-0 space-y-3">
          <Card className="shadow-cx-1">
            <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
                <Input placeholder="Search by candidate name…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {ROLES.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
              </div>
            </CardContent>
          </Card>

          {statusFilter === "pending" && filtered.length > 0 && (
            <div className="bg-warning-soft border border-warning/20 rounded-lg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning-ink" />
                <span className="t-label-large text-warning-ink">{filtered.length} pending consents · oldest 2 days ago</span>
              </div>
              <Button size="sm" variant="outline" className="bg-white gap-2"><Send className="h-3.5 w-3.5" /> Send 48h reminder to all</Button>
            </div>
          )}

          {statusFilter === "expired" && filtered.length > 0 && (
            <div className="bg-mist border border-[#E8EBF0] rounded-lg px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-fg" />
                <span className="t-label-large text-cosmic">{filtered.length} expired consents · eligible for re-consent</span>
              </div>
              <Button size="sm" className="gap-2 bg-stellar text-white hover:bg-stellar-700"><RefreshCcw className="h-3.5 w-3.5" /> Bulk re-consent</Button>
            </div>
          )}

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="t-title-medium text-cosmic mb-1">No matching consents</div>
                <p className="t-body-medium text-muted-fg">Try clearing filters.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-cx-1">
              <CardContent className="p-0">
                {filtered.map((c, i) => {
                  const cfg = STATUS_CFG[c.consentStatus];
                  const Icon = cfg.icon;
                  const role = ROLES.find((r) => r.id === c.roleId);
                  return (
                    <div key={c.id} className={cn("flex items-center gap-3 px-4 py-3 hover:bg-mist/50 transition-colors group", i !== filtered.length - 1 && "border-b border-[#E8EBF0]")}>
                      <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", cfg.bg)}>
                        <Icon className={cn("h-4 w-4", cfg.iconColor)} />
                      </div>
                      <NameAvatar name={c.name} size={36} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="t-label-large text-dark truncate cursor-pointer hover:text-stellar" onClick={() => navigate(`/candidates/${c.id}`)}>{c.name}</span>
                          <ChipBadge tone={cfg.tone} size="sm">{CONSENT_LABELS[c.consentStatus]}</ChipBadge>
                        </div>
                        <div className="t-body-small text-muted-fg truncate">{role?.title} · {c.lastActivity}</div>
                      </div>
                      <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {c.consentStatus === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" className="gap-1.5"><MessageSquareText className="h-3.5 w-3.5" /> Resend SMS</Button>
                            <Button size="sm" variant="ghost" className="gap-1.5"><Mail className="h-3.5 w-3.5" /> Resend email</Button>
                          </>
                        )}
                        {c.consentStatus === "expired" && (
                          <Button size="sm" variant="outline" className="gap-1.5"><RefreshCcw className="h-3.5 w-3.5" /> Re-consent</Button>
                        )}
                        {c.consentStatus === "accepted" && (
                          <Button size="sm" variant="ghost" onClick={() => navigate("/dialer")}>Add to queue</Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => navigate(`/candidates/${c.id}`)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audit" className="mt-0">
          <Card className="mb-3 shadow-cx-1">
            <CardContent className="p-3 flex items-center gap-3">
              <History className="h-4 w-4 text-stellar shrink-0" />
              <div className="flex-1">
                <div className="t-label-large text-cosmic">Tamper-evident audit log</div>
                <div className="t-body-small text-muted-fg">Every consent action is timestamped and stored for 3 years.</div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export log</Button>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-0">
              {AUDIT_LOG.map((entry, i) => <AuditRow key={entry.id} entry={entry} isLast={i === AUDIT_LOG.length - 1} />)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConsentStat({ label, value, cfg, hint }: { label: string; value: number; cfg: { icon: any; bg: string; iconColor: string }; hint?: string }) {
  const Icon = cfg.icon;
  return (
    <Card className="shadow-cx-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", cfg.bg)}>
            <Icon className={cn("h-3.5 w-3.5", cfg.iconColor)} />
          </div>
        </div>
        <div className="t-headline-medium text-cosmic tabular-nums leading-none">{value}</div>
        <div className="t-body-small text-muted-fg mt-1">{label}</div>
        {hint && <div className="t-label-small text-muted-fg mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}

const ACTION_LABELS = {
  "consent-sent": { text: "Consent sent", color: "text-stellar", icon: Send },
  "consent-resent": { text: "Consent resent", color: "text-stellar", icon: RefreshCcw },
  "consent-accepted": { text: "Consent accepted", color: "text-success-ink", icon: ShieldCheck },
  "consent-declined": { text: "Consent declined", color: "text-danger-ink", icon: ShieldX },
  "consent-expired": { text: "Consent expired", color: "text-muted-fg", icon: ShieldAlert },
  "callback-requested": { text: "Callback requested", color: "text-quantum", icon: Calendar },
  "opt-out": { text: "Opt-out — DNC", color: "text-danger-ink", icon: ShieldX },
  "language-changed": { text: "Language changed", color: "text-stellar", icon: Globe },
  "reminder-sent": { text: "Reminder sent", color: "text-warning-ink", icon: Clock },
} as const;

function AuditRow({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const cfg = ACTION_LABELS[entry.action];
  const Icon = cfg.icon;
  return (
    <div className={cn("flex items-start gap-3 px-4 py-3", !isLast && "border-b border-[#E8EBF0]")}>
      <div className="h-7 w-7 rounded-md bg-mist flex items-center justify-center shrink-0 mt-0.5">
        <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("t-label-large", cfg.color)}>{cfg.text}</span>
          <span className="t-body-small text-muted-fg">·</span>
          <span className="t-label-large text-dark">{entry.candidateName}</span>
          <span className="t-body-small text-muted-fg">·</span>
          <span className="t-body-small text-muted-fg truncate">{entry.roleTitle}</span>
        </div>
        {entry.detail && <p className="t-body-small text-muted-fg mt-0.5 break-words">{entry.detail}</p>}
      </div>
      <div className="text-right shrink-0">
        <div className="t-label-medium text-cosmic">{entry.at}</div>
        <ChipBadge tone="outline" size="sm" className="mt-0.5">{entry.channel.toUpperCase()}</ChipBadge>
      </div>
    </div>
  );
}
