import { BrandStory } from "@/components/BrandStory";
import { CTA } from "@/components/CTA";
import { Expertise } from "@/components/Expertise";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-6 focus:py-3 focus:font-label-caps focus:text-label-caps focus:text-on-primary"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main-content">
        <Hero />
        <BrandStory />
        <Portfolio />
        <Expertise />
        <Process />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
