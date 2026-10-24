import { Link } from "react-router-dom";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { articles } from "@/content/stories";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatUpdated(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export function BlogIndexPage() {
  return (
    <main id="main-content">
      <PageHeader
        index="05"
        eyebrow="Insights"
        title="Notes from the studio."
        subtitle="Five pieces on automation, web apps, brand, marketing tools, and what a KAN website costs. Written by KAN."
        tone="lavender"
      />

      <section className="section border-b-3 border-ink">
        <div className="container-site grid grid-cols-1 gap-8 md:grid-cols-2">
          {articles.map((article) => (
            <article key={article.path} className="card card-hover flex flex-col bg-paper p-8">
              <span className="label text-ink/60">Updated {formatUpdated(article.updated)}</span>
              <h2 className="display mb-4 mt-4 text-[36px] leading-[40px]">
                <Link to={article.path} className="underline decoration-2 underline-offset-4">
                  {article.title}
                </Link>
              </h2>
              <p className="mb-8 text-body text-ink/80">{article.description}</p>
              <Link to={article.path} className="label-lg mt-auto underline decoration-2 underline-offset-4">
                Read
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
