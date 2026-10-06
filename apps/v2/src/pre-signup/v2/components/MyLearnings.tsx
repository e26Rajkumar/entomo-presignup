import { handleLogin } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import styles from "./MyLearnings.module.css";
import { assetUrl } from "@/lib/asset-url";

export default function MyLearnings({ id }: { id: string }) {
  const auth = useAuth();

  return (
    <div id="learnings" className={styles.section}>
      <div className={styles.bgBlur} />

      <div className={styles.headerGroup}>
        <h2 className={styles.heading}>
          Level <span className={styles.headingAccent}>Up</span>
        </h2>
        <div className={styles.underline} />
      </div>

      {/* ── Fan layout: 1200px+ ── */}
      <div className={styles.fanWrapper}>
        <div className={styles.fanInner}>
          {/* Card 1: Based on Trajectory */}
          <div className={`${styles.fanCard} ${styles.fanCard1}`}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-jobs-man-in-engineering.jpg")}
              alt="Trajectory"
              className={styles.cardImg}
            />
            <div className={styles.cardOverlay}>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Based on Trajectory</span>
                <div className={styles.cardExpand}>
                  <p className={styles.cardExpandText}>
                    Advanced courses matching your exact career path to
                    accelerate your promotion timeline.
                  </p>
                  <button
                    type="button"
                    className={styles.exploreBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Skill Gap */}
          <div className={`${styles.fanCard} ${styles.fanCard2}`}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-man-in-it.jpg")}
              alt="Skill Gap"
              className={styles.cardImg}
            />
            <div className={styles.cardOverlay}>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Skill Gap</span>
                <div className={styles.cardExpand}>
                  <p className={styles.cardExpandText}>
                    Targeted modules designed to quickly bridge the technical
                    gaps standing between you and your next role.
                  </p>
                  <button
                    type="button"
                    className={styles.exploreBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Popular in Domain (Center) */}
          <div className={`${styles.fanCard} ${styles.fanCard3}`}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/mixed-classroom-session.jpg")}
              alt="Popular"
              className={styles.cardImg}
            />
            <div className={styles.cardOverlayCenter}>
              <div className={styles.cardContentCenter}>
                <h3 className={styles.cardTitleCenter}>Popular in Domain</h3>
                <p className={styles.cardTrendingTag}>Trending now</p>
                <div className={styles.cardExpandCenter}>
                  <p className={styles.cardExpandText}>
                    The most sought-after skills and certifications trending
                    right now in your industry.
                  </p>
                  <button
                    type="button"
                    className={styles.exploreBtnRed}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Behavioral Economics */}
          <div className={`${styles.fanCard} ${styles.fanCard4}`}>
            <span className={styles.univBadge}>Univ</span>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg")}
              alt="Behavioral Economics"
              className={styles.cardImg}
            />
            <div className={styles.cardOverlay}>
              <div className={styles.cardContent}>
                <span className={styles.cardLabelLg}>Behavioral Economics</span>
                <div className={styles.cardExpand}>
                  <p className={styles.cardExpandText}>
                    Understand the psychology of decision-making. Essential for
                    ambitious product, logic, and management leaders.
                  </p>
                  <button
                    type="button"
                    className={styles.exploreBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Ethics in AI & Tech */}
          <div className={`${styles.fanCard} ${styles.fanCard5}`}>
            <span className={styles.univBadge}>Univ</span>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-woman-studying.jpg")}
              alt="Ethics"
              className={styles.cardImg}
            />
            <div className={styles.cardOverlay}>
              <div className={styles.cardContent}>
                <span className={styles.cardLabelLg}>
                  Ethics in AI &amp; Tech
                </span>
                <div className={styles.cardExpand}>
                  <p className={styles.cardExpandText}>
                    Critical frameworks for building responsible, unbiased, and
                    forward-thinking modern technologies.
                  </p>
                  <button
                    type="button"
                    className={styles.exploreBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid layout: below 1200px ── */}
      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={styles.gridCard}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-jobs-man-in-engineering.jpg")}
              alt="Trajectory"
              className={styles.gridCardImg}
            />
            <div className={styles.gridOverlay}>
              <div className={styles.gridContent}>
                <span className={styles.gridLabel}>Based on Trajectory</span>
                <div className={styles.gridExpand}>
                  <p className={styles.gridExpandText}>
                    Advanced courses matching your exact career path to
                    accelerate your promotion timeline.
                  </p>
                  <button
                    type="button"
                    className={styles.gridExpandBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.gridCard}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-man-in-it.jpg")}
              alt="Skill Gap"
              className={styles.gridCardImg}
            />
            <div className={styles.gridOverlay}>
              <div className={styles.gridContent}>
                <span className={styles.gridLabel}>Skill Gap</span>
                <div className={styles.gridExpand}>
                  <p className={styles.gridExpandText}>
                    Targeted modules designed to quickly bridge the technical
                    gaps standing between you and your next role.
                  </p>
                  <button
                    type="button"
                    className={styles.gridExpandBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Featured */}
          <div className={styles.gridCardFeatured}>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/mixed-classroom-session.jpg")}
              alt="Popular"
              className={styles.gridCardImg}
            />
            <div className={styles.gridOverlayCenter}>
              <div className={styles.gridContentCenter}>
                <h3 className={styles.gridTitleCenter}>Popular in Domain</h3>
                <p className={styles.gridTrendingTag}>Trending now</p>
                <div className={styles.gridExpandCenter}>
                  <p className={styles.gridExpandText}>
                    The most sought-after skills and certifications trending
                    right now in your industry.
                  </p>
                  <button
                    type="button"
                    className={styles.gridExpandBtnRed}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className={styles.gridCard}>
            <span className={styles.univBadgeSm}>Univ</span>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg")}
              alt="Behavioral Economics"
              className={styles.gridCardImg}
            />
            <div className={styles.gridOverlay}>
              <div className={styles.gridContent}>
                <span className={styles.gridLabel}>Behavioral Economics</span>
                <div className={styles.gridExpand}>
                  <p className={styles.gridExpandText}>
                    Understand the psychology of decision-making. Essential for
                    ambitious product, logic, and management leaders.
                  </p>
                  <button
                    type="button"
                    className={styles.gridExpandBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className={styles.gridCard}>
            <span className={styles.univBadgeSm}>Univ</span>
            <img
              src={assetUrl("/assets/images/card-images-pre-signup/learning-woman-studying.jpg")}
              alt="Ethics"
              className={styles.gridCardImg}
            />
            <div className={styles.gridOverlay}>
              <div className={styles.gridContent}>
                <span className={styles.gridLabel}>
                  Ethics in AI &amp; Tech
                </span>
                <div className={styles.gridExpand}>
                  <p className={styles.gridExpandText}>
                    Critical frameworks for building responsible, unbiased, and
                    forward-thinking modern technologies.
                  </p>
                  <button
                    type="button"
                    className={styles.gridExpandBtn}
                    onClick={() => handleLogin(auth, id)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
