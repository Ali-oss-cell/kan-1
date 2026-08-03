import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject } from "react";
import { prefersReducedMotion, registerGsap } from "@/lib/gsap";

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options?: { start?: string; delay?: number },
) {
  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(el, { opacity: 0, y: 40 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: options?.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: options?.start ?? "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: [options?.start, options?.delay] },
  );
}
