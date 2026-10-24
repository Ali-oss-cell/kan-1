import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OG_IMAGE, headFor } from "@/seo/meta";

function setMeta(name: string, content: string, attribute: "name" | "property") {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Keeps the document head in step after a client-side navigation. */
export function SeoSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    const head = headFor(pathname);
    document.title = head.title;
    setMeta("description", head.description, "name");
    setMeta("og:title", head.title, "property");
    setMeta("og:description", head.description, "property");
    setMeta("og:url", head.canonical, "property");
    setMeta("og:type", head.ogType, "property");
    setMeta("og:image", OG_IMAGE, "property");
    setCanonical(head.canonical);

    let script = document.getElementById("kan-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "kan-jsonld";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(head.jsonLd);
  }, [pathname]);

  return null;
}
