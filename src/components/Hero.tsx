import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { prefersReducedMotion, registerGsap } from "@/lib/gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = sectionRef.current;
      if (!root) return;

      const items = root.querySelectorAll<HTMLElement>("[data-hero-item]");
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1 });
        return;
      }

      gsap.set(items, { opacity: 0 });
      gsap.to(items, {
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh max-h-dvh flex-col items-center justify-center overflow-hidden overscroll-none px-margin-mobile pt-24 text-center md:px-margin-desktop md:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 brand-pattern hero-pattern-fade opacity-20" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-stack-md md:space-y-stack-lg">
        <div
          data-hero-item
          className="mb-4 inline-block rounded-full border border-outline-variant/30 bg-surface/80 px-5 py-2 font-label-caps text-label-caps text-primary shadow-sm backdrop-blur-sm"
        >
          FULL-SERVICE DIGITAL AGENCY
        </div>
        <h1
          data-hero-item
          className="font-display-lg text-display-lg-mobile uppercase leading-none tracking-tighter md:text-display-lg"
        >
          Together, we{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            KAN.
          </span>
        </h1>
        <p
          data-hero-item
          className="mx-auto max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
        >
          Your vision, our design — together, we can. We build stronger digital
          brands through high-fidelity visual narratives and architectural
          clarity.
        </p>
        <div
          data-hero-item
          className="flex flex-wrap justify-center gap-4 pt-stack-md md:pt-stack-lg"
        >
          <a href="#contact" className="btn-primary">
            Elevate Your Brand
          </a>
          <a href="#work" className="btn-secondary">
            View Our Work
          </a>
        </div>
      </div>
    </section>
  );
}
