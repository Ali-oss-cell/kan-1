import type { CompanyEntry, DB, Invoice, Milestone, Offer } from "@/dashboard/types";
import { OFFERS } from "@/dashboard/types";

export type MoneyBag = Record<string, number>;

export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function thisMonth() {
  return todayISO().slice(0, 7);
}

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${nextMonth}-${nextDay}`;
}

export function shiftMonth(ym: string, delta: number) {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${nextMonth}`;
}

export function formatDate(iso: string) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMonth(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function formatMoney(amount: number, currency = "USD") {
  const value = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || "USD"}`;
  }
}

export function formatBag(bag: MoneyBag) {
  const rows = Object.entries(bag).filter(([, amount]) => amount !== 0);
  if (rows.length === 0) return formatMoney(0);
  return rows.map(([currency, amount]) => formatMoney(amount, currency)).join(" · ");
}

export function labelOf(items: readonly (readonly [string, string])[], value: string) {
  return items.find(([id]) => id === value)?.[1] ?? value;
}

export function offerFrom(value: string): Offer {
  return OFFERS.find((offer) => offer === value) ?? "Custom";
}

function add(bag: MoneyBag, currency: string, amount: number) {
  const code = currency || "USD";
  const value = Number(amount);
  if (!Number.isFinite(value)) return;
  bag[code] = (bag[code] ?? 0) + value;
}

function subtract(base: MoneyBag, ...rest: MoneyBag[]) {
  const keys = new Set([
    ...Object.keys(base),
    ...rest.flatMap((bag) => Object.keys(bag)),
  ]);
  const result: MoneyBag = {};
  for (const key of keys) {
    result[key] = rest.reduce((sum, bag) => sum - (bag[key] ?? 0), base[key] ?? 0);
  }
  return result;
}

export function invoiceIsOpen(invoice: Invoice) {
  return invoice.status === "sent" || invoice.status === "partial" || invoice.status === "overdue";
}

export function invoiceIsOverdue(invoice: Invoice, today: string) {
  if (!invoiceIsOpen(invoice)) return false;
  if (invoice.status === "overdue") return true;
  return Boolean(invoice.dueDate) && invoice.dueDate < today;
}

export function amountOutstanding(invoice: Invoice) {
  if (!invoiceIsOpen(invoice)) return 0;
  if (invoice.status === "partial") return Math.max(0, invoice.amount - invoice.amountPaid);
  return invoice.amount;
}

export function incomeAmount(invoice: Invoice) {
  if (invoice.status === "paid") return invoice.amount;
  if (invoice.status === "partial") return invoice.amountPaid;
  return 0;
}

export function incomeDate(invoice: Invoice) {
  return invoice.paidDate || invoice.issueDate;
}

export function outstandingBag(db: DB) {
  const bag: MoneyBag = {};
  for (const invoice of db.invoices) {
    add(bag, invoice.currency, amountOutstanding(invoice));
  }
  return bag;
}

export function entryCountsInMonth(entry: CompanyEntry, ym: string) {
  if (entry.kind === "subscription" && entry.status === "cancelled") return false;
  if (entry.cadence === "monthly") return true;
  return Boolean(entry.date) && entry.date.slice(0, 7) === ym;
}

export type MonthTotals = {
  income: MoneyBag;
  salaries: MoneyBag;
  subscriptions: MoneyBag;
  contractors: MoneyBag;
  draws: MoneyBag;
  passthrough: MoneyBag;
  leftOver: MoneyBag;
  byProject: { projectId: string; currency: string; amount: number }[];
};

export function monthTotals(db: DB, ym: string): MonthTotals {
  const income: MoneyBag = {};
  const byProject = new Map<string, { projectId: string; currency: string; amount: number }>();

  for (const invoice of db.invoices) {
    const amount = incomeAmount(invoice);
    if (!amount) continue;
    if (incomeDate(invoice).slice(0, 7) !== ym) continue;
    const currency = invoice.currency || "USD";
    add(income, currency, amount);
    const key = `${invoice.projectId}:${currency}`;
    const row = byProject.get(key) ?? { projectId: invoice.projectId, currency, amount: 0 };
    row.amount += amount;
    byProject.set(key, row);
  }

  const salaries: MoneyBag = {};
  const subscriptions: MoneyBag = {};
  const contractors: MoneyBag = {};
  const draws: MoneyBag = {};
  const passthrough: MoneyBag = {};

  for (const entry of db.entries) {
    if (!entryCountsInMonth(entry, ym)) continue;
    const target =
      entry.kind === "salary"
        ? salaries
        : entry.kind === "subscription"
          ? subscriptions
          : entry.kind === "contractor"
            ? contractors
            : entry.kind === "draw"
              ? draws
              : passthrough;
    add(target, entry.currency, entry.amount);
  }

  return {
    income,
    salaries,
    subscriptions,
    contractors,
    draws,
    passthrough,
    leftOver: subtract(income, salaries, subscriptions, contractors, draws),
    byProject: [...byProject.values()].sort((a, b) => b.amount - a.amount),
  };
}

export type Reminder = {
  id: string;
  tone: "overdue" | "soon";
  text: string;
  href: string;
};

export function reminders(db: DB, today: string): Reminder[] {
  const soon = addDays(today, 7);
  const renewals = addDays(today, 14);
  const items: Reminder[] = [];

  for (const invoice of db.invoices) {
    if (!invoiceIsOpen(invoice) || !invoice.dueDate) continue;
    const overdue = invoiceIsOverdue(invoice, today);
    const dueSoon = invoice.dueDate >= today && invoice.dueDate <= soon;
    if (!overdue && !dueSoon) continue;
    items.push({
      id: `invoice-${invoice.id}`,
      tone: overdue ? "overdue" : "soon",
      text: `${invoice.number} ${overdue ? "is overdue" : "is due"} ${formatDate(invoice.dueDate)}`,
      href: "/k7n/admin/payments",
    });
  }

  for (const milestone of db.milestones) {
    if (milestone.status === "done" || !milestone.dueDate) continue;
    const overdue = milestone.dueDate < today;
    const dueSoon = milestone.dueDate >= today && milestone.dueDate <= soon;
    if (!overdue && !dueSoon) continue;
    const project = db.projects.find((item) => item.id === milestone.projectId);
    items.push({
      id: `milestone-${milestone.id}`,
      tone: overdue ? "overdue" : "soon",
      text: `${milestone.name}${project ? ` · ${project.title}` : ""} ${overdue ? "is overdue" : "is due"} ${formatDate(milestone.dueDate)}`,
      href: "/k7n/admin/projects",
    });
  }

  for (const entry of db.entries) {
    if (!entry.date) continue;
    if (entry.kind === "subscription" && entry.status === "active") {
      if (entry.date > renewals) continue;
      items.push({
        id: `sub-${entry.id}`,
        tone: entry.date < today ? "overdue" : "soon",
        text: `${entry.name} renews ${formatDate(entry.date)}`,
        href: "/k7n/admin/money",
      });
    }
    if ((entry.kind === "salary" || entry.kind === "contractor") && entry.status === "due") {
      if (entry.date > soon) continue;
      items.push({
        id: `pay-${entry.id}`,
        tone: entry.date < today ? "overdue" : "soon",
        text: `${entry.name} is due ${formatDate(entry.date)}`,
        href: "/k7n/admin/money",
      });
    }
  }

  return items.sort((a, b) => Number(a.tone === "soon") - Number(b.tone === "soon"));
}

export function milestonesDue(db: DB, today: string) {
  const limit = addDays(today, 14);
  return db.milestones
    .filter((milestone) => {
      if (milestone.status === "done" || !milestone.dueDate) return false;
      return milestone.dueDate <= limit;
    })
    .sort(byDate);
}

export function invoicesDue(db: DB, today: string) {
  const limit = addDays(today, 7);
  return db.invoices
    .filter((invoice) => {
      if (!invoiceIsOpen(invoice) || !invoice.dueDate) return false;
      return invoice.dueDate <= limit;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function byDate(a: Milestone, b: Milestone) {
  return a.dueDate.localeCompare(b.dueDate) || a.order - b.order;
}

export type AgendaItem = {
  id: string;
  date: string;
  kind: string;
  title: string;
  detail: string;
};

export function agenda(db: DB, ym: string): AgendaItem[] {
  const items: AgendaItem[] = [];

  for (const milestone of db.milestones) {
    if (milestone.dueDate.slice(0, 7) !== ym) continue;
    const project = db.projects.find((item) => item.id === milestone.projectId);
    items.push({
      id: milestone.id,
      date: milestone.dueDate,
      kind: "Milestone",
      title: milestone.name,
      detail: project?.title ?? "",
    });
  }

  for (const invoice of db.invoices) {
    if (invoice.status === "void" || invoice.status === "draft" || !invoice.dueDate) continue;
    if (invoice.dueDate.slice(0, 7) !== ym) continue;
    items.push({
      id: invoice.id,
      date: invoice.dueDate,
      kind: "Invoice",
      title: invoice.number,
      detail: formatMoney(invoice.amount, invoice.currency),
    });
  }

  for (const entry of db.entries) {
    if (!entry.date || entry.date.slice(0, 7) !== ym) continue;
    if (entry.kind === "subscription" && entry.status === "cancelled") continue;
    const kind =
      entry.kind === "subscription"
        ? "Renewal"
        : entry.kind === "salary"
          ? "Salary"
          : entry.kind === "contractor"
            ? "Contractor"
            : entry.kind === "draw"
              ? "Draw"
              : "Pass-through";
    items.push({
      id: entry.id,
      date: entry.date,
      kind,
      title: entry.name,
      detail: formatMoney(entry.amount, entry.currency),
    });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

export function portalAgenda(db: DB, clientId: string, ym: string): AgendaItem[] {
  const projectIds = new Set(
    db.projects.filter((project) => project.clientId === clientId).map((project) => project.id),
  );
  return agenda(db, ym).filter((item) => {
    if (item.kind === "Milestone") {
      const milestone = db.milestones.find((entry) => entry.id === item.id);
      return Boolean(milestone && projectIds.has(milestone.projectId));
    }
    if (item.kind === "Invoice") {
      const invoice = db.invoices.find((entry) => entry.id === item.id);
      return Boolean(invoice && projectIds.has(invoice.projectId));
    }
    return false;
  });
}

export function clientName(db: DB, clientId: string) {
  return db.clients.find((client) => client.id === clientId)?.name || "Unknown client";
}

export function projectTitle(db: DB, projectId: string) {
  return db.projects.find((project) => project.id === projectId)?.title || "Unknown project";
}

export function founderName(db: DB, founderId: string) {
  return db.founders.find((founder) => founder.id === founderId)?.name || "—";
}
