import { useState, useEffect } from "react";
import "../../css/project.css";
import TopActions from "../components/top-actions.jsx";
import { FaGithub, FaExternalLinkAlt, FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getProjects, deleteProject } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Project() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleId, setRoleId] = useState(null);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    checkRole();
    fetchProjects();
  }, []);

  const checkRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRoleId(decoded.role || decoded.Role || decoded.RoleId || null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      const list = Array.isArray(data) ? data : (data.data || []);
      setProjects(list);
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };

  const handleAdd = () => {
    navigate("/project/add");
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    navigate(`/project/edit/${project.id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteProject(id, token);
        fetchProjects();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <header className="project-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Proyek</h1>
            <p>
              Kumpulan proyek yang menunjukkan kemampuan pemecahan masalah dan pengembangan aplikasi.
            </p>
          </div>
          {roleId == 1 && (
            <button className="btn-primary" onClick={handleAdd}>
              <FaPlus /> Tambah Proyek
            </button>
          )}
        </header>

        {loading ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>Memuat proyek...</p>
        ) : (
          <>
            {projects.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>Tidak ada proyek ditemukan.</p>
            ) : (
              <div className="project-grid">
                {currentData.map((project, index) => (
                  <article
                    key={project.id || index}
                    onClick={() => navigate(`/project/${project.id}`)}
                    style={{ cursor: "pointer", position: "relative" }}
                    className={`project-card ${project.featured ? "featured" : ""}`}
                  >
                    {/* IMAGE */}
                    <div className="project-image">
                      <img src={project.image || "https://placehold.co/600x400/1f1f1f/FFF?text=No+Image"} alt={project.title} />
                      <span className={`status ${project.status === "On Going" ? "ongoing" : "completed"}`}>
                        {project.status === "On Going" ? "Sedang Berjalan" : "Selesai"}
                      </span>
                      {project.featured && <FaStar className="featured-icon" />}
                    </div>

                    {/* CONTENT */}
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description && project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description}</p>

                      <div className="actions">
                        {project.github && (
                          <a href={project.github} target="_blank" onClick={(e) => e.stopPropagation()}>
                            <FaGithub /> Code
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" onClick={(e) => e.stopPropagation()}>
                            <FaExternalLinkAlt /> Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* MANAGE ACTIONS */}
                    {roleId == 1 && (
                      <div className="action-btn-group" style={{ padding: "10px", borderTop: "1px solid #333", display: "flex", gap: "10px" }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn-edit labeled" style={{ flex: 1 }} onClick={(e) => handleEdit(project, e)}>
                          Edit
                        </button>
                        <button className="btn-delete labeled" style={{ flex: 1 }} onClick={(e) => handleDelete(project.id, e)}>
                          Hapus
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={handlePrev} disabled={currentPage === 1}>Sebelumnya</button>
                <span className="page-info">Halaman {currentPage} dari {totalPages}</span>
                <button className="page-btn" onClick={handleNext} disabled={currentPage === totalPages}>Selanjutnya</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
