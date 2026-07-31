import { HeroSection } from "./hero-section";
import { MarketingNavbar } from "./marketing-navbar";

export function LandingPage() {
  return (
    <>
      <MarketingNavbar />

      <main>
        <HeroSection />
      </main>
    </>
  );
}