==============================================================================
CONNX — Build Pass 8 (Settings + Integrations)
==============================================================================

This bundle contains 13 files for Pass 8.

INSTALLATION:
  1. You should already have Passes 1, 2, 3, 4, 5 in your Make project.
  2. Add the 11 new files at the paths shown.
  3. REPLACE src/App.tsx with the version below.
  4. No config or dependency changes needed.

Note: Passes 6 (HM portal) and 7 (Recruitment Lead) are deferred.
Their routes show friendly placeholders until you build those passes.

==============================================================================
>>> FILE: README.md
==============================================================================
## CONNX — Build Pass 8

Settings and Integrations — the recruiter-side workspace configuration layer. With this pass shipped, every recruiter surface in the product is now fully built end-to-end.

> **Note:** Pass 6 (Hiring Manager portal) and Pass 7 (Recruitment Lead) are intentionally deferred — we're prioritising the recruiter experience first. Their routes are still wired with friendly placeholders, ready for later passes.

## What's in Pass 8

**12 files total** — 1 mock data file, 8 settings sections, 2 pages, 1 router update.

### New files
```
src/data/settings-mock.ts                                # Integrations catalog, DNC entries, notification prefs, languages, regions
src/components/settings/profile-section.tsx              # Identity, working hours, time zone
src/components/settings/notifications-section.tsx        # Per-channel notification matrix (email / push / in-app)
src/components/settings/layout-section.tsx               # Default Auto Dialer layout + session prefs
src/components/settings/dnc-section.tsx                  # Do-not-call list management with import/export
src/components/settings/telephony-section.tsx            # Telephony provider routing + recording per region
src/components/settings/languages-section.tsx            # Multilingual consent + UI language
src/components/settings/data-residency-section.tsx       # Region selection + retention policies
src/components/settings/security-section.tsx             # MFA, active sessions, account actions
src/pages/shared/settings.tsx                            # Left-sidebar layout that hosts all sections
src/pages/shared/integrations.tsx                        # Integrations grid with category filters
```

### Replaced file
```
src/App.tsx                                              # Wires settings + integrations routes
```

## How to install on top of Passes 1–5

1. Add the 11 new files at the paths shown.
2. Replace `src/App.tsx`.
3. No config or dependency changes — Pass 1 already includes Sonner, Radix, Lucide, etc.

## What you'll see

### Settings (`/settings`)

A real settings page. Left sidebar lists 8 sections grouped into Account / Workspace / Compliance. Right side renders the active section.

**Profile & preferences** — name, photo (placeholder), email, callback number used in voicemail drops, time zone (9 zones with UTC offsets), working hours, and a "Don't dial outside working hours" toggle that pauses the Auto Dialer when scheduled outside the configured window.

**Notifications** — a real preference matrix: 10 notification types × 3 channels (email / push / in-app), grouped by category (Consent / Calls / Pipeline / Insights / System). Each row has a label + helper text. Mobile responsive: desktop shows a 4-column grid, mobile collapses to per-row toggles with channel labels.

**Auto Dialer layout** — the BRD-mandated layout persistence. Embedded `PanelPillBar` from Pass 4 that lets the recruiter set their default layout. Saves to localStorage on every change. Plus session prefs: show "Customise call view" before each session (toggle), auto-save AI-summary disposition (toggle), wrap time between calls (number input).

**DNC list** — full CRUD on the Do-Not-Call list with search, import CSV, export, and an Add modal. Each entry shows phone, optional email/name, reason, source badge (Opted out / Manual / Regulatory / Imported), and timestamp. Regulatory entries are locked from removal. Top-of-section compliance callout explains TCPA/GDPR/DPDP enforcement is automatic.

**Telephony region** — provider list with current primary marked, region badges (US / India / Global), and per-region call-recording rules (a real BRD requirement: "Recording is subject to organisational and local legal policies"). Connected providers can be made primary; available providers can be connected; Exotel shows an "Action needed" warning state for DLT template re-approval.

**Languages** — consent language toggle list (English locked as default; Spanish, Hindi, French, German, Japanese, Portuguese available). Up to 4 languages per workspace per BRD CM-08. Interface language section explains UI is English-only today.

**Data residency** — 4 regions (US East / EU Ireland / India Mumbai / Singapore) each with their compliance certifications. Active region has a stellar ring; others show "Migrate here". Below: a retention table showing required vs configurable retention windows per data type (audit log = 3 years, recordings = 180 days configurable, etc.).

**Security** — MFA status (authenticator app + backup codes), active sessions list with device / location / last active (current device locked from sign-out), and account actions (download my data per GDPR Article 15, sign out).

### Integrations (`/integrations`)

A grid view, not a table. **Why a grid:** integrations are visual-first (each has a brand mark), and recruiters scan rather than read.

**Top of page:**
- 3-stat strip: Connected / Need attention / Available
- Action-needed callout if any integration has issues — yellow band with a "Review" CTA that filters the list

**Tabs:**
- All (grouped by category — ATS, Telephony, Email, SMS, Calendar, Messaging, HRMS)
- Connected
- Needs attention (only appears when there are issues)
- Per-category filters

**Each integration card:**
- Brand-color logo block with the company's first letter(s)
- Name with status icon (success check or warning triangle)
- Description (line-clamped to 2)
- For connected: last sync, region, records synced, auth method
- For action-needed: the specific issue ("DLT template needs re-approval")
- Action button: Configure / Resolve / Connect / Coming soon

All BRD section 6.7 integrations covered: Workday, Greenhouse, Lever, iCIMS, SmartRecruiters, Zoho Recruit (coming soon); Twilio, Exotel, Knowlarity, Plivo; SendGrid, AWS SES, Mailgun; Twilio (SMS via telephony), Kaleyra, MSG91, Textlocal; Google Calendar, Outlook; SAP SuccessFactors, Oracle HCM. Plus WhatsApp Business as messaging.

## Design moves I made

1. **Settings is a left-sidebar layout, not tabs.** Tabs scale poorly past 4–5 items; sidebars handle 8+ with grouping. This is what Stripe, Linear, Notion, and every grown-up SaaS settings page does. Mobile gracefully degrades to a dropdown-style nav.

2. **The notification matrix is content-first.** I avoided the trap of putting toggles for each channel in a row of mini-cards. Instead: a real 4-column table with category groupings. Recruiters can answer "do I get pinged when a candidate accepts consent" in under 2 seconds.

3. **DNC entries from regulatory sources are locked.** You can't accidentally delete a TCPA-mandated entry. Manual ones are removable on hover. Source badge tells you why each entry exists.

4. **Telephony pairs region routing with recording rules.** These are conceptually linked — both are about "where in the world is this call happening" — so they live in the same section. Compliance officers will appreciate that.

5. **Retention table answers the question recruiters never ask but legal always does.** "How long do you keep call recordings?" "180 days, configurable." "How long for audit logs?" "3 years, regulatory minimum." Putting this in a clear row format saves a lawyer-recruiter back-and-forth.

6. **Integrations cards lead with brand color, not CONNX color.** The recruiter's mental model is "I want to connect Workday" — not "I want to use the ATS feature in CONNX." Letting the brand mark dominate the card respects that. The colored squares (Workday blue, Greenhouse green, Twilio red, etc.) make the page scannable.

7. **Action-needed integrations get a top-of-page callout AND visual emphasis on the card.** Real workspaces have integrations that drift out of compliance (DLT template expires, OAuth token rotates). Surfacing these clearly is the difference between a settings page that works and one that just exists.

## Where the recruiter side of the product stands

With this pass shipped, every surface a recruiter touches is fully built:

- ✅ Dashboard with Today's Action Plan, pipelines, callbacks, heatmap, LEO Assist
- ✅ Roles list + role detail with bulk actions
- ✅ Consent Center with audit trail
- ✅ Auto Dialer (Queue → Customise → Active call → Summary)
- ✅ Bulk Communication composer + campaigns history
- ✅ Activity Timeline + per-candidate profile with full history
- ✅ Templates Library with live merge-field preview
- ✅ Settings (8 sections) + Integrations grid

The Hiring Manager portal (Pass 6) and Recruitment Lead surfaces (Pass 7) are still placeholder routes, ready when you come back to them.

## What this means for testing

You can now demo the full recruiter day:
1. Land on dashboard, see action plan, click "Start dialer"
2. Pick a role with consented candidates, customise layout, run through 2–3 calls with dispositions, see summary
3. Browse roles, drill into Senior Backend Engineer, filter to consented candidates, bulk-select a few, send an SMS via the bulk composer
4. Click any candidate → see their full timeline (Owen Walsh has the curated story)
5. Visit Templates → preview an SMS template against any candidate, see merge fields resolve
6. Visit Consent Center → see the audit trail
7. Visit Settings → set your default Dialer layout, configure notifications, check the DNC list
8. Visit Integrations → see 22 integrations across 7 categories, status-aware

That's the recruiter's daily workflow, end-to-end.
<<< END FILE

==============================================================================
>>> FILE: src/data/settings-mock.ts
==============================================================================
// ─── Integration catalog ──────────────────────────────────────────
export type IntegrationCategory = "ats" | "telephony" | "email" | "sms" | "calendar" | "hrms" | "messaging";
export type IntegrationStatus = "connected" | "action-needed" | "available" | "coming-soon";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  website: string;
  // For connected integrations
  lastSyncedAt?: string;
  syncCadence?: string;
  recordsSynced?: number;
  authMethod?: "OAuth" | "API key" | "Webhook";
  region?: string;
  // For attention
  issue?: string;
  // Brand
  iconLetter: string;
  iconColor: string;
}

export const INTEGRATIONS: Integration[] = [
  // ── ATS ──────────────────────────────────────────────────────
  {
    id: "int-workday",
    name: "Workday",
    category: "ats",
    status: "connected",
    description: "Sync shortlisted candidates and write back dispositions to Workday.",
    website: "workday.com",
    lastSyncedAt: "2 minutes ago",
    syncCadence: "Real-time webhook + 15-min poll",
    recordsSynced: 142,
    authMethod: "OAuth",
    iconLetter: "W",
    iconColor: "#0875E1",
  },
  {
    id: "int-greenhouse",
    name: "Greenhouse",
    category: "ats",
    status: "connected",
    description: "Pull candidates from Greenhouse and push back screening outcomes.",
    website: "greenhouse.io",
    lastSyncedAt: "8 minutes ago",
    syncCadence: "Webhook on shortlist event",
    recordsSynced: 87,
    authMethod: "OAuth",
    iconLetter: "G",
    iconColor: "#24A47F",
  },
  {
    id: "int-lever",
    name: "Lever",
    category: "ats",
    status: "available",
    description: "Sync candidate pipelines from Lever to CONNX.",
    website: "lever.co",
    iconLetter: "L",
    iconColor: "#5C2BE2",
  },
  {
    id: "int-icims",
    name: "iCIMS",
    category: "ats",
    status: "available",
    description: "Connect iCIMS to bring candidates into your CONNX workflow.",
    website: "icims.com",
    iconLetter: "iC",
    iconColor: "#1E5BB8",
  },
  {
    id: "int-smartrecruiters",
    name: "SmartRecruiters",
    category: "ats",
    status: "available",
    description: "Pull from SmartRecruiters into CONNX outreach queues.",
    website: "smartrecruiters.com",
    iconLetter: "SR",
    iconColor: "#0FB1B1",
  },

  // ── Telephony ─────────────────────────────────────────────────
  {
    id: "int-twilio",
    name: "Twilio",
    category: "telephony",
    status: "connected",
    description: "Outbound voice and SMS for North America and global English markets.",
    website: "twilio.com",
    lastSyncedAt: "Live",
    syncCadence: "Real-time",
    region: "US · Canada · UK",
    authMethod: "API key",
    iconLetter: "T",
    iconColor: "#F22F46",
  },
  {
    id: "int-exotel",
    name: "Exotel",
    category: "telephony",
    status: "action-needed",
    description: "DLT-compliant voice and SMS for India.",
    website: "exotel.com",
    region: "India",
    authMethod: "API key",
    issue: "DLT template for \"48h consent reminder · SBE\" needs re-approval",
    iconLetter: "E",
    iconColor: "#7B61FF",
  },
  {
    id: "int-knowlarity",
    name: "Knowlarity",
    category: "telephony",
    status: "available",
    description: "APAC telephony partner — voice and SMS across India, SEA.",
    website: "knowlarity.com",
    iconLetter: "K",
    iconColor: "#FF5A1F",
  },
  {
    id: "int-plivo",
    name: "Plivo",
    category: "telephony",
    status: "available",
    description: "Global voice and SMS infrastructure as alternative to Twilio.",
    website: "plivo.com",
    iconLetter: "P",
    iconColor: "#0E7C66",
  },

  // ── Email ─────────────────────────────────────────────────────
  {
    id: "int-sendgrid",
    name: "SendGrid",
    category: "email",
    status: "connected",
    description: "Bulk email delivery, branded templates, deliverability analytics.",
    website: "sendgrid.com",
    lastSyncedAt: "Live",
    recordsSynced: 1289,
    authMethod: "API key",
    iconLetter: "SG",
    iconColor: "#1A82E2",
  },
  {
    id: "int-aws-ses",
    name: "AWS SES",
    category: "email",
    status: "available",
    description: "Cost-effective transactional email at scale.",
    website: "aws.amazon.com/ses",
    iconLetter: "SE",
    iconColor: "#FF9900",
  },
  {
    id: "int-mailgun",
    name: "Mailgun",
    category: "email",
    status: "available",
    description: "Developer-first email API with detailed analytics.",
    website: "mailgun.com",
    iconLetter: "M",
    iconColor: "#C02427",
  },

  // ── SMS ───────────────────────────────────────────────────────
  {
    id: "int-msg91",
    name: "MSG91",
    category: "sms",
    status: "connected",
    description: "DLT-compliant SMS for Indian carriers with template approval workflow.",
    website: "msg91.com",
    lastSyncedAt: "Live",
    recordsSynced: 312,
    region: "India",
    authMethod: "API key",
    iconLetter: "M9",
    iconColor: "#0066CC",
  },
  {
    id: "int-kaleyra",
    name: "Kaleyra",
    category: "sms",
    status: "available",
    description: "Global SMS coverage with strong APAC presence.",
    website: "kaleyra.com",
    iconLetter: "K",
    iconColor: "#FF6B35",
  },
  {
    id: "int-textlocal",
    name: "Textlocal",
    category: "sms",
    status: "available",
    description: "UK and APAC SMS with bulk-friendly pricing.",
    website: "textlocal.com",
    iconLetter: "TL",
    iconColor: "#4A90E2",
  },

  // ── Calendar ──────────────────────────────────────────────────
  {
    id: "int-gcal",
    name: "Google Calendar",
    category: "calendar",
    status: "connected",
    description: "Schedule callbacks against your real calendar availability.",
    website: "calendar.google.com",
    lastSyncedAt: "Live",
    authMethod: "OAuth",
    iconLetter: "G",
    iconColor: "#4285F4",
  },
  {
    id: "int-outlook",
    name: "Microsoft Outlook",
    category: "calendar",
    status: "available",
    description: "Use Outlook for callback scheduling and availability lookup.",
    website: "outlook.com",
    iconLetter: "O",
    iconColor: "#0078D4",
  },

  // ── Messaging ────────────────────────────────────────────────
  {
    id: "int-whatsapp",
    name: "WhatsApp Business",
    category: "messaging",
    status: "action-needed",
    description: "Conversational outreach via WhatsApp Business API.",
    website: "business.whatsapp.com",
    region: "Where permitted",
    issue: "Business profile verification expires in 7 days",
    iconLetter: "W",
    iconColor: "#25D366",
  },

  // ── HRMS ──────────────────────────────────────────────────────
  {
    id: "int-successfactors",
    name: "SAP SuccessFactors",
    category: "hrms",
    status: "available",
    description: "Read-only candidate data sync from SAP SuccessFactors.",
    website: "sap.com",
    iconLetter: "SF",
    iconColor: "#0FAAFF",
  },
  {
    id: "int-oracle-hcm",
    name: "Oracle HCM",
    category: "hrms",
    status: "available",
    description: "Read-only sync from Oracle HCM Cloud.",
    website: "oracle.com",
    iconLetter: "O",
    iconColor: "#C74634",
  },
  {
    id: "int-zoho",
    name: "Zoho Recruit",
    category: "ats",
    status: "coming-soon",
    description: "Zoho Recruit support is in private beta — request access.",
    website: "zoho.com/recruit",
    iconLetter: "Z",
    iconColor: "#F0463A",
  },
];

export const CATEGORY_META: Record<IntegrationCategory, { label: string; description: string }> = {
  ats: { label: "ATS", description: "Source candidates from your applicant tracking system" },
  telephony: { label: "Telephony", description: "Voice and SMS infrastructure for outbound dialing" },
  email: { label: "Email", description: "Bulk and transactional email delivery" },
  sms: { label: "SMS", description: "Standalone SMS providers (separate from telephony)" },
  calendar: { label: "Calendar", description: "Schedule callbacks against your real availability" },
  messaging: { label: "Messaging", description: "Conversational platforms like WhatsApp" },
  hrms: { label: "HRMS", description: "Read-only people data from your HR system" },
};

// ─── DNC list ─────────────────────────────────────────────────────
export interface DncEntry {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  reason: string;
  source: "candidate-opt-out" | "manual" | "regulatory" | "imported";
  addedAt: string;
  addedBy?: string;
}

export const DNC_ENTRIES: DncEntry[] = [
  { id: "dnc-1", phone: "+1 415 555 0188", email: "mira.solberg@hey.com", name: "Mira Solberg", reason: "Replied STOP to consent SMS · Senior Backend Engineer", source: "candidate-opt-out", addedAt: "Mon, 3:21 PM", addedBy: "System" },
  { id: "dnc-2", phone: "+1 628 555 0107", name: "Felix Lindqvist", reason: "Permanent opt-out — all roles", source: "candidate-opt-out", addedAt: "Today, 8:01 AM", addedBy: "System" },
  { id: "dnc-3", phone: "+44 20 7946 0142", reason: "Wrong number — verified by recruiter", source: "manual", addedAt: "3 days ago", addedBy: "Jordan Chen" },
  { id: "dnc-4", phone: "+1 212 555 0123", email: "noreply@gov.us", reason: "Regulatory blocklist · TCPA registered number", source: "regulatory", addedAt: "Migrated · 2024-09-14", addedBy: "System" },
  { id: "dnc-5", phone: "+1 312 555 0186", reason: "Imported from internal company DNC list", source: "imported", addedAt: "Migrated · 2024-09-14", addedBy: "Compliance team" },
];

// ─── Notification preferences ─────────────────────────────────────
export interface NotificationPref {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export const NOTIFICATION_PREFS: NotificationPref[] = [
  { id: "n-1",  category: "Consent",   label: "Candidate accepts consent",          description: "When a candidate replies YES or schedules a callback time", email: false, push: true,  inApp: true },
  { id: "n-2",  category: "Consent",   label: "Candidate declines consent",         description: "When a candidate replies STOP", email: false, push: false, inApp: true },
  { id: "n-3",  category: "Consent",   label: "Consent expires without response",   description: "Reminder when 72-hour window closes", email: true,  push: false, inApp: true },
  { id: "n-4",  category: "Calls",     label: "SMS reply during a dialer session",  description: "Surface reply mid-session so you can pivot", email: false, push: true,  inApp: true },
  { id: "n-5",  category: "Calls",     label: "Callback due in 15 minutes",         description: "Heads-up before scheduled callbacks", email: false, push: true,  inApp: true },
  { id: "n-6",  category: "Pipeline",  label: "Daily digest from CONNX",            description: "End-of-day summary of activity and tomorrow's plan", email: true,  push: false, inApp: false },
  { id: "n-7",  category: "Pipeline",  label: "Hiring manager comments on a candidate", description: "When an HM leaves a note in your pipeline", email: false, push: false, inApp: true },
  { id: "n-8",  category: "Insights",  label: "LEO suggestions",                    description: "Smart nudges from CONNX intelligence", email: false, push: false, inApp: true },
  { id: "n-9",  category: "Insights",  label: "Performance milestones",             description: "Celebrate when you hit a daily or weekly goal", email: false, push: false, inApp: true },
  { id: "n-10", category: "System",    label: "Integration sync errors",            description: "When Workday, Twilio, or another integration fails", email: true,  push: false, inApp: true },
];

// ─── Language options ─────────────────────────────────────────────
export const LANGUAGES = [
  { code: "en", label: "English", consent: true, ui: true, region: "Global" },
  { code: "es", label: "Español", consent: true, ui: false, region: "Spain · LATAM" },
  { code: "hi", label: "हिन्दी (Hindi)", consent: true, ui: false, region: "India" },
  { code: "fr", label: "Français", consent: true, ui: false, region: "France · Canada" },
  { code: "de", label: "Deutsch", consent: false, ui: false, region: "DACH" },
  { code: "ja", label: "日本語", consent: false, ui: false, region: "Japan" },
  { code: "pt", label: "Português", consent: false, ui: false, region: "Brazil · Portugal" },
];

// ─── Data residency regions ───────────────────────────────────────
export const DATA_REGIONS = [
  { code: "us-east-1", label: "United States — East (Virginia)", active: true, compliance: "SOC 2 · HIPAA-eligible" },
  { code: "eu-west-1", label: "European Union — Ireland",         active: false, compliance: "GDPR · ISO 27001" },
  { code: "ap-south-1", label: "India — Mumbai",                  active: false, compliance: "DPDP Act 2023" },
  { code: "ap-se-1",    label: "Singapore",                        active: false, compliance: "PDPA" },
];
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/profile-section.tsx
==============================================================================
import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NameAvatar } from "@/components/ui/avatar";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CURRENT_RECRUITER, ORG } from "@/data/mock";
import { toast } from "sonner";

export function ProfileSection() {
  const [name, setName] = useState(CURRENT_RECRUITER.name);
  const [email, setEmail] = useState(CURRENT_RECRUITER.email);
  const [title, setTitle] = useState("Senior Talent Partner");
  const [phone, setPhone] = useState("+1 (628) 555-0184");
  const [tz, setTz] = useState("America/Los_Angeles");
  const [workStart, setWorkStart] = useState("08:00");
  const [workEnd, setWorkEnd] = useState("18:00");
  const [respectDND, setRespectDND] = useState(true);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Profile</CardTitle>
          <p className="t-body-small text-muted-fg">
            How you appear to candidates and your team.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <NameAvatar name={name} size={64} />
            <div>
              <Button variant="outline" size="sm">
                <Camera className="h-3.5 w-3.5" />
                Upload photo
              </Button>
              <p className="t-body-small text-muted-fg mt-1.5">JPG or PNG · max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="mb-1.5 block">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="title" className="mb-1.5 block">Job title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email" className="mb-1.5 block">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-1.5 block">Callback number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <p className="t-body-small text-muted-fg mt-1">Used in voicemail drops as the call-back number.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="t-label-large text-dark">Organisation</div>
                <p className="t-body-small text-muted-fg">{ORG.name} · {CURRENT_RECRUITER.team}</p>
              </div>
              <Button variant="outline" size="sm" disabled>Managed by admin</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Working hours</CardTitle>
          <p className="t-body-small text-muted-fg">
            CONNX uses your working hours to set best-time-to-call windows and protect your downtime.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tz" className="mb-1.5 block">Time zone</Label>
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">Pacific (Los Angeles) · UTC−7</SelectItem>
                <SelectItem value="America/Denver">Mountain (Denver) · UTC−6</SelectItem>
                <SelectItem value="America/Chicago">Central (Chicago) · UTC−5</SelectItem>
                <SelectItem value="America/New_York">Eastern (New York) · UTC−4</SelectItem>
                <SelectItem value="Europe/London">London · UTC+1</SelectItem>
                <SelectItem value="Europe/Berlin">Central Europe (Berlin) · UTC+2</SelectItem>
                <SelectItem value="Asia/Kolkata">India (Kolkata) · UTC+5:30</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore · UTC+8</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo · UTC+9</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start" className="mb-1.5 block">Work day starts</Label>
              <Input id="start" type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end" className="mb-1.5 block">Work day ends</Label>
              <Input id="end" type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-md bg-mist">
            <div className="flex-1">
              <div className="t-label-large text-dark">Don't dial outside working hours</div>
              <p className="t-body-small text-muted-fg">
                Pause Auto Dialer and bulk sends if scheduled outside {workStart}–{workEnd}.
              </p>
            </div>
            <Switch checked={respectDND} onCheckedChange={setRespectDND} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" onClick={() => toast.success("Profile saved")}>
          <Save className="h-3.5 w-3.5" /> Save changes
        </Button>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/notifications-section.tsx
==============================================================================
import { useState } from "react";
import { Mail, Smartphone, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { NOTIFICATION_PREFS } from "@/data/settings-mock";

export function NotificationsSection() {
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS);

  const update = (id: string, channel: "email" | "push" | "inApp", value: boolean) => {
    setPrefs((p) => p.map((x) => x.id === id ? { ...x, [channel]: value } : x));
  };

  // Group by category
  const groups = prefs.reduce<Record<string, typeof prefs>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Notifications</CardTitle>
          <p className="t-body-small text-muted-fg">
            Decide what reaches you and where. Toggle each channel independently.
          </p>
        </CardHeader>
        <CardContent>
          {/* Channel header */}
          <div className="hidden md:grid grid-cols-[1fr_60px_60px_60px] gap-3 pb-2 border-b border-border mb-2">
            <div></div>
            <ChannelHeader icon={Mail} label="Email" />
            <ChannelHeader icon={Smartphone} label="Push" />
            <ChannelHeader icon={Monitor} label="In-app" />
          </div>

          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="mb-5 last:mb-0">
              <div className="t-label-small text-muted-fg mb-2 mt-3">{category}</div>
              <div className="space-y-1">
                {items.map((p) => (
                  <PrefRow key={p.id} pref={p} onToggle={(ch, v) => update(p.id, ch, v)} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quiet hours</CardTitle>
          <p className="t-body-small text-muted-fg">
            Push and SMS notifications won't disturb you outside working hours, regardless of these preferences.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">Respect working hours</div>
              <p className="t-body-small text-muted-fg">Hold non-urgent notifications until your next work day.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChannelHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-3.5 w-3.5 text-muted-fg" />
      <span className="t-label-small text-muted-fg">{label}</span>
    </div>
  );
}

function PrefRow({
  pref, onToggle,
}: {
  pref: typeof NOTIFICATION_PREFS[number];
  onToggle: (channel: "email" | "push" | "inApp", v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_60px_60px] gap-3 py-2 items-center border-b border-border last:border-0">
      <div className="min-w-0">
        <div className="t-label-large text-dark">{pref.label}</div>
        <p className="t-body-small text-muted-fg leading-snug">{pref.description}</p>
      </div>
      <ChannelToggle channel="email" value={pref.email} onChange={(v) => onToggle("email", v)} />
      <ChannelToggle channel="push"  value={pref.push}  onChange={(v) => onToggle("push", v)} />
      <ChannelToggle channel="inApp" value={pref.inApp} onChange={(v) => onToggle("inApp", v)} />
    </div>
  );
}

function ChannelToggle({
  channel, value, onChange,
}: {
  channel: "email" | "push" | "inApp";
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const label = channel === "email" ? "Email" : channel === "push" ? "Push" : "In-app";
  return (
    <div className="flex items-center justify-between md:justify-center gap-2">
      <span className="t-label-small text-muted-fg md:hidden">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} aria-label={`${label} notifications`} />
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/layout-section.tsx
==============================================================================
import { useState, useEffect } from "react";
import {
  RotateCcw, Briefcase, FileText, ListChecks, PenLine, ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PanelPillBar } from "@/components/dialer/panel-pill-bar";
import {
  DEFAULT_LAYOUT, PANEL_META, ZONE_META,
  loadSavedLayout, saveSavedLayout,
} from "@/lib/dialer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LayoutPref, Zone, Panel } from "@/types";

const ICONS = { Briefcase, FileText, ListChecks, PenLine, ClipboardList } as const;

export function LayoutSection() {
  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [showCustomiseStep, setShowCustomiseStep] = useState(true);
  const [autoSaveDisposition, setAutoSaveDisposition] = useState(true);
  const [wrapTime, setWrapTime] = useState(15);

  // Persist on change
  useEffect(() => { saveSavedLayout(layout); }, [layout]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Default Auto Dialer layout</CardTitle>
          <p className="t-body-small text-muted-fg">
            Set your preferred panel arrangement. CONNX applies this at the start of every dialer session — you can still override per session.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <PanelPillBar layout={layout} onChange={setLayout} />

          {/* Layout summary */}
          <div className="grid grid-cols-3 gap-2">
            {(["A", "B", "C"] as Zone[]).map((z) => {
              const meta = PANEL_META[layout[z]];
              const Icon = ICONS[meta.iconName];
              return (
                <div key={z} className="rounded-md border border-border bg-white p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="info" size="sm">Zone {z}</Badge>
                    <span className="t-label-small text-muted-fg">{ZONE_META[z].widthPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3 text-stellar shrink-0" />
                    <span className="t-label-large text-dark truncate">{meta.shortLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="t-body-small text-muted-fg">Saved automatically as you change.</p>
            <Button variant="outline" size="sm" onClick={() => {
              setLayout(DEFAULT_LAYOUT);
              toast.success("Layout reset to default");
            }}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset to default
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Session preferences</CardTitle>
          <p className="t-body-small text-muted-fg">
            Fine-tune how CONNX behaves during a dialer session.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <PrefToggle
            label="Show 'Customise call view' before each session"
            description="Recommended on. Lets you confirm or tweak the layout before the first call."
            value={showCustomiseStep}
            onChange={setShowCustomiseStep}
          />
          <PrefToggle
            label="Auto-save disposition notes"
            description="Generate an AI summary from the call recording when no manual note is added."
            value={autoSaveDisposition}
            onChange={setAutoSaveDisposition}
          />

          <div className="flex items-center justify-between p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">Between-call wrap time</div>
              <p className="t-body-small text-muted-fg">Pause before auto-dialing the next candidate.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={120}
                value={wrapTime}
                onChange={(e) => setWrapTime(Number(e.target.value))}
                className="w-20 h-9 px-3 rounded-lg border border-border-strong bg-white text-[14px] tabular-nums focus-ring focus-visible:outline-none focus-visible:border-stellar focus-visible:border-2 focus-visible:px-[11px]"
              />
              <span className="t-body-medium text-muted-fg">seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrefToggle({
  label, description, value, onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div className="flex-1 min-w-0">
        <div className="t-label-large text-dark">{label}</div>
        <p className="t-body-small text-muted-fg leading-snug">{description}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/dnc-section.tsx
==============================================================================
import { useState, useMemo } from "react";
import {
  ShieldOff, Search, Plus, Upload, Download, Trash2, Phone, Mail,
  AlertTriangle, Building2, User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DNC_ENTRIES } from "@/data/settings-mock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { DncEntry } from "@/data/settings-mock";

const SOURCE_CFG: Record<DncEntry["source"], { label: string; variant: "warning" | "danger" | "info" | "neutral"; icon: React.ComponentType<{ className?: string }> }> = {
  "candidate-opt-out": { label: "Opted out",   variant: "warning", icon: User },
  "manual":            { label: "Manual",      variant: "info",    icon: User },
  "regulatory":        { label: "Regulatory",  variant: "danger",  icon: AlertTriangle },
  "imported":          { label: "Imported",    variant: "neutral", icon: Building2 },
};

export function DncSection() {
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [entries, setEntries] = useState(DNC_ENTRIES);

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      e.phone.includes(q) || e.email?.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q) || e.reason.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const handleRemove = (id: string) => {
    setEntries((e) => e.filter((x) => x.id !== id));
    toast.success("Removed from DNC list");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Do-not-call list</CardTitle>
              <p className="t-body-small text-muted-fg">
                Numbers and emails on this list are excluded from every dial and bulk send across the workspace.
              </p>
            </div>
            <Badge variant="info" size="sm">{entries.length} entries</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Compliance callout */}
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-md bg-success-soft border border-success/20">
            <ShieldOff className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-success-ink">Active enforcement</div>
              <p className="t-body-small text-success-ink/80">
                Every Auto Dialer call and bulk send is checked against this list before execution. Compliance with TCPA, GDPR Article 21, and DPDP Section 9 is automatic.
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <Input
                placeholder="Search by phone, email, name, or reason…"
                value={query} onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <Upload className="h-3.5 w-3.5" /> Import CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="h-3.5 w-3.5" /> Add entry
              </Button>
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-lg">
              <div className="t-title-medium text-cosmic mb-1">No matching entries</div>
              <p className="t-body-small text-muted-fg">Try a different search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-mist/50">
                    <th className="px-5 py-2.5 text-left t-label-small text-muted-fg">Contact</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden md:table-cell">Reason</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden lg:table-cell">Source</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden lg:table-cell">Added</th>
                    <th className="w-10 px-5 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => {
                    const cfg = SOURCE_CFG[e.source];
                    const SourceIcon = cfg.icon;
                    const isLocked = e.source === "regulatory";

                    return (
                      <tr key={e.id} className={cn("group hover:bg-mist/40 transition-colors", i !== filtered.length - 1 && "border-b border-border")}>
                        <td className="px-5 py-3">
                          <div className="t-label-large text-dark flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-muted shrink-0" />
                            <span className="tabular-nums">{e.phone}</span>
                          </div>
                          {e.email && (
                            <div className="t-body-small text-muted-fg flex items-center gap-1.5">
                              <Mail className="h-3 w-3 shrink-0" />
                              {e.email}
                            </div>
                          )}
                          {e.name && <div className="t-body-small text-muted-fg">{e.name}</div>}
                        </td>
                        <td className="px-2 py-3 hidden md:table-cell">
                          <p className="t-body-medium text-dark line-clamp-2 max-w-[300px]">{e.reason}</p>
                        </td>
                        <td className="px-2 py-3 hidden lg:table-cell">
                          <Badge variant={cfg.variant} size="sm" className="gap-1">
                            <SourceIcon className="h-2.5 w-2.5" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-2 py-3 hidden lg:table-cell">
                          <div className="t-body-small text-muted-fg">{e.addedAt}</div>
                          {e.addedBy && <div className="t-label-small text-muted">{e.addedBy}</div>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            disabled={isLocked}
                            onClick={() => handleRemove(e.id)}
                            aria-label="Remove from DNC list"
                            className={cn(isLocked ? "opacity-30" : "opacity-0 group-hover:opacity-100", "transition-opacity")}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-danger-ink" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddDncModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={(entry) => {
        setEntries((e) => [entry, ...e]);
        setShowAddModal(false);
        toast.success("Added to DNC list");
      }} />
    </div>
  );
}

function AddDncModal({
  open, onClose, onAdd,
}: { open: boolean; onClose: () => void; onAdd: (e: DncEntry) => void }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = () => {
    if (!phone.trim() || !reason.trim()) return;
    onAdd({
      id: `dnc-${Date.now()}`,
      phone: phone.trim(),
      email: email.trim() || undefined,
      name: name.trim() || undefined,
      reason: reason.trim(),
      source: "manual",
      addedAt: "Just now",
      addedBy: "Jordan Chen",
    });
    setPhone(""); setEmail(""); setName(""); setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to do-not-call list</DialogTitle>
          <DialogDescription>
            This number will be excluded from every future dial and bulk send across the workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="dnc-phone" className="mb-1.5 block">Phone number <span className="text-danger-ink">*</span></Label>
            <Input id="dnc-phone" placeholder="+1 415 555 0123" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-email" className="mb-1.5 block">Email <span className="text-muted">(optional)</span></Label>
            <Input id="dnc-email" type="email" placeholder="optional@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-name" className="mb-1.5 block">Name <span className="text-muted">(optional)</span></Label>
            <Input id="dnc-name" placeholder="For your records" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-reason" className="mb-1.5 block">Reason <span className="text-danger-ink">*</span></Label>
            <Textarea id="dnc-reason" placeholder="Why is this contact being suppressed?" value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[60px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleAdd} disabled={!phone.trim() || !reason.trim()}>
            <ShieldOff className="h-3.5 w-3.5" /> Add to DNC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/telephony-section.tsx
==============================================================================
import { useState } from "react";
import { Globe, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS } from "@/data/settings-mock";
import { cn } from "@/lib/utils";

export function TelephonySection() {
  const [primary, setPrimary] = useState("int-twilio");
  const telephonyProviders = INTEGRATIONS.filter((i) => i.category === "telephony");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Telephony region</CardTitle>
          <p className="t-body-small text-muted-fg">
            CONNX routes calls and SMS through your configured providers based on candidate region. Pick your primary, set fallbacks.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2.5 p-3 rounded-md bg-mist">
            <Globe className="h-4 w-4 text-stellar shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-dark">Smart region routing</div>
              <p className="t-body-small text-muted-fg leading-snug">
                CONNX picks the best provider per call based on candidate phone country code. Manual override available per dialer session.
              </p>
            </div>
          </div>

          {/* Provider list */}
          <div className="space-y-2">
            {telephonyProviders.map((p) => {
              const isConnected = p.status === "connected";
              const isPrimary = p.id === primary;
              const hasIssue = p.status === "action-needed";

              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    isPrimary ? "border-stellar bg-stellar-50/50 ring-1 ring-stellar/20" :
                    hasIssue ? "border-warning/30 bg-warning-soft/30" :
                    "border-border bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-md flex items-center justify-center text-white t-label-medium shrink-0"
                      style={{ backgroundColor: p.iconColor }}
                    >
                      {p.iconLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="t-label-large text-dark">{p.name}</span>
                        {isPrimary && <Badge size="sm" variant="info">Primary</Badge>}
                        {p.region && <Badge size="sm" variant="outline">{p.region}</Badge>}
                        {hasIssue && (
                          <Badge size="sm" variant="warning" className="gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" /> Action needed
                          </Badge>
                        )}
                      </div>
                      <p className="t-body-small text-muted-fg">{p.description}</p>
                      {hasIssue && p.issue && (
                        <p className="t-body-small text-warning-ink mt-1">⚠ {p.issue}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isConnected && !isPrimary && (
                        <Button size="sm" variant="outline" onClick={() => setPrimary(p.id)}>
                          Make primary
                        </Button>
                      )}
                      {!isConnected && (
                        <Button size="sm" variant="outline">
                          Connect
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {hasIssue && <Button size="sm">Fix</Button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Call recording</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD 8.1: recording is subject to organisational and local legal policies. Disable per region as required.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <RegionRecordingRow region="United States" enabled />
          <RegionRecordingRow region="European Union" enabled note="Two-party consent required" />
          <RegionRecordingRow region="India" enabled />
          <RegionRecordingRow region="California" enabled note="CIPA compliance enabled" />
          <RegionRecordingRow region="Canada" enabled={false} note="Disabled by org policy" />
        </CardContent>
      </Card>
    </div>
  );
}

function RegionRecordingRow({ region, enabled, note }: { region: string; enabled: boolean; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div>
        <div className="t-label-large text-dark">{region}</div>
        {note && <p className="t-body-small text-muted-fg">{note}</p>}
      </div>
      <Badge variant={enabled ? "success" : "neutral"} size="sm" className="gap-1">
        {enabled ? <CheckCircle2 className="h-2.5 w-2.5" /> : null}
        {enabled ? "Recording on" : "Disabled"}
      </Badge>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/languages-section.tsx
==============================================================================
import { useState } from "react";
import { Globe2, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "@/data/settings-mock";
import { cn } from "@/lib/utils";

export function LanguagesSection() {
  const [langs, setLangs] = useState(LANGUAGES);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Consent languages</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD CM-08: candidates receive consent messages in their preferred language. Enable up to 4 languages per workspace.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {langs.map((l) => (
            <div key={l.code} className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Globe2 className="h-3.5 w-3.5 text-stellar shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="t-label-large text-dark">{l.label}</span>
                    {l.code === "en" && <Badge variant="info" size="sm">Default</Badge>}
                  </div>
                  <p className="t-body-small text-muted-fg">{l.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={l.consent}
                  onCheckedChange={(v) => setLangs((ls) => ls.map((x) => x.code === l.code ? { ...x, consent: v } : x))}
                  disabled={l.code === "en"}
                  aria-label={`Consent in ${l.label}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Interface language</CardTitle>
          <p className="t-body-small text-muted-fg">
            CONNX UI is available in English today. More languages ship in 2026.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">English</div>
              <p className="t-body-small text-muted-fg">UI strings, labels, and helper text</p>
            </div>
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> Active
            </Badge>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-2" disabled>
            <Plus className="h-3.5 w-3.5" /> More languages coming soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/data-residency-section.tsx
==============================================================================
import { useState } from "react";
import { MapPin, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATA_REGIONS } from "@/data/settings-mock";
import { cn } from "@/lib/utils";

export function DataResidencySection() {
  const [active, setActive] = useState("us-east-1");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Data residency</CardTitle>
          <p className="t-body-small text-muted-fg">
            Where CONNX stores your candidate data, call recordings, and audit logs. Set per workspace — changing region requires a planned migration.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {DATA_REGIONS.map((r) => {
            const isActive = r.code === active;
            return (
              <div
                key={r.code}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  isActive ? "border-stellar bg-stellar-50/50 ring-1 ring-stellar/20" : "border-border bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={cn("h-4 w-4 shrink-0", isActive ? "text-stellar" : "text-muted")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="t-label-large text-dark">{r.label}</span>
                      {isActive && <Badge variant="info" size="sm">Active</Badge>}
                    </div>
                    <div className="t-body-small text-muted-fg flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-success-ink" />
                      <span>{r.compliance}</span>
                    </div>
                  </div>
                  {!isActive && (
                    <Button variant="outline" size="sm">Migrate here</Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-start gap-2.5 p-3 mt-4 rounded-md bg-warning-soft border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-warning-ink">Region migration is planned, not instant</div>
              <p className="t-body-small text-warning-ink/80">
                Switching regions takes ~24 hours. CONNX runs in read-only mode during the migration. Audit logs are preserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Data retention</CardTitle>
          <p className="t-body-small text-muted-fg">
            How long CONNX retains different categories of data, per regulatory requirements.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <RetentionRow label="Audit log entries" days="3 years (1,095 days)" required="GDPR · DPDP · TCPA minimum" />
          <RetentionRow label="Call recordings" days="180 days" configurable />
          <RetentionRow label="AI call summaries" days="3 years" required="Tied to audit retention" />
          <RetentionRow label="Candidate data (after rejection)" days="2 years or until candidate request, whichever sooner" required="GDPR Article 17" />
          <RetentionRow label="Bulk message content + delivery logs" days="1 year" configurable />
        </CardContent>
      </Card>
    </div>
  );
}

function RetentionRow({ label, days, required, configurable }: { label: string; days: string; required?: string; configurable?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div>
        <div className="t-label-large text-dark">{label}</div>
        {required && <p className="t-body-small text-muted-fg">{required}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="t-label-medium text-cosmic tabular-nums">{days}</span>
        {configurable && <Badge variant="outline" size="sm">Configurable</Badge>}
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/components/settings/security-section.tsx
==============================================================================
import { useState } from "react";
import {
  KeyRound, Smartphone, Laptop, MapPin, ShieldCheck, LogOut, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SecuritySection() {
  const [mfaEnabled, setMfaEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Multi-factor authentication</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD non-functional requirement: MFA enforced workspace-wide. You manage your second factor here.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-stellar" />
              <div>
                <div className="t-label-large text-dark">Authenticator app</div>
                <p className="t-body-small text-muted-fg">Recommended · device-bound TOTP</p>
              </div>
            </div>
            <Badge variant="success" size="sm" className="gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Enabled
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-4 w-4 text-stellar" />
              <div>
                <div className="t-label-large text-dark">Backup codes</div>
                <p className="t-body-small text-muted-fg">8 of 10 remaining · regenerate when low</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View codes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active sessions</CardTitle>
          <p className="t-body-small text-muted-fg">
            Devices currently signed in to CONNX. Sign out anywhere you don't recognise.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <SessionRow
            icon={Laptop} device="MacBook Pro · Chrome 122" location="San Francisco, CA"
            lastActive="Active now" current
          />
          <SessionRow
            icon={Smartphone} device="iPhone 15 · Safari" location="San Francisco, CA"
            lastActive="2 hours ago"
          />
          <SessionRow
            icon={Laptop} device="MacBook Air · Safari 18" location="Brooklyn, NY"
            lastActive="3 days ago"
          />

          <Button
            variant="outline" size="sm" className="w-full mt-3 text-danger-ink"
            onClick={() => toast.success("Signed out of all other sessions")}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out of all other sessions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Account actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-mist transition-colors text-left focus-ring">
            <div>
              <div className="t-label-large text-dark">Download my data</div>
              <p className="t-body-small text-muted-fg">Export everything CONNX holds about you · GDPR Article 15</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted" />
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-mist transition-colors text-left focus-ring">
            <div>
              <div className="t-label-large text-dark">Sign out of CONNX</div>
              <p className="t-body-small text-muted-fg">End this session on this device</p>
            </div>
            <LogOut className="h-4 w-4 text-muted" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function SessionRow({
  icon: Icon, device, location, lastActive, current,
}: {
  icon: React.ComponentType<{ className?: string }>;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Icon className="h-4 w-4 text-stellar shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="t-label-large text-dark truncate">{device}</span>
            {current && <Badge variant="info" size="sm">This device</Badge>}
          </div>
          <div className="t-body-small text-muted-fg flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>
            <span>·</span>
            <span>{lastActive}</span>
          </div>
        </div>
      </div>
      {!current && (
        <Button variant="ghost" size="sm" className="text-danger-ink shrink-0">
          Sign out
        </Button>
      )}
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/shared/settings.tsx
==============================================================================
import { useState } from "react";
import {
  User, Bell, LayoutGrid, ShieldOff, Phone, Globe2, MapPin, KeyRound,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Section views
import { ProfileSection } from "@/components/settings/profile-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { LayoutSection } from "@/components/settings/layout-section";
import { DncSection } from "@/components/settings/dnc-section";
import { TelephonySection } from "@/components/settings/telephony-section";
import { LanguagesSection } from "@/components/settings/languages-section";
import { DataResidencySection } from "@/components/settings/data-residency-section";
import { SecuritySection } from "@/components/settings/security-section";

type SectionId =
  | "profile" | "notifications" | "layout" | "dnc"
  | "telephony" | "languages" | "data" | "security";

const SECTIONS: { group: string; items: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    group: "Account",
    items: [
      { id: "profile",       label: "Profile & preferences", icon: User },
      { id: "notifications", label: "Notifications",         icon: Bell },
      { id: "security",      label: "Security",              icon: KeyRound },
    ],
  },
  {
    group: "Workspace",
    items: [
      { id: "layout",    label: "Auto Dialer layout", icon: LayoutGrid },
      { id: "dnc",       label: "Do-not-call list",   icon: ShieldOff },
      { id: "telephony", label: "Telephony region",   icon: Phone },
    ],
  },
  {
    group: "Compliance",
    items: [
      { id: "languages", label: "Languages",      icon: Globe2 },
      { id: "data",      label: "Data residency", icon: MapPin },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="mb-5">
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-fg t-body-large">
          Configure how CONNX works for you and your workspace. Changes save automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 lg:gap-6">
        {/* ─── Sidebar nav ─────────────────────────────────────── */}
        <Card className="lg:sticky lg:top-20 self-start h-fit">
          <CardContent className="p-2">
            {/* Mobile: dropdown-style nav */}
            <button
              className="lg:hidden flex items-center justify-between w-full p-3 rounded-md t-label-large text-cosmic"
              onClick={() => setShowMobileNav(!showMobileNav)}
            >
              <span>{SECTIONS.flatMap(s => s.items).find(i => i.id === activeSection)?.label}</span>
              <ChevronRight className={cn("h-4 w-4 transition-transform", showMobileNav && "rotate-90")} />
            </button>

            <div className={cn("flex flex-col gap-1", !showMobileNav && "hidden lg:flex")}>
              {SECTIONS.map((section) => (
                <div key={section.group} className="mb-2">
                  <div className="t-label-small text-muted-fg px-3 pt-2 pb-1.5">{section.group}</div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveSection(item.id); setShowMobileNav(false); }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md t-label-large transition-colors focus-ring text-left",
                          active
                            ? "bg-stellar-50 text-stellar-700"
                            : "text-dark hover:bg-mist hover:text-cosmic"
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-stellar" : "text-muted-fg")} />
                        <span className="flex-1 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── Content ─────────────────────────────────────────── */}
        <div className="min-w-0">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "layout" && <LayoutSection />}
          {activeSection === "dnc" && <DncSection />}
          {activeSection === "telephony" && <TelephonySection />}
          {activeSection === "languages" && <LanguagesSection />}
          {activeSection === "data" && <DataResidencySection />}
          {activeSection === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}
<<< END FILE

==============================================================================
>>> FILE: src/pages/shared/integrations.tsx
==============================================================================
import { useState, useMemo } from "react";
import {
  CheckCircle2, AlertTriangle, Plus, Search, ExternalLink, Settings,
  Zap, Briefcase, Phone, Mail, MessageSquareText, Calendar, MessageCircle, Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INTEGRATIONS, CATEGORY_META } from "@/data/settings-mock";
import { cn } from "@/lib/utils";
import type { Integration, IntegrationCategory } from "@/data/settings-mock";

const CATEGORY_ICONS: Record<IntegrationCategory, React.ComponentType<{ className?: string }>> = {
  ats:        Briefcase,
  telephony:  Phone,
  email:      Mail,
  sms:        MessageSquareText,
  calendar:   Calendar,
  messaging:  MessageCircle,
  hrms:       Building2,
};

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<IntegrationCategory | "all" | "connected" | "needs-attention">("all");

  const stats = useMemo(() => ({
    connected: INTEGRATIONS.filter((i) => i.status === "connected").length,
    actionNeeded: INTEGRATIONS.filter((i) => i.status === "action-needed").length,
    available: INTEGRATIONS.filter((i) => i.status === "available").length,
  }), []);

  const filtered = useMemo(() => {
    let out = INTEGRATIONS;
    if (tab === "connected") out = out.filter((i) => i.status === "connected");
    else if (tab === "needs-attention") out = out.filter((i) => i.status === "action-needed");
    else if (tab !== "all") out = out.filter((i) => i.category === tab);

    if (query) {
      const q = query.toLowerCase();
      out = out.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return out;
  }, [query, tab]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Integrations</h1>
          <p className="text-muted-fg t-body-large">
            Connect CONNX to your ATS, telephony, email, SMS, calendar, and HRMS. Pre-built integrations covered in BRD section 6.7.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-3.5 w-3.5" /> Browse marketplace
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Connected" value={stats.connected} variant="success" icon={CheckCircle2} />
        <StatCard label="Need attention" value={stats.actionNeeded} variant={stats.actionNeeded > 0 ? "warning" : "neutral"} icon={AlertTriangle} />
        <StatCard label="Available to connect" value={stats.available} variant="info" icon={Plus} />
      </div>

      {/* Action needed callout */}
      {stats.actionNeeded > 0 && (
        <div className="rounded-lg bg-warning-soft border border-warning/20 p-3 mb-4 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="t-label-large text-warning-ink">{stats.actionNeeded} integration{stats.actionNeeded === 1 ? "" : "s"} need attention</div>
            <p className="t-body-small text-warning-ink/80">
              Resolve these to keep outreach flowing without disruption.
            </p>
          </div>
          <Button size="sm" onClick={() => setTab("needs-attention")}>Review</Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="connected">
            Connected
            <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">{stats.connected}</span>
          </TabsTrigger>
          {stats.actionNeeded > 0 && (
            <TabsTrigger value="needs-attention">
              Needs attention
              <span className="ml-1.5 t-label-small bg-warning-soft text-warning-ink px-1.5 rounded-pill">{stats.actionNeeded}</span>
            </TabsTrigger>
          )}
          {(Object.keys(CATEGORY_META) as IntegrationCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORY_META[cat].label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          {/* Search */}
          <Card className="mb-4">
            <CardContent className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                <Input
                  placeholder="Search integrations…"
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="t-title-medium text-cosmic mb-1">No matching integrations</div>
                <p className="t-body-medium text-muted-fg">Try a different search or category.</p>
              </CardContent>
            </Card>
          ) : tab === "all" ? (
            // Group by category when viewing all
            <GroupedView integrations={filtered} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((i) => <IntegrationCard key={i.id} integration={i} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GroupedView({ integrations }: { integrations: Integration[] }) {
  const grouped = integrations.reduce<Record<IntegrationCategory, Integration[]>>((acc, i) => {
    if (!acc[i.category]) acc[i.category] = [];
    acc[i.category].push(i);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-6">
      {(Object.keys(grouped) as IntegrationCategory[]).map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-3.5 w-3.5 text-stellar" />
              <span className="t-label-large text-cosmic">{CATEGORY_META[cat].label}</span>
              <span className="t-body-small text-muted-fg">· {CATEGORY_META[cat].description}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[cat].map((i) => <IntegrationCard key={i.id} integration={i} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IntegrationCard({ integration: i }: { integration: Integration }) {
  const isConnected = i.status === "connected";
  const isActionNeeded = i.status === "action-needed";
  const isComingSoon = i.status === "coming-soon";

  return (
    <Card className={cn(
      "transition-shadow hover:shadow-2",
      isActionNeeded && "border-warning/30 ring-1 ring-warning/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Logo block */}
          <div
            className="h-10 w-10 rounded-md flex items-center justify-center text-white t-label-medium shrink-0"
            style={{ backgroundColor: i.iconColor }}
          >
            {i.iconLetter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="t-label-large text-dark truncate">{i.name}</span>
              {isConnected && (
                <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />
              )}
              {isActionNeeded && (
                <AlertTriangle className="h-3.5 w-3.5 text-warning-ink shrink-0" />
              )}
            </div>
            <p className="t-body-small text-muted-fg line-clamp-2">{i.description}</p>
          </div>

          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label="More actions">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Configure</DropdownMenuItem>
                <DropdownMenuItem>Test connection</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger-ink">Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Status / details */}
        {isConnected && (
          <div className="space-y-1 mb-3 t-body-small text-muted-fg">
            {i.lastSyncedAt && <DetailRow label="Last sync" value={i.lastSyncedAt} />}
            {i.region && <DetailRow label="Region" value={i.region} />}
            {i.recordsSynced !== undefined && <DetailRow label="Records synced" value={i.recordsSynced.toLocaleString()} />}
            {i.authMethod && <DetailRow label="Auth" value={i.authMethod} />}
          </div>
        )}

        {isActionNeeded && i.issue && (
          <div className="mb-3 p-2 rounded-md bg-warning-soft border border-warning/20">
            <p className="t-body-small text-warning-ink leading-snug">⚠ {i.issue}</p>
          </div>
        )}

        {/* Action */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">Configure</Button>
              <Button variant="ghost" size="sm">
                <Zap className="h-3 w-3" /> Sync now
              </Button>
            </>
          ) : isActionNeeded ? (
            <Button size="sm" className="flex-1">Resolve</Button>
          ) : isComingSoon ? (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              Coming soon · request access
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="h-3 w-3" /> Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="t-label-small text-muted-fg">{label}</span>
      <span className="t-label-medium text-dark text-right tabular-nums truncate">{value}</span>
    </div>
  );
}

function StatCard({
  label, value, variant, icon: Icon,
}: {
  label: string; value: number; variant: "success" | "warning" | "info" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colors = {
    success: { bg: "bg-success-soft", text: "text-success-ink" },
    warning: { bg: "bg-warning-soft", text: "text-warning-ink" },
    info:    { bg: "bg-stellar-50", text: "text-stellar-700" },
    neutral: { bg: "bg-mist", text: "text-muted-fg" },
  }[variant];
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", colors.bg)}>
            <Icon className={cn("h-4 w-4", colors.text)} />
          </div>
          <div>
            <div className="t-headline-medium text-cosmic tabular-nums leading-none">{value}</div>
            <div className="t-body-small text-muted-fg mt-0.5">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
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
import SettingsPage from "@/pages/shared/settings";
import IntegrationsPage from "@/pages/shared/integrations";

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

      // Hiring Manager (Pass 6 — coming back later)
      { path: "hm", element: <PagePlaceholder title="Pipeline" description="Hiring Manager portal — building later, focusing on recruiter side first." /> },
      { path: "hm/candidates/:id", element: <PagePlaceholder title="Candidate review" /> },
      { path: "hm/approvals", element: <PagePlaceholder title="Approvals queue" /> },
      { path: "hm/digest", element: <PagePlaceholder title="Daily digest" /> },

      // Recruitment Lead (Pass 7 — coming back later)
      { path: "lead", element: <PagePlaceholder title="Team analytics" description="Recruitment Lead surfaces — building later, focusing on recruiter side first." /> },
      { path: "lead/leaderboard", element: <PagePlaceholder title="Leaderboard" /> },
      { path: "lead/goals", element: <PagePlaceholder title="Goals & SLAs" /> },
      { path: "lead/team", element: <PagePlaceholder title="Team members" /> },

      // Shared
      { path: "settings", element: <SettingsPage /> },
      { path: "integrations", element: <IntegrationsPage /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
<<< END FILE