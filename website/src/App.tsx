import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet, useSearchParams, useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
// TODO:lazy load this
import LandingPage from "./pages/LandingPage";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import DashboardLayout from "./layouts/DashboardLayout";
import PricingPage from "./pages/PricingPage";
import CommunityPage from "./pages/CommunityPage";
import DocumentationPage from "./pages/DocumentationPage";
import HeaderLayout from "./layouts/HeaderLayout";
import UserProfilePage from "./pages/UserProfilePage";
import UserBillingPage from "./pages/UserBillingPage";

function App() {
  const auth = useAuthStore();

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

        <Route element={<HeaderLayout />}>
          <Route path="" element={<LandingPage />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Route>

        {/* Pricing */}
        <Route path="/pricing" element={<HeaderLayout />}>
          <Route path="" element={<PricingPage />} />
        </Route>
        {/* Community */}
        <Route path="/community" element={<HeaderLayout />}>
          <Route path="" element={<CommunityPage />}>
          </Route>
        </Route>
        {/* Documentation */}
        <Route path="/docs" element={<HeaderLayout />}>
          <Route path="" element={<DocumentationPage />}>
          </Route>
        </Route>
        {/* Status Page  */}
        <Route path="/page">
          <Route path=":id" element={<div className="w-full h-full flex items-center justify-center bg-slate-50 text-7xl font-bold ">Status page</div>} />
        </Route>

        {/* Dashboard(Protected) */}
        <Route path="/dashboard" element={<HeaderLayout />}>
          <Route path="" element={<DashboardLayout />}>
            {/* user routes */}
            <Route path="user">
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="billing" element={<UserBillingPage />} />
            </Route>

            {/* page related by id */}
            <Route path=":id">
              {/* customization buttons */}
              <Route path="incidents" element={<section>Incidents Section</section>} />
              <Route path="components" element={<section>Component Section</section>} />
              <Route path="subscribers" element={<section>Subscriber email list Section</section>} />
            </Route>
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
