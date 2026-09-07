import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../../ui/button";
import { LEO_SUGGESTIONS } from "../dashboard-mock";
import { cn } from "../../ui/utils";

export function LeoAssist() {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const visible = LEO_SUGGESTIONS.filter((s) => !dismissed.has(s.id));
  if (visible.length === 0) return null;

  const current = visible[Math.min(index, visible.length - 1)];

  return (
    <div className="leo-gradient rounded-xl p-5 lg:p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="80" cy="20" r="2" fill="white" />
          <circle cx="60" cy="40" r="1.5" fill="white" />
          <circle cx="90" cy="60" r="1" fill="white" />
          <circle cx="70" cy="80" r="2" fill="white" />
          <circle cx="40" cy="70" r="1" fill="white" />
        </svg>
      </div>

      <div className="flex items-start gap-3 mb-4 relative">
        <div className="bg-white/20 rounded-md p-1.5 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="t-title-small">LEO Assist</span>
            {current.urgency === "now" && (
              <span className="t-label-small bg-white/20 px-1.5 py-0.5 rounded-pill">Act now</span>
            )}
          </div>
          <p className="t-body-small text-white/80">Suggestion {index + 1} of {visible.length}</p>
        </div>
        <button
          onClick={() => setDismissed((d) => new Set([...d, current.id]))}
          className="text-white/60 hover:text-white transition-colors -mt-1 -mr-1 p-1 rounded-md hover:bg-white/10 focus-ring"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative min-h-[80px]">
        <h5 className="text-white t-title-large mb-2">{current.headline}</h5>
        <p className="t-body-medium text-white/85 mb-4">{current.detail}</p>
        <Button
          size="sm"
          className="bg-white text-cosmic hover:bg-white/90 active:scale-[0.98] gap-2"
          onClick={() => navigate(current.ctaPath)}
        >
          {current.cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {visible.length > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn("h-1.5 rounded-pill transition-all", i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60")}
                aria-label={`Suggestion ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/15 hover:text-white h-7 w-7"
              onClick={() => setIndex((i) => (i - 1 + visible.length) % visible.length)}
              aria-label="Previous suggestion">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/15 hover:text-white h-7 w-7"
              onClick={() => setIndex((i) => (i + 1) % visible.length)}
              aria-label="Next suggestion">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
