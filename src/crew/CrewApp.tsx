import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { DashboardProvider, useDashboard } from "@/dashboard/store";
import { CrewHome } from "@/crew/Home";
import { CrewProfile } from "@/crew/Profile";
import { CrewProjects } from "@/crew/Projects";
import { CrewShell } from "@/crew/Shell";
import { CrewSignIn } from "@/crew/SignIn";
import { CrewTasks } from "@/crew/Tasks";
import { CrewTime } from "@/crew/Time";

export function CrewApp() {
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
        <Route path="/k7n/crew" element={<CrewSignIn />} />
        <Route element={<CrewLayout />}>
          <Route path="/k7n/crew/home" element={<CrewHome />} />
          <Route path="/k7n/crew/tasks" element={<CrewTasks />} />
          <Route path="/k7n/crew/projects" element={<CrewProjects />} />
          <Route path="/k7n/crew/time" element={<CrewTime />} />
          <Route path="/k7n/crew/profile" element={<CrewProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/k7n/crew" replace />} />
      </Routes>
    </DashboardProvider>
  );
}

function CrewLayout() {
  const { crew } = useDashboard();
  useEffect(() => {
    document.title = "Crew | KAN";
  }, []);
  if (!crew) return <Navigate to="/k7n/crew" replace />;
  return (
    <CrewShell>
      <Outlet />
    </CrewShell>
  );
}
