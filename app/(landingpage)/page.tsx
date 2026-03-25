import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MobileExperience } from "@/components/mobile-experience";
import { FeaturesSection } from "@/components/features-section";
import { SkillsFlashcards } from "@/components/skills-flashcards";
import { FaqProcessSection } from "@/components/faq-process-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="w-full overflow-hidden bg-background">
      <Header />
      <HeroSection />
      <FaqProcessSection />
      <FeaturesSection />
      <MobileExperience />
      <SkillsFlashcards />
      <CtaSection />
      <Footer />
    </main>
  );
}
