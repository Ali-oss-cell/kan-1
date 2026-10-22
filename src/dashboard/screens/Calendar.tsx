import { useState } from "react";
import { agenda, thisMonth } from "@/dashboard/logic";
import { MonthCalendar } from "@/dashboard/MonthCalendar";
import { useDashboard } from "@/dashboard/store";
import { PageHeading } from "@/dashboard/ui";

const HREF: Record<string, string> = {
  Milestone: "/k7n/admin/projects",
  Invoice: "/k7n/admin/payments",
  Renewal: "/k7n/admin/money",
  Salary: "/k7n/admin/money",
  Contractor: "/k7n/admin/money",
  Draw: "/k7n/admin/money",
  "Pass-through": "/k7n/admin/money",
};

export function Calendar() {
  const { db } = useDashboard();
  const [month, setMonth] = useState(thisMonth);

  return (
    <>
      <PageHeading title="Calendar" lede="Milestones, invoice due dates, pay dates, and renewals." />
      <MonthCalendar
        month={month}
        onMonth={setMonth}
        items={agenda(db, month)}
        hrefFor={(item) => HREF[item.kind] ?? "/k7n/admin/home"}
      />
    </>
  );
}
