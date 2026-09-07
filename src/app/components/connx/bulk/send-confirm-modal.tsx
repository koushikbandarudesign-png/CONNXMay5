import { Send, AlertTriangle, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import type { CampaignChannel } from "../pass5-mock";

interface SendConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mode: "now" | "schedule") => void;
  channel: CampaignChannel;
  recipients: number;
  segmentName: string;
  scheduledFor?: string;
}

export function SendConfirmModal({
  open, onClose, onConfirm, channel, recipients, segmentName, scheduledFor,
}: SendConfirmModalProps) {
  const isScheduled = !!scheduledFor;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isScheduled ? "Schedule send?" : "Ready to send?"}</DialogTitle>
          <DialogDescription>
            {isScheduled
              ? `This message will be sent to ${recipients} candidates at the scheduled time. Once scheduled, you can cancel or edit it before send.`
              : `This message will be sent to ${recipients} candidates immediately. Once sent, this can't be undone.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg bg-mist p-4 space-y-2">
            <SummaryRow label="Channel" value={channel === "sms" ? "SMS" : channel === "email" ? "Email" : "WhatsApp"} />
            <SummaryRow label="Recipients" value={`${recipients} candidates`} />
            <SummaryRow label="Segment" value={segmentName} />
            {isScheduled && <SummaryRow label="Sending" value={scheduledFor} />}
          </div>

          <div className="rounded-lg bg-success-soft border border-success/20 p-3 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-success-ink">Compliance checks passed</div>
              <p className="t-body-small text-success-ink/80">
                Opt-out handling enabled · DNC list checked · GDPR / DPDP / TCPA compliant.
              </p>
            </div>
          </div>

          {!isScheduled && recipients > 25 && (
            <div className="rounded-lg bg-warning-soft border border-warning/20 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
              <div>
                <div className="t-label-large text-warning-ink">Sending to {recipients} candidates immediately</div>
                <p className="t-body-small text-warning-ink/80">
                  Consider scheduling for a prime engagement window (Tue/Wed 10–11 AM) to maximise replies.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          {!isScheduled && (
            <Button size="sm" onClick={() => onConfirm("schedule")} variant="outline" className="gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              Schedule for prime window
            </Button>
          )}
          <Button size="sm" onClick={() => onConfirm(isScheduled ? "schedule" : "now")} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
            <Send className="h-3.5 w-3.5" />
            {isScheduled ? `Schedule send · ${recipients}` : `Send now · ${recipients}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="t-label-small text-muted-fg">{label}</span>
      <span className="t-label-large text-dark text-right">{value}</span>
    </div>
  );
}
