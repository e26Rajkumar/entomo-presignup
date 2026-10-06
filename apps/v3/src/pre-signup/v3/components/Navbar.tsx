import { scopeForOrg, signinRedirectWithReturnTo } from "@/lib/auth";
import { resolveTenant } from "@/lib/tenant";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DirectionToggle } from "./DirectionToggle";
import { assetUrl } from "@/lib/asset-url";

export const Navbar = () => {
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogin() {
    void (async () => {
      const tenant = await resolveTenant();
      await signinRedirectWithReturnTo(auth, {
        scope: scopeForOrg(tenant.zitadelOrgId),
      });
    })();
  }
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <img
              src={assetUrl("/assets/images/ministry-of-labour-logo-light.svg")}
              style={{ height: "44px" }}
              alt="Ministry of Labour"
            />
          </div>

          <div className="navbar-desktop-links">
            <a href="#market-intel" className="navbar-link">
              Market Intel
            </a>
            <a href="#skills-assessment" className="navbar-link">
              Skill Assessment
            </a>
            <a href="#toolkit" className="navbar-link">
              Toolkit
            </a>
            <a href="#terrain" className="navbar-link">
              Career Pathways
            </a>
            <a href="#learning-hub" className="navbar-link">
              Learning Hub
            </a>
            <a href="#arena" className="navbar-link">
              Job Opportunity
            </a>
          </div>

          <div className="navbar-desktop-actions">
            <DirectionToggle />
            <button
              type="button"
              className="navbar-login-btn"
              onClick={handleLogin}
            >
              <span className="navbar-login-text">Login</span>
            </button>
          </div>

          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="navbar-mobile-menu"
            >
              <div
                className="navbar-mobile-inner"
                role="presentation"
                onClick={() => setIsMobileMenuOpen(false)}
                onKeyDown={() => setIsMobileMenuOpen(false)}
              >
                <a href="#market-intel" className="navbar-mobile-link">
                  Market Intel
                </a>
                <a href="#skills-assessment" className="navbar-mobile-link">
                  Skill Assessment
                </a>
                <a href="#toolkit" className="navbar-mobile-link">
                  Toolkit
                </a>
                <a href="#terrain" className="navbar-mobile-link">
                  Career Pathways
                </a>
                <a href="#learning-hub" className="navbar-mobile-link">
                  Learning Hub
                </a>
                <a href="#arena" className="navbar-mobile-link">
                  Job Opportunity
                </a>
                <DirectionToggle />
                <button
                  type="button"
                  className="navbar-mobile-login"
                  onClick={handleLogin}
                >
                  <span className="navbar-mobile-login-text">Login</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
