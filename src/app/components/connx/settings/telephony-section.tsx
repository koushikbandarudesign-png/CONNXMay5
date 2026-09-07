import { useState } from "react";
import { Globe, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { INTEGRATIONS } from "../pass8-mock";
import { ChipBadge } from "../ui-helpers";
import { cn } from "../../ui/utils";

export function TelephonySection() {
  const [primary, setPrimary] = useState("int-twilio");
  const telephonyProviders = INTEGRATIONS.filter((i) => i.category === "telephony");

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Telephony region</CardTitle>
          <p className="t-body-small text-muted-fg">
            CONNX routes calls and SMS through your configured providers based on candidate region. Pick your primary, set fallbacks.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2.5 p-3 rounded-md bg-mist">
            <Globe className="h-4 w-4 text-stellar shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-dark">Smart region routing</div>
              <p className="t-body-small text-muted-fg leading-snug">
                CONNX picks the best provider per call based on candidate phone country code. Manual override available per dialer session.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {telephonyProviders.map((p) => {
              const isConnected = p.status === "connected";
              const isPrimary = p.id === primary;
              const hasIssue = p.status === "action-needed";

              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    isPrimary ? "border-stellar bg-stellar-50/50 ring-1 ring-stellar/20" :
                    hasIssue ? "border-warning-ink/30 bg-warning-soft/30" :
                    "border-[#E8EBF0] bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-md flex items-center justify-center text-white t-label-medium shrink-0"
                      style={{ backgroundColor: p.iconColor }}
                    >
                      {p.iconLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="t-label-large text-dark">{p.name}</span>
                        {isPrimary && <ChipBadge size="sm" tone="info">Primary</ChipBadge>}
                        {p.region && <ChipBadge size="sm" tone="outline">{p.region}</ChipBadge>}
                        {hasIssue && (
                          <ChipBadge size="sm" tone="warning" className="gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" /> Action needed
                          </ChipBadge>
                        )}
                      </div>
                      <p className="t-body-small text-muted-fg">{p.description}</p>
                      {hasIssue && p.issue && (
                        <p className="t-body-small text-warning-ink mt-1">⚠ {p.issue}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isConnected && !isPrimary && (
                        <Button size="sm" variant="outline" onClick={() => setPrimary(p.id)}>
                          Make primary
                        </Button>
                      )}
                      {!isConnected && !hasIssue && (
                        <Button size="sm" variant="outline" className="gap-1.5">
                          Connect
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {hasIssue && <Button size="sm" className="bg-stellar text-white hover:bg-stellar-700">Fix</Button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Call recording</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD 8.1: recording is subject to organisational and local legal policies. Disable per region as required.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <RegionRecordingRow region="United States" enabled />
          <RegionRecordingRow region="European Union" enabled note="Two-party consent required" />
          <RegionRecordingRow region="India" enabled />
          <RegionRecordingRow region="California" enabled note="CIPA compliance enabled" />
          <RegionRecordingRow region="Canada" enabled={false} note="Disabled by org policy" />
        </CardContent>
      </Card>
    </div>
  );
}

function RegionRecordingRow({ region, enabled, note }: { region: string; enabled: boolean; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div>
        <div className="t-label-large text-dark">{region}</div>
        {note && <p className="t-body-small text-muted-fg">{note}</p>}
      </div>
      <ChipBadge tone={enabled ? "success" : "neutral"} size="sm" className="gap-1">
        {enabled ? <CheckCircle2 className="h-2.5 w-2.5" /> : null}
        {enabled ? "Recording on" : "Disabled"}
      </ChipBadge>
    </div>
  );
}
