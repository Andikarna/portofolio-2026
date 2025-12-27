import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaTools, FaCheckCircle, FaReact, FaNodeJs, FaPython, FaJava, FaAndroid, FaStripe, FaAws, FaDocker } from "react-icons/fa";
import { SiPostgresql, SiTailwindcss, SiFirebase, SiRedux, SiTensorflow, SiKotlin } from "react-icons/si";
import TopActions from "../components/top-actions.jsx";
import { MOCK_PROJECTS } from "../../data/mock-projects";
import "../../css/project.css";

const getTechIcon = (tech) => {
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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = MOCK_PROJECTS.find((p) => p.id === parseInt(id));

  if (!project) {
    return (
      <section className="loby">
        <TopActions />
        <div className="page-container" style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h2>Proyek tidak ditemukan</h2>
          <button className="back-btn" onClick={() => navigate("/project")}>
            Kembali ke Daftar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <button className="back-link" onClick={() => navigate("/project")}>
          <FaArrowLeft /> Kembali ke Projects
        </button>

        <article className="project-detail-container">
          {/* HERO IMAGE */}
          <div className="detail-image-wrapper">
            <img src={project.image} alt={project.title} className="detail-hero-image" />
            <div className="detail-overlay"></div>
          </div>

          <div className="detail-header-content">
            <div className="badge-row">
              <span className={`status-badge ${project.status === "On Going" ? "ongoing" : "completed"}`}>
                {project.status}
              </span>
              <span className="period-badge">{project.period}</span>
            </div>

            <h1 className="detail-title">{project.title}</h1>
          </div>

          <div className="detail-body">
            {/* LEFT COLUMN: Description & Features */}
            <div className="detail-main">
              <section className="detail-section">
                <h3>Tentang Proyek</h3>
                <p className="detail-desc">{project.detailedDescription}</p>
              </section>

              <section className="detail-section">
                <h3>Fitur Utama</h3>
                <ul className="feature-list">
                  {project.features.map((feature, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="check-icon" /> {feature}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* RIGHT COLUMN: Tech Stack & Actions */}
            <aside className="detail-sidebar">
              <div className="sidebar-card">
                <h3>Teknologi</h3>
                <div className="tech-tags">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      <span className="tech-icon">{getTechIcon(tech)}</span> {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sidebar-card actions-card">
                <h3>Links</h3>
                <div className="detail-actions">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="action-btn-lg github">
                      <FaGithub /> Repository
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="action-btn-lg demo">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
}
