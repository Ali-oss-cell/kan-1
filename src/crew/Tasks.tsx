import { formatDate, labelOf, projectTitle } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { TASK_STATUSES, type TaskStatus } from "@/dashboard/types";
import { Empty, Options, PageHeading, Select, Status } from "@/dashboard/ui";

export function CrewTasks() {
  const { db, crew, saveTask } = useDashboard();
  if (!crew) return null;
  const tasks = db.tasks
    .filter((task) => task.employeeId === crew.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <>
      <PageHeading title="Tasks" lede="Work assigned to you. Move a task when you start it or finish it." />
      {tasks.length === 0 ? (
        <Empty>No tasks yet.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {tasks.map((task) => (
            <li key={task.id} className="grid gap-3 border-b-3 border-ink bg-paper px-4 py-3 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-bold">{task.title}</p>
                <p className="text-small text-ink/70">{projectTitle(db, task.projectId)} · {formatDate(task.dueDate)}</p>
                {task.detail ? <p className="mt-2 text-body">{task.detail}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <Status value={task.status} label={labelOf(TASK_STATUSES, task.status)} />
                <Select value={task.status} onChange={(event) => saveTask({ ...task, status: event.target.value as TaskStatus })}>
                  <Options items={TASK_STATUSES} />
                </Select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
