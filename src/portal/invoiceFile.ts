import { formatDate, formatMoney, labelOf } from "@/dashboard/logic";
import { PAY_METHODS, type Client, type Invoice, type Project } from "@/dashboard/types";

export function downloadInvoice(invoice: Invoice, project: Project | undefined, client: Client) {
  const pay = labelOf(PAY_METHODS, invoice.payMethod);
  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8" />
<title>${invoice.number}</title>
<style>
  body { font-family: Georgia, serif; color: #0f0f0f; margin: 48px; }
  h1 { font-size: 32px; letter-spacing: 0.08em; margin: 0 0 8px; }
  p { line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  td { border-top: 2px solid #0f0f0f; padding: 10px 0; vertical-align: top; }
</style>
<h1>KAN</h1>
<p>Invoice ${invoice.number}</p>
<p>${client.company || client.name}<br />${client.billingEmail || client.email}</p>
<table>
  <tr><td>Project</td><td>${project?.title || ""}</td></tr>
  <tr><td>Description</td><td>${invoice.description || ""}</td></tr>
  <tr><td>Issued</td><td>${formatDate(invoice.issueDate)}</td></tr>
  <tr><td>Due</td><td>${formatDate(invoice.dueDate)}</td></tr>
  <tr><td>Amount</td><td>${formatMoney(invoice.amount, invoice.currency)}</td></tr>
  <tr><td>Status</td><td>${invoice.status}</td></tr>
  <tr><td>Pay by</td><td>${pay}${invoice.payMethodNote ? ` — ${invoice.payMethodNote}` : ""}</td></tr>
</table>
<p>This file does not charge a card. Open it and print, or save it as a PDF.</p>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.number}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
