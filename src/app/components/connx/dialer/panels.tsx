import { useState, useEffect } from "react";
import {
  Briefcase, FileText, ListChecks, PenLine, ClipboardList,
  Mail, Phone, MapPin, Building2, ShieldCheck, Copy,
  Save, CheckCircle2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";
import { timeAgo } from "./dialer-lib";
import type { Panel } from "./dialer-lib";
import type { CandidateRow, RoleDetail } from "../pass3-mock";

interface PanelProps {
  candidate: CandidateRow;
  role: RoleDetail;
  zoneSize: "A" | "B" | "C";
}

export function PanelShell({
  icon: Icon, title, zone, badge, children, contentClassName, headerExtra,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  zone: "A" | "B" | "C";
  badge?: string;
  children: React.ReactNode;
  contentClassName?: string;
  headerExtra?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-[#E8EBF0] h-full flex flex-col overflow-hidden shadow-cx-1">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E8EBF0] bg-mist/50 shrink-0">
        <Icon className="h-3.5 w-3.5 text-stellar shrink-0" />
        <span className="t-label-large text-cosmic flex-1 truncate">{title}</span>
        {badge && <ChipBadge tone="info" size="sm">{badge}</ChipBadge>}
        <ChipBadge tone="cosmic" size="sm">Zone {zone}</ChipBadge>
        {headerExtra}
      </div>
      <div className={cn("flex-1 min-h-0 overflow-auto", contentClassName)}>{children}</div>
    </div>
  );
}

export function MetadataPanel({ candidate: c, role, zoneSize }: PanelProps) {
  return (
    <PanelShell icon={Briefcase} title="Candidate metadata" zone={zoneSize}>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <NameAvatar name={c.name} size={zoneSize === "A" ? 56 : 44} />
          <div className="flex-1 min-w-0">
            <div className="t-title-medium text-cosmic truncate">{c.name}</div>
            <div className="t-body-small text-muted-fg">{c.currentRole}</div>
            <div className="t-body-small text-muted-fg">{c.currentCompany}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <MetaRow icon={Phone} label="Phone" value={c.phone} copyable />
          <MetaRow icon={Mail}  label="Email" value={c.email} copyable />
          <MetaRow icon={MapPin} label="Location" value={c.location} />
          <MetaRow icon={Building2} label="Source" value={c.source} />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="t-label-small text-muted-fg">Consent</span>
            <ChipBadge tone="success" size="sm" className="gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Accepted
            </ChipBadge>
          </div>
          {c.consentRespondedAt && (
            <div className="flex items-center justify-between">
              <span className="t-label-small text-muted-fg">Responded</span>
              <span className="t-body-small text-dark">{timeAgo(c.consentRespondedAt)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="t-label-small text-muted-fg">Shortlisted</span>
            <span className="t-body-small text-dark">{c.shortlistedAt}</span>
          </div>
        </div>

        <Separator />

        <div>
          <div className="t-label-small text-muted-fg mb-1.5">Calling about</div>
          <div className="t-label-large text-cosmic">{role.title}</div>
          <div className="t-body-small text-muted-fg">{role.team} · {role.location}</div>
        </div>
      </div>
    </PanelShell>
  );
}

function MetaRow({
  icon: Icon, label, value, copyable,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-fg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="t-label-small text-muted-fg">{label}</div>
        <div className="t-body-medium text-dark truncate">{value}</div>
      </div>
      {copyable && (
        <Button size="icon" variant="ghost" onClick={onCopy} aria-label={`Copy ${label}`} className="h-7 w-7 shrink-0">
          {copied ? <CheckCircle2 className="h-3 w-3 text-success-ink" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </div>
  );
}

export function ResumePanel({ candidate: c, zoneSize }: PanelProps) {
  return (
    <PanelShell icon={FileText} title="Resume" zone={zoneSize} badge={`${c.yearsExperience}y exp`}>
      <ScrollArea className="h-full">
        <div className="p-4 lg:p-5 space-y-5">
          <div>
            <div className="t-headline-small text-cosmic">{c.name}</div>
            <div className="t-body-medium text-muted-fg">{c.currentRole} at {c.currentCompany}</div>
            <div className="t-body-small text-muted-fg">{c.location} · {c.email}</div>
          </div>
          <Section heading="Summary">
            <p className="t-body-medium text-dark leading-relaxed">{c.resumeSummary}</p>
          </Section>
          <Section heading="Recent experience">
            <ul className="space-y-2 t-body-medium text-dark">
              {c.resumeBullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-stellar shrink-0">•</span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section heading="Skills & technologies">
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <ChipBadge key={s} tone="outline" size="sm">{s}</ChipBadge>)}
            </div>
          </Section>
          <div className="t-label-small text-muted-fg pt-2 border-t border-[#E8EBF0]">
            Synced from {c.source} · Full PDF attached to candidate profile
          </div>
        </div>
      </ScrollArea>
    </PanelShell>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="t-label-small text-muted-fg mb-2">{heading}</div>
      {children}
    </div>
  );
}

export function QuestionsPanel({ role, zoneSize }: PanelProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Set<string>>(new Set());
  const total = role.screeningQuestions.length;
  const completed = done.size;
  const markDone = (id: string) => setDone((d) => new Set([...d, id]));
  const update = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <PanelShell
      icon={ListChecks}
      title="Screening questions"
      zone={zoneSize}
      badge={`${completed}/${total}`}
      headerExtra={completed === total && completed > 0 ? <CheckCircle2 className="h-3.5 w-3.5 text-success-ink" /> : null}
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {role.screeningQuestions.map((q, i) => {
            const isDone = done.has(q.id);
            return (
              <div key={q.id} className={cn("rounded-lg border transition-colors", isDone ? "border-success bg-success-soft/40" : "border-[#E8EBF0] bg-white")}>
                <div className="p-3">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className={cn(
                      "h-5 w-5 rounded-pill flex items-center justify-center shrink-0 mt-0.5 t-label-small",
                      isDone ? "bg-success text-white" : "bg-mist text-cosmic"
                    )}>
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="t-body-medium text-dark leading-snug">{q.question}</p>
                      {q.required && <span className="t-label-small text-muted-fg">Required</span>}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Capture answer…"
                    value={answers[q.id] || ""}
                    onChange={(e) => update(q.id, e.target.value)}
                    onBlur={() => answers[q.id]?.trim() && markDone(q.id)}
                    className="min-h-[60px] text-[13px] resize-y"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </PanelShell>
  );
}

export function NotesPanel({ candidate: c, zoneSize }: PanelProps) {
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!notes) return;
    const t = setTimeout(() => setSavedAt(new Date()), 1200);
    return () => clearTimeout(t);
  }, [notes]);

  return (
    <PanelShell
      icon={PenLine}
      title="Notes"
      zone={zoneSize}
      headerExtra={
        savedAt ? (
          <span className="t-label-small text-success-ink flex items-center gap-1">
            <Save className="h-2.5 w-2.5" /> Saved
          </span>
        ) : (
          notes ? <span className="t-label-small text-muted-fg">Saving…</span> : null
        )
      }
    >
      <div className="h-full flex flex-col p-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {["Strong yes", "Concern: comp", "Concern: timeline", "Follow up needed", "Send to onsite"].map((chip) => (
            <button
              key={chip}
              onClick={() => setNotes((n) => n + (n ? "\n• " : "• ") + chip + ": ")}
              className="t-label-small px-2 py-0.5 rounded-pill bg-mist hover:bg-stellar-50 text-cosmic transition-colors focus-ring"
            >
              {chip}
            </button>
          ))}
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={`Notes for ${c.name.split(" ")[0]}…\n\nAuto-saved every few seconds. Synced to candidate profile when call ends.`}
          className="flex-1 resize-none text-[13px] leading-relaxed"
        />
      </div>
    </PanelShell>
  );
}

export function JdPanel({ role, zoneSize }: PanelProps) {
  return (
    <PanelShell icon={ClipboardList} title="Job description" zone={zoneSize}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          <div>
            <div className="t-title-medium text-cosmic">{role.title}</div>
            <div className="t-body-small text-muted-fg">{role.team} · {role.location}</div>
          </div>
          <p className="t-body-medium text-dark leading-relaxed">{role.jdSummary}</p>
          <Separator />
          <div className="t-body-medium text-dark whitespace-pre-line leading-relaxed">{role.jdFull}</div>
        </div>
      </ScrollArea>
    </PanelShell>
  );
}

export const PANEL_COMPONENTS: Record<Panel, React.ComponentType<PanelProps>> = {
  metadata: MetadataPanel,
  resume: ResumePanel,
  questions: QuestionsPanel,
  notes: NotesPanel,
  jd: JdPanel,
};
