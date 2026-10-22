import { formatDate, labelOf } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { PROJECT_STATUSES } from "@/dashboard/types";
import { Empty, PageHeading, Status } from "@/dashboard/ui";

export function CrewProjects() {
  const { db, crew } = useDashboard();
  if (!crew) return null;
  const ids = new Set(db.assignments.filter((item) => item.employeeId === crew.id).map((item) => item.projectId));
  const projects = db.projects.filter((project) => ids.has(project.id));

  return (
    <>
      <PageHeading title="Projects" lede="Only the work you are assigned to. Client money and internal notes stay in Founders." />
      {projects.length === 0 ? (
        <Empty>No projects assigned yet.</Empty>
      ) : (
        <ul className="border-3 border-ink bg-paper">
          {projects.map((project) => {
            const client = db.clients.find((item) => item.id === project.clientId);
            const tasks = db.tasks.filter((task) => task.projectId === project.id && task.employeeId === crew.id);
            return (
              <li key={project.id} className="border-b-3 border-ink bg-paper px-4 py-4 last:border-b-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{project.title}</p>
                  <Status value={project.status} label={labelOf(PROJECT_STATUSES, project.status)} />
                </div>
                <p className="mt-1 text-small text-ink/70">
                  {project.offer} · {client?.company || client?.name || "Client"} · {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </p>
                {project.clientSummary ? <p className="mt-2 text-body">{project.clientSummary}</p> : null}
                {tasks.length > 0 ? (
                  <ul className="mt-3">
                    {tasks.map((task) => (
                      <li key={task.id} className="text-small">{task.title}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
