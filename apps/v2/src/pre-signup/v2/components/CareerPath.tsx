import { useTextDirection } from "@/hooks/use-text-direction";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import styles from "./CareerPath.module.css";

const defaultSteps = [
  {
    level: "Entry Level",
    role: "Junior Associate",
    desc: "Start your journey with foundational skills and guided learning.",
  },
  {
    level: "Mid Level",
    role: "Senior Specialist",
    desc: "Take on complex projects and start mentoring others.",
  },
  {
    level: "Senior",
    role: "Principal / Lead",
    desc: "Shape industry trends and lead large-scale initiatives.",
  },
  {
    level: "Executive",
    role: "Director / VP",
    desc: "Drive strategic vision and organizational growth at the highest level.",
  },
];

export default function CareerPath({
  data,
}: { data?: { role: string; stages: unknown[] } | null }) {
  const [currentStep, setCurrentStep] = useState(0);
  // Slides enter from the end side, so "next" moves the way the page reads.
  const slideSign = useTextDirection() === "rtl" ? -1 : 1;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset step when role data changes
  useEffect(() => {
    setCurrentStep(0);
  }, [data]);

  const displaySteps = useMemo(() => {
    if (!data || !data.stages || data.stages.length === 0) return defaultSteps;
    return defaultSteps.map((step, idx) => {
      const dynamicStage = data.stages[idx] as
        | { title?: string; desc?: string }
        | undefined;
      if (!dynamicStage) return step;
      return {
        ...step,
        role: dynamicStage.title || step.role,
        desc: dynamicStage.desc || step.desc,
      };
    });
  }, [data]);

  const nextStep = () =>
    setCurrentStep((prev) => (prev + 1) % displaySteps.length);
  const prevStep = () =>
    setCurrentStep(
      (prev) => (prev - 1 + displaySteps.length) % displaySteps.length,
    );

  const step = displaySteps[currentStep];

  return (
    <div id="career-path" className={styles.section}>
      <div className={styles.leftSide}>
        <h2 className={styles.heading}>
          Career Path <span className={styles.headingAccent}>Visualizer</span>
        </h2>
        <div className={styles.underline} />

        <p className={styles.subtext}>
          {data
            ? `Your progression path for ${data.role}. Traverse through all 4 stages from Entry to Executive to see how you will scale.`
            : "Discover career pathways tailored to your field. Select a role from Market Intelligence above to see your personalised career progression."}
        </p>

        <div className={styles.btnGroup}>
          <button
            type="button"
            onClick={prevStep}
            className={`${styles.navBtn} cursor-pointer`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={nextStep}
            className={`${styles.navBtn} cursor-pointer`}
          >
            <ChevronRight />
          </button>
        </div>

        <div className={styles.dots}>
          {displaySteps.map((step, idx) => (
            <div
              key={step.level}
              className={`${styles.dot} ${idx === currentStep ? styles.dotActive : styles.dotInactive}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.cardDecor} />
        <div className={styles.card}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 * slideSign, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -50 * slideSign, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={styles.cardSlide}
            >
              <div className={styles.cardHeader}>
                <span className={styles.pill}>{step.level}</span>
                <span className={styles.stepNum}>0{currentStep + 1}</span>
              </div>

              <div>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={styles.cardTitle}
                >
                  {step.role}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={styles.cardDesc}
                >
                  {step.desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
