import { useState } from "react";
import { User, Bell, LayoutGrid, ShieldOff, Phone, Globe2, MapPin, KeyRound, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { cn } from "../../ui/utils";

import { ProfileSection } from "../settings/profile-section";
import { NotificationsSection } from "../settings/notifications-section";
import { LayoutSection } from "../settings/layout-section";
import { DncSection } from "../settings/dnc-section";
import { TelephonySection } from "../settings/telephony-section";
import { LanguagesSection } from "../settings/languages-section";
import { DataResidencySection } from "../settings/data-residency-section";
import { SecuritySection } from "../settings/security-section";

type SectionId =
  | "profile" | "notifications" | "layout" | "dnc"
  | "telephony" | "languages" | "data" | "security";

const SECTIONS: { group: string; items: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    group: "Account",
    items: [
      { id: "profile",       label: "Profile & preferences", icon: User },
      { id: "notifications", label: "Notifications",         icon: Bell },
      { id: "security",      label: "Security",              icon: KeyRound },
    ],
  },
  {
    group: "Workspace",
    items: [
      { id: "layout",    label: "Auto Dialer layout", icon: LayoutGrid },
      { id: "dnc",       label: "Do-not-call list",   icon: ShieldOff },
      { id: "telephony", label: "Telephony region",   icon: Phone },
    ],
  },
  {
    group: "Compliance",
    items: [
      { id: "languages", label: "Languages",      icon: Globe2 },
      { id: "data",      label: "Data residency", icon: MapPin },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-[1280px] mx-auto">
      <div className="mb-5">
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-fg t-body-large">
          Configure how CONNX works for you and your workspace. Changes save automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 lg:gap-6">
        <Card className="lg:sticky lg:top-20 self-start h-fit shadow-cx-1">
          <CardContent className="p-2">
            <button
              className="lg:hidden flex items-center justify-between w-full p-3 rounded-md t-label-large text-cosmic"
              onClick={() => setShowMobileNav(!showMobileNav)}
            >
              <span>{SECTIONS.flatMap(s => s.items).find(i => i.id === activeSection)?.label}</span>
              <ChevronRight className={cn("h-4 w-4 transition-transform", showMobileNav && "rotate-90")} />
            </button>

            <div className={cn("flex flex-col gap-1", !showMobileNav && "hidden lg:flex")}>
              {SECTIONS.map((section) => (
                <div key={section.group} className="mb-2">
                  <div className="t-label-small text-muted-fg px-3 pt-2 pb-1.5">{section.group}</div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveSection(item.id); setShowMobileNav(false); }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md t-label-large transition-colors focus-ring text-left w-full",
                          active
                            ? "bg-stellar-50 text-stellar-700"
                            : "text-dark hover:bg-mist hover:text-cosmic"
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-stellar" : "text-muted-fg")} />
                        <span className="flex-1 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "layout" && <LayoutSection />}
          {activeSection === "dnc" && <DncSection />}
          {activeSection === "telephony" && <TelephonySection />}
          {activeSection === "languages" && <LanguagesSection />}
          {activeSection === "data" && <DataResidencySection />}
          {activeSection === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}
