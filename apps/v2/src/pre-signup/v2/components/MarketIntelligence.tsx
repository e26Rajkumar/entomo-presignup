import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  DollarSign,
  Globe,
  MapPin,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  type GeoCountry,
  resolveTenantCountry,
  usePublicGeoCountries,
} from "@/lib/geo-queries";
import {
  formatSalary,
  useAutocomplete,
  useCareerPathways,
  useMarketSearch,
} from "../../../lib/market-intelligence-queries";
import styles from "./MarketIntelligence.module.css";

const EMPTY_COUNTRIES: GeoCountry[] = [];

export default function MarketIntelligence({
  onRoleSelectData,
  tenantCountryName,
}: {
  onRoleSelectData?: (role: string, stages: unknown[]) => void;
  // The tenant's country name passed from the parent so that, when it
  // matches a bundled country, that country is auto-selected on first load.
  tenantCountryName?: string | null;
}) {
  const [countrySearch, setCountrySearch] = useState("");
  // A manual pick always wins over the tenant-country auto-match below, even
  // one made before countryData resolves.
  const [manualCountry, setManualCountry] = useState<{
    name: string;
    cca3: string;
  } | null>(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  const {
    data: countryData = EMPTY_COUNTRIES,
    isError: isCountryError,
    refetch: refetchCountries,
  } = usePublicGeoCountries();

  // Auto-match the tenant's country once countryData resolves; a manual pick
  // (above) always takes precedence.
  const autoMatchedCountry = resolveTenantCountry(
    countryData,
    tenantCountryName,
  );
  const selectedCountry =
    manualCountry?.name ?? autoMatchedCountry?.name ?? "Global";
  const selectedCountryCode =
    manualCountry?.cca3 ?? autoMatchedCountry?.cca3 ?? "";

  const [domainInput, setDomainInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const domainRef = useRef<HTMLDivElement>(null);

  const [selectedField, setSelectedField] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Keep a stable ref so the pathways effect doesn't re-run on every parent render
  const onRoleSelectDataRef = useRef(onRoleSelectData);
  onRoleSelectDataRef.current = onRoleSelectData;

  const autocomplete = useAutocomplete(debouncedQuery);
  const search = useMarketSearch(selectedField?.id ?? "", selectedCountryCode);
  const pathways = useCareerPathways(selectedRole ?? "");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node))
        setCountryOpen(false);
      if (domainRef.current && !domainRef.current.contains(e.target as Node))
        setDomainDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounce autocomplete query; clear when a field is already selected
  useEffect(() => {
    if (selectedField) {
      setDebouncedQuery("");
      return;
    }
    if (domainInput.trim().length < 2) {
      setDebouncedQuery("");
      setDomainDropdownOpen(false);
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(domainInput.trim()), 500);
    return () => clearTimeout(timer);
  }, [domainInput, selectedField]);

  // Open/close suggestions dropdown based on autocomplete results
  useEffect(() => {
    const suggestions =
      autocomplete.data && "suggestions" in autocomplete.data
        ? autocomplete.data.suggestions
        : [];
    if (suggestions.length > 0 && !selectedField) {
      setDomainDropdownOpen(true);
    } else {
      setDomainDropdownOpen(false);
    }
  }, [autocomplete.data, selectedField]);

  // Auto-select first role when search data arrives
  useEffect(() => {
    if (
      search.data &&
      "trendingRoles" in search.data &&
      search.data.trendingRoles.length > 0 &&
      !selectedRole
    ) {
      setSelectedRole(search.data.trendingRoles[0].name);
    }
  }, [search.data, selectedRole]);

  // Notify parent when career pathways load; map description → desc for CareerPath compatibility.
  // onRoleSelectData is intentionally read from a ref so an inline callback in the parent
  // doesn't cause this effect to re-run and reset CareerPath's currentStep on every render.
  useEffect(() => {
    if (pathways.data && "stages" in pathways.data && selectedRole) {
      const mapped = pathways.data.stages.map((s) => ({
        title: s.title,
        desc: s.description,
      }));
      onRoleSelectDataRef.current?.(selectedRole, mapped);
    }
  }, [pathways.data, selectedRole]);

  const handleSelectField = (field: { id: string; name: string }) => {
    setSelectedField(field);
    setDomainInput(field.name);
    setDebouncedQuery("");
    setDomainDropdownOpen(false);
    setSelectedRole(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setDomainDropdownOpen(false);
    const suggestions =
      autocomplete.data && "suggestions" in autocomplete.data
        ? autocomplete.data.suggestions
        : [];
    if (suggestions.length > 0) {
      handleSelectField(suggestions[0]);
    }
  };

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
  };

  const handleSelectCountry = (country: { name: string; cca3: string }) => {
    setManualCountry(country);
    setCountrySearch("");
    setCountryOpen(false);
    if (selectedField) setSelectedRole(null);
  };

  const handleClearDomain = () => {
    setDomainInput("");
    setDebouncedQuery("");
    setDomainDropdownOpen(false);
    setSelectedField(null);
    setSelectedRole(null);
  };

  const filteredCountries = countryData.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const suggestions =
    autocomplete.data && "suggestions" in autocomplete.data
      ? autocomplete.data.suggestions
      : [];

  const searchData =
    search.data && "trendingRoles" in search.data ? search.data : null;

  const selectedRoleData = searchData?.trendingRoles.find(
    (r) => r.name === selectedRole,
  );

  const loading = search.isLoading;
  const error = search.error
    ? (search.error as Error).message ||
      "Could not fetch data. Please try again."
    : null;

  return (
    <div id="market" className={styles.section}>
      {!selectedRole && (
        <div className={styles.header}>
          <h2 className={styles.heading}>
            What's your{" "}
            <span className={styles.headingAccent}>career world?</span>
          </h2>
          <div className={styles.headerUnderline} />
        </div>
      )}

      {/* ── Search Panel ── */}
      <div className={styles.searchPanel} style={{ zIndex: 40 }}>
        <div className={styles.searchBox}>
          {/* Country Picker */}
          <div ref={countryRef} className={styles.countryWrapper}>
            <button
              type="button"
              onClick={() => setCountryOpen((v) => !v)}
              className={`${styles.countryBtn} cursor-pointer`}
            >
              <Globe />
              <div className={styles.countryBtnInner}>
                <p className={styles.countryLabel}>Country / Region</p>
                <p className={styles.countryValue}>{selectedCountry}</p>
              </div>
              <ChevronDown
                className={`${styles.chevron} ${countryOpen ? styles.chevronOpen : ""}`}
              />
            </button>

            {countryOpen && (
              <div className={styles.countryDropdown}>
                <div className={styles.countrySearch}>
                  <div className={styles.countrySearchInner}>
                    <MapPin />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder={`Search ${countryData.length} countries...`}
                      className={styles.countrySearchInput}
                    />
                    {countrySearch && (
                      <button
                        type="button"
                        onClick={() => setCountrySearch("")}
                        className={`${styles.countrySearchClear} cursor-pointer`}
                      >
                        <X />
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.countryMeta}>
                  <p className={styles.countryMetaText}>
                    {countrySearch
                      ? filteredCountries.length
                      : countryData.length}{" "}
                    {countrySearch
                      ? `matching "${countrySearch}"`
                      : "countries available"}
                  </p>
                </div>
                <ul className={styles.countryList}>
                  {filteredCountries.length === 0 ? (
                    <li className={styles.countryListEmpty}>No results</li>
                  ) : (
                    filteredCountries.map((c) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          onClick={() => handleSelectCountry(c)}
                          className={`${styles.countryOption} ${c.name === selectedCountry ? styles.countryOptionActive : styles.countryOptionInactive} cursor-pointer`}
                        >
                          <span style={{ flex: 1 }}>{c.name}</span>
                          {c.name === selectedCountry && (
                            <span className={styles.countryOptionCheck}>✓</span>
                          )}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {isCountryError && !countryOpen && (
              <div className={styles.errorBox}>
                <button
                  type="button"
                  onClick={() => refetchCountries()}
                  className={`${styles.retryBtn} cursor-pointer`}
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          {/* Domain Input */}
          <div ref={domainRef} className={styles.domainWrapper}>
            <form onSubmit={handleSubmit}>
              <div className={styles.domainForm}>
                <Briefcase className={styles.domainIcon} />
                <div className={styles.domainInputWrapper}>
                  <p className={styles.domainLabel}>Domain / Role</p>
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => {
                      setDomainInput(e.target.value);
                      if (selectedField) {
                        setSelectedField(null);
                        setSelectedRole(null);
                      }
                    }}
                    placeholder="Type a domain (e.g. Finance, AI, Healthcare)..."
                    className={styles.domainInput}
                  />
                </div>
                {loading || autocomplete.isFetching ? (
                  <div className={styles.spinner} />
                ) : domainInput ? (
                  <button
                    type="button"
                    onClick={handleClearDomain}
                    className={`${styles.clearBtn} cursor-pointer`}
                  >
                    <X />
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!domainInput.trim() || loading}
                  className={`${styles.submitBtn} cursor-pointer disabled:cursor-not-allowed`}
                >
                  <ArrowRight />
                </button>
              </div>
            </form>

            {domainDropdownOpen && suggestions.length > 0 && !selectedField && (
              <div className={styles.suggestDropdown}>
                <div className={styles.suggestHeader}>
                  <div>
                    <p className={styles.suggestMeta}>Suggested Domains</p>
                    <p className={styles.suggestSubMeta}>
                      Related to{" "}
                      <span className={styles.suggestHighlight}>
                        "{domainInput}"
                      </span>{" "}
                      · {selectedCountry}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDomainDropdownOpen(false)}
                    className={`${styles.suggestClose} cursor-pointer`}
                  >
                    <X />
                  </button>
                </div>
                <ul>
                  {suggestions.map((field, i) => (
                    <li key={field.id} className={styles.suggestItem}>
                      <button
                        type="button"
                        onClick={() => handleSelectField(field)}
                        className={`${styles.suggestItemBtn} cursor-pointer`}
                      >
                        <span className={styles.suggestNum}>{i + 1}</span>
                        <span className={styles.suggestName}>{field.name}</span>
                        <span className={styles.suggestCta}>Get MI</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && !loading && (
              <div className={styles.errorBox}>
                ⚠️ {error} —{" "}
                <button
                  type="button"
                  onClick={() => search.refetch()}
                  className={`${styles.retryBtn} cursor-pointer`}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {!selectedRole && !loading && (
          <p className={styles.hint}>
            Pick a country · type your domain · select from suggestions or press{" "}
            <kbd className={styles.hintKbd}>↵ Enter</kbd> to see Market
            Intelligence
          </p>
        )}
      </div>

      {/* ── MI Dashboard ── */}
      {selectedRole && selectedRoleData && searchData && (
        <div className={styles.dashboard}>
          <div className={styles.dashboardHeader}>
            <p className={styles.dashboardMeta}>Market Intelligence</p>
            <h2 className={styles.dashboardTitle}>
              <span className={styles.dashboardTitleHighlight}>
                {selectedRole}
              </span>
            </h2>
            <p className={styles.dashboardSub}>
              📍 {searchData.location?.name ?? selectedCountry} ·{" "}
              <button
                type="button"
                onClick={handleClearDomain}
                className={`${styles.newSearchBtn} cursor-pointer`}
              >
                New search
              </button>
            </p>
          </div>

          <div className={styles.dashboardGrid}>
            {/* Related Roles */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHead}>
                <div
                  className={`${styles.dashCardIcon} ${styles.dashCardIconTan}`}
                >
                  <TrendingUp />
                </div>
                <div>
                  <p className={styles.dashCardMeta}>Trending roles</p>
                  <h3 className={styles.dashCardTitle}>Related Roles</h3>
                </div>
              </div>
              <div className={styles.rolesList}>
                {searchData.trendingRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role.name)}
                    className={`${styles.roleBtn} ${role.name === selectedRole ? styles.roleBtnActive : styles.roleBtnInactive} cursor-pointer`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Compensation */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHead}>
                <div
                  className={`${styles.dashCardIcon} ${styles.dashCardIconGreen}`}
                >
                  <DollarSign />
                </div>
                <div>
                  <p className={styles.dashCardMeta}>Local market rates</p>
                  <h3 className={styles.dashCardTitle}>Compensation</h3>
                </div>
              </div>
              <div className={styles.compBody}>
                <div className={styles.compEntry}>
                  <p className={`${styles.compLabel} ${styles.compLabelEntry}`}>
                    Entry Level
                  </p>
                  <p className={styles.compValue}>
                    {searchData.location?.currencySymbol}
                    {formatSalary(selectedRoleData.compensation.entryLevel)}/yr
                  </p>
                </div>
                <div className={styles.compAdvanced}>
                  <p
                    className={`${styles.compLabel} ${styles.compLabelAdvanced}`}
                  >
                    Advanced Level
                  </p>
                  <p className={styles.compValueBold}>
                    {searchData.location?.currencySymbol}
                    {formatSalary(selectedRoleData.compensation.advancedLevel)}
                    /yr
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className={styles.dashCard}>
              <div className={styles.dashCardHead}>
                <div
                  className={`${styles.dashCardIcon} ${styles.dashCardIconBlue}`}
                >
                  <Zap />
                </div>
                <div>
                  <p className={styles.dashCardMeta}>In demand</p>
                  <h3 className={styles.dashCardTitle}>
                    Fastest Growing Skills
                  </h3>
                </div>
              </div>
              <div className={styles.skillsBody}>
                {selectedRoleData.skills.map((skill) => (
                  <span key={skill.id} className={styles.skillChip}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>
            Fetching market intelligence for <strong>{domainInput}</strong>…
          </p>
        </div>
      )}
    </div>
  );
}
