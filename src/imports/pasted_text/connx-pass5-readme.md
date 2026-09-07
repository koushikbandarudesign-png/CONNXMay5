==============================================================================
CONNX — Build Pass 5 (Bulk Communication + Candidate Timeline)
==============================================================================

This bundle contains 12 files for Pass 5.

INSTALLATION:
  1. You should already have Pass 1 + Pass 2 + Pass 3 + Pass 4 in your Make project.
  2. Add the 10 new files at the paths shown.
  3. REPLACE src/App.tsx with the version below.
  4. No config or dependency changes needed.

==============================================================================
>>> FILE: README.md
==============================================================================
# CONNX — Build Pass 5

Bulk Communication composer + the unified Candidate Timeline. Two more recruiter surfaces, fully built — and the candidate profile page that links every previous surface back to the candidate's full story.

## What's in Pass 5

**11 files total** — 1 mock data file, 5 bulk components, 1 timeline event renderer, 3 pages, 1 router update.

### New files
```
src/data/comms-mock.ts                              # Campaigns, segments, timeline events
src/components/bulk/channel-picker.tsx              # SMS / Email / WhatsApp tile picker
src/components/bulk/segment-picker.tsx              # Audience picker with system + custom segments
src/components/bulk/message-composer.tsx            # Composer + live preview with merge fields
src/components/bulk/send-confirm-modal.tsx          # Two-step send with compliance checks
src/components/bulk/campaigns-list.tsx              # Campaigns history with per-campaign analytics
src/components/timeline/event-card.tsx              # Event renderer for all 9 event types
src/pages/recruiter/bulk.tsx                        # Compose + Campaigns tabs
src/pages/recruiter/timeline.tsx                    # Cross-candidate activity feed
src/pages/recruiter/candidate-profile.tsx           # Per-candidate hero + chronological timeline + sidebar
```

### Replaced file
```
src/App.tsx                                         # Wires bulk, timeline, and candidate routes
```

## How to install on top of Pass 1–4

1. Add the 10 new files at the paths shown.
2. Replace `src/App.tsx` with the new version.
3. No config or dependency changes — Pass 1 already includes Sonner toasts and all needed Radix packages.

## What you'll see

### Bulk Communication (`/bulk`)

**Compose tab — 4-step composer in the left column:**
1. **Pick a channel** — SMS / Email / WhatsApp tile cards with descriptions and "when to use" hints
2. **Choose audience** — segment picker showing system segments (Pending consent · 48h+, Expired consent, etc.) and custom segments. Each tagged "Dynamic" if recalculated at send time.
3. **Write the message** — composer with merge field dropdown that inserts `{{firstName}}` etc. at cursor position. Subject field for email. Live char + segment count for SMS.
4. **Send or schedule** — Save draft / Schedule / Send to N

**Right column (sticky):**
- Live preview that resolves merge fields against any candidate (dropdown to switch). SMS renders as a phone bubble. Email as a from/to/subject card. WhatsApp distinct from SMS visually.
- Summary card with channel, recipients, send timing
- Estimated outcomes block (delivered / opened / replied with %)

**Send confirm modal** — explicit two-step. Shows summary, compliance check (DNC + GDPR), and a warning if sending to >25 immediately ("Consider scheduling for the prime engagement window"). The "Schedule for prime window" suggestion is a smart secondary CTA.

**Campaigns tab:**
- 4-stat strip: Campaigns sent / Recipients / Open rate / Reply rate (each with delta vs avg)
- Filterable list with channel + status filters
- Per-campaign row shows: name, status badge, segment, recipients, **inline analytics** (delivered/opened/clicked/replied/bounced) for completed campaigns; scheduled time for scheduled campaigns
- Hover reveals "View report" + 3-dot menu

### Activity Timeline (`/timeline`)
- Cross-candidate chronological feed of every interaction
- Filter by activity type (calls / messages / consent / notes / LEO summaries)
- Filter by role
- Each row: type icon, candidate avatar, candidate name + activity badge + role, content (clamped to 2 lines), timestamp + actor
- Click any row to jump to that candidate's full profile

### Candidate Profile (`/candidates/:id`) — **the crucial linking surface**

Two-column layout:

**Left column (main):**
- Hero card: avatar, name, current role/company, consent + stage badges, location + source
- Header CTAs: Call now (only if consented), SMS, Email, plus a 3-dot menu with Schedule callback / Add to queue / Match to other roles / Mark on hold / Reject
- Inline note composer that appears collapsed and expands into a Save/Cancel form when typing
- Activity timeline with filter tabs: All / Calls / Messages / Notes / Consent
- Vertical rail with circular icons per event type
- 9 distinct event card layouts:
  - **Call** — bordered card with disposition badge, duration, "Play recording" button
  - **Voicemail** — quantum-purple icon, simple text card
  - **SMS (outbound)** — Stellar bubble aligned left
  - **SMS (inbound)** — Success-soft bubble aligned right (chat-app feel)
  - **Email** — subject as bold line, body in mist block, "Opened" badge with timestamp
  - **Consent (sent / accepted / declined)** — semantic-colored cards
  - **Stage change** — visual "from → to" badge
  - **Note** — warning-soft block (sticky-note feel)
  - **LEO summary** — full gradient surface, distinct from everything else

**Right column (sticky sidebar):**
- Contact card with copy buttons
- "Calling about" card with role context, JD summary, link to role
- Resume snapshot (summary + skills, "+N" overflow)
- LEO snapshot in gradient if AI summary exists

## Design moves I made

1. **Bulk's "send" is a deliberate two-step.** No accidental sends to 50 candidates. The confirm modal shows the summary, the compliance check, and contextually offers to schedule for the prime engagement window if the recipient count is high. Recruiters will appreciate that LEO is on their side here, not silently sending blindly.

2. **Segments distinguish dynamic vs static visibly.** Dynamic segments (recalculated each send) get a Zap icon and an "Auto-updated" hint; static get the ListFilter icon. This matters because a recruiter editing a draft tomorrow needs to know whether the audience is the same 14 people from yesterday or a fresh recalc.

3. **The candidate profile is the navigational hub.** Every other surface — dashboard action plan, role detail, consent center, timeline, campaign report — links here. So this page has to do double duty: be both a snapshot (sidebar) and a story (timeline). The two-column layout splits those roles cleanly.

4. **SMS bubbles directionally signal who's talking.** Outbound left-aligned in stellar tint, inbound right-aligned in success tint, mimicking iMessage / WhatsApp. This drops the cognitive load of "wait, who said this?" to zero.

5. **LEO summaries get the gradient surface in the timeline too.** They're auto-generated, AI-distinguished events. When the recruiter scans a 30-event timeline, they should be able to spot the LEO summaries without reading — just by texture. That's why these get the full gradient instead of just an icon color.

6. **Notes are a sticky-note color (warning-soft).** They're recruiter-authored, not system-generated. The warm yellow tint distinguishes them from the otherwise cool palette without needing a label.

7. **The cross-candidate timeline is actually useful for end-of-day catch-up.** It's one screen where the recruiter can see "what happened across all my candidates today" without 12 tabs. Filter by activity type and you get a compliance audit. Filter by role and you get a role-specific health check.

## What's next (Pass 6)

Hiring Manager portal — pipeline view, candidate review with AI-summary cards, approvals queue, and daily digest. The HM persona is already in the persona switcher; Pass 6 wires up everything they actually need to do their job in CONNX. After that, Pass 7 builds the Recruitment Lead surfaces, then Pass 8 wraps with Settings + Integrations.
<<< END FILE

==============================================================================
>>> FILE: src/data/comms-mock.ts
==============================================================================
import type { Candidate, TimelineEvent } from "@/types";
import { CANDIDATES } from "@/data/mock";

// ─── Bulk campaigns ──────────────────────────────────────────────
export type CampaignChannel = "sms" | "email" | "whatsapp";
export type CampaignStatus = "draft" | "scheduled" | "sending" | "completed" | "failed";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  templateId?: string;
  segment: string;
  recipients: number;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  // Analytics
  delivered?: number;
  opened?: number;
  clicked?: number;
  replied?: number;
  bounced?: number;
  optedOut?: number;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "48h consent reminder · Senior Backend Engineer",
    channel: "sms",
    status: "completed",
    segment: "Pending consent · 48h+",
    recipients: 8,
    createdAt: "Today, 9:00 AM",
    sentAt: "Today, 9:01 AM",
    delivered: 8, opened: 0, clicked: 5, replied: 3, bounced: 0, optedOut: 0,
  },
  {
    id: "camp-2",
    name: "Q4 Engineering opportunities digest",
    channel: "email",
    status: "completed",
    segment: "All consented · last 30 days",
    recipients: 47,
    createdAt: "Yesterday, 4:30 PM",
    sentAt: "Yesterday, 5:00 PM",
    delivered: 46, opened: 31, clicked: 18, replied: 4, bounced: 1, optedOut: 0,
  },
  {
    id: "camp-3",
    name: "Re-engagement · expired consents",
    channel: "email",
    status: "scheduled",
    segment: "Expired consent · last 90 days",
    recipients: 23,
    createdAt: "Today, 11:30 AM",
    scheduledFor: "Tomorrow, 9:00 AM",
  },
  {
    id: "camp-4",
    name: "Designer pipeline · open roles",
    channel: "email",
    status: "draft",
    segment: "Design candidates · all stages",
    recipients: 18,
    createdAt: "2 days ago, 2:14 PM",
  },
  {
    id: "camp-5",
    name: "Interview prep · advanced candidates",
    channel: "sms",
    status: "completed",
    segment: "Advanced stage · all roles",
    recipients: 12,
    createdAt: "Mon, 10:30 AM",
    sentAt: "Mon, 10:31 AM",
    delivered: 12, opened: 0, clicked: 9, replied: 7, bounced: 0, optedOut: 0,
  },
];

// ─── Segments ──────────────────────────────────────────────────────
export interface Segment {
  id: string;
  name: string;
  description: string;
  candidateCount: number;
  isDynamic: boolean; // dynamic = recalculated each time, static = fixed list
  isSystem?: boolean; // system-defined, can't edit
}

export const SEGMENTS: Segment[] = [
  { id: "seg-1", name: "Pending consent · 48h+",  description: "Candidates who haven't responded to consent in 48 hours",  candidateCount: 14, isDynamic: true,  isSystem: true },
  { id: "seg-2", name: "Pending consent · 72h+",  description: "Candidates who haven't responded to consent in 72 hours",  candidateCount: 8,  isDynamic: true,  isSystem: true },
  { id: "seg-3", name: "Expired consent",          description: "Consents that lapsed without a response — eligible for re-consent", candidateCount: 23, isDynamic: true, isSystem: true },
  { id: "seg-4", name: "Consented but uncalled",   description: "Accepted consent but no screening call yet",            candidateCount: 17, isDynamic: true, isSystem: true },
  { id: "seg-5", name: "Advanced · all roles",     description: "All candidates currently advanced to onsite or beyond", candidateCount: 12, isDynamic: true, isSystem: true },
  { id: "seg-6", name: "Senior Backend Engineer · all stages", description: "Every candidate touching this role",        candidateCount: 24, isDynamic: true },
  { id: "seg-7", name: "Tech leadership pipeline · Q4", description: "Custom segment for the engineering leadership push", candidateCount: 31, isDynamic: false },
];

// ─── Timeline events ───────────────────────────────────────────────
export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "te-1",
    candidateId: "cand-1003",
    type: "ai-summary" as any,
    at: "Today, 11:24 AM",
    by: "LEO",
    content: "Strong fundamentals in distributed systems and Go. Communicates clearly, asked thoughtful questions about team structure and on-call expectations. Comp expectation: $215k base. Earliest start: 4 weeks. Recommend advance to onsite.",
  },
  {
    id: "te-2",
    candidateId: "cand-1003",
    type: "call",
    at: "Today, 11:08 AM",
    by: "Jordan Chen",
    content: "Screening call · 24 minutes",
    meta: { duration: 1440, disposition: "shortlisted", recordingAvailable: true },
  },
  {
    id: "te-3",
    candidateId: "cand-1003",
    type: "note",
    at: "Today, 11:32 AM",
    by: "Jordan Chen",
    content: "Strong yes on technical depth. Asked great questions about reliability ownership model. Send to Priya for onsite scheduling — earliest availability week of the 18th.",
  },
  {
    id: "te-4",
    candidateId: "cand-1003",
    type: "sms",
    at: "Today, 8:42 AM",
    by: "Owen Walsh",
    content: "YES",
    meta: { direction: "inbound" },
  },
  {
    id: "te-5",
    candidateId: "cand-1003",
    type: "consent-accepted",
    at: "Today, 8:42 AM",
    content: "Accepted consent via SMS reply. IP: 73.142.18.91",
  },
  {
    id: "te-6",
    candidateId: "cand-1003",
    type: "sms",
    at: "Today, 9:14 AM",
    by: "CONNX (auto)",
    content: "Hi Owen, this is Jordan from Northwind Labs. We're interested in speaking with you about the Senior Backend Engineer role. Would you be open to a brief screening call? Reply YES to consent, or visit northwind.connx.app/c/k7Yh2 to choose a time. Reply STOP to opt out.",
    meta: { direction: "outbound", template: "Initial consent request" },
  },
  {
    id: "te-7",
    candidateId: "cand-1003",
    type: "email",
    at: "Today, 9:14 AM",
    by: "CONNX (auto)",
    content: "Quick question about the Senior Backend Engineer role at Northwind Labs",
    meta: { direction: "outbound", subject: "Quick question about the Senior Backend Engineer role at Northwind Labs", opened: true, openedAt: "Today, 9:31 AM" },
  },
  {
    id: "te-8",
    candidateId: "cand-1003",
    type: "stage-change",
    at: "Today, 9:14 AM",
    by: "Priya Raman (HM)",
    content: "Shortlisted from Workday · matched 92% on JD criteria",
    meta: { from: "applicant", to: "shortlisted" },
  },
];

// Get timeline for a candidate (with deterministic generation for any candidate)
export function getTimelineForCandidate(candidateId: string): TimelineEvent[] {
  // For Owen Walsh (cand-1003) we have curated events; for others, generate generic ones
  if (candidateId === "cand-1003") return TIMELINE_EVENTS;

  const candidate = CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return [];

  const events: TimelineEvent[] = [];
  // Stage change at shortlist
  events.push({
    id: `${candidateId}-stage`,
    candidateId,
    type: "stage-change",
    at: "9 days ago, 2:31 PM",
    by: "ATS sync",
    content: `Shortlisted from ${candidate.source}`,
  });
  // Consent sent
  events.push({
    id: `${candidateId}-consent-sms`,
    candidateId,
    type: "sms",
    at: "9 days ago, 2:32 PM",
    by: "CONNX (auto)",
    content: "Initial consent SMS sent",
    meta: { direction: "outbound" },
  });
  events.push({
    id: `${candidateId}-consent-email`,
    candidateId,
    type: "email",
    at: "9 days ago, 2:32 PM",
    by: "CONNX (auto)",
    content: "Initial consent email sent",
    meta: { direction: "outbound", opened: true },
  });

  if (candidate.consentStatus === "accepted") {
    events.push({
      id: `${candidateId}-accepted`,
      candidateId,
      type: "consent-accepted",
      at: "8 days ago, 11:14 AM",
      content: "Accepted consent via SMS",
    });
  } else if (candidate.consentStatus === "declined") {
    events.push({
      id: `${candidateId}-declined`,
      candidateId,
      type: "consent-declined",
      at: "7 days ago, 4:21 PM",
      content: "Declined consent via SMS reply STOP",
    });
  }

  if (candidate.lastDisposition === "shortlisted" || candidate.lastDisposition === "rejected") {
    events.push({
      id: `${candidateId}-call`,
      candidateId,
      type: "call",
      at: "3 days ago, 10:22 AM",
      by: "Jordan Chen",
      content: `Screening call · ${candidate.lastDisposition === "shortlisted" ? "advanced" : "rejected"}`,
      meta: { duration: 1320, disposition: candidate.lastDisposition },
    });
  }

  return events.reverse(); // newest first
}
<<< END FILE

==============================================================================
>>> FILE: src/components/bulk/channel-picker.tsx
==============================================================================
import { MessageSquareText, Mail, MessageCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignChannel } from "@/data/comms-mock";

interface ChannelPickerProps {
  value: CampaignChannel;
  onChange: (v: CampaignChannel) => void;
}

const CHANNELS: { key: CampaignChannel; label: string; icon: React.ComponentType<{ className?: string }>; desc: string; whenToUse: string; comingSoon?: boolean }[] = [
  { key: "sms", label: "SMS", icon: MessageSquareText, desc: "Direct, immediate, high-response", whenToUse: "Reminders, callbacks, time-sensitive" },
  { key: "email", label: "Email", icon: Mail, desc: "Branded, detailed, trackable", whenToUse: "Initial outreach, role digests, formal updates" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, desc: "Conversational, region-specific", whenToUse: "APAC and EMEA candidates" },
];

export function ChannelPicker({ value, onChange }: ChannelPickerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {CHANNELS.map((c) => {
        const Icon = c.icon;
        const active = value === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={cn(
              "text-left p-3 rounded-lg border transition-all focus-ring",
              active
                ? "border-stellar bg-stellar-50 ring-2 ring-stellar/20 shadow-1"
                : "border-border bg-white hover:border-stellar/30 hover:bg-mist"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", active ? "bg-stellar text-white" : "bg-mist text-stellar")}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {active && (
                <div className="h-5 w-5 rounded-pill bg-stellar text-white flex items-center justify-center">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="t-label-large text-dark mb-0.5">{c.label}</div>
            <p className="t-body-small text-muted-fg leading-snug mb-2">{c.desc}</p>
            <Badge variant="outline" size="sm" className="t-label-small">{c.whenToUse}</Badge>
          </button>
        );
      })}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/bulk/segment-picker.tsx
==============================================================================
import { useState } from "react";
import { ChevronDown, Users, Zap, Plus, Filter, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverTrigger, PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEGMENTS } from "@/data/comms-mock";
import { cn } from "@/lib/utils";
import type { Segment } from "@/data/comms-mock";

interface SegmentPickerProps {
  value: string;
  onChange: (segmentId: string) => void;
}

export function SegmentPicker({ value, onChange }: SegmentPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = SEGMENTS.find((s) => s.id === value);
  const filtered = SEGMENTS.filter((s) =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-border-strong bg-white hover:border-stellar/40 transition-colors focus-ring">
          {selected ? (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 rounded-md bg-stellar-50 text-stellar flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="t-label-large text-dark truncate">{selected.name}</div>
                <div className="t-body-small text-muted-fg truncate">{selected.description}</div>
              </div>
              <Badge variant="info" size="sm" className="shrink-0">
                {selected.candidateCount} {selected.candidateCount === 1 ? "candidate" : "candidates"}
              </Badge>
            </div>
          ) : (
            <span className="t-body-medium text-muted">Select a segment…</span>
          )}
          <ChevronDown className="h-4 w-4 text-muted shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[440px] p-0">
        {/* Search */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <Input
              placeholder="Search segments…" value={query} onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-8 text-[13px]"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-1">
            <div className="px-2 py-1 t-label-small text-muted-fg">System segments · auto-updated</div>
            {filtered.filter((s) => s.isSystem).map((s) => (
              <SegmentRow key={s.id} segment={s} active={s.id === value} onClick={() => { onChange(s.id); setOpen(false); }} />
            ))}

            <div className="px-2 py-1 mt-2 t-label-small text-muted-fg">Custom segments</div>
            {filtered.filter((s) => !s.isSystem).map((s) => (
              <SegmentRow key={s.id} segment={s} active={s.id === value} onClick={() => { onChange(s.id); setOpen(false); }} />
            ))}

            <div className="border-t border-border mt-2 pt-2">
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-mist transition-colors t-body-medium text-stellar">
                <Plus className="h-3.5 w-3.5" />
                Create new segment
              </button>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function SegmentRow({ segment: s, active, onClick }: { segment: Segment; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-2.5 p-2 rounded-md transition-colors text-left",
        active ? "bg-stellar-50" : "hover:bg-mist"
      )}
    >
      <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5", s.isDynamic ? "bg-stellar-50 text-stellar" : "bg-mist text-quantum")}>
        {s.isDynamic ? <Zap className="h-3.5 w-3.5" /> : <ListFilter className="h-3.5 w-3.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("t-label-large", active ? "text-stellar-700" : "text-dark")}>{s.name}</span>
          {s.isDynamic && (
            <Badge variant="info" size="sm" className="t-label-small">Dynamic</Badge>
          )}
        </div>
        <div className="t-body-small text-muted-fg leading-snug">{s.description}</div>
      </div>
      <Badge variant="outline" size="sm" className="shrink-0">{s.candidateCount}</Badge>
    </button>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/bulk/message-composer.tsx
==============================================================================
import { useState, useRef } from "react";
import {
  Type, AtSign, Hash, Calendar as CalendarIcon, Link2, Eye,
  RefreshCcw, ChevronDown, Briefcase, MapPin, Phone, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { CANDIDATES, CURRENT_RECRUITER, ORG } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { CampaignChannel } from "@/data/comms-mock";

interface MessageComposerProps {
  channel: CampaignChannel;
  subject: string;
  setSubject: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
}

const MERGE_FIELDS = [
  { key: "firstName",          label: "First name",          icon: Type },
  { key: "candidateFullName",  label: "Full name",           icon: Type },
  { key: "currentCompany",     label: "Current company",     icon: Briefcase },
  { key: "currentRole",        label: "Current role",        icon: Briefcase },
  { key: "location",           label: "Location",            icon: MapPin },
  { key: "phone",              label: "Phone",               icon: Phone },
  { key: "email",              label: "Email",               icon: Mail },
  { key: "roleTitle",          label: "Role title",          icon: Briefcase },
  { key: "orgName",            label: "Organisation name",   icon: AtSign },
  { key: "recruiterFirstName", label: "Recruiter first name", icon: AtSign },
  { key: "consentLink",        label: "Consent link",        icon: Link2 },
  { key: "callbackTime",       label: "Callback time",       icon: CalendarIcon },
];

export function MessageComposer({ channel, subject, setSubject, body, setBody }: MessageComposerProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const insertMerge = (field: string, target: "subject" | "body") => {
    const merge = `{{${field}}}`;
    if (target === "subject") {
      const el = subjectRef.current;
      if (!el) return;
      const start = el.selectionStart || subject.length;
      const next = subject.slice(0, start) + merge + subject.slice(el.selectionEnd || start);
      setSubject(next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + merge.length, start + merge.length); });
    } else {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.selectionStart || body.length;
      const next = body.slice(0, start) + merge + body.slice(el.selectionEnd || start);
      setBody(next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + merge.length, start + merge.length); });
    }
  };

  const charCount = body.length;
  const segmentCount = Math.max(1, Math.ceil(charCount / 160));

  return (
    <div className="space-y-3">
      {channel === "email" && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="subject">Subject</Label>
            <MergeFieldButton onSelect={(f) => insertMerge(f, "subject")} />
          </div>
          <Input
            id="subject"
            ref={subjectRef}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Quick question about the {{roleTitle}} role at {{orgName}}"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="body">Message</Label>
          <div className="flex items-center gap-2">
            {channel === "sms" && (
              <Badge variant="outline" size="sm" className="t-label-small tabular-nums">
                {charCount} chars · {segmentCount} {segmentCount === 1 ? "segment" : "segments"}
              </Badge>
            )}
            <MergeFieldButton onSelect={(f) => insertMerge(f, "body")} />
          </div>
        </div>
        <Textarea
          id="body"
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            channel === "sms"
              ? "Hi {{firstName}}, this is {{recruiterFirstName}} from {{orgName}}…"
              : channel === "whatsapp"
              ? "Hi {{firstName}}, following up about the {{roleTitle}} role…"
              : "Hi {{firstName}},\n\nI wanted to follow up about the {{roleTitle}} role at {{orgName}}…"
          }
          className={cn(
            "resize-y",
            channel === "email" ? "min-h-[200px]" : "min-h-[120px]"
          )}
        />
      </div>

      {channel === "sms" && segmentCount > 1 && (
        <p className="t-body-small text-warning-ink flex items-center gap-1.5">
          ⚠ Message exceeds one SMS segment. Cost is per segment per recipient.
        </p>
      )}
    </div>
  );
}

function MergeFieldButton({ onSelect }: { onSelect: (field: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-7 px-2">
          <Hash className="h-3 w-3" />
          Insert merge field
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Merge fields</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MERGE_FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <DropdownMenuItem key={f.key} onSelect={() => onSelect(f.key)}>
              <Icon className="h-3.5 w-3.5 text-muted-fg" />
              <span className="flex-1">{f.label}</span>
              <span className="t-label-small text-muted">{`{{${f.key}}}`}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Live preview ─────────────────────────────────────────────────
export function MessagePreview({
  channel, subject, body, previewCandidateId, onCandidateChange, allCandidates,
}: {
  channel: CampaignChannel;
  subject: string;
  body: string;
  previewCandidateId: string;
  onCandidateChange: (id: string) => void;
  allCandidates: typeof CANDIDATES;
}) {
  const candidate = allCandidates.find((c) => c.id === previewCandidateId) || allCandidates[0];

  const resolve = (text: string): React.ReactNode => {
    if (!candidate) return text;
    const map: Record<string, string> = {
      firstName: candidate.name.split(" ")[0],
      candidateFullName: candidate.name,
      currentCompany: candidate.currentCompany,
      currentRole: candidate.currentRole,
      location: candidate.location,
      phone: candidate.phone,
      email: candidate.email,
      orgName: ORG.name,
      recruiterFirstName: CURRENT_RECRUITER.name.split(" ")[0],
      roleTitle: "Senior Backend Engineer",
      consentLink: "northwind.connx.app/c/k7Yh2",
      callbackTime: "Tuesday at 2:00 PM",
    };
    const parts = text.split(/(\{\{\w+\}\})/g);
    return parts.map((p, i) => {
      const m = p.match(/^\{\{(\w+)\}\}$/);
      if (!m) return <span key={i}>{p}</span>;
      const v = map[m[1]];
      if (v) return <span key={i}>{v}</span>;
      return <span key={i} className="bg-warning-soft text-warning-ink px-1 rounded-sm">{p}</span>;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-stellar" />
          <span className="t-label-large text-cosmic">Preview</span>
        </div>
        <Select value={previewCandidateId} onValueChange={onCandidateChange}>
          <SelectTrigger className="h-8 w-[200px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allCandidates.slice(0, 12).map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {channel === "sms" || channel === "whatsapp" ? (
        <div className="bg-mist rounded-xl p-4">
          <div className="t-label-small text-muted-fg mb-2 flex items-center justify-between">
            <span>To {candidate?.phone}</span>
            <span>{channel === "whatsapp" ? "WhatsApp" : "SMS"}</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 t-body-medium text-dark whitespace-pre-wrap break-words shadow-1">
            {resolve(body || "Your message will appear here…")}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="bg-mist px-3 py-2 border-b border-border flex items-center gap-2">
            <span className="t-label-small text-muted-fg">From:</span>
            <span className="t-body-small">{CURRENT_RECRUITER.name} &lt;{CURRENT_RECRUITER.email}&gt;</span>
          </div>
          <div className="bg-mist px-3 py-2 border-b border-border flex items-center gap-2">
            <span className="t-label-small text-muted-fg">To:</span>
            <span className="t-body-small">{candidate?.email}</span>
          </div>
          {subject && (
            <div className="bg-mist px-3 py-2 border-b border-border">
              <div className="t-label-small text-muted-fg mb-0.5">Subject</div>
              <div className="t-label-large text-cosmic">{resolve(subject)}</div>
            </div>
          )}
          <div className="p-4 t-body-medium text-dark whitespace-pre-wrap break-words leading-relaxed min-h-[120px]">
            {resolve(body || "Your message will appear here…")}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="t-body-small text-muted-fg flex items-center gap-1.5">
          <span className="bg-warning-soft text-warning-ink px-1.5 rounded-sm t-label-small">{"{{merge}}"}</span>
          <span>Unresolved fields will block sending</span>
        </p>
        <Button variant="ghost" size="sm">
          <RefreshCcw className="h-3 w-3" /> Random candidate
        </Button>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/bulk/send-confirm-modal.tsx
==============================================================================
import { Send, AlertTriangle, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CampaignChannel } from "@/data/comms-mock";

interface SendConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mode: "now" | "schedule") => void;
  channel: CampaignChannel;
  recipients: number;
  segmentName: string;
  scheduledFor?: string;
}

export function SendConfirmModal({
  open, onClose, onConfirm, channel, recipients, segmentName, scheduledFor,
}: SendConfirmModalProps) {
  const isScheduled = !!scheduledFor;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isScheduled ? "Schedule send?" : "Ready to send?"}</DialogTitle>
          <DialogDescription>
            {isScheduled
              ? `This message will be sent to ${recipients} candidates at the scheduled time. Once scheduled, you can cancel or edit it before send.`
              : `This message will be sent to ${recipients} candidates immediately. Once sent, this can't be undone.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Summary */}
          <div className="rounded-lg bg-mist p-4 space-y-2">
            <SummaryRow label="Channel" value={channel === "sms" ? "SMS" : channel === "email" ? "Email" : "WhatsApp"} />
            <SummaryRow label="Recipients" value={`${recipients} candidates`} />
            <SummaryRow label="Segment" value={segmentName} />
            {isScheduled && <SummaryRow label="Sending" value={scheduledFor} />}
          </div>

          {/* Compliance */}
          <div className="rounded-lg bg-success-soft border border-success/20 p-3 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-success-ink">Compliance checks passed</div>
              <p className="t-body-small text-success-ink/80">
                Opt-out handling enabled · DNC list checked · GDPR / DPDP / TCPA compliant.
              </p>
            </div>
          </div>

          {/* Warning when sending immediately to many */}
          {!isScheduled && recipients > 25 && (
            <div className="rounded-lg bg-warning-soft border border-warning/20 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
              <div>
                <div className="t-label-large text-warning-ink">Sending to {recipients} candidates immediately</div>
                <p className="t-body-small text-warning-ink/80">
                  Consider scheduling for a prime engagement window (Tue/Wed 10–11 AM) to maximise replies.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {!isScheduled && (
            <Button size="sm" onClick={() => onConfirm("schedule")} variant="outline">
              <CalendarIcon className="h-3.5 w-3.5" />
              Schedule for prime window
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onConfirm(isScheduled ? "schedule" : "now")}
            className="gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {isScheduled ? `Schedule send · ${recipients}` : `Send now · ${recipients}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="t-label-small text-muted-fg">{label}</span>
      <span className="t-label-large text-dark text-right">{value}</span>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/bulk/campaigns-list.tsx
==============================================================================
import { useState, useMemo } from "react";
import {
  Search, MessageSquareText, Mail, MessageCircle, Clock, CheckCircle2,
  Calendar as CalendarIcon, Edit3, Copy, Trash2, MoreHorizontal, ChevronRight,
  TrendingUp, Send, Eye, MousePointer, MailX, BadgeAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { CAMPAIGNS } from "@/data/comms-mock";
import { cn } from "@/lib/utils";
import type { Campaign, CampaignChannel, CampaignStatus } from "@/data/comms-mock";

const CHANNEL_ICON = {
  sms: MessageSquareText,
  email: Mail,
  whatsapp: MessageCircle,
} as const;

const STATUS_CFG = {
  draft: { variant: "neutral" as const, icon: Edit3, label: "Draft" },
  scheduled: { variant: "info" as const, icon: Clock, label: "Scheduled" },
  sending: { variant: "warning" as const, icon: Send, label: "Sending" },
  completed: { variant: "success" as const, icon: CheckCircle2, label: "Sent" },
  failed: { variant: "danger" as const, icon: BadgeAlert, label: "Failed" },
};

export function CampaignsList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<CampaignChannel | "all">("all");

  const filtered = useMemo(() => {
    let out = CAMPAIGNS;
    if (statusFilter !== "all") out = out.filter((c) => c.status === statusFilter);
    if (channelFilter !== "all") out = out.filter((c) => c.channel === channelFilter);
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((c) => c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q));
    }
    return out;
  }, [query, statusFilter, channelFilter]);

  const stats = useMemo(() => {
    const completed = CAMPAIGNS.filter((c) => c.status === "completed");
    const total = completed.reduce((acc, c) => acc + c.recipients, 0);
    const opened = completed.reduce((acc, c) => acc + (c.opened || 0), 0);
    const replied = completed.reduce((acc, c) => acc + (c.replied || 0), 0);
    return {
      sent: total,
      openRate: total > 0 ? Math.round((opened / total) * 100) : 0,
      replyRate: total > 0 ? Math.round((replied / total) * 100) : 0,
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Campaigns sent" value={CAMPAIGNS.filter((c) => c.status === "completed").length} />
        <Stat label="Recipients reached" value={stats.sent.toLocaleString()} />
        <Stat label="Open rate" value={`${stats.openRate}%`} delta="+8 pts" />
        <Stat label="Reply rate" value={`${stats.replyRate}%`} delta="+3 pts" />
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <Input
              placeholder="Search by campaign name or segment…"
              value={query} onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select value={channelFilter} onValueChange={(v) => setChannelFilter(v as any)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="t-title-medium text-cosmic mb-1">No campaigns yet</div>
            <p className="t-body-medium text-muted-fg">Compose your first campaign to start reaching candidates at scale.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => <CampaignRow key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string | number; delta?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="t-headline-medium text-cosmic tabular-nums leading-none">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="t-body-small text-muted-fg">{label}</span>
          {delta && <Badge variant="success" size="sm" className="gap-0.5"><TrendingUp className="h-2.5 w-2.5" />{delta}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignRow({ campaign: c }: { campaign: Campaign }) {
  const Icon = CHANNEL_ICON[c.channel];
  const statusCfg = STATUS_CFG[c.status];
  const StatusIcon = statusCfg.icon;

  const openRate = c.opened && c.delivered ? Math.round((c.opened / c.delivered) * 100) : null;
  const clickRate = c.clicked && c.delivered ? Math.round((c.clicked / c.delivered) * 100) : null;
  const replyRate = c.replied && c.delivered ? Math.round((c.replied / c.delivered) * 100) : null;

  return (
    <Card className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
            c.status === "completed" ? "bg-success-soft text-success-ink" :
            c.status === "scheduled" ? "bg-stellar-50 text-stellar" :
            c.status === "draft" ? "bg-mist text-muted-fg" :
            "bg-warning-soft text-warning-ink"
          )}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="t-label-large text-dark truncate">{c.name}</span>
              <Badge variant={statusCfg.variant} size="sm" className="gap-1">
                <StatusIcon className="h-2.5 w-2.5" />
                {statusCfg.label}
              </Badge>
            </div>
            <div className="t-body-small text-muted-fg">
              {c.segment} · {c.recipients} recipients · {c.sentAt || c.scheduledFor || c.createdAt}
            </div>

            {/* Analytics row (only for completed) */}
            {c.status === "completed" && (
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Metric icon={Send} label="Delivered" value={`${c.delivered}/${c.recipients}`} />
                {c.channel !== "sms" && openRate !== null && (
                  <Metric icon={Eye} label="Opened" value={`${openRate}%`} highlight={openRate >= 50} />
                )}
                {clickRate !== null && (
                  <Metric icon={MousePointer} label="Clicked" value={`${clickRate}%`} highlight={clickRate >= 30} />
                )}
                {replyRate !== null && (
                  <Metric icon={MessageSquareText} label="Replied" value={`${replyRate}%`} highlight={replyRate >= 25} />
                )}
                {c.bounced ? <Metric icon={MailX} label="Bounced" value={`${c.bounced}`} danger /> : null}
              </div>
            )}

            {c.status === "scheduled" && c.scheduledFor && (
              <div className="flex items-center gap-1.5 mt-2 text-stellar t-label-medium">
                <CalendarIcon className="h-3 w-3" />
                Scheduled for {c.scheduledFor}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {c.status === "completed" && (
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-3.5 w-3.5" /> View report
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label="More actions">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Edit3 className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                <DropdownMenuItem><Copy className="h-3.5 w-3.5" /> Duplicate</DropdownMenuItem>
                <DropdownMenuItem><ChevronRight className="h-3.5 w-3.5" /> View report</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger-ink"><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon, label, value, highlight, danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 t-body-small">
      <Icon className={cn("h-3 w-3", danger ? "text-danger-ink" : highlight ? "text-success-ink" : "text-muted-fg")} />
      <span className="text-muted-fg">{label}</span>
      <span className={cn(
        "font-semibold tabular-nums",
        danger ? "text-danger-ink" : highlight ? "text-success-ink" : "text-cosmic"
      )}>{value}</span>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/timeline/event-card.tsx
==============================================================================
import {
  Phone, MessageSquareText, Mail, ShieldCheck, ShieldX, ShieldAlert,
  PenLine, ArrowRight, Sparkles, Voicemail,
  ArrowDown, ArrowUp, Clock, Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDuration } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

export function TimelineEventCard({ event }: { event: TimelineEvent }) {
  switch (event.type) {
    case "call":           return <CallCard event={event} />;
    case "voicemail":      return <VoicemailCard event={event} />;
    case "sms":            return <MessageCard event={event} kind="sms" />;
    case "email":          return <MessageCard event={event} kind="email" />;
    case "consent-sent":   return <ConsentCard event={event} status="sent" />;
    case "consent-accepted": return <ConsentCard event={event} status="accepted" />;
    case "consent-declined": return <ConsentCard event={event} status="declined" />;
    case "stage-change":   return <StageCard event={event} />;
    case "note":           return <NoteCard event={event} />;
    case "ai-summary" as any: return <AiSummaryCard event={event} />;
    default:               return <NoteCard event={event} />;
  }
}

// ─── Wrapper that gives every card the timeline rail position ────────
function CardWrapper({
  iconBg, icon: Icon, time, by, children,
}: {
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
  time: string;
  by?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 relative">
      {/* Icon circle on rail */}
      <div className={cn("h-8 w-8 rounded-pill flex items-center justify-center shrink-0 relative z-10", iconBg)}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        {children}
        <div className="flex items-center gap-1.5 mt-1.5 t-label-small text-muted">
          <span>{time}</span>
          {by && <><span>·</span><span>{by}</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── Call card ─────────────────────────────────────────────────────
function CallCard({ event }: { event: TimelineEvent }) {
  const { duration, disposition, recordingAvailable } = event.meta || {};
  const dispositionVariant: any =
    disposition === "shortlisted" ? "success" :
    disposition === "rejected" ? "danger" :
    disposition === "callback" ? "info" :
    "warning";

  return (
    <CardWrapper
      iconBg="bg-stellar-50 text-stellar"
      icon={Phone}
      time={event.at}
      by={event.by}
    >
      <div className="bg-white rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="t-label-large text-cosmic">Screening call</span>
          {duration && (
            <Badge size="sm" variant="outline" className="gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatDuration(duration)}
            </Badge>
          )}
          {disposition && (
            <Badge size="sm" variant={dispositionVariant}>
              {disposition === "shortlisted" ? "Advanced" :
               disposition === "callback" ? "Callback scheduled" :
               disposition === "on-hold" ? "On hold" :
               "Rejected"}
            </Badge>
          )}
        </div>
        <p className="t-body-medium text-dark">{event.content}</p>
        {recordingAvailable && (
          <Button variant="ghost" size="sm" className="mt-2 -ml-2 gap-1.5">
            <Play className="h-3 w-3" /> Play recording
          </Button>
        )}
      </div>
    </CardWrapper>
  );
}

// ─── Voicemail card ────────────────────────────────────────────────
function VoicemailCard({ event }: { event: TimelineEvent }) {
  return (
    <CardWrapper
      iconBg="bg-mist text-quantum"
      icon={Voicemail}
      time={event.at}
      by={event.by}
    >
      <div className="bg-white rounded-lg border border-border p-3">
        <div className="t-label-large text-cosmic mb-1">Voicemail dropped</div>
        <p className="t-body-small text-muted-fg">{event.content}</p>
      </div>
    </CardWrapper>
  );
}

// ─── Message (SMS / Email) card ────────────────────────────────────
function MessageCard({ event, kind }: { event: TimelineEvent; kind: "sms" | "email" }) {
  const { direction, subject, opened, openedAt } = event.meta || {};
  const isOutbound = direction === "outbound";
  const Icon = kind === "sms" ? MessageSquareText : Mail;

  return (
    <CardWrapper
      iconBg={isOutbound ? "bg-stellar-50 text-stellar" : "bg-success-soft text-success-ink"}
      icon={Icon}
      time={event.at}
      by={event.by}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isOutbound ? (
            <Badge size="sm" variant="outline" className="gap-1">
              <ArrowUp className="h-2.5 w-2.5" /> Sent {kind === "sms" ? "SMS" : "email"}
            </Badge>
          ) : (
            <Badge size="sm" variant="success" className="gap-1">
              <ArrowDown className="h-2.5 w-2.5" /> Reply received
            </Badge>
          )}
          {opened && <Badge size="sm" variant="neutral">Opened {openedAt}</Badge>}
        </div>

        {subject && (
          <div className="t-label-large text-cosmic">{subject}</div>
        )}

        {/* Message body — bubble style for SMS, plain block for email */}
        {kind === "sms" ? (
          <div className={cn(
            "rounded-2xl px-3.5 py-2 t-body-medium text-dark max-w-[85%]",
            isOutbound ? "bg-stellar-50 rounded-tl-sm" : "bg-success-soft rounded-tr-sm ml-auto"
          )}>
            {event.content}
          </div>
        ) : (
          !subject && <div className="bg-mist rounded-md p-3 t-body-medium text-dark">{event.content}</div>
        )}
      </div>
    </CardWrapper>
  );
}

// ─── Consent card ──────────────────────────────────────────────────
function ConsentCard({ event, status }: { event: TimelineEvent; status: "sent" | "accepted" | "declined" }) {
  const cfg = {
    sent:     { Icon: ShieldAlert,  bg: "bg-mist text-cosmic",        label: "Consent sent",     variant: "neutral" as const },
    accepted: { Icon: ShieldCheck,  bg: "bg-success-soft text-success-ink", label: "Consent accepted", variant: "success" as const },
    declined: { Icon: ShieldX,      bg: "bg-danger-soft text-danger-ink",   label: "Consent declined", variant: "danger" as const },
  }[status];

  return (
    <CardWrapper
      iconBg={cfg.bg}
      icon={cfg.Icon}
      time={event.at}
      by={event.by}
    >
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="t-label-large text-cosmic">{cfg.label}</span>
        <Badge size="sm" variant={cfg.variant}>{status === "sent" ? "Awaiting reply" : status}</Badge>
      </div>
      {event.content && <p className="t-body-small text-muted-fg">{event.content}</p>}
    </CardWrapper>
  );
}

// ─── Stage change card ─────────────────────────────────────────────
function StageCard({ event }: { event: TimelineEvent }) {
  const { from, to } = event.meta || {};
  return (
    <CardWrapper
      iconBg="bg-stellar-50 text-stellar"
      icon={ArrowRight}
      time={event.at}
      by={event.by}
    >
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="t-label-large text-cosmic">Stage updated</span>
        {from && to && (
          <Badge size="sm" variant="info" className="gap-1.5">
            <span className="capitalize">{from}</span>
            <ArrowRight className="h-2.5 w-2.5" />
            <span className="capitalize">{to}</span>
          </Badge>
        )}
      </div>
      <p className="t-body-small text-muted-fg">{event.content}</p>
    </CardWrapper>
  );
}

// ─── Note card ─────────────────────────────────────────────────────
function NoteCard({ event }: { event: TimelineEvent }) {
  return (
    <CardWrapper
      iconBg="bg-mist text-stellar"
      icon={PenLine}
      time={event.at}
      by={event.by}
    >
      <div className="bg-warning-soft/40 border border-warning/20 rounded-lg p-3">
        <div className="t-label-large text-warning-ink mb-1">Note</div>
        <p className="t-body-medium text-dark leading-relaxed whitespace-pre-line">{event.content}</p>
      </div>
    </CardWrapper>
  );
}

// ─── AI summary card ───────────────────────────────────────────────
function AiSummaryCard({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex gap-3 relative">
      <div className="h-8 w-8 rounded-pill flex items-center justify-center shrink-0 relative z-10 leo-gradient">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="leo-gradient text-white rounded-lg p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="t-label-large">LEO summary</span>
            <Badge size="sm" className="bg-white/20 text-white border-0">Auto-generated</Badge>
          </div>
          <p className="t-body-medium leading-relaxed text-white/95">{event.content}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 t-label-small text-muted">
          <span>{event.at}</span>
          <span>·</span>
          <span>{event.by}</span>
        </div>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/bulk.tsx
==============================================================================
import { useState } from "react";
import {
  Calendar as CalendarIcon, Save, Send, FileText, Users, History, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChannelPicker } from "@/components/bulk/channel-picker";
import { SegmentPicker } from "@/components/bulk/segment-picker";
import { MessageComposer, MessagePreview } from "@/components/bulk/message-composer";
import { CampaignsList } from "@/components/bulk/campaigns-list";
import { SendConfirmModal } from "@/components/bulk/send-confirm-modal";
import { CANDIDATES } from "@/data/mock";
import { SEGMENTS } from "@/data/comms-mock";
import { toast } from "sonner";
import type { CampaignChannel } from "@/data/comms-mock";

export default function BulkPage() {
  const [tab, setTab] = useState<"compose" | "campaigns">("compose");

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Bulk communication</h1>
          <p className="text-muted-fg t-body-large">
            Reach the right candidates at the right moment. SMS, email, and WhatsApp — all compliant, all trackable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTab("campaigns")}>
            <History className="h-3.5 w-3.5" />
            View campaigns
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-5">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="campaigns">
            Campaigns
            <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">5</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-0">
          <ComposeFlow />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-0">
          <CampaignsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComposeFlow() {
  const [channel, setChannel] = useState<CampaignChannel>("sms");
  const [segmentId, setSegmentId] = useState("seg-1");
  const [subject, setSubject] = useState("Quick question about the {{roleTitle}} role at {{orgName}}");
  const [body, setBody] = useState(
    "Hi {{firstName}}, this is {{recruiterFirstName}} from {{orgName}}. Just a gentle nudge — we'd still love to chat about the {{roleTitle}} role. Tap here to pick a time that works: {{consentLink}}. No pressure either way."
  );
  const [previewCandidateId, setPreviewCandidateId] = useState(CANDIDATES[0].id);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  const segment = SEGMENTS.find((s) => s.id === segmentId)!;

  const handleSend = (mode: "now" | "schedule") => {
    setShowSendConfirm(false);
    if (mode === "now") {
      toast.success(`Sending to ${segment.candidateCount} candidates`, {
        description: `${channel === "sms" ? "SMS" : channel === "whatsapp" ? "WhatsApp" : "Email"} delivery started · track in Campaigns`,
      });
    } else {
      toast.success("Scheduled for tomorrow at 10:00 AM", {
        description: `${segment.candidateCount} candidates · pre-set prime engagement window`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4 lg:gap-5">
      {/* ─── Left: composer ──────────────────────────────────────── */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>1. Pick a channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ChannelPicker value={channel} onChange={setChannel} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>2. Choose audience</CardTitle>
              <span className="t-body-small text-muted-fg">{segment.candidateCount} matching candidates</span>
            </div>
          </CardHeader>
          <CardContent>
            <SegmentPicker value={segmentId} onChange={setSegmentId} />

            {segment.isDynamic && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-stellar-50 rounded-md">
                <Sparkles className="h-3.5 w-3.5 text-stellar mt-0.5 shrink-0" />
                <p className="t-body-small text-cosmic leading-snug">
                  This is a <strong>dynamic segment</strong> — the candidate list is recalculated when you send. New candidates joining this segment between now and send time will be included.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>3. Write the message</CardTitle>
              <Button variant="ghost" size="sm">
                <FileText className="h-3.5 w-3.5" /> Use template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MessageComposer
              channel={channel}
              subject={subject} setSubject={setSubject}
              body={body} setBody={setBody}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>4. Send or schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-3.5 w-3.5" /> Save as draft
              </Button>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-3.5 w-3.5" /> Schedule
              </Button>
              <Button size="sm" onClick={() => setShowSendConfirm(true)} disabled={!body.trim()}>
                <Send className="h-3.5 w-3.5" />
                Send to {segment.candidateCount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Right: preview + summary ────────────────────────────── */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Live preview</CardTitle>
          </CardHeader>
          <CardContent>
            <MessagePreview
              channel={channel}
              subject={subject}
              body={body}
              previewCandidateId={previewCandidateId}
              onCandidateChange={setPreviewCandidateId}
              allCandidates={CANDIDATES}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow icon={Users} label="Recipients" value={`${segment.candidateCount} candidates`} />
            <SummaryRow icon={FileText} label="Channel" value={channel === "sms" ? "SMS" : channel === "email" ? "Email" : "WhatsApp"} />
            <SummaryRow icon={CalendarIcon} label="Send" value="Now (or schedule)" />

            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-quantum" />
                <span className="t-label-small text-muted-fg">Estimated outcomes</span>
              </div>
              <div className="space-y-1 t-body-small">
                <Estimate label="Delivered" value={Math.round(segment.candidateCount * 0.96)} total={segment.candidateCount} />
                {channel !== "sms" && (
                  <Estimate label="Opens" value={Math.round(segment.candidateCount * 0.45)} total={segment.candidateCount} />
                )}
                <Estimate label="Replies" value={Math.round(segment.candidateCount * 0.18)} total={segment.candidateCount} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SendConfirmModal
        open={showSendConfirm}
        onClose={() => setShowSendConfirm(false)}
        onConfirm={handleSend}
        channel={channel}
        recipients={segment.candidateCount}
        segmentName={segment.name}
      />
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-fg shrink-0" />
      <span className="t-label-small text-muted-fg flex-1">{label}</span>
      <span className="t-label-large text-dark text-right">{value}</span>
    </div>
  );
}

function Estimate({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-fg">{label}</span>
      <span className="tabular-nums text-dark">{value} <span className="text-muted-fg">({pct}%)</span></span>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/timeline.tsx
==============================================================================
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, MessageSquareText, Mail, Phone, ShieldCheck,
  Sparkles, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { CANDIDATES, ROLES } from "@/data/mock";
import { TIMELINE_EVENTS, getTimelineForCandidate } from "@/data/comms-mock";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

interface FlattenedEvent extends TimelineEvent {
  candidateName: string;
  candidateRole: string;
  roleTitle: string;
}

const TYPE_LABELS: Record<string, string> = {
  call: "Call",
  voicemail: "Voicemail",
  sms: "SMS",
  email: "Email",
  "consent-sent": "Consent sent",
  "consent-accepted": "Consent accepted",
  "consent-declined": "Consent declined",
  "stage-change": "Stage change",
  note: "Note",
  "ai-summary": "LEO summary",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  voicemail: Phone,
  sms: MessageSquareText,
  email: Mail,
  "consent-sent": ShieldCheck,
  "consent-accepted": ShieldCheck,
  "consent-declined": ShieldCheck,
  "stage-change": ChevronRight,
  note: MessageSquareText,
  "ai-summary": Sparkles,
};

export default function TimelinePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Build a flattened recent feed across some candidates
  const allEvents = useMemo<FlattenedEvent[]>(() => {
    const out: FlattenedEvent[] = [];
    // Owen Walsh's curated events
    const owen = CANDIDATES.find((c) => c.id === "cand-1003");
    if (owen) {
      const ownerRole = ROLES.find((r) => r.id === owen.roleId);
      TIMELINE_EVENTS.forEach((e) => out.push({
        ...e,
        candidateName: owen.name,
        candidateRole: owen.currentRole,
        roleTitle: ownerRole?.title || "",
      }));
    }
    // A handful of others
    const others = CANDIDATES.filter((c) => c.id !== "cand-1003").slice(0, 8);
    others.forEach((c) => {
      const role = ROLES.find((r) => r.id === c.roleId);
      const events = getTimelineForCandidate(c.id);
      events.forEach((e) => out.push({
        ...e,
        candidateName: c.name,
        candidateRole: c.currentRole,
        roleTitle: role?.title || "",
      }));
    });
    return out;
  }, []);

  const filtered = useMemo(() => {
    let out = allEvents;
    if (typeFilter !== "all") {
      if (typeFilter === "calls") out = out.filter((e) => e.type === "call" || e.type === "voicemail");
      else if (typeFilter === "messages") out = out.filter((e) => e.type === "sms" || e.type === "email");
      else if (typeFilter === "consent") out = out.filter((e) => e.type.startsWith("consent"));
      else out = out.filter((e) => e.type === typeFilter);
    }
    if (roleFilter !== "all") {
      out = out.filter((e) => {
        const candidate = CANDIDATES.find((c) => c.id === e.candidateId);
        return candidate?.roleId === roleFilter;
      });
    }
    if (query) {
      const q = query.toLowerCase();
      out = out.filter((e) =>
        e.candidateName.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.roleTitle.toLowerCase().includes(q)
      );
    }
    return out;
  }, [allEvents, typeFilter, roleFilter, query]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="mb-5">
        <h1 className="mb-1">Activity timeline</h1>
        <p className="text-muted-fg t-body-large">
          Every interaction across every candidate, in one chronological feed. Pick anyone to see their full story.
        </p>
      </div>

      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <Input
              placeholder="Search by candidate, role, or content…"
              value={query} onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activity</SelectItem>
                <SelectItem value="calls">Calls</SelectItem>
                <SelectItem value="messages">Messages</SelectItem>
                <SelectItem value="consent">Consent events</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="ai-summary">LEO summaries</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity list */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="t-title-medium text-cosmic mb-1">No activity matches</div>
            <p className="t-body-medium text-muted-fg">Try clearing filters or a wider search.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filtered.map((event, i) => (
              <ActivityRow
                key={`${event.candidateId}-${event.id}-${i}`}
                event={event}
                isLast={i === filtered.length - 1}
                onClick={() => navigate(`/candidates/${event.candidateId}`)}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivityRow({
  event, isLast, onClick,
}: {
  event: FlattenedEvent;
  isLast: boolean;
  onClick: () => void;
}) {
  const Icon = TYPE_ICONS[event.type] || MessageSquareText;
  const isAiSummary = (event.type as any) === "ai-summary";
  const dispLabel = TYPE_LABELS[event.type] || event.type;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-start gap-3 px-4 py-3 hover:bg-mist/50 transition-colors cursor-pointer",
        !isLast && "border-b border-border"
      )}
    >
      <div className={cn(
        "h-8 w-8 rounded-md flex items-center justify-center shrink-0 mt-0.5",
        isAiSummary ? "leo-gradient text-white" :
        event.type === "call" ? "bg-stellar-50 text-stellar" :
        event.type === "consent-accepted" ? "bg-success-soft text-success-ink" :
        event.type === "consent-declined" ? "bg-danger-soft text-danger-ink" :
        "bg-mist text-cosmic"
      )}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      <NameAvatar name={event.candidateName} size={32} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="t-label-large text-dark truncate">{event.candidateName}</span>
          <Badge size="sm" variant="outline" className="t-label-small">{dispLabel}</Badge>
          <span className="t-body-small text-muted-fg truncate">· {event.roleTitle}</span>
        </div>
        <p className="t-body-medium text-dark line-clamp-2 leading-snug">{event.content}</p>
      </div>

      <div className="text-right shrink-0">
        <div className="t-label-small text-muted-fg whitespace-nowrap">{event.at}</div>
        {event.by && <div className="t-body-small text-muted whitespace-nowrap">{event.by}</div>}
      </div>

      <ChevronRight className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/recruiter/candidate-profile.tsx
==============================================================================
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageSquareText, Mail, Calendar, MoreHorizontal,
  Briefcase, MapPin, ShieldCheck, ShieldQuestion, ShieldX, ShieldAlert,
  Sparkles, PenLine, PhoneCall, ExternalLink, Copy,
  Bookmark, Flag, UserPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TimelineEventCard } from "@/components/timeline/event-card";
import { CANDIDATES, ROLES } from "@/data/mock";
import { getTimelineForCandidate } from "@/data/comms-mock";
import { CONSENT_LABELS, STAGE_LABELS } from "@/data/library-mock";
import { toast } from "sonner";
import type { ConsentStatus } from "@/types";

const CONSENT_VARIANT: Record<ConsentStatus, { variant: "success" | "warning" | "danger" | "neutral" | "info"; icon: React.ComponentType<{ className?: string }> }> = {
  accepted: { variant: "success", icon: ShieldCheck },
  pending: { variant: "warning", icon: ShieldQuestion },
  declined: { variant: "danger", icon: ShieldX },
  expired: { variant: "neutral", icon: ShieldAlert },
  scheduled: { variant: "info", icon: Calendar },
};

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const [newNote, setNewNote] = useState("");

  const candidate = useMemo(() => CANDIDATES.find((c) => c.id === id), [id]);
  const role = candidate ? ROLES.find((r) => r.id === candidate.roleId) : null;
  const timeline = useMemo(() => candidate ? getTimelineForCandidate(candidate.id) : [], [candidate]);

  const filtered = useMemo(() => {
    if (filter === "all") return timeline;
    if (filter === "calls") return timeline.filter((t) => t.type === "call" || t.type === "voicemail");
    if (filter === "messages") return timeline.filter((t) => t.type === "sms" || t.type === "email");
    if (filter === "notes") return timeline.filter((t) => t.type === "note" || (t.type as any) === "ai-summary");
    if (filter === "consent") return timeline.filter((t) => t.type.startsWith("consent"));
    return timeline;
  }, [timeline, filter]);

  if (!candidate || !role) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Button>
        <Card className="mt-6 border-dashed">
          <CardContent className="py-12 text-center">
            <h3 className="mb-1">Candidate not found</h3>
            <p className="t-body-medium text-muted-fg">The candidate may have been removed or the link is outdated.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consentCfg = CONSENT_VARIANT[candidate.consentStatus];
  const ConsentIcon = consentCfg.icon;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    toast.success("Note added", { description: "Synced to candidate profile and pinned to top of timeline" });
    setNewNote("");
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" className="mb-3 -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5">
        {/* ─── Left column: header + timeline ────────────────────── */}
        <div className="space-y-4 min-w-0">
          {/* Hero header */}
          <Card>
            <CardContent className="p-5 lg:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <NameAvatar name={candidate.name} size={72} />
                <div className="flex-1 min-w-0">
                  <h1 className="mb-1">{candidate.name}</h1>
                  <p className="t-body-large text-muted-fg">
                    {candidate.currentRole} at {candidate.currentCompany}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge variant={consentCfg.variant} className="gap-1">
                      <ConsentIcon className="h-3 w-3" />
                      {CONSENT_LABELS[candidate.consentStatus]}
                    </Badge>
                    <Badge variant="info">{STAGE_LABELS[candidate.stage]}</Badge>
                    <span className="t-body-small text-muted-fg flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {candidate.location}
                    </span>
                    <span className="t-body-small text-muted-fg">·</span>
                    <span className="t-body-small text-muted-fg flex items-center gap-1">
                      Source: {candidate.source}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {candidate.consentStatus === "accepted" && (
                    <Button size="sm" onClick={() => navigate("/dialer")}>
                      <PhoneCall className="h-3.5 w-3.5" />
                      Call now
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <MessageSquareText className="h-3.5 w-3.5" />
                    SMS
                  </Button>
                  <Button size="sm" variant="outline" className="hidden md:inline-flex">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon-sm" variant="ghost" aria-label="More actions">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Calendar className="h-3.5 w-3.5" /> Schedule callback</DropdownMenuItem>
                      <DropdownMenuItem><Bookmark className="h-3.5 w-3.5" /> Add to queue</DropdownMenuItem>
                      <DropdownMenuItem><UserPlus className="h-3.5 w-3.5" /> Match to other roles</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Flag className="h-3.5 w-3.5" /> Mark on hold</DropdownMenuItem>
                      <DropdownMenuItem className="text-danger-ink">Reject candidate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add a note inline */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-pill bg-mist flex items-center justify-center shrink-0">
                  <PenLine className="h-3.5 w-3.5 text-stellar" />
                </div>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder={`Add a note about ${candidate.name.split(" ")[0]}…`}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[60px] resize-y"
                  />
                  {newNote.trim() && (
                    <div className="flex justify-end mt-2 gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setNewNote("")}>Cancel</Button>
                      <Button size="sm" onClick={handleAddNote}>Save note</Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3>Activity timeline</h3>
            <div className="flex items-center gap-2">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="calls">Calls</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="consent">Consent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Timeline */}
          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <div className="t-title-medium text-cosmic mb-1">No matching events</div>
                <p className="t-body-medium text-muted-fg">Try another filter or take an action above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative pb-2">
              {/* Vertical rail */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-4 relative">
                {filtered.map((event) => (
                  <TimelineEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right column: profile sidebar ─────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          {/* Contact card */}
          <Card>
            <CardContent className="p-4">
              <div className="t-label-small text-muted-fg mb-3">Contact</div>
              <div className="space-y-2.5">
                <ContactRow icon={Phone} label="Phone" value={candidate.phone} />
                <ContactRow icon={Mail} label="Email" value={candidate.email} />
                <ContactRow icon={MapPin} label="Location" value={candidate.location} noCopy />
              </div>
            </CardContent>
          </Card>

          {/* Role card */}
          <Card>
            <CardContent className="p-4">
              <div className="t-label-small text-muted-fg mb-2">Calling about</div>
              <div className="flex items-start gap-2.5">
                <Briefcase className="h-3.5 w-3.5 text-stellar mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="t-label-large text-cosmic">{role.title}</div>
                  <div className="t-body-small text-muted-fg">{role.team} · {role.location}</div>
                  <p className="t-body-small text-muted-fg mt-2 leading-relaxed">{role.jdSummary}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 -ml-2" onClick={() => navigate(`/roles/${role.id}`)}>
                View role
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Resume snapshot */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="t-label-small text-muted-fg">Resume snapshot</div>
                <Badge variant="outline" size="sm">{candidate.yearsExperience}y exp</Badge>
              </div>
              <p className="t-body-small text-dark leading-relaxed mb-3">{candidate.resumeSummary}</p>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 6).map((s) => (
                  <Badge key={s} variant="outline" size="sm">{s}</Badge>
                ))}
                {candidate.skills.length > 6 && (
                  <Badge variant="neutral" size="sm">+{candidate.skills.length - 6}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI summary if present */}
          {candidate.aiSummary && (
            <div className="leo-gradient rounded-xl p-4 text-white">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="t-label-large">LEO snapshot</span>
              </div>
              <p className="t-body-small leading-relaxed text-white/95">{candidate.aiSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon, label, value, noCopy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  noCopy?: boolean;
}) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    toast.success(`${label} copied`);
  };
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-fg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="t-label-small text-muted-fg">{label}</div>
        <div className="t-body-medium text-dark truncate">{value}</div>
      </div>
      {!noCopy && (
        <Button size="icon-sm" variant="ghost" onClick={handleCopy} aria-label={`Copy ${label}`}>
          <Copy className="h-3 w-3" />
        </Button>
      )}
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
import BulkPage from "@/pages/recruiter/bulk";
import TimelinePage from "@/pages/recruiter/timeline";
import CandidateProfilePage from "@/pages/recruiter/candidate-profile";

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
      { path: "bulk", element: <BulkPage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "candidates/:id", element: <CandidateProfilePage /> },
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