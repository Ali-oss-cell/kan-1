import { useState, type FormEvent } from "react";
import { formatDate, projectTitle, thisMonth, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { Empty, Field, PageHeading, Select } from "@/dashboard/ui";

export function CrewTime() {
  const { db, crew, saveTime, deleteTime } = useDashboard();
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState("1");
  const [note, setNote] = useState("");
  if (!crew) return null;
  const assigned = db.projects.filter((project) =>
    db.assignments.some((item) => item.employeeId === crew.id && item.projectId === project.id),
  );
  const rows = db.timeEntries
    .filter((entry) => entry.employeeId === crew.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const monthHours = rows.filter((entry) => entry.date.startsWith(thisMonth())).reduce((sum, entry) => sum + entry.hours, 0);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(hours);
    if (!projectId || !Number.isFinite(value) || value <= 0) return;
    saveTime({
      id: crypto.randomUUID(),
      employeeId: crew.id,
      projectId,
      date: date || todayISO(),
      hours: value,
      note: note.trim(),
    });
    setNote("");
  };

  return (
    <>
      <PageHeading title="Time" lede={`${monthHours} hours logged this month.`} />
      <form onSubmit={submit} className="card mb-8 grid gap-5 p-6 md:grid-cols-2">
        <Field label="Project">
          <Select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
            <option value="">Choose</option>
            {assigned.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </Select>
        </Field>
        <Field label="Date">
          <input type="date" className="field" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="Hours">
          <input type="number" min={0.25} step="0.25" className="field" value={hours} onChange={(event) => setHours(event.target.value)} />
        </Field>
        <Field label="Note">
          <input className="field" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What you did" />
        </Field>
        <button type="submit" className="btn btn-sm btn-ink w-fit">Add time</button>
      </form>
      {rows.length === 0 ? (
        <Empty>No time logged yet.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {rows.map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
              <span>
                <span className="font-bold">{entry.hours} h · {projectTitle(db, entry.projectId)}</span>
                <span className="mt-1 block text-small text-ink/70">{formatDate(entry.date)}{entry.note ? ` · ${entry.note}` : ""}</span>
              </span>
              <button type="button" className="label text-ink/60" onClick={() => deleteTime(entry.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
