import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSkill, updateSkill, getSkillById } from "../../api/api";
import { FaArrowLeft, FaSave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import "../../css/experience.css"; // Use shared styles

const POPULAR_SKILLS = [
  { name: "React", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" },
  { name: "Vue.js", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" },
  { name: "Angular", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" },
  { name: "Node.js", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { name: ".NET", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Microsoft_.NET_logo.svg" },
  { name: "Python", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "MySQL", category: "Database", image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/MySQL_textlogo.svg" },
  { name: "PostgreSQL", category: "Database", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
  { name: "MongoDB", category: "Database", image: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
  { name: "Docker", category: "Tools", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
  { name: "Git", category: "Tools", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" },
  { name: "Figma", category: "Tools", image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { name: "C#", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Logo_C_sharp.svg" },
  { name: "Java", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg" },
  { name: "Tailwind CSS", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "Bootstrap", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" },
  { name: "Redis", category: "Database", image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" },
  { name: "Next.js", category: "Frontend", image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
  { name: "Laravel", category: "Backend", image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" }
];

export default function SkillsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: "Intermediate",
    isFeatured: false,
    iconUrl: ""
  });

  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", // success | error
    onConfirm: null
  });

  useEffect(() => {
    if (isEditing) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getSkillById(id, token);
      if (data) {
        setFormData({
          name: data.data.name || data.data.title || "",
          category: data.data.category || "Frontend",
          level: data.data.level || "Intermediate",
          isFeatured: data.data.isFeatured || data.data.isFavorite || false,
          iconUrl: data.data.iconUrl || data.data.image || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch skill", error);
      showModal("Gagal", "Gagal memuat data keahlian.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    // Autocomplete Logic
    if (name === "name") {
      if (value.length > 0) {
        const filtered = POPULAR_SKILLS.filter(skill =>
          skill.name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectSuggestion = (skill) => {
    setFormData(prev => ({
      ...prev,
      name: skill.name,
      category: skill.category,
      iconUrl: skill.image
    }));
    setShowSuggestions(false);
  };

  const showModal = (title, message, type = "success", onConfirm = null) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.type === "success") {
      navigate("/skills");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (isEditing) {
        await updateSkill(id, formData, token);
        showModal("Berhasil!", "Keahlian berhasil diperbarui.", "success");
      } else {
        await createSkill(formData, token);
        showModal("Berhasil!", "Keahlian berhasil dibuat.", "success");
      }
    } catch (error) {
      console.error("Save error", error);
      showModal("Gagal", "Terjadi kesalahan saat menyimpan keahlian.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        <div style={{ width: "100%" }}>
          {/* Header & Back Button */}
          <button
            className="back-link"
            onClick={() => navigate("/skills")}
          >
            <FaArrowLeft /> Kembali
          </button>

          <header style={{
            padding: "1rem",
            marginBottom: "1rem",
          }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem" }}>
              {isEditing ? "Edit Keahlian" : "Tambah Keahlian"}
            </h1>
            <p style={{ color: "#9ca3af" }}>
              {isEditing ? "Perbarui detail keahlian teknis Anda." : "Tambahkan skill baru untuk memperkaya portofolio Anda."}
            </p>
          </header>

          <div style={{ background: "#1f1f1f", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
            {loading && isEditing && <p style={{ color: "#aaa", marginBottom: "1rem" }}>Memuat data...</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ position: "relative" }}>
                <label className="form-label">Nama Keahlian</label>
                <input
                  type="text" name="name"
                  className="form-input"
                  placeholder="Contoh: React.js"
                  value={formData.name} onChange={handleChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  autoComplete="off"
                  required
                />

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#252525",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    listStyle: "none",
                    margin: "4px 0 0",
                    padding: "0",
                    zIndex: 10,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}>
                    {suggestions.map((skill, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectSuggestion(skill)}
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #333",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "#eee",
                          fontSize: "0.95rem"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#333"}
                        onMouseOut={(e) => e.target.style.background = "transparent"}
                      >
                        <img src={skill.image} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    name="category" className="form-select"
                    value={formData.category} onChange={handleChange}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select
                    name="level" className="form-select"
                    value={formData.level} onChange={handleChange}
                  >
                    <option value="Beginner">Beginner (Pemula)</option>
                    <option value="Intermediate">Intermediate (Menengah)</option>
                    <option value="Advanced">Advanced (Mahir)</option>
                    <option value="Expert">Expert (Ahli)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL Icon (Gambar)</label>
                <input
                  type="text" name="iconUrl"
                  className="form-input"
                  placeholder="https://example.com/icon.png"
                  value={formData.iconUrl} onChange={handleChange}
                />
                {formData.iconUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <p className="form-label">Preview:</p>
                    <img src={formData.iconUrl} alt="Preview" style={{ width: "48px", height: "48px", objectFit: "contain", background: "#333", borderRadius: "8px", padding: "4px" }} />
                  </div>
                )}
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox" name="isFeatured" id="isFeatured"
                  checked={formData.isFeatured} onChange={handleChange}
                  style={{ width: "20px", height: "20px", accentColor: "#6366f1" }}
                />
                <label htmlFor="isFeatured" style={{ color: "#fff", cursor: "pointer" }}>Tandai sebagai Favorit (Featured)</label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ marginTop: "1rem", width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Menyimpan..." : (
                  <><FaSave /> Simpan Keahlian</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.type === "success" ? "Berhasil" : "Gagal"}
        actions={
          <button className="btn-primary" onClick={closeModal} style={{ width: "100%", justifyContent: "center" }}>
            OK
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
          {modalState.type === "success" ? (
            <FaCheckCircle style={{ fontSize: "3rem", color: "#10b981" }} />
          ) : (
            <FaExclamationCircle style={{ fontSize: "3rem", color: "#ef4444" }} />
          )}
          <p style={{ color: "#d1d5db", fontSize: "1.1rem" }}>{modalState.message}</p>
        </div>
      </Modal>

    </section>
  );
}
