import { type FormEvent, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PageHeader } from "@/components/PageHeader";
import {
  contactForm,
  contactMethods,
  contactPageIntro,
} from "@/content/contact";

const methodTones = ["bg-purple", "bg-lavender", "bg-periwinkle"] as const;

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(contactForm.subjects[0]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Contact | KAN";
    return () => {
      document.title = "KAN | Software, Marketing & Brand Studio";
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const href = `mailto:hello@kanagency.design?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <main id="main-content">
      <PageHeader
        index="03"
        eyebrow={contactPageIntro.eyebrow}
        title={contactPageIntro.title}
        subtitle={contactPageIntro.subtitle}
        tone="lavender"
      />

      <section className="section border-b-3 border-ink">
        <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-8 lg:col-span-5">
            {contactMethods.map((method, i) => {
              const content = (
                <>
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center border-3 border-ink shadow-brutal-sm ${methodTones[i]}`}
                  >
                    <MaterialIcon
                      name={method.icon}
                      className="text-[28px]"
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="label mb-1 text-ink/60">{method.label}</p>
                    <p className="break-words text-[18px] font-bold leading-6">
                      {method.value}
                    </p>
                  </div>
                </>
              );

              const className =
                "card flex items-center gap-5 p-6 transition-[transform,box-shadow]";

              return method.href ? (
                <a
                  key={method.label}
                  href={method.href}
                  className={`${className} card-hover`}
                >
                  {content}
                </a>
              ) : (
                <div key={method.label} className={className}>
                  {content}
                </div>
              );
            })}

            <div className="on-dark border-3 border-ink bg-ink p-6 text-paper shadow-brutal-lavender">
              <p className="label-lg mb-2 flex items-center gap-3 text-lavender">
                <span className="h-2 w-2 bg-lavender animate-blink" aria-hidden />
                Currently booking
              </p>
              <p className="text-body text-paper/80">
                We take on a limited number of projects at a time so every
                client gets founder-level attention.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="card lg:col-span-7"
            aria-labelledby="contact-form-title"
          >
            <div className="on-dark flex h-12 items-center justify-between border-b-3 border-ink bg-ink px-5 text-paper">
              <span className="label">New message</span>
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 bg-purple" />
                <span className="h-2.5 w-2.5 bg-lavender" />
                <span className="h-2.5 w-2.5 bg-paper" />
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h2
                id="contact-form-title"
                className="display mb-10 text-display-md"
              >
                How can we help?
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="label-lg mb-2 block">Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    className="field"
                  />
                </label>

                <label className="block">
                  <span className="label-lg mb-2 block">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="ada@company.com"
                    className="field"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="label-lg mb-2 block">Subject</span>
                  <span className="relative block">
                    <select
                      name="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="field cursor-pointer appearance-none pr-12"
                    >
                      {contactForm.subjects.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <MaterialIcon
                      name="expand_more"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      aria-hidden
                    />
                  </span>
                </label>

                <label className="block sm:col-span-2">
                  <span className="label-lg mb-2 block">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your product, brand or campaign…"
                    className="field resize-y"
                  />
                </label>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="submit" className="btn btn-periwinkle">
                  Send message
                  <MaterialIcon name="arrow_outward" aria-hidden />
                </button>
                <p className="label text-ink/60">Opens your email app</p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
