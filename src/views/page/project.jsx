import { useState, useEffect } from "react";
import "../../css/project.css";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import { FaGithub, FaExternalLinkAlt, FaStar, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { getProjects, deleteProject } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Project() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roleId, setRoleId] = useState(null);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);



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
      const response = await getProjects();

      // 1. Resolve the array from the response structure
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (response && response.data && Array.isArray(response.data.items)) {
        // Check for nested .data.items (common in paginated responses)
        list = response.data.items;
      } else if (response && Array.isArray(response.data)) {
        list = response.data;
      } else if (response && Array.isArray(response.items)) {
        list = response.items;
      } else if (response && Array.isArray(response.result)) {
        list = response.result;
      }

      setProjects(list);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = projects;

  // const handlePrev = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };
  // const handleNext = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };

  const handleAdd = () => {
    navigate("/project/add");
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    navigate(`/project/edit/${project.id}`);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const token = localStorage.getItem("token");
      await deleteProject(selectedId, token);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      fetchProjects();
    } catch (error) {
      alert("Gagal menghapus");
      setShowDeleteModal(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const getImageSrc = (image) => {
    if (!image) return "https://placehold.co/600x400/1f1f1f/FFF?text=No+Image";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    // Assume it's a raw base64 string, default to png (or jpeg, browser often handles detection if header is obscure, but explicit is better)
    return `data:image/png;base64,${image}`;
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
                      <img src={getImageSrc(project.coverImageUrl)} alt={project.title} />
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

          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus"
        actions={
          <>
            <button className="modal-btn cancel" onClick={closeDeleteModal}>
              Batal
            </button>
            <button className="modal-btn confirm" onClick={confirmDelete}>
              Hapus
            </button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title="Berhasil"
        actions={
          <button className="modal-btn confirm" onClick={closeSuccessModal} style={{ background: "#10b981" }}>
            OK
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
          <FaCheckCircle style={{ fontSize: "3rem", color: "#10b981" }} />
          <p>Proyek berhasil dihapus.</p>
        </div>
      </Modal>
    </section>
  );
}
