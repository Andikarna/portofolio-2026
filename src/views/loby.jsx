import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopActions from "../views/components/top-actions.jsx";
import { FaBriefcase, FaCode, FaProjectDiagram, FaUserTie } from "react-icons/fa";
import { getExperiences } from "../api/api";
import "../css/loby.css";

export default function Loby() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [totalYears, setTotalYears] = useState(0);

  const token = localStorage.getItem("token");
  // AuthGuard usually handles redirect, but early return here is safe
  if (!token) return null;

  const decoded = jwtDecode(token);
  const username = decoded.username || decoded.Name || "Tamu";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch specifically for this user context
      const result = await getExperiences(1, 100, token); // Fetch enough to calc stats

      let list = [];
      if (result && Array.isArray(result.data.data)) {
        list = result.data.data;
      } else if (Array.isArray(result)) {
        list = result;
      }

      setExperiences(list);
      calculateTotalYears(list);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const calculateTotalYears = (list) => {
    let totalms = 0;
    list.forEach(exp => {
      const start = new Date(exp.startDate).getTime();
      const end = exp.endDate ? new Date(exp.endDate).getTime() : new Date().getTime();
      if (!isNaN(start) && !isNaN(end)) {
        totalms += (end - start);
      }
    });

    // Convert ms to years (approx)
    const years = totalms / (1000 * 60 * 60 * 24 * 365.25);
    setTotalYears(Math.max(1, Math.floor(years))); // Floor to nearest, min 1 for show
  };

  // Get top 3 recent for summary
  const recentExperiences = experiences.slice(0, 3);

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1>Halo, {username} 👋</h1>
            <p className="subtitle">Selamat datang di Dashboard Profesional Anda.</p>
          </div>
          <div className="header-status">
            <span className="status-badge">Open to Work</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon path-1">
              <FaBriefcase />
            </div>
            <div className="stat-info">
              <h3>Pengalaman</h3>
              <p>{totalYears}+ Tahun</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon path-2">
              <FaProjectDiagram />
            </div>
            <div className="stat-info">
              <h3>Proyek Selesai</h3>
              <p>15+ Proyek</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon path-3">
              <FaCode />
            </div>
            <div className="stat-info">
              <h3>Stack Utama</h3>
              <p>React, .NET</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon path-4">
              <FaUserTie />
            </div>
            <div className="stat-info">
              <h3>Peran</h3>
              <p>Fullstack Dev</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-content">
          {/* Left Column: About & Experience */}
          <div className="content-left">
            <div className="content-card">
              <h2>Tentang Saya</h2>
              <p className="intro-text">
                Seorang Software Engineer yang berdedikasi dengan spesialisasi dalam pengembangan
                web modern dan aplikasi mobile. Saya membangun solusi digital yang skalabel,
                bersih, dan mudah dipelihara dengan fokus pada dampak bisnis dan pengalaman pengguna.
              </p>
            </div>

            <div className="content-card">
              <h2>Ringkasan Pengalaman</h2>
              {/* Dynamic Experience List */}
              {experiences.length > 0 ? (
                <ul className="list-experience">
                  {recentExperiences.map((exp, i) => (
                    <li key={i}>
                      <span className="bullet">✔</span>
                      <div>
                        <strong>{exp.title || exp.role}</strong>
                        <br /> {exp.company}
                        {/* Optional: Add brief date or tech if desired */}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#aaa", fontStyle: "italic" }}>Belum ada data pengalaman.</p>
              )}
            </div>
          </div>

          {/* Right Column: Featured Projects */}
          <div className="content-right">
            <div className="content-card">
              <div className="card-header-row">
                <h2>Proyek Unggulan</h2>
                <button className="view-all-btn" onClick={() => navigate("/project")}>Lihat Semua</button>
              </div>
              <div className="project-list">
                <div className="project-item">
                  <div className="project-icon mobile">📱</div>
                  <div className="project-details">
                    <h4>Aplikasi Mobile AI</h4>
                    <p>Klasifikasi Gambar & Streaming</p>
                  </div>
                </div>
                <div className="project-item">
                  <div className="project-icon web">🌐</div>
                  <div className="project-details">
                    <h4>E-commerce UMKM</h4>
                    <p>Platform Toko Online Tanaman</p>
                  </div>
                </div>
                <div className="project-item">
                  <div className="project-icon chat">💬</div>
                  <div className="project-details">
                    <h4>Realtime Chat</h4>
                    <p>Aplikasi Pesan dengan Firebase</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="cta-card">
              <h3>Tertarik bekerja sama?</h3>
              <p>Saya siap membantu mewujudkan ide proyek Anda.</p>
              <button className="primary-cta" onClick={() => navigate("/contact")}>Hubungi Saya</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
