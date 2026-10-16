import { useRef } from "react";
import { Link } from "react-router-dom";
import { expertiseCards } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MaterialIcon } from "./MaterialIcon";
import { SectionHeader } from "./SectionHeader";

export function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="section scroll-mt-32 border-b-3 border-ink"
    >
      <div className="container-site">
        <SectionHeader
          index="01"
          label="What we do"
          title={
            <>
              Four disciplines.
              <br />
              <span className="mark-block mt-1 border-3 border-ink bg-periwinkle pb-[0.03em] shadow-brutal-sm">One team.</span>
            </>
          }
        >
          <p className="max-w-[360px] text-body-lg text-ink/80">
            We close the gap between engineering, design and marketing — so the
            product you ship is the product your market wants.
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {expertiseCards.map((card) => (
            <article
              key={card.title}
              data-reveal
              className={`card card-hover group relative flex min-h-[400px] flex-col p-8 md:p-10 ${card.tone}`}
            >
              <div className="mb-10 flex items-start justify-between">
                <span className="display text-[96px] leading-[80px] text-outline">
                  {card.index}
                </span>
                <span
                  className={`flex h-16 w-16 items-center justify-center border-3 border-ink shadow-brutal-sm transition-transform duration-200 group-hover:-rotate-6 ${card.accent}`}
                >
                  <MaterialIcon name={card.icon} className="text-[32px]" aria-hidden />
                </span>
              </div>

              <h3 className="display mb-4 text-display-md">{card.title}</h3>
              <p className="mb-8 max-w-[480px] text-body-lg">
                {card.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-14 flex justify-center md:mt-20">
          <Link to="/services" className="btn btn-ink">
            Explore all services
            <MaterialIcon name="arrow_outward" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
