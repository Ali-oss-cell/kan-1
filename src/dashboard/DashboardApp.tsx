import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Shell } from "@/dashboard/Shell";
import { Calendar } from "@/dashboard/screens/Calendar";
import { Clients } from "@/dashboard/screens/Clients";
import { Employees } from "@/dashboard/screens/Employees";
import { Home } from "@/dashboard/screens/Home";
import { Inquiries } from "@/dashboard/screens/Inquiries";
import { Money } from "@/dashboard/screens/Money";
import { Payments } from "@/dashboard/screens/Payments";
import { Projects } from "@/dashboard/screens/Projects";
import { SignIn } from "@/dashboard/screens/SignIn";
import { DashboardProvider, useDashboard } from "@/dashboard/store";

export function DashboardApp() {
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
        <Route path="/k7n/admin" element={<SignIn />} />
        <Route element={<FoundersLayout />}>
          <Route path="/k7n/admin/home" element={<Home />} />
          <Route path="/k7n/admin/inquiries" element={<Inquiries />} />
          <Route path="/k7n/admin/clients" element={<Clients />} />
          <Route path="/k7n/admin/projects" element={<Projects />} />
          <Route path="/k7n/admin/payments" element={<Payments />} />
          <Route path="/k7n/admin/money" element={<Money />} />
          <Route path="/k7n/admin/calendar" element={<Calendar />} />
          <Route path="/k7n/admin/employees" element={<Employees />} />
        </Route>
        <Route path="*" element={<Navigate to="/k7n/admin" replace />} />
      </Routes>
    </DashboardProvider>
  );
}

function FoundersLayout() {
  const { founder } = useDashboard();
  if (!founder) return <Navigate to="/k7n/admin" replace />;
  return (
    <Shell>
      <FoundersTitle />
      <Outlet />
    </Shell>
  );
}

function FoundersTitle() {
  useEffect(() => {
    document.title = "Founders | KAN";
  }, []);
  return null;
}
