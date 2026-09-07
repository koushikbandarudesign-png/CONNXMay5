import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Bell, Search, Sparkles, Menu, PhoneCall, Send, UserPlus, Briefcase,
  Calendar, MessagesSquare, ShieldCheck, FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "../ui/command";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../ui/sheet";
import { PersonaSwitcher } from "./persona-switcher";
import { Sidebar } from "./sidebar";
import { CURRENT_RECRUITER, ORG, initials } from "./mock";

export function TopBar() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setCmdOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="h-14 border-b border-[#E8EBF0] bg-white px-4 lg:px-6 flex items-center gap-3 sticky top-0 z-30">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 max-w-[260px] w-[260px]">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SheetDescription className="sr-only">Primary navigation for CONNX</SheetDescription>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-2">
          <PersonaSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-nebula border border-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-1">
                <NotifItem icon={<ShieldCheck className="h-4 w-4 text-success-ink" />} title="Owen Walsh accepted consent" desc="Senior Backend Engineer · 34 min ago" />
                <NotifItem icon={<MessagesSquare className="h-4 w-4 text-stellar" />} title="New SMS reply from Naomi Petrov" desc="Confirmed callback for tomorrow 11am" />
                <NotifItem icon={<Sparkles className="h-4 w-4 text-quantum" />} title="LEO suggests calling Diego Mendoza now" desc="Best-time-to-reach window opens in 5 min" />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-stellar">View all activity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-pill focus-ring" aria-label="Account menu">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="leo-avatar-gradient text-white t-label-medium">
                    {initials(CURRENT_RECRUITER.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <div className="px-2 py-1.5">
                <div className="t-label-large">{CURRENT_RECRUITER.name}</div>
                <div className="t-body-small text-muted-fg">{CURRENT_RECRUITER.email}</div>
                <div className="t-body-small text-muted-fg mt-1">{ORG.name} · {CURRENT_RECRUITER.team}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/settings")}>Profile & preferences</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/settings")}>Layout preferences</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/integrations")}>Integrations</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger-ink">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Ask CONNX in plain English, or search..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup heading="Ask LEO">
            <CommandItem onSelect={() => go("/dialer")}>
              <Sparkles className="h-4 w-4 text-quantum" />
              <span>Show consented candidates I haven't called for Sr. Backend Engineer</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/bulk")}>
              <Sparkles className="h-4 w-4 text-quantum" />
              <span>Send a follow-up SMS to everyone who declined last week</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/")}>
              <Sparkles className="h-4 w-4 text-quantum" />
              <span>What should I do first today?</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => go("/dialer")}>
              <PhoneCall className="h-4 w-4 text-stellar" />
              <span>Start dialer session</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/bulk")}>
              <Send className="h-4 w-4 text-stellar" />
              <span>Compose bulk message</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/roles")}>
              <UserPlus className="h-4 w-4 text-stellar" />
              <span>Add candidate</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Go to">
            <CommandItem onSelect={() => go("/")}>
              <Briefcase className="h-4 w-4" /> <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/roles")}>
              <Briefcase className="h-4 w-4" /> <span>Roles & candidates</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/consent")}>
              <ShieldCheck className="h-4 w-4" /> <span>Consent center</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/templates")}>
              <FileText className="h-4 w-4" /> <span>Templates</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/timeline")}>
              <Calendar className="h-4 w-4" /> <span>Candidate timeline</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function NotifItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-mist cursor-pointer transition-colors">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="t-label-large truncate">{title}</div>
        <div className="t-body-small text-muted-fg">{desc}</div>
      </div>
    </div>
  );
}
