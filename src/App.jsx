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
import AuthGuard from "./views/components/auth-guard.jsx";


import "./css/base.css";
import "./css/layout.css";
import Experience from "./views/page/experience.jsx";
import Skills from "./views/page/skills.jsx";

import Project from "./views/page/project.jsx";
import Article from "./views/page/article.jsx";
import ArticleDetail from "./views/page/article-detail.jsx";
import ProjectDetail from "./views/page/project-detail.jsx";
import ExperienceForm from "./views/page/experience-form.jsx";
import ExperienceDetail from "./views/page/experience-detail.jsx";
import SkillsForm from "./views/page/skills-form.jsx";
import ProjectForm from "./views/page/project-form.jsx";
import ArticleForm from "./views/page/article-form.jsx";

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
          <Link to="/">&lt;/AK&gt;</Link>
        </div>
        <div>
          {!isLogin ? (
            <Link to="/form" className="login-link">
              <FaSignInAlt />
              Login
            </Link>
          ) : (
            <>
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
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<GetUserView />} />
        <Route path="/form" element={<Form />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loby" element={<AuthGuard><Loby /></AuthGuard>} />
        <Route path="/experience" element={<AuthGuard><Experience /></AuthGuard>} />
        <Route path="/experience/add" element={<AuthGuard><ExperienceForm /></AuthGuard>} />
        <Route path="/experience/edit/:id" element={<AuthGuard><ExperienceForm /></AuthGuard>} />
        <Route path="/experience/:id" element={<AuthGuard><ExperienceDetail /></AuthGuard>} />
        <Route path="/skills" element={<AuthGuard><Skills /></AuthGuard>} />
        <Route path="/skills/add" element={<AuthGuard><SkillsForm /></AuthGuard>} />
        <Route path="/skills/edit/:id" element={<AuthGuard><SkillsForm /></AuthGuard>} />
        <Route path="/project" element={<AuthGuard><Project /></AuthGuard>} />
        <Route path="/project/add" element={<AuthGuard><ProjectForm /></AuthGuard>} />
        <Route path="/project/edit/:id" element={<AuthGuard><ProjectForm /></AuthGuard>} />
        <Route path="/project/:id" element={<AuthGuard><ProjectDetail /></AuthGuard>} />
        <Route path="/article" element={<AuthGuard><Article /></AuthGuard>} />
        <Route path="/article/add" element={<AuthGuard><ArticleForm /></AuthGuard>} />
        <Route path="/article/edit/:id" element={<AuthGuard><ArticleForm /></AuthGuard>} />
        <Route path="/article/:id" element={<AuthGuard><ArticleDetail /></AuthGuard>} />
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
