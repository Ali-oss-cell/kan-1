import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { clientName, formatDate, formatMoney, founderName, labelOf, todayISO } from "@/dashboard/logic";
import { NotesAndFiles } from "@/dashboard/NotesAndFiles";
import { UpdatesEditor } from "@/dashboard/UpdatesEditor";
import { useDashboard } from "@/dashboard/store";
import {
  APPROVALS,
  emptyProject,
  MILESTONE_STATUSES,
  OFFERS,
  PROJECT_STATUSES,
  type Approval,
  type Milestone,
  type MilestoneStatus,
  type Offer,
  type Project,
  type ProjectStatus,
} from "@/dashboard/types";
import { Empty, Field, FormError, Options, PageHeading, Select, Status } from "@/dashboard/ui";

export function Projects() {
  const { db, founder, saveProject, deleteProject, saveMilestone, deleteMilestone } = useDashboard();
  const [params] = useSearchParams();
  const presetClient = params.get("client") ?? "";
  const openedPreset = useRef("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Project | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = db.projects.find((project) => project.id === selectedId) ?? null;

  useEffect(() => {
    if (!presetClient || !founder || openedPreset.current === presetClient) return;
    if (!db.clients.some((client) => client.id === presetClient)) return;
    openedPreset.current = presetClient;
    setForm(emptyProject(crypto.randomUUID(), presetClient, founder.id));
    setError(null);
  }, [presetClient, founder, db.clients]);

  const needle = query.trim().toLowerCase();
  const rows = db.projects
    .filter((project) => {
      if (!needle) return true;
      return [project.title, project.offer, clientName(db, project.clientId)].join(" ").toLowerCase().includes(needle);
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    if (!form.clientId) {
      setError("Assign the project to a client.");
      return;
    }
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!Number.isFinite(form.price) || form.price < 0) {
      setError("Price should be zero or more.");
      return;
    }
    saveProject({ ...form, title: form.title.trim(), currency: form.currency.trim().toUpperCase() || "USD" });
    setSelectedId(form.id);
    setForm(null);
    setError(null);
  };

  return (
    <>
      <PageHeading
        title="Projects"
        lede="One sold scope, assigned to one client."
        action={
          <button
            type="button"
            className="btn btn-sm btn-periwinkle"
            onClick={() => {
              setForm(emptyProject(crypto.randomUUID(), db.clients[0]?.id ?? "", founder?.id ?? ""));
              setError(null);
            }}
          >
            New project
          </button>
        }
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search projects"
        className="field mb-6"
        aria-label="Search projects"
      />
      {form ? (
        <ProjectForm
          form={form}
          setForm={setForm}
          onSubmit={submit}
          onCancel={() => setForm(null)}
          error={error}
        />
      ) : null}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {rows.length === 0 ? (
            <Empty>{db.projects.length === 0 ? "No projects yet." : "No projects match that search."}</Empty>
          ) : (
            <ul className="border-3 border-ink bg-paper">
              {rows.map((project) => (
                <li
                  key={project.id}
                  className={`border-b-3 border-ink bg-paper last:border-b-0 ${selectedId === project.id ? "shadow-[inset_8px_0_0_#0f0f0f]" : ""}`}
                >
                  <button type="button" className="w-full px-4 py-3 text-left" onClick={() => setSelectedId(project.id)}>
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold">{project.title}</span>
                      <Status value={project.status} label={labelOf(PROJECT_STATUSES, project.status)} />
                    </span>
                    <span className="mt-1 block text-small text-ink/70">
                      {clientName(db, project.clientId)} · {project.offer}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-7">
          {selected ? (
            <ProjectDetail
              project={selected}
              onEdit={() => {
                setForm(selected);
                setError(null);
              }}
              onDelete={() => {
                if (!window.confirm("Delete this project, its milestones, and its invoices?")) return;
                deleteProject(selected.id);
                setSelectedId(null);
              }}
              onSaveMilestone={saveMilestone}
              onDeleteMilestone={deleteMilestone}
            />
          ) : (
            <Empty>Select a project.</Empty>
          )}
        </div>
      </div>
    </>
  );
}

function ProjectForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  error,
}: {
  form: Project;
  setForm: (project: Project) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  error: string | null;
}) {
  const { db } = useDashboard();
  return (
    <form onSubmit={onSubmit} className="card mb-8 grid gap-5 p-6 md:grid-cols-2">
      <Field label="Client">
        <Select value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })}>
          <option value="">Choose a client</option>
          {db.clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Offer">
        <Select
          value={form.offer}
          onChange={(event) => {
            const offer = event.target.value as Offer;
            setForm({
              ...form,
              offer,
              schedule: offer === "Growth Marketing" ? "retainer" : form.schedule,
            });
          }}
        >
          {OFFERS.map((offer) => (
            <option key={offer}>{offer}</option>
          ))}
        </Select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Title">
          <input className="field" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </Field>
      </div>
      <Field label="Status">
        <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}>
          <Options items={PROJECT_STATUSES} />
        </Select>
      </Field>
      <Field label="Billing">
        <Select
          value={form.schedule}
          onChange={(event) => setForm({ ...form, schedule: event.target.value as Project["schedule"] })}
        >
          <option value="fixed">Fixed scope</option>
          <option value="retainer">Monthly retainer</option>
        </Select>
      </Field>
      <Field label="Start">
        <input type="date" className="field" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
      </Field>
      <Field label="Target end">
        <input type="date" className="field" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
      </Field>
      <Field label="Price agreed">
        <input
          type="number"
          min={0}
          step="0.01"
          className="field"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
        />
      </Field>
      <Field label="Currency">
        <input className="field" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })} />
      </Field>
      <Field label="Lead founder">
        <Select value={form.leadFounderId} onChange={(event) => setForm({ ...form, leadFounderId: event.target.value })}>
          <option value="">Unassigned</option>
          {db.founders.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center gap-3 md:col-span-2">
        <input
          type="checkbox"
          checked={form.showPrice}
          onChange={(event) => setForm({ ...form, showPrice: event.target.checked })}
        />
        <span className="text-body">Show the price in the client portal</span>
      </label>
      <div className="md:col-span-2">
        <Field label="Scope">
          <textarea className="field resize-y" rows={3} value={form.scope} onChange={(event) => setForm({ ...form, scope: event.target.value })} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Summary the client can see">
          <textarea
            className="field resize-y"
            rows={3}
            value={form.clientSummary}
            onChange={(event) => setForm({ ...form, clientSummary: event.target.value })}
            placeholder="A short note for the portal. The scope above stays here."
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-3 md:col-span-2">
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-ink">
          Save project
        </button>
        <button type="button" className="btn btn-sm btn-paper" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProjectDetail({
  project,
  onEdit,
  onDelete,
  onSaveMilestone,
  onDeleteMilestone,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onSaveMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}) {
  const { db } = useDashboard();
  const milestones = db.milestones
    .filter((milestone) => milestone.projectId === project.id)
    .sort((a, b) => a.order - b.order || a.dueDate.localeCompare(b.dueDate));
  const [draft, setDraft] = useState<Milestone | null>(null);
  const [milestoneError, setMilestoneError] = useState<string | null>(null);

  const submitMilestone = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.name.trim()) {
      setMilestoneError("Milestone name is required.");
      return;
    }
    onSaveMilestone({ ...draft, name: draft.name.trim() });
    setDraft(null);
    setMilestoneError(null);
  };

  return (
    <article className="grid gap-6">
      <div className="border-3 border-ink bg-paper p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[32px] font-extrabold uppercase leading-none">{project.title}</h2>
            <p className="mt-2 text-body text-ink/70">
              {clientName(db, project.clientId)} · {project.offer}
            </p>
          </div>
          <Status value={project.status} label={labelOf(PROJECT_STATUSES, project.status)} />
        </div>
        <dl className="mt-5 grid gap-3 text-small sm:grid-cols-2">
          <div>
            <dt className="label text-ink/50">Dates</dt>
            <dd>
              {formatDate(project.startDate)} → {formatDate(project.endDate)}
            </dd>
          </div>
          <div>
            <dt className="label text-ink/50">Price</dt>
            <dd>{formatMoney(project.price, project.currency)}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Lead</dt>
            <dd>{founderName(db, project.leadFounderId)}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Billing</dt>
            <dd>{project.schedule === "retainer" ? "Monthly retainer" : "Fixed scope"}</dd>
          </div>
        </dl>
        {project.scope ? <p className="mt-4 whitespace-pre-wrap text-body">{project.scope}</p> : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn btn-sm btn-periwinkle" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="btn btn-sm bg-purple" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <section className="border-3 border-ink bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-ink bg-paper px-4 py-3">
          <h3 className="label-lg">Milestones</h3>
          <button
            type="button"
            className="btn btn-sm bg-paper"
            onClick={() => {
              const order = milestones.reduce((max, milestone) => Math.max(max, milestone.order), 0) + 1;
              setDraft({
                id: crypto.randomUUID(),
                projectId: project.id,
                name: "",
                dueDate: todayISO(),
                status: "not_started",
                amount: null,
                note: "",
                clientNote: "",
                approval: "none",
                order,
              });
              setMilestoneError(null);
            }}
          >
            Add milestone
          </button>
        </div>
        {draft ? (
          <form onSubmit={submitMilestone} className="grid gap-4 border-b-3 border-ink p-4 md:grid-cols-2">
            <Field label="Name">
              <input className="field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </Field>
            <Field label="Due">
              <input type="date" className="field" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onChange={(event) => setDraft({ ...draft, status: event.target.value as MilestoneStatus })}
              >
                <Options items={MILESTONE_STATUSES} />
              </Select>
            </Field>
            <Field label="Amount, optional">
              <input
                type="number"
                min={0}
                step="0.01"
                className="field"
                value={draft.amount ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    amount: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Internal note">
                <input className="field" value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
              </Field>
            </div>
            <Field label="Client approval">
              <Select
                value={draft.approval}
                onChange={(event) => setDraft({ ...draft, approval: event.target.value as Approval })}
              >
                <Options items={APPROVALS} />
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Note the client can see">
                <input className="field" value={draft.clientNote} onChange={(event) => setDraft({ ...draft, clientNote: event.target.value })} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <FormError message={milestoneError} />
              <button type="submit" className="btn btn-sm btn-ink">
                Save milestone
              </button>
              <button type="button" className="btn btn-sm btn-paper" onClick={() => setDraft(null)}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {milestones.length === 0 ? (
          <div className="p-4">
            <Empty>No milestones yet. A retainer can use a monthly check-in here.</Empty>
          </div>
        ) : (
          <ul>
            {milestones.map((milestone) => (
              <li key={milestone.id} className="flex flex-wrap items-start justify-between gap-3 border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                <div>
                  <p className="font-bold">{milestone.name}</p>
                  <p className="text-small text-ink/70">
                    {formatDate(milestone.dueDate)}
                    {milestone.amount != null ? ` · ${formatMoney(milestone.amount, project.currency)}` : ""}
                  </p>
                  {milestone.note ? <p className="mt-1 text-small">{milestone.note}</p> : null}
                  {milestone.clientNote ? <p className="mt-1 text-small">Client: {milestone.clientNote}</p> : null}
                  {milestone.approval !== "none" ? (
                    <p className="mt-1 text-small">{labelOf(APPROVALS, milestone.approval)}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Status value={milestone.status} label={labelOf(MILESTONE_STATUSES, milestone.status)} />
                  {milestone.status !== "done" ? (
                    <button
                      type="button"
                      className="label"
                      onClick={() => onSaveMilestone({ ...milestone, status: "done" })}
                    >
                      Done
                    </button>
                  ) : null}
                  <button type="button" className="label" onClick={() => setDraft(milestone)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="label text-ink/60"
                    onClick={() => {
                      if (window.confirm("Delete this milestone?")) onDeleteMilestone(milestone.id);
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
      <UpdatesEditor clientId={project.clientId} projectId={project.id} />
      <NotesAndFiles ownerType="project" ownerId={project.id} />
    </article>
  );
}
