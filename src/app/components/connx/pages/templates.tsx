import { useState, useMemo } from "react";
import {
  MessageSquareText, Mail, Voicemail, ListChecks, Search, Plus, Star,
  Lock, Copy, Edit3, Trash2, Tag, Hash, ChevronRight, Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { TEMPLATES, CANDIDATES, ROLES, type Template, type TemplateChannel, type TemplateStage, type CandidateRow, type RoleDetail } from "../pass3-mock";
import { CURRENT_RECRUITER, ORG } from "../mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";

const CHANNEL_CFG = {
  sms:        { label: "SMS",                 icon: MessageSquareText, color: "text-stellar",     bg: "bg-stellar-50" },
  email:      { label: "Email",               icon: Mail,              color: "text-stellar",     bg: "bg-stellar-50" },
  voicemail:  { label: "Voicemail",           icon: Voicemail,         color: "text-quantum",     bg: "bg-mist" },
  screening:  { label: "Screening questions", icon: ListChecks,        color: "text-success-ink", bg: "bg-success-soft" },
} as const;

function candidatePhone(c: CandidateRow) {
  const tail = c.id.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `+1 (628) 555-${tail}`;
}
function candidateEmail(c: CandidateRow) {
  return `${c.name.toLowerCase().replace(/\s+/g, ".")}@${c.currentCompany.toLowerCase().replace(/\s+/g, "")}.com`;
}

export default function TemplatesPage() {
  const [activeChannel, setActiveChannel] = useState<TemplateChannel | "all">("all");
  const [stageFilter, setStageFilter] = useState<TemplateStage | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(TEMPLATES[0].id);
  const [previewCandidateId, setPreviewCandidateId] = useState<string>(CANDIDATES[0]?.id || "");

  const filtered = useMemo(() => {
    let out = TEMPLATES;
    if (activeChannel !== "all") out = out.filter((t) => t.channel === activeChannel);
    if (stageFilter !== "all") out = out.filter((t) => t.stage === stageFilter);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return out;
  }, [activeChannel, stageFilter, query]);

  const selected = TEMPLATES.find((t) => t.id === selectedId) || filtered[0];
  const previewCandidate = CANDIDATES.find((c) => c.id === previewCandidateId) || CANDIDATES[0];
  const previewRole = ROLES.find((r) => r.id === previewCandidate?.roleId) || ROLES[0];

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Templates</h1>
          <p className="text-muted-fg t-body-large">
            {TEMPLATES.length} templates across SMS, email, voicemail, and screening question sets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Tag className="h-3.5 w-3.5" /> Manage tags</Button>
          <Button size="sm" className="gap-2 bg-stellar text-white hover:bg-stellar-700"><Plus className="h-3.5 w-3.5" /> New template</Button>
        </div>
      </div>

      <Tabs value={activeChannel} onValueChange={(v) => setActiveChannel(v as any)}>
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {Object.entries(CHANNEL_CFG).map(([k, c]) => {
            const Icon = c.icon;
            const count = TEMPLATES.filter((t) => t.channel === k).length;
            return (
              <TabsTrigger key={k} value={k} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {c.label}
                <span className="t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeChannel} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 lg:gap-5">
            <div className="space-y-3">
              <Card className="shadow-cx-1">
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
                    <Input placeholder="Search templates…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stages</SelectItem>
                      <SelectItem value="consent">Consent</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejection">Rejection</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {filtered.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center">
                    <div className="t-title-medium text-cosmic mb-1">No templates match</div>
                    <p className="t-body-small text-muted-fg">Try a different filter or create a new one.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filtered.map((t) => (
                    <TemplateListItem key={t.id} template={t} isSelected={t.id === selectedId} onClick={() => setSelectedId(t.id)} />
                  ))}
                </div>
              )}
            </div>

            {selected && previewCandidate && previewRole && (
              <TemplatePreview
                template={selected}
                candidate={previewCandidate}
                role={previewRole}
                allCandidates={CANDIDATES.slice(0, 12)}
                onCandidateChange={setPreviewCandidateId}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateListItem({ template: t, isSelected, onClick }: { template: Template; isSelected: boolean; onClick: () => void }) {
  const cfg = CHANNEL_CFG[t.channel];
  const Icon = cfg.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border bg-white p-3 transition-all focus-ring",
        isSelected ? "border-stellar shadow-cx-2 ring-1 ring-stellar/20" : "border-[#E8EBF0] hover:border-stellar/30 hover:shadow-cx-2"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("h-8 w-8 rounded-md flex items-center justify-center shrink-0", cfg.bg)}>
          <Icon className={cn("h-4 w-4", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="t-label-large text-dark truncate">{t.name}</span>
            {t.isFavorite && <Star className="h-3 w-3 fill-warning text-warning shrink-0" />}
            {t.isLocked && <Lock className="h-3 w-3 text-muted-fg shrink-0" />}
          </div>
          <p className="t-body-small text-muted-fg line-clamp-2 mb-2">{t.description}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <ChipBadge tone="outline" size="sm" className="capitalize">{t.stage}</ChipBadge>
            <ChipBadge tone="neutral" size="sm" className="gap-0.5">
              <Hash className="h-2.5 w-2.5" /> {t.rolesUsed} role{t.rolesUsed === 1 ? "" : "s"}
            </ChipBadge>
            {t.lastUsed && <span className="t-label-small text-muted-fg ml-auto">{t.lastUsed}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}

function resolveMergeFields(text: string, candidate: CandidateRow, role: RoleDetail): string {
  const recruiterFirst = CURRENT_RECRUITER.name.split(" ")[0];
  const candidateFirst = candidate.name.split(" ")[0];
  const map: Record<string, string> = {
    firstName: candidateFirst,
    candidateFullName: candidate.name,
    phone: candidatePhone(candidate),
    email: candidateEmail(candidate),
    recruiterFirstName: recruiterFirst,
    recruiterFullName: CURRENT_RECRUITER.name,
    recruiterTitle: "Senior Talent Partner",
    recruiterCallback: "+1 (628) 555-0184",
    orgName: ORG.name,
    roleTitle: role.title,
    teamName: role.team,
    location: role.location,
    jdSummary: role.jdSummary,
    consentLink: "northwind.connx.app/c/k7Yh2",
    callbackTime: "Tuesday at 2:00 PM",
  };
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => map[key] ?? `{{${key}}}`);
}

function renderWithMergeHighlight(text: string, candidate: CandidateRow, role: RoleDetail) {
  const resolved = resolveMergeFields(text, candidate, role);
  const parts = resolved.split(/(\{\{\w+\}\})/g);
  return parts.map((p, i) =>
    /^\{\{\w+\}\}$/.test(p)
      ? <span key={i} className="bg-warning-soft text-warning-ink px-1 rounded-sm">{p}</span>
      : <span key={i}>{p}</span>
  );
}

function TemplatePreview({
  template: t, candidate, role, allCandidates, onCandidateChange,
}: {
  template: Template;
  candidate: CandidateRow;
  role: RoleDetail;
  allCandidates: CandidateRow[];
  onCandidateChange: (id: string) => void;
}) {
  const cfg = CHANNEL_CFG[t.channel];
  const Icon = cfg.icon;

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className={cn("h-10 w-10 rounded-md flex items-center justify-center shrink-0", cfg.bg)}>
              <Icon className={cn("h-4 w-4", cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h5 className="t-title-medium text-cosmic">{t.name}</h5>
                {t.isLocked && (
                  <ChipBadge tone="neutral" size="sm" className="gap-1">
                    <Lock className="h-2.5 w-2.5" /> Admin-managed
                  </ChipBadge>
                )}
              </div>
              <p className="t-body-small text-muted-fg">{t.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Toggle favourite">
                <Star className={cn("h-3.5 w-3.5", t.isFavorite && "fill-warning text-warning")} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Duplicate"><Copy className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={t.isLocked} aria-label="Edit"><Edit3 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-danger-ink" disabled={t.isLocked} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-[#E8EBF0]">
            <ChipBadge tone="outline" size="sm" className="capitalize">{t.stage}</ChipBadge>
            <ChipBadge tone="neutral" size="sm">Used in {t.rolesUsed} role{t.rolesUsed === 1 ? "" : "s"}</ChipBadge>
            {t.lastUsed && <ChipBadge tone="neutral" size="sm">Last used {t.lastUsed}</ChipBadge>}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-stellar" />
              <CardTitle>Live preview</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="t-label-small text-muted-fg whitespace-nowrap">Render against:</span>
              <Select value={candidate.id} onValueChange={onCandidateChange}>
                <SelectTrigger className="w-[200px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allCandidates.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {t.channel === "email" && t.subject && (
            <div className="mb-3 pb-3 border-b border-[#E8EBF0]">
              <div className="t-label-small text-muted-fg mb-1">Subject</div>
              <div className="t-title-medium text-cosmic">
                {renderWithMergeHighlight(t.subject, candidate, role)}
              </div>
            </div>
          )}

          {t.channel === "sms" ? <SmsPreview body={t.body} candidate={candidate} role={role} />
            : t.channel === "voicemail" ? <VoicemailPreview body={t.body} candidate={candidate} role={role} />
            : t.channel === "screening" ? <ScreeningPreview body={t.body} />
            : <EmailPreview body={t.body} candidate={candidate} role={role} />}

          <div className="mt-4 pt-3 border-t border-[#E8EBF0] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 t-body-small text-muted-fg">
              <span className="bg-warning-soft text-warning-ink px-1.5 py-0.5 rounded-sm t-label-small">{"{{merge}}"}</span>
              <span>Unresolved merge fields highlighted</span>
            </div>
            <Button variant="link" size="sm" className="gap-1">View all merge fields <ChevronRight className="h-3 w-3" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SmsPreview({ body, candidate, role }: { body: string; candidate: CandidateRow; role: RoleDetail }) {
  return (
    <div className="bg-mist rounded-xl p-4 max-w-[380px]">
      <div className="t-label-small text-muted-fg mb-2 flex items-center justify-between">
        <span>To {candidatePhone(candidate)}</span>
        <span>SMS · ~{Math.ceil(body.length / 160)} segment{body.length > 160 ? "s" : ""}</span>
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 t-body-medium text-dark whitespace-pre-wrap break-words shadow-cx-1">
        {renderWithMergeHighlight(body, candidate, role)}
      </div>
      <div className="t-label-small text-muted-fg mt-2 text-right">{body.length} chars</div>
    </div>
  );
}

function EmailPreview({ body, candidate, role }: { body: string; candidate: CandidateRow; role: RoleDetail }) {
  return (
    <div className="bg-white border border-[#E8EBF0] rounded-lg overflow-hidden">
      <div className="bg-mist px-4 py-2 border-b border-[#E8EBF0] flex items-center gap-2">
        <span className="t-label-small text-muted-fg">From:</span>
        <span className="t-body-small">{CURRENT_RECRUITER.name} &lt;{CURRENT_RECRUITER.email}&gt;</span>
      </div>
      <div className="bg-mist px-4 py-2 border-b border-[#E8EBF0] flex items-center gap-2">
        <span className="t-label-small text-muted-fg">To:</span>
        <span className="t-body-small">{candidateEmail(candidate)}</span>
      </div>
      <div className="p-5 t-body-medium text-dark whitespace-pre-wrap break-words leading-relaxed">
        {renderWithMergeHighlight(body, candidate, role)}
      </div>
    </div>
  );
}

function VoicemailPreview({ body, candidate, role }: { body: string; candidate: CandidateRow; role: RoleDetail }) {
  return (
    <div className="bg-mist rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-pill bg-quantum/10 flex items-center justify-center">
          <Voicemail className="h-4 w-4 text-quantum" />
        </div>
        <div className="flex-1">
          <div className="t-label-large text-dark">Voicemail script</div>
          <div className="t-body-small text-muted-fg">~{Math.ceil(body.length / 800 * 30)} seconds estimated</div>
        </div>
      </div>
      <div className="bg-white rounded-md p-3 t-body-medium text-dark whitespace-pre-wrap break-words italic border-l-2 border-quantum">
        "{renderWithMergeHighlight(body, candidate, role)}"
      </div>
    </div>
  );
}

function ScreeningPreview({ body }: { body: string }) {
  const lines = body.split("\n").filter((l) => l.trim());
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const m = line.match(/^(\d+)\.\s*(.*)$/);
        if (m) {
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-mist rounded-md">
              <div className="h-6 w-6 rounded-pill bg-stellar text-white flex items-center justify-center t-label-small shrink-0 tabular-nums">
                {m[1]}
              </div>
              <p className="flex-1 t-body-medium text-dark pt-0.5">{m[2]}</p>
            </div>
          );
        }
        return <p key={i} className="t-body-small text-muted-fg">{line}</p>;
      })}
    </div>
  );
}
