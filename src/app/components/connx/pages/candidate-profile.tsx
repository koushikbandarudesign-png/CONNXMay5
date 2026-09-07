import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Phone, MessageSquareText, Mail, Calendar, MoreHorizontal,
  Briefcase, MapPin, ShieldCheck, ShieldQuestion, ShieldX, ShieldAlert,
  Sparkles, PenLine, PhoneCall, ExternalLink, Copy,
  Bookmark, Flag, UserPlus,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Textarea } from "../../ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { TimelineEventCard } from "../timeline/event-card";
import { CANDIDATES, ROLES, CONSENT_LABELS, STAGE_LABELS, type ConsentStatus } from "../pass3-mock";
import { getTimelineForCandidate } from "../pass5-mock";
import { NameAvatar, ChipBadge } from "../ui-helpers";
import { toast } from "sonner";

const CONSENT_VARIANT: Record<ConsentStatus, { tone: "success" | "warning" | "danger" | "neutral" | "info"; icon: React.ComponentType<{ className?: string }> }> = {
  accepted:  { tone: "success", icon: ShieldCheck },
  pending:   { tone: "warning", icon: ShieldQuestion },
  declined:  { tone: "danger",  icon: ShieldX },
  expired:   { tone: "neutral", icon: ShieldAlert },
  scheduled: { tone: "info",    icon: Calendar },
};

export default function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const [newNote, setNewNote] = useState("");

  const candidate = useMemo(() => CANDIDATES.find((c) => c.id === id), [id]);
  const role = candidate ? ROLES.find((r) => r.id === candidate.roleId) : null;
  const timeline = useMemo(() => candidate ? getTimelineForCandidate(candidate.id) : [], [candidate]);

  const filtered = useMemo(() => {
    if (filter === "all") return timeline;
    if (filter === "calls") return timeline.filter((t) => t.type === "call" || t.type === "voicemail");
    if (filter === "messages") return timeline.filter((t) => t.type === "sms" || t.type === "email");
    if (filter === "notes") return timeline.filter((t) => t.type === "note" || t.type === "ai-summary");
    if (filter === "consent") return timeline.filter((t) => t.type.startsWith("consent"));
    return timeline;
  }, [timeline, filter]);

  if (!candidate || !role) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Button>
        <Card className="mt-6 border-dashed">
          <CardContent className="py-12 text-center">
            <h3 className="mb-1">Candidate not found</h3>
            <p className="t-body-medium text-muted-fg">The candidate may have been removed or the link is outdated.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consentCfg = CONSENT_VARIANT[candidate.consentStatus];
  const ConsentIcon = consentCfg.icon;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    toast.success("Note added", { description: "Synced to candidate profile and pinned to top of timeline" });
    setNewNote("");
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <Button variant="ghost" size="sm" className="mb-3 -ml-2 gap-1.5" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-5">
        <div className="space-y-4 min-w-0">
          <Card className="shadow-cx-1">
            <CardContent className="p-5 lg:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <NameAvatar name={candidate.name} size={72} />
                <div className="flex-1 min-w-0">
                  <h1 className="mb-1">{candidate.name}</h1>
                  <p className="t-body-large text-muted-fg">
                    {candidate.currentRole} at {candidate.currentCompany}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <ChipBadge tone={consentCfg.tone} className="gap-1">
                      <ConsentIcon className="h-3 w-3" />
                      {CONSENT_LABELS[candidate.consentStatus]}
                    </ChipBadge>
                    <ChipBadge tone="info">{STAGE_LABELS[candidate.stage]}</ChipBadge>
                    <span className="t-body-small text-muted-fg flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {candidate.location}
                    </span>
                    <span className="t-body-small text-muted-fg">·</span>
                    <span className="t-body-small text-muted-fg">Source: {candidate.source}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {candidate.consentStatus === "accepted" && (
                    <Button size="sm" onClick={() => navigate("/dialer")} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
                      <PhoneCall className="h-3.5 w-3.5" /> Call now
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <MessageSquareText className="h-3.5 w-3.5" /> SMS
                  </Button>
                  <Button size="sm" variant="outline" className="hidden md:inline-flex gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label="More actions" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Calendar className="h-3.5 w-3.5" /> Schedule callback</DropdownMenuItem>
                      <DropdownMenuItem><Bookmark className="h-3.5 w-3.5" /> Add to queue</DropdownMenuItem>
                      <DropdownMenuItem><UserPlus className="h-3.5 w-3.5" /> Match to other roles</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Flag className="h-3.5 w-3.5" /> Mark on hold</DropdownMenuItem>
                      <DropdownMenuItem className="text-danger-ink">Reject candidate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-pill bg-mist flex items-center justify-center shrink-0">
                  <PenLine className="h-3.5 w-3.5 text-stellar" />
                </div>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder={`Add a note about ${candidate.name.split(" ")[0]}…`}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[60px] resize-y"
                  />
                  {newNote.trim() && (
                    <div className="flex justify-end mt-2 gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setNewNote("")}>Cancel</Button>
                      <Button size="sm" onClick={handleAddNote} className="bg-stellar text-white hover:bg-stellar-700">Save note</Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3>Activity timeline</h3>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="calls">Calls</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="consent">Consent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <div className="t-title-medium text-cosmic mb-1">No matching events</div>
                <p className="t-body-medium text-muted-fg">Try another filter or take an action above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative pb-2">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-[#E8EBF0]" />
              <div className="space-y-4 relative">
                {filtered.map((event) => (
                  <TimelineEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          <Card className="shadow-cx-1">
            <CardContent className="p-4">
              <div className="t-label-small text-muted-fg mb-3">Contact</div>
              <div className="space-y-2.5">
                <ContactRow icon={Phone} label="Phone" value={candidate.phone} />
                <ContactRow icon={Mail} label="Email" value={candidate.email} />
                <ContactRow icon={MapPin} label="Location" value={candidate.location} noCopy />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-4">
              <div className="t-label-small text-muted-fg mb-2">Calling about</div>
              <div className="flex items-start gap-2.5">
                <Briefcase className="h-3.5 w-3.5 text-stellar mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="t-label-large text-cosmic">{role.title}</div>
                  <div className="t-body-small text-muted-fg">{role.team} · {role.location}</div>
                  <p className="t-body-small text-muted-fg mt-2 leading-relaxed">{role.jdSummary}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 -ml-2 gap-1.5" onClick={() => navigate(`/roles/${role.id}`)}>
                View role
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-cx-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="t-label-small text-muted-fg">Resume snapshot</div>
                <ChipBadge tone="outline" size="sm">{candidate.yearsExperience}y exp</ChipBadge>
              </div>
              <p className="t-body-small text-dark leading-relaxed mb-3">{candidate.resumeSummary}</p>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 6).map((s) => (
                  <ChipBadge key={s} tone="outline" size="sm">{s}</ChipBadge>
                ))}
                {candidate.skills.length > 6 && (
                  <ChipBadge tone="neutral" size="sm">+{candidate.skills.length - 6}</ChipBadge>
                )}
              </div>
            </CardContent>
          </Card>

          {candidate.consentStatus === "accepted" && (
            <div className="leo-gradient rounded-xl p-4 text-white">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="t-label-large">LEO snapshot</span>
              </div>
              <p className="t-body-small leading-relaxed text-white/95">
                {candidate.name.split(" ")[0]} engages quickly via SMS and prefers morning calls. Strong fundamentals on {candidate.skills.slice(0, 2).join(" and ")}. Good fit for {role.title} based on {candidate.yearsExperience}y of relevant experience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon, label, value, noCopy,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; noCopy?: boolean }) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    toast.success(`${label} copied`);
  };
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-fg shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="t-label-small text-muted-fg">{label}</div>
        <div className="t-body-medium text-dark truncate">{value}</div>
      </div>
      {!noCopy && (
        <Button size="icon" variant="ghost" onClick={handleCopy} aria-label={`Copy ${label}`} className="h-7 w-7">
          <Copy className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
