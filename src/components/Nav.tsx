import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "@/hooks/useActiveSection";
import { MaterialIcon } from "./MaterialIcon";

const homeLinks = [
  { href: "/about", id: "about", label: "About" },
  { href: "/#work", id: "work", label: "Work" },
  { href: "/services", id: "services", label: "Services" },
  { href: "/#process", id: "process", label: "Process" },
  { href: "/contact", id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const { pathname } = useLocation();
  const onAbout = pathname.startsWith("/about");
  const onServices = pathname.startsWith("/services");
  const onContact = pathname.startsWith("/contact");
  const onStandalonePage = onAbout || onServices || onContact;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const isActive = (id: string) => {
    if (id === "about") return onAbout;
    if (id === "services") return onServices;
    if (id === "contact") return onContact;
    if (onStandalonePage) return false;
    return activeSection === id;
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled || onStandalonePage
            ? "border-outline-variant/20 bg-surface/90 shadow-md shadow-primary/5 backdrop-blur-xl"
            : "border-transparent bg-surface/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-margin-mobile md:h-24 md:px-margin-desktop">
          <Link
            to="/"
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            onClick={closeMobile}
          >
            <img
              src="/brand/logo-dark.png"
              alt="KAN Agency"
              className="h-8 w-auto md:h-10"
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {homeLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-active={isActive(link.id)}
                className={`link-underline py-1 font-label-caps text-label-caps ${
                  isActive(link.id)
                    ? "font-semibold text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary !px-8 !py-3">
              Let&apos;s Talk
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-primary transition-colors hover:bg-surface-container lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MaterialIcon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col justify-center gap-8 bg-surface px-margin-mobile shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
      >
        {homeLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={closeMobile}
            className={`font-headline-md text-headline-md uppercase tracking-tight transition-colors ${
              isActive(link.id) ? "text-brand-purple" : "text-primary"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/contact"
          onClick={closeMobile}
          className="btn-primary w-fit"
        >
          Let&apos;s Talk
        </Link>
      </div>
    </>
  );
}
