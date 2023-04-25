import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
// lazy load this
import Dashboard from "./components/dashboard/Dashboard";
import Pricing from "./components/Pricing";
import Community from "./components/community/Community";
import Docs from "./components/docs/Docs";

function App() {
  const user = useUserStore();
  useEffect(() => {
    user.checkSession();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Outlet />}>
          <Route path="" element={<LandingPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Route>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Outlet />}>
          <Route path="" element={<Dashboard />} />
        </Route>
        {/* Pricing */}
        <Route path="/pricing" element={<Outlet />}>
          <Route path="" element={<Pricing />} />
        </Route>
        {/* Community */}
        <Route path="/community" element={<Outlet />}>
          <Route path="" element={<Community />} />
        </Route>
        {/* Documentation */}
        <Route path="/docs" element={<Outlet />}>
          <Route path="" element={<Docs />} />
        </Route>
        {/* TODO: setup 404 route */}
      </Routes>
    </Router >
  )
}

export default App
