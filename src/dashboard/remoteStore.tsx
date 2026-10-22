import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { DashboardContext } from "@/dashboard/store";
import {
  ApiError,
  apiBase,
  apiJson,
  dataUrlToBlob,
  loadDoor,
  login,
  readToken,
  serverId,
  writeToken,
  type Door,
} from "@/dashboard/remote";
import { todayISO } from "@/dashboard/logic";
import { emptyDb, type Client, type DB, type Project, type StoredFile } from "@/dashboard/types";

function doorFromPath(pathname: string): Door {
  if (pathname.startsWith("/k7n/portal")) return "portal";
  if (pathname.startsWith("/k7n/crew")) return "crew";
  return "founder";
}

export function RemoteDashboard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const door = doorFromPath(location.pathname);
  const doorRef = useRef(door);
  doorRef.current = door;
  const [db, setDb] = useState<DB>(emptyDb);
  const [actorId, setActorId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const dbRef = useRef(db);
  dbRef.current = db;

  const apply = (next: { db: DB; actorId: string }) => {
    dbRef.current = next.db;
    setDb(next.db);
    setActorId(next.actorId);
  };

  const refresh = async () => {
    apply(await loadDoor(doorRef.current));
  };

  useEffect(() => {
    let cancel = false;
    const current = door;
    if (!readToken(current)) {
      setReady(true);
      return;
    }
    loadDoor(current)
      .then((next) => {
        if (!cancel) apply(next);
      })
      .catch(() => {
        writeToken(current, null);
        if (!cancel) {
          setActorId(null);
          setDb(emptyDb());
        }
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, [door]);

  const founder = door === "founder" ? (db.founders.find((item) => item.id === actorId) ?? null) : null;
  const portalClient = door === "portal" ? (db.clients.find((item) => item.id === actorId && item.portalEnabled) ?? null) : null;
  const crew = door === "crew" ? (db.employees.find((item) => item.id === actorId && item.portalEnabled) ?? null) : null;

  const fail = async (work: () => Promise<void>) => {
    try {
      await work();
      return null;
    } catch (error) {
      return error instanceof ApiError ? error.message : "The server could not save that.";
    }
  };

  const run = (work: () => Promise<void>) => {
    void fail(work).then((message) => {
      if (message) window.alert(message);
    });
  };

  const save = (path: string, id: string, body: unknown) =>
    apiJson("founder", serverId(id) ? `${path}/${id}` : path, {
      method: serverId(id) ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });

  const remove = (path: string, id: string) => apiJson("founder", `${path}/${id}`, { method: "DELETE" });

  if (!ready) return <main className="min-h-screen bg-paper" />;

  return (
    <DashboardContext.Provider
      value={{
        db,
        founder,
        portalClient,
        crew,
        usingApi: true,
        async signIn(name, password) {
          try {
            await login("founder", { name, password });
            apply(await loadDoor("founder"));
            return null;
          } catch (error) {
            return error instanceof ApiError ? error.message : "Sign in failed.";
          }
        },
        signOut() {
          const current = readToken("founder");
          writeToken("founder", null);
          setActorId(null);
          setDb(emptyDb());
          if (current) {
            void fetch(`${apiBase}/api/logout`, {
              method: "POST",
              headers: { Accept: "application/json", Authorization: `Bearer ${current}` },
            });
          }
        },
        async createFirstFounder() {
          return "Sign in with a founder name. Accounts are already on the server.";
        },
        async addFounder(name, password) {
          return fail(async () => {
            await apiJson("founder", "/api/founders", { method: "POST", body: JSON.stringify({ name, password }) });
            await refresh();
          });
        },
        saveClient(client) {
          run(() => save("/api/clients", client.id, client).then(refresh));
        },
        async deleteClient(id) {
          return fail(async () => {
            await remove("/api/clients", id);
            await refresh();
          });
        },
        saveProject(project) {
          run(() => save("/api/projects", project.id, project).then(refresh));
        },
        deleteProject(id) {
          run(() => remove("/api/projects", id).then(refresh));
        },
        saveMilestone(milestone) {
          run(() => save("/api/milestones", milestone.id, milestone).then(refresh));
        },
        deleteMilestone(id) {
          run(() => remove("/api/milestones", id).then(refresh));
        },
        saveInvoice(invoice) {
          run(() => save("/api/invoices", invoice.id, invoice).then(refresh));
        },
        deleteInvoice(id) {
          run(() => remove("/api/invoices", id).then(refresh));
        },
        saveEntry(entry) {
          run(() => save("/api/entries", entry.id, entry).then(refresh));
        },
        deleteEntry(id) {
          run(() => remove("/api/entries", id).then(refresh));
        },
        saveInquiry(inquiry) {
          run(async () => {
            if (serverId(inquiry.id)) await save("/api/inquiries", inquiry.id, inquiry);
            else await apiJson("founder", "/api/inquiries", { method: "POST", body: JSON.stringify(inquiry) });
            await refresh();
          });
        },
        deleteInquiry(id) {
          run(() => remove("/api/inquiries", id).then(refresh));
        },
        winInquiry(id, withProject) {
          run(async () => {
            const inquiry = dbRef.current.inquiries.find((item) => item.id === id);
            if (!inquiry) return;
            const client = await apiJson<Client>("founder", "/api/clients", {
              method: "POST",
              body: JSON.stringify({
                name: inquiry.name,
                email: inquiry.email,
                notes: inquiry.message,
                status: "active",
                billingEmail: inquiry.email,
              }),
            });
            if (withProject) {
              await apiJson<Project>("founder", "/api/projects", {
                method: "POST",
                body: JSON.stringify({
                  clientId: client.id,
                  offer: inquiry.offer || "Custom",
                  title: `${inquiry.name} — ${inquiry.offer || "Project"}`,
                  status: "draft",
                  startDate: todayISO(),
                  schedule: inquiry.offer === "Growth Marketing" ? "retainer" : "fixed",
                  leadFounderId: actorId,
                }),
              });
            }
            await apiJson("founder", `/api/inquiries/${id}`, {
              method: "PATCH",
              body: JSON.stringify({ status: "won", clientId: client.id }),
            });
            await refresh();
          });
        },
        saveNote(note) {
          run(() => save("/api/notes", note.id, note).then(refresh));
        },
        deleteNote(id) {
          run(() => remove("/api/notes", id).then(refresh));
        },
        async saveFile(file) {
          return fail(async () => {
            if (serverId(file.id)) {
              await apiJson(doorRef.current === "portal" ? "portal" : "founder", `/api/files/${file.id}`, {
                method: "PATCH",
                body: JSON.stringify({ note: file.note, shared: file.shared }),
              });
            } else if (doorRef.current === "portal") {
              await sendFile("portal", "/api/portal/files", file);
            } else {
              await sendFile("founder", "/api/files", file);
            }
            await refresh();
          });
        },
        deleteFile(id) {
          run(() => remove("/api/files", id).then(refresh));
        },
        exportBackup() {
          const blob = new Blob([JSON.stringify(dbRef.current, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `kan-dashboard-${todayISO()}.json`;
          link.click();
          URL.revokeObjectURL(url);
        },
        async importBackup() {
          return "Live records stay on the server. A backup file cannot replace them.";
        },
        async setPortalAccess(clientId, enabled, password) {
          return fail(async () => {
            await apiJson("founder", `/api/clients/${clientId}/access`, {
              method: "POST",
              body: JSON.stringify({ enabled, password }),
            });
            await refresh();
          });
        },
        saveUpdate(update) {
          run(() => save("/api/updates", update.id, update).then(refresh));
        },
        async portalSignIn(email, password) {
          try {
            await login("portal", { email, password });
            apply(await loadDoor("portal"));
            return null;
          } catch (error) {
            return error instanceof ApiError ? error.message : "Email or password does not match.";
          }
        },
        portalSignOut() {
          writeToken("portal", null);
          setActorId(null);
          setDb(emptyDb());
        },
        loadSample() {},
        nextInvoiceNumber() {
          const max = dbRef.current.invoices.reduce((highest, invoice) => {
            const match = /^KAN-(\d+)$/.exec(invoice.number.trim());
            return match ? Math.max(highest, Number(match[1])) : highest;
          }, 0);
          return `KAN-${String(max + 1).padStart(3, "0")}`;
        },
        saveReply(reply) {
          const path =
            doorRef.current === "portal"
              ? `/api/portal/updates/${reply.updateId}/replies`
              : `/api/updates/${reply.updateId}/replies`;
          run(() =>
            apiJson(doorRef.current === "portal" ? "portal" : "founder", path, {
              method: "POST",
              body: JSON.stringify({ body: reply.body }),
            }).then(refresh),
          );
        },
        setMilestoneApproval(id, approval) {
          if (doorRef.current === "portal") {
            run(() =>
              apiJson("portal", `/api/portal/milestones/${id}/approval`, {
                method: "POST",
                body: JSON.stringify({ approval }),
              }).then(refresh),
            );
            return;
          }
          const milestone = dbRef.current.milestones.find((item) => item.id === id);
          if (!milestone) return;
          run(() => save("/api/milestones", id, { ...milestone, approval }).then(refresh));
        },
        saveQuote(quote) {
          if (serverId(quote.id)) return;
          run(() =>
            apiJson("founder", "/api/quotes", { method: "POST", body: JSON.stringify(quote) }).then(refresh),
          );
        },
        async acceptQuote(id) {
          if (!serverId(id)) return "Save the quote first.";
          return fail(async () => {
            await apiJson("founder", `/api/quotes/${id}/accept`, { method: "POST" });
            await refresh();
          });
        },
        saveEmployee(employee) {
          run(() => save("/api/employees", employee.id, employee).then(refresh));
        },
        deleteEmployee(id) {
          run(() => remove("/api/employees", id).then(refresh));
        },
        async setCrewAccess(employeeId, enabled, password) {
          return fail(async () => {
            await apiJson("founder", `/api/employees/${employeeId}/access`, {
              method: "POST",
              body: JSON.stringify({ enabled, password }),
            });
            await refresh();
          });
        },
        saveAssignment(assignment) {
          run(() =>
            apiJson("founder", "/api/assignments", {
              method: "POST",
              body: JSON.stringify({ projectId: assignment.projectId, employeeId: assignment.employeeId }),
            }).then(refresh),
          );
        },
        deleteAssignment(id) {
          run(() => remove("/api/assignments", id).then(refresh));
        },
        saveTask(task) {
          if (doorRef.current === "crew") {
            run(() =>
              apiJson("crew", `/api/crew/tasks/${task.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: task.status }),
              }).then(refresh),
            );
            return;
          }
          run(() => save("/api/tasks", task.id, task).then(refresh));
        },
        deleteTask(id) {
          run(() => remove("/api/tasks", id).then(refresh));
        },
        saveTime(entry) {
          run(() =>
            apiJson("crew", "/api/crew/time", {
              method: "POST",
              body: JSON.stringify({
                projectId: entry.projectId,
                date: entry.date,
                hours: entry.hours,
                note: entry.note,
              }),
            }).then(refresh),
          );
        },
        deleteTime(id) {
          run(() => apiJson("crew", `/api/crew/time/${id}`, { method: "DELETE" }).then(refresh));
        },
        async issueNextInvoice(id) {
          return fail(async () => {
            await apiJson("founder", `/api/invoices/${id}/issue-next`, { method: "POST" });
            await refresh();
          });
        },
        async crewSignIn(email, password) {
          try {
            await login("crew", { email, password });
            apply(await loadDoor("crew"));
            return null;
          } catch (error) {
            return error instanceof ApiError ? error.message : "Email or password does not match.";
          }
        },
        crewSignOut() {
          writeToken("crew", null);
          setActorId(null);
          setDb(emptyDb());
        },
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

async function sendFile(door: "founder" | "portal", path: string, file: StoredFile) {
  const body = new FormData();
  body.set("ownerType", file.ownerType);
  body.set("ownerId", file.ownerId);
  body.set("note", file.note);
  body.set("shared", file.shared ? "1" : "0");
  body.set("file", dataUrlToBlob(file.dataUrl), file.name);
  await apiJson(door, path, { method: "POST", body });
}
