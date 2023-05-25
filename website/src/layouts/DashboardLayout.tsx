import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { usePageStore } from "../store/pageStore";
import { SwipeableDrawer } from "../components/customUI/Drawer";
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = usePageStore();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard" && page.currentPage?.id) { navigate(`/dashboard/${page.currentPage?.id}/incidents`); }
  }, [location]);

  // load pages
  useEffect(() => page.loadAll(navigate), []);

  return (
    <main className="flex w-full h-[calc(100vh-64px)]">
      <Sidebar hide={true} closeDrawer={() => setDrawerOpen(false)} />

      <SwipeableDrawer isOpen={drawerOpen} open={() => { setDrawerOpen(true) }} close={() => setDrawerOpen(false)}>
        <Sidebar fullWidth={true} closeDrawer={() => setDrawerOpen(false)} />
      </SwipeableDrawer>
      <Outlet />
      <section>
        {page.pages.length === 0 ? "Create Page first" : null}
      </section>
    </main>
  )
}
export default Dashboard;