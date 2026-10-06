import styles from "./Footer.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <img
            src={assetUrl("/assets/images/ministry-of-labour-logo.svg")}
            alt="Ministry of Labour"
            style={{ height: "44px" }}
          />
        </div>

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

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} entomo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
