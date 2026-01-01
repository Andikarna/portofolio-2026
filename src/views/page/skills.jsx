import { useState, useEffect } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle, FaEllipsisV } from "react-icons/fa";
import Modal from "../components/modal.jsx";
import {
  SiReact, SiJavascript, SiTailwindcss, SiAndroid, SiDotnet, SiFirebase, SiGit,
  SiHtml5, SiCss3, SiTypescript, SiNodedotjs, SiMongodb, SiMysql, SiPostgresql,
  SiDocker, SiFigma
} from "react-icons/si";
import TopActions from "../components/top-actions.jsx";
import "../../css/skill.css";
import { getSkills, deleteSkill } from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Icon Mapping Helper
const ICON_MAP = {
  "React": <SiReact />,
  "JavaScript": <SiJavascript />,
  "Tailwind": <SiTailwindcss />,
  "Android": <SiAndroid />,
  ".NET": <SiDotnet />,
  "Firebase": <SiFirebase />,
  "Git": <SiGit />,
  "HTML": <SiHtml5 />,
  "CSS": <SiCss3 />,
  "TypeScript": <SiTypescript />,
  "Node.js": <SiNodedotjs />,
  "MongoDB": <SiMongodb />,
  "MySQL": <SiMysql />,
  "PostgreSQL": <SiPostgresql />,
  "Docker": <SiDocker />,
  "Figma": <SiFigma />
};

export default function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenuId !== null && !event.target.closest('.menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId]);

  useEffect(() => {
    checkRole();
    fetchSkills();
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

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await getSkills();

      // 1. Resolve the array from the response structure
      // 1. Resolve the array from the response structure
      let rawList = [];
      if (Array.isArray(response)) {
        rawList = response;
      } else if (response && response.data && Array.isArray(response.data.items)) {
        // Check for nested .data.items
        rawList = response.data.items;
      } else if (response && Array.isArray(response.data)) {
        rawList = response.data;
      } else if (response && Array.isArray(response.items)) {
        rawList = response.items;
      } else if (response && Array.isArray(response.result)) {
        rawList = response.result;
      }

      // 2. Map items to ensure consistent property names
      const standardizedList = rawList.map(item => ({
        id: item.id,
        name: item.name || item.title || "No Name",
        category: item.category || "Other",
        level: item.level || "Intermediate",
        isFeatured: item.isFeatured || item.isFavorite || item.favorite || false,
        iconUrl: item.iconUrl || item.image || item.iconName || ""
      }));

      setSkills(standardizedList);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAdd = () => {
    navigate("/skills/add");
  };

  const handleEdit = (skill) => {
    navigate(`/skills/edit/${skill.id}`);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const token = localStorage.getItem("token");
      await deleteSkill(selectedId, token);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      fetchSkills();
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

  const favoriteSkills = skills.filter((s) => s.isFeatured);
  const otherSkills = skills.filter((s) => !s.isFeatured);

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <div className="loby-right full">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Keahlian & Teknologi</h1>
              <p className="intro">
                Kumpulan teknologi dan alat yang saya kuasai.
              </p>
            </div>
            {roleId == 1 && (
              <button className="btn-primary" onClick={handleAdd}>
                <FaPlus /> Tambah Keahlian
              </button>
            )}
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#aaa", marginTop: "2rem" }}>Memuat keahlian...</p>
          ) : (
            <div className="skills-columns">
              {/* LEFT - FAVORITE */}
              <div className="skills-column">
                <h3 className="column-title">
                  <FaStar className="star" /> Keahlian Utama
                </h3>
                <div className="skills-grid">
                  {favoriteSkills.map((skill, index) => (
                    <div className="skill-card highlight" key={skill.id || index} style={{ position: "relative" }}>
                      {roleId == 1 && (
                        <div className="menu-container" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === skill.id ? null : skill.id);
                            }}
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "none",
                              color: "#fff",
                              padding: "6px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaEllipsisV />
                          </button>

                          {activeMenuId === skill.id && (
                            <div style={{
                              position: "absolute",
                              right: 0,
                              top: "120%",
                              background: "#252525",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                              minWidth: "120px",
                              overflow: "hidden",
                              zIndex: 20
                            }}>
                              <button
                                onClick={() => handleEdit(skill)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: "none",
                                  background: "transparent",
                                  color: "#eee",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontSize: "0.9rem"
                                }}
                                onMouseOver={(e) => e.target.style.background = "#333"}
                                onMouseOut={(e) => e.target.style.background = "transparent"}
                              >
                                <FaEdit style={{ color: "#6366f1" }} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: "none",
                                  background: "transparent",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontSize: "0.9rem"
                                }}
                                onMouseOver={(e) => e.target.style.background = "#333"}
                                onMouseOut={(e) => e.target.style.background = "transparent"}
                              >
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="skill-header">
                        <div className="skill-title">
                          <span className="skill-icon">
                            {skill.iconUrl && (skill.iconUrl.startsWith("http") || skill.iconUrl.startsWith("data:")) ? (
                              <img src={skill.iconUrl} alt={skill.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                            ) : (
                              ICON_MAP[skill.name] || ICON_MAP[skill.iconUrl] || <SiReact />
                            )}
                          </span>
                          <h3>{skill.name}</h3>
                        </div>
                      </div>
                      <span className="category">{skill.category}</span>
                      <span className={`level ${skill.level.toLowerCase()}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                  {favoriteSkills.length === 0 && <p style={{ color: "#666", fontStyle: "italic" }}>Belum ada keahlian utama.</p>}
                </div>
              </div>

              {/* RIGHT - OTHERS */}
              <div className="skills-column">
                <h3 className="column-title muted">Keahlian Lainnya</h3>
                <div className="skills-grid">
                  {otherSkills.map((skill, index) => (
                    <div className="skill-card" key={skill.id || index} style={{ position: "relative" }}>
                      {roleId == 1 && (
                        <div className="menu-container" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === skill.id ? null : skill.id);
                            }}
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "none",
                              color: "#fff",
                              padding: "6px",
                              borderRadius: "50%",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <FaEllipsisV />
                          </button>

                          {activeMenuId === skill.id && (
                            <div style={{
                              position: "absolute",
                              right: 0,
                              top: "120%",
                              background: "#252525",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                              minWidth: "120px",
                              overflow: "hidden",
                              zIndex: 20
                            }}>
                              <button
                                onClick={() => handleEdit(skill)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: "none",
                                  background: "transparent",
                                  color: "#eee",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontSize: "0.9rem"
                                }}
                                onMouseOver={(e) => e.target.style.background = "#333"}
                                onMouseOut={(e) => e.target.style.background = "transparent"}
                              >
                                <FaEdit style={{ color: "#6366f1" }} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(skill.id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  width: "100%",
                                  padding: "10px 12px",
                                  border: "none",
                                  background: "transparent",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  fontSize: "0.9rem"
                                }}
                                onMouseOver={(e) => e.target.style.background = "#333"}
                                onMouseOut={(e) => e.target.style.background = "transparent"}
                              >
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="skill-header">
                        <div className="skill-title">
                          <span className="skill-icon">
                            {skill.iconUrl && (skill.iconUrl.startsWith("http") || skill.iconUrl.startsWith("data:")) ? (
                              <img src={skill.iconUrl} alt={skill.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                            ) : (
                              ICON_MAP[skill.name] || ICON_MAP[skill.iconUrl] || <SiReact />
                            )}
                          </span>
                          <h3>{skill.name}</h3>
                        </div>
                      </div>
                      <span className="category">{skill.category}</span>
                      <span className={`level ${skill.level.toLowerCase()}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                  {otherSkills.length === 0 && <p style={{ color: "#666", fontStyle: "italic" }}>Belum ada data.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
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
        <p>Apakah Anda yakin ingin menghapus keahlian ini? Tindakan ini tidak dapat dibatalkan.</p>
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
          <p>Keahlian berhasil dihapus.</p>
        </div>
      </Modal>
    </section>
  );
}
