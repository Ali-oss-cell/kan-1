import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="mx-auto max-w-container-max scroll-mt-28 px-margin-mobile py-section-gap-mobile md:scroll-mt-32 md:px-margin-desktop md:py-section-gap"
    >
      <div className="relative overflow-hidden rounded-[40px] bg-brand-gradient p-10 shadow-2xl shadow-brand-purple/30 md:p-20">
        <div className="pointer-events-none absolute inset-0 brand-pattern opacity-15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-purple/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-stack-lg font-display-lg text-display-lg-mobile tracking-tighter text-on-primary md:text-display-lg">
            Your vision. Our design. Let&apos;s build.
          </h2>
          <p className="mb-12 font-body-lg leading-relaxed text-on-primary/85">
            Start your journey toward a stronger digital presence with a team
            that values your vision as much as you do.
          </p>
          <Link
            to="/contact"
            className="btn-primary !bg-on-primary !text-primary hover:!bg-on-primary hover:!shadow-xl hover:!shadow-primary/20"
          >
            Get in touch now
          </Link>
        </div>
      </div>
    </section>
  );
}
