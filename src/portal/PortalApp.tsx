import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { DashboardProvider, useDashboard } from "@/dashboard/store";
import { PortalCalendar } from "@/portal/Calendar";
import { PortalHome } from "@/portal/Home";
import { PortalPayments } from "@/portal/Payments";
import { PortalProfile } from "@/portal/Profile";
import { PortalProjects } from "@/portal/Projects";
import { PortalShell } from "@/portal/Shell";
import { PortalSignIn } from "@/portal/SignIn";
import { PortalUpdates } from "@/portal/Updates";

export function PortalApp() {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);

  return (
    <DashboardProvider>
      <Routes>
        <Route path="/k7n/portal" element={<PortalSignIn />} />
        <Route element={<PortalLayout />}>
          <Route path="/k7n/portal/home" element={<PortalHome />} />
          <Route path="/k7n/portal/projects" element={<PortalProjects />} />
          <Route path="/k7n/portal/updates" element={<PortalUpdates />} />
          <Route path="/k7n/portal/payments" element={<PortalPayments />} />
          <Route path="/k7n/portal/calendar" element={<PortalCalendar />} />
          <Route path="/k7n/portal/profile" element={<PortalProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/k7n/portal" replace />} />
      </Routes>
    </DashboardProvider>
  );
}

function PortalLayout() {
  const { portalClient } = useDashboard();
  useEffect(() => {
    document.title = "Portal | KAN";
  }, []);
  if (!portalClient) return <Navigate to="/k7n/portal" replace />;
  return (
    <PortalShell>
      <Outlet />
    </PortalShell>
  );
}
