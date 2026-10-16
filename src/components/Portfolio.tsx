import { useRef } from "react";
import { Link } from "react-router-dom";
import { portfolioProjects } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MaterialIcon } from "./MaterialIcon";
import { SectionHeader } from "./SectionHeader";

const shadowByDuo: Record<string, string> = {
  "duo-purple": "shadow-[12px_12px_0_0_#b890f4]",
  "duo-periwinkle": "shadow-[12px_12px_0_0_#92a4ff]",
  "duo-lavender": "shadow-[12px_12px_0_0_#c4a4ff]",
};

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section on-dark scroll-mt-32 overflow-hidden border-b-3 border-ink bg-ink text-paper"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-60" aria-hidden />

      <div className="container-site relative">
        <SectionHeader
          dark
          index="02"
          label="Selected work"
          title={
            <>
              Work that
              <br />
              <span className="text-outline-paper">ships.</span>
            </>
          }
        >
          <p className="max-w-[360px] text-body-lg text-paper/75">
            Architects of brand success — selected projects across software,
            marketing and identity that define our standard for precision.
          </p>
        </SectionHeader>

        <div className="flex flex-col gap-16 md:gap-24">
          {portfolioProjects.map((project, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={project.id}
                data-reveal
                className={`on-light group grid grid-cols-1 border-3 border-ink bg-paper text-ink lg:grid-cols-12 ${shadowByDuo[project.duo]}`}
              >
                <div
                  className={`duotone ${project.duo} relative aspect-[4/3] border-b-3 border-ink lg:col-span-7 lg:aspect-auto lg:min-h-[520px] lg:border-b-0 ${
                    flipped
                      ? "lg:order-2 lg:border-l-3"
                      : "lg:order-1 lg:border-r-3"
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    className="absolute inset-0"
                  />
                  <span className="chip absolute left-4 top-4 z-10 bg-ink text-paper">
                    {project.index} / 03
                  </span>
                </div>

                <div
                  className={`flex flex-col p-8 md:p-10 lg:col-span-5 ${
                    flipped ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <span className="label-lg mb-6 inline-flex w-fit items-center gap-2 text-ink">
                    <span className="h-2 w-2 bg-purple" aria-hidden />
                    {project.category}
                  </span>
                  <h3 className="display mb-6 text-display-md">
                    {project.title}
                  </h3>
                  <p className="mb-8 text-body-lg text-ink/80">
                    {project.description}
                  </p>
                  <div className="mb-10 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/contact"
                    className="btn btn-sm btn-ink mt-auto w-fit"
                  >
                    Start a project
                    <MaterialIcon name="arrow_outward" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
