import { formatMoney, labelOf } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import { EMPLOYEE_STATUSES } from "@/dashboard/types";
import { PageHeading, Status } from "@/dashboard/ui";

export function CrewProfile() {
  const { crew } = useDashboard();
  if (!crew) return null;

  return (
    <>
      <PageHeading title="Profile" lede="What Founders has on file for you. Ask them to change a salary or a role." />
      <div className="border-3 border-ink bg-paper p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-[32px] font-extrabold uppercase leading-none">{crew.name}</h2>
          <Status value={crew.status} label={labelOf(EMPLOYEE_STATUSES, crew.status)} />
        </div>
        <dl className="mt-5 grid gap-3 text-small sm:grid-cols-2">
          <div>
            <dt className="label text-ink/50">Role</dt>
            <dd>{crew.role || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Email</dt>
            <dd>{crew.email || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Phone</dt>
            <dd>{crew.phone || "—"}</dd>
          </div>
          <div>
            <dt className="label text-ink/50">Salary</dt>
            <dd>{formatMoney(crew.salary, crew.currency)} a month</dd>
          </div>
        </dl>
        {crew.notes ? <p className="mt-4 whitespace-pre-wrap text-body">{crew.notes}</p> : null}
      </div>
    </>
  );
}
