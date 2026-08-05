import { BrandStory } from "@/components/BrandStory";
import { CTA } from "@/components/CTA";
import { Expertise } from "@/components/Expertise";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";

export function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <BrandStory />
      <Portfolio />
      <Expertise />
      <Process />
      <CTA />
    </main>
  );
}
