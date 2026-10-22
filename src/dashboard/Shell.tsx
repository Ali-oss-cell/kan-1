import { useState, type FormEvent, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useDashboard } from "@/dashboard/store";
import { FormError } from "@/dashboard/ui";

const LINKS = [
  ["/k7n/admin/home", "Home"],
  ["/k7n/admin/inquiries", "Inquiries"],
  ["/k7n/admin/clients", "Clients"],
  ["/k7n/admin/projects", "Projects"],
  ["/k7n/admin/payments", "Payments"],
  ["/k7n/admin/money", "Money"],
  ["/k7n/admin/calendar", "Calendar"],
  ["/k7n/admin/employees", "Employees"],
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { founder, signOut, addFounder, exportBackup, importBackup } = useDashboard();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);

  const submitFounder = async (event: FormEvent) => {
    event.preventDefault();
    const problem = await addFounder(name, password);
    if (problem) {
      setError(problem);
      return;
    }
    setName("");
    setPassword("");
    setError(null);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-paper bg-grid">
      <a
        href="#main-content"
        className="label-lg sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-3 focus:border-ink focus:bg-lavender focus:px-6 focus:py-3"
      >
        Skip to content
      </a>
      <header className="on-dark border-b-3 border-ink bg-ink text-paper [&_.btn-sm]:shadow-[4px_4px_0_0_#f0f0f0]">
        <div className="container-site grid gap-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <NavLink to="/k7n/admin/home" className="display text-[28px] leading-none text-paper">
                KAN
              </NavLink>
              <span className="label text-lavender">Founders</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
            <span className="label text-paper/80">{founder?.name}</span>
            <button type="button" className="btn btn-sm bg-paper text-ink" onClick={() => setAdding((open) => !open)}>
              Add founder
            </button>
            <button type="button" className="btn btn-sm bg-paper text-ink" onClick={exportBackup}>
              Download backup
            </button>
            <label className="btn btn-sm bg-paper text-ink cursor-pointer">
              Restore backup
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setBackupError(await importBackup(file));
                }}
              />
            </label>
            <button type="button" className="btn btn-sm bg-purple text-ink" onClick={signOut}>
              Sign out
            </button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-2 gap-y-4" aria-label="Founders">
            {LINKS.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? "bg-lavender text-ink" : "bg-ink text-paper"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      {adding ? (
        <form onSubmit={submitFounder} className="border-b-3 border-ink bg-lavender">
          <div className="container-site grid gap-4 py-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="block">
              <span className="label mb-2 block">Founder name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="field" required />
            </label>
            <label className="block">
              <span className="label mb-2 block">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                autoComplete="new-password"
                required
              />
            </label>
            <button type="submit" className="btn btn-sm btn-ink">
              Save login
            </button>
            <div className="md:col-span-3">
              <FormError message={error} />
            </div>
          </div>
        </form>
      ) : null}
      <main id="main-content" className="container-site py-8 md:py-10">
        {backupError ? (
          <div className="mb-6">
            <FormError message={backupError} />
          </div>
        ) : null}
        <p className="label mb-8 text-ink/50">
          Saved in this browser. Download a backup to move it to another computer.
        </p>
        {children}
      </main>
    </div>
  );
}
