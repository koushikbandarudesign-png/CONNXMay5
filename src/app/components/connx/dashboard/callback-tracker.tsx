import { useState } from "react";
import { useNavigate } from "react-router";
import { Phone, CalendarDays, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { CALLBACKS, type CallbackItem } from "../dashboard-mock";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";

export function CallbackTracker() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overdue" | "today" | "upcoming">("overdue");

  const counts = {
    overdue: CALLBACKS.filter((c) => c.category === "overdue").length,
    today: CALLBACKS.filter((c) => c.category === "today").length,
    upcoming: CALLBACKS.filter((c) => c.category === "upcoming").length,
  };

  const filtered = CALLBACKS.filter((c) => c.category === tab);

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="pb-3">
        <CardTitle className="t-title-medium text-cosmic">Callbacks</CardTitle>
        <p className="t-body-small text-muted-fg">
          {counts.overdue} overdue · {counts.today} today · {counts.upcoming} upcoming
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="overdue" className="gap-1.5">
              Overdue
              {counts.overdue > 0 && (
                <span className="t-label-small bg-danger-soft text-danger-ink px-1.5 rounded-pill min-w-[18px]">{counts.overdue}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="today" className="gap-1.5">
              Today
              {counts.today > 0 && (
                <span className="t-label-small bg-warning-soft text-warning-ink px-1.5 rounded-pill min-w-[18px]">{counts.today}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-0 space-y-1">
            {filtered.length === 0 ? (
              <EmptyState type={tab} />
            ) : (
              filtered.map((cb) => (
                <CallbackRow key={cb.id} cb={cb} onClick={() => navigate(`/candidates/${cb.candidateId}`)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function CallbackRow({ cb, onClick }: { cb: CallbackItem; onClick: () => void }) {
  const isOverdue = cb.category === "overdue";

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-3 py-2.5 cursor-pointer hover:bg-mist -mx-6 px-6 transition-colors border-b border-[#E8EBF0] last:border-0"
    >
      <NameAvatar name={cb.candidateName} size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="t-label-large text-dark truncate">{cb.candidateName}</span>
          {cb.attempts > 0 && (
            <ChipBadge tone="outline" size="sm">{cb.attempts} {cb.attempts === 1 ? "attempt" : "attempts"}</ChipBadge>
          )}
        </div>
        <div className="flex items-center gap-2 t-body-small text-muted-fg">
          <span className="truncate">{cb.roleTitle}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        {isOverdue ? <AlertCircle className="h-3 w-3 text-danger" /> : <CalendarDays className="h-3 w-3 text-muted-fg" />}
        <span className={cn("t-label-medium", isOverdue ? "text-danger-ink" : "text-cosmic")}>{cb.scheduledAt}</span>
      </div>
      <Button
        size="icon" variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={`Call ${cb.candidateName}`}
      >
        <Phone className="h-3.5 w-3.5 text-stellar" />
      </Button>
    </div>
  );
}

function EmptyState({ type }: { type: "overdue" | "today" | "upcoming" }) {
  const COPY = {
    overdue: { title: "No overdue callbacks", desc: "Nice — you're keeping up." },
    today: { title: "Nothing scheduled today", desc: "Free space for new screening calls." },
    upcoming: { title: "No upcoming callbacks", desc: "Schedule one from any candidate's profile." },
  };
  const c = COPY[type];
  return (
    <div className="text-center py-6">
      <div className="t-label-large text-cosmic mb-0.5">{c.title}</div>
      <p className="t-body-small text-muted-fg">{c.desc}</p>
    </div>
  );
}
