import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { DEMO_FOUNDER_NAME, DEMO_FOUNDER_PASSWORD, hasDemoData } from "@/dashboard/demo";
import { useDashboard } from "@/dashboard/store";
import { Field, FormError } from "@/dashboard/ui";

export function SignIn() {
  const { db, founder, signIn, createFirstFounder, loadSample } = useDashboard();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const setup = db.founders.length === 0;

  useEffect(() => {
    document.title = "Founders | KAN";
  }, []);

  if (founder) return <Navigate to="/k7n/admin/home" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    if (setup && password !== confirm) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }
    const problem = setup ? await createFirstFounder(name, password) : await signIn(name, password);
    setError(problem);
    setPending(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-paper bg-grid px-6 py-16">
      <form onSubmit={submit} className="card w-full max-w-md p-8 md:p-10">
        <p className="label mb-3 text-ink/60">KAN Founders</p>
        <h1 className="display mb-4 text-[48px] leading-none">{setup ? "Set up" : "Sign in"}</h1>
        <p className="mb-8 text-body text-ink/70">
          {setup
            ? "Create the first founder login. It stays on this computer until you download a backup."
            : "Founders only. This door is not linked from the public site."}
        </p>
        {hasDemoData(db) ? (
          <p className="mb-8 border-3 border-ink bg-lavender px-4 py-3 text-small">
            Sample data is in this browser. Name <span className="font-bold">{DEMO_FOUNDER_NAME}</span>, password{" "}
            <span className="font-bold">{DEMO_FOUNDER_PASSWORD}</span>.
          </p>
        ) : (
          <button type="button" className="btn btn-sm mb-8" onClick={loadSample}>
            Load sample data
          </button>
        )}
        <div className="grid gap-5">
          <Field label="Name">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
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
              autoComplete={setup ? "new-password" : "current-password"}
              required
            />
          </Field>
          {setup ? (
            <Field label="Confirm password">
              <input
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="field"
                autoComplete="new-password"
                required
              />
            </Field>
          ) : null}
          <FormError message={error} />
          <button type="submit" className="btn btn-periwinkle" disabled={pending}>
            {setup ? "Create login" : "Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
}
