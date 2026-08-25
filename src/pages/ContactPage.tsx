import { useEffect, useState, type FormEvent } from "react";
import {
  contactForm,
  contactMethods,
  contactPageIntro,
} from "@/content/contact";
import { MaterialIcon } from "@/components/MaterialIcon";

type ContactSubject = (typeof contactForm.subjects)[number];

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<ContactSubject>(
    contactForm.subjects[0],
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Contact | KAN Agency";
    return () => {
      document.title = "KAN Agency | Digital Innovation & Design";
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");
    const href = `mailto:hello@kanagency.design?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <main id="main-content" className="relative min-h-dvh pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 brand-pattern opacity-[0.06]" />

      <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile pb-section-gap-mobile md:px-margin-desktop md:pb-section-gap">
        <header className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <h1 className="mb-stack-md font-headline-xl text-headline-xl uppercase tracking-tighter md:text-[56px] md:leading-[1.1]">
            {contactPageIntro.title}
          </h1>
          <p className="font-body-lg leading-relaxed text-on-surface-variant">
            {contactPageIntro.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {contactMethods.map((method) => {
              const content = (
                <>
                  <MaterialIcon
                    name={method.icon}
                    className="text-2xl text-brand-purple"
                    aria-hidden
                  />
                  <div>
                    <p className="mb-1 font-label-caps text-[11px] tracking-widest text-on-surface-variant">
                      {method.label}
                    </p>
                    <p className="font-body-md text-primary">{method.value}</p>
                  </div>
                </>
              );

              const className =
                "flex items-start gap-4 rounded-3xl border border-outline-variant/30 bg-surface p-6 transition-all duration-300 hover:border-brand-purple/30";

              return method.href ? (
                <a key={method.label} href={method.href} className={className}>
                  {content}
                </a>
              ) : (
                <div key={method.label} className={className}>
                  {content}
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-outline-variant/30 bg-surface p-8 shadow-sm md:p-10 lg:col-span-3"
          >
            <div className="mb-8">
              <span className="section-eyebrow text-brand-purple">
                SEND A MESSAGE
              </span>
              <h2 className="font-headline-md text-headline-md tracking-tight">
                How can we help?
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="mb-2 block font-label-caps text-[11px] tracking-widest text-on-surface-variant">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container/40 px-4 py-3 font-body-md text-primary outline-none transition-colors focus:border-brand-purple"
                />
              </label>

              <label className="block sm:col-span-1">
                <span className="mb-2 block font-label-caps text-[11px] tracking-widest text-on-surface-variant">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container/40 px-4 py-3 font-body-md text-primary outline-none transition-colors focus:border-brand-purple"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block font-label-caps text-[11px] tracking-widest text-on-surface-variant">
                  Subject
                </span>
                <select
                  name="subject"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value as ContactSubject)
                  }
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container/40 px-4 py-3 font-body-md text-primary outline-none transition-colors focus:border-brand-purple"
                >
                  {contactForm.subjects.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block font-label-caps text-[11px] tracking-widest text-on-surface-variant">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-2xl border border-outline-variant/40 bg-surface-container/40 px-4 py-3 font-body-md text-primary outline-none transition-colors focus:border-brand-purple"
                />
              </label>
            </div>

            <button type="submit" className="btn-primary mt-8 !px-10 !py-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
