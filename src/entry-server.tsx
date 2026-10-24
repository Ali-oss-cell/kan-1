import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { headFor, publicPaths } from "./seo/meta";

export function render(url: string) {
  const pathname = url.split("?")[0] || "/";
  if (pathname.startsWith("/k7n")) {
    throw new Error("Private routes are not prerendered.");
  }
  const html = renderToStaticMarkup(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  );
  return { html, head: headFor(pathname) };
}

export { publicPaths };
