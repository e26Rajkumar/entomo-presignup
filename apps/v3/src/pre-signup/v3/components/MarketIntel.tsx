import {
  type GeoCountry,
  resolveTenantCountry,
  usePublicGeoCountries,
} from "@/lib/geo-queries";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Globe,
  Loader2,
  Search,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { signinRedirectWithReturnTo } from "../../../lib/auth";
import {
  useAutocomplete,
  useMarketSearch,
} from "../../../lib/market-intelligence-queries";
import { useToast } from "./ToastContext";

const EMPTY_COUNTRIES: GeoCountry[] = [];

interface Field {
  id: string;
  name: string;
}

interface TrendingRole {
  id: string;
  name: string;
  growthPercentage: number;
  compensation: { entryLevel: number; advancedLevel: number };
  skills: { id: string; name: string; growthPercentage: number }[];
}

const FALLBACK_ROLES: TrendingRole[] = [
  {
    id: "ai-solutions-architect",
    name: "AI Solutions Architect",
    growthPercentage: 124,
    compensation: { entryLevel: 120000, advancedLevel: 210000 },
    skills: [
      { id: "llm-fine-tuning", name: "LLM Fine-tuning", growthPercentage: 80 },
      { id: "system-design", name: "System Design", growthPercentage: 60 },
      { id: "pytorch", name: "PyTorch", growthPercentage: 55 },
      { id: "ethical-ai", name: "Ethical AI", growthPercentage: 45 },
    ],
  },
  {
    id: "prompt-engineer",
    name: "Prompt Engineer",
    growthPercentage: 98,
    compensation: { entryLevel: 90000, advancedLevel: 160000 },
    skills: [
      { id: "nlu", name: "NLU", growthPercentage: 70 },
      { id: "few-shot", name: "Few-Shot Prompting", growthPercentage: 65 },
      { id: "langchain", name: "LangChain", growthPercentage: 60 },
      { id: "openai-apis", name: "OpenAI APIs", growthPercentage: 55 },
    ],
  },
  {
    id: "data-privacy-officer",
    name: "Data Privacy Officer",
    growthPercentage: 76,
    compensation: { entryLevel: 110000, advancedLevel: 185000 },
    skills: [
      { id: "gdpr", name: "GDPR", growthPercentage: 70 },
      { id: "risk-assessment", name: "Risk Assessment", growthPercentage: 55 },
      { id: "data-governance", name: "Data Governance", growthPercentage: 50 },
      {
        id: "compliance-auditing",
        name: "Compliance Auditing",
        growthPercentage: 45,
      },
    ],
  },
  {
    id: "spatial-computing-dev",
    name: "Spatial Computing Dev",
    growthPercentage: 65,
    compensation: { entryLevel: 105000, advancedLevel: 190000 },
    skills: [
      { id: "webgl", name: "WebGL", growthPercentage: 60 },
      { id: "threejs", name: "Three.js", growthPercentage: 55 },
      { id: "unity", name: "Unity", growthPercentage: 50 },
      { id: "arkit", name: "ARKit", growthPercentage: 45 },
    ],
  },
  {
    id: "quantum-algorithms-engineer",
    name: "Quantum Algorithms Engineer",
    growthPercentage: 145,
    compensation: { entryLevel: 135000, advancedLevel: 250000 },
    skills: [
      {
        id: "quantum-mechanics",
        name: "Quantum Mechanics",
        growthPercentage: 90,
      },
      { id: "qiskit", name: "Qiskit", growthPercentage: 80 },
      { id: "linear-algebra", name: "Linear Algebra", growthPercentage: 65 },
      { id: "optimization", name: "Optimization", growthPercentage: 55 },
    ],
  },
];

interface MarketIntelProps {
  activeRole?: string;
  setActiveRole?: (role: string) => void;
  // The tenant's country name passed from the parent so that, when it
  // matches a bundled country, that country is auto-selected on first load.
  tenantCountryName?: string | null;
}

export const MarketIntel = ({
  activeRole: _activeRole,
  setActiveRole,
  tenantCountryName,
}: MarketIntelProps) => {
  const auth = useAuth();
  const { showToast } = useToast();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [searching, setSearching] = useState(false);

  // A manual pick always wins over the tenant-country auto-match below, even
  // one made before countryData resolves.
  const [manualCca3, setManualCca3] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const { data: countryData = EMPTY_COUNTRIES, isError: isCountryError } =
    usePublicGeoCountries();

  // Auto-match the tenant's country once countryData resolves; a manual pick
  // (above) always takes precedence.
  const autoMatchedCca3 = resolveTenantCountry(
    countryData,
    tenantCountryName,
  )?.cca3;
  const selectedCca3 = manualCca3 ?? autoMatchedCca3 ?? null;

  // Domain / field selection
  const [domain, setDomain] = useState("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  // Committed search parameters — only updated on submit
  const [committedFieldId, setCommittedFieldId] = useState("");
  const [committedCountryCode, setCommittedCountryCode] = useState("");
  const [committedCountryName, setCommittedCountryName] = useState("Global");

  const countryRef = useRef<HTMLDivElement>(null);

  // Query hooks
  const autocomplete = useAutocomplete(domain);
  const domainSuggestions = autocomplete.data?.suggestions ?? [];

  const marketSearch = useMarketSearch(committedFieldId, committedCountryCode);
  const trendingRoles = marketSearch.data?.trendingRoles ?? FALLBACK_ROLES;
  const currencySymbol = marketSearch.data?.location?.currencySymbol ?? "$";
  const locationName =
    marketSearch.data?.location?.name ?? committedCountryName;
  const isLoading = searching && marketSearch.isFetching;

  const activeRoleData = trendingRoles[activeRoleIndex];
  const selectedCountryName =
    countryData.find((c) => c.cca3 === selectedCca3)?.name ?? "";
  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  // Suggestions are shown while typing and no field is committed yet
  const showDomainDropdown =
    !selectedField && domain.length >= 2 && domainSuggestions.length > 0;

  // Surface the country list failure so an empty dropdown isn't mistaken for
  // "no countries configured" — mirrors the marketSearch.isError toast below.
  // Latched via ref (not just the isCountryError dependency) because
  // ToastContext hands out a new `showToast` closure on every provider
  // render (its context value is a fresh object literal each time) — without
  // the latch, showing the toast triggers exactly the re-render that changes
  // this effect's own dependency, re-firing it forever.
  const hasShownCountryError = useRef(false);
  useEffect(() => {
    if (isCountryError && !hasShownCountryError.current) {
      hasShownCountryError.current = true;
      showToast("Couldn't load countries — showing Global only");
    }
  }, [isCountryError, showToast]);

  // Close country dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        countryRef.current &&
        !countryRef.current.contains(e.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Transition to results view when the committed search resolves
  useEffect(() => {
    if (!searching) return;
    if (marketSearch.isSuccess) {
      setShowConfig(false);
      setSearching(false);
      setActiveRoleIndex(0);
    } else if (marketSearch.isError) {
      showToast("Using fallback data for now");
      setShowConfig(false);
      setSearching(false);
      setActiveRoleIndex(0);
    }
  }, [searching, marketSearch.isSuccess, marketSearch.isError, showToast]);

  useEffect(() => {
    if (!showConfig && trendingRoles.length > 0 && setActiveRole) {
      setActiveRole(trendingRoles[activeRoleIndex].name);
    }
  }, [activeRoleIndex, showConfig, trendingRoles, setActiveRole]);

  const fetchRealData = () => {
    if (domain.length < 2) {
      showToast("Please enter a domain or role");
      return;
    }

    const field = selectedField ?? domainSuggestions[0] ?? null;
    if (!field) {
      showToast("No matching field found — try a different domain");
      return;
    }

    setSelectedField(field);
    setDomain(field.name);
    setCommittedFieldId(field.id);
    setCommittedCountryCode(selectedCca3 || "");
    setCommittedCountryName(selectedCountryName || "Global");
    setSearching(true);
  };

  if (showConfig) {
    return (
      <div id="market-intel" className="mi-config-root">
        <div className="mi-config-glow" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mi-config-header"
        >
          <div className="mi-config-badge">
            <TrendingUp className="mi-config-badge-icon" />
            <span className="mi-config-badge-text">
              Live Market Intelligence
            </span>
          </div>
          <h2 className="mi-config-title">
            WHAT'S YOUR
            <br />
            <span className="mi-config-title-accent">CAREER WORLD?</span>
          </h2>
          <p className="mi-config-subtitle">
            Tell us your region and domain — get hyper-personalised real-time
            market intelligence in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mi-config-form"
        >
          {/* Country Field */}
          <div ref={countryRef} className="mi-field">
            <button
              type="button"
              className="mi-field-box"
              onClick={() => {
                setShowCountryDropdown((v) => !v);
                setTimeout(
                  () => document.getElementById("country-search")?.focus(),
                  50,
                );
              }}
            >
              <Globe className="mi-field-icon" />
              <div className="mi-field-inner">
                <p className="mi-field-label">Country / Region</p>
                <p
                  className={`mi-field-value ${selectedCca3 ? "mi-field-value-selected" : ""}`}
                >
                  {selectedCountryName || "Select your country..."}
                </p>
              </div>
              <ChevronDown
                className={`mi-chevron ${showCountryDropdown ? "mi-chevron-open" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mi-dropdown"
                >
                  <div className="mi-dropdown-search">
                    <Search className="mi-dropdown-search-icon" />
                    <input
                      id="country-search"
                      type="text"
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="mi-dropdown-search-input"
                    />
                  </div>
                  <div className="mi-dropdown-list">
                    {filteredCountries.map((c) => (
                      <button
                        type="button"
                        key={c.cca3}
                        onClick={() => {
                          setManualCca3(c.cca3);
                          setCountrySearch("");
                          setShowCountryDropdown(false);
                        }}
                        className={`mi-dropdown-item ${selectedCca3 === c.cca3 ? "mi-dropdown-item-active" : ""}`}
                      >
                        {c.name}
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <p className="mi-dropdown-empty">No countries found</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Domain Field */}
          <div className="mi-field">
            <div className="mi-field-box">
              <Briefcase className="mi-field-icon" />
              <div className="mi-field-inner">
                <p className="mi-field-label">Domain / Role</p>
                <input
                  type="text"
                  placeholder="e.g. Finance, AI, Healthcare..."
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setSelectedField(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && fetchRealData()}
                  className="mi-field-input"
                />
              </div>
              {autocomplete.isFetching && <Loader2 className="mi-spinner" />}
            </div>

            <AnimatePresence>
              {showDomainDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mi-dropdown"
                >
                  {domainSuggestions.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        setSelectedField(s);
                        setDomain(s.name);
                      }}
                      className="mi-dropdown-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <Briefcase
                        style={{
                          width: "0.75rem",
                          height: "0.75rem",
                          color: "rgba(250,204,21,0.6)",
                          flexShrink: 0,
                        }}
                      />
                      {s.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={fetchRealData}
            disabled={isLoading || domain.length < 2}
            className="mi-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="mi-submit-icon"
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Fetching Intelligence...
              </>
            ) : (
              <>
                <TrendingUp className="mi-submit-icon" /> Reveal Market
                Intelligence
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="market-intel" className="mi-root">
      <section className="mi-section">
        <div className="mi-container">
          {/* Header */}
          <div className="mi-header">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mi-header-meta">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfig(true);
                    setSearching(false);
                  }}
                  className="mi-change-btn"
                >
                  ← Change World
                </button>
                <div className="mi-live-badge">
                  <TrendingUp className="mi-live-icon" />
                  <span className="mi-live-text">
                    Live Data Feed: {selectedField?.name ?? domain} in{" "}
                    {locationName}
                  </span>
                </div>
              </div>
              <h2 className="mi-main-title">
                MARKET
                <br />
                INTELLIGENCE
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mi-header-desc"
            >
              Real-time insights tailored to your career world. Align your
              trajectory with market realities.
            </motion.p>
          </div>

          {/* Data Dashboard Grid */}
          <div className="mi-grid">
            {/* Left: Trending Roles */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mi-roles-card"
            >
              <div className="mi-roles-header">
                <h3 className="mi-roles-title">Trending Roles</h3>
                <span className="mi-roles-badge">Current</span>
              </div>

              <div className="mi-roles-list">
                {trendingRoles.map((role, i) => (
                  <motion.div
                    key={role.id}
                    onClick={() => setActiveRoleIndex(i)}
                    className={`mi-role-item ${activeRoleIndex === i ? "mi-role-item-active" : "mi-role-item-inactive"}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="mi-role-item-header">
                      <span className="mi-role-name">{role.name}</span>
                      <span className="mi-role-growth">
                        +{role.growthPercentage}%
                      </span>
                    </div>
                    <div className="mi-role-bar-track">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${Math.min(100, role.growthPercentage)}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                        className="mi-role-bar-fill"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Middle: Compensation Benchmarks */}
            <motion.div
              key={`comp-${activeRoleIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mi-comp-card"
            >
              <div className="mi-comp-header">
                <h3 className="mi-comp-title">
                  Compensation
                  <br />
                  Benchmarks
                </h3>
                <span className="mi-comp-country">{locationName}</span>
              </div>

              <p className="mi-comp-role-name">{activeRoleData.name}</p>

              <div className="mi-comp-levels">
                <div className="mi-comp-level">
                  <span className="mi-comp-level-label">Entry Level</span>
                  <div className="mi-comp-level-value">
                    <span className="mi-comp-salary">
                      {currencySymbol}
                      {(activeRoleData.compensation.entryLevel / 1000).toFixed(
                        0,
                      )}
                      K
                    </span>
                    <span className="mi-comp-period">/ yr</span>
                  </div>
                </div>

                <div className="mi-comp-level">
                  <span className="mi-comp-level-label">Advanced Level</span>
                  <div className="mi-comp-level-value">
                    <span className="mi-comp-salary">
                      {currencySymbol}
                      {(
                        activeRoleData.compensation.advancedLevel / 1000
                      ).toFixed(0)}
                      K
                    </span>
                    <span className="mi-comp-period">/ yr</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Fastest Growing Skills + CTA */}
            <motion.div
              key={`skills-${activeRoleIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mi-right-col"
            >
              <div className="mi-skills-card">
                <h3 className="mi-skills-title">Fastest Growing Skills</h3>
                <p className="mi-skills-subtitle">For {activeRoleData.name}</p>
                <div className="mi-skills-tags">
                  {activeRoleData.skills.map((skill, i) => (
                    <motion.span
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                      className="mi-skill-tag"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mi-view-report-btn"
                onClick={() => void signinRedirectWithReturnTo(auth)}
              >
                <span className="mi-report-title">View Full Report</span>
                <ArrowRight className="mi-report-icon" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
