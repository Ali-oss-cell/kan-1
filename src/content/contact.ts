export const contactPageIntro = {
  title: "Contact Us.",
  subtitle:
    "Tell us about your vision. We respond within two business days — usually sooner.",
} as const;

export const contactMethods = [
  {
    icon: "mail",
    label: "Email",
    value: "hello@kanagency.design",
    href: "mailto:hello@kanagency.design",
  },
  {
    icon: "schedule",
    label: "Response time",
    value: "Within 2 business days",
    href: null,
  },
  {
    icon: "public",
    label: "Working with",
    value: "Founders & brands worldwide",
    href: null,
  },
] as const;

export const contactForm = {
  subjects: [
    "Brand Sprint",
    "Launch Site",
    "Web/App Build",
    "Brand + Launch Bundle",
    "AI Automation Pilot",
    "General inquiry",
  ],
} as const;
