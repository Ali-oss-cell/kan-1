import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MaterialIcon } from "./MaterialIcon";
import { Sparkle } from "./Ornaments";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-32 overflow-hidden border-b-3 border-ink bg-purple"
    >
      <div className="h-6 border-b-3 border-ink bg-hazard" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" aria-hidden />

      <div className="container-site relative grid grid-cols-1 items-end gap-12 py-section-sm md:py-section lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div data-reveal className="mb-6 flex items-center gap-3">
            <Sparkle size={28} className="text-ink" />
            <span className="label-lg">Ready when you are</span>
          </div>
          <h2 data-reveal className="display text-display-xl">
            Let&apos;s build
            <br />
            something
            <br />
            <span className="mark-block mt-2 -rotate-1 border-3 border-ink bg-ink text-purple shadow-brutal-paper">
              that works.
            </span>
          </h2>
        </div>

        <div data-reveal className="lg:col-span-4">
          <p className="mb-8 max-w-[400px] text-body-lg">
            Start your journey toward a stronger digital presence with a team
            that values your vision as much as you do.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn btn-ink">
              Get in touch
              <MaterialIcon name="arrow_outward" aria-hidden />
            </Link>
            <a href="mailto:hello@kanagency.design" className="btn btn-paper">
              Email us
              <MaterialIcon name="mail" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
