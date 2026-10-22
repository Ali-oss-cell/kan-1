import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CrewApp } from "@/crew/CrewApp";
import { DashboardApp } from "@/dashboard/DashboardApp";
import { PortalApp } from "@/portal/PortalApp";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServicesPage } from "@/pages/ServicesPage";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const founders = pathname === "/k7n/admin" || pathname.startsWith("/k7n/admin/");
  const portal = pathname === "/k7n/portal" || pathname.startsWith("/k7n/portal/");
  const crew = pathname === "/k7n/crew" || pathname.startsWith("/k7n/crew/");

  return (
    <>
      <ScrollManager />
      {founders ? (
        <DashboardApp />
      ) : portal ? (
        <PortalApp />
      ) : crew ? (
        <CrewApp />
      ) : (
        <>
          <a
            href="#main-content"
            className="label-lg sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-3 focus:border-ink focus:bg-lavender focus:px-6 focus:py-3 focus:text-ink focus:shadow-brutal-sm"
          >
            Skip to content
          </a>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  );
}
