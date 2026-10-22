import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatMoney, labelOf } from "@/dashboard/logic";
import { NotesAndFiles } from "@/dashboard/NotesAndFiles";
import { UpdatesEditor } from "@/dashboard/UpdatesEditor";
import { useDashboard } from "@/dashboard/store";
import {
  BALANCE_DUE,
  CLIENT_STATUSES,
  emptyClient,
  PAY_METHODS,
  type Client,
  type ClientStatus,
  type PayMethod,
} from "@/dashboard/types";
import { Empty, Field, FormError, Options, PageHeading, Select, Status } from "@/dashboard/ui";

export function Clients() {
  const { db, saveClient, deleteClient } = useDashboard();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Client | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = db.clients.find((client) => client.id === selectedId) ?? null;
  const needle = query.trim().toLowerCase();
  const rows = db.clients
    .filter((client) => {
      if (!needle) return true;
      return [client.name, client.company, client.email, client.country].join(" ").toLowerCase().includes(needle);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.depositRequired && form.depositKind === "percent" && (form.depositValue <= 0 || form.depositValue > 100)) {
      setError("Deposit percent should be between 1 and 100.");
      return;
    }
    saveClient({ ...form, name: form.name.trim() });
    setSelectedId(form.id);
    setForm(null);
    setError(null);
  };

  return (
    <>
      <PageHeading
        title="Clients"
        lede="A client can exist before any project."
        action={
          <button
            type="button"
            className="btn btn-sm btn-periwinkle"
            onClick={() => {
              const next = emptyClient(crypto.randomUUID());
              setForm(next);
              setError(null);
            }}
          >
            New client
          </button>
        }
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search clients"
        className="field mb-6"
        aria-label="Search clients"
      />
      {form ? <ClientForm form={form} setForm={setForm} onSubmit={submit} onCancel={() => setForm(null)} error={error} /> : null}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {rows.length === 0 ? (
            <Empty>{db.clients.length === 0 ? "No clients yet." : "No clients match that search."}</Empty>
          ) : (
            <ul className="border-3 border-ink bg-paper">
              {rows.map((client) => (
                <li
                  key={client.id}
                  className={`border-b-3 border-ink bg-paper last:border-b-0 ${selectedId === client.id ? "shadow-[inset_8px_0_0_#0f0f0f]" : ""}`}
                >
                  <button type="button" className="w-full px-4 py-3 text-left" onClick={() => setSelectedId(client.id)}>
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold">{client.name}</span>
                      <Status value={client.status} label={labelOf(CLIENT_STATUSES, client.status)} />
                    </span>
                    <span className="mt-1 block text-small text-ink/70">
                      {client.company || "No company"} · {labelOf(PAY_METHODS, client.payMethod)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-7">
          {selected ? (
            <ClientDetail
              client={selected}
              onEdit={() => {
                setForm(selected);
                setError(null);
              }}
              onDelete={() => {
                if (!window.confirm(`Delete ${selected.name}?`)) return;
                void deleteClient(selected.id).then((problem) => {
                  if (problem) {
                    setError(problem);
                    return;
                  }
                  setSelectedId(null);
                  setError(null);
                });
              }}
            />
          ) : (
            <Empty>Select a client.</Empty>
          )}
        </div>
      </div>
    </>
  );
}

function ClientForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  error,
}: {
  form: Client;
  setForm: (client: Client) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  error: string | null;
}) {
  return (
    <form onSubmit={onSubmit} className="card mb-8 grid gap-5 p-6 md:grid-cols-2">
      <Field label="Name">
        <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
      </Field>
      <Field label="Company">
        <input className="field" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
      </Field>
      <Field label="Email">
        <input type="email" className="field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </Field>
      <Field label="Billing email">
        <input
          type="email"
          className="field"
          value={form.billingEmail}
          onChange={(event) => setForm({ ...form, billingEmail: event.target.value })}
          placeholder="Same as email if empty"
        />
      </Field>
      <Field label="Phone">
        <input className="field" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
      </Field>
      <Field label="Country">
        <input className="field" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ClientStatus })}>
          <Options items={CLIENT_STATUSES} />
        </Select>
      </Field>
      <Field label="How they pay">
        <Select value={form.payMethod} onChange={(event) => setForm({ ...form, payMethod: event.target.value as PayMethod })}>
          <Options items={PAY_METHODS} />
        </Select>
      </Field>
      <Field label="Payment note">
        <input className="field" value={form.payMethodNote} onChange={(event) => setForm({ ...form, payMethodNote: event.target.value })} />
      </Field>
      <Field label="Balance due">
        <Select
          value={form.balanceDue}
          onChange={(event) => setForm({ ...form, balanceDue: event.target.value as Client["balanceDue"] })}
        >
          <Options items={BALANCE_DUE} />
        </Select>
      </Field>
      <label className="flex items-center gap-3 md:col-span-2">
        <input
          type="checkbox"
          checked={form.depositRequired}
          onChange={(event) => setForm({ ...form, depositRequired: event.target.checked })}
        />
        <span className="text-body">Deposit required</span>
      </label>
      {form.depositRequired ? (
        <>
          <Field label="Deposit type">
            <Select
              value={form.depositKind}
              onChange={(event) => setForm({ ...form, depositKind: event.target.value as Client["depositKind"] })}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed amount</option>
            </Select>
          </Field>
          <Field label={form.depositKind === "percent" ? "Percent" : "Amount"}>
            <input
              type="number"
              min={0}
              step="0.01"
              className="field"
              value={form.depositValue}
              onChange={(event) => setForm({ ...form, depositValue: Number(event.target.value) })}
            />
          </Field>
        </>
      ) : null}
      <div className="md:col-span-2">
        <Field label="Notes">
          <textarea className="field resize-y" rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-3 md:col-span-2">
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-ink">
          Save client
        </button>
        <button type="button" className="btn btn-sm btn-paper" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function PortalAccess({ clientId }: { clientId: string }) {
  const { db, setPortalAccess } = useDashboard();
  const client = db.clients.find((item) => item.id === clientId);
  const [enabled, setEnabled] = useState(client?.portalEnabled ?? false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  if (!client) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    const problem = await setPortalAccess(client.id, enabled, password);
    setError(problem);
    if (!problem) setPassword("");
    setPending(false);
  };

  return (
    <form onSubmit={submit} className="border-3 border-ink bg-paper p-5">
      <h3 className="label-lg mb-3">Client portal</h3>
      <p className="mb-4 text-small text-ink/70">
        {client.portalEnabled ? "Portal access is on." : "Portal access is off."} They sign in at /k7n/portal with{" "}
        {client.email || "their email"}.
      </p>
      <label className="mb-4 flex items-center gap-3">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        <span className="text-body">Let this client sign in</span>
      </label>
      <Field label={client.portalPasswordHash ? "New password, optional" : "Starting password"}>
        <input
          type="password"
          className="field"
          value={password}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      <div className="mt-4 flex flex-wrap gap-3">
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-ink" disabled={pending}>
          Save portal access
        </button>
      </div>
    </form>
  );
}

function ClientDetail({ client, onEdit, onDelete }: { client: Client; onEdit: () => void; onDelete: () => void }) {
  const { db } = useDashboard();
  const projects = db.projects.filter((project) => project.clientId === client.id);
  const projectIds = new Set(projects.map((project) => project.id));
  const invoices = db.invoices.filter((invoice) => projectIds.has(invoice.projectId));
  const paid = invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const currency = projects[0]?.currency || "USD";

  return (
    <article className="grid gap-6">
      <div className="border-3 border-ink bg-paper p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[32px] font-extrabold uppercase leading-none">{client.name}</h2>
            <p className="mt-2 text-body text-ink/70">{client.company || "No company"}</p>
          </div>
          <Status value={client.status} label={labelOf(CLIENT_STATUSES, client.status)} />
        </div>
        <dl className="mt-5 grid gap-3 text-small sm:grid-cols-2">
          <div>
            <dt className="label text-ink/50">Email</dt>
            <dd>{client.email || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Billing</dt>
            <dd>{client.billingEmail || client.email || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Phone</dt>
            <dd>{client.phone || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Country</dt>
            <dd>{client.country || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Pays by</dt>
            <dd>
              {labelOf(PAY_METHODS, client.payMethod)}
              {client.payMethodNote ? ` · ${client.payMethodNote}` : ""}
            </dd>
          </div>
          <div>
            <dt className="label text-ink/50">Deposit</dt>
            <dd>
              {client.depositRequired
                ? client.depositKind === "percent"
                  ? `${client.depositValue}%`
                  : formatMoney(client.depositValue, currency)
                : "None"}
              {" · "}
              {labelOf(BALANCE_DUE, client.balanceDue)}
            </dd>
          </div>
        </dl>
        {client.notes ? <p className="mt-4 whitespace-pre-wrap text-body">{client.notes}</p> : null}
        <p className="mt-4 text-small">
          {projects.length} projects · {formatMoney(paid, currency)} paid
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn btn-sm btn-periwinkle" onClick={onEdit}>
            Edit
          </button>
          <Link to={`/k7n/admin/projects?client=${client.id}`} className="btn btn-sm btn-ink">
            Assign a project
          </Link>
          <button type="button" className="btn btn-sm bg-purple" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
      {projects.length > 0 ? (
        <ul className="border-3 border-ink bg-paper">
          {projects.map((project) => (
            <li key={project.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
              <p className="font-bold">{project.title}</p>
              <p className="text-small text-ink/70">
                {project.offer} · {formatMoney(project.price, project.currency)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      <PortalAccess key={client.id} clientId={client.id} />
      <UpdatesEditor clientId={client.id} />
      <NotesAndFiles ownerType="client" ownerId={client.id} />
    </article>
  );
}
