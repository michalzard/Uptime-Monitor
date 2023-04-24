import Header from "./components/Header"
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";
function App() {
  const user = useUserStore();
  useEffect(() => {
    user.checkSession();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="">
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App
