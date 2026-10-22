import { formatDate, formatMoney, invoiceIsOpen, invoiceIsOverdue, labelOf, todayISO } from "@/dashboard/logic";
import { downloadInvoice } from "@/portal/invoiceFile";
import { useDashboard } from "@/dashboard/store";
import { INVOICE_STATUSES, PAY_METHODS } from "@/dashboard/types";
import { Empty, PageHeading, Status } from "@/dashboard/ui";

export function PortalPayments() {
  const { db, portalClient } = useDashboard();
  if (!portalClient) return null;
  const today = todayISO();
  const projectIds = new Set(
    db.projects.filter((project) => project.clientId === portalClient.id).map((project) => project.id),
  );
  const invoices = db.invoices
    .filter((invoice) => projectIds.has(invoice.projectId) && (invoice.status === "paid" || invoiceIsOpen(invoice)))
    .sort((a, b) => (b.dueDate || b.issueDate).localeCompare(a.dueDate || a.issueDate));

  return (
    <>
      <PageHeading title="Payments" lede="What is due, what is paid, and how to pay. This page does not charge a card." />
      {invoices.length === 0 ? (
        <Empty>No invoices yet.</Empty>
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
                  {project?.title} · {formatMoney(invoice.amount, invoice.currency)} · due {formatDate(invoice.dueDate)}
                </p>
                {invoice.description ? <p className="mt-2 text-body">{invoice.description}</p> : null}
                <p className="mt-2 text-small">
                  Pay by {labelOf(PAY_METHODS, invoice.payMethod)}
                  {invoice.payMethodNote ? ` · ${invoice.payMethodNote}` : ""}
                  {invoice.paidDate ? ` · paid ${formatDate(invoice.paidDate)}` : ""}
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
    </>
  );
}
