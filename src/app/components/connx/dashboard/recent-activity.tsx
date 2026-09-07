import { useNavigate } from "react-router";
import {
  CheckCircle2, Phone, MessageSquareText, Send, ShieldCheck, ChevronRight, Calendar, XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { RECENT_ACTIVITY } from "../mock";
import { cn } from "../../ui/utils";

const ICONS = {
  "screening-complete": CheckCircle2,
  "consent-accepted": ShieldCheck,
  "voicemail": Phone,
  "callback-scheduled": Calendar,
  "bulk-sent": Send,
} as const;

const ICON_COLORS = {
  "screening-complete": "text-stellar",
  "consent-accepted": "text-success-ink",
  "voicemail": "text-muted-fg",
  "callback-scheduled": "text-quantum",
  "bulk-sent": "text-stellar",
} as const;

export function RecentActivity() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="t-title-medium text-cosmic">Recent activity</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/timeline")} className="gap-1">
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-[#E8EBF0]" />
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item) => {
              const Icon = ICONS[item.type as keyof typeof ICONS] || MessageSquareText;
              const colorClass = ICON_COLORS[item.type as keyof typeof ICON_COLORS] || "text-muted-fg";
              const isShortlisted = (item as any).outcome === "shortlisted";
              const isRejected = (item as any).outcome === "rejected";
              const FinalIcon = isRejected ? XCircle : isShortlisted ? CheckCircle2 : Icon;
              const finalColor = isRejected ? "text-danger-ink" : isShortlisted ? "text-success-ink" : colorClass;

              return (
                <div key={item.id} className="flex items-start gap-3 relative">
                  <div className="h-6 w-6 rounded-pill bg-white border border-[#E8EBF0] flex items-center justify-center shrink-0 relative z-10">
                    <FinalIcon className={cn("h-3 w-3", finalColor)} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="t-body-medium text-dark leading-snug">{item.text}</p>
                    <p className="t-body-small text-muted-fg mt-0.5">{item.at}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
