import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { portfolioProjects } from "@/content";
import { registerGsap } from "@/lib/gsap";

type Project = (typeof portfolioProjects)[number];

function ImageCluster({
  project,
  accents,
  flipped,
}: {
  project: Project;
  accents: Project[];
  flipped: boolean;
}) {
  const [a, b] = accents;

  return (
    <div
      data-thread-anchor
      className={`relative mx-auto w-full max-w-md ${flipped ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"}`}
    >
      <div className="relative aspect-[4/5]">
        <div className="absolute inset-[8%] overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container shadow-lg shadow-brand-purple/10">
          <img
            src={project.image}
            alt={project.alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" />
        </div>

        {a && (
          <div
            className={`absolute z-10 h-24 w-24 overflow-hidden rounded-xl border-2 border-surface shadow-md md:h-28 md:w-28 ${
              flipped
                ? "-left-2 bottom-10 md:-left-6"
                : "-right-2 bottom-10 md:-right-6"
            }`}
          >
            <img
              src={a.image}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {b && (
          <div
            className={`absolute z-10 h-20 w-20 overflow-hidden rounded-xl border-2 border-surface shadow-md md:h-24 md:w-24 ${
              flipped
                ? "-right-1 top-8 md:-right-4"
                : "-left-1 top-8 md:-left-4"
            }`}
          >
            <img
              src={b.image}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div
          className={`absolute z-10 h-14 w-14 rounded-lg bg-brand-gradient opacity-90 shadow-md shadow-brand-purple/30 md:h-16 md:w-16 ${
            flipped ? "left-8 -top-3 md:left-12" : "right-8 -top-3 md:right-12"
          }`}
          aria-hidden
        />
      </div>
    </div>
  );
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midY = (current.y + next.y) / 2;
    d += ` C ${current.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
  }
  return d;
}

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const syncPath = useCallback(() => {
    const track = trackRef.current;
    const path = pathRef.current;
    if (!track || !path) return;

    const trackRect = track.getBoundingClientRect();
    const anchors = track.querySelectorAll<HTMLElement>("[data-thread-anchor]");
    if (anchors.length < 2) {
      path.setAttribute("d", "");
      return;
    }

    const points = Array.from(anchors).map((anchor) => {
      const rect = anchor.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - trackRect.left,
        y: rect.top + rect.height / 2 - trackRect.top,
      };
    });

    path.setAttribute("d", buildPath(points));
  }, []);

  useGSAP(
    () => {
      registerGsap();
      const frame = requestAnimationFrame(() => syncPath());
      window.addEventListener("resize", syncPath);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", syncPath);
      };
    },
    { scope: sectionRef, dependencies: [syncPath] },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-28 py-section-gap-mobile md:scroll-mt-32 md:py-section-gap"
    >
      <div className="pointer-events-none absolute inset-y-0 left-[12%] hidden w-px bg-gradient-to-b from-transparent via-outline-variant/40 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-px bg-gradient-to-b from-transparent via-outline-variant/40 to-transparent md:block" />

      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-stack-lg flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
          <div className="h-1 w-12 rounded-full bg-brand-gradient" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
        </div>

        <div className="mb-16 flex flex-col items-start justify-between gap-stack-md md:mb-20 md:flex-row md:items-end">
          <div>
            <span className="section-eyebrow">SELECTED WORK</span>
            <h2 className="section-title">Portfolio</h2>
          </div>
          <p className="max-w-sm font-body-md leading-relaxed text-on-surface-variant md:text-right">
            Architects of brand success — selected works that define our
            standard for precision and creative vibrancy.
          </p>
        </div>

        <div ref={trackRef} className="relative overflow-visible">
          <svg
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible md:block"
            aria-hidden
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="url(#thread-grad)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
              className="opacity-60"
            />
            <defs>
              <linearGradient id="thread-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b890f4" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#b890f4" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#92a4ff" stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col gap-20 md:gap-32">
            {portfolioProjects.map((project, index) => {
              const flipped = index % 2 === 1;
              const accents = portfolioProjects.filter(
                (p) => p.id !== project.id,
              );

              return (
                <article
                  key={project.id}
                  className="group grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
                >
                  <div className={flipped ? "md:order-2" : undefined}>
                    <ImageCluster
                      project={project}
                      accents={accents}
                      flipped={flipped}
                    />
                  </div>

                  <div
                    className={
                      flipped
                        ? "md:order-1 md:flex md:flex-col md:items-end md:text-right"
                        : undefined
                    }
                  >
                    <span className="section-eyebrow mb-stack-sm">
                      {project.category}
                    </span>
                    <h3 className="mb-stack-md font-headline-xl text-headline-xl uppercase tracking-tighter">
                      {project.title}
                    </h3>
                    <p
                      className={`mb-8 max-w-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant ${
                        flipped ? "md:ml-auto" : ""
                      }`}
                    >
                      {project.description}
                    </p>
                    <Link to="/contact" className="btn-secondary !px-8 !py-3">
                      Start a Project
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
