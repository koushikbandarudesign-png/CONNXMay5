import {
  Phone, MessageSquareText, Mail, ShieldCheck, ShieldX, ShieldAlert,
  PenLine, ArrowRight, Sparkles, Voicemail,
  ArrowDown, ArrowUp, Clock, Play,
} from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";
import { formatDuration } from "../dialer/dialer-lib";
import type { TimelineEvent } from "../pass5-mock";

export function TimelineEventCard({ event }: { event: TimelineEvent }) {
  switch (event.type) {
    case "call":             return <CallCard event={event} />;
    case "voicemail":        return <VoicemailCard event={event} />;
    case "sms":              return <MessageCard event={event} kind="sms" />;
    case "email":            return <MessageCard event={event} kind="email" />;
    case "consent-sent":     return <ConsentCard event={event} status="sent" />;
    case "consent-accepted": return <ConsentCard event={event} status="accepted" />;
    case "consent-declined": return <ConsentCard event={event} status="declined" />;
    case "stage-change":     return <StageCard event={event} />;
    case "note":             return <NoteCard event={event} />;
    case "ai-summary":       return <AiSummaryCard event={event} />;
    default:                 return <NoteCard event={event} />;
  }
}

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
      <div className={cn("h-8 w-8 rounded-pill flex items-center justify-center shrink-0 relative z-10", iconBg)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        {children}
        <div className="flex items-center gap-1.5 mt-1.5 t-label-small text-muted-fg">
          <span>{time}</span>
          {by && <><span>·</span><span>{by}</span></>}
        </div>
      </div>
    </div>
  );
}

function CallCard({ event }: { event: TimelineEvent }) {
  const { duration, disposition, recordingAvailable } = event.meta || {};
  const dispositionTone =
    disposition === "shortlisted" ? "success" :
    disposition === "rejected" ? "danger" :
    disposition === "callback" ? "info" :
    "warning";

  return (
    <CardWrapper iconBg="bg-stellar-50 text-stellar" icon={Phone} time={event.at} by={event.by}>
      <div className="bg-white rounded-lg border border-[#E8EBF0] p-3">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="t-label-large text-cosmic">Screening call</span>
          {duration && (
            <ChipBadge size="sm" tone="outline" className="gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatDuration(duration)}
            </ChipBadge>
          )}
          {disposition && (
            <ChipBadge size="sm" tone={dispositionTone as any}>
              {disposition === "shortlisted" ? "Advanced" :
               disposition === "callback" ? "Callback scheduled" :
               disposition === "on-hold" ? "On hold" :
               "Rejected"}
            </ChipBadge>
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

function VoicemailCard({ event }: { event: TimelineEvent }) {
  return (
    <CardWrapper iconBg="bg-mist text-quantum" icon={Voicemail} time={event.at} by={event.by}>
      <div className="bg-white rounded-lg border border-[#E8EBF0] p-3">
        <div className="t-label-large text-cosmic mb-1">Voicemail dropped</div>
        <p className="t-body-small text-muted-fg">{event.content}</p>
      </div>
    </CardWrapper>
  );
}

function MessageCard({ event, kind }: { event: TimelineEvent; kind: "sms" | "email" }) {
  const { direction, subject, opened, openedAt } = event.meta || {};
  const isOutbound = direction === "outbound";
  const Icon = kind === "sms" ? MessageSquareText : Mail;

  return (
    <CardWrapper
      iconBg={isOutbound ? "bg-stellar-50 text-stellar" : "bg-success-soft text-success-ink"}
      icon={Icon} time={event.at} by={event.by}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isOutbound ? (
            <ChipBadge size="sm" tone="outline" className="gap-1">
              <ArrowUp className="h-2.5 w-2.5" /> Sent {kind === "sms" ? "SMS" : "email"}
            </ChipBadge>
          ) : (
            <ChipBadge size="sm" tone="success" className="gap-1">
              <ArrowDown className="h-2.5 w-2.5" /> Reply received
            </ChipBadge>
          )}
          {opened && <ChipBadge size="sm" tone="neutral">Opened {openedAt}</ChipBadge>}
        </div>

        {subject && <div className="t-label-large text-cosmic">{subject}</div>}

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

function ConsentCard({ event, status }: { event: TimelineEvent; status: "sent" | "accepted" | "declined" }) {
  const cfg = {
    sent:     { Icon: ShieldAlert, bg: "bg-mist text-cosmic",            label: "Consent sent",     tone: "neutral" as const },
    accepted: { Icon: ShieldCheck, bg: "bg-success-soft text-success-ink", label: "Consent accepted", tone: "success" as const },
    declined: { Icon: ShieldX,     bg: "bg-danger-soft text-danger-ink",  label: "Consent declined", tone: "danger" as const },
  }[status];

  return (
    <CardWrapper iconBg={cfg.bg} icon={cfg.Icon} time={event.at} by={event.by}>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="t-label-large text-cosmic">{cfg.label}</span>
        <ChipBadge size="sm" tone={cfg.tone}>{status === "sent" ? "Awaiting reply" : status}</ChipBadge>
      </div>
      {event.content && <p className="t-body-small text-muted-fg">{event.content}</p>}
    </CardWrapper>
  );
}

function StageCard({ event }: { event: TimelineEvent }) {
  const { from, to } = event.meta || {};
  return (
    <CardWrapper iconBg="bg-stellar-50 text-stellar" icon={ArrowRight} time={event.at} by={event.by}>
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="t-label-large text-cosmic">Stage updated</span>
        {from && to && (
          <ChipBadge size="sm" tone="info" className="gap-1.5">
            <span className="capitalize">{from}</span>
            <ArrowRight className="h-2.5 w-2.5" />
            <span className="capitalize">{to}</span>
          </ChipBadge>
        )}
      </div>
      <p className="t-body-small text-muted-fg">{event.content}</p>
    </CardWrapper>
  );
}

function NoteCard({ event }: { event: TimelineEvent }) {
  return (
    <CardWrapper iconBg="bg-mist text-stellar" icon={PenLine} time={event.at} by={event.by}>
      <div className="bg-warning-soft/40 border border-warning/20 rounded-lg p-3">
        <div className="t-label-large text-warning-ink mb-1">Note</div>
        <p className="t-body-medium text-dark leading-relaxed whitespace-pre-line">{event.content}</p>
      </div>
    </CardWrapper>
  );
}

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
            <span className="t-label-small bg-white/20 text-white px-1.5 py-0.5 rounded-pill">Auto-generated</span>
          </div>
          <p className="t-body-medium leading-relaxed text-white/95">{event.content}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 t-label-small text-muted-fg">
          <span>{event.at}</span>
          <span>·</span>
          <span>{event.by}</span>
        </div>
      </div>
    </div>
  );
}
