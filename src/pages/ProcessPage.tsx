import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { Process } from "@/components/Process";

export function ProcessPage() {
  return (
    <main id="main-content">
      <PageHeader
        index="04"
        eyebrow="Process"
        title="How a project runs."
        subtitle="The same four steps as the homepage: Discover, Strategize, Design and Build, Launch and Grow. Each step has an output."
        tone="periwinkle"
      />
      <Process />
      <CTA />
    </main>
  );
}
