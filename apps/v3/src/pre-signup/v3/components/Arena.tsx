import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { assetUrl } from "@/lib/asset-url";

export const Arena = () => {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();
  return (
    <div id="arena" className="arena-root">
      {/* Hero Section */}
      <section className="arena-hero">
        <div className="arena-hero-bg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHoearADV7b-7GktdUtO_p3CJ0_dkKmSVe4Y-9fx9cx4EFkXTh8jge2DwZr3pZpaTaUriJ2aLItEcz04wx6F0_GaiEdEsINmtXpOGDJB6nwnss3Ghn-eTcnAP3sKdH_WYlUzIHA_ArlKatoYfb2_8xi5r5lfInwSW0KMZPEEHBlaiQZPdzRzKrycwSVmbVZLcmz3_NBGS5iOBLV4PC1gijYflHujOlAGFvBNlq8NzOm0xSwbdU-8dZpB5v7Lf_ZCtXOMND39eBHRI"
            alt="Mountain Arena"
            className="arena-hero-img"
          />
          <div className="arena-hero-overlay" />
        </div>

        <div className="arena-hero-content">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="arena-hero-title">JOB</h1>
            <h1 className="arena-hero-title-accent">OPPORTUNITY</h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="arena-hero-desc"
          >
            Where preparation meets execution. Step into simulated professional
            environments, test your readiness, and unlock exclusive
            opportunities.
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
            className="arena-hero-cta-wrapper"
          >
            <button
              type="button"
              className="arena-hero-cta"
              onClick={() => handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")}
            >
              <span className="arena-hero-cta-text">JOIN THE EXPEDITION</span>
              <div className="arena-hero-cta-icon">
                <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
              </div>
            </button>
          </motion.div>
        </div>

        <div className="arena-hero-scroll">
          <ChevronDown style={{ width: "2rem", height: "2rem" }} />
        </div>
      </section>

      <section className="arena-core">
        {/* One-Click Apply Section */}
        <div className="arena-apply">
          <div className="arena-apply-image-col">
            <div className="arena-apply-image-frame">
              <img
                src={assetUrl("/assets/images/card-images-pre-signup/learning-jobs-man-in-engineering.jpg")}
                alt="Professional Success"
                className="arena-apply-img"
              />
              <div className="arena-apply-img-overlay" />
              <div className="arena-apply-img-panel">
                <div className="arena-apply-img-panel-row">
                  <div>
                    <p className="arena-apply-match-label">Match Score</p>
                    <p className="arena-apply-match-score">High Match</p>
                  </div>
                  <button
                    type="button"
                    className="arena-apply-img-btn"
                    onClick={() =>
                      handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")
                    }
                  >
                    <ArrowUpRight className="arena-apply-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="arena-apply-content">
            <h2 className="arena-apply-title">
              ONE-CLICK
              <br />
              <span className="arena-apply-title-accent">APPLY</span>
            </h2>
            <p className="arena-apply-desc">
              Once your profile is optimized and your skills are verified,
              bypass the traditional application black hole. Apply directly to
              our partner network with a single click.
            </p>
            <ul className="arena-apply-list">
              <li className="arena-apply-list-item">
                <div
                  className="arena-apply-list-dot"
                  style={{ backgroundColor: "var(--color-brand-peach)" }}
                />
                <span className="arena-apply-list-text">
                  Get an instant match score for every role
                </span>
              </li>
              <li className="arena-apply-list-item">
                <div
                  className="arena-apply-list-dot"
                  style={{ backgroundColor: "var(--color-brand-blue)" }}
                />
                <span className="arena-apply-list-text">
                  Auto-fill applications from your verified profile
                </span>
              </li>
              <li className="arena-apply-list-item">
                <div
                  className="arena-apply-list-dot"
                  style={{ backgroundColor: "var(--color-brand-yellow)" }}
                />
                <span className="arena-apply-list-text">
                  Keep track of your applications
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
