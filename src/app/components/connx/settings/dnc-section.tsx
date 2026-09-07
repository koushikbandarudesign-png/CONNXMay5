import { useState, useMemo } from "react";
import {
  ShieldOff, Search, Plus, Upload, Download, Trash2, Phone, Mail,
  AlertTriangle, Building2, User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { DNC_ENTRIES, type DncEntry } from "../pass8-mock";
import { ChipBadge } from "../ui-helpers";
import { cn } from "../../ui/utils";
import { toast } from "sonner";

const SOURCE_CFG: Record<DncEntry["source"], { label: string; tone: "warning" | "danger" | "info" | "neutral"; icon: React.ComponentType<{ className?: string }> }> = {
  "candidate-opt-out": { label: "Opted out",  tone: "warning", icon: User },
  "manual":            { label: "Manual",     tone: "info",    icon: User },
  "regulatory":        { label: "Regulatory", tone: "danger",  icon: AlertTriangle },
  "imported":          { label: "Imported",   tone: "neutral", icon: Building2 },
};

export function DncSection() {
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [entries, setEntries] = useState(DNC_ENTRIES);

  const filtered = useMemo(() => {
    if (!query) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      e.phone.includes(q) || e.email?.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q) || e.reason.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const handleRemove = (id: string) => {
    setEntries((e) => e.filter((x) => x.id !== id));
    toast.success("Removed from DNC list");
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-cx-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Do-not-call list</CardTitle>
              <p className="t-body-small text-muted-fg">
                Numbers and emails on this list are excluded from every dial and bulk send across the workspace.
              </p>
            </div>
            <ChipBadge tone="info" size="sm">{entries.length} entries</ChipBadge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2.5 p-3 mb-4 rounded-md bg-success-soft border border-success-ink/20">
            <ShieldOff className="h-4 w-4 text-success-ink shrink-0 mt-0.5" />
            <div>
              <div className="t-label-large text-success-ink">Active enforcement</div>
              <p className="t-body-small text-success-ink/80">
                Every Auto Dialer call and bulk send is checked against this list before execution. Compliance with TCPA, GDPR Article 21, and DPDP Section 9 is automatic.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
              <Input
                placeholder="Search by phone, email, name, or reason…"
                value={query} onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Import CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
                <Plus className="h-3.5 w-3.5" /> Add entry
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#E8EBF0] rounded-lg">
              <div className="t-title-medium text-cosmic mb-1">No matching entries</div>
              <p className="t-body-small text-muted-fg">Try a different search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8EBF0] bg-mist/50">
                    <th className="px-5 py-2.5 text-left t-label-small text-muted-fg">Contact</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden md:table-cell">Reason</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden lg:table-cell">Source</th>
                    <th className="px-2 py-2.5 text-left t-label-small text-muted-fg hidden lg:table-cell">Added</th>
                    <th className="w-10 px-5 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => {
                    const cfg = SOURCE_CFG[e.source];
                    const SourceIcon = cfg.icon;
                    const isLocked = e.source === "regulatory";

                    return (
                      <tr key={e.id} className={cn("group hover:bg-mist/40 transition-colors", i !== filtered.length - 1 && "border-b border-[#E8EBF0]")}>
                        <td className="px-5 py-3">
                          <div className="t-label-large text-dark flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-muted-fg shrink-0" />
                            <span className="tabular-nums">{e.phone}</span>
                          </div>
                          {e.email && (
                            <div className="t-body-small text-muted-fg flex items-center gap-1.5">
                              <Mail className="h-3 w-3 shrink-0" />
                              {e.email}
                            </div>
                          )}
                          {e.name && <div className="t-body-small text-muted-fg">{e.name}</div>}
                        </td>
                        <td className="px-2 py-3 hidden md:table-cell">
                          <p className="t-body-medium text-dark line-clamp-2 max-w-[300px]">{e.reason}</p>
                        </td>
                        <td className="px-2 py-3 hidden lg:table-cell">
                          <ChipBadge tone={cfg.tone} size="sm" className="gap-1">
                            <SourceIcon className="h-2.5 w-2.5" />
                            {cfg.label}
                          </ChipBadge>
                        </td>
                        <td className="px-2 py-3 hidden lg:table-cell">
                          <div className="t-body-small text-muted-fg">{e.addedAt}</div>
                          {e.addedBy && <div className="t-label-small text-muted-fg">{e.addedBy}</div>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={isLocked}
                            onClick={() => handleRemove(e.id)}
                            aria-label="Remove from DNC list"
                            className={cn("h-7 w-7", isLocked ? "opacity-30" : "opacity-0 group-hover:opacity-100", "transition-opacity")}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-danger-ink" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddDncModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={(entry) => {
        setEntries((e) => [entry, ...e]);
        setShowAddModal(false);
        toast.success("Added to DNC list");
      }} />
    </div>
  );
}

function AddDncModal({
  open, onClose, onAdd,
}: { open: boolean; onClose: () => void; onAdd: (e: DncEntry) => void }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = () => {
    if (!phone.trim() || !reason.trim()) return;
    onAdd({
      id: `dnc-${Date.now()}`,
      phone: phone.trim(),
      email: email.trim() || undefined,
      name: name.trim() || undefined,
      reason: reason.trim(),
      source: "manual",
      addedAt: "Just now",
      addedBy: "Jordan Chen",
    });
    setPhone(""); setEmail(""); setName(""); setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to do-not-call list</DialogTitle>
          <DialogDescription>
            This number will be excluded from every future dial and bulk send across the workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="dnc-phone" className="mb-1.5 block">Phone number <span className="text-danger-ink">*</span></Label>
            <Input id="dnc-phone" placeholder="+1 415 555 0123" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-email" className="mb-1.5 block">Email <span className="text-muted-fg">(optional)</span></Label>
            <Input id="dnc-email" type="email" placeholder="optional@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-name" className="mb-1.5 block">Name <span className="text-muted-fg">(optional)</span></Label>
            <Input id="dnc-name" placeholder="For your records" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dnc-reason" className="mb-1.5 block">Reason <span className="text-danger-ink">*</span></Label>
            <Textarea id="dnc-reason" placeholder="Why is this contact being suppressed?" value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[60px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleAdd} disabled={!phone.trim() || !reason.trim()} className="gap-1.5 bg-stellar text-white hover:bg-stellar-700">
            <ShieldOff className="h-3.5 w-3.5" /> Add to DNC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
