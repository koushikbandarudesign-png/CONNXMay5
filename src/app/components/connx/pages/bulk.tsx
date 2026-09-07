import { useState } from "react";
import {
  Calendar as CalendarIcon, Save, Send, FileText, Users, History, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { ChannelPicker } from "../bulk/channel-picker";
import { SegmentPicker } from "../bulk/segment-picker";
import { MessageComposer, MessagePreview } from "../bulk/message-composer";
import { CampaignsList } from "../bulk/campaigns-list";
import { SendConfirmModal } from "../bulk/send-confirm-modal";
import { CANDIDATES } from "../pass3-mock";
import { SEGMENTS, type CampaignChannel } from "../pass5-mock";
import { toast } from "sonner";

export default function BulkPage() {
  const [tab, setTab] = useState<"compose" | "campaigns">("compose");

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="mb-1">Bulk communication</h1>
          <p className="text-muted-fg t-body-large">
            Reach the right candidates at the right moment. SMS, email, and WhatsApp — all compliant, all trackable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTab("campaigns")} className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            View campaigns
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="mb-5">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="campaigns">
            Campaigns
            <span className="ml-1.5 t-label-small bg-mist text-muted-fg px-1.5 rounded-pill">5</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-0">
          <ComposeFlow />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-0">
          <CampaignsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComposeFlow() {
  const [channel, setChannel] = useState<CampaignChannel>("sms");
  const [segmentId, setSegmentId] = useState("seg-1");
  const [subject, setSubject] = useState("Quick question about the {{roleTitle}} role at {{orgName}}");
  const [body, setBody] = useState(
    "Hi {{firstName}}, this is {{recruiterFirstName}} from {{orgName}}. Just a gentle nudge — we'd still love to chat about the {{roleTitle}} role. Tap here to pick a time that works: {{consentLink}}. No pressure either way."
  );
  const [previewCandidateId, setPreviewCandidateId] = useState(CANDIDATES[0].id);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  const segment = SEGMENTS.find((s) => s.id === segmentId)!;

  const handleSend = (mode: "now" | "schedule") => {
    setShowSendConfirm(false);
    if (mode === "now") {
      toast.success(`Sending to ${segment.candidateCount} candidates`, {
        description: `${channel === "sms" ? "SMS" : channel === "whatsapp" ? "WhatsApp" : "Email"} delivery started · track in Campaigns`,
      });
    } else {
      toast.success("Scheduled for tomorrow at 10:00 AM", {
        description: `${segment.candidateCount} candidates · pre-set prime engagement window`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4 lg:gap-5">
      <div className="space-y-4">
        <Card className="shadow-cx-1">
          <CardHeader className="pb-3"><CardTitle>1. Pick a channel</CardTitle></CardHeader>
          <CardContent><ChannelPicker value={channel} onChange={setChannel} /></CardContent>
        </Card>

        <Card className="shadow-cx-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>2. Choose audience</CardTitle>
              <span className="t-body-small text-muted-fg">{segment.candidateCount} matching candidates</span>
            </div>
          </CardHeader>
          <CardContent>
            <SegmentPicker value={segmentId} onChange={setSegmentId} />
            {segment.isDynamic && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-stellar-50 rounded-md">
                <Sparkles className="h-3.5 w-3.5 text-stellar mt-0.5 shrink-0" />
                <p className="t-body-small text-cosmic leading-snug">
                  This is a <strong>dynamic segment</strong> — the candidate list is recalculated when you send. New candidates joining this segment between now and send time will be included.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-cx-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>3. Write the message</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Use template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MessageComposer channel={channel} subject={subject} setSubject={setSubject} body={body} setBody={setBody} />
          </CardContent>
        </Card>

        <Card className="shadow-cx-1">
          <CardHeader className="pb-3"><CardTitle>4. Send or schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save as draft
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" /> Schedule
              </Button>
              <Button size="sm" onClick={() => setShowSendConfirm(true)} disabled={!body.trim()} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
                <Send className="h-3.5 w-3.5" />
                Send to {segment.candidateCount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <Card className="shadow-cx-1">
          <CardHeader className="pb-3"><CardTitle>Live preview</CardTitle></CardHeader>
          <CardContent>
            <MessagePreview
              channel={channel} subject={subject} body={body}
              previewCandidateId={previewCandidateId}
              onCandidateChange={setPreviewCandidateId}
              allCandidates={CANDIDATES}
            />
          </CardContent>
        </Card>

        <Card className="shadow-cx-1">
          <CardHeader className="pb-3"><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow icon={Users} label="Recipients" value={`${segment.candidateCount} candidates`} />
            <SummaryRow icon={FileText} label="Channel" value={channel === "sms" ? "SMS" : channel === "email" ? "Email" : "WhatsApp"} />
            <SummaryRow icon={CalendarIcon} label="Send" value="Now (or schedule)" />

            <div className="pt-3 border-t border-[#E8EBF0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-quantum" />
                <span className="t-label-small text-muted-fg">Estimated outcomes</span>
              </div>
              <div className="space-y-1 t-body-small">
                <Estimate label="Delivered" value={Math.round(segment.candidateCount * 0.96)} total={segment.candidateCount} />
                {channel !== "sms" && (
                  <Estimate label="Opens" value={Math.round(segment.candidateCount * 0.45)} total={segment.candidateCount} />
                )}
                <Estimate label="Replies" value={Math.round(segment.candidateCount * 0.18)} total={segment.candidateCount} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SendConfirmModal
        open={showSendConfirm}
        onClose={() => setShowSendConfirm(false)}
        onConfirm={handleSend}
        channel={channel}
        recipients={segment.candidateCount}
        segmentName={segment.name}
      />
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-fg shrink-0" />
      <span className="t-label-small text-muted-fg flex-1">{label}</span>
      <span className="t-label-large text-dark text-right">{value}</span>
    </div>
  );
}

function Estimate({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-fg">{label}</span>
      <span className="tabular-nums text-dark">{value} <span className="text-muted-fg">({pct}%)</span></span>
    </div>
  );
}
