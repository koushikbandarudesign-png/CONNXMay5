import { useState, useMemo } from "react";
import {
  Search, MessageSquareText, Mail, MessageCircle, Clock, CheckCircle2,
  Calendar as CalendarIcon, Edit3, Copy, Trash2, MoreHorizontal, ChevronRight,
  TrendingUp, Send, Eye, MousePointer, MailX, BadgeAlert,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../../ui/select";
import { CAMPAIGNS, type Campaign, type CampaignChannel, type CampaignStatus } from "../pass5-mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";

const CHANNEL_ICON = { sms: MessageSquareText, email: Mail, whatsapp: MessageCircle } as const;

type Tone = "success" | "danger" | "info" | "warning" | "neutral";
const STATUS_CFG: Record<CampaignStatus, { tone: Tone; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  draft:     { tone: "neutral", icon: Edit3,        label: "Draft" },
  scheduled: { tone: "info",    icon: Clock,        label: "Scheduled" },
  sending:   { tone: "warning", icon: Send,         label: "Sending" },
  completed: { tone: "success", icon: CheckCircle2, label: "Sent" },
  failed:    { tone: "danger",  icon: BadgeAlert,   label: "Failed" },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Campaigns sent" value={CAMPAIGNS.filter((c) => c.status === "completed").length} />
        <Stat label="Recipients reached" value={stats.sent.toLocaleString()} />
        <Stat label="Open rate" value={`${stats.openRate}%`} delta="+8 pts" />
        <Stat label="Reply rate" value={`${stats.replyRate}%`} delta="+3 pts" />
      </div>

      <Card className="shadow-cx-1">
        <CardContent className="p-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
            <Input placeholder="Search by campaign name or segment…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
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
    <Card className="shadow-cx-1">
      <CardContent className="p-4">
        <div className="t-headline-medium text-cosmic tabular-nums leading-none">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="t-body-small text-muted-fg">{label}</span>
          {delta && <ChipBadge tone="success" size="sm" className="gap-0.5"><TrendingUp className="h-2.5 w-2.5" />{delta}</ChipBadge>}
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
    <Card className="cursor-pointer shadow-cx-1 hover:border-stellar/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
            c.status === "completed" ? "bg-success-soft text-success-ink" :
            c.status === "scheduled" ? "bg-stellar-50 text-stellar" :
            c.status === "draft"     ? "bg-mist text-muted-fg" :
            "bg-warning-soft text-warning-ink"
          )}>
            <Icon className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="t-label-large text-dark truncate">{c.name}</span>
              <ChipBadge tone={statusCfg.tone} size="sm" className="gap-1">
                <StatusIcon className="h-2.5 w-2.5" />
                {statusCfg.label}
              </ChipBadge>
            </div>
            <div className="t-body-small text-muted-fg">
              {c.segment} · {c.recipients} recipients · {c.sentAt || c.scheduledFor || c.createdAt}
            </div>

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
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronRight className="h-3.5 w-3.5" /> View report
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="More actions" className="h-7 w-7">
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
      <span className={cn("font-semibold tabular-nums", danger ? "text-danger-ink" : highlight ? "text-success-ink" : "text-cosmic")}>{value}</span>
    </div>
  );
}
