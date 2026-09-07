export type ConsentStatus = "pending" | "accepted" | "declined" | "expired" | "scheduled";
export type RoleStage = "shortlisted" | "consented" | "screened" | "advanced" | "rejected";

export interface RoleDetail {
  id: string;
  title: string;
  team: string;
  location: string;
  jdSummary: string;
  jdFull: string;
  hiringManager: string;
  openedAt: string;
  targetCount: number;
  rejected: number;
  screeningQuestions: { id: string; question: string; required: boolean }[];
}

const DEFAULT_JD_FULL = `What you'll do
• Own the technical roadmap end-to-end across distributed services.
• Partner with product and design to scope ambiguous problems.
• Coach mid-level engineers and raise the bar through code review.

What we're looking for
• 7+ years of relevant production experience.
• Strong fundamentals in systems design, observability, and on-call ownership.
• A track record of shipping reliable software at scale.

Compensation
• Competitive base + equity, banded against the top quartile for the role.

Interview process
• 30-min recruiter screen → 60-min technical screen → onsite (4 sessions).`;

const DEFAULT_QUESTIONS = [
  { id: "q1", question: "Walk me through a system you've designed end-to-end. What were the trade-offs?", required: true },
  { id: "q2", question: "How do you approach observability and on-call ownership?", required: true },
  { id: "q3", question: "What's your compensation expectation and earliest start date?", required: true },
  { id: "q4", question: "Anything you'd want to ask the hiring manager?", required: false },
];

export const ROLES: RoleDetail[] = [
  { id: "role-1", title: "Senior Backend Engineer", team: "Platform", location: "Remote · US", jdSummary: "Build and operate distributed services powering our climate ingest pipeline. Go, Postgres, Kubernetes.", jdFull: DEFAULT_JD_FULL, hiringManager: "Priya Sundaram", openedAt: "2026-04-12", targetCount: 3, rejected: 8, screeningQuestions: DEFAULT_QUESTIONS },
  { id: "role-2", title: "Staff Product Designer", team: "Product", location: "Hybrid · NYC", jdSummary: "Lead end-to-end design for the recruiter workspace. Drive systems thinking and partner closely with PM and eng.", jdFull: DEFAULT_JD_FULL, hiringManager: "Marcus Reyes", openedAt: "2026-04-22", targetCount: 1, rejected: 4, screeningQuestions: DEFAULT_QUESTIONS },
  { id: "role-3", title: "Senior Data Scientist", team: "Data", location: "Remote · EMEA", jdSummary: "Forecasting models for emissions data. Python, Spark, causal inference.", jdFull: DEFAULT_JD_FULL, hiringManager: "Sofia Andersen", openedAt: "2026-04-05", targetCount: 2, rejected: 6, screeningQuestions: DEFAULT_QUESTIONS },
  { id: "role-4", title: "Enterprise Account Executive", team: "Sales", location: "Onsite · London", jdSummary: "Own enterprise pipeline across EMEA. 8+ years closing $500k+ ACV deals.", jdFull: DEFAULT_JD_FULL, hiringManager: "Diego Mendoza", openedAt: "2026-04-18", targetCount: 2, rejected: 9, screeningQuestions: DEFAULT_QUESTIONS },
  { id: "role-5", title: "Site Reliability Engineer", team: "Platform", location: "Remote · US", jdSummary: "Operate global infra. Terraform, Datadog, on-call rotation 1-in-6.", jdFull: DEFAULT_JD_FULL, hiringManager: "Priya Sundaram", openedAt: "2026-04-25", targetCount: 1, rejected: 3, screeningQuestions: DEFAULT_QUESTIONS },
  { id: "role-6", title: "Engineering Manager, Mobile", team: "Product", location: "Hybrid · SF", jdSummary: "Lead 6-engineer mobile team across iOS and Android. Coach senior ICs into staff range.", jdFull: DEFAULT_JD_FULL, hiringManager: "Marcus Reyes", openedAt: "2026-04-28", targetCount: 1, rejected: 2, screeningQuestions: DEFAULT_QUESTIONS },
];

export interface CandidateRow {
  id: string;
  roleId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  consentStatus: ConsentStatus;
  consentRespondedAt?: string;
  stage: RoleStage;
  source: "Workday" | "Greenhouse" | "Lever" | "iCIMS";
  skills: string[];
  yearsExperience: number;
  resumeSummary: string;
  resumeBullets: string[];
  lastActivity: string;
  shortlistedAt: string;
}

const FIRST = ["Aisha", "Owen", "Tariq", "Felix", "Naomi", "Diego", "Yuki", "Marcus", "Priya", "Sofia", "Jonas", "Mira", "Liam", "Hana", "Kenji", "Zara", "Nikhil", "Elena", "Rafael", "Ines"];
const LAST = ["Okafor", "Walsh", "Hassan", "Lindqvist", "Petrov", "Mendoza", "Tanaka", "Reyes", "Sundaram", "Andersen", "Petrov", "Solberg", "Park", "Yamada", "Ito", "Khan", "Patel", "Nikova", "Costa", "Silva"];
const COMPANIES = ["Stripe", "Datadog", "Figma", "Notion", "Vercel", "Cloudflare", "Linear", "Anthropic", "Plaid", "Ramp"];
const ROLES_TXT = ["Senior Engineer", "Staff Engineer", "Lead Designer", "Principal Engineer", "Senior Designer", "Engineering Manager", "Sr Data Scientist", "Account Executive"];
const CITIES = ["San Francisco, CA", "New York, NY", "Austin, TX", "Berlin, DE", "London, UK", "Stockholm, SE", "Toronto, CA", "Amsterdam, NL"];
const SKILLS = ["Go", "Python", "TypeScript", "Kubernetes", "Postgres", "Figma", "React", "Spark", "GCP", "AWS"];
const SOURCES: CandidateRow["source"][] = ["Workday", "Greenhouse", "Lever", "iCIMS"];
const CONSENT: ConsentStatus[] = ["pending", "accepted", "accepted", "accepted", "declined", "expired", "scheduled"];
const STAGES: RoleStage[] = ["shortlisted", "shortlisted", "consented", "consented", "screened", "advanced", "rejected"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

export const CANDIDATES: CandidateRow[] = (() => {
  const out: CandidateRow[] = [];
  ROLES.forEach((r, ri) => {
    const count = [24, 18, 32, 41, 15, 12][ri] ?? 12;
    for (let i = 0; i < count; i++) {
      const idx = ri * 50 + i;
      const name = `${pick(FIRST, idx)} ${pick(LAST, idx + 3)}`;
      const company = pick(COMPANIES, idx);
      const consent = pick(CONSENT, idx);
      const phoneTail = String(1000 + idx).slice(-4);
      out.push({
        id: `cand-${idx + 1000}`,
        roleId: r.id,
        name,
        phone: `+1 (628) 555-${phoneTail}`,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
        location: pick(CITIES, idx + 1),
        currentRole: pick(ROLES_TXT, idx + 2),
        currentCompany: company,
        consentStatus: consent,
        consentRespondedAt: consent === "accepted" ? "2026-05-03T14:22:00Z" : consent === "declined" ? "2026-05-02T11:08:00Z" : undefined,
        stage: pick(STAGES, idx + ri),
        source: pick(SOURCES, idx),
        skills: [pick(SKILLS, idx), pick(SKILLS, idx + 3), pick(SKILLS, idx + 5)],
        yearsExperience: 5 + (idx % 10),
        resumeSummary: `${5 + (idx % 10)}+ years building production systems. Currently ${pick(ROLES_TXT, idx + 2)} at ${company}, leading initiatives across ${pick(SKILLS, idx)} and ${pick(SKILLS, idx + 3)}.`,
        resumeBullets: [
          `Led migration to ${pick(SKILLS, idx)} reducing latency 40% across the ingestion path.`,
          `Mentored 4 engineers; two promoted to senior in the last cycle.`,
          `Owned on-call rotation and reduced page volume by 35% via SLO-driven alerting.`,
          `Shipped redesign of customer-facing dashboard, +18% engagement.`,
        ],
        lastActivity: pick(["2h ago", "Yesterday", "3d ago", "1w ago", "Today"], idx),
        shortlistedAt: pick(["Apr 28", "Apr 25", "Apr 22", "Apr 18", "Apr 12"], idx),
      });
    }
  });
  return out;
})();

export type TemplateChannel = "sms" | "email" | "voicemail" | "screening";
export type TemplateStage = "consent" | "follow-up" | "screening" | "offer" | "rejection" | "general";

export interface Template {
  id: string;
  name: string;
  channel: TemplateChannel;
  stage: TemplateStage;
  subject?: string;
  body: string;
  description: string;
  rolesUsed: number;
  lastUsed?: string;
  isFavorite?: boolean;
  isLocked?: boolean;
}

export const TEMPLATES: Template[] = [
  { id: "tpl-1", name: "Initial consent request", channel: "sms", stage: "consent", body: "Hi {{firstName}}, this is {{recruiterFirstName}} from {{orgName}}. We'd love to chat about the {{roleTitle}} role. Reply YES to consent, or visit {{consentLink}}. Reply STOP to opt out.", description: "Default consent SMS sent automatically when candidate is shortlisted.", rolesUsed: 6, lastUsed: "12 minutes ago", isFavorite: true, isLocked: true },
  { id: "tpl-2", name: "Consent reminder — 48 hours", channel: "sms", stage: "follow-up", body: "Hi {{firstName}}, gentle nudge — we'd still love to chat about {{roleTitle}} at {{orgName}}. Pick a time: {{consentLink}}.", description: "Friendly nudge for candidates who haven't responded in 48 hours.", rolesUsed: 4, lastUsed: "2 hours ago" },
  { id: "tpl-3", name: "Callback confirmation", channel: "sms", stage: "follow-up", body: "Hi {{firstName}}, confirming our call for {{callbackTime}}. I'll dial {{phone}}. — {{recruiterFirstName}}.", description: "Sent automatically when a callback is scheduled.", rolesUsed: 5, lastUsed: "Yesterday" },
  { id: "tpl-4", name: "Initial consent — email", channel: "email", stage: "consent", subject: "Quick question about the {{roleTitle}} role at {{orgName}}", body: `Hi {{firstName}},\n\nI came across your profile while searching for our {{roleTitle}} role on the {{teamName}} team at {{orgName}}.\n\n• {{jdSummary}}\n• {{location}}\n\nIf you're open: {{consentLink}}\n\nBest,\n{{recruiterFirstName}}`, description: "Default consent email — branded HTML template.", rolesUsed: 6, lastUsed: "1 hour ago", isFavorite: true, isLocked: true },
  { id: "tpl-5", name: "Post-screening — advance", channel: "email", stage: "screening", subject: "Next steps for {{roleTitle}}", body: `Hi {{firstName}},\n\nReally enjoyed our conversation. The team is excited to move forward — onsite invite to follow.\n\nBest,\n{{recruiterFirstName}}`, description: "Sent after a successful screening when advancing the candidate.", rolesUsed: 4, lastUsed: "Yesterday" },
  { id: "tpl-6", name: "Polite rejection — post-screening", channel: "email", stage: "rejection", subject: "Update on the {{roleTitle}} role at {{orgName}}", body: `Hi {{firstName}},\n\nThank you for taking the time to chat. We've decided to move forward with other candidates whose experience more closely matches what we're looking for at this moment.\n\nWishing you the best.\n\nSincerely,\n{{recruiterFirstName}}`, description: "Respectful rejection email post-screening.", rolesUsed: 6, lastUsed: "3 days ago" },
  { id: "tpl-7", name: "Standard voicemail drop", channel: "voicemail", stage: "follow-up", body: `Hi {{firstName}}, this is {{recruiterFullName}} from {{orgName}}. I was hoping to chat about the {{roleTitle}} role. I'll send a text with a link to pick a time. Or call back on {{recruiterCallback}}.`, description: "Pre-recorded voicemail dropped automatically on no-answer.", rolesUsed: 6, lastUsed: "1 hour ago", isLocked: true },
  { id: "tpl-8", name: "Senior Backend Engineer screen", channel: "screening", stage: "screening", body: `1. Walk me through a distributed system you've designed end-to-end. Trade-offs?\n2. How do you approach observability in a high-throughput service?\n3. Are you comfortable with on-call (1 in 6)?\n4. Compensation expectations?\n5. Earliest start date?`, description: "Standard 5-question screening for senior backend roles.", rolesUsed: 1, lastUsed: "2 hours ago" },
  { id: "tpl-9", name: "Staff Designer screen", channel: "screening", stage: "screening", body: `1. Walk me through a project you owned end-to-end. What did you change?\n2. How do you partner with eng when requirements are unclear?\n3. Stance on design systems — when invest, when not?\n4. Compensation expectations?`, description: "4-question screen for staff and principal designers.", rolesUsed: 1, lastUsed: "Yesterday" },
];

export type AuditAction = "consent-sent" | "consent-resent" | "consent-accepted" | "consent-declined" | "consent-expired" | "callback-requested" | "opt-out" | "language-changed" | "reminder-sent";

export interface AuditEntry {
  id: string;
  candidateId: string;
  candidateName: string;
  roleId: string;
  roleTitle: string;
  action: AuditAction;
  at: string;
  channel: "sms" | "email" | "system";
  detail?: string;
}

export const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", candidateId: "cand-1001", candidateName: "Aisha Okafor", roleId: "role-1", roleTitle: "Senior Backend Engineer", action: "consent-sent", at: "Today, 9:14 AM", channel: "sms", detail: "Initial consent request via SMS · template: \"Initial consent request\"" },
  { id: "a2", candidateId: "cand-1001", candidateName: "Aisha Okafor", roleId: "role-1", roleTitle: "Senior Backend Engineer", action: "consent-sent", at: "Today, 9:14 AM", channel: "email", detail: "Initial consent request via email" },
  { id: "a3", candidateId: "cand-1003", candidateName: "Owen Walsh", roleId: "role-1", roleTitle: "Senior Backend Engineer", action: "consent-accepted", at: "Today, 8:42 AM", channel: "sms", detail: "Accepted via SMS reply \"YES\". IP: 73.142.18.91" },
  { id: "a4", candidateId: "cand-1024", candidateName: "Felix Lindqvist", roleId: "role-2", roleTitle: "Staff Product Designer", action: "consent-declined", at: "Today, 8:01 AM", channel: "sms", detail: "Declined via SMS reply \"STOP\". Auto-suppressed for this role." },
  { id: "a5", candidateId: "cand-1018", candidateName: "Tariq Hassan", roleId: "role-1", roleTitle: "Senior Backend Engineer", action: "reminder-sent", at: "Yesterday, 4:30 PM", channel: "sms", detail: "48-hour reminder sent · template: \"Consent reminder — 48 hours\"" },
  { id: "a6", candidateId: "cand-1027", candidateName: "Sofia Andersen", roleId: "role-3", roleTitle: "Senior Data Scientist", action: "consent-expired", at: "Yesterday, 11:00 AM", channel: "system", detail: "Consent expired after 72 hours. Eligible for re-consent." },
  { id: "a7", candidateId: "cand-1032", candidateName: "Jonas Petrov", roleId: "role-4", roleTitle: "Enterprise Account Executive", action: "callback-requested", at: "Yesterday, 10:14 AM", channel: "sms", detail: "Requested callback for Thursday 2:00 PM via consent page." },
  { id: "a8", candidateId: "cand-1035", candidateName: "Mira Solberg", roleId: "role-1", roleTitle: "Senior Backend Engineer", action: "opt-out", at: "Mon, 3:21 PM", channel: "sms", detail: "Permanent opt-out. Added to org-wide DNC list." },
];

export const STAGE_LABELS: Record<RoleStage, string> = {
  shortlisted: "Shortlisted",
  consented: "Consented",
  screened: "Screened",
  advanced: "Advanced",
  rejected: "Rejected",
};

export const CONSENT_LABELS: Record<ConsentStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  scheduled: "Scheduled",
};
