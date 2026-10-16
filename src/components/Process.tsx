import { useRef } from "react";
import { processSteps } from "@/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeader } from "./SectionHeader";

const hoverTone = [
  "hover:bg-lavender",
  "hover:bg-purple",
  "hover:bg-periwinkle",
  "hover:bg-ink hover:text-paper",
] as const;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section scroll-mt-32 border-b-3 border-ink"
    >
      <div className="container-site">
        <SectionHeader
          index="03"
          label="How we work"
          title={
            <>
              Four steps.
              <br />
              <span className="mark-block mt-1 border-3 border-ink bg-purple pb-[0.03em] shadow-brutal-sm">No black box.</span>
            </>
          }
        >
          <p className="max-w-[360px] text-body-lg text-ink/80">
            From discovery to deployment — a clear process where every sprint
            has an owner, an output and a date.
          </p>
        </SectionHeader>

        <ol
          data-reveal
          className="grid grid-cols-1 border-l-3 border-t-3 border-ink bg-paper shadow-brutal-lg md:grid-cols-2 xl:grid-cols-4"
        >
          {processSteps.map((item, i) => (
            <li
              key={item.step}
              className={`group flex min-h-[420px] flex-col border-b-3 border-r-3 border-ink p-8 transition-colors duration-200 ${hoverTone[i]}`}
            >
              <span className="display mb-10 text-[128px] leading-[104px] text-outline transition-[color] duration-200 group-hover:text-current">
                {item.step}
              </span>
              <h3 className="display mb-4 text-display-sm">{item.title}</h3>
              <p className="mb-8 text-body">{item.description}</p>
              <div className="mt-auto flex items-center gap-3 border-t-3 border-ink pt-4">
                <span className="label-lg">Output</span>
                <span className="label text-[11px] font-bold">
                  → {item.output}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
