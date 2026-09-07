import { useState } from "react";
import { KeyRound, Smartphone, Laptop, MapPin, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { ChipBadge } from "../ui-helpers";
import { toast } from "sonner";

export function SecuritySection() {
  const [_mfaEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Multi-factor authentication</CardTitle>
          <p className="t-body-small text-muted-fg">
            Per BRD non-functional requirement: MFA enforced workspace-wide. You manage your second factor here.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4 w-4 text-stellar" />
              <div>
                <div className="t-label-large text-dark">Authenticator app</div>
                <p className="t-body-small text-muted-fg">Recommended · device-bound TOTP</p>
              </div>
            </div>
            <ChipBadge tone="success" size="sm" className="gap-1">
              <ShieldCheck className="h-2.5 w-2.5" /> Enabled
            </ChipBadge>
          </div>

          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-4 w-4 text-stellar" />
              <div>
                <div className="t-label-large text-dark">Backup codes</div>
                <p className="t-body-small text-muted-fg">8 of 10 remaining · regenerate when low</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View codes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Active sessions</CardTitle>
          <p className="t-body-small text-muted-fg">
            Devices currently signed in to CONNX. Sign out anywhere you don't recognise.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <SessionRow icon={Laptop} device="MacBook Pro · Chrome 122" location="San Francisco, CA" lastActive="Active now" current />
          <SessionRow icon={Smartphone} device="iPhone 15 · Safari" location="San Francisco, CA" lastActive="2 hours ago" />
          <SessionRow icon={Laptop} device="MacBook Air · Safari 18" location="Brooklyn, NY" lastActive="3 days ago" />

          <Button
            variant="outline" size="sm" className="w-full mt-3 text-danger-ink gap-1.5"
            onClick={() => toast.success("Signed out of all other sessions")}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out of all other sessions
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Account actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-mist transition-colors text-left focus-ring">
            <div>
              <div className="t-label-large text-dark">Download my data</div>
              <p className="t-body-small text-muted-fg">Export everything CONNX holds about you · GDPR Article 15</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-fg" />
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-md hover:bg-mist transition-colors text-left focus-ring">
            <div>
              <div className="t-label-large text-dark">Sign out of CONNX</div>
              <p className="t-body-small text-muted-fg">End this session on this device</p>
            </div>
            <LogOut className="h-4 w-4 text-muted-fg" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function SessionRow({
  icon: Icon, device, location, lastActive, current,
}: {
  icon: React.ComponentType<{ className?: string }>;
  device: string; location: string; lastActive: string; current?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Icon className="h-4 w-4 text-stellar shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="t-label-large text-dark truncate">{device}</span>
            {current && <ChipBadge tone="info" size="sm">This device</ChipBadge>}
          </div>
          <div className="t-body-small text-muted-fg flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>
            <span>·</span>
            <span>{lastActive}</span>
          </div>
        </div>
      </div>
      {!current && (
        <Button variant="ghost" size="sm" className="text-danger-ink shrink-0">Sign out</Button>
      )}
    </div>
  );
}
