import { useState } from "react";
import { Globe2, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { LANGUAGES } from "../pass8-mock";
import { ChipBadge } from "../ui-helpers";

export function LanguagesSection() {
  const [langs, setLangs] = useState(LANGUAGES);

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Consent languages</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD CM-08: candidates receive consent messages in their preferred language. Enable up to 4 languages per workspace.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {langs.map((l) => (
            <div key={l.code} className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Globe2 className="h-3.5 w-3.5 text-stellar shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="t-label-large text-dark">{l.label}</span>
                    {l.code === "en" && <ChipBadge tone="info" size="sm">Default</ChipBadge>}
                  </div>
                  <p className="t-body-small text-muted-fg">{l.region}</p>
                </div>
              </div>
              <Switch
                checked={l.consent}
                onCheckedChange={(v) => setLangs((ls) => ls.map((x) => x.code === l.code ? { ...x, consent: v } : x))}
                disabled={l.code === "en"}
                aria-label={`Consent in ${l.label}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Interface language</CardTitle>
          <p className="t-body-small text-muted-fg">CONNX UI is available in English today. More languages ship in 2026.</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">English</div>
              <p className="t-body-small text-muted-fg">UI strings, labels, and helper text</p>
            </div>
            <ChipBadge tone="success" size="sm" className="gap-1">
              <CheckCircle2 className="h-2.5 w-2.5" /> Active
            </ChipBadge>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5" disabled>
            <Plus className="h-3.5 w-3.5" /> More languages coming soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
