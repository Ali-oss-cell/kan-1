import { useEffect, useRef } from "react";
import { BrandStory } from "@/components/BrandStory";
import { CTA } from "@/components/CTA";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  aboutClients,
  aboutPageIntro,
  aboutStory,
  aboutStudio,
  aboutValues,
} from "@/content/about";

const valueTones = [
  { card: "bg-paper", icon: "bg-purple" },
  { card: "bg-lavender", icon: "bg-paper" },
  { card: "bg-paper", icon: "bg-periwinkle" },
] as const;

export function AboutPage() {
  const valuesRef = useRef<HTMLElement>(null);
  useScrollReveal(valuesRef);

  useEffect(() => {
    document.title = "About | KAN";
    return () => {
      document.title = "KAN | Software, Marketing & Brand Studio";
    };
  }, []);

  return (
    <main id="main-content">
      <PageHeader
        index="01"
        eyebrow={aboutPageIntro.eyebrow}
        title={aboutPageIntro.title}
        subtitle={aboutPageIntro.subtitle}
        tone="periwinkle"
      />

      <section className="border-b-3 border-ink bg-paper">
        <div className="container-site max-w-3xl py-16 md:py-20">
          <h2 className="display mb-6 text-display-sm">The studio</h2>
          <p className="text-body-lg text-ink/80">{aboutStudio}</p>
        </div>
      </section>

      <BrandStory
        index="01"
        eyebrow={aboutStory.eyebrow}
        headline={aboutStory.headline}
        body={aboutStory.body}
        clients={aboutClients}
        showLink={false}
      />

      <section ref={valuesRef} className="section border-b-3 border-ink">
        <div className="container-site">
          <SectionHeader
            index="02"
            label="Principles"
            title={
              <>
                How we
                <br />
                <span className="mark-block mt-1 border-3 border-ink bg-periwinkle pb-[0.03em] shadow-brutal-sm">show up.</span>
              </>
            }
          >
            <p className="max-w-[360px] text-body-lg text-ink/80">
              Principles that shape every engagement — from the first call to
              the thirtieth day after launch.
            </p>
          </SectionHeader>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {aboutValues.map((value, i) => (
              <article
                key={value.title}
                data-reveal
                className={`card card-hover flex min-h-[360px] flex-col p-8 ${valueTones[i].card}`}
              >
                <div className="mb-10 flex items-start justify-between">
                  <span className="display text-[72px] leading-[64px] text-outline">
                    {value.index}
                  </span>
                  <span
                    className={`flex h-14 w-14 items-center justify-center border-3 border-ink shadow-brutal-sm ${valueTones[i].icon}`}
                  >
                    <MaterialIcon
                      name={value.icon}
                      className="text-[28px]"
                      aria-hidden
                    />
                  </span>
                </div>
                <h3 className="display mb-4 text-display-sm">{value.title}</h3>
                <p className="mt-auto text-body">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
