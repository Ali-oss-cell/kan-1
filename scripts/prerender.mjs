import { createServer } from "vite";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const templatePath = path.join(dist, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function apply(html, body, head) {
  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(head.title)}</title>`);
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeHtml(head.canonical)}" />`,
  );
  next = next.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${head.ogType}" />`,
  );
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeHtml(head.canonical)}" />`,
  );
  const json = JSON.stringify(head.jsonLd).replaceAll("<", "\\u003c");
  const script = `<script type="application/ld+json" id="kan-jsonld">${json}</script>`;
  if (next.includes('id="kan-jsonld"')) {
    next = next.replace(/<script type="application\/ld\+json" id="kan-jsonld">.*?<\/script>/s, script);
  } else {
    next = next.replace("</head>", `    ${script}\n  </head>`);
  }
  if (!next.includes('<div id="root">')) {
    throw new Error("Built index.html is missing #root");
  }
  next = next.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (!next.includes("<h1")) {
    throw new Error(`Prerender for ${head.canonical} did not include an H1`);
  }
  return next;
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

try {
  const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
  const paths = mod.publicPaths.filter((url) => !url.startsWith("/k7n"));
  for (const url of paths) {
    const { html, head } = mod.render(url);
    const page = apply(template, html, head);
    const dir = url === "/" ? dist : path.join(dist, url.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page);
  }

  const urls = paths
    .map((url) => {
      const loc = url === "/" ? "https://wearekan.com/" : `https://wearekan.com${url}`;
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);
  console.log(`Prerendered ${paths.length} public pages`);
} finally {
  await vite.close();
}
