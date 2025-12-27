import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopActions from "../views/components/top-actions.jsx";
import { FaBriefcase, FaCode, FaProjectDiagram, FaUserTie } from "react-icons/fa";
import "../css/loby.css";

export default function Loby() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    return null; // AuthGuard will handle redirect
  }

  const decoded = jwtDecode(token);
  const username = decoded.username || decoded.Name || "Tamu";

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
              <p>1+ Tahun</p>
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
              <ul className="list-experience">
                <li>
                  <span className="bullet">✔</span>
                  <div>
                    <strong>Frontend Developer</strong>
                    <br /> Membangun antarmuka responsif dengan React & Tailwind.
                  </div>
                </li>
                <li>
                  <span className="bullet">✔</span>
                  <div>
                    <strong>Android Developer</strong>
                    <br /> Pengembangan aplikasi native menggunakan Kotlin & Firebase.
                  </div>
                </li>
                <li>
                  <span className="bullet">✔</span>
                  <div>
                    <strong>Backend Engineer</strong>
                    <br /> Merancang REST API yang aman dengan .NET Core.
                  </div>
                </li>
              </ul>
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
