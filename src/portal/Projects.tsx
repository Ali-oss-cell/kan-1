import { useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDate, formatMoney, founderName, labelOf, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { FileLink } from "@/dashboard/FileLink";
import { APPROVALS, MILESTONE_STATUSES, PROJECT_STATUSES } from "@/dashboard/types";
import { Empty, Field, FormError, PageHeading, Status } from "@/dashboard/ui";

export function PortalProjects() {
  const { db, portalClient, setMilestoneApproval, saveFile } = useDashboard();
  const [params, setParams] = useSearchParams();
  if (!portalClient) return null;
  const projects = db.projects.filter((project) => project.clientId === portalClient.id);
  const selected = projects.find((project) => project.id === params.get("project")) ?? projects[0] ?? null;
  const milestones = selected
    ? db.milestones
        .filter((milestone) => milestone.projectId === selected.id)
        .sort((a, b) => a.order - b.order || a.dueDate.localeCompare(b.dueDate))
    : [];
  const files = selected
    ? db.files.filter((file) => file.shared && file.ownerType === "project" && file.ownerId === selected.id)
    : [];

  return (
    <>
      <PageHeading title="Projects" lede="Status, dates, and milestones for your work." />
      {projects.length === 0 ? (
        <Empty>No projects yet.</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <ul className="border-3 border-ink bg-paper lg:col-span-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className={`border-b-3 border-ink bg-paper last:border-b-0 ${selected?.id === project.id ? "shadow-[inset_8px_0_0_#0f0f0f]" : ""}`}
              >
                <button type="button" className="w-full px-4 py-3 text-left" onClick={() => setParams({ project: project.id })}>
                  <span className="font-bold">{project.title}</span>
                  <span className="mt-1 block text-small text-ink/70">{project.offer}</span>
                </button>
              </li>
            ))}
          </ul>
          {selected ? (
            <article className="grid gap-6 lg:col-span-8">
              <div className="border-3 border-ink bg-paper p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-[32px] font-extrabold uppercase leading-none">{selected.title}</h2>
                  <Status value={selected.status} label={labelOf(PROJECT_STATUSES, selected.status)} />
                </div>
                <dl className="mt-5 grid gap-3 text-small sm:grid-cols-2">
                  <div>
                    <dt className="label text-ink/50">Offer</dt>
                    <dd>{selected.offer}</dd>
                  </div>
                  <div>
                    <dt className="label text-ink/50">Lead</dt>
                    <dd>{founderName(db, selected.leadFounderId)}</dd>
                  </div>
                  <div>
                    <dt className="label text-ink/50">Dates</dt>
                    <dd>
                      {formatDate(selected.startDate)} → {formatDate(selected.endDate)}
                    </dd>
                  </div>
                  {selected.showPrice ? (
                    <div>
                      <dt className="label text-ink/50">Price</dt>
                      <dd>{formatMoney(selected.price, selected.currency)}</dd>
                    </div>
                  ) : null}
                </dl>
                {selected.clientSummary ? <p className="mt-4 whitespace-pre-wrap text-body">{selected.clientSummary}</p> : null}
              </div>
              <section className="border-3 border-ink bg-paper">
                <h3 className="label-lg border-b-3 border-ink bg-paper px-4 py-3">Milestones</h3>
                {milestones.length === 0 ? (
                  <div className="p-4">
                    <Empty>No milestones yet.</Empty>
                  </div>
                ) : (
                  <ul>
                    {milestones.map((milestone) => (
                      <li key={milestone.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-bold">{milestone.name}</p>
                          <Status value={milestone.status} label={labelOf(MILESTONE_STATUSES, milestone.status)} />
                        </div>
                        <p className="mt-1 text-small text-ink/70">
                          {formatDate(milestone.dueDate)}
                          {milestone.approval !== "none" ? ` · ${labelOf(APPROVALS, milestone.approval)}` : ""}
                        </p>
                        {milestone.clientNote ? <p className="mt-2 text-body">{milestone.clientNote}</p> : null}
                        {milestone.approval === "asked" || milestone.approval === "changes" ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-paper"
                              onClick={() => setMilestoneApproval(milestone.id, "approved", portalClient.name)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-paper"
                              onClick={() => setMilestoneApproval(milestone.id, "changes", portalClient.name)}
                            >
                              Request changes
                            </button>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="border-3 border-ink bg-paper">
                <h3 className="label-lg border-b-3 border-ink bg-paper px-4 py-3">Files</h3>
                {files.length === 0 ? (
                  <div className="p-4">
                    <Empty>No shared files.</Empty>
                  </div>
                ) : (
                  <ul>
                    {files.map((file) => (
                      <li key={file.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
                        <FileLink name={file.name} dataUrl={file.dataUrl} downloadUrl={file.downloadUrl} />
                        {file.note ? <p className="mt-1 text-small">{file.note}</p> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <ClientFileForm
                onSave={(file) =>
                  saveFile({
                    ...file,
                    ownerType: "project",
                    ownerId: selected.id,
                    shared: true,
                    fromClient: true,
                  })
                }
              />
            </article>
          ) : null}
        </div>
      )}
    </>
  );
}

function ClientFileForm({
  onSave,
}: {
  onSave: (file: { id: string; name: string; note: string; dataUrl: string; addedAt: string }) => Promise<string | null>;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 400_000) {
      setError("Keep files under 400 KB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read"));
      reader.readAsDataURL(file);
    });
    const problem = await onSave({
      id: crypto.randomUUID(),
      name: file.name,
      note: note.trim() || "Sent from the portal",
      dataUrl,
      addedAt: todayISO(),
    });
    setError(problem);
    if (!problem) setNote("");
  };

  return (
    <form className="border-3 border-ink bg-paper p-4" onSubmit={(event) => event.preventDefault()}>
      <h3 className="label-lg mb-3">Send a file</h3>
      <p className="mb-4 text-small text-ink/70">Copy, a logo, or anything we are waiting on. It shows up in Founders.</p>
      <div className="grid gap-4">
        <Field label="Note">
          <input className="field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Homepage copy, logo, reference" />
        </Field>
        <Field label="File, up to 400 KB">
          <input type="file" className="field" onChange={onFile} />
        </Field>
        <FormError message={error} />
      </div>
    </form>
  );
}
