import { useState } from "react";
import { Mail, Smartphone, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { NOTIFICATION_PREFS } from "../pass8-mock";

export function NotificationsSection() {
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS);

  const update = (id: string, channel: "email" | "push" | "inApp", value: boolean) => {
    setPrefs((p) => p.map((x) => x.id === id ? { ...x, [channel]: value } : x));
  };

  const groups = prefs.reduce<Record<string, typeof prefs>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Notifications</CardTitle>
          <p className="t-body-small text-muted-fg">Decide what reaches you and where. Toggle each channel independently.</p>
        </CardHeader>
        <CardContent>
          <div className="hidden md:grid grid-cols-[1fr_60px_60px_60px] gap-3 pb-2 border-b border-[#E8EBF0] mb-2">
            <div></div>
            <ChannelHeader icon={Mail} label="Email" />
            <ChannelHeader icon={Smartphone} label="Push" />
            <ChannelHeader icon={Monitor} label="In-app" />
          </div>

          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="mb-5 last:mb-0">
              <div className="t-label-small text-muted-fg mb-2 mt-3">{category}</div>
              <div className="space-y-1">
                {items.map((p) => (
                  <PrefRow key={p.id} pref={p} onToggle={(ch, v) => update(p.id, ch, v)} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Quiet hours</CardTitle>
          <p className="t-body-small text-muted-fg">Push and SMS notifications won't disturb you outside working hours, regardless of these preferences.</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-mist">
            <div>
              <div className="t-label-large text-dark">Respect working hours</div>
              <p className="t-body-small text-muted-fg">Hold non-urgent notifications until your next work day.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChannelHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-3.5 w-3.5 text-muted-fg" />
      <span className="t-label-small text-muted-fg">{label}</span>
    </div>
  );
}

function PrefRow({
  pref, onToggle,
}: {
  pref: typeof NOTIFICATION_PREFS[number];
  onToggle: (channel: "email" | "push" | "inApp", v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_60px_60px] gap-3 py-2 items-center border-b border-[#E8EBF0] last:border-0">
      <div className="min-w-0">
        <div className="t-label-large text-dark">{pref.label}</div>
        <p className="t-body-small text-muted-fg leading-snug">{pref.description}</p>
      </div>
      <ChannelToggle channel="email" value={pref.email} onChange={(v) => onToggle("email", v)} />
      <ChannelToggle channel="push"  value={pref.push}  onChange={(v) => onToggle("push", v)} />
      <ChannelToggle channel="inApp" value={pref.inApp} onChange={(v) => onToggle("inApp", v)} />
    </div>
  );
}

function ChannelToggle({
  channel, value, onChange,
}: {
  channel: "email" | "push" | "inApp";
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const label = channel === "email" ? "Email" : channel === "push" ? "Push" : "In-app";
  return (
    <div className="flex items-center justify-between md:justify-center gap-2">
      <span className="t-label-small text-muted-fg md:hidden">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} aria-label={`${label} notifications`} />
    </div>
  );
}
