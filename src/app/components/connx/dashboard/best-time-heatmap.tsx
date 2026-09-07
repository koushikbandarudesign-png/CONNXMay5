import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { HEATMAP_DATA } from "../mock";
import { ChipBadge } from "../ui-helpers";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm"];

function cellColor(rate: number): { bg: string; text: string } {
  if (rate < 0.1) return { bg: "#F6F9FD", text: "rgba(55,58,64,0.4)" };
  if (rate < 0.25) return { bg: "#EBF2FE", text: "#2D2E67" };
  if (rate < 0.4) return { bg: "#C7DAFD", text: "#2D2E67" };
  if (rate < 0.55) return { bg: "#7BAEFC", text: "#FFFFFF" };
  return { bg: "#3E83FA", text: "#FFFFFF" };
}

export function BestTimeHeatmap() {
  const peak = useMemo(() => {
    let max = 0, peakDay = 0, peakHour = 0;
    HEATMAP_DATA.forEach((row, d) => row.forEach((v, h) => {
      if (v > max) { max = v; peakDay = d; peakHour = h; }
    }));
    return { rate: max, day: DAYS[peakDay], hour: HOURS[peakHour] };
  }, []);

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="t-title-medium text-cosmic">Best time to call</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">Connect rate by day and hour · last 30 days</p>
        </div>
        <ChipBadge tone="info" className="gap-1">
          Peak: {peak.day} {peak.hour} ({Math.round(peak.rate * 100)}%)
        </ChipBadge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="min-w-[460px]">
            <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-0.5 mb-1">
              <div />
              {HOURS.map((h) => (
                <div key={h} className="t-body-small text-[rgba(55,58,64,0.5)] text-center tabular-nums">
                  {h.replace(/[ap]m/, "")}
                </div>
              ))}
            </div>

            {DAYS.map((day, di) => (
              <div key={day} className="grid grid-cols-[40px_repeat(12,1fr)] gap-0.5 mb-0.5">
                <div className="t-label-medium text-muted-fg flex items-center">{day}</div>
                {HEATMAP_DATA[di].map((rate, hi) => {
                  const c = cellColor(rate);
                  return (
                    <Tooltip key={hi}>
                      <TooltipTrigger asChild>
                        <div
                          className="aspect-square rounded-sm flex items-center justify-center cursor-default transition-transform hover:scale-110 hover:z-10 relative tabular-nums"
                          style={{ backgroundColor: c.bg, color: c.text, fontSize: "10px", fontWeight: 600, minHeight: 24 }}
                        >
                          {rate >= 0.4 ? Math.round(rate * 100) : ""}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <div className="t-label-medium">{day} · {HOURS[hi]}</div>
                        <div className="t-body-small text-white/80">Connect rate: {Math.round(rate * 100)}%</div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8EBF0]">
          <span className="t-body-small text-muted-fg">Tip: Tuesdays 10–12 are your strongest window.</span>
          <div className="flex items-center gap-1.5">
            <span className="t-body-small text-[rgba(55,58,64,0.5)]">Less</span>
            <div className="flex gap-0.5">
              {[0.05, 0.2, 0.35, 0.5, 0.65].map((r) => (
                <div key={r} className="w-3 h-3 rounded-sm" style={{ backgroundColor: cellColor(r).bg }} />
              ))}
            </div>
            <span className="t-body-small text-[rgba(55,58,64,0.5)]">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
