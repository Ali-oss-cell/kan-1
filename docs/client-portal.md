# KAN client portal

A read-only area for one client. It is separate from the public site and separate from Founders at `/k7n/admin`.

The public pages stay as they are. The portal is not linked from the nav, footer, or contact page. Founders keep using `/k7n/admin`. Clients only see their own work.

The same records feed both places. A founder writes in Founders. The client reads the shared part in the portal. Company money, other clients, and internal notes never leave Founders.

## Address

Unlisted path:

`/k7n/portal`

The path only hides the door. Every screen still requires that client’s login. A client who is signed in cannot open another client’s page by changing the address.

| Path | Screen |
|---|---|
| `/k7n/portal` | Sign in |
| `/k7n/portal/home` | Their projects and the latest updates |
| `/k7n/portal/projects` | One project: status, dates, milestones |
| `/k7n/portal/updates` | Updates Founders has published |
| `/k7n/portal/payments` | Their invoices: amount, due date, status, how to pay |

## Who it is for

One login per client, not per project. If a client has three projects, they see all three after one sign in.

Founders turns portal access on for that client. Until it is on, the client has no login. Leads and past clients stay off unless a founder enables them.

A client cannot create projects, edit milestones, or mark an invoice paid. They can read.

## What the client can see

Only records that belong to them, and only the fields below.

### Projects

- Title
- Offer, such as Brand Sprint or Launch Site
- Status: draft, active, waiting on client, delivered, closed
- Start date and target end date
- Lead founder’s name

Price stays in Founders unless a founder chooses to show it on that project. The default is hidden.

Scope notes written for the team stay in Founders. A short client-facing summary can be filled in on the project when there is something worth showing.

### Milestones

- Name
- Due date
- Status: not started, in progress, done, blocked

Internal milestone notes stay in Founders. An optional client note can be shown when the founder writes one for them.

### Updates

An update is a message a founder publishes to that client. It is not the same as an internal note.

- Date
- Project, or the client as a whole
- Title
- Body

The client sees updates newest first. A founder can hide an update after it is published. Hidden updates disappear from the portal and stay in Founders.

### Payments

- Invoice number
- Description
- Amount and currency
- Issue date and due date
- Status: sent, partial, paid, overdue
- How they pay: bank transfer, card, PayPal, or other, plus the payment note
- Date paid

Draft and void invoices stay in Founders. The portal does not charge a card. It shows what was agreed and what is still due.

### Files

A file is visible only when a founder marks it shared. Contracts and briefs the client should have can be shared. Everything else stays in Founders.

## What the client cannot see

- Other clients, their projects, or their invoices
- Inquiries
- Company money: salaries, subscriptions, contractors, owner draws, pass-through costs, and what is left over
- Internal notes
- Files that were not shared
- Founders

## What founders do in Founders

The portal does not have its own database. Founders gains a few controls on the client and the project:

- Portal access: off or on. On sets the client’s email as the login and a starting password, which the founder can reset.
- Show price: off by default.
- Client summary: a short paragraph on the project.
- Client note on a milestone: optional.
- Publish update: title, body, project, date. Hide is available after publish.
- Share file: a switch on a file that is already attached.

Those controls live in `/k7n/admin`, on the client and the project. They are not a second product.

## Sign in

The client signs in with the email stored on their client record and the password a founder set.

A wrong password or a client with portal access off gets the same failure. The screen does not say which one it was.

Signing out returns to `/k7n/portal`. Opening `/k7n/portal/home` while signed out returns to the sign-in screen.

## Data

- A client has one portal login
- A client sees only their projects
- A project has milestones, invoices, and updates
- An update belongs to one client and may belong to one project
- A file is shared or it is not

The PHP site will own the database, same as Founders. Until then, the portal reads the Founders records already saved in this browser.

## Build order

1. Client sign in at `/k7n/portal`, reading the Founders records
2. Home: their projects and the latest updates
3. Project page: status, dates, milestones
4. Updates list
5. Payments list
6. Founders controls: portal access, publish update, share file, show price, client summary

The public pages are not in this list. The Founders screens already built stay as they are, plus the controls in step 6.
