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
  // load pages
  useEffect(() => {
    page.loadAll(navigate, true);
  }, []);

  return (
    <main className="flex w-full h-[calc(100vh-64px)]">
      <Sidebar hide={true} closeDrawer={() => setDrawerOpen(false)} />

      <SwipeableDrawer isOpen={drawerOpen} open={() => { setDrawerOpen(true) }} close={() => setDrawerOpen(false)}>
        <Sidebar fullWidth={true} closeDrawer={() => setDrawerOpen(false)} />
      </SwipeableDrawer>
      <Outlet />
      {page.pages.length === 0 && location.pathname === "/dashboard" ?
        <section className="w-full lg:w-[calc(100vw-300px)] flex flex-col items-center justify-center bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(/dashboard/createpage.png)` }} >
          <span className="text-white font-semibold text-3xl lg:text-4xl">Start by creating new page </span>
          {/* <ArrowLeftIcon className="w-8 h-8 lg:w-10 lg:h-10 text-white" /> */}
        </section>
        : null
      }
    </main >
  )
}
export default Dashboard;