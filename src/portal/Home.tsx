import { Link } from "react-router-dom";
import { formatDate, labelOf } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { PROJECT_STATUSES } from "@/dashboard/types";
import { Empty, PageHeading, Status } from "@/dashboard/ui";

export function PortalHome() {
  const { db, portalClient } = useDashboard();
  if (!portalClient) return null;
  const projects = db.projects.filter((project) => project.clientId === portalClient.id);
  const updates = db.updates
    .filter((update) => update.clientId === portalClient.id && !update.hidden)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      <PageHeading title={`Hello, ${portalClient.name}`} lede="Where your work with KAN stands." />
      <section>
        <h2 className="label-lg mb-4">Projects</h2>
        {projects.length === 0 ? (
          <Empty>No projects yet.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {projects.map((project) => (
              <li key={project.id} className="border-b-3 border-ink bg-paper last:border-b-0">
                <Link to={`/k7n/portal/projects?project=${project.id}`} className="block px-4 py-4">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold">{project.title}</span>
                    <Status value={project.status} label={labelOf(PROJECT_STATUSES, project.status)} />
                  </span>
                  <span className="mt-1 block text-small text-ink/70">
                    {project.offer} · {formatDate(project.startDate)} → {formatDate(project.endDate)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-10">
        <h2 className="label-lg mb-4">Latest updates</h2>
        {updates.length === 0 ? (
          <Empty>No updates yet.</Empty>
        ) : (
          <ul className="border-3 border-ink bg-paper">
            {updates.map((update) => {
              const project = db.projects.find((item) => item.id === update.projectId);
              return (
                <li key={update.id} className="border-b-3 border-ink bg-paper px-4 py-4 last:border-b-0">
                  <p className="font-bold">{update.title}</p>
                  <p className="label mt-1 text-ink/60">
                    {formatDate(update.date)}
                    {project ? ` · ${project.title}` : ""}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-body">{update.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
