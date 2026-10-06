import { assetUrl } from "@/lib/asset-url";

export const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div>
          <img
            src={assetUrl("/assets/images/ministry-of-labour-logo-light.svg")}
            style={{ height: "44px" }}
            alt="Ministry of Labour"
          />
        </div>
        <nav className="footer-links">
          <a href="#market-intel" className="footer-link">
            Market Intel
          </a>
          <a href="#skills-assessment" className="footer-link">
            Skill Assessment
          </a>
          <a href="#toolkit" className="footer-link">
            Toolkit
          </a>
          <a href="#terrain" className="footer-link">
            Career Pathways
          </a>
          <a href="#learning-hub" className="footer-link">
            Learning Hub
          </a>
          <a href="#arena" className="footer-link">
            Job Opportunity
          </a>
        </nav>
        <div className="footer-copy">
          © 2026 Entomo Arena. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
