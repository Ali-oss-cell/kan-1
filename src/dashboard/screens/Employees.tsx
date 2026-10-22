import { useState, type FormEvent } from "react";
import { formatDate, formatMoney, labelOf, projectTitle, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import {
  EMPLOYEE_STATUSES,
  TASK_STATUSES,
  type Employee,
  type EmployeeStatus,
  type Task,
  type TaskStatus,
} from "@/dashboard/types";
import { Empty, Field, FormError, Options, PageHeading, Select, Status } from "@/dashboard/ui";

const emptyEmployee = (id: string): Employee => ({
  id,
  name: "",
  email: "",
  role: "",
  phone: "",
  salary: 0,
  currency: "USD",
  status: "active",
  portalEnabled: false,
  portalSalt: "",
  portalPasswordHash: "",
  notes: "",
});

export function Employees() {
  const { db, saveEmployee, deleteEmployee, setCrewAccess, saveAssignment, deleteAssignment, saveTask, deleteTask } =
    useDashboard();
  const [selectedId, setSelectedId] = useState<string | null>(db.employees[0]?.id ?? null);
  const [form, setForm] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const employee = db.employees.find((item) => item.id === selectedId) ?? null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form || !form.name.trim()) {
      setError("Name is required.");
      return;
    }
    saveEmployee({ ...form, name: form.name.trim() });
    setSelectedId(form.id);
    setForm(null);
    setError(null);
  };

  return (
    <>
      <PageHeading
        title="Employees"
        lede="Add someone, set their salary, and choose the projects they can open in the crew area."
        action={
          <button type="button" className="btn btn-sm btn-periwinkle" onClick={() => setForm(emptyEmployee(crypto.randomUUID()))}>
            New employee
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
          <Field label="Role">
            <input className="field" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Designer, developer" />
          </Field>
          <Field label="Phone">
            <input className="field" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          <Field label="Monthly salary">
            <input type="number" min={0} step="0.01" className="field" value={form.salary} onChange={(event) => setForm({ ...form, salary: Number(event.target.value) })} />
          </Field>
          <Field label="Currency">
            <input className="field" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as EmployeeStatus })}>
              <Options items={EMPLOYEE_STATUSES} />
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Notes">
              <textarea className="field resize-y" rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <FormError message={error} />
            <button type="submit" className="btn btn-sm btn-ink">Save employee</button>
            <button type="button" className="btn btn-sm btn-paper" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : null}
      {db.employees.length === 0 ? (
        <Empty>No employees yet.</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <ul className="border-3 border-ink bg-paper lg:col-span-4">
            {db.employees.map((item) => (
              <li key={item.id} className={`border-b-3 border-ink bg-paper last:border-b-0 ${item.id === employee?.id ? "shadow-[inset_8px_0_0_#0f0f0f]" : ""}`}>
                <button type="button" className="w-full px-4 py-3 text-left" onClick={() => setSelectedId(item.id)}>
                  <span className="font-bold">{item.name}</span>
                  <span className="mt-1 block text-small text-ink/70">{item.role || "No role"} · {formatMoney(item.salary, item.currency)}</span>
                </button>
              </li>
            ))}
          </ul>
          {employee ? (
            <EmployeeDetail
              employee={employee}
              onEdit={() => setForm(employee)}
              onDelete={() => {
                if (window.confirm(`Delete ${employee.name}?`)) deleteEmployee(employee.id);
              }}
              onAccess={setCrewAccess}
              onAssign={(projectId, on) => {
                const existing = db.assignments.find((item) => item.employeeId === employee.id && item.projectId === projectId);
                if (on && !existing) saveAssignment({ id: crypto.randomUUID(), projectId, employeeId: employee.id });
                if (!on && existing) deleteAssignment(existing.id);
              }}
              onSaveTask={saveTask}
              onDeleteTask={deleteTask}
            />
          ) : null}
        </div>
      )}
    </>
  );
}

function EmployeeDetail({
  employee,
  onEdit,
  onDelete,
  onAccess,
  onAssign,
  onSaveTask,
  onDeleteTask,
}: {
  employee: Employee;
  onEdit: () => void;
  onDelete: () => void;
  onAccess: (id: string, enabled: boolean, password: string) => Promise<string | null>;
  onAssign: (projectId: string, on: boolean) => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}) {
  const { db } = useDashboard();
  const [enabled, setEnabled] = useState(employee.portalEnabled);
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const tasks = db.tasks.filter((task) => task.employeeId === employee.id);
  const time = db.timeEntries.filter((entry) => entry.employeeId === employee.id);
  const hours = time.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <article className="grid gap-6 lg:col-span-8">
      <div className="border-3 border-ink bg-paper p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-[32px] font-extrabold uppercase leading-none">{employee.name}</h2>
          <Status value={employee.status} label={labelOf(EMPLOYEE_STATUSES, employee.status)} />
        </div>
        <p className="mt-3 text-body">{employee.role || "No role"} · {employee.email || "No email"}</p>
        <p className="mt-2 text-body">Salary {formatMoney(employee.salary, employee.currency)} a month · {hours} hours logged</p>
        {employee.notes ? <p className="mt-3 whitespace-pre-wrap text-body">{employee.notes}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-sm btn-paper" onClick={onEdit}>Edit</button>
          <button type="button" className="btn btn-sm bg-purple" onClick={onDelete}>Delete</button>
        </div>
      </div>
      <form
        className="border-3 border-ink bg-paper p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setAccessError(await onAccess(employee.id, enabled, password));
          setPassword("");
        }}
      >
        <h3 className="label-lg mb-3">Crew sign-in</h3>
        <p className="mb-3 text-small text-ink/70">They sign in at /k7n/crew with {employee.email || "their email"}.</p>
        <label className="mb-3 flex items-center gap-3">
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
          <span>Let this employee sign in</span>
        </label>
        <Field label={employee.portalPasswordHash ? "New password, optional" : "Starting password"}>
          <input type="password" className="field" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <FormError message={accessError} />
        <button type="submit" className="btn btn-sm btn-ink mt-3">Save crew access</button>
      </form>
      <section className="border-3 border-ink bg-paper">
        <h3 className="label-lg border-b-3 border-ink bg-paper px-4 py-3">Projects they can work on</h3>
        {db.projects.length === 0 ? (
          <div className="p-4"><Empty>No projects yet.</Empty></div>
        ) : (
          <ul>
            {db.projects.map((project) => {
              const on = db.assignments.some((item) => item.employeeId === employee.id && item.projectId === project.id);
              return (
                <li key={project.id} className="border-b-3 border-ink px-4 py-3 last:border-b-0">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={on} onChange={(event) => onAssign(project.id, event.target.checked)} />
                    <span>{project.title}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section className="border-3 border-ink bg-paper p-4">
        <h3 className="label-lg mb-3">Tasks</h3>
        <form
          className="mb-4 grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim() || !projectId) return;
            onSaveTask({
              id: crypto.randomUUID(),
              projectId,
              employeeId: employee.id,
              title: title.trim(),
              detail: "",
              dueDate,
              status: "todo",
            });
            setTitle("");
          }}
        >
          <Field label="Task">
            <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field label="Project">
            <Select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
              <option value="">Choose</option>
              {db.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Due">
            <input type="date" className="field" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </Field>
          <div className="flex items-end">
            <button type="submit" className="btn btn-sm btn-ink">Add task</button>
          </div>
        </form>
        {tasks.length === 0 ? (
          <Empty>No tasks yet.</Empty>
        ) : (
          <ul className="border-3 border-ink">
            {tasks.map((task) => (
              <li key={task.id} className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink px-3 py-2 last:border-b-0">
                <span>
                  <span className="font-bold">{task.title}</span>
                  <span className="mt-1 block text-small text-ink/70">{projectTitle(db, task.projectId)} · {formatDate(task.dueDate)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Select value={task.status} onChange={(event) => onSaveTask({ ...task, status: event.target.value as TaskStatus })}>
                    <Options items={TASK_STATUSES} />
                  </Select>
                  <button type="button" className="label text-ink/60" onClick={() => onDeleteTask(task.id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
