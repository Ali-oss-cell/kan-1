import { useState, type FormEvent } from "react";
import { formatDate, formatMoney, labelOf, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import {
  emptyInquiry,
  INQUIRY_STATUSES,
  OFFERS,
  QUOTE_STATUSES,
  type Inquiry,
  type InquiryStatus,
} from "@/dashboard/types";
import { Empty, Field, FormError, Options, PageHeading, Select, Status } from "@/dashboard/ui";

export function Inquiries() {
  const { db, saveInquiry, deleteInquiry, winInquiry } = useDashboard();
  const [form, setForm] = useState<Inquiry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [withProject, setWithProject] = useState(true);
  const rows = [...db.inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    saveInquiry({ ...form, name: form.name.trim(), createdAt: form.createdAt || todayISO() });
    setForm(null);
    setError(null);
  };

  return (
    <>
      <PageHeading
        title="Inquiries"
        lede="Leads typed in here. A quote sets the price. Accepting it opens the client and the project."
        action={
          <button
            type="button"
            className="btn btn-sm btn-periwinkle"
            onClick={() => {
              setForm(emptyInquiry(crypto.randomUUID()));
              setError(null);
            }}
          >
            New inquiry
          </button>
        }
      />
      {form ? (
        <form onSubmit={submit} className="card mb-8 grid gap-5 p-6 md:grid-cols-2">
          <Field label="Name">
            <input className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </Field>
          <Field label="Email">
            <input type="email" className="field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field label="Offer">
            <Select value={form.offer} onChange={(event) => setForm({ ...form, offer: event.target.value })}>
              {OFFERS.map((offer) => (
                <option key={offer}>{offer}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as InquiryStatus })}
            >
              <Options items={INQUIRY_STATUSES} />
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Message">
              <textarea className="field resize-y" rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <FormError message={error} />
            <button type="submit" className="btn btn-sm btn-ink">
              Save inquiry
            </button>
            <button type="button" className="btn btn-sm btn-paper" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {rows.length === 0 ? (
        <Empty>No inquiries yet.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {rows.map((inquiry) => (
            <li key={inquiry.id} className="grid gap-3 border-b-3 border-ink bg-paper p-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{inquiry.name}</p>
                  <Status value={inquiry.status} label={labelOf(INQUIRY_STATUSES, inquiry.status)} />
                </div>
                <p className="mt-1 text-small text-ink/70">
                  {inquiry.offer || "No offer"} · {inquiry.email || "No email"} · {formatDate(inquiry.createdAt)}
                </p>
                {inquiry.message ? <p className="mt-2 whitespace-pre-wrap text-body">{inquiry.message}</p> : null}
                <QuoteBox inquiry={inquiry} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {inquiry.clientId ? (
                  <span className="label">Client saved</span>
                ) : (
                  <>
                    <label className="flex items-center gap-2 text-small">
                      <input type="checkbox" checked={withProject} onChange={(event) => setWithProject(event.target.checked)} />
                      Also open a project
                    </label>
                    <button type="button" className="btn btn-sm btn-periwinkle" onClick={() => winInquiry(inquiry.id, withProject)}>
                      Won
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="label text-ink/60"
                  onClick={() => {
                    if (window.confirm("Delete this inquiry?")) deleteInquiry(inquiry.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function QuoteBox({ inquiry }: { inquiry: Inquiry }) {
  const { db, saveQuote, acceptQuote } = useDashboard();
  const quote = db.quotes.find((item) => item.inquiryId === inquiry.id) ?? null;
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState(inquiry.message);
  const [error, setError] = useState<string | null>(null);

  if (quote) {
    return (
      <div className="mt-3 border-3 border-ink bg-paper p-3">
        <p className="font-bold">
          {quote.title} · {formatMoney(quote.amount, quote.currency)}
        </p>
        <p className="text-small text-ink/70">{labelOf(QUOTE_STATUSES, quote.status)}</p>
        {quote.note ? <p className="mt-1 text-small">{quote.note}</p> : null}
        {quote.status === "accepted" ? (
          <p className="mt-2 text-small">Project opened from this quote.</p>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-paper mt-3"
            onClick={() => {
              void acceptQuote(quote.id).then(setError);
            }}
          >
            Accept and open project
          </button>
        )}
        <FormError message={error} />
      </div>
    );
  }

  return (
    <form
      className="mt-3 grid gap-3 border-3 border-ink bg-paper p-3"
      onSubmit={(event) => {
        event.preventDefault();
        const price = Number(amount);
        if (!Number.isFinite(price) || price <= 0) {
          setError("Enter a price.");
          return;
        }
        saveQuote({
          id: crypto.randomUUID(),
          inquiryId: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          offer: inquiry.offer,
          title: `${inquiry.name} — ${inquiry.offer || "Project"}`,
          amount: price,
          currency: "USD",
          note: note.trim(),
          status: "sent",
          date: todayISO(),
          clientId: inquiry.clientId,
          projectId: "",
        });
        setError(null);
      }}
    >
      <p className="label">Quote</p>
      <Field label="Price, USD">
        <input className="field" type="number" min={0} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </Field>
      <Field label="Note on the quote">
        <input className="field" value={note} onChange={(event) => setNote(event.target.value)} />
      </Field>
      <FormError message={error} />
      <button type="submit" className="btn btn-sm btn-ink w-fit">
        Save quote
      </button>
    </form>
  );
}
