import { useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { usePageStore } from "../store/pageStore";
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = usePageStore();
  useEffect(() => {
    if (location.pathname === "/dashboard" && page.currentPage?.id) { navigate(`/dashboard/${page.currentPage?.id}/incidents`); }
  }, [location]);

  return (
    <main className="flex w-full h-[calc(100vh-64px)]">
      <Sidebar />
      <Outlet />
      <section>
        {page.pages.length === 0 ? "Create Page first" : null}
      </section>
    </main>
  )
}
export default Dashboard;