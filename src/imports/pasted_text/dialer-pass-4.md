==============================================================================
CONNX — Build Pass 4 (Auto Dialer · the hero flow)
==============================================================================

This bundle contains 12 files for Pass 4.
Each file is delimited by:
  >>> FILE: <relative path>
  ... contents ...
  <<< END FILE

INSTALLATION:
  1. You should already have Pass 1 + Pass 2 + Pass 3 in your Make project.
  2. Add the 10 new files at the paths shown.
  3. REPLACE src/App.tsx with the version below — wires the dialer routes.
     Note: /dialer/session is intentionally a TOP-LEVEL route (not nested
     under AppShell) — that's the focus mode design move.
  4. No config or dependency changes needed.

==============================================================================
>>> FILE: README.md
==============================================================================
# CONNX — Build Pass 4

The Auto Dialer — the screen this entire product gets built around. Three sub-screens plus a post-session summary, fully built. The 50/30/20 zone layout, panel pill bar, in-call controls, voicemail drop, disposition flow with AI summary, and floating Notes shortcut all working end-to-end.

## What's in Pass 4

**11 files total** — 1 lib, 5 dialer components, 4 pages, 1 router update.

### New files
```
src/lib/dialer.ts                                       # Dialer types, layout helpers, localStorage persistence
src/components/dialer/panels.tsx                        # 5 information panels (Metadata, Resume, Questions, Notes, JD)
src/components/dialer/panel-pill-bar.tsx                # The BRD-mandated pill selector for panel-to-zone assignment
src/components/dialer/call-control-bar.tsx              # Mute, Hold, Voicemail, SMS, Recording, End — with live timer
src/components/dialer/queue-strip.tsx                   # Compact running list of the queue with current/done/pending markers
src/components/dialer/disposition-modal.tsx             # Post-call wrap-up with disposition + LEO suggested next step
src/pages/recruiter/dialer-queue.tsx                    # Step 1 — pick role, set call order, refine candidate list
src/pages/recruiter/dialer-customise.tsx                # Step 2 — pre-session pill-based layout config (BRD AD-17)
src/pages/recruiter/dialer-session.tsx                  # Step 3 — the active-call hero screen
src/pages/recruiter/dialer-summary.tsx                  # Post-session recap + LEO insights
```

### Replaced file
```
src/App.tsx                                             # Router wires all 4 dialer routes; /dialer/session bypasses AppShell
```

## How to install on top of Pass 1 + Pass 2 + Pass 3

1. Add the 10 new files at the paths shown.
2. Replace `src/App.tsx` with the new version — it adds dialer routes and crucially sets `/dialer/session` as a top-level route that bypasses the AppShell for focus mode.
3. No config or dependency changes — Pass 1 already has all needed packages.

## What you'll see

### Step 1 — Queue Builder (`/dialer`)
- Stepper indicator: Build queue → Customise view → Make calls
- 3-step flow inside the page: pick role (with "X ready" badge per role), choose call order (Best time to reach / Consent-first / Manual), refine list (search + per-row toggle)
- "Best time to reach" marks top 3 candidates with a "Prime" badge
- Sticky right-side **session summary** with role / candidate count / order / estimated duration / LEO recommendation in gradient surface
- DNC compliance card sits below the CTA so recruiters see it before they start

### Step 2 — Customise Call View (`/dialer/customise`)
- The BRD-mandated pre-session step (AD-17)
- **Panel pill bar** at the top — 5 pills for the 5 panels, each pill shows zone label (A/B/C) when active; tap a pill to open a dropdown that lets you assign it to any zone
- **Live preview** below — actual 50/30/20 grid with placeholder content scaled to each zone's width, rendering the layout exactly as the recruiter will see it during the call
- "Save as my default" toggle persists the layout to localStorage (real per-recruiter persistence)
- Reset to default button available

### Step 3 — Active Call (`/dialer/session`) — **the hero screen**
- **AppShell is suspended** — no sidebar, no full top bar. Just a thin status strip with logo + role + queue position. The recruiter is in focus mode.
- Pill bar above the workspace, persistent throughout the session, with Skip button on the right
- **50/30/20 grid** below — Zone A (5/10 cols), Zone B (3/10 cols), Zone C (2/10 cols). Zone proportions fixed, panel content scrolls within each zone.
- Below the grid: **Queue strip** showing all candidates as 32px circles with initials, current candidate highlighted with stellar ring + Phone icon overlay, completed candidates color-coded by disposition (success-green for shortlisted, danger-red for rejected, stellar-blue for callback, dim for no-answer)
- At the bottom: **Cosmic-indigo Call Control Bar** — pulse-ring animation around the green "On call" dot, mute/hold/voicemail/SMS/recording controls, **End Call** button always visible in red, never hidden
- **Floating Notes shortcut** appears as a circular bottom-right button when Notes isn't assigned to any zone — opens a slide-over for quick capture
- Responsive: at < 1280px width, Zone A becomes full-width and B+C stack as a 2-column row below it (per BRD AD-18)

### Post-session — Summary (`/dialer/summary`)
- Hero "Session complete" with success check
- 4-stat strip: Calls made / Connected / Shortlisted / Duration
- Outcomes breakdown by disposition
- LEO recap with insight ("You connected with 62% — 4 points above your average. Best window was Tuesday 10–12...")
- Two CTAs: Start another queue / Back to dashboard

### The five panels (in detail)

1. **Candidate Metadata** — avatar, identity, contact (with copy buttons), source, consent badge with timestamps, role context
2. **Resume** — header block, summary, experience bullets, skills as outline badges, ATS sync footer
3. **Screening Questions** — numbered cards with required indicator, inline textarea per question, completion state changes card to success-soft when filled
4. **Notes** — quick-chip prefixes (Strong yes / Concern: comp / etc.) inject formatted prefix into the textarea, simulated auto-save indicator
5. **JD** — full job description with summary block + scrollable detail

## Design moves I made

1. **The active-call screen suspends the AppShell entirely.** When a recruiter is on a live call, no nav, no notifications, no command palette. Their job is the candidate. This is the only screen in the entire product where the shell goes away. The status strip at the top is just enough chrome to show "where am I" without being noise.

2. **Pill bar pills change shape based on assignment.** Active pills are filled Stellar Blue with a small zone label badge ("A", "B", "C"). Inactive pills are outlined and muted. Recruiters can see at a glance which 3 panels are visible and which 2 are hidden, without having to read.

3. **Disposition modal isn't punitive — it's a wrap.** The four options (Shortlist / Callback / Hold / Reject) read like decisions, not data entry. When you pick "Shortlist," LEO immediately surfaces the next step ("Schedule onsite this week, loop in HM"). When you pick "Reject," the placeholder copy hints at the polite-rejection email template. The modal works *with* the recruiter, not against them.

4. **Queue strip is glanceable in 200ms.** Each candidate is a 32px circle. Color tells you the outcome. Position tells you where you are in the session. No table, no list, no scroll. Hover any circle for the name + outcome tooltip.

5. **Voicemail drop is one click and visually decisive.** When dropped: status indicator switches to quantum-purple, candidate is auto-marked as no-answer, the queue strip dot dims, and the dialer auto-advances to the next call after 1.5s. No confirmation modal — recruiters do this 30+ times a day.

6. **Floating Notes shortcut respects the BRD.** Per AD-20, Notes always retains write-access regardless of zone assignment. If you assign Notes to a zone, the floating button hides. If you swap it out of view, the floating button appears in bottom-right — so you can capture a thought even when the recruiter has assigned, say, Resume / Questions / JD across the three zones.

7. **No animations during active calls.** The only motion in the session view is the pulse-ring on the "connected" indicator (helpful: confirms call is live) and the queue strip color transitions. Everything else is instant. The product is data-dense and time-pressured — motion is cognitive cost.

## What's next (Pass 5)

Bulk Communication composer (SMS / Email / WhatsApp with segment builder, template library, scheduling, and per-campaign analytics) + the unified Candidate Timeline (chat-style history of every interaction). Two more recruiter surfaces, fully built.
<<< END FILE

==============================================================================
>>> FILE: src/lib/dialer.ts
==============================================================================
import type { Panel, Zone, LayoutPref, Candidate } from "@/types";
import { CANDIDATES } from "@/data/mock";

// ─── Panel metadata ───────────────────────────────────────────────
export const PANEL_META: Record<Panel, {
  label: string;
  shortLabel: string;
  description: string;
  defaultZone: Zone;
  iconName: "Briefcase" | "FileText" | "ListChecks" | "PenLine" | "ClipboardList";
}> = {
  metadata:  { label: "Candidate metadata", shortLabel: "Metadata",  description: "Name, contact, source, consent timestamp", defaultZone: "B", iconName: "Briefcase" },
  resume:    { label: "Resume",             shortLabel: "Resume",    description: "Full CV from ATS",                      defaultZone: "A", iconName: "FileText" },
  questions: { label: "Screening questions",shortLabel: "Questions", description: "Role-specific question set",            defaultZone: "B", iconName: "ListChecks" },
  notes:     { label: "Notes",              shortLabel: "Notes",     description: "Auto-saved scratchpad",                 defaultZone: "C", iconName: "PenLine" },
  jd:        { label: "Job description",    shortLabel: "JD",        description: "Full role description",                 defaultZone: "C", iconName: "ClipboardList" },
};

// ─── Default layout (per BRD) ─────────────────────────────────────
export const DEFAULT_LAYOUT: LayoutPref = {
  A: "resume",
  B: "questions",
  C: "notes",
};

// ─── Zone metadata ────────────────────────────────────────────────
export const ZONE_META: Record<Zone, { label: string; widthPct: number; description: string }> = {
  A: { label: "Primary",    widthPct: 50, description: "Dominant panel · main reference during the call" },
  B: { label: "Secondary",  widthPct: 30, description: "Supporting context · consulted frequently" },
  C: { label: "Tertiary",   widthPct: 20, description: "Quick-glance or write zone · compact info or input" },
};

// ─── Build a queue ────────────────────────────────────────────────
export function getQueueCandidates(roleId: string): Candidate[] {
  return CANDIDATES.filter(
    (c) => c.roleId === roleId && c.consentStatus === "accepted" && c.stage === "consented"
  );
}

// Live status types for the queue display
export type LiveStatus = "completed" | "current" | "pending" | "skipped";

// ─── Localstorage layout pref ─────────────────────────────────────
const STORAGE_KEY = "connx.dialer.layout";

export function loadSavedLayout(): LayoutPref | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSavedLayout(layout: LayoutPref): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // ignore quota errors silently
  }
}

// ─── Validate a layout (every zone has a unique panel) ────────────
export function isValidLayout(layout: Partial<LayoutPref>): layout is LayoutPref {
  if (!layout.A || !layout.B || !layout.C) return false;
  const set = new Set([layout.A, layout.B, layout.C]);
  return set.size === 3;
}

// ─── Panel priority calls (for Skip / Pause / DNC) ────────────────
export const DISPOSITION_OPTIONS = [
  { value: "shortlisted", label: "Shortlist · advance",  emoji: "✓", color: "success" as const, hint: "Move to next interview round" },
  { value: "callback",    label: "Schedule callback",    emoji: "↻", color: "info" as const,    hint: "Pick a time to try again" },
  { value: "on-hold",     label: "Hold for review",      emoji: "⏸", color: "warning" as const, hint: "Pending HM review" },
  { value: "rejected",    label: "Reject · politely",    emoji: "✕", color: "danger" as const,  hint: "Send polite rejection email" },
] as const;
<<< END FILE

==============================================================================
>>> FILE: src/components/dialer/panels.tsx
==============================================================================
import { useState, useEffect } from "react";
import {
  Briefcase, FileText, ListChecks, PenLine, ClipboardList,
  Mail, Phone, MapPin, Building2, ShieldCheck, ExternalLink,
  Save, CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, timeAgo } from "@/lib/utils";
import type { Candidate, Role, Panel } from "@/types";

interface PanelProps {
  candidate: Candidate;
  role: Role;
  zoneSize: "A" | "B" | "C";
}

// ─── Shared panel chrome ───────────────────────────────────────────
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
    <div className="bg-white rounded-lg border border-border h-full flex flex-col overflow-hidden shadow-1">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-mist/50 shrink-0">
        <Icon className="h-3.5 w-3.5 text-stellar shrink-0" />
        <span className="t-label-large text-cosmic flex-1 truncate">{title}</span>
        {badge && (
          <Badge size="sm" variant="info">{badge}</Badge>
        )}
        <Badge size="sm" variant="neutral" className="bg-cosmic/10 text-cosmic border-0">
          Zone {zone}
        </Badge>
        {headerExtra}
      </div>
      <div className={cn("flex-1 min-h-0 overflow-auto", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

// ─── 1. Metadata panel ─────────────────────────────────────────────
export function MetadataPanel({ candidate: c, role, zoneSize }: PanelProps) {
  return (
    <PanelShell icon={Briefcase} title="Candidate metadata" zone={zoneSize}>
      <div className="p-4 space-y-4">
        {/* Identity */}
        <div className="flex items-start gap-3">
          <NameAvatar name={c.name} size={zoneSize === "A" ? 56 : 44} />
          <div className="flex-1 min-w-0">
            <div className="t-title-medium text-cosmic truncate">{c.name}</div>
            <div className="t-body-small text-muted-fg">{c.currentRole}</div>
            <div className="t-body-small text-muted-fg">{c.currentCompany}</div>
          </div>
        </div>

        <Separator />

        {/* Contact */}
        <div className="space-y-2">
          <MetaRow icon={Phone} label="Phone" value={c.phone} copyable />
          <MetaRow icon={Mail}  label="Email" value={c.email} copyable />
          <MetaRow icon={MapPin} label="Location" value={c.location} />
          <MetaRow icon={Building2} label="Source" value={c.source} />
        </div>

        <Separator />

        {/* Consent + history */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="t-label-small text-muted-fg">Consent</span>
            <Badge variant="success" size="sm" className="gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Accepted
            </Badge>
          </div>
          {c.consentRespondedAt && (
            <div className="flex items-center justify-between">
              <span className="t-label-small text-muted-fg">Responded</span>
              <span className="t-body-small text-dark">{timeAgo(c.consentRespondedAt)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="t-label-small text-muted-fg">Shortlisted</span>
            <span className="t-body-small text-dark">{timeAgo(c.shortlistedAt)}</span>
          </div>
        </div>

        <Separator />

        {/* Role context */}
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
      <Icon className="h-3.5 w-3.5 text-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="t-label-small text-muted-fg">{label}</div>
        <div className="t-body-medium text-dark truncate">{value}</div>
      </div>
      {copyable && (
        <Button size="icon-sm" variant="ghost" onClick={onCopy} aria-label={`Copy ${label}`} className="shrink-0">
          {copied ? <CheckCircle2 className="h-3 w-3 text-success-ink" /> : <ExternalLink className="h-3 w-3" />}
        </Button>
      )}
    </div>
  );
}

// ─── 2. Resume panel ────────────────────────────────────────────────
export function ResumePanel({ candidate: c, zoneSize }: PanelProps) {
  return (
    <PanelShell icon={FileText} title="Resume" zone={zoneSize} badge={`${c.yearsExperience}y exp`}>
      <ScrollArea className="h-full">
        <div className="p-4 lg:p-5 space-y-5">
          {/* Header block — like a resume header */}
          <div>
            <div className="t-headline-small text-cosmic">{c.name}</div>
            <div className="t-body-medium text-muted-fg">{c.currentRole} at {c.currentCompany}</div>
            <div className="t-body-small text-muted-fg">{c.location} · {c.email}</div>
          </div>

          {/* Summary */}
          <Section heading="Summary">
            <p className="t-body-medium text-dark leading-relaxed">{c.resumeSummary}</p>
          </Section>

          {/* Experience */}
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

          {/* Skills */}
          <Section heading="Skills & technologies">
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => (
                <Badge key={s} variant="outline" size="sm">{s}</Badge>
              ))}
            </div>
          </Section>

          {/* Footnote */}
          <div className="t-label-small text-muted pt-2 border-t border-border">
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

// ─── 3. Screening Questions panel ──────────────────────────────────
export function QuestionsPanel({ role, zoneSize }: PanelProps) {
  // Track answers locally — auto-saved feel
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
      headerExtra={
        completed === total && completed > 0 ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-success-ink" />
        ) : null
      }
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {role.screeningQuestions.map((q, i) => {
            const isDone = done.has(q.id);
            return (
              <div key={q.id} className={cn("rounded-lg border transition-colors", isDone ? "border-success bg-success-soft/40" : "border-border bg-white")}>
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

// ─── 4. Notes panel ────────────────────────────────────────────────
export function NotesPanel({ candidate: c, zoneSize }: PanelProps) {
  const [notes, setNotes] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Simulated auto-save every 2s if dirty
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
          notes && <span className="t-label-small text-muted">Saving…</span>
        )
      }
    >
      <div className="h-full flex flex-col p-3">
        {/* Quick chips for common note prefixes */}
        <div className="flex flex-wrap gap-1 mb-2">
          {[
            "Strong yes",
            "Concern: comp",
            "Concern: timeline",
            "Follow up needed",
            "Send to onsite",
          ].map((chip) => (
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

// ─── 5. JD panel ───────────────────────────────────────────────────
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
          <div className="t-body-medium text-dark whitespace-pre-line leading-relaxed">
            {role.jdFull}
          </div>
        </div>
      </ScrollArea>
    </PanelShell>
  );
}

// ─── Panel registry ───────────────────────────────────────────────
export const PANEL_COMPONENTS: Record<Panel, React.ComponentType<PanelProps>> = {
  metadata: MetadataPanel,
  resume: ResumePanel,
  questions: QuestionsPanel,
  notes: NotesPanel,
  jd: JdPanel,
};
<<< END FILE

==============================================================================
>>> FILE: src/components/dialer/panel-pill-bar.tsx
==============================================================================
import {
  Briefcase, FileText, ListChecks, PenLine, ClipboardList, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PANEL_META } from "@/lib/dialer";
import type { Panel, Zone, LayoutPref } from "@/types";

const ICONS = {
  Briefcase, FileText, ListChecks, PenLine, ClipboardList,
} as const;

interface PanelPillBarProps {
  layout: LayoutPref;
  onChange: (newLayout: LayoutPref) => void;
  compact?: boolean; // for the active-call header
}

export function PanelPillBar({ layout, onChange, compact = false }: PanelPillBarProps) {
  // Reverse map: which zone has which panel?
  const zoneFor: Record<Panel, Zone | null> = {
    metadata: null, resume: null, questions: null, notes: null, jd: null,
  };
  (Object.keys(layout) as Zone[]).forEach((z) => { zoneFor[layout[z]] = z; });

  // Order pills so currently-assigned ones come first, then unassigned
  const allPanels = Object.keys(PANEL_META) as Panel[];
  const ordered = [
    ...allPanels.filter((p) => zoneFor[p] !== null),
    ...allPanels.filter((p) => zoneFor[p] === null),
  ];

  // When user picks a zone for an unassigned pill, that swaps with whatever is in that zone
  const assignToZone = (panel: Panel, targetZone: Zone) => {
    const currentZone = zoneFor[panel];
    if (currentZone === targetZone) return;

    const next: LayoutPref = { ...layout };

    // What's currently in target zone?
    const displaced = layout[targetZone];

    if (currentZone) {
      // panel is being moved from currentZone to targetZone — swap
      next[targetZone] = panel;
      next[currentZone] = displaced;
    } else {
      // panel was unassigned, displace whatever was at target
      next[targetZone] = panel;
      // The displaced panel becomes unassigned — but we always need 3 panels visible.
      // So: if 3 panels were already covering all zones, the displaced panel goes to where 'panel' would have been.
      // Since panel was unassigned, displaced just goes "out". But we still need to fill all 3 zones, which we do.
      // The displaced panel is now off-grid.
    }
    onChange(next);
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 flex-wrap",
      compact ? "" : "p-3 bg-white rounded-lg border border-border shadow-1"
    )}>
      {!compact && (
        <span className="t-label-small text-muted-fg mr-2 shrink-0">Tap to assign · 5 panels · 3 zones</span>
      )}

      {ordered.map((panel) => {
        const meta = PANEL_META[panel];
        const Icon = ICONS[meta.iconName];
        const zone = zoneFor[panel];
        const active = zone !== null;

        return (
          <DropdownMenu key={panel}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "group inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 t-label-medium transition-all focus-ring",
                      active
                        ? "bg-stellar text-white border-stellar hover:bg-stellar-700"
                        : "bg-white text-dark border-border-strong hover:border-stellar/50 hover:text-cosmic"
                    )}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{meta.shortLabel}</span>
                    {active && (
                      <span className={cn(
                        "t-label-small rounded-sm px-1 ml-0.5",
                        "bg-white/20 text-white"
                      )}>
                        {zone}
                      </span>
                    )}
                    <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                {active ? `${meta.label} · in Zone ${zone}` : `${meta.label} · not in view`}
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="start" className="w-[260px]">
              <DropdownMenuLabel>{meta.label}</DropdownMenuLabel>
              <div className="px-2 pb-1">
                <p className="t-body-small text-muted-fg">{meta.description}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Assign to zone</DropdownMenuLabel>
              {(["A", "B", "C"] as Zone[]).map((z) => {
                const occupant = layout[z];
                const isHere = occupant === panel;
                return (
                  <DropdownMenuItem
                    key={z}
                    onSelect={() => assignToZone(panel, z)}
                    className={cn(isHere && "bg-stellar-50 text-stellar-700")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="t-label-large">Zone {z} · {z === "A" ? "Primary" : z === "B" ? "Secondary" : "Tertiary"}</div>
                        <div className="t-body-small text-muted-fg">
                          {z === "A" ? "50% width" : z === "B" ? "30% width" : "20% width"}
                          {!isHere && occupant && ` · displaces ${PANEL_META[occupant].shortLabel}`}
                        </div>
                      </div>
                      {isHere && <span className="t-label-small text-stellar-700">Current</span>}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dialer/call-control-bar.tsx
==============================================================================
import { useState, useEffect } from "react";
import {
  Mic, MicOff, Pause, Play, Voicemail, PhoneOff, Phone,
  Volume2, MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDuration } from "@/lib/utils";

interface CallControlBarProps {
  candidateName: string;
  candidatePhone: string;
  callStatus: "ringing" | "connected" | "voicemail" | "ended";
  onEndCall: () => void;
  onVoicemailDrop: () => void;
  onPause?: () => void;
}

export function CallControlBar({
  candidateName, candidatePhone, callStatus, onEndCall, onVoicemailDrop,
}: CallControlBarProps) {
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Tick up every second once connected
  useEffect(() => {
    if (callStatus !== "connected") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  return (
    <div className="bg-cosmic text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-3">
      {/* Status indicator */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className={cn(
          "h-2.5 w-2.5 rounded-pill",
          callStatus === "ringing" && "bg-warning animate-pulse",
          callStatus === "connected" && "bg-nebula animate-pulse-ring",
          callStatus === "voicemail" && "bg-quantum",
          callStatus === "ended" && "bg-white/40"
        )} />
        <div className="hidden sm:block">
          <div className="t-label-small text-white/60">
            {callStatus === "ringing" && "Dialing"}
            {callStatus === "connected" && "On call"}
            {callStatus === "voicemail" && "Voicemail dropped"}
            {callStatus === "ended" && "Call ended"}
          </div>
          <div className="t-label-large flex items-center gap-2">
            <span className="truncate max-w-[160px]">{candidateName}</span>
            <span className="text-white/40">·</span>
            <span className="tabular-nums text-white/80">{formatDuration(seconds)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <ControlButton
          icon={muted ? MicOff : Mic}
          label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted(!muted)}
          active={muted}
          activeClass="bg-warning text-warning-ink hover:bg-warning/90"
        />
        <ControlButton
          icon={held ? Play : Pause}
          label={held ? "Resume" : "Hold"}
          onClick={() => setHeld(!held)}
          active={held}
          activeClass="bg-warning text-warning-ink hover:bg-warning/90"
        />
        <ControlButton
          icon={Voicemail}
          label="Drop voicemail"
          onClick={onVoicemailDrop}
        />
        <ControlButton
          icon={MessageSquareText}
          label="Send SMS"
          onClick={() => {}}
        />
        <ControlButton
          icon={Volume2}
          label="Recording"
          onClick={() => {}}
          subdetail="Recording"
        />
      </div>

      {/* End call — always visible, never hidden */}
      <Button
        size="default"
        onClick={onEndCall}
        className="bg-danger hover:bg-danger-ink text-white shrink-0 ml-2 gap-1.5"
      >
        <PhoneOff className="h-4 w-4" />
        End call
      </Button>
    </div>
  );
}

function ControlButton({
  icon: Icon, label, onClick, active = false, activeClass, subdetail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  subdetail?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 px-2.5 rounded-md inline-flex items-center gap-1.5 t-label-medium transition-colors focus-ring",
        active ? activeClass : "bg-white/10 text-white hover:bg-white/20"
      )}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden md:inline">{label}</span>
      {subdetail && <span className="t-label-small text-white/50 hidden lg:inline">· {subdetail}</span>}
    </button>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dialer/queue-strip.tsx
==============================================================================
import { CheckCircle2, Phone, Clock, PhoneOff } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { Candidate } from "@/types";

interface QueueStripProps {
  queue: Candidate[];
  currentIndex: number;
  completedDispositions: Record<string, "shortlisted" | "rejected" | "on-hold" | "callback" | "no-answer">;
}

export function QueueStrip({ queue, currentIndex, completedDispositions }: QueueStripProps) {
  return (
    <div className="bg-white rounded-lg border border-border px-3 py-2 flex items-center gap-2 overflow-x-auto">
      <span className="t-label-small text-muted-fg shrink-0 px-1">Queue · {currentIndex + 1}/{queue.length}</span>

      <div className="flex items-center gap-1.5 shrink-0">
        {queue.map((c, i) => {
          const isCurrent = i === currentIndex;
          const isCompleted = i < currentIndex;
          const disp = completedDispositions[c.id];

          let bgClass = "bg-mist text-muted-fg";
          let icon: React.ReactNode = null;

          if (isCurrent) {
            bgClass = "bg-stellar text-white ring-2 ring-stellar/30 ring-offset-2 ring-offset-white";
            icon = <Phone className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 bg-white text-stellar rounded-pill p-0.5 h-3.5 w-3.5" />;
          } else if (isCompleted) {
            if (disp === "shortlisted") {
              bgClass = "bg-success-soft text-success-ink";
              icon = <CheckCircle2 className="h-3.5 w-3.5 absolute -bottom-0.5 -right-0.5 bg-white rounded-pill p-0 text-success-ink" />;
            } else if (disp === "rejected") {
              bgClass = "bg-danger-soft text-danger-ink";
            } else if (disp === "callback") {
              bgClass = "bg-stellar-50 text-stellar-700";
              icon = <Clock className="h-3.5 w-3.5 absolute -bottom-0.5 -right-0.5 bg-white rounded-pill p-0 text-stellar" />;
            } else if (disp === "no-answer") {
              bgClass = "bg-mist text-muted-fg opacity-60";
              icon = <PhoneOff className="h-3 w-3 absolute -bottom-0.5 -right-0.5 bg-white rounded-pill p-0 text-muted" />;
            } else {
              bgClass = "bg-warning-soft text-warning-ink";
            }
          }

          return (
            <div
              key={c.id}
              className={cn(
                "relative h-8 w-8 rounded-pill flex items-center justify-center t-label-small font-semibold shrink-0 transition-all",
                bgClass
              )}
              title={`${c.name} ${isCompleted ? `· ${disp}` : isCurrent ? "· on call" : "· up next"}`}
            >
              {initials(c.name)}
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/dialer/disposition-modal.tsx
==============================================================================
import { useState } from "react";
import { CheckCircle2, Clock, Pause, X, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDuration } from "@/lib/utils";
import type { Candidate, CallDisposition } from "@/types";

const OPTIONS = [
  {
    value: "shortlisted" as const,
    icon: CheckCircle2,
    label: "Shortlist · advance",
    desc: "Move forward to next interview round. Hiring manager will review.",
    bg: "bg-success-soft hover:bg-success-soft/70",
    border: "border-success/30",
    iconBg: "bg-success text-white",
  },
  {
    value: "callback" as const,
    icon: Clock,
    label: "Schedule callback",
    desc: "Pick a time to try again — candidate wasn't a fit for this slot.",
    bg: "bg-stellar-50 hover:bg-stellar-50/70",
    border: "border-stellar/30",
    iconBg: "bg-stellar text-white",
  },
  {
    value: "on-hold" as const,
    icon: Pause,
    label: "Hold for review",
    desc: "Pending hiring manager input before deciding.",
    bg: "bg-warning-soft hover:bg-warning-soft/70",
    border: "border-warning/30",
    iconBg: "bg-warning text-warning-ink",
  },
  {
    value: "rejected" as const,
    icon: X,
    label: "Reject · politely",
    desc: "Send the polite rejection email template. Candidate marked as rejected.",
    bg: "bg-danger-soft hover:bg-danger-soft/70",
    border: "border-danger/30",
    iconBg: "bg-danger text-white",
  },
];

interface DispositionModalProps {
  open: boolean;
  candidate: Candidate;
  durationSec: number;
  onSubmit: (disposition: CallDisposition, summary?: string) => void;
}

export function DispositionModal({ open, candidate, durationSec, onSubmit }: DispositionModalProps) {
  const [picked, setPicked] = useState<CallDisposition>(null);
  const [summary, setSummary] = useState("");

  const handleSubmit = () => {
    if (!picked) return;
    onSubmit(picked, summary);
    // Reset for next call
    setPicked(null);
    setSummary("");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[560px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle>Wrap up the call</DialogTitle>
            <DialogDescription>
              Pick a disposition to log this screening and move to the next candidate.
            </DialogDescription>
          </DialogHeader>

          {/* Candidate context */}
          <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-mist">
            <NameAvatar name={candidate.name} size={40} />
            <div className="flex-1 min-w-0">
              <div className="t-label-large text-dark truncate">{candidate.name}</div>
              <div className="t-body-small text-muted-fg truncate">{candidate.currentRole} · {candidate.currentCompany}</div>
            </div>
            <Badge variant="outline" size="sm">
              {formatDuration(durationSec)}
            </Badge>
          </div>
        </div>

        {/* Disposition options */}
        <div className="px-6 pb-2">
          <div className="t-label-small text-muted-fg mb-2">Disposition</div>
          <div className="grid grid-cols-2 gap-2">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = picked === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPicked(opt.value)}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all focus-ring",
                    active ? `${opt.bg} ${opt.border} ring-2 ring-offset-1 ring-current/20 shadow-1` : `bg-white border-border hover:${opt.bg}`
                  )}
                >
                  <div className={cn("h-7 w-7 rounded-pill flex items-center justify-center mb-2", opt.iconBg)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="t-label-large text-dark">{opt.label}</div>
                  <div className="t-body-small text-muted-fg leading-snug mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI summary (if shortlisted/advanced) — LEO surface */}
        {picked === "shortlisted" && (
          <div className="mx-6 mb-4 p-3 rounded-lg leo-gradient text-white animate-fade-in">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="t-label-large mb-1">LEO suggested next step</div>
                <p className="t-body-small text-white/85">
                  Schedule onsite with {candidate.name.split(" ")[0]} this week. Loop in {candidate.roleId.includes("role-1") ? "Priya Raman (HM)" : "the hiring manager"} for panel scheduling.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Optional summary note */}
        <div className="px-6 pb-4">
          <div className="t-label-small text-muted-fg mb-1.5">Quick summary <span className="text-muted">(optional, also auto-generated from call recording)</span></div>
          <Textarea
            placeholder={picked === "shortlisted"
              ? "Strong fundamentals. Comp expectation: ~$210k base. Earliest start: 4 weeks."
              : picked === "rejected"
              ? "Insufficient distributed-systems depth for this seniority."
              : "Add a short note for your future self…"}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-mist/40">
          <Button variant="outline" size="sm" onClick={() => onSubmit(null)}>
            Skip · log later
          </Button>
          <Button
            disabled={!picked}
            onClick={handleSubmit}
            size="sm"
            className="gap-1.5"
          >
            Save &amp; next candidate
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/dialer-queue.tsx
==============================================================================
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhoneCall, ArrowRight, GripVertical, Sparkles, Clock,
  CheckCircle2, Search, Star, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { NameAvatar } from "@/components/ui/avatar";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { CANDIDATES, ROLES } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/types";

type Priority = "consent-time" | "best-time" | "manual";

export default function QueueBuilderPage() {
  const navigate = useNavigate();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(ROLES[0].id);
  const [priority, setPriority] = useState<Priority>("best-time");
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId)!;

  // All consented candidates for the chosen role
  const eligible = useMemo(
    () => CANDIDATES.filter((c) => c.roleId === selectedRoleId && c.consentStatus === "accepted" && c.stage === "consented"),
    [selectedRoleId]
  );

  // Apply search filter
  const filtered = useMemo(() => {
    if (!query) return eligible;
    const q = query.toLowerCase();
    return eligible.filter((c) =>
      c.name.toLowerCase().includes(q) || c.currentCompany.toLowerCase().includes(q)
    );
  }, [eligible, query]);

  // Apply priority sort
  const ordered = useMemo(() => {
    const arr = [...filtered];
    if (priority === "consent-time") {
      arr.sort((a, b) => +new Date(a.consentRespondedAt || a.shortlistedAt) - +new Date(b.consentRespondedAt || b.shortlistedAt));
    } else if (priority === "best-time") {
      // Synthetic best-time score
      arr.sort((a, b) => (a.location.includes("PST") ? -1 : 0) + Math.random() - 0.5);
    }
    return arr;
  }, [filtered, priority]);

  const finalQueue = ordered.filter((c) => !excluded.has(c.id));

  const handleStart = () => {
    // In real app: persist session id
    navigate(`/dialer/customise?role=${selectedRoleId}&count=${finalQueue.length}`);
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Build your dialer queue</h1>
          <p className="text-muted-fg t-body-large">
            Pick a role, refine the candidate list, and start screening. The Auto Dialer connects you on answer.
          </p>
        </div>
      </div>

      {/* Stepper indicator */}
      <Stepper current={1} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5 mt-5">
        {/* ─── Left: setup ───────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Role picker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>1. Pick the role</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => {
                    const eligibleCount = CANDIDATES.filter(
                      (c) => c.roleId === r.id && c.consentStatus === "accepted" && c.stage === "consented"
                    ).length;
                    return (
                      <SelectItem key={r.id} value={r.id} disabled={eligibleCount === 0}>
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{r.title}</span>
                          <Badge size="sm" variant={eligibleCount > 0 ? "info" : "neutral"} className="ml-2">
                            {eligibleCount} ready
                          </Badge>
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

          {/* Priority */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>2. Choose call order</CardTitle>
              <p className="t-body-small text-muted-fg mt-0.5">
                CONNX dials this order. You can reorder, skip, or pause anytime during the session.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <PriorityCard
                  active={priority === "best-time"}
                  onClick={() => setPriority("best-time")}
                  icon={Zap}
                  recommended
                  label="Best time to reach"
                  desc="Order by candidate's likeliest pickup window. Highest connect rate."
                />
                <PriorityCard
                  active={priority === "consent-time"}
                  onClick={() => setPriority("consent-time")}
                  icon={Clock}
                  label="Consent-first"
                  desc="Earliest consenter gets called first. Honors candidate eagerness."
                />
                <PriorityCard
                  active={priority === "manual"}
                  onClick={() => setPriority("manual")}
                  icon={GripVertical}
                  label="Manual order"
                  desc="Drag to set your own sequence below."
                />
              </div>
            </CardContent>
          </Card>

          {/* Candidate list */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>3. Refine the list</CardTitle>
                <p className="t-body-small text-muted-fg mt-0.5">
                  {finalQueue.length} of {eligible.length} candidates included
                </p>
              </div>
              <div className="relative w-[200px] shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <Input
                  placeholder="Filter…" value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-8 text-[13px]"
                />
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
                          isExcluded ? "border-border bg-mist/30 opacity-60" : "border-border bg-white hover:border-stellar/30",
                          priority === "manual" && !isExcluded && "cursor-grab"
                        )}
                      >
                        {priority === "manual" && (
                          <GripVertical className="h-4 w-4 text-muted shrink-0" />
                        )}
                        <span className="t-label-small text-muted-fg w-5 text-right tabular-nums shrink-0">
                          {isExcluded ? "—" : finalQueue.findIndex((cc) => cc.id === c.id) + 1}
                        </span>
                        <Checkbox
                          checked={!isExcluded}
                          onCheckedChange={(v) => {
                            const next = new Set(excluded);
                            v ? next.delete(c.id) : next.add(c.id);
                            setExcluded(next);
                          }}
                          aria-label={`Include ${c.name}`}
                        />
                        <NameAvatar name={c.name} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="t-label-large text-dark truncate">{c.name}</div>
                          <div className="t-body-small text-muted-fg truncate">
                            {c.currentRole} · {c.currentCompany}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 shrink-0">
                          <span className="t-body-small text-muted-fg">{c.location.split(",")[0]}</span>
                          {priority === "best-time" && i < 3 && (
                            <Badge size="sm" variant="success" className="gap-0.5">
                              <Star className="h-2.5 w-2.5" /> Prime
                            </Badge>
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

        {/* ─── Right: summary card ───────────────────────────────── */}
        <div className="lg:sticky lg:top-20 self-start space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Session summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow label="Role" value={selectedRole.title} />
              <SummaryRow label="Candidates" value={`${finalQueue.length} in queue`} />
              <SummaryRow label="Order" value={priority === "best-time" ? "Best time to reach" : priority === "consent-time" ? "Consent-first" : "Manual"} />
              <SummaryRow
                label="Estimated duration"
                value={`~${Math.ceil(finalQueue.length * 8)} min`}
                hint="8 min avg per call · includes wrap time"
              />

              <div className="pt-3 border-t border-border">
                <div className="flex items-start gap-2 mb-3 p-3 rounded-md leo-gradient text-white">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="t-label-large mb-0.5">LEO recommends</div>
                    <p className="t-body-small text-white/85">
                      Tuesday 10:00–12:00 is your prime window. Starting now should connect to {Math.round(finalQueue.length * 0.62)} of {finalQueue.length}.
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  disabled={finalQueue.length === 0}
                  onClick={handleStart}
                >
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

          {/* Compliance note */}
          <Card>
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

function Stepper({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Build queue" },
    { n: 2, label: "Customise view" },
    { n: 3, label: "Make calls" },
  ];
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
            : "text-muted"
          )}>{s.label}</span>
          {i < steps.length - 1 && <span className="h-px w-8 bg-border mx-2" />}
        </div>
      ))}
    </div>
  );
}

function PriorityCard({
  active, onClick, icon: Icon, label, desc, recommended,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left p-3 rounded-lg border transition-all focus-ring",
        active
          ? "border-stellar bg-stellar-50 ring-2 ring-stellar/20 shadow-1"
          : "border-border bg-white hover:border-stellar/30 hover:bg-mist"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className={cn("h-4 w-4", active ? "text-stellar" : "text-muted-fg")} />
        {recommended && <Badge size="sm" variant="success">Recommended</Badge>}
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
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/dialer-customise.tsx
==============================================================================
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, PhoneCall, RotateCcw, Lightbulb, CheckCircle2,
  Briefcase, FileText, ListChecks, PenLine, ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PanelPillBar } from "@/components/dialer/panel-pill-bar";
import { ROLES } from "@/data/mock";
import {
  DEFAULT_LAYOUT, PANEL_META, ZONE_META,
  loadSavedLayout, saveSavedLayout,
} from "@/lib/dialer";
import { cn } from "@/lib/utils";
import type { LayoutPref, Zone, Panel } from "@/types";

const ICONS = { Briefcase, FileText, ListChecks, PenLine, ClipboardList } as const;

export default function DialerCustomisePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleId = params.get("role") || ROLES[0].id;
  const queueCount = Number(params.get("count") || "0");

  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [setAsDefault, setSetAsDefault] = useState(true);

  const role = ROLES.find((r) => r.id === roleId)!;

  const handleStart = () => {
    if (setAsDefault) saveSavedLayout(layout);
    navigate(`/dialer/session?role=${roleId}`);
  };

  const handleReset = () => setLayout(DEFAULT_LAYOUT);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate("/dialer")}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
      </Button>

      {/* Header */}
      <div className="mb-5">
        <h1 className="mb-1">Customise your call view</h1>
        <p className="text-muted-fg t-body-large">
          Pick which panels appear and where. Five panels, three zones — choose what matters most for {role.title}.
        </p>
      </div>

      {/* Stepper */}
      <Stepper current={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 lg:gap-5 mt-5">
        {/* ─── Left: layout configurator ────────────────────────── */}
        <div className="space-y-4">
          {/* Pill bar */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Panels</CardTitle>
                  <p className="t-body-small text-muted-fg mt-0.5">
                    Tap a pill to assign it to Zone A, B, or C. Three panels visible during the call · two are hidden until you swap them in.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset to default
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PanelPillBar layout={layout} onChange={setLayout} />
            </CardContent>
          </Card>

          {/* Live preview of the 50/30/20 layout */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Layout preview</CardTitle>
              <p className="t-body-small text-muted-fg mt-0.5">
                This is the workspace you'll see during a live call. Zone proportions are fixed: Zone A 50%, Zone B 30%, Zone C 20%.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-3 h-[280px] lg:h-[320px]">
                <ZonePreview zone="A" panel={layout.A} />
                <ZonePreview zone="B" panel={layout.B} />
                <ZonePreview zone="C" panel={layout.C} />
              </div>

              {/* Mobile note */}
              <div className="mt-3 p-3 rounded-md bg-mist flex items-start gap-2.5">
                <Lightbulb className="h-3.5 w-3.5 text-stellar shrink-0 mt-0.5" />
                <p className="t-body-small text-dark leading-relaxed">
                  On screens narrower than 1280px, Zone A becomes full-width and Zones B and C stack below it. Notes always keeps a floating shortcut so you can capture quick thoughts even when it's not in view.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right: Confirm & start ───────────────────────────── */}
        <div className="lg:sticky lg:top-20 self-start space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Ready to call</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="t-label-small text-muted-fg">Role</div>
                <div className="t-label-large text-dark">{role.title}</div>
              </div>
              <div>
                <div className="t-label-small text-muted-fg">Queue</div>
                <div className="t-label-large text-dark">{queueCount} candidates</div>
              </div>
              <div>
                <div className="t-label-small text-muted-fg mb-2">Your layout</div>
                <LayoutSummary layout={layout} />
              </div>

              <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-mist">
                <div className="flex-1 min-w-0">
                  <div className="t-label-large text-dark">Save as my default</div>
                  <div className="t-body-small text-muted-fg">Apply this layout to every future dialer session.</div>
                </div>
                <Switch checked={setAsDefault} onCheckedChange={setSetAsDefault} />
              </div>

              <Button size="lg" className="w-full gap-2" onClick={handleStart}>
                <PhoneCall className="h-4 w-4" />
                Start calling
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="t-body-small text-muted-fg text-center -mt-1">
                You can swap panels mid-session — changes apply on the next call.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ZonePreview({ zone, panel }: { zone: Zone; panel: Panel }) {
  const meta = PANEL_META[panel];
  const Icon = ICONS[meta.iconName];
  const cols = zone === "A" ? "col-span-5" : zone === "B" ? "col-span-3" : "col-span-2";

  return (
    <div className={cn(cols, "rounded-lg border border-border bg-white shadow-1 p-3 flex flex-col overflow-hidden")}>
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className="h-3 w-3 text-stellar shrink-0" />
          <span className="t-label-small text-cosmic truncate">{meta.shortLabel}</span>
        </div>
        <Badge size="sm" variant="info" className="shrink-0">Zone {zone}</Badge>
      </div>

      {/* Mocked content lines based on zone width */}
      <div className="flex-1 space-y-1.5 min-h-0 overflow-hidden">
        {zone === "A" && (
          <>
            <div className="h-2 rounded-pill bg-mist w-3/4" />
            <div className="h-2 rounded-pill bg-mist w-full" />
            <div className="h-2 rounded-pill bg-mist w-5/6" />
            <div className="h-2 rounded-pill bg-mist w-full" />
            <div className="h-2 rounded-pill bg-mist w-2/3" />
            <div className="h-2 rounded-pill bg-mist w-full" />
            <div className="h-2 rounded-pill bg-mist w-4/5" />
          </>
        )}
        {zone === "B" && (
          <>
            <div className="h-1.5 rounded-pill bg-mist w-full" />
            <div className="h-1.5 rounded-pill bg-mist w-3/4" />
            <div className="h-1.5 rounded-pill bg-mist w-5/6" />
            <div className="h-1.5 rounded-pill bg-mist w-2/3" />
            <div className="h-1.5 rounded-pill bg-mist w-full" />
          </>
        )}
        {zone === "C" && (
          <>
            <div className="h-1.5 rounded-pill bg-mist w-full" />
            <div className="h-1.5 rounded-pill bg-mist w-2/3" />
            <div className="h-1.5 rounded-pill bg-mist w-3/4" />
          </>
        )}
      </div>

      <div className="t-label-small text-muted mt-2 text-center shrink-0">
        {ZONE_META[zone].widthPct}% · {ZONE_META[zone].label}
      </div>
    </div>
  );
}

function LayoutSummary({ layout }: { layout: LayoutPref }) {
  return (
    <div className="space-y-1.5">
      {(["A", "B", "C"] as Zone[]).map((z) => {
        const meta = PANEL_META[layout[z]];
        const Icon = ICONS[meta.iconName];
        return (
          <div key={z} className="flex items-center gap-2 t-body-small">
            <span className="w-5 h-5 rounded-sm bg-mist text-cosmic flex items-center justify-center t-label-small">{z}</span>
            <Icon className="h-3 w-3 text-muted-fg" />
            <span className="text-dark">{meta.label}</span>
            <span className="ml-auto text-muted-fg">{ZONE_META[z].widthPct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Build queue" },
    { n: 2, label: "Customise view" },
    { n: 3, label: "Make calls" },
  ];
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
            : "text-muted"
          )}>{s.label}</span>
          {i < steps.length - 1 && <span className="h-px w-8 bg-border mx-2" />}
        </div>
      ))}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/dialer-session.tsx
==============================================================================
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  X, PenLine, SkipForward, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/connx/logo";
import { PanelPillBar } from "@/components/dialer/panel-pill-bar";
import { CallControlBar } from "@/components/dialer/call-control-bar";
import { QueueStrip } from "@/components/dialer/queue-strip";
import { DispositionModal } from "@/components/dialer/disposition-modal";
import { PANEL_COMPONENTS, NotesPanel } from "@/components/dialer/panels";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { ROLES } from "@/data/mock";
import { DEFAULT_LAYOUT, loadSavedLayout, getQueueCandidates } from "@/lib/dialer";
import { cn, formatDuration } from "@/lib/utils";
import type { LayoutPref, Zone, CallDisposition } from "@/types";

export default function DialerSessionPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleId = params.get("role") || ROLES[0].id;

  const role = ROLES.find((r) => r.id === roleId)!;
  const initialQueue = useMemo(() => getQueueCandidates(roleId), [roleId]);

  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "voicemail" | "ended">("ringing");
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime] = useState<number>(Date.now());
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [completedDispositions, setCompletedDispositions] = useState<Record<string, any>>({});
  const [showNotesSheet, setShowNotesSheet] = useState(false);
  const [showQueueSheet, setShowQueueSheet] = useState(false);
  const [sessionStarted] = useState(Date.now());

  // Auto-transition: ringing → connected after 2s for demo feel
  useEffect(() => {
    if (callStatus !== "ringing") return;
    const t = setTimeout(() => setCallStatus("connected"), 2200);
    return () => clearTimeout(t);
  }, [callStatus, currentIndex]);

  // Track elapsed call duration once connected
  useEffect(() => {
    if (callStatus !== "connected") return;
    const start = Date.now();
    const t = setInterval(() => setCallDuration(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [callStatus, currentIndex]);

  const currentCandidate = initialQueue[currentIndex];
  const isLastCall = currentIndex === initialQueue.length - 1;

  const handleEndCall = () => {
    setCallStatus("ended");
    setShowDispositionModal(true);
  };

  const handleVoicemailDrop = () => {
    setCallStatus("voicemail");
    setCompletedDispositions((d) => ({ ...d, [currentCandidate.id]: "no-answer" }));
    setTimeout(() => moveToNext(), 1500);
  };

  const handleSkip = () => {
    setCompletedDispositions((d) => ({ ...d, [currentCandidate.id]: "no-answer" }));
    moveToNext();
  };

  const handleDispositionSubmit = (disp: CallDisposition, summary?: string) => {
    if (disp) setCompletedDispositions((d) => ({ ...d, [currentCandidate.id]: disp }));
    setShowDispositionModal(false);
    if (isLastCall) {
      setTimeout(() => navigate("/dialer/summary"), 600);
    } else {
      moveToNext();
    }
  };

  const moveToNext = () => {
    if (isLastCall) {
      navigate("/dialer/summary");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setCallDuration(0);
    setCallStatus("ringing");
  };

  const handleExitSession = () => {
    if (window.confirm("End this dialer session? Your progress will be saved.")) {
      navigate("/");
    }
  };

  if (!currentCandidate) {
    return <SessionEmpty onExit={() => navigate("/dialer")} />;
  }

  return (
    <div className="h-screen w-full bg-mist flex flex-col overflow-hidden">
      {/* ─── Top status strip (replaces normal app shell) ───────── */}
      <div className="h-12 bg-white border-b border-border px-3 lg:px-4 flex items-center gap-3 shrink-0">
        <Logo collapsed size="sm" />
        <span className="t-label-small text-muted-fg hidden md:inline">·</span>
        <div className="flex items-center gap-2 t-label-medium text-cosmic min-w-0">
          <span className="hidden md:inline">Dialer · </span>
          <span className="truncate">{role.title}</span>
        </div>
        <Badge variant="info" size="sm" className="shrink-0">
          {currentIndex + 1} / {initialQueue.length}
        </Badge>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-3 t-body-small text-muted-fg shrink-0">
          <span>Session: {formatDuration(Math.floor((Date.now() - sessionStarted) / 1000))}</span>
          <span>·</span>
          <span>Connected: {Object.values(completedDispositions).filter((d) => d !== "no-answer").length}</span>
        </div>

        <Sheet open={showQueueSheet} onOpenChange={setShowQueueSheet}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Show queue">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Queue</SheetTitle>
            </SheetHeader>
            <div className="p-6">
              <QueueStrip queue={initialQueue} currentIndex={currentIndex} completedDispositions={completedDispositions} />
            </div>
          </SheetContent>
        </Sheet>

        <Button variant="ghost" size="icon-sm" onClick={handleExitSession} aria-label="Exit session">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* ─── Pill bar ────────────────────────────────────────────── */}
      <div className="px-3 lg:px-4 py-2 bg-white border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto">
          <PanelPillBar layout={layout} onChange={setLayout} compact />
          <div className="flex-1 min-w-0" />
          <Button variant="ghost" size="sm" onClick={handleSkip} className="shrink-0">
            <SkipForward className="h-3.5 w-3.5" />
            Skip
          </Button>
        </div>
      </div>

      {/* ─── 50/30/20 workspace ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 p-3 lg:p-4 overflow-hidden">
        {/* Desktop: 3-zone grid */}
        <div className="hidden xl:grid grid-cols-10 gap-3 lg:gap-4 h-full">
          <ZoneSlot zone="A" panel={layout.A} role={role} candidate={currentCandidate} />
          <ZoneSlot zone="B" panel={layout.B} role={role} candidate={currentCandidate} />
          <ZoneSlot zone="C" panel={layout.C} role={role} candidate={currentCandidate} />
        </div>

        {/* Tablet/mobile: A full-width, B+C stacked */}
        <div className="xl:hidden flex flex-col gap-3 h-full">
          <div className="flex-[1.6] min-h-0">
            <ZoneSlot zone="A" panel={layout.A} role={role} candidate={currentCandidate} fullWidth />
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            <ZoneSlot zone="B" panel={layout.B} role={role} candidate={currentCandidate} fullWidth />
            <ZoneSlot zone="C" panel={layout.C} role={role} candidate={currentCandidate} fullWidth />
          </div>
        </div>
      </div>

      {/* ─── Queue strip (desktop) ──────────────────────────────── */}
      <div className="hidden lg:block px-3 lg:px-4 pb-2 shrink-0">
        <QueueStrip queue={initialQueue} currentIndex={currentIndex} completedDispositions={completedDispositions} />
      </div>

      {/* ─── Call control bar ────────────────────────────────────── */}
      <div className="px-3 lg:px-4 pb-3 lg:pb-4 shrink-0">
        <CallControlBar
          candidateName={currentCandidate.name}
          candidatePhone={currentCandidate.phone}
          callStatus={callStatus}
          onEndCall={handleEndCall}
          onVoicemailDrop={handleVoicemailDrop}
        />
      </div>

      {/* ─── Floating Notes shortcut (when Notes is not in any zone) ─ */}
      {layout.A !== "notes" && layout.B !== "notes" && layout.C !== "notes" && (
        <Sheet open={showNotesSheet} onOpenChange={setShowNotesSheet}>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-24 right-4 lg:right-6 z-40 h-12 w-12 rounded-pill bg-cosmic text-white shadow-3 flex items-center justify-center hover:scale-105 transition-transform focus-ring"
              aria-label="Open notes"
            >
              <PenLine className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notes for {currentCandidate.name}</SheetTitle>
            </SheetHeader>
            <div className="p-6 h-[calc(100%-80px)]">
              <NotesPanel candidate={currentCandidate} role={role} zoneSize="A" />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* ─── Disposition modal ──────────────────────────────────── */}
      <DispositionModal
        open={showDispositionModal}
        candidate={currentCandidate}
        durationSec={callDuration}
        onSubmit={handleDispositionSubmit}
      />
    </div>
  );
}

function ZoneSlot({
  zone, panel, role, candidate, fullWidth,
}: {
  zone: Zone;
  panel: keyof typeof PANEL_COMPONENTS;
  role: any;
  candidate: any;
  fullWidth?: boolean;
}) {
  const cols = zone === "A" ? "col-span-5" : zone === "B" ? "col-span-3" : "col-span-2";
  const Component = PANEL_COMPONENTS[panel];

  return (
    <div className={cn(!fullWidth && cols, "min-h-0 h-full")}>
      <Component candidate={candidate} role={role} zoneSize={zone} />
    </div>
  );
}

function SessionEmpty({ onExit }: { onExit: () => void }) {
  return (
    <div className="h-screen w-full bg-mist flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-border shadow-2 p-8 max-w-md text-center">
        <h3 className="mb-2">No candidates in queue</h3>
        <p className="text-muted-fg t-body-medium mb-5">
          Build a queue from the Auto Dialer page to get started.
        </p>
        <Button onClick={onExit}>Back to dialer</Button>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/dialer-summary.tsx
==============================================================================
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Sparkles, RotateCcw, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DialerSummaryPage() {
  const navigate = useNavigate();

  const stats = {
    callsMade: 8,
    connected: 5,
    voicemails: 3,
    shortlisted: 2,
    callbacks: 1,
    onHold: 1,
    rejected: 1,
    durationMin: 64,
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[800px] mx-auto">
      {/* Hero */}
      <div className="text-center py-6 mb-5">
        <div className="h-16 w-16 rounded-pill bg-success-soft mx-auto mb-3 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-success-ink" />
        </div>
        <h1 className="mb-2">Session complete</h1>
        <p className="text-muted-fg t-body-large">
          Great pace today — {stats.shortlisted} candidate{stats.shortlisted === 1 ? "" : "s"} advanced to onsite.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <SummaryStat label="Calls made" value={stats.callsMade} />
        <SummaryStat label="Connected" value={stats.connected} percent={Math.round((stats.connected / stats.callsMade) * 100)} />
        <SummaryStat label="Shortlisted" value={stats.shortlisted} highlight />
        <SummaryStat label="Duration" value={`${stats.durationMin}m`} />
      </div>

      {/* Disposition breakdown */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <div className="t-label-large text-cosmic mb-3">Outcomes</div>
          <div className="space-y-2">
            <OutcomeRow label="Shortlisted · advanced" count={stats.shortlisted} variant="success" />
            <OutcomeRow label="Callback scheduled" count={stats.callbacks} variant="info" />
            <OutcomeRow label="On hold" count={stats.onHold} variant="warning" />
            <OutcomeRow label="Rejected" count={stats.rejected} variant="danger" />
            <OutcomeRow label="Voicemail dropped" count={stats.voicemails} variant="neutral" />
          </div>
        </CardContent>
      </Card>

      {/* LEO recap */}
      <div className="leo-gradient rounded-xl p-5 text-white mb-5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <div className="t-label-large mb-1">LEO recap</div>
            <p className="t-body-medium text-white/90 leading-relaxed">
              You connected with 62% of dialled candidates today — 4 points above your average. Best window remained Tuesday 10–12. Two of three voicemails went to candidates outside the prime window — try shifting their next attempt to tomorrow morning.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button variant="outline" size="lg" onClick={() => navigate("/dialer")}>
          <RotateCcw className="h-4 w-4" /> Start another queue
        </Button>
        <Button size="lg" onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" /> Back to dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, percent, highlight }: { label: string; value: number | string; percent?: number; highlight?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`t-headline-medium tabular-nums leading-none ${highlight ? "text-success-ink" : "text-cosmic"}`}>
          {value}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="t-body-small text-muted-fg">{label}</span>
          {percent !== undefined && <span className="t-label-small text-muted-fg tabular-nums">{percent}%</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function OutcomeRow({ label, count, variant }: {
  label: string;
  count: number;
  variant: "success" | "info" | "warning" | "danger" | "neutral";
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="t-body-medium text-dark">{label}</span>
      <Badge variant={variant} size="sm">{count}</Badge>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/App.tsx
==============================================================================
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/connx/page-placeholder";
import DashboardPage from "@/pages/recruiter/dashboard";
import RolesPage from "@/pages/recruiter/roles";
import RoleDetailPage from "@/pages/recruiter/role-detail";
import ConsentCenterPage from "@/pages/recruiter/consent-center";
import TemplatesPage from "@/pages/recruiter/templates";
import DialerQueuePage from "@/pages/recruiter/dialer-queue";
import DialerCustomisePage from "@/pages/recruiter/dialer-customise";
import DialerSessionPage from "@/pages/recruiter/dialer-session";
import DialerSummaryPage from "@/pages/recruiter/dialer-summary";

const router = createBrowserRouter([
  // ─── Active call session bypasses the AppShell (focus mode) ───
  { path: "/dialer/session", element: <DialerSessionPage /> },

  // ─── Everything else uses the AppShell ─────────────────────────
  {
    path: "/",
    element: <AppShell />,
    children: [
      // Recruiter
      { index: true, element: <DashboardPage /> },
      { path: "roles", element: <RolesPage /> },
      { path: "roles/:roleId", element: <RoleDetailPage /> },
      { path: "consent", element: <ConsentCenterPage /> },
      { path: "dialer", element: <DialerQueuePage /> },
      { path: "dialer/customise", element: <DialerCustomisePage /> },
      { path: "dialer/summary", element: <DialerSummaryPage /> },
      { path: "bulk", element: <PagePlaceholder title="Bulk communication" description="SMS, email, and WhatsApp campaigns. Ships in Pass 5." /> },
      { path: "timeline", element: <PagePlaceholder title="Candidate timeline" description="Ships in Pass 5." /> },
      { path: "candidates/:id", element: <PagePlaceholder title="Candidate profile" description="Ships in Pass 5." /> },
      { path: "templates", element: <TemplatesPage /> },

      // Hiring Manager (Pass 6)
      { path: "hm", element: <PagePlaceholder title="Pipeline" description="Ships in Pass 6." /> },
      { path: "hm/candidates/:id", element: <PagePlaceholder title="Candidate review" /> },
      { path: "hm/approvals", element: <PagePlaceholder title="Approvals queue" /> },
      { path: "hm/digest", element: <PagePlaceholder title="Daily digest" /> },

      // Recruitment Lead (Pass 7)
      { path: "lead", element: <PagePlaceholder title="Team analytics" description="Ships in Pass 7." /> },
      { path: "lead/leaderboard", element: <PagePlaceholder title="Leaderboard" /> },
      { path: "lead/goals", element: <PagePlaceholder title="Goals & SLAs" /> },
      { path: "lead/team", element: <PagePlaceholder title="Team members" /> },

      // Shared (Pass 8)
      { path: "settings", element: <PagePlaceholder title="Settings" description="Ships in Pass 8." /> },
      { path: "integrations", element: <PagePlaceholder title="Integrations" /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
<<< END FILE