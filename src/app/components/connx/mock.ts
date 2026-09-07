export const ORG = {
  name: "Northwind Labs",
  industry: "Climate technology",
  size: "600 employees",
};

export const CURRENT_RECRUITER = {
  id: "rec-jordan",
  name: "Jordan Chen",
  email: "jordan@northwind.com",
  team: "Engineering Talent",
};

export const TODAY_METRICS = {
  callsMade: 31,
  candidatesReached: 18,
  screeningsCompleted: 12,
  shortlisted: 5,
  rejected: 4,
  voicemailDropped: 9,
  avgCallDurationSec: 487,
  connectRate: 0.58,
};

export const RECENT_ACTIVITY = [
  { id: "act-1", type: "screening-complete", text: "Screened Priya Sundaram for Staff Product Designer", at: "12 minutes ago", outcome: "shortlisted" as const },
  { id: "act-2", type: "consent-accepted", text: "Owen Walsh accepted consent for Senior Backend Engineer", at: "34 minutes ago" },
  { id: "act-3", type: "voicemail", text: "Voicemail dropped for Tariq Hassan", at: "1 hour ago" },
  { id: "act-4", type: "screening-complete", text: "Screened Felix Lindqvist for Senior Backend Engineer", at: "2 hours ago", outcome: "rejected" as const },
  { id: "act-5", type: "callback-scheduled", text: "Callback scheduled with Naomi Petrov tomorrow at 11am", at: "2 hours ago" },
  { id: "act-6", type: "bulk-sent", text: "Sent SMS reminder to 8 non-responding candidates", at: "3 hours ago" },
];

export const GOALS = {
  daily: { target: 35, actual: 31 },
  weekly: { target: 175, actual: 134 },
  monthly: { target: 700, actual: 542 },
};

export const TODAY_ACTIONS = [
  { id: "act-1", type: "callback" as const, candidateName: "Aisha Okafor", roleTitle: "Senior Backend Engineer", at: "10:30 AM", urgency: "high" as const },
  { id: "act-2", type: "call" as const, candidateName: "Marcus Reyes", roleTitle: "Staff Product Designer", at: "11:00 AM", urgency: "medium" as const },
  { id: "act-3", type: "consent-followup" as const, candidateName: "5 candidates", roleTitle: "Senior Backend Engineer", at: "Pending 48h+", urgency: "medium" as const },
  { id: "act-4", type: "call" as const, candidateName: "Diego Mendoza", roleTitle: "Engineering Manager, Mobile", at: "2:00 PM", urgency: "low" as const },
  { id: "act-5", type: "callback" as const, candidateName: "Yuki Tanaka", roleTitle: "Senior Backend Engineer", at: "3:30 PM", urgency: "medium" as const },
];

export const WEEK_TREND = [
  { day: "Mon", calls: 28, screened: 11 },
  { day: "Tue", calls: 35, screened: 14 },
  { day: "Wed", calls: 42, screened: 17 },
  { day: "Thu", calls: 31, screened: 12 },
  { day: "Fri", calls: 38, screened: 15 },
  { day: "Sat", calls: 8, screened: 3 },
  { day: "Sun", calls: 0, screened: 0 },
];

export const HEATMAP_DATA: number[][] = (() => {
  const days = 7, hours = 12;
  const out: number[][] = [];
  for (let d = 0; d < days; d++) {
    const row: number[] = [];
    for (let h = 0; h < hours; h++) {
      const isWeekday = d >= 1 && d <= 4;
      const isPrime = (h >= 1 && h <= 3) || (h >= 5 && h <= 7);
      const base = isWeekday && isPrime ? 0.55 : isWeekday ? 0.32 : d === 5 ? 0.18 : 0.05;
      row.push(Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.2)));
    }
    out.push(row);
  }
  return out;
})();

export function initials(name: string): string {
  return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
}
