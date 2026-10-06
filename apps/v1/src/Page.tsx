import "animate.css";
import "./pre-signup/v1/styles/styles.css";
import { InteractiveGrid } from "./pre-signup/v1/components/InteractiveGrid/InteractiveGrid";
import { Header } from "./pre-signup/v1/layout/Header/Header";
import { HomePage } from "./pre-signup/v1/pages/Home/HomePage";

export function Page() {
  return (
    <div className="pre-signup-v1">
      <Header />
      <div className="interactive-grid-wrapper">
        <InteractiveGrid gridSizeDesktop={32} gridSizeMobile={12} />
      </div>
      <HomePage />
    </div>
  );
}
