import { useRef } from "react";
import { processSteps } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative scroll-mt-28 py-section-gap-mobile md:scroll-mt-32 md:py-section-gap"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <span className="section-eyebrow">HOW WE WORK</span>
          <h2 className="section-title mb-stack-md">Our Process</h2>
          <p className="font-body-lg leading-relaxed text-on-surface-variant">
            From discovery to deployment — a clinical process where every pixel
            has purpose and every strategy drives growth.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-gutter">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-brand-purple/20 via-brand-purple to-brand-blue/20 md:block"
            aria-hidden
          />

          {processSteps.map((item) => (
            <div
              key={item.step}
              className="card-elevated group relative flex flex-col items-start p-8 hover:-translate-y-1"
            >
              <div className="relative z-10 mb-stack-md flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient font-label-caps text-label-caps text-on-primary shadow-lg shadow-brand-purple/30 transition-transform duration-300 group-hover:scale-105">
                {item.step}
              </div>
              <h3 className="mb-stack-sm font-headline-md text-headline-md">
                {item.title}
              </h3>
              <p className="font-body-md leading-relaxed text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
