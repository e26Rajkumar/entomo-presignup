import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type React from "react";
import { useAuth } from "@/lib/auth-context";
import { assetUrl } from "@/lib/asset-url";

export const Hero = () => {
  const [heroBg, setHeroBg] = useState(
    assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg"),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeroBg(url);
    }
  };

  const auth = useAuth();
  const tenantLogo = useTenantLogo();

  return (
    <div id="hero" className="hero-root">
      <main className="hero-main">
        <section className="hero-section">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Professional Workspace"
            className="hero-img"
            src={heroBg}
          />
          <div className="hero-overlay-top" />
          <div className="hero-overlay-side" />

          <div className="hero-content">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title-wrapper"
            >
              <h1 className="hero-title">
                <span
                  className="hero-title-line1"
                  style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
                >
                  YOUR CAREER IS AN ADVENTURE.
                </span>
                <span className="hero-title-line2">LET'S MAP IT.</span>
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-cta-wrapper"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleLogin(auth, tenantLogo?.zitadelOrgId ?? "");
              }}
              className="hero-cta-btn"
            >
              <span className="hero-cta-text">Start Your Journey</span>
              <ArrowRight className="hero-cta-icon" />
            </button>
          </motion.div>
        </section>
      </main>

      {/* Hidden file input for potential future use */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
    </div>
  );
};
