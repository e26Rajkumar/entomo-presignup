import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useCareerPathways } from "../../../lib/market-intelligence-queries";

const ACCENT_COLORS: Record<string, string> = {
  "border-brand-blue": "var(--color-brand-blue)",
  "border-brand-orange": "var(--color-brand-orange)",
  "border-brand-yellow": "var(--color-brand-yellow)",
  "border-brand-peach": "var(--color-brand-peach)",
};

const DOT_COLORS: Record<string, string> = {
  "bg-brand-blue": "var(--color-brand-blue)",
  "bg-brand-orange": "var(--color-brand-orange)",
  "bg-brand-yellow": "var(--color-brand-yellow)",
  "bg-brand-peach": "var(--color-brand-peach)",
};

const ACCENTS = [
  "border-brand-blue",
  "border-brand-orange",
  "border-brand-yellow",
  "border-brand-peach",
] as const;

const DOTS = [
  "bg-brand-blue",
  "bg-brand-orange",
  "bg-brand-yellow",
  "bg-brand-peach",
] as const;

export const Terrain = ({ activeRole }: { activeRole?: string }) => {
  const roleName = activeRole || "Professional";
  const pathways = useCareerPathways(activeRole ?? "");

  const careerPath = pathways.data?.stages
    ? pathways.data.stages.map((stage, i) => ({
        step: String(stage.stage).padStart(2, "0"),
        title: stage.title,
        desc: stage.description,
        accent: ACCENTS[i] ?? ACCENTS[3],
        dotColor: DOTS[i] ?? DOTS[3],
        highlighted: stage.stage === 2,
        level: stage.level,
      }))
    : [
        {
          step: "01",
          title: `Junior ${roleName}`,
          desc: "Building foundation through hands-on learning, mentorship, and early skill discovery in your chosen field.",
          accent: ACCENTS[0],
          dotColor: DOTS[0],
          highlighted: false,
          level: "ENTRY LEVEL",
        },
        {
          step: "02",
          title: `${roleName}`,
          desc: "Creating impactful contributions while developing core competencies and learning from senior peers.",
          accent: ACCENTS[1],
          dotColor: DOTS[1],
          highlighted: true,
          level: "MID LEVEL",
        },
        {
          step: "03",
          title: `Senior ${roleName}`,
          desc: "Leading projects, mentoring others, and driving technical or strategic decisions with deep expertise.",
          accent: ACCENTS[2],
          dotColor: DOTS[2],
          highlighted: false,
          level: "SENIOR",
        },
        {
          step: "04",
          title: `Lead ${roleName}`,
          desc: "Defining company vision, driving organizational strategy, and shaping the future of the industry.",
          accent: ACCENTS[3],
          dotColor: DOTS[3],
          highlighted: false,
          level: "EXECUTIVE",
        },
      ];

  return (
    <div id="terrain" className="terrain-root">
      <main className="terrain-main">
        {/* Header */}
        <header className="terrain-header">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 className="terrain-title">
              EXPLORE YOUR
              <br />
              PATHWAYS
            </h1>
            <p className="terrain-subtitle">
              Discover career pathways across industries.
            </p>
          </motion.div>
        </header>

        {/* Career Path Section */}
        <div>
          <div className="terrain-path-meta">
            <span className="terrain-path-badge">Your Path</span>
            <h2 className="terrain-path-heading">Career Progression</h2>
          </div>
          <p className="terrain-path-desc">
            From your first internship to the executive suite — visualize where
            you are and where you're headed.
          </p>

          <div className="terrain-timeline">
            <div className="terrain-timeline-line">
              <div
                className="roadmap-line"
                style={{ width: "100%", height: "100%", opacity: 0.3 }}
              />
            </div>

            <div className="terrain-grid">
              {careerPath.map((level, i) => (
                <motion.div
                  key={level.step}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className={`terrain-card-wrapper ${level.highlighted ? "terrain-card-wrapper-highlighted" : ""}`}
                >
                  <div
                    className="terrain-card"
                    style={{ borderLeftColor: ACCENT_COLORS[level.accent] }}
                  >
                    <div
                      className="terrain-card-dot"
                      style={{ backgroundColor: DOT_COLORS[level.dotColor] }}
                    />

                    <div className="terrain-card-header">
                      <span className="terrain-card-step">{level.step}</span>
                      {level.highlighted && (
                        <span className="terrain-card-badge">You Are Here</span>
                      )}
                    </div>
                    <h3 className="terrain-card-title">{level.title}</h3>
                    <p className="terrain-card-desc">{level.desc}</p>

                    {i < careerPath.length - 1 && (
                      <div className="terrain-card-arrow">
                        <ArrowRight
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            color: "rgba(255,255,255,0.6)",
                            transform: "rotate(90deg)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
