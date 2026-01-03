import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopActions from "../views/components/top-actions.jsx";
import { FaBriefcase, FaCode, FaProjectDiagram, FaUserTie } from "react-icons/fa";
import { getExperiences, getProjects, getSkills } from "../api/api";
import "../css/loby.css";

export default function Loby() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [totalYears, setTotalYears] = useState(0);
  const [completedProjectCount, setCompletedProjectCount] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [topSkillsStr, setTopSkillsStr] = useState("-");

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

      // Projects Stats
      try {
        const projData = await getProjects();
        let pList = [];
        if (Array.isArray(projData)) pList = projData;
        else if (projData?.data?.items) pList = projData.data.items;
        else if (Array.isArray(projData?.data)) pList = projData.data;

        // Prioritize Featured, then Completed
        let featuredAndCompleted = pList.filter(p =>
          p.featured || p.status === 'Selesai' || p.status === 'On Going' || p.status === 'Completed'
        );

        // Sort by latest createdDate
        featuredAndCompleted.sort((a, b) => {
          const dateA = new Date(a.createdDate || a.createdAt || 0);
          const dateB = new Date(b.createdDate || b.createdAt || 0);
          return dateB - dateA; // Descending
        });

        // Count only completed for stats
        const completedOnly = pList.filter(p =>
          p.status === 'Selesai' || p.status === 'completed' || p.status === 'Completed'
        );

        setCompletedProjectCount(completedOnly.length);
        setFeaturedProjects(featuredAndCompleted.slice(0, 3));
      } catch (err) { console.error(err); }

      // Skills Stats
      try {
        const skillData = await getSkills();
        let sList = [];
        if (Array.isArray(skillData)) sList = skillData;
        else if (skillData?.data?.items) sList = skillData.data.items;
        else if (Array.isArray(skillData?.data)) sList = skillData.data;

        const favs = sList
          .filter(s => s.isFeatured || s.isFavorite || s.favorite)
          .slice(0, 2)
          .map(s => s.name || s.title)
          .join(", ");
        setTopSkillsStr(favs || "-");
      } catch (err) { console.error(err); }

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

  const getImageSrc = (image) => {
    if (!image) return "https://placehold.co/100x100/1f1f1f/FFF?text=No+Img";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return `data:image/png;base64,${image}`;
  };

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
              <p>{completedProjectCount} Proyek</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon path-3">
              <FaCode />
            </div>
            <div className="stat-info">
              <h3>Stack Utama</h3>
              <p>{topSkillsStr}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon path-4">
              <FaUserTie />
            </div>
            <div className="stat-info">
              <h3>Peran</h3>
              <p>Software Engineer</p>
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
                {featuredProjects.length > 0 ? (
                  featuredProjects.map((proj, i) => (
                    <div
                      className="project-item"
                      key={i}
                      onClick={() => navigate(`/project/${proj.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="project-icon web">
                        {proj.coverImageUrl || proj.image ? (
                          <img
                            src={getImageSrc(proj.coverImageUrl || proj.image)}
                            alt={proj.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : "🌐"}
                      </div>
                      <div className="project-details">
                        <h4>{proj.title}</h4>
                        <p>{(() => {
                          const txt = proj.summary || proj.description || "No Project Summary";
                          return txt.length > 35 ? txt.substring(0, 35) + "..." : txt;
                        })()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#aaa", fontStyle: "italic", padding: "1rem" }}>Belum ada proyek selesai yang ditampilkan.</p>
                )}
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
