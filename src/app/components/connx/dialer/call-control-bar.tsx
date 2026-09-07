import { useState, useEffect } from "react";
import {
  Mic, MicOff, Pause, Play, Voicemail, PhoneOff,
  Volume2, MessageSquareText,
} from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { formatDuration } from "./dialer-lib";

interface CallControlBarProps {
  candidateName: string;
  candidatePhone: string;
  callStatus: "ringing" | "connected" | "voicemail" | "ended";
  onEndCall: () => void;
  onVoicemailDrop: () => void;
}

export function CallControlBar({
  candidateName, callStatus, onEndCall, onVoicemailDrop,
}: CallControlBarProps) {
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (callStatus !== "connected") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callStatus]);

  return (
    <div className="bg-cosmic text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-cx-3">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className={cn(
          "h-2.5 w-2.5 rounded-pill",
          callStatus === "ringing" && "bg-warning animate-pulse",
          callStatus === "connected" && "bg-nebula animate-pulse",
          callStatus === "voicemail" && "bg-quantum",
          callStatus === "ended" && "bg-white/40"
        )} />
        <div className="hidden sm:block">
          <div className="t-label-small text-white/60">
            {callStatus === "ringing" && "Dialing"}
            {callStatus === "connected" && "On call"}
            {callStatus === "voicemail" && "Voicemail dropped"}
            {callStatus === "ended" && "Call ended"}
          </div>
          <div className="t-label-large flex items-center gap-2">
            <span className="truncate max-w-[160px]">{candidateName}</span>
            <span className="text-white/40">·</span>
            <span className="tabular-nums text-white/80">{formatDuration(seconds)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <ControlButton icon={muted ? MicOff : Mic} label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)} active={muted} />
        <ControlButton icon={held ? Play : Pause} label={held ? "Resume" : "Hold"} onClick={() => setHeld(!held)} active={held} />
        <ControlButton icon={Voicemail} label="Drop voicemail" onClick={onVoicemailDrop} />
        <ControlButton icon={MessageSquareText} label="Send SMS" onClick={() => {}} />
        <ControlButton icon={Volume2} label="Recording" onClick={() => {}} subdetail="Recording" />
      </div>

      <Button
        size="default"
        onClick={onEndCall}
        className="bg-danger hover:bg-danger-ink text-white shrink-0 ml-2 gap-1.5"
      >
        <PhoneOff className="h-4 w-4" />
        End call
      </Button>
    </div>
  );
}

function ControlButton({
  icon: Icon, label, onClick, active = false, subdetail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  subdetail?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 t-label-small transition-colors focus-ring",
        active
          ? "bg-warning text-warning-ink hover:bg-warning/90"
          : "bg-white/10 text-white hover:bg-white/20"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden md:inline">{label}</span>
      {subdetail && <span className="t-label-small text-white/50 hidden lg:inline">· {subdetail}</span>}
    </button>
  );
}
