import { useRef } from "react";
import {
  Type, AtSign, Hash, Calendar as CalendarIcon, Link2, Eye,
  RefreshCcw, ChevronDown, Briefcase, MapPin, Phone, Mail,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../../ui/select";
import { CANDIDATES } from "../pass3-mock";
import { ORG, CURRENT_RECRUITER } from "../mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";
import type { CampaignChannel } from "../pass5-mock";

interface MessageComposerProps {
  channel: CampaignChannel;
  subject: string;
  setSubject: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
}

const MERGE_FIELDS = [
  { key: "firstName",          label: "First name",          icon: Type },
  { key: "candidateFullName",  label: "Full name",           icon: Type },
  { key: "currentCompany",     label: "Current company",     icon: Briefcase },
  { key: "currentRole",        label: "Current role",        icon: Briefcase },
  { key: "location",           label: "Location",            icon: MapPin },
  { key: "phone",              label: "Phone",               icon: Phone },
  { key: "email",              label: "Email",               icon: Mail },
  { key: "roleTitle",          label: "Role title",          icon: Briefcase },
  { key: "orgName",            label: "Organisation name",   icon: AtSign },
  { key: "recruiterFirstName", label: "Recruiter first name", icon: AtSign },
  { key: "consentLink",        label: "Consent link",        icon: Link2 },
  { key: "callbackTime",       label: "Callback time",       icon: CalendarIcon },
];

export function MessageComposer({ channel, subject, setSubject, body, setBody }: MessageComposerProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const insertMerge = (field: string, target: "subject" | "body") => {
    const merge = `{{${field}}}`;
    if (target === "subject") {
      const el = subjectRef.current;
      if (!el) return;
      const start = el.selectionStart || subject.length;
      const next = subject.slice(0, start) + merge + subject.slice(el.selectionEnd || start);
      setSubject(next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + merge.length, start + merge.length); });
    } else {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.selectionStart || body.length;
      const next = body.slice(0, start) + merge + body.slice(el.selectionEnd || start);
      setBody(next);
      requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + merge.length, start + merge.length); });
    }
  };

  const charCount = body.length;
  const segmentCount = Math.max(1, Math.ceil(charCount / 160));

  return (
    <div className="space-y-3">
      {channel === "email" && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="subject">Subject</Label>
            <MergeFieldButton onSelect={(f) => insertMerge(f, "subject")} />
          </div>
          <Input id="subject" ref={subjectRef} value={subject} onChange={(e) => setSubject(e.target.value)}
            placeholder="Quick question about the {{roleTitle}} role at {{orgName}}" />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="body">Message</Label>
          <div className="flex items-center gap-2">
            {channel === "sms" && (
              <ChipBadge tone="outline" size="sm" className="tabular-nums">
                {charCount} chars · {segmentCount} {segmentCount === 1 ? "segment" : "segments"}
              </ChipBadge>
            )}
            <MergeFieldButton onSelect={(f) => insertMerge(f, "body")} />
          </div>
        </div>
        <Textarea
          id="body" ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)}
          placeholder={
            channel === "sms"   ? "Hi {{firstName}}, this is {{recruiterFirstName}} from {{orgName}}…"
            : channel === "whatsapp" ? "Hi {{firstName}}, following up about the {{roleTitle}} role…"
            : "Hi {{firstName}},\n\nI wanted to follow up about the {{roleTitle}} role at {{orgName}}…"
          }
          className={cn("resize-y", channel === "email" ? "min-h-[200px]" : "min-h-[120px]")}
        />
      </div>

      {channel === "sms" && segmentCount > 1 && (
        <p className="t-body-small text-warning-ink flex items-center gap-1.5">
          ⚠ Message exceeds one SMS segment. Cost is per segment per recipient.
        </p>
      )}
    </div>
  );
}

function MergeFieldButton({ onSelect }: { onSelect: (field: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-7 px-2">
          <Hash className="h-3 w-3" />
          Insert merge field
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Merge fields</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MERGE_FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <DropdownMenuItem key={f.key} onSelect={() => onSelect(f.key)}>
              <Icon className="h-3.5 w-3.5 text-muted-fg" />
              <span className="flex-1">{f.label}</span>
              <span className="t-label-small text-muted-fg">{`{{${f.key}}}`}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MessagePreview({
  channel, subject, body, previewCandidateId, onCandidateChange, allCandidates,
}: {
  channel: CampaignChannel;
  subject: string;
  body: string;
  previewCandidateId: string;
  onCandidateChange: (id: string) => void;
  allCandidates: typeof CANDIDATES;
}) {
  const candidate = allCandidates.find((c) => c.id === previewCandidateId) || allCandidates[0];

  const resolve = (text: string): React.ReactNode => {
    if (!candidate) return text;
    const map: Record<string, string> = {
      firstName: candidate.name.split(" ")[0],
      candidateFullName: candidate.name,
      currentCompany: candidate.currentCompany,
      currentRole: candidate.currentRole,
      location: candidate.location,
      phone: candidate.phone,
      email: candidate.email,
      orgName: ORG.name,
      recruiterFirstName: CURRENT_RECRUITER.name.split(" ")[0],
      roleTitle: "Senior Backend Engineer",
      consentLink: "northwind.connx.app/c/k7Yh2",
      callbackTime: "Tuesday at 2:00 PM",
    };
    const parts = text.split(/(\{\{\w+\}\})/g);
    return parts.map((p, i) => {
      const m = p.match(/^\{\{(\w+)\}\}$/);
      if (!m) return <span key={i}>{p}</span>;
      const v = map[m[1]];
      if (v) return <span key={i}>{v}</span>;
      return <span key={i} className="bg-warning-soft text-warning-ink px-1 rounded-sm">{p}</span>;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-stellar" />
          <span className="t-label-large text-cosmic">Preview</span>
        </div>
        <Select value={previewCandidateId} onValueChange={onCandidateChange}>
          <SelectTrigger className="h-8 w-[200px] text-[13px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {allCandidates.slice(0, 12).map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {channel === "sms" || channel === "whatsapp" ? (
        <div className="bg-mist rounded-xl p-4">
          <div className="t-label-small text-muted-fg mb-2 flex items-center justify-between">
            <span>To {candidate?.phone}</span>
            <span>{channel === "whatsapp" ? "WhatsApp" : "SMS"}</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 t-body-medium text-dark whitespace-pre-wrap break-words shadow-cx-1">
            {resolve(body || "Your message will appear here…")}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E8EBF0] rounded-lg overflow-hidden">
          <div className="bg-mist px-3 py-2 border-b border-[#E8EBF0] flex items-center gap-2">
            <span className="t-label-small text-muted-fg">From:</span>
            <span className="t-body-small">{CURRENT_RECRUITER.name} &lt;{CURRENT_RECRUITER.email}&gt;</span>
          </div>
          <div className="bg-mist px-3 py-2 border-b border-[#E8EBF0] flex items-center gap-2">
            <span className="t-label-small text-muted-fg">To:</span>
            <span className="t-body-small">{candidate?.email}</span>
          </div>
          {subject && (
            <div className="bg-mist px-3 py-2 border-b border-[#E8EBF0]">
              <div className="t-label-small text-muted-fg mb-0.5">Subject</div>
              <div className="t-label-large text-cosmic">{resolve(subject)}</div>
            </div>
          )}
          <div className="p-4 t-body-medium text-dark whitespace-pre-wrap break-words leading-relaxed min-h-[120px]">
            {resolve(body || "Your message will appear here…")}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="t-body-small text-muted-fg flex items-center gap-1.5">
          <span className="bg-warning-soft text-warning-ink px-1.5 rounded-sm t-label-small">{"{{merge}}"}</span>
          <span>Unresolved fields will block sending</span>
        </p>
        <Button variant="ghost" size="sm" className="gap-1">
          <RefreshCcw className="h-3 w-3" /> Random candidate
        </Button>
      </div>
    </div>
  );
}
