export type StoryKind = "service" | "audience" | "article" | "faq";

export type StorySection = {
  heading: string;
  paragraphs: string[];
};

export type StoryFaq = {
  question: string;
  answer: string;
};

export type StoryLink = {
  href: string;
  label: string;
};

export type Story = {
  path: string;
  kind: StoryKind;
  index: string;
  eyebrow: string;
  title: string;
  documentTitle: string;
  description: string;
  lead: string;
  updated: string;
  tone: "periwinkle" | "purple" | "lavender";
  parent?: StoryLink;
  sections: StorySection[];
  faqs: StoryFaq[];
  related: StoryLink[];
};

const updated = "2026-10-24";

export const stories: Story[] = [
  {
    path: "/services/web-app-development",
    kind: "service",
    index: "01",
    eyebrow: "Software",
    title: "Web and app development",
    documentTitle: "Web and app development in the UAE | KAN",
    description:
      "KAN builds marketing sites and web apps for companies in the UAE. A launch site takes 2–3 weeks. A custom web or app build takes 6–12 weeks.",
    lead: "KAN designs and builds marketing sites, web apps, and internal tools. A Launch Site is a 5–7 page site in 2–3 weeks, from $4,000 to $8,000. A Web/App Build is scoped product engineering in 6–12 weeks, from $8,000 to $30,000. Both include the interface, the code, and a handoff.",
    updated,
    tone: "periwinkle",
    parent: { href: "/services", label: "Services" },
    sections: [
      {
        heading: "What a launch site includes",
        paragraphs: [
          "A Launch Site is a marketing site of about five to seven pages. The published scope covers professional copy, SEO foundations, analytics, and lead forms, then a founder handoff. It is the right shape when the company needs a credible public site and does not yet need accounts, billing, or a custom database.",
          "The site is built by the same studio that handles brand and marketing, so the pages, the offer, and the next campaign can share one structure. Search foundations here mean a clear page title, a description, headings that match the offer, and analytics so you can see what people do after they arrive.",
        ],
      },
      {
        heading: "What a web or app build includes",
        paragraphs: [
          "A Web/App Build is for a brochure app, a SaaS MVP, or an internal tool. The published scope covers frontend, backend, auth, deploy, and 30-day support. The timeline is 6–12 weeks. The investment range published on the services page is $8,000–$30,000, because auth, roles, and integrations change the size of the work.",
          "We write a scope before the build starts. You see the timeline and the price before engineering begins. After launch, the 30-day support window is for fixes against that scope, not an open-ended feature list.",
        ],
      },
      {
        heading: "How a project starts",
        paragraphs: [
          "Work starts with Discover: goals, users, and constraints, written down as a brief and a scope. Strategize turns that into a roadmap and a stack. Design and build then run together, so the interface that was drawn is the interface that ships.",
          "Companies in the United Arab Emirates can start with a call and a written brief. Teams elsewhere work with us remotely in the same sequence. We reply within two business days.",
        ],
      },
      {
        heading: "When to choose the bundle instead",
        paragraphs: [
          "If you need a new identity and a new site at the same time, the Brand + Launch Bundle runs those two offers in parallel. The published timeline is 4–5 weeks, and the published investment is $6,500–$12,000. One team owns the visual system and the site, and they launch together.",
          "Choose a Web/App Build when the product itself is the work: logins, data, and a path you will keep changing. Choose a Launch Site when the public pages are the work.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "A KAN Launch Site takes 2–3 weeks. A Web/App Build takes 6–12 weeks. The Brand + Launch Bundle takes 4–5 weeks. The range depends on pages, accounts, and integrations, which we write into the scope first.",
      },
      {
        question: "Do you build for companies in the UAE?",
        answer:
          "Yes. KAN works with companies in the United Arab Emirates and with teams that collaborate remotely. The studio is led by founders K, A, and N.",
      },
      {
        question: "Can you work on an existing product?",
        answer:
          "Yes, when the scope is clear. We start from the current product, the goal, and the constraints, then agree what will change. We do not quote a rebuild from a logo file alone.",
      },
      {
        question: "What is included after launch?",
        answer:
          "A Web/App Build includes 30-day support. A Launch Site includes the handoff: the site, the analytics, and the pages we agreed. Ongoing marketing is a separate Growth Marketing engagement.",
      },
    ],
    related: [
      { href: "/services/brand-identity", label: "Brand identity" },
      { href: "/blog/how-to-build-a-web-app-from-scratch", label: "How a web app gets built" },
      { href: "/blog/how-much-does-a-website-cost-in-uae", label: "Website cost in the UAE" },
    ],
  },
  {
    path: "/services/digital-marketing",
    kind: "service",
    index: "02",
    eyebrow: "Marketing",
    title: "Digital marketing",
    documentTitle: "Digital marketing for UAE companies | KAN",
    description:
      "KAN runs SEO, paid campaigns, content, and reporting for companies in the UAE. Marketing sits with the same team that built the site or product.",
    lead: "Digital marketing at KAN is an ongoing engagement: SEO, paid campaigns, content, and reporting. It is run by the team that can also build the site, so the page and the campaign describe the same offer. Growth Marketing is quoted for the work, not sold as a fixed package price.",
    updated,
    tone: "purple",
    parent: { href: "/services", label: "Services" },
    sections: [
      {
        heading: "What the work covers",
        paragraphs: [
          "The published capabilities are SEO, paid media, content, and reporting. SEO starts from the pages you already have: titles, headings, internal links, and a sitemap. Paid media is scoped around an offer and a landing page. Content is written for that offer, not as a pile of unrelated posts.",
          "Reporting tells you what was published, what was spent, and what happened next. We do not invent performance numbers for a pitch. The first report uses the analytics on the site.",
        ],
      },
      {
        heading: "Why it sits next to the product",
        paragraphs: [
          "A campaign that points at a slow or unclear page wastes the spend. KAN builds the page and the campaign in one studio, so a change to the offer can change the site, the ad, and the email together.",
          "If the site does not exist yet, start with a Launch Site or the Brand + Launch Bundle, then move into Growth Marketing. Marketing a page that cannot explain the product is the longer path.",
        ],
      },
      {
        heading: "How an engagement is scoped",
        paragraphs: [
          "Growth Marketing is listed as a custom quote because the channels are not the same for every company. A founder who needs search foundations and a monthly page is a different scope from a company running paid media across two markets.",
          "We write the channels, the cadence, and the report into the scope before the month starts. Companies in the UAE can brief us on the market they sell in. The work can include Arabic or English pages when that is part of the scope.",
        ],
      },
      {
        heading: "What we will not pretend to know",
        paragraphs: [
          "We will not promise a ranking, a cost per lead, or a revenue figure before there is an account history to read. The first weeks are for the foundation: tracking, the offer, and the pages.",
          "If a channel is a poor fit, we say so. A local service business and a software product do not need the same mix.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is digital marketing a monthly retainer?",
        answer:
          "It can be. Growth Marketing is an ongoing engagement and the price is a custom quote. The scope names the channels and the reporting cadence.",
      },
      {
        question: "Do you need to have built the website?",
        answer:
          "No. We can market a site that already exists. The work is cleaner when we can also change the page the campaign points to.",
      },
      {
        question: "Do you work with UAE companies?",
        answer:
          "Yes. The service pages and this studio are set up for companies in the United Arab Emirates, and for remote teams.",
      },
      {
        question: "What do you report?",
        answer:
          "What was shipped, what was spent, and what the analytics show. We use the tracking installed on the site. We do not add numbers that the account does not contain.",
      },
    ],
    related: [
      { href: "/services/growth-strategy", label: "Growth strategy" },
      { href: "/blog/marketing-automation-tools-comparison", label: "Marketing tools, compared" },
      { href: "/services/web-app-development", label: "Web and app development" },
    ],
  },
  {
    path: "/services/brand-identity",
    kind: "service",
    index: "03",
    eyebrow: "Brand",
    title: "Brand identity",
    documentTitle: "Brand identity for startups and companies | KAN",
    description:
      "A KAN Brand Sprint is a fixed identity system in two weeks: logo, visual language, guidelines, and a positioning statement. The published range is $3,000–$6,000.",
    lead: "A Brand Sprint is a fixed-scope identity system in two weeks. You leave with a logo, a visual language, brand guidelines, and a positioning statement founders can use immediately. The published investment is $3,000–$6,000.",
    updated,
    tone: "lavender",
    parent: { href: "/services", label: "Services" },
    sections: [
      {
        heading: "What you receive",
        paragraphs: [
          "The sprint covers four deliverables: logo, identity, guidelines, and positioning. The guidelines are there so a later site, deck, or ad can be made without guessing the colours, the type, or the way the name is written.",
          "Positioning is a statement of who the product is for and what it claims. It is short on purpose. Campaigns and page headlines hang off it.",
        ],
      },
      {
        heading: "Who it is for",
        paragraphs: [
          "It fits a startup that is about to launch and does not yet have a system, and an established company that has outgrown a logo file with no rules. KAN’s founders are K, A, and N. The studio treats brand and product as one job when you want both.",
          "If the site has to launch with the identity, use the Brand + Launch Bundle. That offer runs the sprint and a Launch Site in parallel over 4–5 weeks, at $6,500–$12,000.",
        ],
      },
      {
        heading: "How the two weeks run",
        paragraphs: [
          "The first days are for the brief: the audience, the competitors you actually meet, and the constraints. Then we set a direction and apply it to the logo, the colours, and the type. The last part is the guideline, so the system can be used without us in the room.",
          "You will see the work in progress. A sprint is not a reveal with no conversation. Comments land in the two weeks, not in a third month of revision.",
        ],
      },
      {
        heading: "What this is not",
        paragraphs: [
          "A Brand Sprint is not a rename of the company, a trademark search, or a full packaging line for a physical product, unless we add that to the scope in writing. It is also not a website. The site is a Launch Site or a Web/App Build.",
          "We do not invent a founding story. The public story of KAN stays with the three founders. Your brand gets the same treatment: only claims you can stand behind.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long is a brand project?",
        answer:
          "A Brand Sprint is two weeks. The Brand + Launch Bundle, which adds the marketing site, is 4–5 weeks.",
      },
      {
        question: "What does it cost?",
        answer:
          "The published range for a Brand Sprint is $3,000–$6,000. The bundle is $6,500–$12,000. A quote outside that range means the scope is different, and we write that down first.",
      },
      {
        question: "Can you apply the identity to a site?",
        answer:
          "Yes. That is the Brand + Launch Bundle, or a Launch Site after the sprint. The same team builds both.",
      },
      {
        question: "Do you design for companies in the UAE?",
        answer:
          "Yes. We take briefs from companies in the United Arab Emirates and from remote teams.",
      },
    ],
    related: [
      { href: "/blog/brand-strategy-guide-for-startups", label: "Brand strategy for startups" },
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/case-studies", label: "Lumina, Vertex, and Prism" },
    ],
  },
  {
    path: "/services/ai-automation",
    kind: "service",
    index: "04",
    eyebrow: "Automation",
    title: "AI automation",
    documentTitle: "AI automation for business | KAN",
    description:
      "KAN’s AI Automation Pilot automates one workflow in 2–4 weeks, from $2,000 to $4,000. Typical work is lead qualification, support triage, content drafting, or data processing.",
    lead: "An AI Automation Pilot automates one workflow. The published examples are lead qualification, support triage, content drafting, and data processing, using Claude or OpenAI. The timeline is 2–4 weeks. The published investment is $2,000–$4,000. A retainer is a later step, not the start.",
    updated,
    tone: "lavender",
    parent: { href: "/services", label: "Services" },
    sections: [
      {
        heading: "One workflow, on purpose",
        paragraphs: [
          "The pilot is one path through the business: a lead comes in, a ticket arrives, a draft is requested, or a file needs sorting. We map that path, decide what the model may do, and decide what a person still approves.",
          "A pilot that tries to automate the whole company in a month does not finish. The scope names the trigger, the inputs, the output, and the person who checks the result.",
        ],
      },
      {
        heading: "What gets built",
        paragraphs: [
          "The published capabilities are LLM workflows, integrations, triage, and monitoring. An integration might be the inbox, the form on the site, or a sheet the team already uses. Monitoring is there so you can see when the workflow fails, not only when it was demonstrated.",
          "We do not train a private model as part of the pilot. The pilot uses Claude or OpenAI on the workflow we scoped. If the data cannot leave your account, that constraint goes in the brief before we start.",
        ],
      },
      {
        heading: "Where it helps a UAE company",
        paragraphs: [
          "The useful cases are ordinary: a clinic sorting appointment requests, a brokerage sending listing enquiries to the right person, a shop tagging the questions that need a human. The pilot is the same shape in each case. The words and the system change.",
          "KAN can also build the page or the product the workflow sits on. A form that captures the right fields makes the automation smaller. That site work is a Launch Site or a Web/App Build, quoted separately.",
        ],
      },
      {
        heading: "After the pilot",
        paragraphs: [
          "If the workflow is worth keeping, we talk about a retainer for monitoring and the next workflow. If it is not, you still have the map of the process and a working version of the one we built.",
          "We will not attach a savings figure to a pilot that has not run. The brief can name the time the task takes today. The report after the pilot can compare that with what actually happened.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is an AI automation pilot?",
        answer:
          "It is one scoped workflow, automated in 2–4 weeks, using Claude or OpenAI. The published price range is $2,000–$4,000. Examples are lead qualification, support triage, content drafting, and data processing.",
      },
      {
        question: "Will this replace my team?",
        answer:
          "No. The pilot moves a defined task. A person still owns the exceptions. We write that line into the scope.",
      },
      {
        question: "Can you connect it to our website?",
        answer:
          "Yes, when the site can send or receive the data. If the site needs new fields or a new form, that can be part of a separate build.",
      },
      {
        question: "Do you work with businesses in the UAE?",
        answer:
          "Yes. The pilot is available to companies in the United Arab Emirates and to remote teams.",
      },
    ],
    related: [
      { href: "/blog/what-is-ai-automation-for-business", label: "What AI automation is" },
      { href: "/for/startups", label: "For startups" },
      { href: "/services/digital-marketing", label: "Digital marketing" },
    ],
  },
  {
    path: "/services/growth-strategy",
    kind: "service",
    index: "05",
    eyebrow: "Growth",
    title: "Growth strategy",
    documentTitle: "Growth strategy for product and marketing | KAN",
    description:
      "KAN’s growth work ties positioning, the site, and the channels into one roadmap. Discover and Strategize come before campaigns and feature lists.",
    lead: "Growth strategy at KAN is the roadmap before the campaign spend and before the extra features. We write who the product is for, what the site must say, and which channel is first. Then engineering and marketing pull from the same page.",
    updated,
    tone: "purple",
    parent: { href: "/services", label: "Services" },
    sections: [
      {
        heading: "What the strategy names",
        paragraphs: [
          "The strategy names the audience, the offer, the page that explains it, and the first channel. It is the Strategize step in our process: architecture, positioning, and a roadmap. The output of that step is a roadmap and a stack, not a slide that cannot be built.",
          "If the identity is missing, the roadmap points at a Brand Sprint. If the site is missing, it points at a Launch Site or a Web/App Build. If the pages exist and the offer is clear, it points at Growth Marketing.",
        ],
      },
      {
        heading: "How this differs from a campaign",
        paragraphs: [
          "A campaign is a month of SEO, paid media, content, and reporting. Strategy decides whether that month should exist, and what it is allowed to say. Running ads to a page that contradicts the product is a strategy problem, not a media problem.",
          "We keep the two offers separate so you can buy the roadmap without buying a retainer, and buy the retainer when the roadmap is already clear.",
        ],
      },
      {
        heading: "What we use, and what we skip",
        paragraphs: [
          "We use the brief, the current site, and any analytics you already have. We do not buy a market-size number to decorate the document. If a figure is not in your account or in a source you accept, it does not go in the plan.",
          "For companies in the UAE, the plan can say which city, which language, and which kind of buyer the first page is for. That is more useful than a generic regional claim.",
        ],
      },
      {
        heading: "What you leave with",
        paragraphs: [
          "You leave with a written roadmap: the next build, the next page, and the next channel, in order. Each item has an owner. The four-step process still applies after that: discover, strategize, design and build, launch and grow.",
          "The roadmap is allowed to be short. A startup with one offer does not need a forty-page plan. It needs the next true step.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is growth strategy the same as Growth Marketing?",
        answer:
          "No. Strategy is the roadmap. Growth Marketing is the ongoing work: SEO, paid media, content, and reporting, quoted separately.",
      },
      {
        question: "Do I need a new website first?",
        answer:
          "Only if the current site cannot carry the offer. The strategy says which of those is true before anyone redesigns a page.",
      },
      {
        question: "Can this cover a launch in the UAE?",
        answer:
          "Yes. The roadmap can be written for a company selling in the United Arab Emirates, including the language and the buyer the first page should address.",
      },
      {
        question: "How does a strategy project start?",
        answer:
          "With Discover. We listen to the goal, the user, and the constraints, and we write a brief before we propose a channel.",
      },
    ],
    related: [
      { href: "/process", label: "The four-step process" },
      { href: "/services/digital-marketing", label: "Digital marketing" },
      { href: "/for/startups", label: "For startups" },
    ],
  },
  {
    path: "/for/startups",
    kind: "audience",
    index: "01",
    eyebrow: "Startups",
    title: "For startups",
    documentTitle: "Product, brand, and launch for startups | KAN",
    description:
      "KAN helps startups ship a first identity, a launch site, or a web app. Fixed scopes name the timeline and the price before the work starts.",
    lead: "Startups come to KAN for a first product, a first identity, or both. The offers are fixed in scope: a Brand Sprint in two weeks, a Launch Site in 2–3 weeks, a Brand + Launch Bundle in 4–5 weeks, or a Web/App Build in 6–12 weeks.",
    updated,
    tone: "periwinkle",
    parent: { href: "/", label: "Home" },
    sections: [
      {
        heading: "The first public version",
        paragraphs: [
          "A startup usually needs one of three things: a name and a visual system, a site that can take a lead, or a product someone can log into. Those are three different offers. Mixing them into one open brief is how timelines slip.",
          "If you need the identity and the site together, the bundle is the offer written for that case. One team, one visual system, one launch.",
        ],
      },
      {
        heading: "What we ask in the first call",
        paragraphs: [
          "Who the product is for, what they can do today, and what must be true on launch day. We also ask what is out of scope. A demo for investors is a smaller build than a product that takes payment.",
          "The published Web/App Build range is $8,000–$30,000 because those two products are not the same size. The scope says which one you are buying.",
        ],
      },
      {
        heading: "After the launch",
        paragraphs: [
          "A Web/App Build includes 30 days of support. Marketing after that is Growth Marketing, quoted from the channels you actually need. An AI Automation Pilot can take one repetitive task, such as qualifying the leads the new site collects, in 2–4 weeks.",
          "We stay with founders past launch when the work continues. The public story of this studio is still three founders: K, A, and N.",
        ],
      },
    ],
    faqs: [
      {
        question: "We only have a deck. Can you start?",
        answer:
          "Yes. Discover turns the deck into a brief and a scope. We do not start design or code from a slide alone.",
      },
      {
        question: "Can you work with a startup in the UAE?",
        answer:
          "Yes. We take startup briefs from the United Arab Emirates and from founders working remotely.",
      },
      {
        question: "Do you take equity instead of a fee?",
        answer:
          "The published offers are fee-based. A different commercial structure would be a separate written agreement, not the default.",
      },
    ],
    related: [
      { href: "/services/brand-identity", label: "Brand identity" },
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/blog/brand-strategy-guide-for-startups", label: "Brand strategy guide" },
    ],
  },
  {
    path: "/for/ecommerce",
    kind: "audience",
    index: "02",
    eyebrow: "Ecommerce",
    title: "For ecommerce",
    documentTitle: "Sites and marketing for ecommerce brands | KAN",
    description:
      "KAN builds the brand, the marketing site, and the campaigns around an online shop. Catalogue work is scoped separately from a 5–7 page launch site.",
    lead: "Ecommerce brands use KAN for the story around the shop: the identity, the marketing site, and the campaigns. A 5–7 page Launch Site can present the brand and send people to buy. A full catalogue, checkout, and inventory system is a Web/App Build with its own scope.",
    updated,
    tone: "purple",
    parent: { href: "/", label: "Home" },
    sections: [
      {
        heading: "Site, then shop",
        paragraphs: [
          "Many brands already have a shop and need a clearer front door. That front door is often a Launch Site: the collection story, the offer, SEO foundations, analytics, and a lead or wholesale form. The shop stays where it is.",
          "If the shop itself has to be built, say so in the brief. Product pages, payments, and shipping rules change the timeline. We will not price that as a five-page marketing site.",
        ],
      },
      {
        heading: "Brand before the ads",
        paragraphs: [
          "Paid traffic to a page with no point of view is expensive. A Brand Sprint gives you the logo, the visual language, the guidelines, and the positioning the ads have to repeat. The sprint is two weeks, at $3,000–$6,000.",
          "Growth Marketing can then run SEO, paid media, content, and reporting against that system. The price is a quote, because a single market and a multi-country catalogue are not the same month of work.",
        ],
      },
      {
        heading: "Questions we can automate",
        paragraphs: [
          "Order-status questions and wholesale enquiries are a common AI Automation Pilot: one inbox, one set of rules, a person for the exceptions. The pilot is 2–4 weeks, at $2,000–$4,000.",
          "We do not connect a model to customer data until the brief says where that data lives and who may see it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you rebuild Shopify or another shop?",
        answer:
          "Only when the scope says so. A Launch Site can sit in front of an existing shop. Replacing checkout is a Web/App Build and is estimated on its own.",
      },
      {
        question: "Can you market a store in the UAE?",
        answer:
          "Yes. The campaign scope can name the United Arab Emirates as the market, including the language of the page and the ads.",
      },
      {
        question: "What should we prepare?",
        answer:
          "The products you actually sell, the offer, and access to the current shop and analytics. We write the scope from those, not from a moodboard alone.",
      },
    ],
    related: [
      { href: "/services/digital-marketing", label: "Digital marketing" },
      { href: "/services/brand-identity", label: "Brand identity" },
      { href: "/services/web-app-development", label: "Web and app development" },
    ],
  },
  {
    path: "/for/real-estate",
    kind: "audience",
    index: "03",
    eyebrow: "Real estate",
    title: "For real estate",
    documentTitle: "Websites and lead flows for real estate | KAN",
    description:
      "KAN builds project sites, listing inquiry flows, and the brand around a real estate launch. Lead handling can be a separate automation pilot.",
    lead: "Real estate teams use KAN for a project site, a brokerage site, or the identity of a new development. A Launch Site carries the story, the gallery, and the inquiry form. A Web/App Build is the right offer when listings, accounts, or a private client area are part of the scope.",
    updated,
    tone: "lavender",
    parent: { href: "/", label: "Home" },
    sections: [
      {
        heading: "A project launch",
        paragraphs: [
          "A development launch is usually a fixed set of pages: the place, the plan, the offer, and a way to ask for a call. That fits a Launch Site when the page count stays in the published 5–7 page range. A larger gallery, a unit chooser, or a multi-language set of pages is written into the scope before we quote.",
          "The Brand + Launch Bundle fits a new development that also needs the name, the logo, and the guidelines. Identity and site then ship together.",
        ],
      },
      {
        heading: "Inquiries",
        paragraphs: [
          "The form should ask for the listing or the project, the question, and how to reply. An AI Automation Pilot can sort those inquiries and draft a first reply for a person to send. It does not replace the broker.",
          "We do not publish lead counts or conversion rates for this industry. Your own analytics, after the site is live, are the numbers we will use.",
        ],
      },
      {
        heading: "What we need from you",
        paragraphs: [
          "The facts of the property or the project, the images you have the right to use, and the person who answers a serious inquiry. We will not write a location claim you cannot support.",
          "Companies marketing property in the UAE can brief us in that market. The page can be written for the buyer you named, in the language the scope includes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you build a listing portal?",
        answer:
          "A portal with search, accounts, or saved listings is a Web/App Build, estimated at 6–12 weeks inside the published $8,000–$30,000 range when it fits that scope. A single project site is often a Launch Site.",
      },
      {
        question: "Do you write the listing copy?",
        answer:
          "A Launch Site includes professional copy for the pages in scope. You still supply the facts: unit, price if you want it public, and location.",
      },
      {
        question: "Can leads go to more than one agent?",
        answer:
          "Yes, if the rule is simple enough to write down. That routing can be part of an automation pilot or part of the site build, depending on where the rule lives.",
      },
    ],
    related: [
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/services/ai-automation", label: "AI automation" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    path: "/for/healthcare",
    kind: "audience",
    index: "04",
    eyebrow: "Healthcare",
    title: "For healthcare",
    documentTitle: "Websites and inquiry flows for healthcare | KAN",
    description:
      "KAN builds marketing sites and inquiry flows for clinics and health brands. We do not provide medical advice, and clinical systems are scoped only with the client’s own compliance requirements.",
    lead: "Clinics and health brands use KAN for a public site, a brand system, and a careful inquiry flow. We do not provide medical advice. A clinical record system is not a marketing site, and we only take that kind of build when the scope includes your compliance requirements.",
    updated,
    tone: "periwinkle",
    parent: { href: "/", label: "Home" },
    sections: [
      {
        heading: "The public site",
        paragraphs: [
          "A clinic often needs services, practitioners, locations, and a way to ask for an appointment. When that fits five to seven pages, it is a Launch Site: copy, SEO foundations, analytics, and a form. More locations or a booking product changes the scope.",
          "The copy describes what you offer. It does not invent outcomes. If a sentence needs a clinician’s approval, that approval is part of the timeline.",
        ],
      },
      {
        heading: "Inquiries and triage",
        paragraphs: [
          "An AI Automation Pilot can sort appointment requests or repeated questions and hand the rest to a person. It is not a diagnostic tool. The scope says what the workflow may say, and what it must refuse.",
          "Patient data stays where you decide. If a message cannot be sent to a third-party model, we need that rule before the pilot starts. The pilot timeline is still 2–4 weeks when the workflow is one path.",
        ],
      },
      {
        heading: "Brand and trust",
        paragraphs: [
          "A Brand Sprint gives a clinic a logo, a visual language, guidelines, and a positioning statement. The statement should be something the clinic can say in public without stretching it.",
          "We will not add testimonials, recovery claims, or rankings you did not provide. The case studies on this site are Lumina, Vertex, and Prism, described only with the words already published there.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do you build electronic medical record systems?",
        answer:
          "Not as a standard offer. A marketing site and an inquiry form are a Launch Site or a scoped Web/App Build. A clinical system would need your compliance requirements in the scope before we agree to it.",
      },
      {
        question: "Can the site serve patients in the UAE?",
        answer:
          "Yes. The pages can be written for patients in the United Arab Emirates, in the languages the scope includes. You remain responsible for the medical claims.",
      },
      {
        question: "Will AI talk to patients?",
        answer:
          "Only inside a written rule set, and never as medical advice. A person handles the exceptions. If that line cannot be held, we do not automate the inbox.",
      },
    ],
    related: [
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/services/ai-automation", label: "AI automation" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    path: "/blog/what-is-ai-automation-for-business",
    kind: "article",
    index: "01",
    eyebrow: "Insights",
    title: "What is AI automation for a business?",
    documentTitle: "What is AI automation for a business? | KAN",
    description:
      "AI automation at KAN means one business workflow handled by a model, with a person for the exceptions. A pilot takes 2–4 weeks.",
    lead: "AI automation, in the way KAN practices it, is one repeated business task handed to a model with the rules written down. A person still sees the exceptions. It is not a new company strategy and it is not a chatbot pasted onto a homepage.",
    updated,
    tone: "lavender",
    parent: { href: "/blog", label: "Insights" },
    sections: [
      {
        heading: "A workflow, not a feature list",
        paragraphs: [
          "A workflow has a trigger, an input, an output, and an owner. A lead form is submitted. A support email arrives. A teammate asks for a first draft. A file needs to be labelled. Those are workflows. “Add AI” is not.",
          "The KAN pilot picks one of those paths. The published examples are lead qualification, support triage, content drafting, and data processing. The timeline is 2–4 weeks. The published range is $2,000–$4,000.",
        ],
      },
      {
        heading: "What the model is allowed to do",
        paragraphs: [
          "Before anyone connects an inbox, write three lists: what the model may answer, what it must pass to a person, and what it must not say. A clinic’s inbox and a software company’s inbox do not share the second list.",
          "The pilot uses Claude or OpenAI. We do not train a private model as part of that offer. If your data cannot be sent to those services, that is a constraint for the brief, and it may mean the pilot should not start.",
        ],
      },
      {
        heading: "How to tell if it worked",
        paragraphs: [
          "Count the task as it happens today: how many times a week, and how long a person spends. After the pilot, compare that with what the workflow actually did. A demo is not that comparison.",
          "If the numbers are not better, stop. The map of the process is still useful. A retainer is for a workflow that earned it, not a default next invoice.",
        ],
      },
      {
        heading: "Where it meets the rest of KAN",
        paragraphs: [
          "Automation is easier when the form asks the right questions. That form might live on a Launch Site or inside a Web/App Build. Marketing can then treat the qualified leads differently from the raw inbox. Those are separate offers, so the pilot stays small enough to finish.",
          "Companies in the UAE use the same shape. The language of the reply and the system it connects to are part of the scope. The shape does not change.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a website chatbot the same thing?",
        answer:
          "No. A chatbot that answers anything is a different, larger risk. A pilot answers one kind of request and refuses the rest.",
      },
      {
        question: "How long does a pilot take?",
        answer:
          "2–4 weeks for one workflow, at the published range of $2,000–$4,000.",
      },
    ],
    related: [
      { href: "/services/ai-automation", label: "AI automation" },
      { href: "/for/healthcare", label: "For healthcare" },
      { href: "/about", label: "About KAN" },
    ],
  },
  {
    path: "/blog/how-to-build-a-web-app-from-scratch",
    kind: "article",
    index: "02",
    eyebrow: "Insights",
    title: "How to build a web app from scratch",
    documentTitle: "How to build a web app from scratch | KAN",
    description:
      "KAN builds a web app in four steps: Discover, Strategize, Design and Build, Launch and Grow. A scoped build takes 6–12 weeks.",
    lead: "A web app built from scratch still follows a short sequence: write the brief, choose the stack, design and build the same thing, then launch and watch it. At KAN that sequence is four named steps, and a Web/App Build takes 6–12 weeks.",
    updated,
    tone: "periwinkle",
    parent: { href: "/blog", label: "Insights" },
    sections: [
      {
        heading: "Discover",
        paragraphs: [
          "Start with the user and the constraint, not the framework. Who signs in, what they must finish, and what is explicitly out of the first version. The output of this step is a brief and a scope.",
          "A marketing site and a web app part ways here. If nobody needs an account, you may want a Launch Site instead. That offer is 5–7 pages in 2–3 weeks, not a product.",
        ],
      },
      {
        heading: "Strategize",
        paragraphs: [
          "Technical clarity and the product story land in one roadmap. This is where the stack is chosen and the first release is cut down until it can ship. The output is a roadmap and a stack.",
          "The published investment for a Web/App Build is $8,000–$30,000. The brief decides where you sit in that range: a tight MVP is not a multi-role internal tool.",
        ],
      },
      {
        heading: "Design and build",
        paragraphs: [
          "Brand and interface, if they are in scope, move with the code. What is designed is what is built, because one team does both. Splitting the picture and the product across two vendors is how screens appear that cannot be engineered.",
          "Auth, the main screens, and deploy are in the published capability list, plus 30-day support after launch. Extra integrations are written in, or they wait.",
        ],
      },
      {
        heading: "Launch and grow",
        paragraphs: [
          "Launch means the app is deployed, someone outside the team can use it, and analytics exist. The 30-day window is for defects against the scope. New ideas go on the roadmap.",
          "Growth after that might be a marketing engagement or a second build. It is a new scope. Companies in the UAE and remote teams follow this same sequence.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I start without a designer?",
        answer:
          "Yes. KAN designs and builds in the same team. If you already have an identity, the build uses it.",
      },
      {
        question: "What do I receive at the end?",
        answer:
          "A working product against the written scope, deployed, with 30 days of support on a Web/App Build.",
      },
    ],
    related: [
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/process", label: "The process" },
      { href: "/blog/how-much-does-a-website-cost-in-uae", label: "What a site costs" },
    ],
  },
  {
    path: "/blog/brand-strategy-guide-for-startups",
    kind: "article",
    index: "03",
    eyebrow: "Insights",
    title: "A brand strategy guide for startups",
    documentTitle: "Brand strategy guide for startups | KAN",
    description:
      "Startup brand strategy at KAN is a positioning statement, a visual system, and guidelines a founder can use. A Brand Sprint takes two weeks.",
    lead: "Brand strategy for a startup is a decision about who the product is for and how it will look and sound when you are not in the room. KAN packs that decision into a two-week Brand Sprint: logo, identity, guidelines, and a positioning statement.",
    updated,
    tone: "purple",
    parent: { href: "/blog", label: "Insights" },
    sections: [
      {
        heading: "Write the positioning before the logo",
        paragraphs: [
          "Positioning is one statement: who it is for, and what you claim. If that sentence is still changing every day, a logo will not settle it. The sprint starts from the audience and the claim, then draws.",
          "Keep the sentence short enough to put on the homepage. A paragraph nobody can remember is not a strategy.",
        ],
      },
      {
        heading: "Make a system, not a file",
        paragraphs: [
          "A logo file without colours, type, and rules becomes five versions by the next campaign. The guidelines are the point of the sprint. They are what a later site, deck, or ad can follow.",
          "The published sprint is two weeks and $3,000–$6,000. If you also need the marketing site, the Brand + Launch Bundle is 4–5 weeks at $6,500–$12,000.",
        ],
      },
      {
        heading: "Use it on the first site",
        paragraphs: [
          "The first site should repeat the positioning, not invent a second one. A Launch Site is 5–7 pages with copy, SEO foundations, analytics, and a form. It is enough for a startup that needs to look real and take a conversation.",
          "A product with accounts is a different project. Do not hide a web app inside a brand sprint. Split the offers so each one can finish.",
        ],
      },
      {
        heading: "Leave out the fiction",
        paragraphs: [
          "Do not invent a customer count, a city you are not in, or a founder biography you would not say out loud. KAN’s own about page names the founders as K, A, and N and stops there. Your public pages can be just as plain.",
          "Strategy that depends on a made-up metric will have to be rewritten the first time a customer asks.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a brand before I talk to customers?",
        answer:
          "You need a true sentence about who it is for. The visual system can follow in a two-week sprint once that sentence is stable enough to design around.",
      },
      {
        question: "Can the brand and the site launch together?",
        answer:
          "Yes. That is the Brand + Launch Bundle: 4–5 weeks, $6,500–$12,000.",
      },
    ],
    related: [
      { href: "/services/brand-identity", label: "Brand identity" },
      { href: "/for/startups", label: "For startups" },
      { href: "/about", label: "About KAN" },
    ],
  },
  {
    path: "/blog/marketing-automation-tools-comparison",
    kind: "article",
    index: "04",
    eyebrow: "Insights",
    title: "Marketing tools, compared by the job",
    documentTitle: "Marketing automation tools comparison | KAN",
    description:
      "Compare marketing tools by the job they do: email, ads, analytics, and the site form. KAN connects them when the offer and the page are already clear.",
    lead: "A useful comparison of marketing tools starts from the job, not from a ranking. Email, ads, analytics, and the form on your site do different work. KAN picks and connects them after the offer and the page are clear.",
    updated,
    tone: "periwinkle",
    parent: { href: "/blog", label: "Insights" },
    sections: [
      {
        heading: "Compare the job, not the logo",
        paragraphs: [
          "Ask what the tool must do this month. Send a sequence to people who asked. Report what the site already collected. Pay to put one offer in front of a defined audience. Draft a first reply. Those are different jobs, and one subscription rarely does all of them well.",
          "We do not publish a winner. A tool that fits a shop with a list will not fit a studio that has no list yet. The comparison below is the questions we ask, not a scoreboard.",
        ],
      },
      {
        heading: "Email and the list",
        paragraphs: [
          "An email tool is worth it when people have asked to hear from you and you know what the next message is. Compare tools on whether you can export the list, whether the form on your site can subscribe a person, and whether a non-specialist can send the campaign.",
          "If you have no offer and no list, the tool will not create either. Write the page first. A Launch Site can include the form.",
        ],
      },
      {
        heading: "Ads, analytics, and the page",
        paragraphs: [
          "Paid media needs a page that matches the ad and analytics that record the visit. Compare ad accounts on whether you can see search terms or placements, and whether the spend can be capped. Compare analytics on whether you can see the page, the source, and the form submission without a second dashboard you will never open.",
          "KAN’s Growth Marketing offer covers SEO, paid media, content, and reporting as one quote. The tools sit inside that work. They are not the strategy.",
        ],
      },
      {
        heading: "Automation on top",
        paragraphs: [
          "Once a form or an inbox is real, a model can sort it. That is the AI Automation Pilot: one workflow, 2–4 weeks, $2,000–$4,000. Compare that with a marketing suite’s built-in automation by asking who watches the failures, and whether your data is allowed to leave the account.",
          "Companies in the UAE should also ask whether the tool and the page support the language they sell in. A tool that cannot store the reply you need is the wrong tool, whatever its brand.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which marketing tool should I buy first?",
        answer:
          "The one that matches the next job: a form and analytics if the site is new, email if people are already asking to hear from you, ads only when the page can explain the offer. KAN will not rank brands against each other without your account in front of us.",
      },
      {
        question: "Can KAN set the tools up?",
        answer:
          "Yes, inside a Growth Marketing quote or a build, when the scope names the tool and the account owner.",
      },
    ],
    related: [
      { href: "/services/digital-marketing", label: "Digital marketing" },
      { href: "/services/ai-automation", label: "AI automation" },
      { href: "/services/growth-strategy", label: "Growth strategy" },
    ],
  },
  {
    path: "/blog/how-much-does-a-website-cost-in-uae",
    kind: "article",
    index: "05",
    eyebrow: "Insights",
    title: "How much does a website cost in the UAE?",
    documentTitle: "How much does a website cost in the UAE? | KAN",
    description:
      "KAN’s published UAE-ready prices: a launch site is $4,000–$8,000 in 2–3 weeks. A web or app build is $8,000–$30,000 in 6–12 weeks. Brand sprints start at $3,000.",
    lead: "A website from KAN has a published range, not a single number. A Launch Site is $4,000–$8,000 and takes 2–3 weeks. A Web/App Build is $8,000–$30,000 and takes 6–12 weeks. A Brand Sprint, if you need the identity too, is $3,000–$6,000 in two weeks. These are the studio’s prices for companies in the UAE and for remote clients. They are not a national average.",
    updated,
    tone: "purple",
    parent: { href: "/blog", label: "Insights" },
    sections: [
      {
        heading: "The marketing site",
        paragraphs: [
          "The Launch Site is a 5–7 page marketing site with professional copy, SEO foundations, analytics, and lead forms, plus a founder handoff. Use it when the goal is a public site that explains the offer and collects a message.",
          "If the page count, the languages, or the photography grow past that, the price leaves this range. We rewrite the scope rather than quietly stretching the two weeks.",
        ],
      },
      {
        heading: "The product",
        paragraphs: [
          "Choose a Web/App Build when you need frontend, backend, auth, and a deployment. The published timeline is 6–12 weeks, with 30-day support. The $8,000–$30,000 range exists because a small product and a larger tool are both “a website” in conversation and not in the work.",
          "Payments, complex roles, and migrations are what push a quote upward. They should appear in the brief, not after the contract.",
        ],
      },
      {
        heading: "Brand and the bundle",
        paragraphs: [
          "A site without a visual system often stalls. The Brand Sprint is the two-week identity: logo, visual language, guidelines, and positioning, at $3,000–$6,000. The Brand + Launch Bundle runs that sprint beside the marketing site in 4–5 weeks, at $6,500–$12,000.",
          "Buying them together costs less than the top of both ranges added together. Buying them separately is right when you already have one of the two.",
        ],
      },
      {
        heading: "What these prices are not",
        paragraphs: [
          "They are not the average cost of a website in the UAE. Other studios price differently, and a quote from KAN can sit outside these ranges when the scope does. Growth Marketing is a custom quote. An AI Automation Pilot is a separate $2,000–$4,000 if you want one workflow automated after the site exists.",
          "The honest next step is a brief. Tell us the pages, the accounts, and the market, including whether you sell in the United Arab Emirates. We reply within two business days with a scope, not with a guessed average.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the cheapest KAN website?",
        answer:
          "The published floor for a Launch Site is $4,000. A Brand Sprint starts at $3,000 and does not include the site. A smaller page set than the published offer would be its own scope.",
      },
      {
        question: "Are these prices only for the UAE?",
        answer:
          "The same published ranges apply to companies in the United Arab Emirates and to remote clients. The market belongs in the brief because language and the offer change the scope, not because there is a second price list.",
      },
      {
        question: "Does the price include marketing?",
        answer:
          "No. SEO foundations and analytics on a Launch Site are part of that offer. Ongoing SEO, paid media, content, and reporting are Growth Marketing, quoted separately.",
      },
    ],
    related: [
      { href: "/services/web-app-development", label: "Web and app development" },
      { href: "/services", label: "All services" },
      { href: "/contact", label: "Ask for a scope" },
    ],
  },
  {
    path: "/faq",
    kind: "faq",
    index: "06",
    eyebrow: "FAQ",
    title: "Questions clients ask",
    documentTitle: "FAQ | KAN",
    description:
      "Answers about timelines, prices, who KAN is, and how a project starts. Prices and timelines match the offers published on the services page.",
    lead: "Straight answers about who we are, how a project starts, and what the published offers cost. If your question is not here, write to us. We reply within two business days.",
    updated,
    tone: "periwinkle",
    sections: [
      {
        heading: "Who you are hiring",
        paragraphs: [
          "KAN is a software, marketing, and brand studio. The name comes from the founders K, A, and N. You work with that studio, not with a rotating list of unnamed subcontractors presented as a large agency.",
          "The public site is the marketing site. Project files, invoices, and client logins live behind a separate sign-in and are not part of these pages.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do we start?",
        answer:
          "Send a note through the contact page or email info@kan.com. Tell us the product, the brand, or the campaign, and what done looks like. We reply within two business days with questions or a scope.",
      },
      {
        question: "What do the offers cost?",
        answer:
          "Brand Sprint: $3,000–$6,000 in two weeks. Launch Site: $4,000–$8,000 in 2–3 weeks. Web/App Build: $8,000–$30,000 in 6–12 weeks, with 30-day support. Brand + Launch Bundle: $6,500–$12,000 in 4–5 weeks. AI Automation Pilot: $2,000–$4,000 in 2–4 weeks. Growth Marketing is a custom quote.",
      },
      {
        question: "Do you work with companies in the UAE?",
        answer:
          "Yes. We take briefs from companies in the United Arab Emirates and from teams that work with us remotely.",
      },
      {
        question: "Who are the founders?",
        answer:
          "The founders are K, A, and N. The about page tells that story. We do not publish full names or portraits there.",
      },
      {
        question: "Can you show results from past clients?",
        answer:
          "The work shown on this site is Lumina Digital Core, Vertex UI, and Prism Identity, with the descriptions already published on those projects. We do not add performance figures that are not in that copy.",
      },
      {
        question: "Do you offer a monthly marketing service?",
        answer:
          "Yes. Growth Marketing covers SEO, paid media, content, and reporting. The price is quoted from the channels in the scope.",
      },
      {
        question: "What happens after launch?",
        answer:
          "A Web/App Build includes 30 days of support against the scope. Further build work or marketing is a new scope. The process page lists the four steps from discover to launch and grow.",
      },
    ],
    related: [
      { href: "/services", label: "Services" },
      { href: "/process", label: "Process" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const byPath = new Map(stories.map((story) => [story.path, story]));

export function storyByPath(pathname: string): Story | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return byPath.get(path);
}

export const serviceStories = stories.filter((story) => story.kind === "service");
export const audienceStories = stories.filter((story) => story.kind === "audience");
export const articles = stories.filter((story) => story.kind === "article");

export const moreSiteLinks: StoryLink[] = [
  ...serviceStories.map((story) => ({ href: story.path, label: story.title })),
  ...audienceStories.map((story) => ({ href: story.path, label: story.title })),
  { href: "/case-studies", label: "Case studies" },
  { href: "/process", label: "Process" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Insights" },
];
