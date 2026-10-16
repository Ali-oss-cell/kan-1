import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { Halftone, Sparkle, WireDisc } from "./Ornaments";

type Tone = "periwinkle" | "purple" | "lavender";

const tones: Record<Tone, { dots: string; disc: string; badge: string }> = {
  periwinkle: { dots: "#92a4ff", disc: "#92a4ff", badge: "bg-periwinkle text-ink" },
  purple: { dots: "#b890f4", disc: "#b890f4", badge: "bg-purple text-ink" },
  lavender: { dots: "#0f0f0f", disc: "#c4a4ff", badge: "bg-lavender text-ink" },
};

/** Poster-style header shared by all inner pages. */
export function PageHeader({
  index,
  eyebrow,
  title,
  subtitle,
  tone = "periwinkle",
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tone?: Tone;
}) {
  const ref = useRef<HTMLElement>(null);
  const t = tones[tone];

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.querySelectorAll("[data-hero]"), {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
      });
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className="relative overflow-hidden border-b-3 border-ink bg-paper"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grid"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 90%)",
        }}
        aria-hidden
      />

      <div className="container-site relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div data-hero className="mb-8 flex items-center gap-3">
            <span className={`chip ${t.badge}`}>{index}</span>
            <span className="chip">{eyebrow}</span>
          </div>
          <h1 data-hero className="display mb-8 text-display-lg">
            {title}
          </h1>
          <p data-hero className="max-w-[640px] text-body-lg text-ink/80">
            {subtitle}
          </p>
        </div>

        <div
          data-hero
          className="relative hidden h-[320px] lg:col-span-4 lg:block"
          aria-hidden
        >
          <Halftone
            cols={10}
            rows={10}
            color={t.dots}
            className="absolute left-0 top-0 w-[58%]"
          />
          <WireDisc
            className="absolute bottom-0 right-0 w-[64%]"
            fill={t.disc}
            line="#0f0f0f"
          />
          <Sparkle size={32} className="absolute right-2 top-2 text-ink" />
          <Sparkle size={20} className="absolute left-[56%] top-[44%] text-ink" />
        </div>
      </div>
    </header>
  );
}
