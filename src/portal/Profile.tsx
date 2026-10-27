import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMoney, invoiceIsOpen, invoiceIsOverdue, labelOf, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { INVOICE_STATUSES, PAY_METHODS } from "@/dashboard/types";
import { Empty, Field, FormError, PageHeading, Status } from "@/dashboard/ui";
import { downloadInvoice } from "@/portal/invoiceFile";

export function PortalProfile() {
  const { db, portalClient, updatePortalProfile } = useDashboard();
  const [name, setName] = useState(portalClient?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setName(portalClient?.name ?? "");
  }, [portalClient?.name]);

  if (!portalClient) return null;

  const today = todayISO();
  const projectIds = new Set(
    db.projects.filter((project) => project.clientId === portalClient.id).map((project) => project.id),
  );
  const invoices = db.invoices
    .filter((invoice) => projectIds.has(invoice.projectId) && (invoice.status === "paid" || invoiceIsOpen(invoice)))
    .sort((a, b) => (b.paidDate || b.dueDate || b.issueDate).localeCompare(a.paidDate || a.dueDate || a.issueDate));

  const paidTotal = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const openTotal = invoices
    .filter((invoice) => invoiceIsOpen(invoice))
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const currency = invoices[0]?.currency || "USD";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    const message = await updatePortalProfile({ name });
    setError(message);
    setSaved(!message);
    setPending(false);
  };

  return (
    <>
      <PageHeading title="Your profile" lede="Update how you appear in the portal, and review billing." />

      <section className="mb-10 border-3 border-ink bg-paper p-5 md:p-6">
        <h2 className="display mb-4 text-[28px] leading-none">Details</h2>
        <form onSubmit={submit} className="grid max-w-lg gap-5">
          <Field label="Name">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              className="field"
              autoComplete="name"
              required
            />
          </Field>
          <Field label="Email">
            <input value={portalClient.email} className="field bg-paper/60" readOnly aria-readonly />
          </Field>
          {portalClient.company ? (
            <p className="text-small text-ink/70">
              Company: <span className="font-medium text-ink">{portalClient.company}</span>
            </p>
          ) : null}
          <FormError message={error} />
          {saved ? (
            <p className="border-3 border-ink bg-lavender px-4 py-3 text-small" role="status">
              Profile saved.
            </p>
          ) : null}
          <button type="submit" className="btn btn-periwinkle w-fit" disabled={pending}>
            Save name
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display text-[28px] leading-none">Billing history</h2>
            <p className="mt-2 text-body text-ink/70">Invoices for your projects with KAN.</p>
          </div>
          <Link to="/k7n/portal/payments" className="btn btn-sm btn-paper">
            Open payments
          </Link>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="border-3 border-ink bg-paper px-4 py-3">
            <p className="label text-ink/60">Paid</p>
            <p className="mt-1 font-bold">{formatMoney(paidTotal, currency)}</p>
          </div>
          <div className="border-3 border-ink bg-paper px-4 py-3">
            <p className="label text-ink/60">Outstanding</p>
            <p className="mt-1 font-bold">{formatMoney(openTotal, currency)}</p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <Empty>No billing history yet.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {invoices.map((invoice) => {
              const project = db.projects.find((item) => item.id === invoice.projectId);
              const overdue = invoiceIsOverdue(invoice, today);
              return (
                <li key={invoice.id} className="border-b-3 border-ink bg-paper px-4 py-4 last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{invoice.number}</p>
                    <Status
                      value={overdue ? "overdue" : invoice.status}
                      label={overdue ? "Overdue" : labelOf(INVOICE_STATUSES, invoice.status)}
                    />
                  </div>
                  <p className="mt-1 text-small text-ink/70">
                    {project?.title} · {formatMoney(invoice.amount, invoice.currency)}
                    {invoice.paidDate
                      ? ` · paid ${formatDate(invoice.paidDate)}`
                      : ` · due ${formatDate(invoice.dueDate)}`}
                  </p>
                  {invoice.description ? <p className="mt-2 text-body">{invoice.description}</p> : null}
                  <p className="mt-2 text-small">
                    Pay by {labelOf(PAY_METHODS, invoice.payMethod)}
                    {invoice.payMethodNote ? ` · ${invoice.payMethodNote}` : ""}
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-paper mt-3"
                    onClick={() => downloadInvoice(invoice, project, portalClient)}
                  >
                    Download invoice
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
