import { useState } from "react";
import { CheckCircle2, Clock, Pause, X, Sparkles, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { cn } from "../../ui/utils";
import { NameAvatar, ChipBadge } from "../ui-helpers";
import { formatDuration, type CallDisposition } from "./dialer-lib";
import type { CandidateRow } from "../pass3-mock";

const OPTIONS = [
  { value: "shortlisted" as const, icon: CheckCircle2, label: "Shortlist · advance",  desc: "Move forward to next interview round.",   bg: "bg-success-soft", border: "border-success/30",  iconBg: "bg-success text-white" },
  { value: "callback"    as const, icon: Clock,        label: "Schedule callback",   desc: "Pick a time to try again.",                bg: "bg-stellar-50",   border: "border-stellar/30",  iconBg: "bg-stellar text-white" },
  { value: "on-hold"     as const, icon: Pause,        label: "Hold for review",     desc: "Pending hiring manager input.",            bg: "bg-warning-soft", border: "border-warning/30",  iconBg: "bg-warning text-warning-ink" },
  { value: "rejected"    as const, icon: X,            label: "Reject · politely",   desc: "Send the polite rejection email template.",bg: "bg-danger-soft",  border: "border-danger/30",   iconBg: "bg-danger text-white" },
];

interface DispositionModalProps {
  open: boolean;
  candidate: CandidateRow;
  durationSec: number;
  onSubmit: (disposition: CallDisposition, summary?: string) => void;
}

export function DispositionModal({ open, candidate, durationSec, onSubmit }: DispositionModalProps) {
  const [picked, setPicked] = useState<CallDisposition>(null);
  const [summary, setSummary] = useState("");

  const handleSubmit = () => {
    if (!picked) return;
    onSubmit(picked, summary);
    setPicked(null);
    setSummary("");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[560px] p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle>Wrap up the call</DialogTitle>
            <DialogDescription>
              Pick a disposition to log this screening and move to the next candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-mist">
            <NameAvatar name={candidate.name} size={40} />
            <div className="flex-1 min-w-0">
              <div className="t-label-large text-dark truncate">{candidate.name}</div>
              <div className="t-body-small text-muted-fg truncate">{candidate.currentRole} · {candidate.currentCompany}</div>
            </div>
            <ChipBadge tone="outline" size="sm">{formatDuration(durationSec)}</ChipBadge>
          </div>
        </div>

        <div className="px-6 pb-2">
          <div className="t-label-small text-muted-fg mb-2">Disposition</div>
          <div className="grid grid-cols-2 gap-2">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = picked === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPicked(opt.value)}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all focus-ring",
                    active ? `${opt.bg} ${opt.border} ring-2 ring-offset-1 ring-stellar/20 shadow-cx-1` : "bg-white border-[#E8EBF0] hover:bg-mist"
                  )}
                >
                  <div className={cn("h-7 w-7 rounded-pill flex items-center justify-center mb-2", opt.iconBg)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="t-label-large text-dark">{opt.label}</div>
                  <div className="t-body-small text-muted-fg leading-snug mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {picked === "shortlisted" && (
          <div className="mx-6 mb-4 p-3 rounded-lg leo-gradient text-white">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="t-label-large mb-1">LEO suggested next step</div>
                <p className="t-body-small text-white/85">
                  Schedule onsite with {candidate.name.split(" ")[0]} this week. Loop in the hiring manager for panel scheduling.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 pb-4">
          <div className="t-label-small text-muted-fg mb-1.5">
            Quick summary <span className="text-muted-fg">(optional, also auto-generated from call recording)</span>
          </div>
          <Textarea
            placeholder={picked === "shortlisted"
              ? "Strong fundamentals. Comp expectation: ~$210k base. Earliest start: 4 weeks."
              : picked === "rejected"
              ? "Insufficient distributed-systems depth for this seniority."
              : "Add a short note for your future self…"}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t border-[#E8EBF0] bg-mist/40">
          <Button variant="outline" size="sm" onClick={() => onSubmit(null)}>Skip · log later</Button>
          <Button disabled={!picked} onClick={handleSubmit} size="sm" className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
            Save &amp; next candidate
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
