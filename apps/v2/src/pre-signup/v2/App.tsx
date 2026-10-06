/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTenantLogo } from "@/hooks/use-tenant-logo";
import { handleLogin } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import styles from "./App.module.css";
import CareerPath from "./components/CareerPath";
import Documents from "./components/Documents";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import MarketIntelligence from "./components/MarketIntelligence";
import MyLearnings from "./components/MyLearnings";
import Navbar from "./components/Navbar";
import OneClickApply from "./components/OneClickApply";
import SkillAssessments from "./components/SkillAssessments";

export default function App() {
  const [careerData, setCareerData] = useState<{
    role: string;
    stages: unknown[];
  } | null>(null);

  const auth = useAuth();
  const tenantLogo = useTenantLogo();

  return (
    <div className={`pre-signup-v2 ${styles.app}`}>
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <MarketIntelligence
          onRoleSelectData={(role, stages) => setCareerData({ role, stages })}
          tenantCountryName={tenantLogo?.location?.country ?? null}
        />
        <CareerPath data={careerData} />
        <MyLearnings id={tenantLogo?.zitadelOrgId ?? ""} />
        <SkillAssessments id={tenantLogo?.zitadelOrgId ?? ""} />

        <div id="opportunity-gateway" className={styles.opportunityGateway}>
          <div className={styles.gatewayHeader}>
            <h2 className={styles.gatewayTitle}>
              Job <span className={styles.gatewayTitleAccent}>Opportunity</span>
            </h2>
            <div className={styles.gatewayUnderline} />

            <p className={styles.gatewaySubtext}>
              From building the perfect resume to landing your dream job, entomo
              guides you every step of the way with AI-powered tools and expert
              mentoring.
            </p>

            <button
              type="button"
              className={styles.gatewayButton}
              onClick={() => handleLogin(auth, tenantLogo?.zitadelOrgId ?? "")}
            >
              Join the Expedition
            </button>
          </div>

          <OneClickApply id={tenantLogo?.zitadelOrgId ?? ""} />
        </div>

        <Documents />
      </main>
      <Footer />
    </div>
  );
}
