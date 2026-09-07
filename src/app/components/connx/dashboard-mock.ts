export interface RolePipeline {
  roleId: string;
  title: string;
  team: string;
  shortlisted: number;
  consented: number;
  screened: number;
  advanced: number;
  health: "on-track" | "at-risk" | "stalled";
  daysOpen: number;
}

export const ROLE_PIPELINES: RolePipeline[] = [
  { roleId: "role-1", title: "Senior Backend Engineer", team: "Platform", shortlisted: 24, consented: 17, screened: 9, advanced: 4, health: "on-track", daysOpen: 23 },
  { roleId: "role-2", title: "Staff Product Designer", team: "Product", shortlisted: 18, consented: 12, screened: 6, advanced: 2, health: "on-track", daysOpen: 13 },
  { roleId: "role-3", title: "Senior Data Scientist", team: "Data", shortlisted: 32, consented: 22, screened: 14, advanced: 6, health: "on-track", daysOpen: 30 },
  { roleId: "role-4", title: "Enterprise Account Executive", team: "Sales", shortlisted: 41, consented: 28, screened: 18, advanced: 5, health: "at-risk", daysOpen: 17 },
  { roleId: "role-5", title: "Site Reliability Engineer", team: "Platform", shortlisted: 15, consented: 9, screened: 3, advanced: 1, health: "on-track", daysOpen: 10 },
  { roleId: "role-6", title: "Engineering Manager, Mobile", team: "Product", shortlisted: 12, consented: 7, screened: 2, advanced: 0, health: "at-risk", daysOpen: 7 },
];

export interface CallbackItem {
  id: string;
  candidateName: string;
  candidateId: string;
  roleTitle: string;
  scheduledAt: string;
  category: "overdue" | "today" | "upcoming";
  attempts: number;
}

export const CALLBACKS: CallbackItem[] = [
  { id: "cb-1", candidateName: "Aisha Okafor", candidateId: "cand-1001", roleTitle: "Senior Backend Engineer", scheduledAt: "Yesterday, 4:00 PM", category: "overdue", attempts: 2 },
  { id: "cb-2", candidateName: "Tariq Hassan", candidateId: "cand-1004", roleTitle: "Senior Backend Engineer", scheduledAt: "2 days ago, 10:30 AM", category: "overdue", attempts: 1 },
  { id: "cb-3", candidateName: "Yuki Tanaka", candidateId: "cand-1010", roleTitle: "Senior Backend Engineer", scheduledAt: "Today, 3:30 PM", category: "today", attempts: 1 },
  { id: "cb-4", candidateName: "Marcus Reyes", candidateId: "cand-1012", roleTitle: "Staff Product Designer", scheduledAt: "Today, 5:00 PM", category: "today", attempts: 0 },
  { id: "cb-5", candidateName: "Naomi Petrov", candidateId: "cand-1015", roleTitle: "Senior Backend Engineer", scheduledAt: "Tomorrow, 11:00 AM", category: "upcoming", attempts: 0 },
  { id: "cb-6", candidateName: "Diego Mendoza", candidateId: "cand-1020", roleTitle: "Engineering Manager, Mobile", scheduledAt: "Tomorrow, 2:00 PM", category: "upcoming", attempts: 0 },
  { id: "cb-7", candidateName: "Felix Lindqvist", candidateId: "cand-1018", roleTitle: "Site Reliability Engineer", scheduledAt: "Thu, 9:30 AM", category: "upcoming", attempts: 0 },
];

export interface LeoSuggestion {
  id: string;
  type: "best-time" | "stalled-role" | "ready-to-call" | "follow-up" | "hot-candidate";
  headline: string;
  detail: string;
  cta: string;
  ctaPath: string;
  urgency: "now" | "soon" | "info";
}

export const LEO_SUGGESTIONS: LeoSuggestion[] = [
  { id: "leo-1", type: "best-time", headline: "Prime calling window opens in 5 min", detail: "Your connect rate jumps to 64% on Tuesdays between 10:30 AM and 12:00 PM. 8 consented candidates are waiting.", cta: "Start dialer", ctaPath: "/dialer", urgency: "now" },
  { id: "leo-2", type: "stalled-role", headline: "Engineering Manager, Mobile is at risk", detail: "12 candidates shortlisted, only 7 consented. Consent rate is 58% — well below your 71% average for this role family.", cta: "Resend consent", ctaPath: "/consent", urgency: "soon" },
  { id: "leo-3", type: "follow-up", headline: "5 consents pending 48+ hours", detail: "Senior Backend Engineer — likely to expire by Friday without a nudge.", cta: "Send SMS reminder", ctaPath: "/bulk", urgency: "soon" },
];
