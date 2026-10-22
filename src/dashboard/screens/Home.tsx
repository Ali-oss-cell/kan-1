import { Link } from "react-router-dom";
import {
  clientName,
  formatBag,
  formatDate,
  invoicesDue,
  labelOf,
  milestonesDue,
  monthTotals,
  outstandingBag,
  projectTitle,
  reminders,
  thisMonth,
  todayISO,
} from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { INVOICE_STATUSES, MILESTONE_STATUSES } from "@/dashboard/types";
import { Empty, PageHeading, Stat, Status } from "@/dashboard/ui";

export function Home() {
  const { db, founder } = useDashboard();
  const today = todayISO();
  const month = thisMonth();
  const totals = monthTotals(db, month);
  const dueInvoices = invoicesDue(db, today);
  const dueMilestones = milestonesDue(db, today);
  const alerts = reminders(db, today);
  const leftNegative = Object.values(totals.leftOver).some((amount) => amount < 0);

  return (
    <>
      <PageHeading
        title={`Hello, ${founder?.name ?? ""}`.trim()}
        lede="Unpaid invoices, milestones, and what the company keeps this month."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Received this month" value={formatBag(totals.income)} className="bg-periwinkle" />
        <Stat label="Outstanding" value={formatBag(outstandingBag(db))} className="bg-lavender" />
        <Stat
          label="Left over"
          value={formatBag(totals.leftOver)}
          className={leftNegative ? "bg-purple" : "bg-paper"}
        />
        <Stat label="Reminders" value={String(alerts.length)} />
      </div>
      <p className="mt-4 text-small text-ink/60">
        Salaries {formatBag(totals.salaries)} · Subscriptions {formatBag(totals.subscriptions)} · Contractors{" "}
        {formatBag(totals.contractors)}
      </p>

      <section className="mt-10">
        <h2 className="label-lg mb-4">Reminders</h2>
        {alerts.length === 0 ? (
          <Empty>Nothing is due.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {alerts.map((alert) => (
              <li key={alert.id} className="border-b-3 border-ink bg-paper last:border-b-0">
                <Link
                  to={alert.href}
                  className={`flex items-center justify-between gap-4 px-4 py-3 ${alert.tone === "overdue" ? "bg-purple" : "bg-paper"}`}
                >
                  <span>{alert.text}</span>
                  <span className="label">{alert.tone}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="label-lg mb-4">Milestones, 14 days and overdue</h2>
          {dueMilestones.length === 0 ? (
            <Empty>No open milestones in that window.</Empty>
          ) : (
            <ul className="border-3 border-ink bg-paper">
              {dueMilestones.map((milestone) => (
                <li key={milestone.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{milestone.name}</p>
                    <Status value={milestone.status} label={labelOf(MILESTONE_STATUSES, milestone.status)} />
                  </div>
                  <p className="mt-1 text-small text-ink/70">
                    {projectTitle(db, milestone.projectId)} · {formatDate(milestone.dueDate)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="label-lg mb-4">Invoices, this week and overdue</h2>
          {dueInvoices.length === 0 ? (
            <Empty>No open invoices in that window.</Empty>
          ) : (
            <ul className="border-3 border-ink bg-paper">
              {dueInvoices.map((invoice) => {
                const project = db.projects.find((item) => item.id === invoice.projectId);
                return (
                  <li key={invoice.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">{invoice.number}</p>
                      <Status
                      value={invoice.dueDate < today ? "overdue" : invoice.status}
                      label={invoice.dueDate < today ? "Overdue" : labelOf(INVOICE_STATUSES, invoice.status)}
                      />
                    </div>
                    <p className="mt-1 text-small text-ink/70">
                      {project ? clientName(db, project.clientId) : "—"} · {formatDate(invoice.dueDate)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
      <section className="mt-10">
        <h2 className="label-lg mb-4">Email waiting to send</h2>
        {db.notices.length === 0 ? (
          <Empty>Nothing is queued. Publishing an update or sending an invoice queues a message here until mail is connected.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {db.notices.slice(0, 8).map((notice) => (
              <li key={notice.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                <p className="font-bold">{notice.title}</p>
                <p className="text-small text-ink/70">
                  {notice.kind} · {clientName(db, notice.clientId)} · {formatDate(notice.createdAt)} · queued
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-10">
        <h2 className="label-lg mb-4">Recent changes</h2>
        {db.activity.length === 0 ? (
          <Empty>Changes to projects, invoices, and portal passwords show up here.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {db.activity.slice(0, 12).map((item) => (
              <li key={item.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                <p className="font-bold">{item.summary}</p>
                <p className="text-small text-ink/70">
                  {item.actorName} · {formatDate(item.at.slice(0, 10))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
