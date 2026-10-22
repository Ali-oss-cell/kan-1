import {
  emptyClient,
  emptyDb,
  emptyProject,
  normalizeDb,
  type DB,
  type Employee,
  type Founder,
  type Offer,
  type ProjectStatus,
  type StoredFile,
} from "@/dashboard/types";

export const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type Door = "founder" | "portal" | "crew";

const TOKEN: Record<Door, string> = {
  founder: "kan.api.founder",
  portal: "kan.api.portal",
  crew: "kan.api.crew",
};

const ID_KEYS = new Set([
  "id",
  "clientId",
  "projectId",
  "milestoneId",
  "leadFounderId",
  "ownerId",
  "updateId",
  "inquiryId",
  "refId",
  "employeeId",
]);

export function serverId(id: string) {
  return /^\d+$/.test(id);
}

export function readToken(door: Door) {
  return localStorage.getItem(TOKEN[door]);
}

export function writeToken(door: Door, value: string | null) {
  if (value) localStorage.setItem(TOKEN[door], value);
  else localStorage.removeItem(TOKEN[door]);
}

export class ApiError extends Error {}

export async function api(door: Door, path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const auth = readToken(door);
  if (auth) headers.set("Authorization", `Bearer ${auth}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${apiBase}${path}`, { ...init, headers });
  if (response.status === 401) writeToken(door, null);
  return response;
}

export async function apiJson<T>(door: Door, path: string, init: RequestInit = {}): Promise<T> {
  const response = await api(door, path, init);
  const body = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new ApiError(body.message || "The server could not save that.");
  return body as T;
}

export async function login(door: Door, fields: Record<string, string>) {
  const path = door === "founder" ? "/api/founders/login" : door === "portal" ? "/api/portal/login" : "/api/crew/login";
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  const body = (await response.json().catch(() => ({}))) as { message?: string; token?: string; user?: { id: number | string } };
  if (!response.ok || !body.token || !body.user) throw new ApiError(body.message || "Sign in failed.");
  writeToken(door, body.token);
  return String(body.user.id);
}

export async function downloadAuthed(url: string, name: string) {
  const auth = readToken("founder") || readToken("portal") || readToken("crew");
  const response = await fetch(url, { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });
  if (!response.ok) return;
  const blob = await response.blob();
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  link.click();
  URL.revokeObjectURL(href);
}

export function dataUrlToBlob(dataUrl: string) {
  const [header, data] = dataUrl.split(",");
  const mime = /data:(.*?);/.exec(header)?.[1] || "application/octet-stream";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function stringifyIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stringifyIds);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (ID_KEYS.has(key) && (typeof item === "number" || typeof item === "string")) out[key] = String(item);
    else out[key] = stringifyIds(item);
  }
  return out;
}

function asFile(file: StoredFile): StoredFile {
  return { ...file, dataUrl: file.dataUrl ?? "", shared: Boolean(file.shared), fromClient: Boolean(file.fromClient) };
}

export async function loadDoor(door: Door): Promise<{ db: DB; actorId: string }> {
  if (door === "founder") {
    const raw = await apiJson<DB>("founder", "/api/snapshot");
    const snap = stringifyIds(raw) as DB;
    const founders: Founder[] = (snap.founders ?? []).map((founder) => ({
      id: founder.id,
      name: founder.name,
      salt: "",
      passwordHash: "",
    }));
    const db = normalizeDb({
      ...emptyDb(),
      ...snap,
      founders,
      employees: (snap.employees ?? []).map(asEmployee),
      files: (snap.files ?? []).map(asFile),
    });
    const me = await apiJson<{ id: number | string }>("founder", "/api/me");
    return { db, actorId: String(me.id) };
  }
  if (door === "portal") {
    const raw = await apiJson<Record<string, unknown>>("portal", "/api/portal/snapshot");
    const snap = stringifyIds(raw) as {
      client: DB["clients"][number];
      projects: DB["projects"];
      milestones: DB["milestones"];
      invoices: DB["invoices"];
      updates: DB["updates"];
      replies: DB["replies"];
      files: StoredFile[];
    };
    const client = { ...emptyClient(snap.client.id), ...snap.client, portalEnabled: true };
    const db = normalizeDb({
      ...emptyDb(),
      clients: [client],
      projects: snap.projects.map((project) => ({ ...project, price: project.price ?? 0 })),
      milestones: snap.milestones,
      invoices: snap.invoices,
      updates: snap.updates,
      replies: snap.replies,
      files: (snap.files ?? []).map(asFile),
    });
    return { db, actorId: client.id };
  }
  const raw = await apiJson<Record<string, unknown>>("crew", "/api/crew/snapshot");
  const snap = stringifyIds(raw) as {
    profile: Employee;
    projects: Array<{
      id: string;
      title: string;
      offer: string;
      status: ProjectStatus;
      startDate: string;
      endDate: string;
      clientSummary: string;
      client: string;
    }>;
    tasks: DB["tasks"];
    timeEntries: DB["timeEntries"];
  };
  const employee = asEmployee({ ...snap.profile, portalEnabled: true });
  const clients = snap.projects.map((project) => ({
    ...emptyClient(`client-${project.id}`),
    name: project.client,
    company: project.client,
  }));
  const projects = snap.projects.map((project) => ({
    ...emptyProject(project.id, `client-${project.id}`, ""),
    offer: (project.offer || "Custom") as Offer,
    title: project.title,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    clientSummary: project.clientSummary,
  }));
  const db = normalizeDb({
    ...emptyDb(),
    clients,
    projects,
    employees: [employee],
    assignments: projects.map((project) => ({
      id: `assignment-${project.id}`,
      projectId: project.id,
      employeeId: employee.id,
    })),
    tasks: snap.tasks,
    timeEntries: snap.timeEntries,
  });
  return { db, actorId: employee.id };
}

function asEmployee(employee: Employee): Employee {
  return {
    ...employee,
    phone: employee.phone ?? "",
    notes: employee.notes ?? "",
    portalSalt: "",
    portalPasswordHash: "",
    portalEnabled: Boolean(employee.portalEnabled),
  };
}
