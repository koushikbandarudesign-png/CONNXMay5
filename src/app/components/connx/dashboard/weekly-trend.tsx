import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { WEEK_TREND } from "../mock";
import { ChipBadge } from "../ui-helpers";

const W = 480;
const H = 160;
const PAD_X = 28;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

function buildPath(values: number[], max: number): string {
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const step = innerW / (values.length - 1 || 1);
  return values
    .map((v, i) => {
      const x = PAD_X + i * step;
      const y = PAD_TOP + innerH - (v / max) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function WeeklyTrend() {
  const { totals, callsPath, screenedPath, max } = useMemo(() => {
    const calls = WEEK_TREND.map((d) => d.calls);
    const screened = WEEK_TREND.map((d) => d.screened);
    const m = Math.max(1, ...calls, ...screened);
    return {
      totals: { calls: calls.reduce((s, n) => s + n, 0), screened: screened.reduce((s, n) => s + n, 0) },
      callsPath: buildPath(calls, m),
      screenedPath: buildPath(screened, m),
      max: m,
    };
  }, []);

  const innerW = W - PAD_X * 2;
  const step = innerW / (WEEK_TREND.length - 1 || 1);

  return (
    <Card className="shadow-cx-1">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="t-title-medium text-cosmic">This week</CardTitle>
          <p className="t-body-small text-muted-fg mt-0.5">
            {totals.calls} calls · {totals.screened} screenings
          </p>
        </div>
        <ChipBadge tone="success" className="gap-1">
          <TrendingUp className="h-3 w-3" /> +18% vs last week
        </ChipBadge>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-[200px]" role="img" aria-label="Weekly trend">
            {[0.25, 0.5, 0.75].map((t) => {
              const y = PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t;
              return <line key={`grid-${t}`} x1={PAD_X} x2={W - PAD_X} y1={y} y2={y} stroke="#E8EBF0" strokeDasharray="2 3" strokeWidth={1} />;
            })}

            <path d={screenedPath} fill="none" stroke="#2D2E67" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d={callsPath} fill="none" stroke="#3E83FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            {WEEK_TREND.map((d, i) => {
              const x = PAD_X + i * step;
              const callsY = PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) - (d.calls / max) * (H - PAD_TOP - PAD_BOTTOM);
              return (
                <g key={`pt-${d.day}`}>
                  <circle cx={x} cy={callsY} r={3} fill="#3E83FA" />
                  <text x={x} y={H - 6} textAnchor="middle" fontSize={11} fill="rgba(55,58,64,0.6)">{d.day}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E8EBF0]">
          <LegendDot color="#3E83FA" label="Calls" />
          <LegendDot color="#2D2E67" label="Screenings" />
        </div>
      </CardContent>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-pill" style={{ backgroundColor: color }} />
      <span className="t-body-small text-muted-fg">{label}</span>
    </div>
  );
}
