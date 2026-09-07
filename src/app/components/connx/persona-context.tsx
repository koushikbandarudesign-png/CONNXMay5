import { createContext, useContext, useState, type ReactNode } from "react";

export type Persona = "recruiter" | "hm" | "lead";

interface PersonaCtx {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

const Ctx = createContext<PersonaCtx | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>("recruiter");
  return <Ctx.Provider value={{ persona, setPersona }}>{children}</Ctx.Provider>;
}

export function usePersona() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}

export const PERSONA_LABEL: Record<Persona, string> = {
  recruiter: "Recruiter",
  hm: "Hiring Manager",
  lead: "Recruitment Lead",
};

export const PERSONA_DESC: Record<Persona, string> = {
  recruiter: "Day-to-day candidate outreach",
  hm: "Pipeline review and approvals",
  lead: "Team performance and goals",
};
