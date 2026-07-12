import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/api.js";
import {
  FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaGraduationCap, FaBriefcase, FaCode, FaBrain, FaExternalLinkAlt, FaGithub,
  FaPhp, FaReact, FaDatabase, FaWindows, FaTerminal, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaImages
} from "react-icons/fa";
import {
  SiDotnet, SiGo, SiNextdotjs, SiKotlin,
  SiMysql, SiPostgresql, SiXampp
} from "react-icons/si";
import photo from "../assets/logo.png";
import "../css/portofolio.css";
import { FEATURED_PROJECTS } from "../data/featured-projects.js";

export default function Portofolio() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedExp, setExpandedExp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFeaturedPage, setCurrentFeaturedPage] = useState(1);
  const projectsPerPage = 3; // Menampilkan 3 item per halaman
  const featuredProjectsPerPage = 4; // Menampilkan 4 item unggulan per halaman

  const toggleExp = (id) => {
    setExpandedExp(prev => prev === id ? null : id);
  };

  const [showAllFeaturedModal, setShowAllFeaturedModal] = useState(false);
  const [glitchTitle, setGlitchTitle] = useState("Software Engineer");

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchTitle(prev => prev === "Software Engineer" ? "AI Native Engineer" : "Software Engineer");
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (showAllFeaturedModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAllFeaturedModal]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const completedProjects = [
    {
      id: "hc-8",
      title: "PromptVault AI",
      description: "Aplikasi premium untuk menyimpan, mengelola, melakukan versi, serta mengoptimalkan prompt AI yang terintegrasi secara langsung dengan sinkronisasi Google Sheets.",
      projectStatus: "Selesai",
      githubUrl: "https://github.com/Andikarna/promptvault-app",
      projectUrl: "https://promptvault-app-peach.vercel.app",
      tools: ["Next.js", "Tailwind CSS", "Google Sheets API"],
      coverImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-7",
      title: "AI Code Reviewer",
      description: "Aplikasi cerdas berbasis AI untuk meninjau kualitas kode, memberikan saran optimasi performa, serta mendeteksi potensi bug secara otomatis menggunakan teknologi Gemini AI Pro.",
      projectStatus: "Selesai",
      githubUrl: "https://github.com/Andikarna/ai-code-review",
      projectUrl: "https://ai-codes-review.netlify.app",
      tools: ["NextJS", "Gemini AI Pro", "Tailwind CSS"],
      coverImageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-6",
      title: "AI Screening App",
      description: "Aplikasi berbasis AI untuk menyortir dan meninjau resume pelamar kerja secara otomatis dengan teknologi cerdas Gemini Pro.",
      projectStatus: "Selesai",
      githubUrl: "https://github.com/Andikarna/ai-recruitment-screening",
      projectUrl: "https://ai-screening-app.netlify.app/",
      tools: ["NextJs", ".NET Framework", "MySQL", "Gemini AI Pro"],
      coverImageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-5",
      title: "Task Management API",
      description: "RESTful API untuk manajemen tugas dengan fitur autentikasi JWT, role-based access control, dan dokumentasi terintegrasi.",
      projectStatus: "Selesai",
      githubUrl: "https://github.com/andikarna/task-api",
      projectUrl: "https://api.taskmanager.com",
      tools: ["Golang", "Gin", "PostgreSQL", "Docker"],
      coverImageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-4",
      title: "E-Commerce Plants with AI",
      description: "Aplikasi E-commerce penjualan tanaman hias dengan fitur deteksi gambar pintar berbasis machine learning (AI) pada project capstone di Bangkit Academy.",
      projectStatus: "Selesai",
      githubUrl: "https://github.com/andikarna/ecommerce-ai",
      projectUrl: "https://plant-ai.store",
      tools: ["Kotlin", "Firebase", "TensorFlow Lite"],
      coverImageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-3",
      title: "Metal Production Report",
      description: "Sistem report produksi metal di PT Sinar Metrindo Perkasa untuk memonitor aliran data material, proses produksi, hingga quality control.",
      projectStatus: "Selesai",
      githubUrl: "",
      projectUrl: "#",
      tools: ["C#", "Windows Forms", "MySQL"],
      coverImageUrl: "https://images.unsplash.com/photo-1531297172864-dd3b118b7cb6?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-2",
      title: "Daily Production Report",
      description: "Sistem pelaporan harian produksi pada PT Aneka Komkar Utama untuk melacak efisiensi waktu dan metrik output pabrik secara real-time.",
      projectStatus: "Selesai",
      githubUrl: "",
      projectUrl: "#",
      tools: ["C#", "ASP.NET Core", "SQL Server"],
      coverImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "hc-1",
      title: "Laundry Application System",
      description: "Aplikasi manajemen operasional laundry terintegrasi dari pencatatan transaksi hingga laporan pendapatan untuk klien di daerah Rajeg.",
      projectStatus: "Selesai",
      githubUrl: "",
      projectUrl: "https://laundry-demo.app",
      tools: ["PHP", "MySQL", "Bootstrap"],
      coverImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const fetchProjects = async () => {
    try {
      const projData = await getProjects();
      let pList = [];
      if (Array.isArray(projData)) pList = projData;
      else if (projData?.data?.items) pList = projData.data.items;
      else if (Array.isArray(projData?.data)) pList = projData.data;

      setProjects([...completedProjects, ...pList]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(completedProjects);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (url, base64) => {
    if (url) return url;
    if (base64) return `data:image/jpeg;base64,${base64}`;
    return "https://via.placeholder.com/400x300/1f1f1f/008080?text=No+Image";
  };

  const featuredProjects = FEATURED_PROJECTS;

  // Pagination logic for Other Projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic for Featured Projects
  const indexOfLastFeatured = currentFeaturedPage * featuredProjectsPerPage;
  const indexOfFirstFeatured = indexOfLastFeatured - featuredProjectsPerPage;
  const currentFeaturedList = featuredProjects.slice(indexOfFirstFeatured, indexOfLastFeatured);
  const totalFeaturedPages = Math.ceil(featuredProjects.length / featuredProjectsPerPage);

  const paginateFeatured = (pageNumber) => setCurrentFeaturedPage(pageNumber);

  return (
    <div className="portfolio-container">
      {/* HEADER NAVIGATION */}
      <div className="portfolio-nav fade-in-up" style={{ animationDelay: '0s' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Kembali ke Beranda
        </button>
      </div>

      {/* HERO / BIO SECTION */}
      <header className="portfolio-hero fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="hero-content-wrapper">
          <img src={photo} alt="Andi Karna" className="hero-img" />
          <h1 className="hero-name">Andi Karna</h1>
          <h2 className="hero-role glitch-text" data-text={glitchTitle}>{glitchTitle}</h2>
          <div className="hero-desc" style={{ textAlign: 'center', maxWidth: '850px', marginTop: '20px', lineHeight: '1.8', color: 'var(--web-text-muted)', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '20px', textAlign: 'center' }}>
              Software Engineer yang bertransformasi menjadi AI Native Engineer, berfokus membangun aplikasi enterprise berbasis Artificial Intelligence. Berpengalaman dalam .NET dan Next.js, kini mendalami AI Agents, LLM, OpenSearch, Redis, CQRS, dan Event-Driven Architecture. Aktif mengeksplorasi Agentic AI, Semantic Search, serta Cloud & Modern Architecture untuk kebutuhan enterprise.
            </p>
            <p style={{ fontStyle: 'italic', color: 'var(--web-primary)', textAlign: 'center', marginTop: '30px', fontSize: '1.1rem' }}>
              "Membangun software yang tidak hanya berjalan, tetapi juga mampu berpikir dan memberikan nilai bagi penggunanya."
            </p>
          </div>
          <div className="hero-contact">
            <a href="https://wa.me/6289636238885" target="_blank" rel="noopener noreferrer" className="contact-item"><FaPhone /> +62 8963 6238 885</a>
            <a href="mailto:karnaandi00@gmail.com" className="contact-item"><FaEnvelope /> karnaandi00@gmail.com</a>
            <a href="https://maps.google.com/?q=Tangerang,Indonesia" target="_blank" rel="noopener noreferrer" className="contact-item"><FaMapMarkerAlt /> Tangerang, Indonesia</a>
          </div>
        </div>
      </header>

      <div className="portfolio-grid">
        {/* LEFT COLUMN */}
        <div className="portfolio-sidebar">
          {/* SOFT SKILLS SECTION */}
          <section className="portfolio-section fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title"><FaBrain /> Keahlian Profesional</h3>
            <div className="skills-grid">
              <div className="skill-card">Problem Solving & Critical Thinking</div>
              <div className="skill-card">Agile & Scrum Collaboration</div>
              <div className="skill-card">Communication & Teamwork</div>
              <div className="skill-card">Adaptability & Continuous Learning</div>
            </div>
          </section>

          {/* TECH SKILLS SECTION */}
          <section className="portfolio-section fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title"><FaCode /> Tech Stack Utama</h3>
            <div className="tech-tags">
              {[
                { name: "C#", icon: <SiDotnet /> },
                { name: ".NET (6 & 9)", icon: <SiDotnet /> },
                { name: "ASP.NET Core", icon: <SiDotnet /> },
                { name: "Golang", icon: <SiGo /> },
                { name: "PHP", icon: <FaPhp /> },
                { name: "React.js", icon: <FaReact /> },
                { name: "Next.js", icon: <SiNextdotjs /> },
                { name: "Kotlin", icon: <SiKotlin /> },
                { name: "MySQL", icon: <SiMysql /> },
                { name: "PostgreSQL", icon: <SiPostgresql /> },
                { name: "DBeaver CE", icon: <FaDatabase /> },
                { name: "Visual Studio Code", icon: <FaCode /> },
                { name: "Visual Studio Community", icon: <FaWindows /> },
                { name: "XAMPP", icon: <SiXampp /> },
                { name: "Extreme Learning Machine (ELM)", icon: <FaBrain /> }
              ].map(skill => (
                <span key={skill.name} className="tech-tag">
                  {skill.icon} {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* AI & MODERN TOOLS SECTION */}
          <section className="portfolio-section fade-in-up" style={{ animationDelay: '0.35s' }}>
            <h3 className="section-title"><FaBrain /> AI-Assisted Engineering</h3>
            <p style={{ color: "var(--web-text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "15px" }}>
              Terus beradaptasi di era modern dengan memanfaatkan teknologi <i>Artificial Intelligence</i> mutakhir untuk mempercepat siklus enginering (SDLC), iterasi koding seketika, dan arsitektur sistem yang tangguh.
            </p>
            <div className="skills-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="skill-card ai-tool-card">
                <strong>Cursor & Github Copilot</strong>
                <span>AI Code Generator cerdas untuk produktivitas tiada batas</span>
              </div>
              <div className="skill-card ai-tool-card">
                <strong>Antigravity</strong>
                <span>Agentic AI untuk otomasi kompleksitas pengembangan aplikasi</span>
              </div>
              <div className="skill-card ai-tool-card">
                <strong>Extreme Learning Machine (ELM)</strong>
                <span>Algoritma machine learning riil terintegrasi pada aplikasi cerdas</span>
              </div>
            </div>
          </section>

          {/* EDUCATION SECTION */}
          <section className="portfolio-section fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="section-title"><FaGraduationCap /> Pendidikan</h3>
            <div className="timeline-item">
              <h4>Bachelor of Informatics Engineering</h4>
              <h5>Universitas Muhammadiyah Tangerang <span className="timeline-date">2021 - 2025</span></h5>
              <p>
                Selama menempuh pendidikan di bidang Informatika, mempelajari berbagai aspek ilmu
                komputer mulai dari algoritma, struktur data, basis data, jaringan komputer, hingga
                rekayasa perangkat lunak. Berpengalaman dalam mengembangkan aplikasi berbasis Web,
                Mobile, dan Desktop. Mengasah keterampilan problem solving, analisis sistem, serta kolaborasi tim.
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="portfolio-main">
          {/* EXPERIENCE SECTION */}
          <section className="portfolio-section fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h3 className="section-title"><FaBriefcase /> Perjalanan Karir</h3>

            <div className="timeline-item">
              <h4>Software Engineering</h4>
              <h5>PT Adi Data Informatika <span className="timeline-date">August 2024 - Sekarang</span></h5>
              <button className="toggle-detail-btn" onClick={() => toggleExp('adi')}>
                {expandedExp === 'adi' ? 'Sembunyikan Deskripsi  ▴' : 'Lihat Deskripsi Pekerjaan  ▾'}
              </button>
              {expandedExp === 'adi' && (
                <ul className="tasks-list">
                  <li>Mengembangkan aplikasi menggunakan C# dengan ASP.NET Core 6 serta menerapkan Entity Framework (EF) dengan basis data MySQL dan PostgreSQL, kemudian melakukan deployment ke server IIS.</li>
                  <li>Melaksanakan Go-Live aplikasi rekrutmen berbasis web dan berperan sebagai Application Support untuk memastikan stabilitas serta keberlanjutan sistem.</li>
                  <li>Menyusun dan menyampaikan Daily Report sesuai praktik Agile & Scrum methodology.</li>
                  <li>Membuat serta mengelola sizing backlog untuk pengembangan backend di setiap sprint.</li>
                </ul>
              )}
            </div>

            <div className="timeline-item">
              <h4>Mobile Application Developer</h4>
              <h5>Bangkit Academy (Google, Tokopedia, Gojek, Traveloka) <span className="timeline-date">Feb - Juli 2024</span></h5>
              <button className="toggle-detail-btn" onClick={() => toggleExp('bangkit')}>
                {expandedExp === 'bangkit' ? 'Sembunyikan Deskripsi  ▴' : 'Lihat Deskripsi Pekerjaan  ▾'}
              </button>
              {expandedExp === 'bangkit' && (
                <ul className="tasks-list">
                  <li>Mempelajari Mobile Application Development menggunakan Kotlin, termasuk pengelolaan database dengan Firebase serta integrasi dengan Artificial Intelligence (AI).</li>
                  <li>Mengerjakan daily tasks dan mengikuti sesi diskusi mingguan bersama para expert industri.</li>
                  <li>Berpartisipasi dalam Proyek Akhir (Capstone Project) pada jalur Entrepreneurship.</li>
                  <li>Berkolaborasi bersama tim dalam mengembangkan aplikasi e-commerce planting dengan integrasi fitur berbasis AI.</li>
                </ul>
              )}
            </div>
          </section>

          {/* RECENT PROJECTS SECTION (MOVED DOWN UNDER EXPERIENCE) */}
          <div className="projects-container fade-in-up" style={{ animationDelay: '0.6s' }}>
            <section className="portfolio-section" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '0', marginTop: '20px' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <h3 className="section-title" style={{ marginBottom: '10px' }}><FaExternalLinkAlt /> Karya Unggulan (Featured)</h3>
                  <p style={{ color: "var(--web-text-muted)", fontSize: "1.1rem", margin: 0 }}>
                    Beberapa karya sistem berstandar <i>Enterprise</i> hasil pengembangan yang telah diimplementasikan dalam skala produksi.
                  </p>
                </div>
                {FEATURED_PROJECTS.length > 4 && (
                  <button
                    onClick={() => setShowAllFeaturedModal(true)}
                    className="repo-link"
                    style={{
                      padding: '10px 24px',
                      fontSize: '0.95rem',
                      borderRadius: '30px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--web-primary), var(--web-secondary))',
                      color: '#000',
                      boxShadow: '0 4px 15px rgba(32, 201, 151, 0.3)',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    Lihat Semua ({FEATURED_PROJECTS.length})
                  </button>
                )}
              </div>

              <div className="featured-projects">
                {currentFeaturedList.map((fp, i) => (
                  <div key={i} className="featured-card" onClick={() => navigate(`/portofolio/featured/${fp.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="fp-image-wrapper">
                      <img src={fp.image} alt={fp.title} className="fp-image" />
                      <div className="fp-glow"></div>
                    </div>
                    <div className="fp-content">
                      <div className="fp-badges">
                        <span className="fp-status">✨ {fp.status}</span>
                        <span className="fp-company">{fp.company}</span>
                      </div>
                      <h4>{fp.title}</h4>
                      <p className="fp-description-truncated">
                        {fp.description.length > 120 ? fp.description.substring(0, 120) + "..." : fp.description}
                      </p>
                      <div className="project-meta" style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--web-border)' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/portofolio/featured/${fp.id}`);
                          }}
                          className="repo-link detail-link-btn"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>



              <h3 className="section-title" style={{ marginTop: '60px' }}><FaExternalLinkAlt /> Koleksi Proyek Lainnya</h3>

              {loading ? (
                <div className="loading-state">Memuat portofolio proyek API...</div>
              ) : projects.length === 0 ? (
                <div className="empty-state">Belum ada proyek yang diluncurkan.</div>
              ) : (
                <div className="project-list-wrapper">
                  <div className="project-list">
                    {currentProjects.map((proj, index) => (
                      <div key={proj.id} className="project-list-item fade-in-up" style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}>
                        <div className="project-list-info">
                          <h3>{proj.title}</h3>
                          <p className="project-desc">
                            {proj.description?.length > 150
                              ? proj.description.substring(0, 150) + "..."
                              : proj.description}
                          </p>

                          {proj.tools && proj.tools.length > 0 && (
                            <div className="project-tools" style={{ marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {proj.tools.map((tool, i) => (
                                <span key={i} className="tool-badge">{tool}</span>
                              ))}
                            </div>
                          )}

                          <div className="project-meta">
                            <span className="project-status">{proj.projectStatus}</span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              {proj.projectUrl && (
                                <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                                  <FaExternalLinkAlt /> Kunjungi
                                </a>
                              )}
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                                  <FaGithub /> Repository
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination fade-in-up" style={{ animationDelay: '1s' }}>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn nav-btn"
                      >
                        <FaChevronLeft /> Prev
                      </button>

                      <div className="page-numbers">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`page-btn num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn nav-btn"
                      >
                        Next <FaChevronRight />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* POPUP LIHAT SEMUA KARYA UNGGULAN */}
      {showAllFeaturedModal && (
        <div className="featured-all-modal-overlay" onClick={() => setShowAllFeaturedModal(false)}>
          <div className="featured-all-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="featured-all-modal-header">
              <h3>Semua Karya Unggulan</h3>
              <button className="featured-all-close-btn" onClick={() => setShowAllFeaturedModal(false)} title="Tutup">
                &times;
              </button>
            </div>
            <div className="featured-all-body">
              <div className="featured-all-grid">
                {FEATURED_PROJECTS.map((fp, i) => (
                  <div 
                    key={i} 
                    className="featured-card compact-featured-card" 
                    onClick={() => {
                      setShowAllFeaturedModal(false);
                      navigate(`/portofolio/featured/${fp.id}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fp-image-wrapper" style={{ height: '140px' }}>
                      <img src={fp.image} alt={fp.title} className="fp-image" />
                      <div className="fp-glow"></div>
                    </div>
                    <div className="fp-content" style={{ padding: '15px' }}>
                      <div className="fp-badges" style={{ gap: '8px', marginBottom: '10px' }}>
                        <span className="fp-status" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>✨ {fp.status}</span>
                        <span className="fp-company" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>{fp.company}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{fp.title}</h4>
                      <p className="fp-description-truncated" style={{ fontSize: '0.85rem', marginBottom: '12px', minHeight: '2.6rem' }}>
                        {fp.description.length > 80 ? fp.description.substring(0, 80) + "..." : fp.description}
                      </p>
                      <div className="project-meta" style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--web-border)' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAllFeaturedModal(false);
                            navigate(`/portofolio/featured/${fp.id}`);
                          }}
                          className="repo-link detail-link-btn"
                          style={{ width: '100%', justifyContent: 'center', padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
