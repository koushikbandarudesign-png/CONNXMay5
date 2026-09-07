import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, X, PenLine } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../ui/sheet";
import { ROLES } from "../pass3-mock";
import { cn } from "../../ui/utils";
import {
  DEFAULT_LAYOUT, loadSavedLayout, getQueueCandidates,
  type LayoutPref, type CallDisposition, type Zone,
} from "../dialer/dialer-lib";
import { PANEL_COMPONENTS } from "../dialer/panels";
import { PanelPillBar } from "../dialer/panel-pill-bar";
import { CallControlBar } from "../dialer/call-control-bar";
import { QueueStrip } from "../dialer/queue-strip";
import { DispositionModal } from "../dialer/disposition-modal";
import { NotesPanel } from "../dialer/panels";

type CallStatus = "ringing" | "connected" | "voicemail" | "ended";

export default function DialerSessionPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleId = params.get("role") || ROLES[0].id;
  const role = ROLES.find((r) => r.id === roleId) || ROLES[0];
  const queue = useMemo(() => getQueueCandidates(roleId), [roleId]);

  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [callDuration, setCallDuration] = useState(0);
  const [showDisposition, setShowDisposition] = useState(false);
  const [completed, setCompleted] = useState<Record<string, "shortlisted" | "rejected" | "on-hold" | "callback" | "no-answer">>({});
  const [notesOpen, setNotesOpen] = useState(false);

  const candidate = queue[currentIndex];

  useEffect(() => {
    setCallStatus("ringing");
    setCallDuration(0);
    const t = setTimeout(() => setCallStatus("connected"), 1800);
    return () => clearTimeout(t);
  }, [currentIndex]);

  useEffect(() => {
    if (callStatus !== "connected") return;
    const t = setInterval(() => setCallDuration((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  if (!candidate) {
    return (
      <div className="h-screen flex items-center justify-center bg-mist p-6">
        <div className="bg-white rounded-xl shadow-cx-2 p-8 max-w-md text-center">
          <div className="t-headline-small text-cosmic mb-2">Queue empty</div>
          <p className="t-body-medium text-muted-fg mb-4">No candidates in this dialing queue.</p>
          <Button onClick={() => navigate("/dialer")}>Back to queue builder</Button>
        </div>
      </div>
    );
  }

  const handleEndCall = () => {
    setCallStatus("ended");
    setShowDisposition(true);
  };

  const handleVoicemail = () => {
    setCallStatus("voicemail");
    setTimeout(() => {
      setCompleted((c) => ({ ...c, [candidate.id]: "no-answer" }));
      advance();
    }, 1200);
  };

  const handleDisposition = (disp: CallDisposition) => {
    if (disp) setCompleted((c) => ({ ...c, [candidate.id]: disp }));
    setShowDisposition(false);
    advance();
  };

  const advance = () => {
    if (currentIndex + 1 >= queue.length) {
      navigate(`/dialer/summary?role=${roleId}&dispositions=${encodeURIComponent(JSON.stringify({ ...completed, [candidate.id]: completed[candidate.id] || "no-answer" }))}`);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleExit = () => {
    if (confirm("End this dialing session? Your progress will be saved to candidate timelines.")) {
      navigate(`/dialer/summary?role=${roleId}&dispositions=${encodeURIComponent(JSON.stringify(completed))}`);
    }
  };

  const zones: Zone[] = ["A", "B", "C"];
  const colSpans: Record<Zone, string> = { A: "col-span-5", B: "col-span-3", C: "col-span-2" };

  return (
    <div className="h-screen flex flex-col bg-mist overflow-hidden">
      <div className="bg-white border-b border-[#E8EBF0] px-4 py-2 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={handleExit} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Exit session
        </Button>
        <div className="h-5 w-px bg-[#E8EBF0]" />
        <div className="t-label-medium text-cosmic">Auto Dialer · {role.title}</div>
        <div className="flex-1" />
        <PanelPillBar layout={layout} onChange={setLayout} compact />
      </div>

      <div className="px-4 pt-3 shrink-0">
        <QueueStrip queue={queue} currentIndex={currentIndex} completedDispositions={completed} />
      </div>

      <div className="flex-1 min-h-0 px-4 py-3 grid grid-cols-10 gap-3">
        {zones.map((z) => {
          const Panel = PANEL_COMPONENTS[layout[z]];
          return (
            <div key={z} className={cn(colSpans[z], "min-h-0")}>
              <Panel candidate={candidate} role={role} zoneSize={z} />
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4 shrink-0">
        <CallControlBar
          candidateName={candidate.name}
          candidatePhone={candidate.phone}
          callStatus={callStatus}
          onEndCall={handleEndCall}
          onVoicemailDrop={handleVoicemail}
        />
      </div>

      {!Object.values(layout).includes("notes") && (
        <button
          onClick={() => setNotesOpen(true)}
          className="fixed bottom-24 right-6 h-12 w-12 rounded-pill bg-stellar text-white shadow-cx-3 flex items-center justify-center hover:bg-stellar-700 transition-colors focus-ring"
          aria-label="Open notes"
        >
          <PenLine className="h-5 w-5" />
        </button>
      )}

      <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
        <SheetContent side="right" className="w-[400px] p-0">
          <SheetTitle className="sr-only">Notes</SheetTitle>
          <SheetDescription className="sr-only">Quick notes for the current call.</SheetDescription>
          <div className="h-full p-3">
            <NotesPanel candidate={candidate} role={role} zoneSize="C" />
          </div>
        </SheetContent>
      </Sheet>

      <DispositionModal
        open={showDisposition}
        candidate={candidate}
        durationSec={callDuration}
        onSubmit={handleDisposition}
      />
    </div>
  );
}
