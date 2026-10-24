import { Link } from "react-router-dom";
import { CTA } from "@/components/CTA";
import { PageHeader } from "@/components/PageHeader";
import { type Story } from "@/content/stories";

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

export function StoryPage({ story }: { story: Story }) {
  return (
    <main id="main-content">
      <PageHeader
        index={story.index}
        eyebrow={story.eyebrow}
        title={story.title}
        subtitle={story.lead}
        tone={story.tone}
      />

      <article className="section border-b-3 border-ink">
        <div className="container-site grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="flex flex-col gap-12 lg:col-span-8">
            {story.parent ? (
              <nav aria-label="Breadcrumb" className="label text-ink/70">
                <Link to={story.parent.href} className="underline decoration-2 underline-offset-4">
                  {story.parent.label}
                </Link>
                <span aria-hidden> / </span>
                <span>{story.title}</span>
              </nav>
            ) : null}

            {story.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="display mb-4 text-display-sm">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-4 max-w-[68ch] text-body-lg text-ink/80">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            {story.kind === "article" ? (
              <p className="label text-ink/70">
                Written by{" "}
                <Link to="/about" className="underline decoration-2 underline-offset-4">
                  KAN
                </Link>
                <span> · Updated {formatUpdated(story.updated)}</span>
              </p>
            ) : null}
          </div>

          {story.related.length > 0 ? (
            <aside className="lg:col-span-4">
              <div className="card bg-paper p-8">
                <h2 className="label mb-6 text-ink">Related</h2>
                <ul className="flex flex-col gap-4">
                  {story.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-body font-semibold underline decoration-ink decoration-2 underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </article>

      {story.faqs.length > 0 ? (
        <section className="section border-b-3 border-ink bg-paper">
          <div className="container-site">
            <h2 className="display mb-10 text-display-sm">Questions</h2>
            <div className="grid grid-cols-1 gap-6">
              {story.faqs.map((faq) => (
                <article key={faq.question} className="card bg-paper p-8">
                  <h3 className="display mb-4 text-[28px] leading-8">{faq.question}</h3>
                  <p className="max-w-[68ch] text-body-lg text-ink/80">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTA />
    </main>
  );
}
