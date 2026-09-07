import { useState, useEffect } from "react";
import { RotateCcw, Briefcase, FileText, ListChecks, PenLine, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { PanelPillBar } from "../dialer/panel-pill-bar";
import {
  DEFAULT_LAYOUT, PANEL_META, ZONE_META,
  loadSavedLayout, saveSavedLayout,
  type LayoutPref, type Zone,
} from "../dialer/dialer-lib";
import { ChipBadge } from "../ui-helpers";
import { toast } from "sonner";

const ICONS = { Briefcase, FileText, ListChecks, PenLine, ClipboardList } as const;

export function LayoutSection() {
  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [showCustomiseStep, setShowCustomiseStep] = useState(true);
  const [autoSaveDisposition, setAutoSaveDisposition] = useState(true);
  const [wrapTime, setWrapTime] = useState(15);

  useEffect(() => { saveSavedLayout(layout); }, [layout]);

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Default Auto Dialer layout</CardTitle>
          <p className="t-body-small text-muted-fg">
            Set your preferred panel arrangement. CONNX applies this at the start of every dialer session — you can still override per session.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <PanelPillBar layout={layout} onChange={setLayout} />

          <div className="grid grid-cols-3 gap-2">
            {(["A", "B", "C"] as Zone[]).map((z) => {
              const meta = PANEL_META[layout[z]];
              const Icon = ICONS[meta.iconName];
              return (
                <div key={z} className="rounded-md border border-[#E8EBF0] bg-white p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <ChipBadge tone="info" size="sm">Zone {z}</ChipBadge>
                    <span className="t-label-small text-muted-fg">{ZONE_META[z].widthPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3 text-stellar shrink-0" />
                    <span className="t-label-large text-dark truncate">{meta.shortLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="t-body-small text-muted-fg">Saved automatically as you change.</p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
              setLayout(DEFAULT_LAYOUT);
              toast.success("Layout reset to default");
            }}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset to default
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Session preferences</CardTitle>
          <p className="t-body-small text-muted-fg">Fine-tune how CONNX behaves during a dialer session.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <PrefToggle
            label="Show 'Customise call view' before each session"
            description="Recommended on. Lets you confirm or tweak the layout before the first call."
            value={showCustomiseStep}
            onChange={setShowCustomiseStep}
          />
          <PrefToggle
            label="Auto-save disposition notes"
            description="Generate an AI summary from the call recording when no manual note is added."
            value={autoSaveDisposition}
            onChange={setAutoSaveDisposition}
          />

          <div className="flex items-center justify-between p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">Between-call wrap time</div>
              <p className="t-body-small text-muted-fg">Pause before auto-dialing the next candidate.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={120}
                value={wrapTime}
                onChange={(e) => setWrapTime(Number(e.target.value))}
                className="w-20 h-9 px-3 rounded-lg border border-[#E8EBF0] bg-white text-[14px] tabular-nums focus-ring focus-visible:outline-none focus-visible:border-stellar focus-visible:border-2 focus-visible:px-[11px]"
              />
              <span className="t-body-medium text-muted-fg">seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrefToggle({ label, description, value, onChange }: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div className="flex-1 min-w-0">
        <div className="t-label-large text-dark">{label}</div>
        <p className="t-body-small text-muted-fg leading-snug">{description}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
