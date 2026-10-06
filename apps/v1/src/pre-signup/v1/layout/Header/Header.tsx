import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSupportEmail } from "../../../../hooks/use-support-email";
import { scopeForOrg, signinRedirectWithReturnTo } from "../../../../lib/auth";
import { resolveTenant } from "../../../../lib/tenant";
import { DirectionToggle } from "../../components/DirectionToggle/DirectionToggle";
import styles from "./Header.module.css";

export function Header() {
  const auth = useAuth();
  const supportEmail = useSupportEmail();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    window.addEventListener("hashchange", closeMobileMenu);
    return () => window.removeEventListener("hashchange", closeMobileMenu);
  }, [isMobileMenuOpen, closeMobileMenu]);

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }

  const headerClass = [
    styles["header-2026"],
    isScrolled ? styles.scrolled : "",
    isMobileMenuOpen ? styles["menu-open"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  function handleLogin() {
    void (async () => {
      const tenant = await resolveTenant();
      await signinRedirectWithReturnTo(auth, {
        scope: scopeForOrg(tenant.zitadelOrgId),
      });
    })();
  }

  return (
    <header className={headerClass}>
      <div
        className={styles["single-logo"]}
        aria-label="Ministry of Labour"
        role="img"
      />

      <div className={styles["dynamic-island"]}>
        <div className={styles["header-inner"]}>
          <nav className={`${styles["desktop-nav"]} hidden lg:flex`}>
            <a href="#pathways" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Career Pathways</span>
            </a>
            <a href="#learning" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Skills</span>
            </a>
            <a href="#opportunity" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Jobs</span>
            </a>
            <a href="#evaluations" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Assessment</span>
            </a>
            <a href="#toolkit" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Toolkit</span>
            </a>
            <a href={`mailto:${supportEmail}`} className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Contact Us</span>
            </a>
          </nav>

          <div className={styles["right-actions"]}>
            <div className="hidden lg:block">
              <div className={styles["login-group"]}>
                <DirectionToggle />
                <button
                  className={styles["btn-glow"]}
                  type="button"
                  onClick={handleLogin}
                >
                  <span className={styles["btn-text"]}>Login</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`${styles["mobile-toggle"]} lg:hidden`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              <div className={styles.hamburger}>
                <span className={`${styles.line} ${styles["line-1"]}`} />
                <span className={`${styles.line} ${styles["line-2"]}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${styles["mobile-overlay"]} ${isMobileMenuOpen ? styles.active : ""}`}
        onClick={closeMobileMenu}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeMobileMenu();
        }}
      >
        <div
          className={styles["mobile-menu-inner"]}
          role="presentation"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <nav className={styles["mobile-nav"]}>
            <a href="#pathways" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Career Pathways</span>
            </a>

            <a href="#learning" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Skills</span>
            </a>

            <a href="#opportunity" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Jobs</span>
            </a>

            <a href="#evaluations" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Assessment</span>
            </a>
            <a href="#toolkit" className={styles["nav-link"]}>
              <span className={styles["link-text"]}>Toolkit</span>
            </a>
            {/* A mailto link never fires `hashchange`, so close the menu here. */}
            <a
              href={`mailto:${supportEmail}`}
              className={styles["nav-link"]}
              onClick={closeMobileMenu}
            >
              <span className={styles["link-text"]}>Contact Us</span>
            </a>
          </nav>

          <div
            className={`${styles["mobile-actions"]} mt-12`}
            style={{ "--i": 7 } as React.CSSProperties}
          >
            <div className="flex justify-center mb-6">
              <DirectionToggle />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className={`${styles["btn-glow"]} w-full py-4 mb-4 flex justify-center`}
            >
              <span className={styles["btn-text"]}>Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
