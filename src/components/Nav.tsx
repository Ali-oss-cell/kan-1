import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveSection } from "@/hooks/useActiveSection";
import { MaterialIcon } from "./MaterialIcon";

const links = [
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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
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
      {/* Announcement strip */}
      <div className="on-dark border-b-3 border-ink bg-ink text-paper">
        <div className="container-site flex h-10 items-center justify-between gap-4">
          <p className="label flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 bg-lavender animate-blink"
              aria-hidden
            />
            Now booking new projects
          </p>
          <a
            href="mailto:hello@kanagency.design"
            className="label hidden text-paper/70 transition-colors hover:text-lavender sm:inline"
          >
            hello@kanagency.design
          </a>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className={`sticky top-0 z-50 border-b-3 border-ink bg-paper transition-shadow duration-200 ${
          scrolled ? "shadow-[0_6px_0_0_#0f0f0f]" : ""
        }`}
      >
        <div className="container-site flex h-20 items-center justify-between">
          <Link
            to="/"
            onClick={closeMobile}
            aria-label="KAN — home"
            className="flex shrink-0 items-center transition-transform duration-150 hover:-rotate-3"
          >
            <img
              src="/brand/logo-dark.png"
              alt="KAN Agency"
              width={56}
              height={48}
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {links.map((link) => {
              const active = isActive(link.id);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`label-lg flex h-10 items-center border-3 px-4 transition-colors duration-150 ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-transparent text-ink hover:border-ink hover:bg-lavender"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link to="/contact" className="btn btn-sm btn-periwinkle ml-4">
              Let&apos;s talk
              <MaterialIcon name="arrow_outward" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center border-3 border-ink bg-paper shadow-brutal-sm transition-transform duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MaterialIcon name={mobileOpen ? "close" : "menu"} aria-hidden />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[60] flex flex-col bg-paper transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b-3 border-ink px-6">
          <Link to="/" onClick={closeMobile} aria-label="KAN — home">
            <img
              src="/brand/logo-dark.png"
              alt=""
              width={56}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center border-3 border-ink bg-paper shadow-brutal-sm"
            aria-label="Close menu"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
          >
            <MaterialIcon name="close" aria-hidden />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          {links.map((link, i) => {
            const active = isActive(link.id);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMobile}
                tabIndex={mobileOpen ? 0 : -1}
                className={`display flex items-center justify-between border-b-3 border-ink px-6 py-5 text-display-md transition-colors ${
                  active ? "bg-periwinkle" : "hover:bg-lavender"
                }`}
              >
                <span>{link.label}</span>
                <span className="label-lg opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="on-dark shrink-0 border-t-3 border-ink bg-ink p-6">
          <Link
            to="/contact"
            onClick={closeMobile}
            tabIndex={mobileOpen ? 0 : -1}
            className="btn btn-lavender w-full"
          >
            Let&apos;s talk
            <MaterialIcon name="arrow_outward" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
