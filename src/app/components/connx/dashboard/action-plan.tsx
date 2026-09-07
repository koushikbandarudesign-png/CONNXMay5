import { useNavigate } from "react-router";
import { Phone, Clock, MessageSquareText, ChevronRight, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { TODAY_ACTIONS } from "../mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

const ICONS = {
  callback: Phone,
  call: Phone,
  "consent-followup": MessageSquareText,
} as const;

const TYPE_LABEL = {
  callback: "Callback",
  call: "Scheduled call",
  "consent-followup": "Consent follow-up",
} as const;

export function ActionPlan() {
  const navigate = useNavigate();

  return (
    <Card className="h-full shadow-cx-1">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="t-title-medium text-cosmic">Today's action plan</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">
            {TODAY_ACTIONS.length} actions queued · prioritised by urgency and best-time-to-reach
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/dialer")} className="gap-1">
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col">
          {TODAY_ACTIONS.map((action, i) => {
            const isHighUrgency = action.urgency === "high";
            return (
              <div
                key={action.id}
                className={cn(
                  "group flex items-center gap-3 py-3 cursor-pointer hover:bg-mist -mx-6 px-6 transition-colors",
                  i !== TODAY_ACTIONS.length - 1 && "border-b border-[#E8EBF0]"
                )}
                onClick={() => navigate("/dialer")}
              >
                <div className={cn(
                  "h-8 w-1 rounded-pill shrink-0",
                  action.urgency === "high" ? "bg-danger" :
                  action.urgency === "medium" ? "bg-warning" : "bg-stellar/30"
                )} />

                <NameAvatar name={action.candidateName.startsWith("5 ") ? "5+" : action.candidateName} size={32} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="t-label-large text-dark truncate">{action.candidateName}</span>
                    {isHighUrgency && (
                      <ChipBadge tone="danger" size="sm" className="gap-0.5">
                        <AlertCircle className="h-2.5 w-2.5" /> Overdue
                      </ChipBadge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 t-body-small text-muted-fg">
                    <span>{TYPE_LABEL[action.type]}</span>
                    <span className="opacity-60">·</span>
                    <span className="truncate">{action.roleTitle}</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 t-label-medium text-cosmic">
                    {action.type === "callback" ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {action.at}
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); navigate("/dialer"); }}
                  aria-label={`Call ${action.candidateName}`}
                >
                  <Phone className="h-3.5 w-3.5 text-stellar" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
