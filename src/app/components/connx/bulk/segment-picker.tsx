import { useState } from "react";
import { ChevronDown, Users, Zap, Plus, Filter, ListFilter } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Input } from "../../ui/input";
import { ScrollArea } from "../../ui/scroll-area";
import { SEGMENTS, type Segment } from "../pass5-mock";
import { cn } from "../../ui/utils";
import { ChipBadge } from "../ui-helpers";

interface SegmentPickerProps {
  value: string;
  onChange: (segmentId: string) => void;
}

export function SegmentPicker({ value, onChange }: SegmentPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = SEGMENTS.find((s) => s.id === value);
  const filtered = SEGMENTS.filter((s) =>
    !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-[#E8EBF0] bg-white hover:border-stellar/40 transition-colors focus-ring">
          {selected ? (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 rounded-md bg-stellar-50 text-stellar flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="t-label-large text-dark truncate">{selected.name}</div>
                <div className="t-body-small text-muted-fg truncate">{selected.description}</div>
              </div>
              <ChipBadge tone="info" size="sm" className="shrink-0">
                {selected.candidateCount} {selected.candidateCount === 1 ? "candidate" : "candidates"}
              </ChipBadge>
            </div>
          ) : (
            <span className="t-body-medium text-muted-fg">Select a segment…</span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-fg shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[440px] p-0">
        <div className="p-2 border-b border-[#E8EBF0]">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-fg" />
            <Input placeholder="Search segments…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-8 text-[13px]" />
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-1">
            <div className="px-2 py-1 t-label-small text-muted-fg">System segments · auto-updated</div>
            {filtered.filter((s) => s.isSystem).map((s) => (
              <SegmentRow key={s.id} segment={s} active={s.id === value} onClick={() => { onChange(s.id); setOpen(false); }} />
            ))}

            <div className="px-2 py-1 mt-2 t-label-small text-muted-fg">Custom segments</div>
            {filtered.filter((s) => !s.isSystem).map((s) => (
              <SegmentRow key={s.id} segment={s} active={s.id === value} onClick={() => { onChange(s.id); setOpen(false); }} />
            ))}

            <div className="border-t border-[#E8EBF0] mt-2 pt-2">
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-mist transition-colors t-body-medium text-stellar">
                <Plus className="h-3.5 w-3.5" /> Create new segment
              </button>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function SegmentRow({ segment: s, active, onClick }: { segment: Segment; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-2.5 p-2 rounded-md transition-colors text-left",
        active ? "bg-stellar-50" : "hover:bg-mist"
      )}
    >
      <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5", s.isDynamic ? "bg-stellar-50 text-stellar" : "bg-mist text-quantum")}>
        {s.isDynamic ? <Zap className="h-3.5 w-3.5" /> : <ListFilter className="h-3.5 w-3.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("t-label-large", active ? "text-stellar-700" : "text-dark")}>{s.name}</span>
          {s.isDynamic && <ChipBadge tone="info" size="sm">Dynamic</ChipBadge>}
        </div>
        <div className="t-body-small text-muted-fg leading-snug">{s.description}</div>
      </div>
      <ChipBadge tone="outline" size="sm" className="shrink-0">{s.candidateCount}</ChipBadge>
    </button>
  );
}
