import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth-context";

const SUB_FEATURES = [
  {
    id: "resume",
    title: "Resume\nBuilder",
    desc: "Crafting impact-driven resumes that bypass ATS algorithms and catch human eyes.",
    isSecretWeapon: false,
  },
  {
    id: "sop",
    title: "Cover\nLetter",
    desc: "Narratives that connect. Personalized stories for every application at scale.",
    isSecretWeapon: false,
  },
  {
    id: "ai",
    title: "AI\nOptimizer",
    desc: "Leverage AI to refine and optimize your profile for better visibility.",
    isSecretWeapon: true,
  },
];

export const Arsenal = () => {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();
  return (
    <div id="toolkit" className="arsenal-root">
      <div className="arsenal-main">
        {/* Left Hero Column */}
        <div className="arsenal-sidebar">
          <div>
            <motion.h1
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="arsenal-title"
            >
              THE
              <br />
              TOOL
              <br />
              KIT
            </motion.h1>
            <p className="arsenal-desc">
              A comprehensive suite of professional tools designed to position
              you ahead of the competition.
            </p>
          </div>
          <a href="#learning-hub" className="arsenal-cta">
            <span className="arsenal-cta-text">Explore Tools</span>
            <ArrowRight className="arsenal-cta-icon" />
          </a>
        </div>

        {/* Right Grid Column */}
        <div className="arsenal-content">
          {/* Top row: Resume Builder + Cover Letter */}
          <div className="arsenal-top-grid">
            {SUB_FEATURES.filter((f) => !f.isSecretWeapon).map((feature) => (
              <article key={feature.id} className="arsenal-feature">
                <button
                  type="button"
                  className="arsenal-feature-icon-wrap"
                  onClick={() =>
                    handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                  }
                >
                  <div className="arsenal-feature-icon">
                    <ArrowUpRight style={{ width: "1rem", height: "1rem" }} />
                  </div>
                </button>
                <div className="arsenal-feature-body">
                  <h3 className="arsenal-feature-title">{feature.title}</h3>
                  <p className="arsenal-feature-desc">{feature.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {SUB_FEATURES.filter((f) => f.isSecretWeapon).map((feature) => (
            <article key={feature.id} className="arsenal-ai-feature">
              <div className="arsenal-ai-inner">
                <div className="arsenal-ai-header">
                  <span className="arsenal-ai-badge">AI Powered</span>
                  <button
                    className="arsenal-ai-icon"
                    type="button"
                    onClick={() =>
                      handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                    }
                  >
                    <ArrowUpRight style={{ width: "1rem", height: "1rem" }} />
                  </button>
                </div>
                <div className="arsenal-ai-body">
                  <h3 className="arsenal-ai-title">{feature.title}</h3>
                  <p className="arsenal-ai-desc">{feature.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
