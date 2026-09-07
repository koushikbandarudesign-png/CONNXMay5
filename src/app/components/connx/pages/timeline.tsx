import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search, MessageSquareText, Mail, Phone, ShieldCheck,
  Sparkles, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../../ui/select";
import { CANDIDATES, ROLES } from "../pass3-mock";
import { TIMELINE_EVENTS, getTimelineForCandidate, type TimelineEvent } from "../pass5-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

interface FlattenedEvent extends TimelineEvent {
  candidateName: string;
  candidateRole: string;
  roleTitle: string;
}

const TYPE_LABELS: Record<string, string> = {
  call: "Call", voicemail: "Voicemail", sms: "SMS", email: "Email",
  "consent-sent": "Consent sent", "consent-accepted": "Consent accepted", "consent-declined": "Consent declined",
  "stage-change": "Stage change", note: "Note", "ai-summary": "LEO summary",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone, voicemail: Phone, sms: MessageSquareText, email: Mail,
  "consent-sent": ShieldCheck, "consent-accepted": ShieldCheck, "consent-declined": ShieldCheck,
  "stage-change": ChevronRight, note: MessageSquareText, "ai-summary": Sparkles,
};

export default function TimelinePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const allEvents = useMemo<FlattenedEvent[]>(() => {
    const out: FlattenedEvent[] = [];
    const owen = CANDIDATES.find((c) => c.id === "cand-1003");
    if (owen) {
      const ownerRole = ROLES.find((r) => r.id === owen.roleId);
      TIMELINE_EVENTS.forEach((e) => out.push({ ...e, candidateName: owen.name, candidateRole: owen.currentRole, roleTitle: ownerRole?.title || "" }));
    }
    const others = CANDIDATES.filter((c) => c.id !== "cand-1003").slice(0, 8);
    others.forEach((c) => {
      const role = ROLES.find((r) => r.id === c.roleId);
      const events = getTimelineForCandidate(c.id);
      events.forEach((e) => out.push({ ...e, candidateName: c.name, candidateRole: c.currentRole, roleTitle: role?.title || "" }));
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

      <Card className="mb-4 shadow-cx-1">
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
            <Input placeholder="Search by candidate, role, or content…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
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

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="t-title-medium text-cosmic mb-1">No activity matches</div>
            <p className="t-body-medium text-muted-fg">Try clearing filters or a wider search.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-cx-1">
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

function ActivityRow({ event, isLast, onClick }: { event: FlattenedEvent; isLast: boolean; onClick: () => void }) {
  const Icon = TYPE_ICONS[event.type] || MessageSquareText;
  const isAiSummary = event.type === "ai-summary";
  const dispLabel = TYPE_LABELS[event.type] || event.type;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-start gap-3 px-4 py-3 hover:bg-mist/50 transition-colors cursor-pointer",
        !isLast && "border-b border-[#E8EBF0]"
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
          <ChipBadge size="sm" tone="outline">{dispLabel}</ChipBadge>
          <span className="t-body-small text-muted-fg truncate">· {event.roleTitle}</span>
        </div>
        <p className="t-body-medium text-dark line-clamp-2 leading-snug">{event.content}</p>
      </div>

      <div className="text-right shrink-0">
        <div className="t-label-small text-muted-fg whitespace-nowrap">{event.at}</div>
        {event.by && <div className="t-body-small text-muted-fg whitespace-nowrap">{event.by}</div>}
      </div>

      <ChevronRight className="h-4 w-4 text-muted-fg opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </div>
  );
}
