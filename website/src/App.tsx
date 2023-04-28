import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
// lazy load this
import Dashboard from "./components/dashboard/Dashboard";
import Pricing from "./components/PricingPage";
import Community from "./components/community/Community";
import Docs from "./components/docs/Docs";

function App() {
  const userState = useUserStore();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    const scope = new URLSearchParams(location.search).get("scope");
    if (!userState.isLoggedIn && code) {
      if (scope) { userState.googleAuth(code); }
      else { userState.githubAuth(code); }
    } else {
      userState.checkSession();
    }
  }, [location]);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Landing Page */}
        <Route path="" element={<Outlet />}>
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
