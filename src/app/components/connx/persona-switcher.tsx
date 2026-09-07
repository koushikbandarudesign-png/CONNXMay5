import { ChevronDown, Briefcase, Eye, BarChart3, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { usePersona, PERSONA_LABEL, PERSONA_DESC, type Persona } from "./persona-context";

const ICONS: Record<Persona, React.ComponentType<{ className?: string }>> = {
  recruiter: Briefcase,
  hm: Eye,
  lead: BarChart3,
};

const HOME_ROUTE: Record<Persona, string> = {
  recruiter: "/",
  hm: "/hm",
  lead: "/lead",
};

export function PersonaSwitcher() {
  const { persona, setPersona } = usePersona();
  const navigate = useNavigate();
  const Icon = ICONS[persona];

  const switchTo = (p: Persona) => {
    setPersona(p);
    navigate(HOME_ROUTE[p]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-8">
          <Icon className="h-3.5 w-3.5 text-stellar" />
          <span className="hidden md:inline">{PERSONA_LABEL[persona]}</span>
          <span className="md:hidden">View</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Switch view</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(["recruiter", "hm", "lead"] as Persona[]).map((p) => {
          const I = ICONS[p];
          const active = p === persona;
          return (
            <DropdownMenuItem key={p} onSelect={() => switchTo(p)} className="py-2.5">
              <div className="flex items-start gap-3 w-full">
                <I className="h-4 w-4 text-stellar mt-0.5" />
                <div className="flex-1">
                  <div className="t-label-large">{PERSONA_LABEL[p]}</div>
                  <div className="t-body-small text-muted-fg">{PERSONA_DESC[p]}</div>
                </div>
                {active && <Check className="h-4 w-4 text-stellar mt-0.5" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
