import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CTA } from "@/components/CTA";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageHeader } from "@/components/PageHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { serviceStories } from "@/content/stories";
import { launchServices, servicesPageIntro } from "@/content/services";

type Service = (typeof launchServices)[number];

function ServiceCard({ service }: { service: Service }) {
  const isExternal = service.cta.href.startsWith("mailto:");
  const featured = "featured" in service && service.featured;

  const ctaClass = `btn btn-sm ${featured ? "btn-periwinkle" : "btn-ink"} w-full`;
  const ctaContent = (
    <>
      {service.cta.label}
      <MaterialIcon name="arrow_outward" aria-hidden />
    </>
  );

  return (
    <article
      id={service.id}
      data-reveal
      className={`card card-hover group flex scroll-mt-32 flex-col ${service.surface}`}
    >
      <div
        className={`duotone ${service.duo} relative aspect-[16/9] border-b-3 border-ink`}
      >
        <img
          src={service.visual}
          alt=""
          loading="lazy"
          className="absolute inset-0"
        />
        <span className="chip absolute left-4 top-4 z-10 bg-ink text-paper">
          {service.index} / {service.kind}
        </span>
        {featured ? (
          <span className="chip absolute right-4 top-4 z-10 bg-purple">
            ★ Best value
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="display min-h-[80px] text-[40px] leading-[40px]">
            {service.title}
          </h3>
          <MaterialIcon
            name={service.icon}
            className="mt-1 shrink-0 text-[32px] transition-transform duration-200 group-hover:-rotate-12"
            aria-hidden
          />
        </div>

        <p className="mb-6 text-body">{service.description}</p>

        <ul className="mb-8 flex flex-wrap gap-2">
          {service.capabilities.map((cap) => (
            <li key={cap} className="tag">
              {cap}
            </li>
          ))}
        </ul>

        <dl className="mt-auto grid grid-cols-2 border-3 border-ink bg-paper">
          <div className="border-r-3 border-ink px-4 py-3">
            <dt className="label text-[11px] text-ink/60">Timeline</dt>
            <dd className="label-lg mt-1">{service.timeline}</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="label text-[11px] text-ink/60">Investment</dt>
            <dd className="label-lg mt-1">{service.investment}</dd>
          </div>
        </dl>

        <div className="mt-6">
          {isExternal ? (
            <a href={service.cta.href} className={ctaClass}>
              {ctaContent}
            </a>
          ) : (
            <Link to={service.cta.href} className={ctaClass}>
              {ctaContent}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function ServicesPage() {
  const gridRef = useRef<HTMLElement>(null);
  useScrollReveal(gridRef);

  useEffect(() => {
    document.title = "Services | KAN";
    return () => {
      document.title = "KAN | Software, Marketing & Brand Studio";
    };
  }, []);

  return (
    <main id="main-content">
      <PageHeader
        index="02"
        eyebrow={servicesPageIntro.eyebrow}
        title={servicesPageIntro.title}
        subtitle={servicesPageIntro.subtitle}
        tone="purple"
      />

      <section className="border-b-3 border-ink">
        <div className="container-site grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {serviceStories.map((story) => (
            <Link key={story.path} to={story.path} className="card card-hover bg-paper p-6">
              <span className="label">{story.eyebrow}</span>
              <h2 className="display mt-3 text-[32px] leading-9">{story.title}</h2>
            </Link>
          ))}
        </div>
      </section>

      <section ref={gridRef} className="section border-b-3 border-ink">
        <div className="container-site grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {launchServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
