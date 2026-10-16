import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { heroContent, heroFacts, marqueeItems } from "@/content";
import { prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { MaterialIcon } from "./MaterialIcon";
import { Halftone, Marquee, Sparkle, WireDisc } from "./Ornaments";

const codeLines: { n: string; parts: { t: string; c?: string }[] }[] = [
  { n: "01", parts: [{ t: "const ", c: "bg-periwinkle px-1 font-bold" }, { t: "studio = {" }] },
  {
    n: "02",
    parts: [
      { t: "  build: " },
      { t: '["web", "apps", "APIs"]', c: "bg-lavender px-0.5" },
      { t: "," },
    ],
  },
  {
    n: "03",
    parts: [
      { t: "  market: " },
      { t: '["SEO", "ads", "content"]', c: "bg-lavender px-0.5" },
      { t: "," },
    ],
  },
  {
    n: "04",
    parts: [
      { t: "  brand: " },
      { t: '["identity", "UI/UX"]', c: "bg-lavender px-0.5" },
      { t: "," },
    ],
  },
  { n: "05", parts: [{ t: "};" }] },
  { n: "06", parts: [{ t: "" }] },
  {
    n: "07",
    parts: [
      { t: "ship", c: "bg-periwinkle px-1 font-bold" },
      { t: "(studio); " },
      { t: "// → growth", c: "text-ink/50" },
    ],
  },
];

const bars = [28, 44, 38, 62, 78, 100];

function HeroArt() {
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:aspect-square lg:ml-auto"
      aria-hidden
    >
      {/* Corner bracket */}
      <div className="absolute right-0 top-0 h-24 w-24 border-r-3 border-t-3 border-ink" />

      {/* Halftone field */}
      <Halftone
        cols={14}
        rows={14}
        className="absolute left-0 top-0 w-[56%]"
        direction="br"
      />

      {/* Wire disc */}
      <WireDisc className="absolute -right-[3%] bottom-0 w-[62%]" />

      {/* Scribble */}
      <svg
        viewBox="0 0 560 560"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        <path
          data-scribble
          d="M52 372C8 236 140 56 300 78C430 96 430 236 330 236C250 236 226 150 306 126C412 94 548 214 504 360C470 470 330 522 214 486C120 456 96 408 150 372"
          stroke="#b890f4"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Code window */}
      <div
        data-art
        className="absolute left-0 top-[17%] w-[94%] border-3 border-ink bg-paper shadow-brutal sm:w-[78%]"
      >
        <div className="flex h-9 items-center gap-4 border-b-3 border-ink bg-ink px-3 text-paper">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 bg-purple" />
            <span className="h-2.5 w-2.5 bg-lavender" />
            <span className="h-2.5 w-2.5 bg-paper" />
          </div>
          <span className="label text-[11px] normal-case text-paper/70">
            kan.config.ts
          </span>
        </div>
        <pre className="overflow-hidden px-3 py-4 font-mono text-[10.5px] leading-[20px] text-ink min-[420px]:text-[12px] sm:px-4 sm:text-[13px]">
          {codeLines.map((line) => (
            <div key={line.n} className="flex gap-3 whitespace-pre sm:gap-4">
              <span className="w-4 select-none text-ink/30">{line.n}</span>
              <span>
                {line.parts.map((p, i) => (
                  <span key={i} className={p.c}>
                    {p.t}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Growth chart */}
      <div
        data-art
        className="absolute bottom-[2%] left-[10%] w-[46%] animate-floaty border-3 border-ink bg-purple p-4 shadow-brutal"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="label font-bold">Growth</span>
          <MaterialIcon name="trending_up" className="text-[20px]" />
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={h}
              style={{ height: `${h}%` }}
              className={`flex-1 border-2 border-ink ${
                i === bars.length - 1 ? "bg-paper" : "bg-ink"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rotating badge */}
      <div
        data-art
        className="absolute right-[2%] top-[1%] h-[26%] w-[26%] min-h-[96px] min-w-[96px]"
      >
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full animate-spin-slow"
        >
          <defs>
            <path
              id="badge-circle"
              d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"
            />
          </defs>
          <circle
            cx="60"
            cy="60"
            r="58"
            fill="#c4a4ff"
            stroke="#0f0f0f"
            strokeWidth="3"
          />
          <text
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            fontSize="10.5"
            letterSpacing="2.4"
            fill="#0f0f0f"
          >
            <textPath href="#badge-circle">
              SOFTWARE ✦ MARKETING ✦ BRAND ✦ AI ✦
            </textPath>
          </text>
        </svg>
        <Sparkle
          size={32}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink"
        />
      </div>

      {/* Sparkle accents */}
      <Sparkle size={28} className="absolute left-[60%] top-[10%] text-ink" />
      <Sparkle size={20} className="absolute right-[6%] top-[50%] text-ink" />
      <Sparkle size={16} className="absolute bottom-[8%] left-[2%] text-purple" />
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = sectionRef.current;
      if (!root || prefersReducedMotion()) return;

      const items = root.querySelectorAll("[data-hero]");
      const art = root.querySelectorAll("[data-art]");
      const scribble = root.querySelector<SVGPathElement>("[data-scribble]");

      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.05,
        clearProps: "transform,opacity",
      });

      gsap.from(art, {
        opacity: 0,
        scale: 0.92,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.12,
        delay: 0.3,
        clearProps: "transform,opacity",
      });

      if (scribble) {
        const length = scribble.getTotalLength();
        gsap.fromTo(
          scribble,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: "power2.inOut",
            delay: 0.4,
            onComplete: () => {
              scribble.style.strokeDasharray = "none";
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden border-b-3 border-ink"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-grid"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
          aria-hidden
        />

        <div className="container-site relative grid grid-cols-1 items-center gap-14 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div data-hero className="mb-8 flex flex-wrap items-center gap-3">
              <span className="chip">
                <span className="h-2 w-2 bg-purple animate-blink" aria-hidden />
                {heroContent.kicker}
              </span>
              <span className="label hidden text-ink/60 sm:inline">
                Est. by K · A · N
              </span>
            </div>

            <h1
              data-hero
              className="display text-display-xl text-ink"
              aria-label="We build software that sells."
            >
              <span className="block">We build</span>
              <span className="mt-2 inline-block -rotate-1 border-3 border-ink bg-periwinkle px-[0.14em] pb-[0.04em] text-ink shadow-brutal md:mt-3">
                software
              </span>
              <span className="mt-2 block md:mt-3">
                that sells<span className="text-purple">.</span>
              </span>
            </h1>

            <p
              data-hero
              className="mt-10 max-w-[560px] text-body-lg text-ink/80"
            >
              {heroContent.lead}
            </p>

            <div data-hero className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="btn btn-periwinkle">
                Start a project
                <MaterialIcon name="arrow_outward" aria-hidden />
              </Link>
              <a href="#work" className="btn btn-paper">
                See our work
                <MaterialIcon name="south" aria-hidden />
              </a>
            </div>
          </div>

          <div data-hero className="lg:col-span-5">
            <HeroArt />
          </div>
        </div>

        {/* Facts strip */}
        <div className="relative border-t-3 border-ink bg-paper">
          <dl className="container-site grid grid-cols-2 md:grid-cols-4">
            {heroFacts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex items-center gap-4 border-ink py-6 md:border-t-0 md:py-8 ${
                  i % 2 === 1 ? "border-l-3 pl-6" : ""
                } ${i > 1 ? "border-t-3" : ""} ${
                  i > 0 ? "md:border-l-3 md:pl-8" : "md:border-l-0 md:pl-0"
                }`}
              >
                <dt className="display text-[56px] leading-[48px] text-ink">
                  {fact.value}
                </dt>
                <dd className="label max-w-[140px] leading-4 text-ink/70">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-b-3 border-ink bg-purple py-4 text-ink">
        <Marquee
          items={marqueeItems}
          itemClassName="display text-[28px] leading-8"
        />
      </div>
    </>
  );
}
