import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSupportEmail } from "../../../../hooks/use-support-email";
import { useTenantLogo } from "../../../../hooks/use-tenant-logo";
import { usePublicPolicyContent } from "../../../../hooks/usePublicPolicyContent";
import { scopeForOrg, signinRedirectWithReturnTo } from "../../../../lib/auth";
import { useRoleCareerPath } from "../../../../lib/market-intelligence-queries";
import { resolveTenant } from "../../../../lib/tenant";
import { ColorTitle } from "../../components/ColorTitle/ColorTitle";
import {
  HeroCarouselDots,
  HeroCarouselSlides,
  useHeroCarousel,
} from "../../components/HeroCarousel/HeroCarousel";
import { useScrollActivateClass } from "../../hooks/useScrollActivateClass";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { useThemeScroll } from "../../hooks/useThemeScroll";
import { MarketIntelSection } from "./sections/MarketIntelSection/MarketIntelSection";
import "./HomePage.css";
import { assetUrl } from "@/lib/asset-url";

const DEFAULT_CAREER_PATH = {
  intern: {
    title: "",
    description:
      "Select a role from Career Intelligence above to see your personalised career progression.",
  },
  junior: {
    title: "",
    description:
      "Click any trending role to reveal the career journey tailored to your selection.",
  },
  senior: {
    title: "",
    description:
      "Each role comes with real-world titles and descriptions specific to that career track.",
  },
  csuite: {
    title: "",
    description:
      "Your path to the top — tailored to the market role you choose.",
  },
};

const TRENDING_SKILLS = [
  {
    id: 1,
    title: "Enhance your skills",
    description:
      "Take a comprehensive adaptive assessment to benchmark your proficiency, identify skill gaps, and receive a personalised learning roadmap built for your career trajectory.",
    img: assetUrl("/assets/images/card-images-pre-signup/assessments-woman-doctor.jpg"),
    tags: ["Problem Solving", "Domain Knowledge", "Critical Thinking"],
    duration: "45 Mins",
    difficulty: "Advanced",
  },
];

export function HomePage() {
  const auth = useAuth();
  const tenantLogo = useTenantLogo();
  const supportEmail = useSupportEmail();
  const heroCarousel = useHeroCarousel();
  // The role the user entered/picked in Career Intelligence (independent of
  // which trending role is currently selected in the grid) — anchors the
  // career-path timeline below (Task 13).
  const [enteredRole, setEnteredRole] = useState<string>("");

  const pathwaysQuery = useRoleCareerPath(enteredRole);

  // Footer legal links are only fetched once the footer nears the viewport —
  // the landing page is a long scroll and most visits never reach it.
  const footerRef = useRef<HTMLElement>(null);
  const [footerNearViewport, setFooterNearViewport] = useState(false);

  useEffect(() => {
    if (footerNearViewport) return;
    const node = footerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setFooterNearViewport(true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [footerNearViewport]);

  const { data: privacyPolicyDoc } = usePublicPolicyContent(
    "privacy-policy",
    footerNearViewport,
  );
  const { data: termsDoc } = usePublicPolicyContent(
    "terms-and-conditions",
    footerNearViewport,
  );

  // Section refs for scroll hooks
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const marketIntelRef = useRef<HTMLElement>(null);
  const pathwaysRef = useRef<HTMLElement>(null);
  const learningRef = useRef<HTMLElement>(null);
  const evaluationsRef = useRef<HTMLElement>(null);
  const opportunityRef = useRef<HTMLElement>(null);
  const toolkitRef = useRef<HTMLElement>(null);
  const joinNetworkRef = useRef<HTMLElement>(null);
  const pathHorizontalRef = useRef<HTMLDivElement>(null);

  // Theme scroll
  useThemeScroll(heroScrollRef, "white");
  useThemeScroll(
    marketIntelRef as React.RefObject<HTMLElement | null>,
    "white",
  );
  useThemeScroll(pathwaysRef as React.RefObject<HTMLElement | null>, "white");
  useThemeScroll(learningRef as React.RefObject<HTMLElement | null>, "white");
  useThemeScroll(
    evaluationsRef as React.RefObject<HTMLElement | null>,
    "white",
  );
  useThemeScroll(
    opportunityRef as React.RefObject<HTMLElement | null>,
    "white",
  );
  useThemeScroll(toolkitRef as React.RefObject<HTMLElement | null>, "white");
  useThemeScroll(
    joinNetworkRef as React.RefObject<HTMLElement | null>,
    "white",
  );

  // Scroll progress for hero video animation
  useScrollProgress(heroScrollRef, { start: "top top", end: "bottom bottom" });

  // Scroll activate class for career path timeline
  useScrollActivateClass(
    pathHorizontalRef as React.RefObject<HTMLElement | null>,
    {
      activeClass: "path-active",
      start: "top 90%",
    },
  );

  // Career path data is derived from the pathways query for the selected role.
  const careerPathData = useMemo(() => {
    const data = pathwaysQuery.data;
    if (!data) return DEFAULT_CAREER_PATH;
    const get = (n: number) => data.stages.find((s) => s.stage === n);
    return {
      intern: {
        title: get(1)?.title ?? "",
        description: get(1)?.description ?? "",
      },
      junior: {
        title: get(2)?.title ?? "",
        description: get(2)?.description ?? "",
      },
      senior: {
        title: get(3)?.title ?? "",
        description: get(3)?.description ?? "",
      },
      csuite: {
        title: get(4)?.title ?? "",
        description: get(4)?.description ?? "",
      },
    };
  }, [pathwaysQuery.data]);

  // Clearing the field ("Change Field") drops the anchored role so the
  // pathways section falls back to its default, un-personalised state.
  const handleFieldReset = useCallback(() => {
    setEnteredRole("");
  }, []);

  function handleLogin() {
    void (async () => {
      const tenant = await resolveTenant();
      await signinRedirectWithReturnTo(auth, {
        scope: scopeForOrg(tenant.zitadelOrgId),
      });
    })();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      handleLogin();
    }
  }
  return (
    <>
      <main id="home" className="page_main">
        {/* Hero Section: photo carousel backdrop with the scroll-driven logo */}
        <div ref={heroScrollRef} className="video_scroll_container">
          <div className="hero_backdrop">
            <HeroCarouselSlides index={heroCarousel.index} />
          </div>

          <div className="srolling_image">
            <img
              src={assetUrl("/assets/images/ministry-of-labour-logo-light.svg")}
              alt="Ministry of Labour"
              className="mx-auto block"
            />
          </div>

          <section className="hero_section">
            <div className="container">
              <div className="hero_container">
                <div className="relative">
                  <ColorTitle />
                  <p className="title_sbText">
                    Unlock your full potential. We give you the tools to design
                    a career that fits you.
                  </p>
                </div>
                <div className="mt-12">
                  <button
                    type="button"
                    className="btn-website"
                    onClick={handleLogin}
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
            <div className="hero_dots">
              <HeroCarouselDots
                index={heroCarousel.index}
                onSelect={heroCarousel.goTo}
              />
            </div>
          </section>
        </div>

        {/* Career Intelligence Section. Clearing the field via "Change Field"
            drops the selected role so the pathways section below reverts to its
            default state until a new role is picked. */}
        <MarketIntelSection
          ref={marketIntelRef as React.Ref<HTMLElement>}
          onRoleSelected={() => {}}
          onReset={handleFieldReset}
          onEnteredRole={setEnteredRole}
          tenantCountryName={tenantLogo?.location?.country ?? null}
        />

        {/* Career Pathways Section */}
        <section id="pathways" ref={pathwaysRef} className="careerPath_section">
          <div className="container">
            <div className="text-center">
              <div className="display-1 pathways-title">
                explore your pathways
              </div>
              <p className="mt-4">
                Discover career pathways tailored to your field. Select a role
                from Career Intelligence above to see your personalised career
                progression from Entry Level to Executive.
              </p>
              <div className="mt-12 flex items-center justify-center">
                <button
                  type="button"
                  className="btn-website"
                  onClick={handleLogin}
                >
                  Find Your Path
                </button>
              </div>
              {pathwaysQuery.isError && !!enteredRole && (
                <p className="mt-6" style={{ opacity: 0.7 }}>
                  Unable to load personalized pathway. Showing generic career
                  levels.
                </p>
              )}
            </div>
            <div className="career-stack-list">
              {[
                {
                  num: "LVL1",
                  stage: "Current Role",
                  data: careerPathData.intern,
                },
                {
                  num: "LVL2",
                  stage: "Next Step",
                  data: careerPathData.junior,
                },
                {
                  num: "LVL3",
                  stage: "Advanced Step",
                  data: careerPathData.senior,
                },
                {
                  num: "LVL4",
                  stage: "Leadership Step",
                  data: careerPathData.csuite,
                  highlight: true,
                },
              ].map(({ num, stage, data, highlight }) => (
                <div key={num} className="career-stack-item">
                  <div
                    className={`career-stack-card${highlight ? " csc-highlight" : ""}`}
                  >
                    <div className="csc-num">{num}</div>
                    <div className="csc-stage">{data.title || stage}</div>
                    <div className="csc-desc">{data.description}</div>
                  </div>
                </div>
              ))}

              <div className="career-stack-item summary-item">
                <div ref={pathHorizontalRef} className="path-horizontal-view">
                  <div className="path-line-container">
                    <div className="path-line-base" />
                    <div className="path-line-fill" />
                    <div className="path-nodes-wrapper">
                      {[
                        {
                          num: "LVL1",
                          label: "Current Role",
                          role: careerPathData.intern.title,
                        },
                        {
                          num: "LVL2",
                          label: "Next Step",
                          role: careerPathData.junior.title,
                        },
                        {
                          num: "LVL3",
                          label: "Advanced Step",
                          role: careerPathData.senior.title,
                        },
                        {
                          num: "LVL4",
                          label: "Leadership Step",
                          role: careerPathData.csuite.title,
                          highlighted: true,
                        },
                      ].map(({ num, label, role, highlighted }) => (
                        <div
                          key={num}
                          className={`path-node-item${highlighted ? " highlighted" : ""}`}
                        >
                          <div className="node-dot">
                            <span className="node-number">{num}</span>
                          </div>
                          <div className="node-info">
                            <div className="node-label">{role || label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {pathwaysQuery.data && (
                  <p className="ai-disclaimer">
                    Generated by AI. Validate important facts independently.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Learning Section */}
        <section
          id="learning"
          ref={learningRef}
          className="learning_section_v2"
        >
          <div className="container">
            <div className="text-center">
              <div className="display-1 learning-title">Level Up</div>
              <p className="mt-4">
                Build in-demand digital skills and launch your career through
                curated learning pathways.
              </p>
            </div>
            <div className="v4-masonry mt-12">
              <div
                // biome-ignore lint/a11y/useSemanticElements: bespoke masonry card; a native <button> would break the grid/CSS layout. role + tabIndex + key handler give equivalent button semantics.
                role="button"
                tabIndex={0}
                className="v4-masonry-col v4-col-large cursor-pointer"
                onClick={handleLogin}
                onKeyDown={handleKeyDown}
              >
                <div className="v4-masonry-card v4-tall">
                  <img
                    src={assetUrl("/assets/images/card-images-pre-signup/mixed-classroom-session.jpg")}
                    alt="Most Popular Courses"
                  />
                  <div className="v4-card-overlay" />
                  <div className="v4-card-content">
                    <h3>Most Popular Courses</h3>
                    <p>
                      Explore the courses learners are taking the most right
                      now.
                    </p>
                  </div>
                </div>
              </div>
              <div className="v4-masonry-col">
                <div
                  // biome-ignore lint/a11y/useSemanticElements: bespoke masonry card; a native <button> would break the grid/CSS layout. role + tabIndex + key handler give equivalent button semantics.
                  role="button"
                  tabIndex={0}
                  className="v4-masonry-card v4-short cursor-pointer"
                  onClick={handleLogin}
                  onKeyDown={handleKeyDown}
                >
                  <img
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-woman-studying.jpg")}
                    alt="Recommended for You"
                  />
                  <div className="v4-card-overlay" />
                  <div className="v4-card-content">
                    <h4>Recommended for You</h4>
                    <p>
                      Find courses that match your interests, skills, and career
                      goals
                    </p>
                  </div>
                </div>
                <div
                  // biome-ignore lint/a11y/useSemanticElements: bespoke masonry card; a native <button> would break the grid/CSS layout. role + tabIndex + key handler give equivalent button semantics.
                  role="button"
                  tabIndex={0}
                  className="v4-masonry-card v4-short v4-uni relative cursor-pointer"
                  onClick={handleLogin}
                  onKeyDown={handleKeyDown}
                >
                  <img
                    src={assetUrl("/assets/images/card-images-pre-signup/assessments-woman-doctor.jpg")}
                    alt="Build the Skills You Need"
                  />
                  <div className="v4-card-overlay" />
                  <div className="v4-card-content">
                    <h4>Build the Skills You Need</h4>
                    <p>
                      Discover courses that can help you strengthen the skills
                      you want to improve
                    </p>
                  </div>
                </div>
              </div>
              <div className="v4-masonry-col">
                <div
                  // biome-ignore lint/a11y/useSemanticElements: bespoke masonry card; a native <button> would break the grid/CSS layout. role + tabIndex + key handler give equivalent button semantics.
                  role="button"
                  tabIndex={0}
                  className="v4-masonry-card v4-short cursor-pointer"
                  onClick={handleLogin}
                  onKeyDown={handleKeyDown}
                >
                  <img
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-man-in-it.jpg")}
                    alt="Browse by Topic"
                  />
                  <div className="v4-card-overlay" />
                  <div className="v4-card-content">
                    <h4>Browse by Topic</h4>
                    <p>
                      Choose from courses in AI, cybersecurity, data, digital,
                      productivity, software development, and more
                    </p>
                  </div>
                </div>
                <div
                  // biome-ignore lint/a11y/useSemanticElements: bespoke masonry card; a native <button> would break the grid/CSS layout. role + tabIndex + key handler give equivalent button semantics.
                  role="button"
                  tabIndex={0}
                  className="v4-masonry-card v4-short v4-uni relative cursor-pointer"
                  onClick={handleLogin}
                  onKeyDown={handleKeyDown}
                >
                  <img
                    src={assetUrl("/assets/images/card-images-pre-signup/learning-jobs-man-in-engineering.jpg")}
                    alt="Courses from DICT and Our Partners"
                  />
                  <div className="v4-card-overlay" />
                  <div className="v4-card-content">
                    <h4>Courses from DICT and Our Partners</h4>
                    <p>
                      Access learning content from DICT, government agencies,
                      schools, and industry partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 flex items-center justify-center">
              <button
                type="button"
                className="btn-website"
                onClick={handleLogin}
              >
                Explore Full Catalog
              </button>
            </div>
          </div>
        </section>

        {/* Job Opportunity Section */}
        <section id="opportunity" ref={opportunityRef} className="jobs_section">
          <div>
            <div className="container">
              <div className="text-center">
                <div className="display-1 opportunity-title">
                  JOB OPPORTUNITY
                </div>
                <p className="mt-4">
                  Where preparation meets execution. Step into simulated
                  professional environments, test your readiness, and unlock
                  exclusive opportunities.
                </p>
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    className="btn-website"
                    onClick={handleLogin}
                  >
                    Join The Expedition
                  </button>
                </div>
              </div>
            </div>
            <div className="container mt-12">
              <div className="flex flex-wrap items-center">
                <div className="w-full md:w-1/2 px-4 jobs-card-wrap">
                  <div
                    className="relative rounded-3xl overflow-hidden shadow-lg"
                    style={{ aspectRatio: "1/1", background: "#000" }}
                  >
                    <img
                      src={assetUrl("/assets/images/card-images-pre-signup/jobs-man-in-office.jpg")}
                      className="w-full h-full"
                      style={{ objectFit: "cover", opacity: 0.8 }}
                      alt="Apply to Jobs Faster"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <div
                        className="p-6 rounded-2xl flex justify-between items-center"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(15px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div>
                          <div
                            className="text-white/50 uppercase font-bold mb-1"
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "1.5px",
                            }}
                          >
                            Match Score
                          </div>
                          <div
                            className="display-3 font-bold text-white mb-0"
                            style={{ lineHeight: 1 }}
                          >
                            94%
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Sign in to view match details"
                          className="rounded-full flex items-center justify-center"
                          style={{
                            width: "54px",
                            height: "54px",
                            background: "#c3d6e3",
                            color: "#000",
                            cursor: "pointer",
                            border: "none",
                          }}
                          onClick={handleLogin}
                        >
                          <svg
                            aria-hidden="true"
                            className="rtl:-scale-x-100"
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 17L17 7M17 17V7H7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0 jobs-card-wrap">
                  <div className="card-section card-section-dark">
                    <div className="display-3 oneclick-title">
                      Apply to Jobs Faster
                    </div>
                    <p className="mt-4">
                      Once you have completed your profile, you can apply for
                      jobs more quickly using your saved information.
                    </p>
                    <ul className="mt-4 list-none oneclick-features">
                      <li>
                        <Check size={20} className="shrink-0" aria-hidden />
                        Get an instant match score for every role
                      </li>
                      <li>
                        <Check size={20} className="shrink-0" aria-hidden />
                        Auto-fill applications from your verified profile
                      </li>
                      <li>
                        <Check size={20} className="shrink-0" aria-hidden />
                        Keep track of your applications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Assessments Section */}
        <section
          id="evaluations"
          ref={evaluationsRef}
          className="skill-section"
        >
          <div className="container">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 md:gap-8 lg:gap-12">
              <div className="w-full lg:w-7/12 pl-4">
                <div className="display-1 evaluations-title">
                  Skill
                  <br />
                  <span className="whitespace-nowrap ">Assessments</span>
                </div>
                <p className="mt-4">
                  Real-time insights into what the industry is demanding right
                  now. Complete evaluations to benchmark your proficiency
                  against market realities.
                </p>
                <div className="mt-12 mb-6 md:mb-0">
                  <button
                    type="button"
                    className="btn-website"
                    onClick={handleLogin}
                  >
                    View All Assessments
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-5/12 pr-4 pt-3 lg:pt-0">
                <div>
                  {TRENDING_SKILLS.map((skill) => (
                    <div
                      key={skill.id}
                      className="project_card skill-assess-card flex flex-col h-full"
                      style={{
                        borderRadius: "20px",
                        overflow: "hidden",
                        background: "#fff",
                        color: "#000",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div style={{ height: "220px", position: "relative" }}>
                        <img
                          src={skill.img}
                          alt={skill.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 30%",
                          }}
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-6">
                            {skill.tags.map((tag) => (
                              <span
                                key={tag}
                                className="badge"
                                style={{
                                  background: "#f0f0f0",
                                  color: "#333",
                                  fontWeight: 600,
                                  padding: "6px 10px",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="display-7">{skill.title}</div>
                        <p className="mt-2 text-sm">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toolkit Section */}
        <section id="toolkit" ref={toolkitRef} className="bg-[#3464b0]">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs uppercase tracking-widest text-white/80 font-bold mb-3">
                Career Acceleration Tools
              </div>
              <h2 className="display-1 text-white font-bold tracking-tight">
                Toolkit Features
              </h2>
            </div>

            {/* White cards on the blue section: blue titles, black body text. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Card 1: Resume Builder */}
              <div
                // biome-ignore lint/a11y/useSemanticElements: bespoke toolkit card; a native <button> would break the layout. role + tabIndex + key handler give equivalent button semantics.
                role="button"
                tabIndex={0}
                onClick={handleLogin}
                onKeyDown={handleKeyDown}
                className="relative overflow-hidden rounded-toolkit-card bg-white p-4 sm:p-8 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex w-full flex-col items-center gap-3">
                  <h3 className="text-h1 text-(--color-heading) lg:min-h-16">
                    Resume
                    <br />
                    <span className="font-normal">Builder</span>
                  </h3>
                  <p className="text-black text-sm leading-relaxed">
                    Create a professional resume that highlights your skills and
                    experience.
                  </p>
                </div>
              </div>

              {/* Card 2: Cover Letter Generator */}
              <div
                // biome-ignore lint/a11y/useSemanticElements: bespoke toolkit card; a native <button> would break the layout. role + tabIndex + key handler give equivalent button semantics.
                role="button"
                tabIndex={0}
                onClick={handleLogin}
                onKeyDown={handleKeyDown}
                className="relative overflow-hidden rounded-toolkit-card bg-white p-4 sm:p-8 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex w-full flex-col items-center gap-3">
                  <h3 className="text-h1 text-(--color-heading) lg:min-h-16">
                    AI Cover
                    <br />
                    <span className="font-normal">Letter</span>
                  </h3>
                  <p className="text-black text-sm leading-relaxed">
                    Create a personalized cover letter for every job
                    application.
                  </p>
                </div>
              </div>

              {/* Card 3: Flashcards */}
              <div
                // biome-ignore lint/a11y/useSemanticElements: bespoke toolkit card; a native <button> would break the layout. role + tabIndex + key handler give equivalent button semantics.
                role="button"
                tabIndex={0}
                onClick={handleLogin}
                onKeyDown={handleKeyDown}
                className="relative overflow-hidden rounded-toolkit-card bg-white p-4 sm:p-8 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex w-full flex-col items-center gap-3">
                  <h3 className="text-h1 text-(--color-heading) lg:min-h-16">
                    Interactive
                    <br />
                    <span className="font-normal">Flashcards</span>
                  </h3>
                  <p className="text-black text-sm leading-relaxed">
                    Test your real-world understanding with scenario-based
                    interview flashcards!
                  </p>
                </div>
              </div>

              {/* Card 4: Mock Interview Simulator */}
              <div
                // biome-ignore lint/a11y/useSemanticElements: bespoke toolkit card; a native <button> would break the layout. role + tabIndex + key handler give equivalent button semantics.
                role="button"
                tabIndex={0}
                onClick={handleLogin}
                onKeyDown={handleKeyDown}
                className="relative overflow-hidden rounded-toolkit-card bg-white p-4 sm:p-8 flex flex-col items-center justify-start text-center shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex w-full flex-col items-center gap-3">
                  <h3 className="text-h1 text-(--color-heading) lg:min-h-16">
                    Mock
                    <br />
                    <span className="font-normal">Interview</span>
                  </h3>
                  <p className="text-black text-sm leading-relaxed">
                    Simulated real-world interviews with speech, posture, and
                    answer evaluation reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Network Section */}
        <section
          id="join-network"
          ref={joinNetworkRef}
          className="relative overflow-hidden"
        >
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-700/25 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                Get started
              </span>
              <h2 className="display-1 text-(--color-heading) text-balance">
                Join the network
              </h2>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap items-start gap-10 lg:gap-16">
              {/* Left: pitch + CTA */}
              <div className="w-full lg:w-2/5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-(--color-heading) leading-tight mb-6 text-balance">
                  Your career, <span className="italic">starting now.</span>
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-md">
                  Join thousands of professionals mapping their career path,
                  building AI-optimized resumes, and landing better jobs.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-(--color-cta) text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 active:scale-95 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 cursor-pointer"
                  onClick={handleLogin}
                >
                  Create account
                  <svg
                    aria-hidden="true"
                    className="rtl:-scale-x-100"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Right: numbered onboarding steps */}
              <div className="w-full lg:w-3/5 flex flex-col gap-5">
                <div className="rounded-2xl p-6 sm:p-8 bg-white border-2 border-dict-blue transition-all duration-300 hover:shadow-xl hover:shadow-blue-700/15">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-dict-blue text-on-dark font-extrabold flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xl font-bold text-(--color-heading)">
                      Create and secure your account
                    </h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Provide your name and email, create a secure password, and
                    accept our Terms of Service and Privacy Policy to get
                    started.
                  </p>
                </div>

                <div className="rounded-2xl p-6 sm:p-8 bg-white border-2 border-dict-blue transition-all duration-300 hover:shadow-xl hover:shadow-blue-700/15">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-dict-blue text-on-dark font-extrabold flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-xl font-bold text-(--color-heading)">
                      Verify and start exploring
                    </h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Confirm your email, then get instant access to career
                    pathways, resume tools, mock interviews, and skill
                    assessments tailored to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" ref={footerRef}>
        <div className="container">
          <div className="footer-header flex flex-col items-center gap-8 py-12 border-b border-white_10">
            <div className="footer-brand flex w-full justify-center">
              <img
                src={assetUrl("/assets/images/ministry-of-labour-logo-light.svg")}
                alt="Ministry of Labour"
                className="footer-logo-main"
              />
            </div>
            <div className="footer-nav flex flex-wrap justify-center gap-x-6 gap-y-3">
              <a href="#pathways" className="footer-link">
                Career Pathways
              </a>
              <a href="#learning" className="footer-link">
                Skills
              </a>
              <a href="#opportunity" className="footer-link">
                Jobs
              </a>
              <a href="#evaluations" className="footer-link">
                Assessment
              </a>
              <a href="#toolkit" className="footer-link">
                Toolkit
              </a>
              <a href={`mailto:${supportEmail}`} className="footer-link">
                Contact Us
              </a>
            </div>
          </div>
          <div className="footer-bottom py-6 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            <div className="copyright" style={{ fontSize: "0.8rem" }}>
              Powered by Entomo. All rights reserved.
            </div>
            {/* Hidden when neither policy link is available, so its share of the
                row gap doesn't nudge the copyright off-centre. */}
            <div className="legal-links flex items-center gap-6 empty:hidden">
              {privacyPolicyDoc?.available && privacyPolicyDoc.url && (
                <a
                  href={privacyPolicyDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-sm"
                >
                  Privacy Policy
                </a>
              )}
              {termsDoc?.available && termsDoc.url && (
                <a
                  href={termsDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-sm"
                >
                  Terms of Service
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
