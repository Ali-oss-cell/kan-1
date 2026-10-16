import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { type RefObject } from "react";
import { prefersReducedMotion, registerGsap } from "@/lib/gsap";

/**
 * Reveals every `[data-reveal]` descendant with a staggered rise as it enters
 * the viewport. Elements are only hidden once the trigger is armed, so content
 * is never stranded invisible if JS fails.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const items = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-reveal]"),
      );
      if (items.length === 0) return;

      gsap.set(items, { opacity: 0, y: 32 });

      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });
    },
    { scope: ref },
  );
}
