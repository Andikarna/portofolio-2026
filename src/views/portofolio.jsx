import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/api.js";
import {
  FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaGraduationCap, FaBriefcase, FaCode, FaBrain, FaExternalLinkAlt, FaGithub,
  FaPhp, FaReact, FaDatabase, FaWindows, FaTerminal, FaCheckCircle
} from "react-icons/fa";
import {
  SiDotnet, SiGo, SiNextdotjs, SiKotlin,
  SiMysql, SiPostgresql, SiXampp
} from "react-icons/si";
import photo from "../assets/logo.png";
import "../css/portofolio.css";

export default function Portofolio() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedExp, setExpandedExp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3; // Menampilkan 3 item per halaman (sehingga 6 proyek = max 2 halaman)

  const toggleExp = (id) => {
    setExpandedExp(prev => prev === id ? null : id);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const completedProjects = [
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

  const featuredProjects = [
    {
      title: "Enterprise Human Resource Management",
      description: "Applikasi berskala enterprise untuk HRIS komprehensif yang memusatkan data manajemen dan operasional SDM dalam perusahaan.",
      features: ["Autentikasi 2FA & Token JWT terenkripsi", "Manajemen Data & Rekam Jejak Employee", "Proses Perpanjangan Kontrak Otomatis", "Sistem Klaim Reimbursement Karyawan"],
      status: "Go-Live",
      company: "PT Adidata Informatika",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Recruitment & Payroll System",
      description: "Platform terintegrasi untuk proses rekrutmen kandidat end-to-end, manajemen interview bertahap, serta komputasi penggajian kompleks.",
      features: ["Registrasi Dinamis & Progress Interview Bertahap", "Sistem Kalkulasi Payroll (Margin & Percent)", "Integrasi Mekari E-Sign untuk Kontrak", "Laporan Rekrutmen Terpadu"],
      status: "Active since Early 2024",
      company: "PT Adidata Informatika",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <h2 className="hero-role">Software Developer</h2>
          <p className="hero-desc">
            <b>Software Engineer</b> yang berfokus pada pengembangan lintas platform (Web, Mobile, & Cloud) berfundasi <i>Clean Architecture</i>. Teruji dalam <i>Full-Stack Development</i> (Frontend/Backend/REST API) sekaligus diandalkan dalam penerapan infrastruktur DevOps modern (CI/CD, Docker, Kubernetes).
            Seorang <i>problem-solver</i> adaptif pembangun kolaborasi tim yang solid.
          </p>
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

              <h3 className="section-title"><FaExternalLinkAlt /> Karya Unggulan (Featured)</h3>
              <p style={{ color: "var(--web-text-muted)", marginBottom: "30px", fontSize: "1.1rem" }}>
                Beberapa karya sistem berstandar <i>Enterprise</i> hasil pengembangan yang telah diimplementasikan dalam skala produksi.
              </p>

              <div className="featured-projects">
                {featuredProjects.map((fp, i) => (
                  <div key={i} className="featured-card">
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
                      <p>{fp.description}</p>
                      <div className="fp-features">
                        {fp.features.map((feat, idx) => (
                          <span key={idx} className="fp-feature"><FaCheckCircle /> {feat}</span>
                        ))}
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
                    <div className="pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                      >
                        Prev
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
