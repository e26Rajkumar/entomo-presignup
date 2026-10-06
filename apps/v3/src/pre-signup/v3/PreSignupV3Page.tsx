import "./styles/index.css";
import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { useState } from "react";
import { Arena } from "./components/Arena";
import { Arsenal } from "./components/Arsenal";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LearningHub } from "./components/LearningHub";
import { MarketIntel } from "./components/MarketIntel";
import { Navbar } from "./components/Navbar";
import { SkillsAssessment } from "./components/SkillsAssessment";
import { Terrain } from "./components/Terrain";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider } from "./components/ToastContext";

type SectionProps = {
  activeRole: string;
  setActiveRole: (role: string) => void;
  tenantCountryName?: string | null;
};
const SECTION_COMPONENTS: Record<string, (props: SectionProps) => JSX.Element> =
  {
    hero: Hero,
    marketIntel: MarketIntel,
    arsenal: Arsenal,
    terrain: Terrain,
    learningHub: LearningHub,
    skillsAssessment: SkillsAssessment,
    arena: Arena,
  };

export function PreSignupV3Page() {
  const [sections] = useState([
    "hero",
    "marketIntel",
    "skillsAssessment",
    "terrain",
    "learningHub",
    "arsenal",
    "arena",
  ]);

  const [activeRoleContext, setActiveRoleContext] = useState("");
  const tenantLogo = useTenantLogo();

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="pre-signup-v3 app-root">
          <Navbar />
          {sections.map((sectionId) => {
            const Component = SECTION_COMPONENTS[sectionId];
            return (
              <Component
                key={sectionId}
                activeRole={activeRoleContext}
                setActiveRole={setActiveRoleContext}
                tenantCountryName={tenantLogo?.location?.country ?? null}
              />
            );
          })}
          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
