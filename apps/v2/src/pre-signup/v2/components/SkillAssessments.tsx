import { handleLogin } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import styles from "./SkillAssessments.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function SkillAssessments({ id }: { id: string }) {
  const auth = useAuth();
  return (
    <div id="assessments" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.leftSide}>
          <h2 className={styles.heading}>
            Skill
            <br />
            <span style={{ fontWeight: 400 }}>Assessments</span>
          </h2>
          <p className={styles.subtext}>
            Validate your expertise with our industry-standard assessments. Get
            certified and show employers you have what it takes to excel in your
            chosen field.
          </p>
          <button
            type="button"
            className={styles.btn}
            onClick={() => handleLogin(auth, id)}
          >
            View Assessments
          </button>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.card}>
            <div className={styles.cardImgWrapper}>
              <img
                src={assetUrl("/assets/images/card-images-pre-signup/assessments-woman-doctor.jpg")}
                alt="Enhance Your Skills Writing"
                className={styles.cardImgEl}
              />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.pills}>
                <span className={styles.pill}>Problem Solving</span>
                <span className={styles.pill}>Domain Knowledge</span>
                <span className={styles.pill}>Critical Thinking</span>
              </div>
              <h3 className={styles.cardTitle}>ENHANCE YOUR SKILLS</h3>
              <p className={styles.cardDesc}>
                Take a comprehensive adaptive assessment to benchmark your
                proficiency, identify skill gaps, and receive a personalised
                learning roadmap built for your career trajectory.
              </p>
            </div>
          </div>

          <div className={styles.decor} />
        </div>
      </div>
    </div>
  );
}
