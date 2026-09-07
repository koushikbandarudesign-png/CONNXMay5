import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard, Briefcase, ShieldCheck, PhoneCall, Send, MessagesSquare,
  FileText, Settings, Plug, Users, BarChart3, Trophy, Target, ClipboardCheck, Inbox,
} from "lucide-react";
import { cn } from "../ui/utils";
import { usePersona, type Persona } from "./persona-context";
import { Logo } from "./logo";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NAV_BY_PERSONA: Record<Persona, { section: string; items: NavItem[] }[]> = {
  recruiter: [
    {
      section: "Workspace",
      items: [
        { to: "/", label: "Dashboard", icon: LayoutDashboard },
        { to: "/roles", label: "Roles & candidates", icon: Briefcase, badge: 6 },
        { to: "/consent", label: "Consent center", icon: ShieldCheck, badge: 12 },
      ],
    },
    {
      section: "Outreach",
      items: [
        { to: "/dialer", label: "Auto Dialer", icon: PhoneCall },
        { to: "/bulk", label: "Bulk comms", icon: Send },
        { to: "/timeline", label: "Candidate timeline", icon: MessagesSquare },
      ],
    },
    {
      section: "Library",
      items: [{ to: "/templates", label: "Templates", icon: FileText }],
    },
  ],
  hm: [
    {
      section: "Pipeline",
      items: [
        { to: "/hm", label: "My roles", icon: LayoutDashboard },
        { to: "/hm/approvals", label: "Approvals", icon: ClipboardCheck, badge: 7 },
        { to: "/hm/digest", label: "Daily digest", icon: Inbox },
      ],
    },
  ],
  lead: [
    {
      section: "Team",
      items: [
        { to: "/lead", label: "Team analytics", icon: BarChart3 },
        { to: "/lead/leaderboard", label: "Leaderboard", icon: Trophy },
        { to: "/lead/goals", label: "Goals & SLAs", icon: Target },
        { to: "/lead/team", label: "Team members", icon: Users },
      ],
    },
  ],
};

const FOOTER_NAV: NavItem[] = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/integrations", label: "Integrations", icon: Plug },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { persona } = usePersona();
  const sections = NAV_BY_PERSONA[persona];

  return (
    <aside className="h-full w-[240px] bg-white border-r border-[#E8EBF0] flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-[#E8EBF0]">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sections.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="t-label-small text-muted-fg px-3 mb-2">{section.section}</div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#E8EBF0] py-3 px-3">
        <div className="flex flex-col gap-0.5">
          {FOOTER_NAV.map((item) => (
            <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  const location = useLocation();
  const isActive =
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      end={item.to === "/" || item.to === "/hm" || item.to === "/lead"}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-md t-label-large transition-colors focus-ring",
        isActive
          ? "bg-stellar-50 text-stellar-700"
          : "text-dark hover:bg-mist hover:text-cosmic"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-stellar" : "text-muted-fg group-hover:text-cosmic")} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "t-label-small rounded-pill px-1.5 py-0.5 min-w-[20px] text-center",
            isActive ? "bg-stellar text-white" : "bg-mist text-cosmic"
          )}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
