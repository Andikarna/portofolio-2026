import { useState, useEffect } from "react";
import { FaBriefcase, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import "../../css/experience.css";
import { getExperiences, deleteExperience } from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Experience() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleId, setRoleId] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    checkRole();
  }, []);

  useEffect(() => {
    fetchExperiences(currentPage);
  }, [currentPage]);

  const checkRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRoleId(decoded.role || decoded.Role || decoded.RoleId || null);
      } catch (error) {
        console.error("Token error", error);
      }
    }
  };

  const fetchExperiences = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getExperiences(page, ITEMS_PER_PAGE, token);

      // Standardize response handling
      let list = [];
      let total = 0;

      if (response && Array.isArray(response.data.data)) {
        list = response.data.data;
        total = response.data.totalItems || response.data.totalCount || 0;
        // Sometimes totalPages is directly header or property
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else {
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
        }
      }

      else if (Array.isArray(response)) {
        list = response;
        // If just an array, we can't really paginate server-side effectively without total count from server.
        // We'll estimate: if we got full page, maybe there's more.
        setTotalPages(list.length < ITEMS_PER_PAGE ? page : page + 1);
      }

      setExperiences(list);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };

  const handleAdd = () => {
    navigate("/experience/add");
  };

  const handleEdit = (exp) => {
    navigate(`/experience/edit/${exp.id}`);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const token = localStorage.getItem("token");
      await deleteExperience(selectedId, token);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      fetchExperiences(currentPage);
    } catch (error) {
      alert("Gagal menghapus");
      console.error(error);
      setShowDeleteModal(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Optional: if needed to refresh or redirect
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Sekarang";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  return (
    <>
      <section className="loby">
        <TopActions />

        <div className="page-container">
          <div className="loby-right full">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1>Pengalaman Profesional</h1>
                <p className="intro">
                  Ringkasan perjalanan profesional saya.
                </p>
              </div>
              {roleId == 1 && (
                <button className="btn-primary" onClick={handleAdd}>
                  <FaPlus /> Tambah Pengalaman
                </button>
              )}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>Memuat data...</p>
            ) : (
              <>
                {experiences.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>Tidak ada data pengalaman.</p>
                ) : (
                  <div className="experience-list">
                    {experiences.map((exp, index) => (
                      <div className="experience-card" key={exp.id || index}>
                        <div className="experience-header">
                          <div className="role">
                            <FaBriefcase /> {exp.title || exp.role} {/* Fallback to role if title missing */}
                          </div>
                          {exp.status === "active" && (
                            <div className="experience-status active">Sedang Bekerja</div>
                          )}
                          {exp.status === "completed" && (
                            <div className="experience-status completed">Selesai</div>
                          )}
                        </div>

                        <span className="company">{exp.company}</span>
                        <span className="company" style={{ fontSize: "0.85rem", marginTop: "4px", color: "#aaa" }}>
                          {exp.startDate ? formatDate(exp.startDate) : ""} - {exp.endDate ? formatDate(exp.endDate) : "Sekarang"}
                        </span>

                        <p className="description">{exp.description}</p>

                        <div className="stack">
                          {/* If skills is a string, split it. If array (old data), map it */}
                          {exp.skills && typeof exp.skills === 'string'
                            ? exp.skills.split(',').map((tech, i) => (
                              <span key={i} className="badge">{tech.trim()}</span>
                            ))
                            : Array.isArray(exp.stack)
                              ? exp.stack.map((tech, i) => <span key={i} className="badge">{tech}</span>)
                              : null
                          }
                        </div>

                        <div className="card-actions" style={{
                          marginTop: "1.5rem",
                          paddingTop: "1rem",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <button
                            className="btn-detail"
                            onClick={() => navigate(`/experience/${exp.id}`)}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#e4e4e7",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                          >
                            Lihat Detail
                          </button>

                          {roleId == 1 && (
                            <div className="action-btn-group">
                              <button className="btn-edit labeled" onClick={() => handleEdit(exp)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="btn-delete labeled" onClick={() => handleDelete(exp.id)}>
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pagination">
                  <button className="page-btn" onClick={handlePrev} disabled={currentPage === 1}>Sebelumnya</button>
                  <span className="page-info">Halaman {currentPage} {totalPages > 1 && `dari ${totalPages}`}</span>
                  <button className="page-btn" onClick={handleNext} disabled={currentPage >= totalPages && totalPages > 0}>Selanjutnya</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

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
        <p>Apakah Anda yakin ingin menghapus pengalaman ini? Tindakan ini tidak dapat dibatalkan.</p>
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
        <p>Data pengalaman berhasil dihapus.</p>
      </Modal>
    </>
  );
}
