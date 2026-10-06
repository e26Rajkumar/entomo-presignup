import { type GeoCountry, usePublicGeoCountries } from "@/lib/geo-queries";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOnClickOutside } from "../../../../../../hooks/useOnClickOutside";
import {
  scopeForOrg,
  signinRedirectWithReturnTo,
} from "../../../../../../lib/auth";
import {
  formatSalary,
  usePopularRoles,
  useRoleAutocomplete,
  useRoleInsights,
} from "../../../../../../lib/market-intelligence-queries";
import { resolveTenant } from "../../../../../../lib/tenant";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import type { MarketRole } from "../../../../types/market-intel.types";
import styles from "./MarketIntelSection.module.css";

const EMPTY_COUNTRIES: GeoCountry[] = [];

const AUTOCOMPLETE_DEBOUNCE_MS = 250;

interface Props {
  onRoleSelected: (role: MarketRole) => void;
  onRolesLoaded?: (roles: MarketRole[], firstRole: MarketRole) => void;
  // Fired when the user clears the field via "Change Field", so the parent can
  // drop the selected role and reset any role-derived UI (e.g. the pathways).
  onReset?: () => void;
  // Fired with the role the user entered/picked (and "" on reset), so the
  // parent can anchor the career path to that role (Task 13).
  onEnteredRole?: (role: string) => void;
  // The tenant's country name passed from the parent so we
  // don't need a separate resolveTenant() call. When provided and it matches
  // a country in the geo-countries list, that country is auto-selected on
  // first load.
  tenantCountryName?: string | null;
}

// Trim, lowercase, and collapse internal whitespace so case/spacing variants
// of the same title compare equal for the exact-match gate.
function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export const MarketIntelSection = forwardRef<HTMLElement, Props>(
  function MarketIntelSection(
    {
      onRoleSelected,
      onRolesLoaded,
      onReset,
      onEnteredRole,
      tenantCountryName,
    },
    ref,
  ) {
    const auth = useAuth();
    const [showQuestionnaire, setShowQuestionnaire] = useState(true);
    const [fieldInput, setFieldInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [submittedSearch, setSubmittedSearch] = useState<{
      role: string;
      cca3?: string | undefined;
    }>({
      role: "",
    });
    const [trendingRoles, setTrendingRoles] = useState<MarketRole[]>([]);
    const [selectedRole, setSelectedRole] = useState<MarketRole | null>(null);
    // The career area of the entered role, from the API response — drives the
    // "live data feed" pill.
    const [careerArea, setCareerArea] = useState("");
    // The location the served data is actually scoped to, from the API
    // response — may differ from the user's pick (e.g. unknown-code fallback).
    const [dataLocationName, setDataLocationName] = useState("Global");
    const [selectedCountry, setSelectedCountry] = useState<GeoCountry | null>(
      null,
    );
    const [countrySearch, setCountrySearch] = useState("");
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState<GeoCountry[]>(
      [],
    );
    const [noResultsQuery, setNoResultsQuery] = useState<string | null>(null);

    const countrySearchInputRef = useRef<HTMLInputElement>(null);
    const countryBoxRef = useRef<HTMLDivElement>(null);

    const { data: countryData = EMPTY_COUNTRIES } = usePublicGeoCountries();

    // Tracks whether we've already auto-applied the tenant's country, so we
    // don't clobber a country the user picked manually afterward.
    const hasAutoSetCountry = useRef(false);

    useEffect(() => {
      setFilteredCountries(countryData);

      // Auto-select the tenant's country on first load when the geo-countries
      // list arrives, but only once so a later manual pick isn't overridden.
      if (
        !hasAutoSetCountry.current &&
        tenantCountryName &&
        countryData.length > 0
      ) {
        const countryName = normalize(tenantCountryName);
        const match = countryData.find(
          (c) => normalize(c.name) === countryName,
        );
        if (match) {
          setSelectedCountry(match);
          hasAutoSetCountry.current = true;
        }
      }
    }, [countryData, tenantCountryName]);

    // `cca3`, not `code`: the market-intelligence API is keyed on ISO alpha-3,
    // which the geo countries payload carries alongside the alpha-2 `code`.
    const popularRolesQuery = usePopularRoles(selectedCountry?.cca3);
    // Debounced + gated on the dropdown being open, so typing costs one
    // request per pause instead of one per keystroke, and selecting a
    // suggestion doesn't fire a redundant lookup for the selected name.
    const debouncedFieldInput = useDebouncedValue(
      fieldInput,
      AUTOCOMPLETE_DEBOUNCE_MS,
    );
    const autocompleteQuery = useRoleAutocomplete(
      debouncedFieldInput,
      showSuggestions,
    );
    const searchQuery = useRoleInsights(
      submittedSearch.role,
      submittedSearch.cca3,
    );

    const suggestions = showSuggestions
      ? (autocompleteQuery.data?.suggestions ?? []).slice(0, 6)
      : [];
    const isLoadingMI = searchQuery.isFetching;
    const hasMoreTrendingRoles = trendingRoles.length > 4;
    const maxRoleProgress = Math.max(
      1,
      ...trendingRoles.map((r) => r.progress),
    );

    const onRolesLoadedRef = useRef(onRolesLoaded);
    onRolesLoadedRef.current = onRolesLoaded;

    const selectRole = useCallback(
      (role: MarketRole) => {
        setSelectedRole(role);
        onRoleSelected(role);
      },
      [onRoleSelected],
    );

    useEffect(() => {
      if (countryDropdownOpen) {
        countrySearchInputRef.current?.focus();
      }
    }, [countryDropdownOpen]);

    useOnClickOutside(
      countryBoxRef,
      () => setCountryDropdownOpen(false),
      countryDropdownOpen,
    );

    // Handle successful search
    useEffect(() => {
      const data = searchQuery.data;
      if (!data || !submittedSearch.role) return;

      const { currencySymbol } = data.location;
      // Top 8 roles in descending order of growth percentage. The list shows
      // four at a time and scrolls when more are available.
      const roles: MarketRole[] = [...data.trendingRoles]
        .sort((a, b) => b.growthPercentage - a.growthPercentage)
        .slice(0, 8)
        .map((r) => ({
          title: r.name,
          growth: `+${r.growthPercentage}%`,
          progress: Math.min(r.growthPercentage, 100),
          entryLevel: `${currencySymbol}${formatSalary(r.compensation.entryLevel)}`,
          advancedLevel: `${currencySymbol}${formatSalary(r.compensation.advancedLevel)}`,
          skills: r.skills.map((s) => s.name),
          careerPath: {
            intern: { title: "", description: "" },
            junior: { title: "", description: "" },
            senior: { title: "", description: "" },
            csuite: { title: "", description: "" },
          },
        }));

      if (roles.length === 0) {
        setNoResultsQuery(submittedSearch.role);
        return;
      }

      setNoResultsQuery(null);
      setTrendingRoles(roles);
      setSelectedRole(roles[0]);
      setCareerArea(data.careerArea);
      setDataLocationName(data.location.name);
      setShowQuestionnaire(false);
      onRolesLoadedRef.current?.(roles, roles[0]);
    }, [searchQuery.data, submittedSearch.role]);

    function onFieldInput(value: string) {
      setFieldInput(value);
      setShowSuggestions(value.trim().length > 0);
      setNoResultsQuery(null);
    }

    function onCountrySearch(value: string) {
      setCountrySearch(value);
      setFilteredCountries(
        countryData.filter((country) =>
          country.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }

    function selectCountry(c: GeoCountry) {
      setSelectedCountry(c);
      setCountryDropdownOpen(false);
      setCountrySearch("");
      setFilteredCountries(countryData);
    }

    function submitRole(role: string) {
      setSubmittedSearch({ role, cca3: selectedCountry?.cca3 });
      onEnteredRole?.(role); // anchor the career path (Task 13)
    }

    function selectSuggestion(s: { id: string; name: string }) {
      setFieldInput(s.name);
      setShowSuggestions(false);
      submitRole(s.name); // picked a suggestion → definitionally valid
    }

    function handleSubmit(overrideName?: string) {
      const typed = (overrideName ?? fieldInput).trim();
      if (!typed) return;
      setShowSuggestions(false);
      setNoResultsQuery(null);

      const fetched = autocompleteQuery.data?.suggestions ?? [];
      // Prefer an exact case-insensitive match; otherwise accept the top fuzzy
      // suggestion (KSAT only returns hits when reasonably confident). An empty
      // list (no fuzzy match at all) → Role not found; the LLM never fires.
      const exact = fetched.find((s) => normalize(s.name) === normalize(typed));
      const chosen = exact ?? fetched[0];
      if (chosen) {
        submitRole(chosen.name); // canonical name for stable cache keys
        return;
      }
      setNoResultsQuery(typed);
    }

    function submitPopularRole(role: string) {
      setFieldInput(role);
      setShowSuggestions(false);
      setNoResultsQuery(null);
      submitRole(role); // popular roles are curated → definitionally valid
    }

    function resetQuestionnaire() {
      setShowQuestionnaire(true);
      setFieldInput("");
      setShowSuggestions(false);
      setSubmittedSearch({ role: "" });
      setTrendingRoles([]);
      setSelectedRole(null);
      setNoResultsQuery(null);
      onReset?.();
      onEnteredRole?.(""); // parent drops the anchored role
    }

    return (
      <section ref={ref} className={styles.market_section}>
        <div className="container">
          {showQuestionnaire && (
            <div className={styles["questionnaire-wrapper"]}>
              <div className={styles["q-eyebrow"]}>
                <span className={styles["q-dot"]} />
                <span>Career Intelligence Engine</span>
              </div>

              <div className={`display-1 ${styles["q-title"]}`}>
                Unlock your
                <br />
                career pathways
              </div>
              <p className={`m-4 ${styles["q-subtitle"]}`}>
                Unlock real-time career intelligence, discover growth trends,
                and forge personalized career pathways.
              </p>

              <div className={`${styles["q-input-group"]} relative mt-12 mb-4`}>
                <div
                  ref={countryBoxRef}
                  // biome-ignore lint/a11y/useSemanticElements: this toggle wraps the country search input + dropdown panel, so it can't be a native <button>. role + tabIndex + key handler give equivalent button semantics.
                  role="button"
                  tabIndex={0}
                  aria-expanded={countryDropdownOpen}
                  className={`${styles["q-country-input-box"]} searchable`}
                  onClick={() => setCountryDropdownOpen((v) => !v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setCountryDropdownOpen((v) => !v);
                    }
                  }}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <div
                    className={`${styles["q-country-select-inline"]} flex items-center justify-between w-full`}
                  >
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {selectedCountry?.name ?? "Global"}
                    </span>
                    <div className={`${styles["q-chevron-icon"]} static`}>
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  {countryDropdownOpen && (
                    <div
                      className={styles["q-country-dropdown-wrapper"]}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className={styles["q-country-search-box"]}>
                        <input
                          ref={countrySearchInputRef}
                          id="country-search-input"
                          type="text"
                          className="text-text-dark"
                          value={countrySearch}
                          onChange={(e) => onCountrySearch(e.target.value)}
                          placeholder="Search 195+ countries..."
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <ul className={styles["q-country-list"]}>
                        {filteredCountries.map((c) => (
                          <li
                            key={c.code}
                            // biome-ignore lint/a11y/useSemanticElements: dropdown CSS is bound to <li>; a native <button> would break the list layout. role + tabIndex + key handler give equivalent button semantics.
                            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the list item is intentionally the clickable option.
                            role="button"
                            tabIndex={0}
                            onClick={() => selectCountry(c)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                selectCountry(c);
                              }
                            }}
                            className={
                              selectedCountry?.code === c.code
                                ? styles.active
                                : ""
                            }
                          >
                            {c.name}
                          </li>
                        ))}
                        {filteredCountries.length === 0 && (
                          <li className={styles["no-results"]}>
                            No countries found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={styles["q-input-divider"]} />

                <div className={styles["q-search-row"]}>
                  <div className={styles["q-input-icon"]}>
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>

                  <input
                    id="field-search-input"
                    type="text"
                    className={styles["q-field-input"]}
                    placeholder="Type a career that interests you…"
                    value={fieldInput}
                    onChange={(e) => onFieldInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    className={styles["q-submit-btn"]}
                    onClick={() => handleSubmit()}
                    disabled={isLoadingMI || fieldInput.trim().length < 1}
                  >
                    {isLoadingMI ? (
                      <span
                        className={`${styles["q-spinner-dots"]} h-5.5 w-5.5`}
                      >
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      <svg
                        aria-hidden="true"
                        className="rtl:-scale-x-100"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>

                {suggestions.length > 0 && (
                  <ul className={styles["q-suggestions"]}>
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        // biome-ignore lint/a11y/useSemanticElements: dropdown CSS is bound to <li>; a native <button> would break the list layout. role + tabIndex + key handler give equivalent button semantics.
                        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: the list item is intentionally the clickable suggestion.
                        role="button"
                        tabIndex={0}
                        onClick={() => selectSuggestion(s)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectSuggestion(s);
                          }
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {searchQuery.isError && submittedSearch.role && !isLoadingMI && (
                <div
                  className={`${styles["q-feedback"]} ${styles["q-feedback--error"]}`}
                >
                  <p>
                    Unable to load career intelligence data. Please try again.
                  </p>
                  <button
                    type="button"
                    className={styles["q-retry-btn"]}
                    onClick={() => void searchQuery.refetch()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {noResultsQuery && !isLoadingMI && !searchQuery.isError && (
                <div className={styles["q-feedback"]}>
                  <p>
                    Role not found — try a different title or pick a popular
                    role below.
                  </p>
                </div>
              )}

              {popularRolesQuery.data &&
                popularRolesQuery.data.roles.length > 0 && (
                  <div className={styles["q-quickpicks"]}>
                    <span className={styles["q-quickpick-label"]}>
                      Popular:
                    </span>
                    {popularRolesQuery.data.roles.map((role) => (
                      <button
                        type="button"
                        key={role.name}
                        className={`${styles["q-quick-tag"]} cursor-pointer`}
                        onClick={() => submitPopularRole(role.name)}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                )}

              {popularRolesQuery.isError && (
                <p className={styles["q-status-msg"]}>
                  Location filter temporarily unavailable
                </p>
              )}

              {isLoadingMI && (
                <div className={styles["q-loading-state"]}>
                  <div className={styles["q-loading-bar"]}>
                    <div className={styles["q-loading-fill"]} />
                  </div>
                  <p className={styles["q-loading-text"]}>
                    Analysing <strong>{fieldInput}</strong> market…
                  </p>
                </div>
              )}
            </div>
          )}

          {!showQuestionnaire && selectedRole && (
            <div>
              <div className="flex flex-wrap items-center mb-4">
                <div className="w-full md:w-2/3">
                  <div className="pill">
                    live data feed · {careerArea} · {dataLocationName}
                  </div>
                  <div className="display-1 mt-6 text-(--color-heading)">
                    career intelligence
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-end mt-3 md:mt-0">
                  <button
                    type="button"
                    className="btn-website px-4 py-2"
                    style={{ minWidth: "fit-content" }}
                    onClick={resetQuestionnaire}
                  >
                    Change Field
                  </button>
                </div>
              </div>
              <p
                className="mb-5"
                style={{ opacity: 0.65, fontSize: "0.95rem" }}
              >
                Real-time insights into what the industry is demanding right
                now. Click a role to see its details and update your career
                path.
              </p>
              <div className={styles["results-grid"]}>
                <div>
                  <div className={styles["role-selector-card"]}>
                    <div className={styles["role-selector-header"]}>
                      <div className={styles["role-selector-title"]}>
                        Trending Roles
                      </div>
                      <span className={styles["role-selector-badge"]}>
                        Select a Role
                      </span>
                    </div>
                    <div
                      className={[
                        styles["trending-list"],
                        hasMoreTrendingRoles
                          ? styles["trending-list--scroll"]
                          : "",
                      ].join(" ")}
                    >
                      {trendingRoles.map((role) => (
                        <button
                          type="button"
                          key={role.title}
                          className={[
                            styles["trending-item"],
                            selectedRole?.title === role.title
                              ? styles["trending-item--selected"]
                              : "",
                          ].join(" ")}
                          aria-pressed={selectedRole?.title === role.title}
                          onClick={() => selectRole(role)}
                        >
                          <span className={styles["trending-item-row"]}>
                            <span
                              className={styles["trending-item-name"]}
                              title={role.title}
                            >
                              {role.title}
                            </span>
                            <span className={styles["trending-item-growth"]}>
                              {role.growth}
                            </span>
                          </span>
                          <span
                            className={styles["trending-item-bar"]}
                            aria-hidden="true"
                          >
                            <span
                              className={styles["trending-item-bar-fill"]}
                              style={{
                                width: `${(role.progress / maxRoleProgress) * 100}%`,
                              }}
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className={styles["intel-card"]}>
                    <div
                      key={selectedRole.title}
                      className={`${styles["animate-content"]} flex flex-col h-full`}
                    >
                      <div className="mb-4">
                        <div className={styles["intel-title-row"]}>
                          <h3 className={styles["intel-title"]}>
                            Compensation Benchmarks
                          </h3>
                          <span className={styles["intel-badge"]}>
                            {dataLocationName === "Global"
                              ? "Global Avg"
                              : dataLocationName}
                          </span>
                        </div>
                        <p className={styles["intel-subtitle"]}>
                          For {selectedRole.title}
                        </p>
                      </div>
                      <div className={styles["comp-list"]}>
                        <div className={styles["comp-card"]}>
                          <div className={styles["comp-label"]}>Minimum</div>
                          <div className={styles["comp-value-row"]}>
                            <span className={styles["comp-value"]}>
                              {selectedRole.entryLevel}
                            </span>
                            <span className={styles["comp-unit"]}>/ yr</span>
                          </div>
                        </div>
                        <div className={styles["comp-card"]}>
                          <div className={styles["comp-label"]}>Maximum</div>
                          <div className={styles["comp-value-row"]}>
                            <span className={styles["comp-value"]}>
                              {selectedRole.advancedLevel}
                            </span>
                            <span className={styles["comp-unit"]}>/ yr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={styles["intel-card"]}>
                    <div
                      key={selectedRole.title}
                      className={`${styles["animate-content"]} flex flex-col h-full`}
                    >
                      <div>
                        <h3 className={styles["intel-title"]}>
                          Fastest Growing Skills
                        </h3>
                        <p className={styles["intel-subtitle"]}>
                          For {selectedRole.title}
                        </p>
                      </div>
                      <div
                        className={[
                          styles["skills-list"],
                          selectedRole.skills.length > 4
                            ? styles["skills-list--scroll"]
                            : "",
                        ].join(" ")}
                      >
                        {selectedRole.skills.map((skill) => (
                          <span key={skill} className={styles["skill-pill"]}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          void (async () => {
                            const tenant = await resolveTenant();
                            await signinRedirectWithReturnTo(auth, {
                              scope: scopeForOrg(tenant.zitadelOrgId),
                            });
                          })();
                        }}
                        className={styles["explore-button"]}
                      >
                        Explore
                        <svg
                          aria-hidden="true"
                          className="rtl:-scale-x-100"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className={styles["ai-disclaimer"]}>
                Generated by AI. Validate important facts independently.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  },
);
