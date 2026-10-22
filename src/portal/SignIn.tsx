import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { DEMO_PORTAL_EMAIL, DEMO_PORTAL_PASSWORD, hasDemoData } from "@/dashboard/demo";
import { useDashboard } from "@/dashboard/store";
import { Field, FormError } from "@/dashboard/ui";

export function PortalSignIn() {
  const { db, portalClient, portalSignIn, loadSample } = useDashboard();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    document.title = "Portal | KAN";
  }, []);

  if (portalClient) return <Navigate to="/k7n/portal/home" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(await portalSignIn(email, password));
    setPending(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-paper bg-grid px-6 py-16">
      <form onSubmit={submit} className="card w-full max-w-md p-8 md:p-10">
        <p className="label mb-3 text-ink/60">KAN portal</p>
        <h1 className="display mb-4 text-[48px] leading-none">Sign in</h1>
        <p className="mb-8 text-body text-ink/70">
          Your projects, updates, and invoices. This door is not linked from the public site.
        </p>
        {hasDemoData(db) ? (
          <p className="mb-8 border-3 border-ink bg-lavender px-4 py-3 text-small">
            Sample data is in this browser. Email <span className="font-bold">{DEMO_PORTAL_EMAIL}</span>, password{" "}
            <span className="font-bold">{DEMO_PORTAL_PASSWORD}</span>.
          </p>
        ) : (
          <button type="button" className="btn btn-sm mb-8" onClick={loadSample}>
            Load sample data
          </button>
        )}
        <div className="grid gap-5">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              autoComplete="current-password"
              required
            />
          </Field>
          <FormError message={error} />
          <button type="submit" className="btn btn-periwinkle" disabled={pending}>
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
