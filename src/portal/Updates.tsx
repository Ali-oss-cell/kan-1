import { formatDate, todayISO } from "@/dashboard/logic";
import { ReplyList } from "@/dashboard/Replies";
import { useDashboard } from "@/dashboard/store";
import { Empty, PageHeading } from "@/dashboard/ui";

export function PortalUpdates() {
  const { db, portalClient, saveReply } = useDashboard();
  if (!portalClient) return null;
  const updates = db.updates
    .filter((update) => update.clientId === portalClient.id && !update.hidden)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeading title="Updates" lede="Notes KAN has published for you. You can reply under each one." />
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
                <ReplyList
                  replies={db.replies.filter((reply) => reply.updateId === update.id)}
                  onReply={(body) =>
                    saveReply({
                      id: crypto.randomUUID(),
                      updateId: update.id,
                      clientId: portalClient.id,
                      body,
                      date: todayISO(),
                      from: "client",
                      authorName: portalClient.name,
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
