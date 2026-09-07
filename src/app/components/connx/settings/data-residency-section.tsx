import { useState } from "react";
import { MapPin, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { DATA_REGIONS } from "../pass8-mock";
import { ChipBadge } from "../ui-helpers";
import { cn } from "../../ui/utils";

export function DataResidencySection() {
  const [active, setActive] = useState("us-east-1");

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Data residency</CardTitle>
          <p className="t-body-small text-muted-fg">
            Where CONNX stores your candidate data, call recordings, and audit logs. Set per workspace — changing region requires a planned migration.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {DATA_REGIONS.map((r) => {
            const isActive = r.code === active;
            return (
              <div
                key={r.code}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  isActive ? "border-stellar bg-stellar-50/50 ring-1 ring-stellar/20" : "border-[#E8EBF0] bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={cn("h-4 w-4 shrink-0", isActive ? "text-stellar" : "text-muted-fg")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="t-label-large text-dark">{r.label}</span>
                      {isActive && <ChipBadge tone="info" size="sm">Active</ChipBadge>}
                    </div>
                    <div className="t-body-small text-muted-fg flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-success-ink" />
                      <span>{r.compliance}</span>
                    </div>
                  </div>
                  {!isActive && (
                    <Button variant="outline" size="sm" onClick={() => setActive(r.code)}>Migrate here</Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-start gap-2.5 p-3 mt-4 rounded-md bg-warning-soft border border-warning-ink/20">
            <AlertTriangle className="h-4 w-4 text-warning-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-warning-ink">Region migration is planned, not instant</div>
              <p className="t-body-small text-warning-ink/80">
                Switching regions takes ~24 hours. CONNX runs in read-only mode during the migration. Audit logs are preserved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Data retention</CardTitle>
          <p className="t-body-small text-muted-fg">
            How long CONNX retains different categories of data, per regulatory requirements.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <RetentionRow label="Audit log entries" days="3 years (1,095 days)" required="GDPR · DPDP · TCPA minimum" />
          <RetentionRow label="Call recordings" days="180 days" configurable />
          <RetentionRow label="AI call summaries" days="3 years" required="Tied to audit retention" />
          <RetentionRow label="Candidate data (after rejection)" days="2 years or until candidate request, whichever sooner" required="GDPR Article 17" />
          <RetentionRow label="Bulk message content + delivery logs" days="1 year" configurable />
        </CardContent>
      </Card>
    </div>
  );
}

function RetentionRow({ label, days, required, configurable }: { label: string; days: string; required?: string; configurable?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div>
        <div className="t-label-large text-dark">{label}</div>
        {required && <p className="t-body-small text-muted-fg">{required}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="t-label-medium text-cosmic tabular-nums">{days}</span>
        {configurable && <ChipBadge tone="outline" size="sm">Configurable</ChipBadge>}
      </div>
    </div>
  );
}
