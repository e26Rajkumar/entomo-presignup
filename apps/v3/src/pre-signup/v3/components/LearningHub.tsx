import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { assetUrl } from "@/lib/asset-url";

export const LearningHub = () => {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();

  return (
    <div id="learning-hub" className="lh-root">
      {/* Hero Section */}
      <header className="lh-header">
        <div className="lh-header-inner">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lh-title"
          >
            SHARPEN <br /> YOUR EDGE
          </motion.h1>

          <p className="lh-subtitle">
            Refine your expertise with entomo's curated learning paths. From
            AI-driven suggestions to university-endorsed certifications, build a
            profile that stands out precisely engineered for your next role.
          </p>
        </div>
      </header>

      {/* Main Learning Content */}
      <main id="explore" className="lh-main">
        <div className="lh-container">
          <section>
            <div className="lh-grid">
              {/* Category Card 1 - Main Large Area */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lh-card-wrapper lh-card-wrapper-large"
              >
                <div className="lh-card">
                  <img
                    alt="Career Growth"
                    className="lh-card-img"
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-jobs-man-in-engineering.jpg")}
                  />
                  <div className="lh-card-overlay-b" />
                  <div className="lh-card-content-bottom">
                    <h3 className="lh-card-title-large">
                      Based on
                      <br />
                      Trajectory
                    </h3>
                    <button
                      className="lh-card-cta"
                      type="button"
                      onClick={() =>
                        handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                      }
                    >
                      <span className="lh-card-cta-text">Explore Paths</span>
                      <ArrowRight className="lh-card-cta-icon" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Category Card 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lh-card-wrapper lh-card-medium lh-card-wrapper-medium"
              >
                <div className="lh-card">
                  <img
                    alt="Skill Essentials"
                    className="lh-card-img"
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-man-in-it.jpg")}
                  />
                  <div className="lh-card-overlay-b" />
                  <button
                    type="button"
                    className="lh-card-content-bottom-row"
                    onClick={() =>
                      handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                    }
                  >
                    <h3 className="lh-card-title-medium">
                      Skill Gap
                      <br />
                      Identification
                    </h3>
                    <ArrowRight className="lh-card-cta-icon-small" />
                  </button>
                </div>
              </motion.div>

              {/* Category Card 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lh-card-wrapper lh-card-medium lh-card-wrapper-medium"
              >
                <div className="lh-card">
                  <img
                    alt="Trending in your Field"
                    className="lh-card-img"
                    src={assetUrl("/assets/images/card-images-pre-signup/mixed-classroom-session.jpg")}
                  />
                  <div className="lh-card-overlay-b" />
                  <button
                    type="button"
                    className="lh-card-content-bottom-row"
                    onClick={() =>
                      handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                    }
                  >
                    <h3 className="lh-card-title-medium">
                      Popular in
                      <br />
                      Your Domain
                    </h3>
                    <ArrowRight className="lh-card-cta-icon-small" />
                  </button>
                </div>
              </motion.div>

              {/* Featured University Course 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lh-card-wrapper lh-card-wrapper-half"
              >
                <div className="lh-card">
                  <span className="lh-univ-badge">UNIV</span>
                  {/* <button
                    type="button"
                    className="lh-edit-btn"
                    title="Edit this course"
                    onClick={() => showToast("Edit mode coming soon")}
                  >
                    <Pencil style={{ width: "1rem", height: "1rem" }} />
                  </button> */}
                  <img
                    alt="Ethics in AI"
                    className="lh-card-img"
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-woman-studying.jpg")}
                  />
                  <div className="lh-card-overlay-r" />
                  <div className="lh-card-content-center">
                    <div className="lh-card-meta">
                      <span
                        className="lh-card-dot"
                        style={{ backgroundColor: "var(--color-brand-blue)" }}
                      />
                      <p className="lh-card-source">Stanford Online</p>
                    </div>
                    <h3
                      className="lh-card-title-large"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                    >
                      Ethics in AI
                      <br />
                      &amp; Tech
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Featured University Course 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="lh-card-wrapper lh-card-wrapper-half"
              >
                <div className="lh-card">
                  <span className="lh-univ-badge">UNIV</span>
                  {/* <button
                    type="button"
                    className="lh-edit-btn"
                    title="Edit this course"
                    onClick={() => showToast("Edit mode coming soon")}
                  >
                    <Pencil style={{ width: "1rem", height: "1rem" }} />
                  </button> */}
                  <img
                    alt="Behavioral Economics"
                    className="lh-card-img"
                    src={assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg")}
                  />
                  <div className="lh-card-overlay-r" />
                  <div className="lh-card-content-center">
                    <div className="lh-card-meta">
                      <span
                        className="lh-card-dot"
                        style={{ backgroundColor: "var(--color-brand-peach)" }}
                      />
                      <p className="lh-card-source">MIT Sloan</p>
                    </div>
                    <h3
                      className="lh-card-title-large"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                    >
                      Behavioral
                      <br />
                      Economics
                    </h3>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
