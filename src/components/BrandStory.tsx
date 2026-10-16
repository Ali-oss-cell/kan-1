import { useRef } from "react";
import { Link } from "react-router-dom";
import { brandStory } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MaterialIcon } from "./MaterialIcon";
import { Halftone } from "./Ornaments";

const initials = [
  { letter: "K", tone: "bg-purple text-ink", rotate: "-rotate-3" },
  { letter: "A", tone: "bg-lavender text-ink", rotate: "rotate-2" },
  { letter: "N", tone: "bg-paper text-ink", rotate: "-rotate-1" },
] as const;

type BrandStoryProps = {
  index?: string;
  eyebrow?: string;
  headline?: string;
  body?: string;
  clients?: readonly string[];
  showLink?: boolean;
};

export function BrandStory({
  index = "04",
  eyebrow = "Our story",
  headline = brandStory.headline,
  body = brandStory.body,
  clients = brandStory.clients,
  showLink = true,
}: BrandStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section scroll-mt-32 overflow-hidden border-b-3 border-ink bg-periwinkle text-ink"
    >
      <Halftone
        cols={14}
        rows={14}
        color="#0f0f0f"
        direction="tr"
        className="pointer-events-none absolute -right-10 -top-10 w-[360px] opacity-20"
      />

      <div className="container-site relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div
            data-reveal
            className="label-lg mb-6 flex items-center gap-4"
          >
            <span className="inline-flex h-8 min-w-8 items-center justify-center border-3 border-ink bg-paper px-2">
              {index}
            </span>
            <span>{eyebrow}</span>
          </div>
          <h2 data-reveal className="display mb-14 max-w-[820px] text-display-lg">
            {headline.split(/(?<=\.)\s+/).map((sentence) => (
              <span key={sentence} className="block">
                {sentence}
              </span>
            ))}
          </h2>

          <div data-reveal className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex gap-3 md:gap-6">
            {initials.map(({ letter, tone, rotate }) => (
              <span
                key={letter}
                className={`display flex h-[88px] w-[88px] items-center justify-center border-3 border-ink text-[72px] leading-none shadow-brutal transition-transform duration-200 hover:rotate-0 sm:h-[104px] sm:w-[104px] sm:text-[88px] md:h-[136px] md:w-[136px] md:text-[120px] ${tone} ${rotate}`}
              >
                {letter}
              </span>
            ))}
            </div>
            <span className="display text-[56px] md:text-[72px]">
              = CAN
            </span>
          </div>
        </div>

        <div data-reveal className="lg:col-span-5 lg:pt-16">
          <div className="on-light border-3 border-ink bg-paper p-8 text-ink shadow-brutal-lg md:p-10">
            <p className="mb-8 text-body-lg">{body}</p>

            <ul className="mb-8 space-y-3 border-t-3 border-ink pt-8">
              {clients.map((client) => (
                <li key={client} className="flex items-start gap-3 text-body">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-lavender">
                    <MaterialIcon name="check" className="text-[16px]" aria-hidden />
                  </span>
                  {client}
                </li>
              ))}
            </ul>

            {showLink ? (
              <Link to="/about" className="btn btn-sm btn-ink">
                More about us
                <MaterialIcon name="arrow_outward" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
