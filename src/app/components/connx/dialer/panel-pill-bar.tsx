import { Briefcase, FileText, ListChecks, PenLine, ClipboardList, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../ui/utils";
import { PANEL_META, type Panel, type Zone, type LayoutPref } from "./dialer-lib";

const ICONS = { Briefcase, FileText, ListChecks, PenLine, ClipboardList } as const;

interface PanelPillBarProps {
  layout: LayoutPref;
  onChange: (newLayout: LayoutPref) => void;
  compact?: boolean;
}

export function PanelPillBar({ layout, onChange, compact = false }: PanelPillBarProps) {
  const zoneFor: Record<Panel, Zone | null> = {
    metadata: null, resume: null, questions: null, notes: null, jd: null,
  };
  (Object.keys(layout) as Zone[]).forEach((z) => { zoneFor[layout[z]] = z; });

  const allPanels = Object.keys(PANEL_META) as Panel[];
  const ordered = [
    ...allPanels.filter((p) => zoneFor[p] !== null),
    ...allPanels.filter((p) => zoneFor[p] === null),
  ];

  const assignToZone = (panel: Panel, targetZone: Zone) => {
    const currentZone = zoneFor[panel];
    if (currentZone === targetZone) return;
    const next: LayoutPref = { ...layout };
    const displaced = layout[targetZone];
    if (currentZone) {
      next[targetZone] = panel;
      next[currentZone] = displaced;
    } else {
      next[targetZone] = panel;
    }
    onChange(next);
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 flex-wrap",
      compact ? "" : "p-3 bg-white rounded-lg border border-[#E8EBF0] shadow-cx-1"
    )}>
      {!compact && (
        <span className="t-label-small text-muted-fg mr-2 shrink-0">Tap to assign · 5 panels · 3 zones</span>
      )}

      {ordered.map((panel) => {
        const meta = PANEL_META[panel];
        const Icon = ICONS[meta.iconName];
        const zone = zoneFor[panel];
        const active = zone !== null;
        return (
          <DropdownMenu key={panel}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "group inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 t-label-medium transition-all focus-ring",
                      active
                        ? "bg-stellar text-white border-stellar hover:bg-stellar-700"
                        : "bg-white text-dark border-[#E8EBF0] hover:border-stellar/50 hover:text-cosmic"
                    )}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{meta.shortLabel}</span>
                    {active && (
                      <span className="t-label-small rounded-sm px-1 ml-0.5 bg-white/20 text-white">{zone}</span>
                    )}
                    <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                {active ? `${meta.label} · in Zone ${zone}` : `${meta.label} · not in view`}
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="start" className="w-[260px]">
              <DropdownMenuLabel>{meta.label}</DropdownMenuLabel>
              <div className="px-2 pb-1">
                <p className="t-body-small text-muted-fg">{meta.description}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Assign to zone</DropdownMenuLabel>
              {(["A", "B", "C"] as Zone[]).map((z) => {
                const occupant = layout[z];
                const isHere = occupant === panel;
                return (
                  <DropdownMenuItem
                    key={z}
                    onSelect={() => assignToZone(panel, z)}
                    className={cn(isHere && "bg-stellar-50 text-stellar-700")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="t-label-large">Zone {z} · {z === "A" ? "Primary" : z === "B" ? "Secondary" : "Tertiary"}</div>
                        <div className="t-body-small text-muted-fg">
                          {z === "A" ? "50% width" : z === "B" ? "30% width" : "20% width"}
                          {!isHere && occupant && ` · displaces ${PANEL_META[occupant].shortLabel}`}
                        </div>
                      </div>
                      {isHere && <span className="t-label-small text-stellar-700">Current</span>}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}
