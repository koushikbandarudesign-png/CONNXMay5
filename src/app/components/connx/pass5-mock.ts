import { CANDIDATES, type CandidateRow } from "./pass3-mock";

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
  delivered?: number;
  opened?: number;
  clicked?: number;
  replied?: number;
  bounced?: number;
  optedOut?: number;
}

export const CAMPAIGNS: Campaign[] = [
  { id: "camp-1", name: "48h consent reminder · Senior Backend Engineer", channel: "sms",   status: "completed", segment: "Pending consent · 48h+", recipients: 8,  createdAt: "Today, 9:00 AM",      sentAt: "Today, 9:01 AM",      delivered: 8,  opened: 0,  clicked: 5,  replied: 3, bounced: 0, optedOut: 0 },
  { id: "camp-2", name: "Q4 Engineering opportunities digest",            channel: "email", status: "completed", segment: "All consented · last 30 days", recipients: 47, createdAt: "Yesterday, 4:30 PM",  sentAt: "Yesterday, 5:00 PM",  delivered: 46, opened: 31, clicked: 18, replied: 4, bounced: 1, optedOut: 0 },
  { id: "camp-3", name: "Re-engagement · expired consents",               channel: "email", status: "scheduled", segment: "Expired consent · last 90 days", recipients: 23, createdAt: "Today, 11:30 AM",     scheduledFor: "Tomorrow, 9:00 AM" },
  { id: "camp-4", name: "Designer pipeline · open roles",                 channel: "email", status: "draft",     segment: "Design candidates · all stages", recipients: 18, createdAt: "2 days ago, 2:14 PM" },
  { id: "camp-5", name: "Interview prep · advanced candidates",           channel: "sms",   status: "completed", segment: "Advanced stage · all roles", recipients: 12, createdAt: "Mon, 10:30 AM",       sentAt: "Mon, 10:31 AM",       delivered: 12, opened: 0,  clicked: 9,  replied: 7, bounced: 0, optedOut: 0 },
];

export interface Segment {
  id: string;
  name: string;
  description: string;
  candidateCount: number;
  isDynamic: boolean;
  isSystem?: boolean;
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

export type TimelineEventType =
  | "call" | "voicemail" | "sms" | "email"
  | "consent-sent" | "consent-accepted" | "consent-declined"
  | "stage-change" | "note" | "ai-summary";

export interface TimelineEvent {
  id: string;
  candidateId: string;
  type: TimelineEventType;
  at: string;
  by?: string;
  content: string;
  meta?: {
    duration?: number;
    disposition?: "shortlisted" | "callback" | "on-hold" | "rejected";
    recordingAvailable?: boolean;
    direction?: "inbound" | "outbound";
    template?: string;
    subject?: string;
    opened?: boolean;
    openedAt?: string;
    from?: string;
    to?: string;
  };
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "te-1", candidateId: "cand-1003", type: "ai-summary", at: "Today, 11:24 AM", by: "LEO", content: "Strong fundamentals in distributed systems and Go. Communicates clearly, asked thoughtful questions about team structure and on-call expectations. Comp expectation: $215k base. Earliest start: 4 weeks. Recommend advance to onsite." },
  { id: "te-2", candidateId: "cand-1003", type: "call", at: "Today, 11:08 AM", by: "Jordan Chen", content: "Screening call · 24 minutes", meta: { duration: 1440, disposition: "shortlisted", recordingAvailable: true } },
  { id: "te-3", candidateId: "cand-1003", type: "note", at: "Today, 11:32 AM", by: "Jordan Chen", content: "Strong yes on technical depth. Asked great questions about reliability ownership model. Send to Priya for onsite scheduling — earliest availability week of the 18th." },
  { id: "te-4", candidateId: "cand-1003", type: "sms", at: "Today, 8:42 AM", by: "Owen Walsh", content: "YES", meta: { direction: "inbound" } },
  { id: "te-5", candidateId: "cand-1003", type: "consent-accepted", at: "Today, 8:42 AM", content: "Accepted consent via SMS reply. IP: 73.142.18.91" },
  { id: "te-6", candidateId: "cand-1003", type: "sms", at: "Today, 9:14 AM", by: "CONNX (auto)", content: "Hi Owen, this is Jordan from Northwind Labs. We're interested in speaking with you about the Senior Backend Engineer role. Would you be open to a brief screening call? Reply YES to consent, or visit northwind.connx.app/c/k7Yh2 to choose a time. Reply STOP to opt out.", meta: { direction: "outbound", template: "Initial consent request" } },
  { id: "te-7", candidateId: "cand-1003", type: "email", at: "Today, 9:14 AM", by: "CONNX (auto)", content: "Quick question about the Senior Backend Engineer role at Northwind Labs", meta: { direction: "outbound", subject: "Quick question about the Senior Backend Engineer role at Northwind Labs", opened: true, openedAt: "Today, 9:31 AM" } },
  { id: "te-8", candidateId: "cand-1003", type: "stage-change", at: "Today, 9:14 AM", by: "Priya Raman (HM)", content: "Shortlisted from Workday · matched 92% on JD criteria", meta: { from: "applicant", to: "shortlisted" } },
];

export function getTimelineForCandidate(candidateId: string): TimelineEvent[] {
  if (candidateId === "cand-1003") return TIMELINE_EVENTS;
  const candidate = CANDIDATES.find((c) => c.id === candidateId);
  if (!candidate) return [];

  const events: TimelineEvent[] = [];
  events.push({ id: `${candidateId}-stage`, candidateId, type: "stage-change", at: "9 days ago, 2:31 PM", by: "ATS sync", content: `Shortlisted from ${candidate.source}` });
  events.push({ id: `${candidateId}-consent-sms`, candidateId, type: "sms", at: "9 days ago, 2:32 PM", by: "CONNX (auto)", content: "Initial consent SMS sent", meta: { direction: "outbound" } });
  events.push({ id: `${candidateId}-consent-email`, candidateId, type: "email", at: "9 days ago, 2:32 PM", by: "CONNX (auto)", content: "Initial consent email sent", meta: { direction: "outbound", opened: true } });

  if (candidate.consentStatus === "accepted") {
    events.push({ id: `${candidateId}-accepted`, candidateId, type: "consent-accepted", at: "8 days ago, 11:14 AM", content: "Accepted consent via SMS" });
    if (candidate.stage === "advanced" || candidate.stage === "screened") {
      events.push({ id: `${candidateId}-call`, candidateId, type: "call", at: "3 days ago, 10:22 AM", by: "Jordan Chen", content: `Screening call · ${candidate.stage === "advanced" ? "advanced" : "completed"}`, meta: { duration: 1320, disposition: candidate.stage === "advanced" ? "shortlisted" : "on-hold" } });
    }
  } else if (candidate.consentStatus === "declined") {
    events.push({ id: `${candidateId}-declined`, candidateId, type: "consent-declined", at: "7 days ago, 4:21 PM", content: "Declined consent via SMS reply STOP" });
  }
  return events.reverse();
}
