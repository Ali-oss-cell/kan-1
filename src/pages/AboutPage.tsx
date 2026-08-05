import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  aboutClients,
  aboutPageIntro,
  aboutStory,
  aboutValues,
} from "@/content/about";
import { MaterialIcon } from "@/components/MaterialIcon";

export function AboutPage() {
  useEffect(() => {
    document.title = "About | KAN Agency";
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
            {aboutPageIntro.title}
          </h1>
          <p className="font-body-lg leading-relaxed text-on-surface-variant">
            {aboutPageIntro.subtitle}
          </p>
        </header>

        <section className="relative mb-16 overflow-hidden rounded-3xl bg-primary p-10 shadow-2xl shadow-primary/20 ring-1 ring-on-primary/10 md:mb-20 md:p-16">
          <img
            src="/brand/logo-dark.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 opacity-[0.04] md:h-72 md:w-72"
          />

          <div className="relative z-10 grid grid-cols-1 gap-gutter md:grid-cols-2 md:gap-16">
            <div>
              <span className="section-eyebrow text-brand-lavender">
                {aboutStory.eyebrow}
              </span>
              <h2 className="font-headline-xl text-headline-xl leading-tight tracking-tighter text-on-primary">
                {aboutStory.headline}
              </h2>
            </div>

            <div className="space-y-stack-lg">
              <p className="font-body-lg text-body-lg leading-relaxed text-on-primary/80">
                {aboutStory.body}
              </p>
              <ul className="space-y-stack-sm">
                {aboutClients.map((client) => (
                  <li
                    key={client}
                    className="flex items-start gap-3 font-body-md text-on-primary/70"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-brand-gradient shadow-sm shadow-brand-purple/50" />
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16 md:mb-20">
          <div className="mb-10 max-w-2xl">
            <span className="section-eyebrow text-brand-purple">HOW WE WORK</span>
            <h2 className="font-headline-md text-headline-md tracking-tight">
              Principles that shape every engagement.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {aboutValues.map((value) => (
              <article
                key={value.title}
                className="rounded-3xl border border-outline-variant/30 bg-surface p-8 transition-all duration-500 hover:border-brand-purple/30 hover:shadow-xl hover:shadow-brand-purple/10"
              >
                <MaterialIcon
                  name={value.icon}
                  className="mb-6 text-3xl text-brand-purple"
                  aria-hidden
                />
                <h3 className="mb-3 font-headline-md text-xl tracking-tight">
                  {value.title}
                </h3>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl bg-brand-gradient p-10 shadow-2xl shadow-brand-purple/30 md:flex-row md:items-center md:p-14">
          <div className="max-w-xl">
            <h2 className="mb-4 font-display-lg text-[36px] uppercase leading-none tracking-tighter text-on-primary md:text-5xl">
              Ready to build with us?
            </h2>
            <p className="font-body-lg leading-relaxed text-on-primary/85">
              Start a conversation about your brand, product, or next launch.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-primary shrink-0 !bg-on-primary !text-primary hover:!bg-on-primary hover:!shadow-xl hover:!shadow-primary/20"
          >
            Contact Us
          </Link>
        </aside>
      </div>
    </main>
  );
}
