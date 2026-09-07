import { useNavigate } from "react-router";
import { PhoneCall, Send, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { CURRENT_RECRUITER } from "../mock";

export function HeroGreeting() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = CURRENT_RECRUITER.name.split(" ")[0];
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const subline = `Here's what's happening across your roles this ${day}.`;

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="mb-1">{greeting}, {firstName}</h1>
        <p className="text-muted-fg t-body-large">{subline}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate("/bulk")} className="gap-2">
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Compose bulk</span>
          <span className="sm:hidden">Bulk</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate("/dialer")} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-quantum" />
          <span className="hidden sm:inline">Resume queue</span>
          <span className="sm:hidden">Resume</span>
        </Button>
        <Button size="sm" onClick={() => navigate("/dialer")} className="gap-2 bg-stellar text-white hover:bg-stellar-700">
          <PhoneCall className="h-3.5 w-3.5" />
          Start dialer
        </Button>
      </div>
    </div>
  );
}
