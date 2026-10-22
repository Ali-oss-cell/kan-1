/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  emptyClient,
  emptyDb,
  emptyProject,
  normalizeDb,
  type Client,
  type CompanyEntry,
  type DB,
  type Activity,
  type Assignment,
  type Employee,
  type Founder,
  type Inquiry,
  type Invoice,
  type Milestone,
  type Note,
  type Project,
  type Quote,
  type Reply,
  type StoredFile,
  type Task,
  type TimeEntry,
  type Update,
} from "@/dashboard/types";
import { demoDb } from "@/dashboard/demo";
import { offerFrom, todayISO } from "@/dashboard/logic";
import { apiBase } from "@/dashboard/remote";
import { RemoteDashboard } from "@/dashboard/remoteStore";

const DATA_KEY = "kan.dashboard.v1";
const SESSION_KEY = "kan.dashboard.session";
const PORTAL_KEY = "kan.portal.session";
const CREW_KEY = "kan.crew.session";

type DashboardContextValue = {
  db: DB;
  founder: Founder | null;
  signIn: (name: string, password: string) => Promise<string | null>;
  signOut: () => void;
  createFirstFounder: (name: string, password: string) => Promise<string | null>;
  addFounder: (name: string, password: string) => Promise<string | null>;
  saveClient: (client: Client) => void;
  deleteClient: (id: string) => Promise<string | null>;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  saveMilestone: (milestone: Milestone) => void;
  deleteMilestone: (id: string) => void;
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  saveEntry: (entry: CompanyEntry) => void;
  deleteEntry: (id: string) => void;
  saveInquiry: (inquiry: Inquiry) => void;
  deleteInquiry: (id: string) => void;
  winInquiry: (id: string, withProject: boolean) => void;
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  saveFile: (file: StoredFile) => Promise<string | null>;
  deleteFile: (id: string) => void;
  setPortalAccess: (clientId: string, enabled: boolean, password: string) => Promise<string | null>;
  saveUpdate: (update: Update) => void;
  portalClient: Client | null;
  portalSignIn: (email: string, password: string) => Promise<string | null>;
  portalSignOut: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<string | null>;
  loadSample: () => void;
  nextInvoiceNumber: () => string;
  saveReply: (reply: Reply) => void;
  setMilestoneApproval: (id: string, approval: Milestone["approval"], actorName: string) => void;
  saveQuote: (quote: Quote) => void;
  acceptQuote: (id: string) => Promise<string | null>;
  saveEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  setCrewAccess: (employeeId: string, enabled: boolean, password: string) => Promise<string | null>;
  saveAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  saveTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  saveTime: (entry: TimeEntry) => void;
  deleteTime: (id: string) => void;
  issueNextInvoice: (id: string) => Promise<string | null>;
  usingApi: boolean;
  crew: Employee | null;
  crewSignIn: (email: string, password: string) => Promise<string | null>;
  crewSignOut: () => void;
};

export const DashboardContext = createContext<DashboardContextValue | null>(null);

function isDb(value: unknown): value is DB {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<DB>;
  return (
    Array.isArray(record.founders) &&
    Array.isArray(record.clients) &&
    Array.isArray(record.projects) &&
    Array.isArray(record.milestones) &&
    Array.isArray(record.invoices) &&
    Array.isArray(record.entries) &&
    Array.isArray(record.inquiries) &&
    Array.isArray(record.notes) &&
    Array.isArray(record.files)
  );
}

function loadDb(): DB {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return demoDb();
    const parsed: unknown = JSON.parse(raw);
    return isDb(parsed) ? normalizeDb(parsed) : emptyDb();
  } catch {
    return emptyDb();
  }
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function newSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shiftMonthDate(iso: string) {
  const [year, month, day] = (iso || todayISO()).split("-").map(Number);
  const nextLast = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(day || 1, nextLast);
  const date = new Date(year, month, safeDay);
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${nextMonth}-${nextDay}`;
}

function nextNumber(current: DB) {
  const max = current.invoices.reduce((highest, invoice) => {
    const match = /^KAN-(\d+)$/.exec(invoice.number.trim());
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `KAN-${String(max + 1).padStart(3, "0")}`;
}

function actorStamp(current: DB, actorName: string, summary: string): DB {
  const entry: Activity = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actorName,
    summary,
  };
  return { ...current, activity: [entry, ...current.activity].slice(0, 80) };
}

function queueNotice(
  current: DB,
  clientId: string,
  kind: "update" | "invoice",
  refId: string,
  title: string,
  body: string,
): DB {
  if (!clientId) return current;
  if (current.notices.some((notice) => notice.kind === kind && notice.refId === refId)) return current;
  return {
    ...current,
    notices: [
      {
        id: crypto.randomUUID(),
        clientId,
        kind,
        refId,
        title,
        body,
        createdAt: todayISO(),
        status: "queued",
      },
      ...current.notices,
    ],
  };
}

function upsert<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index === -1) return [...list, item];
  const next = list.slice();
  next[index] = item;
  return next;
}

function checkPassword(name: string, password: string) {
  if (!name.trim()) return "Enter a name.";
  if (password.length < 8) return "Use at least 8 characters.";
  return null;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  if (apiBase) return <RemoteDashboard>{children}</RemoteDashboard>;
  return <LocalDashboard>{children}</LocalDashboard>;
}

function LocalDashboard({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(loadDb);
  const [founderId, setFounderId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [portalClientId, setPortalClientId] = useState<string | null>(() => localStorage.getItem(PORTAL_KEY));
  const [crewId, setCrewId] = useState<string | null>(() => localStorage.getItem(CREW_KEY));
  const dbRef = useRef(db);
  dbRef.current = db;

  const founder = db.founders.find((item) => item.id === founderId) ?? null;
  const portalClient =
    db.clients.find((client) => client.id === portalClientId && client.portalEnabled) ?? null;
  const crew = db.employees.find((employee) => employee.id === crewId && employee.portalEnabled) ?? null;

  useEffect(() => {
    if (founderId && !db.founders.some((item) => item.id === founderId)) {
      localStorage.removeItem(SESSION_KEY);
      setFounderId(null);
    }
  }, [db.founders, founderId]);

  useEffect(() => {
    if (portalClientId && !portalClient) {
      localStorage.removeItem(PORTAL_KEY);
      setPortalClientId(null);
    }
  }, [portalClient, portalClientId]);

  useEffect(() => {
    if (crewId && !crew) {
      localStorage.removeItem(CREW_KEY);
      setCrewId(null);
    }
  }, [crew, crewId]);

  const write = (next: DB) => {
    const clean = normalizeDb(next);
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(clean));
    } catch {
      return "Could not save. Download a backup, then remove a large file.";
    }
    dbRef.current = clean;
    setDb(clean);
    return null;
  };

  const commit = (recipe: (current: DB) => DB) => {
    write(recipe(dbRef.current));
  };

  const remember = (id: string) => {
    localStorage.setItem(SESSION_KEY, id);
    setFounderId(id);
  };

  const createFounder = async (name: string, password: string, first: boolean) => {
    const problem = checkPassword(name, password);
    if (problem) return problem;
    const current = dbRef.current;
    if (first && current.founders.length > 0) return "A founder login already exists.";
    const clean = name.trim();
    if (current.founders.some((item) => item.name.toLowerCase() === clean.toLowerCase())) {
      return "A founder already uses that name.";
    }
    const salt = newSalt();
    const passwordHash = await hashPassword(password, salt);
    const nextFounder: Founder = { id: crypto.randomUUID(), name: clean, salt, passwordHash };
    const error = write({ ...current, founders: [...current.founders, nextFounder] });
    if (error) return error;
    if (first) remember(nextFounder.id);
    return null;
  };

  const value: DashboardContextValue = {
    db,
    founder,
    portalClient,
    crew,
    usingApi: false,
    async signIn(name, password) {
      const match = dbRef.current.founders.find(
        (item) => item.name.toLowerCase() === name.trim().toLowerCase(),
      );
      if (!match) return "No founder uses that name.";
      const hash = await hashPassword(password, match.salt);
      if (hash !== match.passwordHash) return "Password does not match.";
      remember(match.id);
      return null;
    },
    signOut() {
      localStorage.removeItem(SESSION_KEY);
      setFounderId(null);
    },
    createFirstFounder(name, password) {
      return createFounder(name, password, true);
    },
    addFounder(name, password) {
      return createFounder(name, password, false);
    },
    saveClient(client) {
      commit((current) => ({ ...current, clients: upsert(current.clients, client) }));
    },
    async deleteClient(id) {
      if (dbRef.current.projects.some((project) => project.clientId === id)) {
        return "This client still has projects. Delete those first.";
      }
      commit((current) => ({
        ...current,
        clients: current.clients.filter((client) => client.id !== id),
        notes: current.notes.filter((note) => note.ownerType !== "client" || note.ownerId !== id),
        files: current.files.filter((file) => file.ownerType !== "client" || file.ownerId !== id),
        updates: current.updates.filter((update) => update.clientId !== id),
      }));
      return null;
    },
    saveProject(project) {
      commit((current) =>
        actorStamp(
          { ...current, projects: upsert(current.projects, project) },
          founder?.name ?? "Founder",
          `Saved project ${project.title || "Untitled"}`,
        ),
      );
    },
    deleteProject(id) {
      commit((current) => ({
        ...current,
        projects: current.projects.filter((project) => project.id !== id),
        milestones: current.milestones.filter((milestone) => milestone.projectId !== id),
        invoices: current.invoices.filter((invoice) => invoice.projectId !== id),
        notes: current.notes.filter((note) => note.ownerType !== "project" || note.ownerId !== id),
        files: current.files.filter((file) => file.ownerType !== "project" || file.ownerId !== id),
        updates: current.updates.filter((update) => update.projectId !== id),
      }));
    },
    saveMilestone(milestone) {
      commit((current) => ({ ...current, milestones: upsert(current.milestones, milestone) }));
    },
    deleteMilestone(id) {
      commit((current) => ({
        ...current,
        milestones: current.milestones.filter((milestone) => milestone.id !== id),
        invoices: current.invoices.map((invoice) =>
          invoice.milestoneId === id ? { ...invoice, milestoneId: "" } : invoice,
        ),
      }));
    },
    saveInvoice(invoice) {
      commit((current) => {
        const previous = current.invoices.find((item) => item.id === invoice.id);
        let next: DB = { ...current, invoices: upsert(current.invoices, invoice) };
        const sending = invoice.status === "sent" || invoice.status === "overdue";
        const wasSending = previous?.status === "sent" || previous?.status === "overdue";
        if (sending && !wasSending) {
          const project = next.projects.find((item) => item.id === invoice.projectId);
          if (project) {
            next = queueNotice(next, project.clientId, "invoice", invoice.id, invoice.number, invoice.description);
          }
        }
        return actorStamp(next, founder?.name ?? "Founder", `Saved invoice ${invoice.number || "draft"}`);
      });
    },
    deleteInvoice(id) {
      commit((current) => ({
        ...current,
        invoices: current.invoices.filter((invoice) => invoice.id !== id),
      }));
    },
    saveEntry(entry) {
      commit((current) => ({ ...current, entries: upsert(current.entries, entry) }));
    },
    deleteEntry(id) {
      commit((current) => ({
        ...current,
        entries: current.entries.filter((entry) => entry.id !== id),
      }));
    },
    saveInquiry(inquiry) {
      commit((current) => ({ ...current, inquiries: upsert(current.inquiries, inquiry) }));
    },
    deleteInquiry(id) {
      commit((current) => ({
        ...current,
        inquiries: current.inquiries.filter((inquiry) => inquiry.id !== id),
      }));
    },
    winInquiry(id, withProject) {
      commit((current) => {
        const inquiry = current.inquiries.find((item) => item.id === id);
        if (!inquiry || inquiry.clientId) return current;
        const clientId = crypto.randomUUID();
        const client: Client = {
          ...emptyClient(clientId),
          name: inquiry.name,
          email: inquiry.email,
          notes: inquiry.message,
          status: "active",
          billingEmail: inquiry.email,
        };
        const projects = withProject
          ? [
              ...current.projects,
              {
                ...emptyProject(crypto.randomUUID(), clientId, founderId ?? ""),
                offer: offerFrom(inquiry.offer),
                title: `${inquiry.name} — ${inquiry.offer || "Project"}`,
                status: "draft" as const,
                startDate: todayISO(),
                schedule: inquiry.offer === "Growth Marketing" ? ("retainer" as const) : ("fixed" as const),
              },
            ]
          : current.projects;
        return {
          ...current,
          clients: [...current.clients, client],
          projects,
          inquiries: current.inquiries.map((item) =>
            item.id === id ? { ...item, status: "won" as const, clientId } : item,
          ),
        };
      });
    },
    saveNote(note) {
      commit((current) => ({ ...current, notes: upsert(current.notes, note) }));
    },
    deleteNote(id) {
      commit((current) => ({
        ...current,
        notes: current.notes.filter((note) => note.id !== id),
      }));
    },
    async saveFile(file) {
      if (file.dataUrl.length > 600_000) {
        return "That file is over 400 KB. Keep this copy smaller, or note where the file lives.";
      }
      const next = { ...dbRef.current, files: upsert(dbRef.current.files, file) };
      if (JSON.stringify(next).length > 4_500_000) {
        return "This browser copy is full. Download a backup, or remove a file.";
      }
      return write(next);
    },
    deleteFile(id) {
      commit((current) => ({
        ...current,
        files: current.files.filter((file) => file.id !== id),
      }));
    },
    exportBackup() {
      const blob = new Blob([JSON.stringify(dbRef.current, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kan-dashboard-${todayISO()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
    async importBackup(file) {
      try {
        const parsed: unknown = JSON.parse(await file.text());
        if (!isDb(parsed)) return "That file is not a KAN Founders backup.";
        const error = write(parsed);
        if (error) return error;
        if (founderId && !parsed.founders.some((item) => item.id === founderId)) {
          localStorage.removeItem(SESSION_KEY);
          setFounderId(null);
        }
        return null;
      } catch {
        return "Could not read that file.";
      }
    },
    async setPortalAccess(clientId, enabled, password) {
      const client = dbRef.current.clients.find((item) => item.id === clientId);
      if (!client) return "That client is no longer here.";
      if (enabled && !client.email.trim()) return "Add an email. That address is the portal login.";
      if (password && password.length < 8) return "Use at least 8 characters.";
      if (enabled && !password && !client.portalPasswordHash) return "Set a starting password.";
      let portalSalt = client.portalSalt;
      let portalPasswordHash = client.portalPasswordHash;
      if (password) {
        portalSalt = newSalt();
        portalPasswordHash = await hashPassword(password, portalSalt);
      }
      const nextClient = { ...client, portalEnabled: enabled, portalSalt, portalPasswordHash };
      const next = actorStamp(
        { ...dbRef.current, clients: upsert(dbRef.current.clients, nextClient) },
        founder?.name ?? "Founder",
        `${enabled ? "Turned on" : "Turned off"} portal access for ${client.name}${password ? " and set a password" : ""}`,
      );
      return write(next);
    },
    saveUpdate(update) {
      commit((current) => {
        const previous = current.updates.find((item) => item.id === update.id);
        let next: DB = { ...current, updates: upsert(current.updates, update) };
        const showing = !update.hidden;
        const wasShowing = previous ? !previous.hidden : false;
        if (showing && !wasShowing) {
          next = queueNotice(next, update.clientId, "update", update.id, update.title, update.body);
        }
        return actorStamp(next, founder?.name ?? "Founder", `Saved update ${update.title}`);
      });
    },
    async portalSignIn(email, password) {
      const key = email.trim().toLowerCase();
      const client = dbRef.current.clients.find(
        (item) => item.portalEnabled && item.email.trim().toLowerCase() === key && item.portalPasswordHash,
      );
      if (!client) return "Email or password does not match.";
      const hash = await hashPassword(password, client.portalSalt);
      if (hash !== client.portalPasswordHash) return "Email or password does not match.";
      localStorage.setItem(PORTAL_KEY, client.id);
      setPortalClientId(client.id);
      return null;
    },
    portalSignOut() {
      localStorage.removeItem(PORTAL_KEY);
      setPortalClientId(null);
    },
    loadSample() {
      write(demoDb());
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(PORTAL_KEY);
      localStorage.removeItem(CREW_KEY);
      setFounderId(null);
      setPortalClientId(null);
      setCrewId(null);
    },
    saveReply(reply) {
      commit((current) =>
        actorStamp(
          { ...current, replies: [...current.replies, reply] },
          reply.authorName,
          `Replied on an update`,
        ),
      );
    },
    setMilestoneApproval(id, approval, actorName) {
      commit((current) => {
        const milestone = current.milestones.find((item) => item.id === id);
        if (!milestone) return current;
        return actorStamp(
          {
            ...current,
            milestones: current.milestones.map((item) => (item.id === id ? { ...item, approval } : item)),
          },
          actorName,
          `${actorName} marked ${milestone.name} as ${approval}`,
        );
      });
    },
    saveQuote(quote) {
      commit((current) =>
        actorStamp(
          { ...current, quotes: upsert(current.quotes, quote) },
          founder?.name ?? "Founder",
          `Saved quote for ${quote.name}`,
        ),
      );
    },
    async acceptQuote(id) {
      const quote = dbRef.current.quotes.find((item) => item.id === id);
      if (!quote) return "That quote is no longer here.";
      if (quote.projectId) return "This quote already opened a project.";
      const clientId = quote.clientId || crypto.randomUUID();
      const existing = dbRef.current.clients.find((item) => item.id === clientId);
      const client: Client = existing ?? {
        ...emptyClient(clientId),
        name: quote.name,
        email: quote.email,
        notes: quote.note,
        status: "active",
        billingEmail: quote.email,
      };
      const projectId = crypto.randomUUID();
      const project = {
        ...emptyProject(projectId, clientId, founderId ?? ""),
        offer: offerFrom(quote.offer),
        title: quote.title || `${quote.name} — ${quote.offer || "Project"}`,
        status: "draft" as const,
        startDate: todayISO(),
        price: quote.amount,
        currency: quote.currency || "USD",
        schedule: quote.offer === "Growth Marketing" ? ("retainer" as const) : ("fixed" as const),
      };
      const nextQuote = { ...quote, status: "accepted" as const, clientId, projectId };
      write(
        actorStamp(
          {
            ...dbRef.current,
            clients: existing ? dbRef.current.clients : [...dbRef.current.clients, client],
            projects: [...dbRef.current.projects, project],
            quotes: upsert(dbRef.current.quotes, nextQuote),
            inquiries: dbRef.current.inquiries.map((item) =>
              item.id === quote.inquiryId ? { ...item, status: "won" as const, clientId } : item,
            ),
          },
          founder?.name ?? "Founder",
          `Accepted the quote for ${quote.name}`,
        ),
      );
      return null;
    },
    saveEmployee(employee) {
      commit((current) =>
        actorStamp(
          { ...current, employees: upsert(current.employees, employee) },
          founder?.name ?? "Founder",
          `Saved employee ${employee.name}`,
        ),
      );
    },
    deleteEmployee(id) {
      commit((current) => ({
        ...current,
        employees: current.employees.filter((employee) => employee.id !== id),
        assignments: current.assignments.filter((item) => item.employeeId !== id),
        tasks: current.tasks.filter((task) => task.employeeId !== id),
        timeEntries: current.timeEntries.filter((entry) => entry.employeeId !== id),
      }));
    },
    async setCrewAccess(employeeId, enabled, password) {
      const employee = dbRef.current.employees.find((item) => item.id === employeeId);
      if (!employee) return "That employee is no longer here.";
      if (enabled && !employee.email.trim()) return "Add an email. That address is the crew login.";
      if (password && password.length < 8) return "Use at least 8 characters.";
      if (enabled && !password && !employee.portalPasswordHash) return "Set a starting password.";
      let portalSalt = employee.portalSalt;
      let portalPasswordHash = employee.portalPasswordHash;
      if (password) {
        portalSalt = newSalt();
        portalPasswordHash = await hashPassword(password, portalSalt);
      }
      const next = actorStamp(
        {
          ...dbRef.current,
          employees: upsert(dbRef.current.employees, {
            ...employee,
            portalEnabled: enabled,
            portalSalt,
            portalPasswordHash,
          }),
        },
        founder?.name ?? "Founder",
        `${enabled ? "Turned on" : "Turned off"} crew access for ${employee.name}${password ? " and set a password" : ""}`,
      );
      return write(next);
    },
    saveAssignment(assignment) {
      commit((current) => ({ ...current, assignments: upsert(current.assignments, assignment) }));
    },
    deleteAssignment(id) {
      commit((current) => ({
        ...current,
        assignments: current.assignments.filter((item) => item.id !== id),
      }));
    },
    saveTask(task) {
      commit((current) =>
        actorStamp(
          { ...current, tasks: upsert(current.tasks, task) },
          founder?.name ?? crew?.name ?? "Founder",
          `Saved task ${task.title}`,
        ),
      );
    },
    deleteTask(id) {
      commit((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }));
    },
    saveTime(entry) {
      commit((current) => ({ ...current, timeEntries: upsert(current.timeEntries, entry) }));
    },
    deleteTime(id) {
      commit((current) => ({
        ...current,
        timeEntries: current.timeEntries.filter((entry) => entry.id !== id),
      }));
    },
    async issueNextInvoice(id) {
      const source = dbRef.current.invoices.find((item) => item.id === id);
      if (!source) return "That invoice is no longer here.";
      if (source.repeat !== "monthly") return "Turn on monthly repeat first.";
      const base = source.dueDate || source.issueDate || todayISO();
      const nextMonth = shiftMonthDate(base);
      const number = nextNumber(dbRef.current);
      const invoice: Invoice = {
        ...source,
        id: crypto.randomUUID(),
        number,
        issueDate: todayISO(),
        dueDate: nextMonth,
        amountPaid: 0,
        status: "sent",
        paidDate: "",
        reference: "",
      };
      const project = dbRef.current.projects.find((item) => item.id === source.projectId);
      let next = { ...dbRef.current, invoices: [...dbRef.current.invoices, invoice] };
      if (project) next = queueNotice(next, project.clientId, "invoice", invoice.id, invoice.number, invoice.description);
      write(actorStamp(next, founder?.name ?? "Founder", `Issued ${invoice.number} from ${source.number}`));
      return null;
    },
    async crewSignIn(email, password) {
      const key = email.trim().toLowerCase();
      const employee = dbRef.current.employees.find(
        (item) => item.portalEnabled && item.email.trim().toLowerCase() === key && item.portalPasswordHash,
      );
      if (!employee) return "Email or password does not match.";
      const hash = await hashPassword(password, employee.portalSalt);
      if (hash !== employee.portalPasswordHash) return "Email or password does not match.";
      localStorage.setItem(CREW_KEY, employee.id);
      setCrewId(employee.id);
      return null;
    },
    crewSignOut() {
      localStorage.removeItem(CREW_KEY);
      setCrewId(null);
    },
    nextInvoiceNumber() {
      const max = dbRef.current.invoices.reduce((highest, invoice) => {
        const match = /^KAN-(\d+)$/.exec(invoice.number.trim());
        return match ? Math.max(highest, Number(match[1])) : highest;
      }, 0);
      return `KAN-${String(max + 1).padStart(3, "0")}`;
    },
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard must be used inside DashboardProvider");
  return value;
}
