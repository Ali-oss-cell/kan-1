import { useRef } from "react";
import { brandStory } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scroll-mt-28 py-section-gap-mobile md:scroll-mt-32 md:py-section-gap"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 shadow-2xl shadow-primary/20 ring-1 ring-on-primary/10 md:p-16">
          <img
            src="/brand/logo-dark.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 opacity-[0.04] md:h-72 md:w-72"
          />

          <div className="relative z-10 grid grid-cols-1 gap-gutter md:grid-cols-2 md:gap-16">
            <div>
              <span className="section-eyebrow text-brand-lavender">OUR STORY</span>
              <h2 className="font-headline-xl text-headline-xl leading-tight tracking-tighter text-on-primary">
                {brandStory.headline}
              </h2>
            </div>

            <div className="space-y-stack-lg">
              <p className="font-body-lg text-body-lg leading-relaxed text-on-primary/80">
                {brandStory.body}
              </p>
              <ul className="space-y-stack-sm">
                {brandStory.clients.map((client) => (
                  <li
                    key={client}
                    className="flex items-start gap-3 font-body-md text-on-primary/70"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-brand-gradient shadow-sm shadow-brand-purple/50" />
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
