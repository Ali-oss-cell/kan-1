/** Local artwork for homepage work + case studies. */
export const portfolioImages = {
  lumina: "/work/lumina.jpg",
  vertex: "/work/vertex.jpg",
  prism: "/work/prism.jpg",
} as const;

export const heroContent = {
  kicker: "Software · Marketing · Brand",
  lead: "KAN is a software, programming and digital marketing studio. We design, build and grow web apps, brands and automations — from first sketch to measurable revenue.",
} as const;

export const marqueeItems = [
  "Custom Software",
  "Web & App Development",
  "Digital Marketing",
  "Brand Identity",
  "UI/UX Design",
  "AI Automation",
  "SEO & Analytics",
  "APIs & Integrations",
] as const;

export const heroFacts = [
  { value: "3", label: "Founders leading the studio" },
  { value: "2W", label: "Brand Sprint turnaround" },
  { value: "30D", label: "Post-launch build support" },
  { value: "<2D", label: "Max reply time" },
] as const;

export const brandStory = {
  headline: "Three founders. One name. Infinite possibility.",
  body: "KAN is derived from the initials of its three founders — K, A, N. Arranged together, the name forms \"KAN,\" which phonetically echoes \"CAN\": a declaration of possibility and empowerment. We are architects of brand success, not just developers or marketers — we build strong, memorable products and drive measurable growth.",
  clients: [
    "Startups seeking their first product & identity",
    "Established companies modernising their stack",
    "Lifestyle brands with stories to tell",
    "Tech innovators pushing boundaries",
  ],
} as const;

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    description:
      "We listen deeply to your goals, users and constraints — mapping the landscape before a single line of code or pixel is placed.",
    output: "Brief + scope",
  },
  {
    step: "02",
    title: "Strategize",
    description:
      "Technical clarity meets creative strategy. We define the architecture, positioning and roadmap that everything else hangs on.",
    output: "Roadmap + stack",
  },
  {
    step: "03",
    title: "Design & Build",
    description:
      "Brand systems and production code, shipped in parallel by one team — so what is designed is exactly what is built.",
    output: "Working product",
  },
  {
    step: "04",
    title: "Launch & Grow",
    description:
      "Deploy, measure, iterate. We stay on after launch with analytics, campaigns and support until the numbers move.",
    output: "Measured growth",
  },
] as const;

export const portfolioProjects = [
  {
    id: "lumina",
    index: "01",
    category: "BRAND IDENTITY",
    title: "Lumina Digital Core",
    description:
      "A modular identity system built for scale — pearlescent surfaces, crystalline structure, and a visual language that feels inevitable.",
    tags: ["Identity", "Guidelines", "Design system"],
    image: portfolioImages.lumina,
    duo: "duo-purple",
    alt: "A glowing purple planet with orbital rings against a starfield.",
  },
  {
    id: "vertex",
    index: "02",
    category: "WEB / APP BUILD",
    title: "Vertex UI",
    description:
      "Interface architecture with precision — dark metal, indigo signal lights, and interaction patterns tuned for clarity under pressure.",
    tags: ["React", "UI engineering", "Dashboards"],
    image: portfolioImages.vertex,
    duo: "duo-periwinkle",
    alt: "A neon purple-to-blue signal waveform across a dark starfield.",
  },
  {
    id: "prism",
    index: "03",
    category: "DIGITAL MARKETING",
    title: "Prism Identity",
    description:
      "Campaign systems that refract attention — glass shards of color, sharp storytelling, and measurable growth across every channel.",
    tags: ["Campaigns", "Analytics", "Creative"],
    image: portfolioImages.prism,
    duo: "duo-lavender",
    alt: "Earth from orbit in deep indigo with a violet atmospheric glow.",
  },
] as const;

export const expertiseCards = [
  {
    icon: "terminal",
    index: "01",
    title: "Software Engineering",
    description:
      "Custom web apps, SaaS MVPs, internal tools and APIs — engineered for performance, iteration and clean handoff.",
    tags: ["React", "Node", "APIs", "Cloud"],
    tone: "bg-paper text-ink",
    accent: "bg-periwinkle text-ink",
  },
  {
    icon: "campaign",
    index: "02",
    title: "Digital Marketing",
    description:
      "Performance campaigns, SEO and analytics that turn attention into pipeline — measured, not guessed.",
    tags: ["SEO", "Paid", "Analytics", "Content"],
    tone: "bg-purple text-ink",
    accent: "bg-ink text-paper",
  },
  {
    icon: "draw",
    index: "03",
    title: "Brand & UI/UX",
    description:
      "Identity systems and interfaces designed together, so your product looks, feels and sounds like your brand.",
    tags: ["Identity", "UI/UX", "Guidelines"],
    tone: "bg-paper text-ink",
    accent: "bg-purple text-ink",
  },
  {
    icon: "auto_awesome",
    index: "04",
    title: "AI Automation",
    description:
      "Scoped LLM workflows with Claude or OpenAI that remove manual work — with clear ROI and a path to retainer.",
    tags: ["LLM", "Integrations", "Triage"],
    tone: "bg-lavender text-ink",
    accent: "bg-ink text-paper",
  },
] as const;
