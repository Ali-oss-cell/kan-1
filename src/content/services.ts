import { projectImages } from "@/content";

export const servicesPageIntro = {
  eyebrow: "Services",
  title: "End-to-end, from code to campaign.",
  subtitle:
    "A structured system of engineering, design and growth capabilities — packaged with fixed scopes so you know the timeline and the price before we start.",
} as const;

export const launchServices = [
  {
    id: "brand-sprint",
    index: "01",
    kind: "BRAND",
    icon: "palette",
    title: "Brand Sprint",
    description:
      "A fixed-scope identity system in two weeks — logo, visual language, brand guidelines, and a positioning statement founders can use immediately.",
    timeline: "2 weeks",
    investment: "$3,000–$6,000",
    cta: {
      label: "Start Brand Sprint",
      href: "mailto:hello@kanagency.design?subject=Brand%20Sprint",
    },
    capabilities: [
      "Logo",
      "Identity",
      "Guidelines",
      "Positioning",
    ],
    visual: projectImages.lumina,
    duo: "duo-purple",
    surface: "bg-paper",
  },
  {
    id: "launch-site",
    index: "02",
    kind: "WEB",
    icon: "language",
    title: "Launch Site",
    description:
      "A 5–7 page marketing site with professional copy, SEO foundations, analytics, and founder handoff — built to feel credible from day one.",
    timeline: "2–3 weeks",
    investment: "$4,000–$8,000",
    cta: { label: "View Site Work", href: "/#work" },
    capabilities: [
      "5–7 pages",
      "SEO",
      "Analytics",
      "Lead forms",
    ],
    visual: projectImages.vertex,
    duo: "duo-periwinkle",
    surface: "bg-paper",
  },
  {
    id: "web-app-build",
    index: "03",
    kind: "SOFTWARE",
    icon: "terminal",
    title: "Web/App Build",
    description:
      "Scoped product engineering for brochure apps, SaaS MVPs, and internal tools — designed for iteration, handoff, and investor-ready demos.",
    timeline: "6–12 weeks",
    investment: "$8,000–$30,000",
    cta: {
      label: "Discuss a Build",
      href: "mailto:hello@kanagency.design?subject=Web%2FApp%20Build",
    },
    capabilities: [
      "Frontend",
      "Backend",
      "Auth",
      "Deploy",
      "30-day support",
    ],
    visual: projectImages.prism,
    duo: "duo-lavender",
    surface: "bg-paper",
  },
  {
    id: "brand-launch-bundle",
    index: "04",
    kind: "BUNDLE",
    icon: "hub",
    title: "Brand + Launch Bundle",
    description:
      "Brand Sprint and Launch Site in parallel — one team, one visual system, one launch day. The core KAN differentiator for founders who need both fast.",
    timeline: "4–5 weeks",
    investment: "$6,500–$12,000",
    cta: {
      label: "Get the Bundle",
      href: "mailto:hello@kanagency.design?subject=Brand%20%2B%20Launch%20Bundle",
    },
    capabilities: [
      "Brand",
      "Website",
      "Parallel",
      "Same-day launch",
    ],
    visual: projectImages.lumina,
    duo: "duo-periwinkle",
    surface: "bg-paper",
    featured: true,
  },
  {
    id: "growth-marketing",
    index: "05",
    kind: "MARKETING",
    icon: "campaign",
    title: "Growth Marketing",
    description:
      "Ongoing digital marketing — SEO, paid campaigns, content and analytics — run by the same team that built your product, so every channel stays on-brand and measurable.",
    timeline: "Ongoing",
    investment: "Custom quote",
    cta: {
      label: "Plan Your Growth",
      href: "mailto:hello@kanagency.design?subject=Growth%20Marketing",
    },
    capabilities: [
      "SEO",
      "Paid media",
      "Content",
      "Reporting",
    ],
    visual: projectImages.prism,
    duo: "duo-purple",
    surface: "bg-paper",
  },
  {
    id: "ai-automation-pilot",
    index: "06",
    kind: "AI",
    icon: "auto_awesome",
    title: "AI Automation Pilot",
    description:
      "One scoped workflow automated with Claude or OpenAI — lead qualification, support triage, content drafting, or data processing — with clear ROI and a retainer path.",
    timeline: "2–4 weeks",
    investment: "$2,000–$4,000",
    cta: {
      label: "Pilot Automation",
      href: "mailto:hello@kanagency.design?subject=AI%20Automation%20Pilot",
    },
    capabilities: [
      "LLM workflows",
      "Integrations",
      "Triage",
      "Monitoring",
    ],
    visual: projectImages.vertex,
    duo: "duo-lavender",
    surface: "bg-paper",
  },
] as const;
