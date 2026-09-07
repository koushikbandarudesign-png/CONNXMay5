import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, ArrowLeft, RotateCcw, PhoneCall, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { ROLES } from "../pass3-mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";
import {
  DEFAULT_LAYOUT, PANEL_META, ZONE_META,
  loadSavedLayout, saveSavedLayout,
  type LayoutPref, type Zone,
} from "../dialer/dialer-lib";
import { PanelPillBar } from "../dialer/panel-pill-bar";
import { Stepper } from "./dialer-queue";

export default function DialerCustomisePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleId = params.get("role") || ROLES[0].id;
  const count = Number(params.get("count") || 0);
  const role = ROLES.find((r) => r.id === roleId) || ROLES[0];

  const [layout, setLayout] = useState<LayoutPref>(() => loadSavedLayout() || DEFAULT_LAYOUT);
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const handleStart = () => {
    if (saveAsDefault) saveSavedLayout(layout);
    navigate(`/dialer/session?role=${roleId}`);
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="mb-5">
        <h1 className="mb-1">Customise your call view</h1>
        <p className="text-muted-fg t-body-large">
          Arrange the panels you want visible during the call. You can change this anytime mid-session.
        </p>
      </div>

      <Stepper current={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5 mt-5">
        <div className="space-y-4">
          <Card className="shadow-cx-1">
            <CardHeader className="pb-3">
              <CardTitle>Choose panels for each zone</CardTitle>
              <p className="t-body-small text-muted-fg mt-0.5">
                Tap a pill to assign it to Zone A, B, or C. Two panels cannot share a zone — they swap.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PanelPillBar layout={layout} onChange={setLayout} compact />

              <div className="grid grid-cols-10 gap-2 h-[280px]">
                {(["A", "B", "C"] as Zone[]).map((z) => {
                  const panel = layout[z];
                  const meta = PANEL_META[panel];
                  const span = z === "A" ? "col-span-5" : z === "B" ? "col-span-3" : "col-span-2";
                  return (
                    <div key={z} className={cn(span, "rounded-lg border border-[#E8EBF0] bg-white p-3 flex flex-col")}>
                      <div className="flex items-center justify-between mb-2">
                        <ChipBadge tone="cosmic" size="sm">Zone {z}</ChipBadge>
                        <span className="t-label-small text-muted-fg">{ZONE_META[z].widthPct}%</span>
                      </div>
                      <div className="t-label-large text-cosmic mb-0.5">{meta.label}</div>
                      <div className="t-body-small text-muted-fg leading-snug mb-2">{meta.description}</div>
                      <div className="flex-1 space-y-1.5 mt-1">
                        <div className="h-2 rounded bg-mist w-full" />
                        <div className="h-2 rounded bg-mist w-[88%]" />
                        <div className="h-2 rounded bg-mist w-[72%]" />
                        <div className="h-2 rounded bg-mist w-[80%]" />
                        <div className="h-2 rounded bg-mist w-[60%]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-mist/60">
                <div className="flex items-center gap-3">
                  <Switch id="save-default" checked={saveAsDefault} onCheckedChange={setSaveAsDefault} />
                  <Label htmlFor="save-default" className="cursor-pointer">
                    <div className="t-label-large text-dark">Save as my default layout</div>
                    <div className="t-body-small text-muted-fg">CONNX will pre-fill this for future sessions.</div>
                  </Label>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setLayout(DEFAULT_LAYOUT)}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20 self-start space-y-4">
          <Card className="shadow-cx-1">
            <CardHeader className="pb-3"><CardTitle>Ready to dial</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="t-label-small text-muted-fg">Role</div>
                <div className="t-label-large text-dark">{role.title}</div>
              </div>
              <div>
                <div className="t-label-small text-muted-fg">Queue</div>
                <div className="t-label-large text-dark">{count} candidate{count === 1 ? "" : "s"}</div>
              </div>

              <div className="p-3 rounded-md leo-gradient text-white flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <div className="t-label-large mb-0.5">LEO tip</div>
                  <p className="t-body-small text-white/85">
                    Resume in Zone A works well for senior IC roles. Try Questions in A for batch screens.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#E8EBF0]">
                <Button size="lg" className="w-full gap-2 bg-stellar text-white hover:bg-stellar-700" onClick={handleStart}>
                  <PhoneCall className="h-4 w-4" />
                  Start session
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full gap-1.5" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
