export const OFFERS = [
  "Brand Sprint",
  "Launch Site",
  "Web/App Build",
  "Brand + Launch Bundle",
  "Growth Marketing",
  "AI Automation Pilot",
  "Custom",
] as const;

export type Offer = (typeof OFFERS)[number];

export const CLIENT_STATUSES = [
  ["lead", "Lead"],
  ["active", "Active"],
  ["paused", "Paused"],
  ["past", "Past"],
] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number][0];

export const PAY_METHODS = [
  ["bank", "Bank transfer"],
  ["card", "Card"],
  ["paypal", "PayPal"],
  ["other", "Other"],
] as const;

export type PayMethod = (typeof PAY_METHODS)[number][0];

export const BALANCE_DUE = [
  ["milestone", "On a milestone"],
  ["delivery", "On delivery"],
  ["monthly", "Monthly"],
] as const;

export type BalanceDue = (typeof BALANCE_DUE)[number][0];

export const PROJECT_STATUSES = [
  ["draft", "Draft"],
  ["active", "Active"],
  ["waiting", "Waiting on client"],
  ["delivered", "Delivered"],
  ["closed", "Closed"],
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number][0];

export const MILESTONE_STATUSES = [
  ["not_started", "Not started"],
  ["in_progress", "In progress"],
  ["blocked", "Blocked"],
  ["done", "Done"],
] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number][0];

export const INVOICE_STATUSES = [
  ["draft", "Draft"],
  ["sent", "Sent"],
  ["partial", "Partial"],
  ["paid", "Paid"],
  ["overdue", "Overdue"],
  ["void", "Void"],
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number][0];

export const INQUIRY_STATUSES = [
  ["new", "New"],
  ["talking", "Talking"],
  ["won", "Won"],
  ["lost", "Lost"],
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number][0];

export const ENTRY_STATUSES = [
  ["due", "Due"],
  ["paid", "Paid"],
  ["active", "Active"],
  ["cancelled", "Cancelled"],
] as const;

export type EntryStatus = (typeof ENTRY_STATUSES)[number][0];

export type Cadence = "monthly" | "yearly" | "one-off";
export type EntryKind = "salary" | "subscription" | "contractor" | "draw" | "passthrough";
export type OwnerType = "client" | "project";
export type Approval = "none" | "asked" | "approved" | "changes";
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
export type EmployeeStatus = "active" | "paused" | "past";
export type TaskStatus = "todo" | "doing" | "done";

export const QUOTE_STATUSES = [
  ["draft", "Draft"],
  ["sent", "Sent"],
  ["accepted", "Accepted"],
  ["declined", "Declined"],
] as const;

export const EMPLOYEE_STATUSES = [
  ["active", "Active"],
  ["paused", "Paused"],
  ["past", "Past"],
] as const;

export const TASK_STATUSES = [
  ["todo", "To do"],
  ["doing", "Doing"],
  ["done", "Done"],
] as const;

export const APPROVALS = [
  ["none", "No ask"],
  ["asked", "Ask the client"],
  ["approved", "Approved"],
  ["changes", "Changes requested"],
] as const;

export type Founder = {
  id: string;
  name: string;
  salt: string;
  passwordHash: string;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
  status: ClientStatus;
  payMethod: PayMethod;
  payMethodNote: string;
  depositRequired: boolean;
  depositKind: "percent" | "fixed";
  depositValue: number;
  balanceDue: BalanceDue;
  billingEmail: string;
  portalEnabled: boolean;
  portalSalt: string;
  portalPasswordHash: string;
};

export type Project = {
  id: string;
  clientId: string;
  offer: Offer;
  title: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  leadFounderId: string;
  scope: string;
  schedule: "fixed" | "retainer";
  showPrice: boolean;
  clientSummary: string;
};

export type Milestone = {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  amount: number | null;
  note: string;
  clientNote: string;
  approval: Approval;
  order: number;
};

export type Invoice = {
  id: string;
  projectId: string;
  milestoneId: string;
  number: string;
  issueDate: string;
  dueDate: string;
  description: string;
  amount: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  payMethod: PayMethod;
  payMethodNote: string;
  paidDate: string;
  reference: string;
  repeat: "none" | "monthly";
};

export type CompanyEntry = {
  id: string;
  kind: EntryKind;
  name: string;
  amount: number;
  currency: string;
  cadence: Cadence;
  date: string;
  status: EntryStatus;
  note: string;
  clientId: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  offer: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  clientId: string;
};

export type Note = {
  id: string;
  ownerType: OwnerType;
  ownerId: string;
  body: string;
  date: string;
};

export type StoredFile = {
  id: string;
  ownerType: OwnerType;
  ownerId: string;
  name: string;
  note: string;
  dataUrl: string;
  downloadUrl?: string;
  addedAt: string;
  shared: boolean;
  fromClient: boolean;
};

export type Update = {
  id: string;
  clientId: string;
  projectId: string;
  date: string;
  title: string;
  body: string;
  hidden: boolean;
};

export type Reply = {
  id: string;
  updateId: string;
  clientId: string;
  body: string;
  date: string;
  from: "client" | "founder";
  authorName: string;
};

export type Quote = {
  id: string;
  inquiryId: string;
  name: string;
  email: string;
  offer: string;
  title: string;
  amount: number;
  currency: string;
  note: string;
  status: QuoteStatus;
  date: string;
  clientId: string;
  projectId: string;
};

export type Notice = {
  id: string;
  clientId: string;
  kind: "update" | "invoice";
  refId: string;
  title: string;
  body: string;
  createdAt: string;
  status: "queued";
};

export type Activity = {
  id: string;
  at: string;
  actorName: string;
  summary: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  salary: number;
  currency: string;
  status: EmployeeStatus;
  portalEnabled: boolean;
  portalSalt: string;
  portalPasswordHash: string;
  notes: string;
};

export type Assignment = {
  id: string;
  projectId: string;
  employeeId: string;
};

export type Task = {
  id: string;
  projectId: string;
  employeeId: string;
  title: string;
  detail: string;
  dueDate: string;
  status: TaskStatus;
};

export type TimeEntry = {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  note: string;
};

export type DB = {
  founders: Founder[];
  clients: Client[];
  projects: Project[];
  milestones: Milestone[];
  invoices: Invoice[];
  entries: CompanyEntry[];
  inquiries: Inquiry[];
  notes: Note[];
  files: StoredFile[];
  updates: Update[];
  replies: Reply[];
  quotes: Quote[];
  notices: Notice[];
  activity: Activity[];
  employees: Employee[];
  assignments: Assignment[];
  tasks: Task[];
  timeEntries: TimeEntry[];
};

export function emptyDb(): DB {
  return {
    founders: [],
    clients: [],
    projects: [],
    milestones: [],
    invoices: [],
    entries: [],
    inquiries: [],
    notes: [],
    files: [],
    updates: [],
    replies: [],
    quotes: [],
    notices: [],
    activity: [],
    employees: [],
    assignments: [],
    tasks: [],
    timeEntries: [],
  };
}

export function normalizeDb(value: DB): DB {
  return {
    ...value,
    updates: value.updates ?? [],
    replies: value.replies ?? [],
    quotes: value.quotes ?? [],
    notices: value.notices ?? [],
    activity: value.activity ?? [],
    employees: value.employees ?? [],
    assignments: value.assignments ?? [],
    tasks: value.tasks ?? [],
    timeEntries: value.timeEntries ?? [],
    clients: value.clients.map((client) => ({ ...emptyClient(client.id), ...client })),
    projects: value.projects.map((project) => ({
      ...emptyProject(project.id, project.clientId, project.leadFounderId),
      ...project,
    })),
    milestones: value.milestones.map((milestone) => ({
      ...milestone,
      clientNote: milestone.clientNote ?? "",
      approval: milestone.approval ?? "none",
    })),
    invoices: value.invoices.map((invoice) => ({
      ...invoice,
      repeat: invoice.repeat ?? "none",
    })),
    files: value.files.map((file) => ({
      ...file,
      shared: file.shared ?? false,
      fromClient: file.fromClient ?? false,
    })),
  };
}

export function emptyClient(id: string): Client {
  return {
    id,
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
    status: "lead",
    payMethod: "bank",
    payMethodNote: "",
    depositRequired: false,
    depositKind: "percent",
    depositValue: 50,
    balanceDue: "delivery",
    billingEmail: "",
    portalEnabled: false,
    portalSalt: "",
    portalPasswordHash: "",
  };
}

export function emptyProject(id: string, clientId: string, leadFounderId: string): Project {
  return {
    id,
    clientId,
    offer: "Brand Sprint",
    title: "",
    status: "draft",
    startDate: "",
    endDate: "",
    price: 0,
    currency: "USD",
    leadFounderId,
    scope: "",
    schedule: "fixed",
    showPrice: false,
    clientSummary: "",
  };
}

export function emptyInvoice(id: string, number: string): Invoice {
  return {
    id,
    projectId: "",
    milestoneId: "",
    number,
    issueDate: "",
    dueDate: "",
    description: "",
    amount: 0,
    amountPaid: 0,
    currency: "USD",
    status: "draft",
    payMethod: "bank",
    payMethodNote: "",
    paidDate: "",
    reference: "",
    repeat: "none",
  };
}

export function emptyEntry(id: string, kind: EntryKind): CompanyEntry {
  return {
    id,
    kind,
    name: "",
    amount: 0,
    currency: "USD",
    cadence: kind === "subscription" ? "monthly" : kind === "draw" || kind === "passthrough" ? "one-off" : "monthly",
    date: "",
    status: kind === "subscription" ? "active" : "due",
    note: "",
    clientId: "",
  };
}

export function emptyInquiry(id: string): Inquiry {
  return {
    id,
    name: "",
    email: "",
    offer: "Brand Sprint",
    message: "",
    status: "new",
    createdAt: "",
    clientId: "",
  };
}
