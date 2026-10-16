export const projectImages = {
  lumina:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHiLhao1rJ2pr02YqelF6CvmgI3hdz0qgmtU7UZmlJHRnzQU1Y9zeHki1iPP581Z3l2KZ2RT9sbTSFMrY-V4PqOh4_fzuDptkNuQ0dh8NHzYdNSSjbB0UxsHuJ__pggXyjoc-e8JnxSIRnRsEiENOFpMQHjLbU2hMzmEOxEM6HwIk_WCS2YbfxvycaoRGlKtS9Xjhiw1NANVN5qtWx_L00fKB-nlty0kVfMWkFBOnniRnHVUNBr6DLBBA-BVXbP8PVpdCJWcxklv0g",
  vertex:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyVo87-zsFgoyBjTBkkkyuFP-Ii0NI7JUlUwNxByPWs8NHOsyQagZrtSjCxKsWYMm3zScVRRQ7h__5IJwaIyS35eLCZ6oArrU9ZpVyCleqTFwu3PLVQC8t5UtXQY2QHyf4PuwncR8JBSrYXb1OoTdVpqrP8va7OmsfES3mFs6Q0JZRYfLDyzAYVFkKeJL5MtJl1I1SI2SMjvjunQGf8II3Sa_eYzTR_rkDBzTtEZ5JHgJVflIpMLefterICcRWbnVho0SAnbEXolOp",
  prism:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCWB9jtBqHOwnB_ti59LH2U-r0I6CXsZ2BnsFMr18ANaso0Cmke3TBn8q_XSKpTUUmL5jGghr9npS8SDsNIps-OnfB9oX2CouCE4GA3LCzvlQATRtc9goSdlSRKIvu50orh8j2ywtZ34HMy2JPy04A63l3lEfmmwMrKHymzHYOnAs67N2H80oQ33OTWOvPkbyRvgLqmT4ag8xSvaxdHcPBuQJb1sJz2P-yViR0Ke-nrG_-OWbfmt2qjatOZmg6bkvFIUZy0aWH6puMx",
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
    image: projectImages.lumina,
    duo: "duo-purple",
    alt: "A high-fidelity 3D digital sculpture featuring flowing pearlescent ribbons and intricate crystalline textures.",
  },
  {
    id: "vertex",
    index: "02",
    category: "WEB / APP BUILD",
    title: "Vertex UI",
    description:
      "Interface architecture with precision — dark metal, indigo signal lights, and interaction patterns tuned for clarity under pressure.",
    tags: ["React", "UI engineering", "Dashboards"],
    image: projectImages.vertex,
    duo: "duo-periwinkle",
    alt: "A macro shot of a sleek, dark metallic hardware interface with glowing neon indigo light indicators.",
  },
  {
    id: "prism",
    index: "03",
    category: "DIGITAL MARKETING",
    title: "Prism Identity",
    description:
      "Campaign systems that refract attention — glass shards of color, sharp storytelling, and measurable growth across every channel.",
    tags: ["Campaigns", "Analytics", "Creative"],
    image: projectImages.prism,
    duo: "duo-lavender",
    alt: "A minimalist abstract render of floating glass shards reflecting a vibrant spectrum of colors.",
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
