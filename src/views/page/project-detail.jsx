import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaTools, FaCheckCircle, FaReact, FaNodeJs, FaPython, FaJava, FaAndroid, FaStripe, FaAws, FaDocker, FaCalendarAlt, FaExpand, FaTimes } from "react-icons/fa";
import { SiPostgresql, SiTailwindcss, SiFirebase, SiRedux, SiTensorflow, SiKotlin } from "react-icons/si";
import TopActions from "../components/top-actions.jsx";
import { getProjectById } from "../../api/api";
import "../../css/project.css";

const getTechIcon = (tech) => {
  if (!tech) return <FaTools />;
  const t = tech.toLowerCase();
  if (t.includes("react")) return <FaReact />;
  if (t.includes("node")) return <FaNodeJs />;
  if (t.includes("postgres")) return <SiPostgresql />;
  if (t.includes("tailwind")) return <SiTailwindcss />;
  if (t.includes("firebase")) return <SiFirebase />;
  if (t.includes("redux")) return <SiRedux />;
  if (t.includes("stripe")) return <FaStripe />;
  if (t.includes("kotlin")) return <SiKotlin />;
  if (t.includes("tensor")) return <SiTensorflow />;
  if (t.includes("python")) return <FaPython />;
  if (t.includes("android") || t.includes("camera")) return <FaAndroid />;
  return <FaTools />;
};

const getImageSrc = (image) => {
  if (!image) return "https://placehold.co/800x400/1f1f1f/FFF?text=No+Image";
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return `data:image/png;base64,${image}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getProjectById(id, token);
        setProject(data.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <section className="loby">
        <TopActions />
        <div className="loby-container" style={{ textAlign: "center", paddingTop: "5rem", color: "#aaa" }}>
          <p>Memuat detail proyek...</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="loby">
        <TopActions />
        <div className="loby-container" style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h2 style={{ color: "#fff" }}>Proyek tidak ditemukan</h2>
          <button className="back-btn" onClick={() => navigate("/project")}>
            Kembali ke Daftar
          </button>
        </div>
      </section>
    );
  }

  // Parse Tech Stack handles "technologies" (csv) or "techStack" (array)
  const rawTech = project.technologies || project.techStack;
  const techStack = Array.isArray(rawTech)
    ? rawTech
    : (rawTech ? rawTech.split(',').map(t => t.trim()) : []);

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        <button
          className="back-link"
          onClick={() => navigate("/project")}
          style={{ marginBottom: "1.5rem" }}
        >
          <FaArrowLeft /> Kembali
        </button>

        <article className="project-detail-container">
          {/* HERO IMAGE */}
          <div className="detail-image-wrapper" onClick={() => setShowImageModal(true)}>
            <img src={getImageSrc(project.imageBase64 || project.coverImageUrl || project.image)} alt={project.title} className="detail-hero-image" />
            <div className="detail-overlay"></div>
            <div className="expand-overlay">
              <FaExpand style={{ color: "#fff", fontSize: "1.5rem" }} />
            </div>
          </div>

          <div className="detail-header-content">
            <div className="badge-row">
              <span className={`status-badge ${project.status === "On Going" || project.status === "ongoing" ? "ongoing" : "completed"}`}>
                {project.status === "On Going" || project.status === "ongoing" ? "Sedang Berjalan" : "Selesai"}
              </span>
              <span className="period-badge">
                <FaCalendarAlt style={{ marginRight: "6px" }} />
                {formatDate(project.startDate)}
              </span>
            </div>

            <h1 className="detail-title" style={{ fontSize: "1.8rem" }}>{project.title}</h1>
          </div>

          <div className="detail-body">
            {/* LEFT COLUMN: Description & Features */}
            <div className="detail-main">
              <section className="detail-section">
                <h3>Tentang Proyek</h3>
                <p className="detail-desc" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>
                  {project.description}
                </p>
              </section>
            </div>

            {/* RIGHT COLUMN: Tech Stack & Actions */}
            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h3>Teknologi</h3>
                <div className="tech-tags">
                  {techStack.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      <span className="tech-icon">{getTechIcon(tech)}</span> {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sidebar-card actions-card">
                <h3>Links</h3>
                <div className="detail-actions">
                  {(project.repositoryUrl || project.githubUrl) && (
                    <a href={project.repositoryUrl || project.githubUrl} target="_blank" rel="noreferrer" className="action-btn-lg github">
                      <FaGithub /> Repository
                    </a>
                  )}
                  {(project.demoUrl || project.demo) && (
                    <a href={project.demoUrl || project.demo} target="_blank" rel="noreferrer" className="action-btn-lg demo">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </article>
      </div>

      {/* Full Image Modal */}
      {
        showImageModal && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              background: "rgba(0,0,0,0.9)", zIndex: 1000,
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: "2rem"
            }}
            onClick={() => setShowImageModal(false)}
          >
            <button
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "transparent", border: "none", color: "#fff",
                fontSize: "2rem", cursor: "pointer"
              }}
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>

            <img
              src={getImageSrc(project.imageBase64 || project.coverImageUrl || project.image)}
              alt={project.title}
              style={{
                maxWidth: "100%", maxHeight: "100%",
                objectFit: "contain", borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )
      }
    </section >
  );
}
