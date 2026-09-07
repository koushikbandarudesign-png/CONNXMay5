import { cn } from "../ui/utils";

export function Logo({ collapsed = false, className, size = "md" }: { collapsed?: boolean; className?: string; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: 24, md: 28, lg: 36 }[size];
  const text = { sm: "t-title-medium", md: "t-title-large", lg: "t-headline-small" }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative shrink-0 rounded-md leo-avatar-gradient flex items-center justify-center shadow-cx-1"
        style={{ width: dims, height: dims }}
        aria-hidden
      >
        <svg width={dims * 0.55} height={dims * 0.55} viewBox="0 0 24 24" fill="none">
          <path
            d="M19 6.5C17.4 4.7 15 3.5 12 3.5C7.6 3.5 4 7.1 4 11.5C4 15.9 7.6 19.5 12 19.5C15 19.5 17.4 18.3 19 16.5"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="19" cy="11.5" r="2.4" fill="white" />
        </svg>
      </div>
      {!collapsed && (
        <span className={cn(text, "text-cosmic font-semibold tracking-tight")}>CONNX</span>
      )}
    </div>
  );
}
