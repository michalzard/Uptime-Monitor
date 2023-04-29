import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
function Dashboard() {

  return (
    <main className="flex w-full h-full">
      <Sidebar />
      <Outlet />
    </main>
  )
}

export default Dashboard;

// either replace dashboard button with user account button or have it shown somewhere close
// will serve for everything status related