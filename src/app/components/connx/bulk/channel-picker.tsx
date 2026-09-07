import { MessageSquareText, Mail, MessageCircle, Check } from "lucide-react";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";
import type { CampaignChannel } from "../pass5-mock";

interface ChannelPickerProps {
  value: CampaignChannel;
  onChange: (v: CampaignChannel) => void;
}

const CHANNELS: { key: CampaignChannel; label: string; icon: React.ComponentType<{ className?: string }>; desc: string; whenToUse: string }[] = [
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
                ? "border-stellar bg-stellar-50 ring-2 ring-stellar/20 shadow-cx-1"
                : "border-[#E8EBF0] bg-white hover:border-stellar/30 hover:bg-mist"
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
            <ChipBadge tone="outline" size="sm">{c.whenToUse}</ChipBadge>
          </button>
        );
      })}
    </div>
  );
}
