import { CANDIDATES, type CandidateRow } from "../pass3-mock";

export type Panel = "metadata" | "resume" | "questions" | "notes" | "jd";
export type Zone = "A" | "B" | "C";
export type LayoutPref = Record<Zone, Panel>;
export type CallDisposition = "shortlisted" | "callback" | "on-hold" | "rejected" | null;
export type LiveStatus = "completed" | "current" | "pending" | "skipped";

export const PANEL_META: Record<Panel, {
  label: string;
  shortLabel: string;
  description: string;
  defaultZone: Zone;
  iconName: "Briefcase" | "FileText" | "ListChecks" | "PenLine" | "ClipboardList";
}> = {
  metadata:  { label: "Candidate metadata",  shortLabel: "Metadata",  description: "Name, contact, source, consent timestamp", defaultZone: "B", iconName: "Briefcase" },
  resume:    { label: "Resume",              shortLabel: "Resume",    description: "Full CV from ATS",                       defaultZone: "A", iconName: "FileText" },
  questions: { label: "Screening questions", shortLabel: "Questions", description: "Role-specific question set",             defaultZone: "B", iconName: "ListChecks" },
  notes:     { label: "Notes",               shortLabel: "Notes",     description: "Auto-saved scratchpad",                  defaultZone: "C", iconName: "PenLine" },
  jd:        { label: "Job description",     shortLabel: "JD",        description: "Full role description",                  defaultZone: "C", iconName: "ClipboardList" },
};

export const DEFAULT_LAYOUT: LayoutPref = { A: "resume", B: "questions", C: "notes" };

export const ZONE_META: Record<Zone, { label: string; widthPct: number; description: string }> = {
  A: { label: "Primary",   widthPct: 50, description: "Dominant panel · main reference during the call" },
  B: { label: "Secondary", widthPct: 30, description: "Supporting context · consulted frequently" },
  C: { label: "Tertiary",  widthPct: 20, description: "Quick-glance or write zone · compact info or input" },
};

export function getQueueCandidates(roleId: string): CandidateRow[] {
  return CANDIDATES.filter(
    (c) => c.roleId === roleId && c.consentStatus === "accepted" && c.stage === "consented"
  );
}

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
    // ignore quota errors
  }
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function timeAgo(iso?: string): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
