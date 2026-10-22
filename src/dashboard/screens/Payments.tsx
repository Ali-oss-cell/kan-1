import { useState, type FormEvent } from "react";
import {
  clientName,
  formatDate,
  formatMoney,
  invoiceIsOpen,
  invoiceIsOverdue,
  labelOf,
  todayISO,
} from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import {
  emptyInvoice,
  INVOICE_STATUSES,
  PAY_METHODS,
  type Invoice,
  type InvoiceStatus,
  type PayMethod,
} from "@/dashboard/types";
import { Empty, Field, FormError, Options, PageHeading, Select, Status } from "@/dashboard/ui";

type Filter = "all" | "open" | "paid" | "overdue";

export function Payments() {
  const { db, saveInvoice, deleteInvoice, nextInvoiceNumber, issueNextInvoice } = useDashboard();
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const today = todayISO();

  const rows = [...db.invoices]
    .filter((invoice) => {
      if (filter === "paid") return invoice.status === "paid";
      if (filter === "open") return invoiceIsOpen(invoice);
      if (filter === "overdue") return invoiceIsOverdue(invoice, today);
      return true;
    })
    .sort((a, b) => (b.dueDate || b.issueDate).localeCompare(a.dueDate || a.issueDate));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (!form.projectId) {
      setError("Choose a project.");
      return;
    }
    if (!form.number.trim()) {
      setError("Invoice number is required.");
      return;
    }
    if (!Number.isFinite(form.amount) || form.amount < 0) {
      setError("Amount should be zero or more.");
      return;
    }
    const paid = form.status === "paid";
    saveInvoice({
      ...form,
      number: form.number.trim(),
      currency: form.currency.trim().toUpperCase() || "USD",
      amountPaid: paid ? form.amount : form.status === "partial" ? form.amountPaid : 0,
      paidDate: paid || form.status === "partial" ? form.paidDate || today : form.paidDate,
    });
    setForm(null);
    setError(null);
  };

  const markPaid = (invoice: Invoice) => {
    saveInvoice({
      ...invoice,
      status: "paid",
      amountPaid: invoice.amount,
      paidDate: invoice.paidDate || today,
    });
  };

  return (
    <>
      <PageHeading
        title="Payments"
        lede="What the client owes, and what has arrived. Recording a method does not charge a card."
        action={
          <button
            type="button"
            className="btn btn-sm btn-periwinkle"
            onClick={() => {
              const next = emptyInvoice(crypto.randomUUID(), nextInvoiceNumber());
              next.issueDate = today;
              next.dueDate = today;
              setForm(next);
              setError(null);
            }}
          >
            New invoice
          </button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["open", "Open"],
            ["overdue", "Overdue"],
            ["paid", "Paid"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`btn btn-sm ${filter === value ? "btn-ink" : "btn-paper"}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {form ? (
        <InvoiceForm
          form={form}
          setForm={setForm}
          onSubmit={submit}
          onCancel={() => setForm(null)}
          error={error}
        />
      ) : null}
      {rows.length === 0 ? (
        <Empty>No invoices in this view.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {rows.map((invoice) => {
            const project = db.projects.find((item) => item.id === invoice.projectId);
            const overdue = invoiceIsOverdue(invoice, today);
            return (
              <li key={invoice.id} className="grid gap-3 border-b-3 border-ink bg-paper p-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{invoice.number}</p>
                    <Status
                      value={overdue ? "overdue" : invoice.status}
                      label={overdue ? "Overdue" : labelOf(INVOICE_STATUSES, invoice.status)}
                    />
                  </div>
                  <p className="mt-1 text-small text-ink/70">
                    {project ? `${project.title} · ${clientName(db, project.clientId)}` : "No project"} ·{" "}
                    {formatMoney(invoice.amount, invoice.currency)} · due {formatDate(invoice.dueDate)}
                  </p>
                  <p className="mt-1 text-small text-ink/70">
                    {labelOf(PAY_METHODS, invoice.payMethod)}
                    {invoice.reference ? ` · ${invoice.reference}` : ""}
                    {invoice.paidDate ? ` · paid ${formatDate(invoice.paidDate)}` : ""}
                    {invoice.repeat === "monthly" ? " · repeats monthly" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {invoiceIsOpen(invoice) ? (
                    <button type="button" className="btn btn-sm btn-periwinkle" onClick={() => markPaid(invoice)}>
                      Mark paid
                    </button>
                  ) : null}
                  {invoice.repeat === "monthly" ? (
                    <button type="button" className="btn btn-sm btn-paper" onClick={() => issueNextInvoice(invoice.id)}>
                      Issue next month
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-sm btn-paper"
                    onClick={() => {
                      setForm(invoice);
                      setError(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm bg-purple"
                    onClick={() => {
                      if (window.confirm(`Delete ${invoice.number}?`)) deleteInvoice(invoice.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function InvoiceForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  error,
}: {
  form: Invoice;
  setForm: (invoice: Invoice) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  error: string | null;
}) {
  const { db } = useDashboard();
  const project = db.projects.find((item) => item.id === form.projectId);
  const milestones = db.milestones.filter((milestone) => milestone.projectId === form.projectId);

  const chooseProject = (projectId: string) => {
    const nextProject = db.projects.find((item) => item.id === projectId);
    const client = db.clients.find((item) => item.id === nextProject?.clientId);
    setForm({
      ...form,
      projectId,
      milestoneId: "",
      currency: nextProject?.currency || form.currency,
      payMethod: client?.payMethod || form.payMethod,
      payMethodNote: client?.payMethodNote || form.payMethodNote,
    });
  };

  return (
    <form onSubmit={onSubmit} className="card mb-8 grid gap-5 p-6 md:grid-cols-2">
      <Field label="Project">
        <Select value={form.projectId} onChange={(event) => chooseProject(event.target.value)}>
          <option value="">Choose a project</option>
          {db.projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} · {clientName(db, item.clientId)}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Milestone">
        <Select value={form.milestoneId} onChange={(event) => setForm({ ...form, milestoneId: event.target.value })}>
          <option value="">None</option>
          {milestones.map((milestone) => (
            <option key={milestone.id} value={milestone.id}>
              {milestone.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Number">
        <input className="field" value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as InvoiceStatus })}>
          <Options items={INVOICE_STATUSES} />
        </Select>
      </Field>
      <Field label="Issued">
        <input type="date" className="field" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} />
      </Field>
      <Field label="Due">
        <input type="date" className="field" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
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
      <Field label="How they will pay">
        <Select value={form.payMethod} onChange={(event) => setForm({ ...form, payMethod: event.target.value as PayMethod })}>
          <Options items={PAY_METHODS} />
        </Select>
      </Field>
      <Field label="Payment note">
        <input className="field" value={form.payMethodNote} onChange={(event) => setForm({ ...form, payMethodNote: event.target.value })} />
      </Field>
      {form.status === "partial" ? (
        <Field label="Amount received">
          <input
            type="number"
            min={0}
            step="0.01"
            className="field"
            value={form.amountPaid}
            onChange={(event) => setForm({ ...form, amountPaid: Number(event.target.value) })}
          />
        </Field>
      ) : null}
      <Field label="Date paid">
        <input type="date" className="field" value={form.paidDate} onChange={(event) => setForm({ ...form, paidDate: event.target.value })} />
      </Field>
      <Field label="Reference">
        <input
          className="field"
          value={form.reference}
          onChange={(event) => setForm({ ...form, reference: event.target.value })}
          placeholder="Transfer id or receipt"
        />
      </Field>
      <label className="flex items-center gap-3 md:col-span-2">
        <input
          type="checkbox"
          checked={form.repeat === "monthly"}
          onChange={(event) => setForm({ ...form, repeat: event.target.checked ? "monthly" : "none" })}
        />
        <span className="text-body">Repeat every month. Use this for a retainer such as Growth Marketing.</span>
      </label>
      <div className="md:col-span-2">
        <Field label="Description">
          <input
            className="field"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder={project ? `Deposit or ${project.title}` : "Deposit, milestone, or balance"}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-3 md:col-span-2">
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-ink">
          Save invoice
        </button>
        <button type="button" className="btn btn-sm btn-paper" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
