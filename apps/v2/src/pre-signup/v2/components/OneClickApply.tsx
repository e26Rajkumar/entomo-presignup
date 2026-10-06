import { handleLogin } from "@/lib/utils";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import styles from "./OneClickApply.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function OneClickApply({ id }: { id: string }) {
  const auth = useAuth();

  return (
    <div id="jobs" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.leftSide}>
          <h3 className={styles.heading}>
            One Click <span className={styles.headingAccent}>Apply</span>
          </h3>
          <div className={styles.divider} />
          <p className={styles.subtext}>
            Skip the tedious forms. Our AI-powered matching system identifies
            the best roles for you and lets you apply instantly with your
            optimized toolkit.
          </p>

          <ul className={styles.list}>
            {[
              "Personalized Job Recommendations",
              "Instant Application Process",
              "Real-time Status Tracking",
            ].map((item) => (
              <li key={item} className={styles.listItem}>
                <CheckCircle2 />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.card}>
            <div className={styles.cardImgWrapper}>
              <img
                src={assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg")}
                alt="Job application"
                className={styles.cardImg}
              />
              <button type="button" onClick={() => handleLogin(auth, id)}>
                <div className={styles.cardLink}>
                  <ArrowUpRight />
                </div>
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.jobRow}>
                <div>
                  <h4 className={styles.jobTitle}>Senior Product Designer</h4>
                  <p className={styles.jobSub}>TechFlow Inc. • Remote</p>
                </div>
                <div className={styles.badgeHigh}>High Match</div>
              </div>

              <div className={styles.jobRow}>
                <div>
                  <h4 className={styles.jobTitle}>UX Researcher</h4>
                  <p className={styles.jobSub}>DesignLabs • New York</p>
                </div>
                <div className={styles.badgeMed}>Medium</div>
              </div>

              <div className={styles.jobRowLast}>
                <div>
                  <h4 className={styles.jobTitle}>Marketing Specialist</h4>
                  <p className={styles.jobSub}>GrowthCo • London</p>
                </div>
                <div className={styles.badgeLow}>Low Match</div>
              </div>
            </div>
          </div>

          <div className={styles.decor} />
        </div>
      </div>
    </div>
  );
}
