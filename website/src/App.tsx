import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet, useSearchParams, useParams, useNavigate, Navigate } from "react-router-dom";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
// TODO:lazy load this
import LandingPage from "./components/LandingPage";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import DashboardLayout from "./layouts/DashboardLayout";
import Pricing from "./components/PricingPage";
import Community from "./components/community/Community";
import Docs from "./components/docs/Docs";
import { useAppStore } from "./store/appStore";
import HeaderLayout from "./layouts/HeaderLayout";

function App() {
  const auth =authStore();
  const appStore = useAppStore();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    const scope = new URLSearchParams(location.search).get("scope");
    if (!auth.isLoggedIn && code) {
      if (scope) { auth.googleAuth(code); }
      else { auth.githubAuth(code); }
    } else {
      auth.checkSession();
    }
  }, [location]);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route element={<HeaderLayout />}>
          <Route path="" element={<LandingPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Route>

        {/* Pricing */}
        <Route path="/pricing" element={<HeaderLayout />}>
          <Route path="" element={<Pricing />} />
        </Route>
        {/* Community */}
        <Route path="/community" element={<HeaderLayout />}>
          <Route path="" element={<Community />} />
        </Route>
        {/* Documentation */}
        <Route path="/docs" element={<HeaderLayout />}>
          <Route path="" element={<Docs />} />
        </Route>

        {/* Dashboard(Protected) */}

        <Route path="/dashboard" element={<HeaderLayout />}>
          <Route path="" element={<DashboardLayout />}>
            {/* user */}
            <Route path="profile" element={<section>Profile Section</section>} />
            <Route path="billing" element={<section>Billing Section</section>} />
            {/* customization buttons */}
            <Route path="incidents" element={<section>Incidents Section</section>} />
            <Route path="components" element={<section>Component Section</section>} />
            <Route path="listeners" element={<section>Listener email list Section</section>} />
            {/* page related */}
            <Route path="pages">
              <Route path="create" element={<section>Pages create section</section>} />
            </Route>
          </Route>
        </Route>


        {/* TODO: setup 404 route */}
      </Routes>
    </Router >
  )
}

export default App
