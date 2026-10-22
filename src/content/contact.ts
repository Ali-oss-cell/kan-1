export const contactPageIntro = {
  eyebrow: "Contact",
  title: "Let's build it.",
  subtitle:
    "Tell us about your product, brand or campaign. We respond within two business days — usually sooner.",
} as const;

export const contactEmail = "info@kan.com";

export const contactMethods = [
  {
    icon: "mail",
    label: "Email",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
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
    "Growth Marketing",
    "AI Automation Pilot",
    "General inquiry",
  ],
} as const;
