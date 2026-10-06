import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./Documents.module.css";
import { assetUrl } from "@/lib/asset-url";

const features = [
  {
    id: "resume",
    title: "Resume Builder",
    desc: "Craft a standout resume with AI-driven suggestions tailored to your industry.",
    img: assetUrl("/assets/images/card-images-pre-signup/learning-man-in-it.jpg"),
    flexDirection: "column" as const,
  },
  {
    id: "cover",
    title: "Cover Letter",
    desc: "Generate tailored cover letters for every job application instantly.",
    img: assetUrl("/assets/images/card-images-pre-signup/learning-woman-studying.jpg"),
    flexDirection: "column" as const,
  },
  {
    id: "optimise",
    title: "Optimizer",
    desc: "Score and improve your documents against ATS and industry standards.",
    img: assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg"),
    flexDirection: "column-reverse" as const,
  },
];

export default function Documents() {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const activeFeature = features.find((f) => f.id === activeTab) ?? features[0];
  const activeIndex = features.findIndex((f) => f.id === activeTab);

  return (
    <div id="documents" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <h2 className={styles.heading}>
            The <span className={styles.headingAccent}>Toolkit</span>
          </h2>
          <div className={styles.underline} />

          <div className={styles.featureList}>
            <motion.div
              className={styles.featureIndicator}
              style={{ height: "24px", top: `${activeIndex * 56}px` }}
            />
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveTab(feature.id)}
                className={`${styles.featureItem} ${activeTab === feature.id ? styles.featureItemActive : styles.featureItemInactive}`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.cardRight}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={styles.cardInner}
              style={{ flexDirection: activeFeature.flexDirection }}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{activeFeature.title}</h3>
                <p className={styles.cardDesc}>{activeFeature.desc}</p>
              </div>
              <div className={styles.cardImgWrapper}>
                <img
                  src={activeFeature.img}
                  alt={activeFeature.title}
                  className={styles.cardImg}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
