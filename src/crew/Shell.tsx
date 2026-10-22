import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useDashboard } from "@/dashboard/store";

const LINKS = [
  ["/k7n/crew/home", "Home"],
  ["/k7n/crew/tasks", "Tasks"],
  ["/k7n/crew/projects", "Projects"],
  ["/k7n/crew/time", "Time"],
  ["/k7n/crew/profile", "Profile"],
] as const;

export function CrewShell({ children }: { children: ReactNode }) {
  const { crew, crewSignOut } = useDashboard();

  return (
    <div className="min-h-screen bg-paper bg-grid">
      <a href="#main-content" className="label-lg sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-3 focus:border-ink focus:bg-lavender focus:px-6 focus:py-3">
        Skip to content
      </a>
      <header className="on-dark border-b-3 border-ink bg-ink text-paper [&_.btn-sm]:shadow-[4px_4px_0_0_#f0f0f0]">
        <div className="container-site grid gap-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <NavLink to="/k7n/crew/home" className="display text-[28px] leading-none text-paper">KAN</NavLink>
              <span className="label text-lavender">Crew</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
              <span className="label text-paper/80">{crew?.name}</span>
              <button type="button" className="btn btn-sm bg-paper text-ink" onClick={crewSignOut}>Sign out</button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-2 gap-y-4" aria-label="Crew">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `btn btn-sm ${isActive ? "bg-lavender text-ink" : "bg-ink text-paper"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="container-site py-8 md:py-10">{children}</main>
    </div>
  );
}
