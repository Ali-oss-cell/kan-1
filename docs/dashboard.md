# KAN Founders

Internal tool for the three founders. The public site stays as it is: pages, layout, and copy are not part of this work.

The dashboard is a new area inside this React app. Data, login, files, and email live on a separate PHP website. The public site does not read or store this data.

## This version

The screens are at `/k7n/admin`. Records stay in the browser on this computer. Download backup and Restore backup move them between founders. The PHP site replaces that storage later. The public pages are unchanged.

## Address

Unlisted path, not linked from the nav, footer, or contact page:

`/k7n/admin`

`/admin` is too easy to guess. The path only hides the door. Every screen still requires a login. The PHP API rejects any request without a valid session.

| Path | Screen |
|---|---|
| `/k7n/admin` | Sign in |
| `/k7n/admin/home` | Today: unpaid invoices, milestones due, money this month |
| `/k7n/admin/clients` | Clients |
| `/k7n/admin/projects` | Projects |
| `/k7n/admin/payments` | Payments and invoices |
| `/k7n/admin/money` | Company money |
| `/k7n/admin/calendar` | Dates and milestones |

## Who it is for

Founders only, at the start. Each person has their own login. A project can name one founder as the lead.

Client logins are a separate area, specified in [client-portal.md](client-portal.md). They are not part of Founders.

## Clients

A client is the company or founder KAN is working with.

- Name, company, email, phone, country
- Notes
- Status: lead, active, paused, past
- How they prefer to be billed
- Linked projects and payments

A person can exist before any project, so a lead from a call can be saved without opening a job.

## Projects

A project is one sold scope, assigned to one client. One client can have several projects.

Match the offers already on the site when useful:

- Brand Sprint
- Launch Site
- Web/App Build
- Brand + Launch Bundle
- Growth Marketing
- AI Automation Pilot
- Custom

Fields:

- Client
- Offer type
- Title
- Status: draft, active, waiting on client, delivered, closed
- Start date and target end date
- Price agreed, currency (USD unless a job is priced otherwise)
- Lead founder
- Short scope note

Growth Marketing stays a project too, with no fixed end date. Its billing is a subscription, below.

## Milestones and dates

Each project has an ordered list of milestones.

- Name, for example Discovery, Design, Build, Launch
- Due date
- Status: not started, in progress, done, blocked
- Optional amount tied to that milestone
- Note

The home screen lists milestones due in the next 14 days, and anything overdue.

Fixed-scope jobs use milestones. An ongoing retainer can have a monthly check-in date instead of a build sequence.

## How a client pays

Store the method on the client, and allow a different method on a single invoice.

- Bank transfer
- Card
- PayPal
- Other, with a short note

Also store:

- Deposit required or not, and the percent or fixed amount
- When the rest is due: on a milestone, on delivery, or monthly
- Their billing email, if it differs from the main contact

Recording a method does not charge the card. The dashboard records what was agreed and what arrived. Online charging can be added later.

## Payments

Money the client owes or has paid.

An invoice belongs to one project.

- Number
- Issue date and due date
- Line items, or one line for the milestone
- Amount, currency
- Status: draft, sent, partial, paid, overdue, void
- Method they will use
- Date paid, and a reference (transfer id, receipt note)

A deposit is the first invoice. Later invoices can point at a milestone.

The home screen shows overdue invoices and invoices due this week.

## Company money

This is KAN’s own cash, separate from a client’s project price.

### Income

Comes from paid invoices. A paid invoice increases income in that month. An unpaid invoice is expected money, not income yet.

Show:

- Received this month
- Outstanding
- Received by project and by client

### Salaries

A recurring or one-off payout to a founder or employee.

- Person
- Amount
- Cadence: monthly or one-off
- Pay date
- Status: due, paid

### Subscriptions

Tools the company pays to keep working: hosting, design, AI, email, domains.

- Name
- Amount
- Cadence: monthly or yearly
- Next renewal date
- Status: active, cancelled

### Also track from the start

- Contractor payouts, when someone outside the three founders is paid for a job
- Owner draw, money a founder takes out that is not salary
- Pass-through costs, such as ad spend billed back to a client. Mark these so they are not treated as company profit

Home month view:

- Income received
- Salaries
- Subscriptions
- Contractors
- Left over

Left over is a simple sum, not accounting profit and not a tax return.

## What else is worth having

Add these in the first build. They are small, and the rest of the tool is weaker without them.

- **Inquiries.** A lead can be typed in here. Name, email, offer, message, status: new, talking, won, lost. Won creates a client and an optional project. The public contact form stays unchanged until you choose to connect it.
- **Files.** Contract, brief, or invoice PDF attached to a client or project. Stored by the PHP site, not in the React repo.
- **Activity note.** A dated note on a client or project: call, decision, scope change.
- **Reminders.** Unpaid invoice past its due date. Milestone due within 7 days. Subscription renewing within 14 days.

Leave these until the first version is in use.

- Client login and a portal — see [client-portal.md](client-portal.md)
- Proposals generated as documents
- Automatic card charging
- Time tracking
- Tax reports
- Email inside the dashboard
- Permissions finer than “founder can do everything”

## Roles

One role at the start: founder. They can see and edit all of the above.

A later role, if you hire, is staff: they see assigned projects and cannot open company money.

## Data

- A client has many projects
- A project belongs to one client and has many milestones
- An invoice belongs to one project and may belong to one milestone
- A payment is the paid state of an invoice
- Salary, subscription, contractor cost, and owner draw are company entries, not client invoices
- An inquiry may become a client

The PHP site owns the database. The React screens only display and submit forms.

## Build order

1. Login and the unlisted `/k7n/admin` shell
2. Clients and projects, including assigning a project to a client
3. Milestones and dates
4. Invoices, payment method, and paid date
5. Company money: income from paid invoices, salaries, subscriptions
6. Home screen of what is due
7. Files, notes, and reminders

The public pages are not in this list.
