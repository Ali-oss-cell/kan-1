import { Link } from "react-router-dom";
import { formatDate, formatMoney, labelOf, projectTitle, thisMonth } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { TASK_STATUSES } from "@/dashboard/types";
import { Empty, PageHeading, Status } from "@/dashboard/ui";

export function CrewHome() {
  const { db, crew } = useDashboard();
  if (!crew) return null;
  const tasks = db.tasks.filter((task) => task.employeeId === crew.id && task.status !== "done");
  const month = thisMonth();
  const hours = db.timeEntries
    .filter((entry) => entry.employeeId === crew.id && entry.date.startsWith(month))
    .reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <>
      <PageHeading title={`Hello, ${crew.name}`} lede="Your open tasks, the hours you logged this month, and your salary." />
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="border-3 border-ink bg-paper p-5">
          <p className="label mb-3 text-ink/60">Hours this month</p>
          <p className="font-display text-[28px] font-extrabold leading-none">{hours}</p>
        </div>
        <div className="border-3 border-ink bg-paper p-5">
          <p className="label mb-3 text-ink/60">Salary</p>
          <p className="font-display text-[28px] font-extrabold leading-none">{formatMoney(crew.salary, crew.currency)}</p>
          <p className="mt-2 text-small text-ink/70">Each month</p>
        </div>
      </div>
      <h2 className="label-lg mb-4">Open tasks</h2>
      {tasks.length === 0 ? (
        <Empty>No open tasks.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {tasks.map((task) => (
            <li key={task.id} className="border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link to="/k7n/crew/tasks" className="font-bold">{task.title}</Link>
                <Status value={task.status} label={labelOf(TASK_STATUSES, task.status)} />
              </div>
              <p className="mt-1 text-small text-ink/70">{projectTitle(db, task.projectId)} · {formatDate(task.dueDate)}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
