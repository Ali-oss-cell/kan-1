import { useState } from "react";
import { portalAgenda, thisMonth } from "@/dashboard/logic";
import { MonthCalendar } from "@/dashboard/MonthCalendar";
import { useDashboard } from "@/dashboard/store";
import { PageHeading } from "@/dashboard/ui";

export function PortalCalendar() {
  const { db, portalClient } = useDashboard();
  const [month, setMonth] = useState(thisMonth);
  if (!portalClient) return null;
  const clientId = portalClient.id;

  return (
    <>
      <PageHeading title="Calendar" lede="Milestone and invoice dates for your work." />
      <MonthCalendar
        month={month}
        onMonth={setMonth}
        items={portalAgenda(db, clientId, month)}
        hrefFor={(item) => {
          if (item.kind === "Milestone") {
            const milestone = db.milestones.find((entry) => entry.id === item.id);
            return milestone ? `/k7n/portal/projects?project=${milestone.projectId}` : "/k7n/portal/projects";
          }
          if (item.kind === "Invoice") return "/k7n/portal/payments";
          return undefined;
        }}
      />
    </>
  );
}
