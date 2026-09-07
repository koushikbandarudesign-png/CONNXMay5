import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../ui/utils";
import { initials } from "./mock";

export function NameAvatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  return (
    <Avatar style={{ width: size, height: size }} className={cn("rounded-pill", className)}>
      <AvatarFallback className="leo-avatar-gradient text-white font-semibold" style={{ fontSize: size * 0.36 }}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

type ChipTone = "default" | "success" | "danger" | "info" | "warning" | "neutral" | "outline" | "cosmic";
type ChipSize = "default" | "sm" | "lg";

const TONES: Record<ChipTone, string> = {
  default: "bg-mist text-cosmic",
  success: "bg-success-soft text-success-ink",
  danger: "bg-danger-soft text-danger-ink",
  info: "bg-stellar-50 text-stellar-700",
  warning: "bg-warning-soft text-warning-ink",
  neutral: "bg-mist text-dark",
  outline: "bg-white border border-[#E8EBF0] text-dark",
  cosmic: "bg-cosmic text-white",
};

const SIZES: Record<ChipSize, string> = {
  default: "px-2 py-0.5 t-label-small",
  sm: "px-1.5 py-0 t-label-small text-[9px]",
  lg: "px-2.5 py-1 text-[11px] font-semibold",
};

export function ChipBadge({
  children, tone = "default", size = "default", className,
}: {
  children: React.ReactNode; tone?: ChipTone; size?: ChipSize; className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-pill whitespace-nowrap", TONES[tone], SIZES[size], className)}>
      {children}
    </span>
  );
}

export function ProgressBar({
  value, indicatorClassName, className,
}: { value: number; indicatorClassName?: string; className?: string }) {
  return (
    <div className={cn("relative h-1.5 w-full overflow-hidden rounded-pill bg-mist", className)}>
      <div
        className={cn("h-full bg-stellar transition-all duration-500 ease-out rounded-pill", indicatorClassName)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
