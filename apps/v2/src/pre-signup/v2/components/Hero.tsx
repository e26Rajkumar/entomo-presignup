import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import styles from "./Hero.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function Hero() {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();

  return (
    <div className={styles.section}>
      <div className={styles.bg}>
        <img
          src={assetUrl("/assets/images/card-images-pre-signup/mixed-classroom-session.jpg")}
          alt="Team collaborating"
          className={styles.bgImg}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Empowering your
          <br />
          <span className={styles.titleAccent}>career journey.</span>
        </h1>

        <p className={styles.subtitle}>
          From building the perfect resume to landing your dream job, entomo
          guides you every step of the way with AI-powered tools and expert
          mentoring.
        </p>

        <div className={styles.ctaWrapper}>
          <button
            type="button"
            className={styles.ctaBtn}
            onClick={() => handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")}
          >
            Get Started
            <ArrowRight className={styles.ctaBtnIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
