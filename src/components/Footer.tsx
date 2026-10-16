import { Link } from "react-router-dom";
import { MaterialIcon } from "./MaterialIcon";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/contact", label: "Contact" },
] as const;

const socialLinks = [
  { href: "#", label: "Twitter / X", aria: "KAN Agency on Twitter" },
  { href: "#", label: "LinkedIn", aria: "KAN Agency on LinkedIn" },
  { href: "#", label: "Instagram", aria: "KAN Agency on Instagram" },
] as const;

const linkClass =
  "label-lg group inline-flex w-fit items-center gap-2 text-paper/70 transition-colors duration-150 hover:text-lavender";

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-50" aria-hidden />

      <div className="container-site relative pb-8 pt-section-sm md:pt-24">
        <div className="mb-16 flex flex-col items-start justify-between gap-10 md:mb-24 lg:flex-row lg:items-end">
          <p
            className="display text-display-xl"
            aria-label="Together, we KAN."
          >
            <span className="block">Together,</span>
            <span className="block">
              we <span className="text-outline-paper">KAN</span>
              <span className="text-lavender">.</span>
            </span>
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn btn-lavender shrink-0"
          >
            Back to top
            <MaterialIcon name="north" aria-hidden />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t-3 border-paper pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" aria-label="KAN — home" className="inline-block">
              <img
                src="/brand/logo-light.png"
                alt="KAN Agency"
                width={68}
                height={58}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-[360px] text-body text-paper/70">
              Your vision, our design — together, we can. A software, marketing
              and brand studio building for the digital age.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 lg:col-span-2 lg:col-start-6">
            <h4 className="label mb-2 text-lavender">Navigate</h4>
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 lg:col-span-2">
            <h4 className="label mb-2 text-lavender">Connect</h4>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.aria}
                className={linkClass}
              >
                {link.label}
                <MaterialIcon
                  name="arrow_outward"
                  className="text-[16px]"
                  aria-hidden
                />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 lg:col-span-3">
            <h4 className="label mb-2 text-lavender">Contact</h4>
            <a
              href="mailto:hello@kanagency.design"
              className="label-lg w-fit text-paper underline decoration-lavender decoration-2 underline-offset-4 transition-colors hover:text-lavender"
            >
              hello@kanagency.design
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t-3 border-paper/25 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="label text-paper/60">
            © 2026 KAN Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="label text-paper/60 transition-colors hover:text-lavender">
              Privacy Policy
            </a>
            <a href="#" className="label text-paper/60 transition-colors hover:text-lavender">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="h-6 border-t-3 border-paper bg-hazard" aria-hidden />
    </footer>
  );
}
