import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { portfolioProjects } from "@/content";

export function CaseStudiesPage() {
  return (
    <main id="main-content">
      <PageHeader
        index="03"
        eyebrow="Work"
        title="Case studies."
        subtitle="Three projects from the KAN site: Lumina Digital Core, Vertex UI, and Prism Identity. The words below are the descriptions already published with that work."
        tone="purple"
      />

      <section className="section border-b-3 border-ink">
        <div className="container-site flex flex-col gap-12">
          {portfolioProjects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="card grid grid-cols-1 overflow-hidden bg-paper lg:grid-cols-12"
            >
              <div className={`duotone ${project.duo} relative min-h-[280px] border-b-3 border-ink lg:col-span-6 lg:border-b-0 lg:border-r-3`}>
                <img src={project.image} alt={project.alt} className="absolute inset-0" />
              </div>
              <div className="flex flex-col p-8 md:p-10 lg:col-span-6">
                <span className="label mb-4">{project.category}</span>
                <h2 className="display mb-4 text-display-sm">{project.title}</h2>
                <p className="mb-8 text-body-lg text-ink/80">{project.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
