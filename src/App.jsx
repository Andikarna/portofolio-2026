import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import Home from "./views/home.jsx";
import GetUserView from "./views/getusers.jsx";
import Form from "./views/form.jsx";
import Register from "./views/register.jsx";
import Loby from "./views/loby.jsx";
import { jwtDecode } from "jwt-decode";
import { logout } from "./api/api.js";


import "./css/base.css";
import "./css/layout.css";
import Experience from "./views/page/experience.jsx";
import Skills from "./views/page/skills.jsx";
import Project from "./views/page/project.jsx";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLogin = !!localStorage.getItem("token");

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/form");
      return null;
    }

    const decoded = jwtDecode(token);

    try {
      const response = await logout({
        id: decoded.userid
      });

      if (response.status == 200) {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token");

        setTimeout(() => navigate("/"), 2000);
      }

    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    navigate("/form");
  };

  return (
    <div className="app-bg">
      <nav>
        <div className="logo">
          <Link to="/">MyPortfolio</Link>
        </div>
        <div>
          {!isLogin ? (
            <Link to="/form" className="login-link">
              <FaSignInAlt />
              Login
            </Link>
          ) : (
            <>
              <Link to="/user">Projects</Link>
              <Link to="/" className="logout-link" onClick={handleLogout}>
                <FaSignOutAlt />
                {loading ? "Logging out..." : "Logout"}
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} /> {/* optional */}
        <Route path="/user" element={<GetUserView />} />
        <Route path="/form" element={<Form />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loby" element={<Loby />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/project" element={<Project />} />
        <Route path="*" element={<Home />} /> {/* fallback */}
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
