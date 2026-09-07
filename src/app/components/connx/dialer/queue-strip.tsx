import { CheckCircle2, Phone, Clock, PhoneOff } from "lucide-react";
import { cn } from "../../ui/utils";
import { initials } from "../mock";
import type { CandidateRow } from "../pass3-mock";

interface QueueStripProps {
  queue: CandidateRow[];
  currentIndex: number;
  completedDispositions: Record<string, "shortlisted" | "rejected" | "on-hold" | "callback" | "no-answer">;
}

export function QueueStrip({ queue, currentIndex, completedDispositions }: QueueStripProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E8EBF0] px-3 py-2 flex items-center gap-2 overflow-x-auto">
      <span className="t-label-small text-muted-fg shrink-0 px-1">Queue · {currentIndex + 1}/{queue.length}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {queue.map((c, i) => {
          const isCurrent = i === currentIndex;
          const isCompleted = i < currentIndex;
          const disp = completedDispositions[c.id];

          let bgClass = "bg-mist text-muted-fg";
          let icon: React.ReactNode = null;

          if (isCurrent) {
            bgClass = "bg-stellar text-white ring-2 ring-stellar/30 ring-offset-2 ring-offset-white";
            icon = <Phone className="absolute -bottom-0.5 -right-0.5 bg-white text-stellar rounded-pill p-0.5 h-3.5 w-3.5" />;
          } else if (isCompleted) {
            if (disp === "shortlisted") {
              bgClass = "bg-success-soft text-success-ink";
              icon = <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 bg-white rounded-pill text-success-ink h-3.5 w-3.5" />;
            } else if (disp === "rejected") {
              bgClass = "bg-danger-soft text-danger-ink";
            } else if (disp === "callback") {
              bgClass = "bg-stellar-50 text-stellar-700";
              icon = <Clock className="absolute -bottom-0.5 -right-0.5 bg-white rounded-pill text-stellar h-3.5 w-3.5" />;
            } else if (disp === "no-answer") {
              bgClass = "bg-mist text-muted-fg opacity-60";
              icon = <PhoneOff className="absolute -bottom-0.5 -right-0.5 bg-white rounded-pill text-muted-fg h-3 w-3" />;
            } else {
              bgClass = "bg-warning-soft text-warning-ink";
            }
          }

          return (
            <div
              key={c.id}
              className={cn(
                "relative h-8 w-8 rounded-pill flex items-center justify-center t-label-small font-semibold shrink-0 transition-all",
                bgClass
              )}
              title={`${c.name} ${isCompleted ? `· ${disp}` : isCurrent ? "· on call" : "· up next"}`}
            >
              {initials(c.name)}
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
}
