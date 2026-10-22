import { useState, type FormEvent } from "react";
import {
  clientName,
  formatBag,
  formatDate,
  formatMoney,
  formatMonth,
  monthTotals,
  projectTitle,
  shiftMonth,
  thisMonth,
} from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import {
  emptyEntry,
  type Cadence,
  type CompanyEntry,
  type EntryKind,
  type EntryStatus,
} from "@/dashboard/types";
import { Empty, Field, FormError, PageHeading, Select, Stat } from "@/dashboard/ui";

const SECTIONS: {
  kind: EntryKind;
  title: string;
  name: string;
  date: string;
  hint: string;
  cadences: readonly (readonly [Cadence, string])[];
  statuses: readonly (readonly [EntryStatus, string])[];
}[] = [
  {
    kind: "salary",
    title: "Salaries",
    name: "Person",
    date: "Pay date",
    hint: "Monthly salaries count every month. After you mark one paid, move the pay date forward.",
    cadences: [
      ["monthly", "Monthly"],
      ["one-off", "One-off"],
    ],
    statuses: [
      ["due", "Due"],
      ["paid", "Paid"],
    ],
  },
  {
    kind: "subscription",
    title: "Subscriptions",
    name: "Tool",
    date: "Next renewal",
    hint: "Hosting, design, AI, email, domains. Monthly tools count every month. Yearly tools count in the renewal month.",
    cadences: [
      ["monthly", "Monthly"],
      ["yearly", "Yearly"],
    ],
    statuses: [
      ["active", "Active"],
      ["cancelled", "Cancelled"],
    ],
  },
  {
    kind: "contractor",
    title: "Contractors",
    name: "Person",
    date: "Pay date",
    hint: "Someone outside the three founders, paid for a job.",
    cadences: [
      ["one-off", "One-off"],
      ["monthly", "Monthly"],
    ],
    statuses: [
      ["due", "Due"],
      ["paid", "Paid"],
    ],
  },
  {
    kind: "draw",
    title: "Owner draws",
    name: "Founder",
    date: "Date",
    hint: "Money a founder takes out that is not salary.",
    cadences: [
      ["one-off", "One-off"],
      ["monthly", "Monthly"],
    ],
    statuses: [
      ["paid", "Paid"],
      ["due", "Due"],
    ],
  },
  {
    kind: "passthrough",
    title: "Pass-through",
    name: "What was paid",
    date: "Date",
    hint: "Ad spend and other costs billed back to a client. Shown here, left out of the remainder.",
    cadences: [
      ["one-off", "One-off"],
      ["monthly", "Monthly"],
    ],
    statuses: [
      ["paid", "Paid"],
      ["due", "Due"],
    ],
  },
];

export function Money() {
  const { db } = useDashboard();
  const [month, setMonth] = useState(thisMonth);
  const totals = monthTotals(db, month);
  const leftNegative = Object.values(totals.leftOver).some((amount) => amount < 0);

  return (
    <>
      <PageHeading
        title="Money"
        lede="Company cash for the month. A paid invoice is income. An unpaid invoice is still outstanding, not income."
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-sm btn-paper" onClick={() => setMonth(shiftMonth(month, -1))}>
          Previous
        </button>
        <p className="display min-w-40 text-center text-[28px] leading-none">{formatMonth(month)}</p>
        <button type="button" className="btn btn-sm btn-paper" onClick={() => setMonth(shiftMonth(month, 1))}>
          Next
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Income received" value={formatBag(totals.income)} className="bg-periwinkle" />
        <Stat label="Salaries" value={formatBag(totals.salaries)} />
        <Stat label="Subscriptions" value={formatBag(totals.subscriptions)} />
        <Stat label="Contractors" value={formatBag(totals.contractors)} />
        <Stat label="Owner draws" value={formatBag(totals.draws)} />
        <Stat label="Pass-through" value={formatBag(totals.passthrough)} className="bg-lavender" />
        <Stat label="Left over" value={formatBag(totals.leftOver)} className={leftNegative ? "bg-purple" : "bg-paper"} />
      </div>
      <p className="mt-3 text-small text-ink/60">
        Left over is income minus salaries, subscriptions, contractors, and owner draws. It is not a tax figure.
      </p>

      <section className="mt-10">
        <h2 className="label-lg mb-4">Received by project</h2>
        {totals.byProject.length === 0 ? (
          <Empty>No paid invoices in {formatMonth(month)}.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {totals.byProject.map((row) => {
              const project = db.projects.find((item) => item.id === row.projectId);
              return (
                <li key={`${row.projectId}-${row.currency}`} className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                  <span>
                    <span className="font-bold">{projectTitle(db, row.projectId)}</span>
                    <span className="mt-1 block text-small text-ink/70">
                      {project ? clientName(db, project.clientId) : "—"}
                    </span>
                  </span>
                  <span className="font-bold">{formatMoney(row.amount, row.currency)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-8">
        {SECTIONS.map((section) => (
          <EntrySection key={section.kind} {...section} />
        ))}
      </div>
    </>
  );
}

function EntrySection({
  kind,
  title,
  name,
  date,
  hint,
  cadences,
  statuses,
}: (typeof SECTIONS)[number]) {
  const { db, saveEntry, deleteEntry } = useDashboard();
  const [form, setForm] = useState<CompanyEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rows = db.entries.filter((entry) => entry.kind === kind).sort((a, b) => b.date.localeCompare(a.date));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!Number.isFinite(form.amount) || form.amount < 0) {
      setError("Amount should be zero or more.");
      return;
    }
    saveEntry({
      ...form,
      name: form.name.trim(),
      currency: form.currency.trim().toUpperCase() || "USD",
    });
    setForm(null);
    setError(null);
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="label-lg">{title}</h2>
          <p className="mt-2 max-w-2xl text-small text-ink/60">{hint}</p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-periwinkle"
          onClick={() => {
            setForm(emptyEntry(crypto.randomUUID(), kind));
            setError(null);
          }}
        >
          Add
        </button>
      </div>
      {form ? (
        <form onSubmit={submit} className="card mb-4 grid gap-4 p-5 md:grid-cols-2">
          <Field label={name}>
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Amount">
            <input
              type="number"
              min={0}
              step="0.01"
              className="field"
              value={form.amount}
              onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })}
            />
          </Field>
          <Field label="Currency">
            <input className="field" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })} />
          </Field>
          <Field label="Cadence">
            <Select value={form.cadence} onChange={(event) => setForm({ ...form, cadence: event.target.value as Cadence })}>
              {cadences.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={date}>
            <input type="date" className="field" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as EntryStatus })}>
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          {kind === "passthrough" ? (
            <Field label="Client">
              <Select value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })}>
                <option value="">None</option>
                {db.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <div className="md:col-span-2">
            <Field label="Note">
              <input className="field" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <FormError message={error} />
            <button type="submit" className="btn btn-sm btn-ink">
              Save
            </button>
            <button type="button" className="btn btn-sm btn-paper" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {rows.length === 0 ? (
        <Empty>Nothing here yet.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {rows.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
              <div>
                <p className="font-bold">{entry.name}</p>
                <p className="text-small text-ink/70">
                  {formatMoney(entry.amount, entry.currency)} · {entry.cadence} · {formatDate(entry.date)} · {entry.status}
                  {entry.clientId ? ` · ${clientName(db, entry.clientId)}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.status === "due" ? (
                  <button type="button" className="btn btn-sm btn-periwinkle" onClick={() => saveEntry({ ...entry, status: "paid" })}>
                    Mark paid
                  </button>
                ) : null}
                <button type="button" className="btn btn-sm btn-paper" onClick={() => setForm(entry)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm bg-purple"
                  onClick={() => {
                    if (window.confirm(`Delete ${entry.name}?`)) deleteEntry(entry.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
