import { useState, type FormEvent } from "react";
import { formatDate, todayISO } from "@/dashboard/logic";
import { ReplyList } from "@/dashboard/Replies";
import { useDashboard } from "@/dashboard/store";
import { Empty, Field, FormError, Select } from "@/dashboard/ui";

export function UpdatesEditor({ clientId, projectId = "" }: { clientId: string; projectId?: string }) {
  const { db, founder, saveUpdate, saveReply } = useDashboard();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(todayISO);
  const [chosenProject, setChosenProject] = useState(projectId);
  const [error, setError] = useState<string | null>(null);
  const updates = db.updates
    .filter((update) => update.clientId === clientId && (projectId ? update.projectId === projectId : true))
    .sort((a, b) => b.date.localeCompare(a.date));
  const projects = db.projects.filter((project) => project.clientId === clientId);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("An update needs a title and a message.");
      return;
    }
    saveUpdate({
      id: crypto.randomUUID(),
      clientId,
      projectId: projectId || chosenProject,
      date: date || todayISO(),
      title: title.trim(),
      body: body.trim(),
      hidden: false,
    });
    setTitle("");
    setBody("");
    setDate(todayISO());
    setError(null);
  };

  return (
    <section className="border-3 border-ink bg-paper">
      <h3 className="label-lg border-b-3 border-ink bg-lavender px-4 py-3">Updates for the client</h3>
      <form onSubmit={submit} className="grid gap-4 p-4 md:grid-cols-2">
        <Field label="Title">
          <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Date">
          <input type="date" className="field" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        {projectId ? null : (
          <div className="md:col-span-2">
            <Field label="Project">
              <Select value={chosenProject} onChange={(event) => setChosenProject(event.target.value)}>
                <option value="">Whole account</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        )}
        <div className="md:col-span-2">
          <Field label="Message">
            <textarea className="field resize-y" rows={3} value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <FormError message={error} />
          <button type="submit" className="btn btn-sm btn-ink">
            Publish
          </button>
        </div>
      </form>
      {updates.length === 0 ? (
        <div className="px-4 pb-4">
          <Empty>No updates published.</Empty>
        </div>
      ) : (
        <ul>
          {updates.map((update) => {
            const project = db.projects.find((item) => item.id === update.projectId);
            return (
              <li key={update.id} className="border-t-3 border-ink bg-paper px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{update.title}</p>
                    <p className="label mt-1 text-ink/60">
                      {formatDate(update.date)}
                      {project ? ` · ${project.title}` : " · Whole account"}
                      {update.hidden ? " · Hidden" : ""}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-body">{update.body}</p>
                    <ReplyList
                      replies={db.replies.filter((reply) => reply.updateId === update.id)}
                      onReply={(body) =>
                        saveReply({
                          id: crypto.randomUUID(),
                          updateId: update.id,
                          clientId: update.clientId,
                          body,
                          date: todayISO(),
                          from: "founder",
                          authorName: founder?.name || "Founder",
                        })
                      }
                    />
                  </div>
                  <button type="button" className="label" onClick={() => saveUpdate({ ...update, hidden: !update.hidden })}>
                    {update.hidden ? "Show in portal" : "Hide from portal"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
