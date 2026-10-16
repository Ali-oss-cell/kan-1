import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Halftone, Sparkle } from "@/components/Ornaments";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Page not found | KAN";
    return () => {
      document.title = "KAN | Software, Marketing & Brand Studio";
    };
  }, []);

  return (
    <main
      id="main-content"
      className="relative overflow-hidden border-b-3 border-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <Halftone
        cols={12}
        rows={12}
        direction="tr"
        className="pointer-events-none absolute -right-8 top-8 hidden w-[320px] md:block"
      />

      <div className="container-site relative py-section-sm md:py-section">
        <div className="mb-8 flex items-center gap-3">
          <span className="chip bg-purple">Error</span>
          <span className="chip">Page not found</span>
        </div>

        <h1 className="display text-display-xl">
          <span className="block">404</span>
          <span className="mark-block mt-2 -rotate-1 border-3 border-ink bg-periwinkle shadow-brutal">
            Off the grid.
          </span>
        </h1>

        <p className="mt-10 max-w-[520px] text-body-lg text-ink/80">
          The page you are looking for does not exist or has moved. Head back
          home or pick up where you left off.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" className="btn btn-periwinkle">
            Back home
            <MaterialIcon name="arrow_outward" aria-hidden />
          </Link>
          <Link to="/contact" className="btn btn-paper">
            Contact us
            <MaterialIcon name="mail" aria-hidden />
          </Link>
        </div>

        <Sparkle size={32} className="mt-16 text-ink" />
      </div>
    </main>
  );
}
