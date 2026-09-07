import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";
import { Switch } from "../../ui/switch";
import { NameAvatar } from "../ui-helpers";
import { CURRENT_RECRUITER, ORG } from "../mock";
import { toast } from "sonner";

export function ProfileSection() {
  const [name, setName] = useState(CURRENT_RECRUITER.name);
  const [email, setEmail] = useState(CURRENT_RECRUITER.email);
  const [title, setTitle] = useState("Senior Talent Partner");
  const [phone, setPhone] = useState("+1 (628) 555-0184");
  const [tz, setTz] = useState("America/Los_Angeles");
  const [workStart, setWorkStart] = useState("08:00");
  const [workEnd, setWorkEnd] = useState("18:00");
  const [respectDND, setRespectDND] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Profile</CardTitle>
          <p className="t-body-small text-muted-fg">How you appear to candidates and your team.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <NameAvatar name={name} size={64} />
            <div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Camera className="h-3.5 w-3.5" /> Upload photo
              </Button>
              <p className="t-body-small text-muted-fg mt-1.5">JPG or PNG · max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="mb-1.5 block">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="title" className="mb-1.5 block">Job title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email" className="mb-1.5 block">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-1.5 block">Callback number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <p className="t-body-small text-muted-fg mt-1">Used in voicemail drops as the call-back number.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EBF0]">
            <div className="flex items-center justify-between">
              <div>
                <div className="t-label-large text-dark">Organisation</div>
                <p className="t-body-small text-muted-fg">{ORG.name} · {CURRENT_RECRUITER.team}</p>
              </div>
              <Button variant="outline" size="sm" disabled>Managed by admin</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <CardTitle>Working hours</CardTitle>
          <p className="t-body-small text-muted-fg">CONNX uses your working hours to set best-time-to-call windows and protect your downtime.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tz" className="mb-1.5 block">Time zone</Label>
            <Select value={tz} onValueChange={setTz}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Los_Angeles">Pacific (Los Angeles) · UTC−7</SelectItem>
                <SelectItem value="America/Denver">Mountain (Denver) · UTC−6</SelectItem>
                <SelectItem value="America/Chicago">Central (Chicago) · UTC−5</SelectItem>
                <SelectItem value="America/New_York">Eastern (New York) · UTC−4</SelectItem>
                <SelectItem value="Europe/London">London · UTC+1</SelectItem>
                <SelectItem value="Europe/Berlin">Central Europe (Berlin) · UTC+2</SelectItem>
                <SelectItem value="Asia/Kolkata">India (Kolkata) · UTC+5:30</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore · UTC+8</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo · UTC+9</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start" className="mb-1.5 block">Work day starts</Label>
              <Input id="start" type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end" className="mb-1.5 block">Work day ends</Label>
              <Input id="end" type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-md bg-mist">
            <div className="flex-1">
              <div className="t-label-large text-dark">Don't dial outside working hours</div>
              <p className="t-body-small text-muted-fg">
                Pause Auto Dialer and bulk sends if scheduled outside {workStart}–{workEnd}.
              </p>
            </div>
            <Switch checked={respectDND} onCheckedChange={setRespectDND} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" onClick={() => toast.success("Profile saved")} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
          <Save className="h-3.5 w-3.5" /> Save changes
        </Button>
      </div>
    </div>
  );
}
