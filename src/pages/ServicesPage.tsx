import { useEffect } from "react";
import { launchServices, servicesPageIntro } from "@/content/services";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Link } from "react-router-dom";

type Service = (typeof launchServices)[number];

function ServiceCard({ service }: { service: Service }) {
  const isExternal = service.cta.href.startsWith("mailto:");

  return (
    <article
      id={service.id}
      className="group flex flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface shadow-sm transition-all duration-500 hover:border-brand-purple/30 hover:shadow-xl hover:shadow-brand-purple/10 lg:min-h-[360px] lg:flex-row"
    >
      <div className="relative flex flex-1 flex-col p-8 md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <span className="font-label-caps text-label-caps tracking-widest text-brand-purple">
            {service.index}
          </span>
          <MaterialIcon
            name={service.icon}
            className="text-3xl text-outline-variant transition-colors duration-300 group-hover:text-brand-purple"
            aria-hidden
          />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 sm:max-w-xs">
          {service.capabilities.map((cap) => (
            <div
              key={cap.label}
              className="flex aspect-square items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container/60 text-brand-purple transition-colors duration-300 group-hover:border-brand-purple/30"
              title={cap.label}
            >
              <MaterialIcon name={cap.icon} className="text-2xl" aria-hidden />
              <span className="sr-only">{cap.label}</span>
            </div>
          ))}
        </div>

        <h3 className="mb-3 font-headline-md text-headline-md tracking-tight">
          {service.title}
        </h3>
        <p className="mb-4 max-w-md font-body-md leading-relaxed text-on-surface-variant">
          {service.description}
        </p>
        <p className="mb-8 font-label-caps text-[11px] tracking-wider text-on-surface-variant/80">
          {service.timeline} · {service.investment}
        </p>

        {isExternal ? (
          <a href={service.cta.href} className="btn-secondary mt-auto w-fit !px-8 !py-3">
            {service.cta.label}
          </a>
        ) : (
          <Link to={service.cta.href} className="btn-secondary mt-auto w-fit !px-8 !py-3">
            {service.cta.label}
          </Link>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 bg-surface-container p-3 lg:w-[42%] lg:p-4">
        {service.visuals.map((src, i) => (
          <div
            key={`${service.id}-visual-${i}`}
            className="aspect-square overflow-hidden rounded-2xl bg-surface"
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </article>
  );
}

function ServicesCtaCard() {
  return (
    <aside className="flex min-h-[360px] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-on-primary shadow-2xl shadow-primary/20 md:p-10 lg:min-h-full">
      <div>
        <span className="mb-6 inline-block font-label-caps text-label-caps tracking-widest text-brand-lavender">
          NEXT STEP
        </span>
        <h3 className="mb-4 font-display-lg text-[40px] uppercase leading-none tracking-tighter md:text-5xl">
          Together, we{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            KAN.
          </span>
        </h3>
        <p className="max-w-sm font-body-lg leading-relaxed text-on-primary/75">
          Your vision, our design. Let&apos;s create something extraordinary —
          start with a launch-ready service built for founders.
        </p>
      </div>
      <Link
        to="/contact"
        className="mt-10 inline-flex w-fit items-center justify-center rounded-full bg-brand-gradient px-10 py-4 font-label-caps text-label-caps text-on-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-purple/40 active:scale-[0.98]"
      >
        Let&apos;s Talk
      </Link>
    </aside>
  );
}

export function ServicesPage() {
  useEffect(() => {
    document.title = "Services | KAN Agency";
    return () => {
      document.title = "KAN Agency | Digital Innovation & Design";
    };
  }, []);

  return (
    <main id="main-content" className="relative min-h-dvh pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 brand-pattern opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile pb-section-gap-mobile md:px-margin-desktop md:pb-section-gap">
        <header className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <h1 className="mb-stack-md font-headline-xl text-headline-xl uppercase tracking-tighter md:text-[56px] md:leading-[1.1]">
            {servicesPageIntro.title}
          </h1>
          <p className="font-body-lg leading-relaxed text-on-surface-variant">
            {servicesPageIntro.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {launchServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
          <ServicesCtaCard />
        </div>
      </div>
    </main>
  );
}
