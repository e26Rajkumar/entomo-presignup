import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { Play } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { assetUrl } from "@/lib/asset-url";

export const SkillsAssessment = () => {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();
  return (
    <section id="skills-assessment" className="sa-root">
      <div className="sa-inner">
        <div className="sa-content">
          <div className="sa-badge-row">
            <span className="sa-badge">Evaluate</span>
          </div>
          <h2 className="sa-title">
            SKILLS
            <br />
            ASSESSMENT
          </h2>
          <div className="sa-body">
            <p className="sa-desc">
              Take a comprehensive adaptive assessment to benchmark your
              proficiency, identify skill gaps, and receive a personalised
              learning roadmap built for your career trajectory.
            </p>
            <button
              type="button"
              className="sa-cta"
              onClick={() => handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")}
            >
              <Play
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  fill: "currentColor",
                }}
              />
              <span className="sa-cta-text">Start Assessment</span>
            </button>
          </div>
        </div>

        <div className="sa-image-wrapper">
          <img
            src={assetUrl("/assets/images/card-images-pre-signup/assessments-woman-doctor.jpg")}
            alt="Skill Assessment"
            className="sa-image"
          />
          <div className="sa-image-overlay" />
          <div className="sa-image-footer">
            <span className="sa-image-label">Take the next step</span>
            <h3 className="sa-image-title">
              Enhance Your
              <br />
              Skills
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};
