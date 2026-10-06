import { scopeForOrg, signinRedirectWithReturnTo } from "@/lib/auth";
import { resolveTenant } from "@/lib/tenant";
import { useAuth } from "@/lib/auth-context";
import DirectionToggle from "./DirectionToggle";
import styles from "./Navbar.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function Navbar() {
  const auth = useAuth();

  function handleLogin() {
    void (async () => {
      const tenant = await resolveTenant();
      await signinRedirectWithReturnTo(auth, {
        scope: scopeForOrg(tenant.zitadelOrgId),
      });
    })();
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <img
          src={assetUrl("/assets/images/ministry-of-labour-logo.svg")}
          alt="Ministry of Labour"
          style={{ height: "44px" }}
        />

        <div className={styles.links}>
          <a href="#career-path" className={styles.link}>
            Pathways
          </a>
          <a href="#learnings" className={styles.link}>
            Level Up
          </a>
          <a href="#assessments" className={styles.link}>
            Assessments
          </a>
          <a href="#documents" className={styles.link}>
            Toolkit
          </a>

          <a href="#jobs" className={styles.link}>
            Jobs
          </a>
        </div>

        <div className={styles.actions}>
          <DirectionToggle />
          <button
            type="button"
            className={`${styles.signInBtn} cursor-pointer`}
            onClick={handleLogin}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
