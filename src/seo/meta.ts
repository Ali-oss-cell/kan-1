import { portfolioProjects } from "@/content";
import { articles, stories, storyByPath, type Story } from "@/content/stories";

export const SITE = "https://wearekan.com";
export const OG_IMAGE = `${SITE}/brand/og.png`;

const HOME_TITLE = "KAN | Software, Marketing & Brand Studio";
const HOME_DESCRIPTION =
  "KAN — a software, programming and digital marketing studio. We design, build and grow web apps, brands and automations. Your vision, our design — together, we can.";

export type PageHead = {
  title: string;
  description: string;
  canonical: string;
  ogType: "website" | "article";
  jsonLd: {
    "@context": "https://schema.org";
    "@graph": Record<string, unknown>[];
  };
};

const staticPages: Record<string, { title: string; description: string }> = {
  "/": { title: HOME_TITLE, description: HOME_DESCRIPTION },
  "/about": {
    title: "About | KAN",
    description:
      "KAN is a software, marketing, and brand studio led by founders K, A, and N. The studio builds products, identities, and campaigns as one team.",
  },
  "/services": {
    title: "Services | KAN",
    description:
      "Fixed-scope offers for brand, launch sites, web apps, growth marketing, and AI automation. Timeline and price are written down before the work starts.",
  },
  "/contact": {
    title: "Contact | KAN",
    description:
      "Tell KAN about your product, brand, or campaign. We respond within two business days — usually sooner.",
  },
  "/blog": {
    title: "Insights | KAN",
    description:
      "Notes from KAN on AI automation, web apps, brand strategy, marketing tools, and what a website costs.",
  },
  "/case-studies": {
    title: "Case studies | KAN",
    description:
      "Lumina Digital Core, Vertex UI, and Prism Identity — the three projects published on the KAN site, in their own words.",
  },
  "/process": {
    title: "Process | KAN",
    description:
      "Discover, Strategize, Design and Build, Launch and Grow. Four steps, each with an output.",
  },
};

function canonicalFor(path: string): string {
  return path === "/" ? `${SITE}/` : `${SITE}${path}`;
}

function breadcrumb(parent: { href: string; label: string }, name: string, canonical: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: parent.label,
        item: canonicalFor(parent.href),
      },
      { "@type": "ListItem", position: 2, name, item: canonical },
    ],
  };
}

function faqNode(story: Story) {
  if (story.faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: story.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function graphForStory(story: Story, canonical: string): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  if (story.parent) nodes.push(breadcrumb(story.parent, story.title, canonical));
  const faq = faqNode(story);
  if (faq) nodes.push(faq);

  if (story.kind === "service") {
    nodes.push({
      "@type": "Service",
      name: story.title,
      description: story.description,
      url: canonical,
      areaServed: "AE",
      provider: { "@type": "Organization", name: "KAN", url: SITE },
    });
  } else if (story.kind === "article") {
    nodes.push({
      "@type": "Article",
      headline: story.title,
      description: story.description,
      datePublished: story.updated,
      dateModified: story.updated,
      author: { "@type": "Organization", name: "KAN", url: `${SITE}/about` },
      publisher: {
        "@type": "Organization",
        name: "KAN",
        url: SITE,
        logo: { "@type": "ImageObject", url: `${SITE}/brand/logo-dark.png` },
      },
      image: OG_IMAGE,
      mainEntityOfPage: canonical,
    });
  } else {
    nodes.push({
      "@type": "WebPage",
      name: story.documentTitle,
      description: story.description,
      url: canonical,
    });
  }

  return nodes;
}

function graphForStatic(path: string, title: string, description: string, canonical: string) {
  if (path === "/") {
    return [
      {
        "@type": "Organization",
        name: "KAN",
        url: SITE,
        email: "info@kan.com",
        logo: `${SITE}/brand/logo-dark.png`,
        description: HOME_DESCRIPTION,
        areaServed: "AE",
      },
      { "@type": "WebSite", name: "KAN", url: SITE, description: HOME_DESCRIPTION },
    ];
  }

  const nodes: Record<string, unknown>[] = [
    { "@type": "WebPage", name: title, description, url: canonical },
  ];

  if (path === "/blog") {
    nodes.push({
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: canonicalFor(article.path),
      })),
    });
  }

  if (path === "/case-studies") {
    nodes.push({
      "@type": "ItemList",
      itemListElement: portfolioProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        description: project.description,
        url: `${canonical}#${project.id}`,
      })),
    });
  }

  if (path !== "/blog" && path !== "/case-studies") {
    nodes.push(
      breadcrumb({ href: "/", label: "Home" }, title.replace(/ \| KAN$/, ""), canonical),
    );
  }

  return nodes;
}

export function headFor(pathname: string): PageHead {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname || "/";
  const story = storyByPath(path);
  const canonical = canonicalFor(path);

  if (story) {
    return {
      title: story.documentTitle,
      description: story.description,
      canonical,
      ogType: story.kind === "article" ? "article" : "website",
      jsonLd: { "@context": "https://schema.org", "@graph": graphForStory(story, canonical) },
    };
  }

  const page = staticPages[path];
  if (!page) {
    return {
      title: "Page not found | KAN",
      description: "That page is not on the KAN site.",
      canonical: `${SITE}/`,
      ogType: "website",
      jsonLd: { "@context": "https://schema.org", "@graph": [] },
    };
  }

  return {
    title: page.title,
    description: page.description,
    canonical,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": graphForStatic(path, page.title, page.description, canonical),
    },
  };
}

export const publicPaths = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/blog",
  "/case-studies",
  "/process",
  ...stories.map((story) => story.path),
].filter((path) => !path.startsWith("/k7n"));
