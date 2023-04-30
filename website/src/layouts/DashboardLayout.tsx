import { useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/dashboard") navigate("/dashboard/incidents");
  }, []);
  return (
    <main className="flex w-full h-full">
      <Sidebar />
      <Outlet />
    </main>
  )
}
export default Dashboard;