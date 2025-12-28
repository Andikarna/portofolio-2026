import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, updateProject, getProjectById } from "../../api/api";
import { FaArrowLeft, FaSave, FaCheckCircle, FaExclamationCircle, FaTimes, FaCloudUploadAlt, FaCalendarAlt } from "react-icons/fa";
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

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    description: "",
    image: "",
    githubUrl: "",
    demoUrl: "",
    status: "ongoing",
    isFeatured: false,
    startDate: "",
    endDate: ""
  });

  // Tech Stack State
  const [techInput, setTechInput] = useState("");
  const [selectedTech, setSelectedTech] = useState([]);
  const [techSuggestions, setTechSuggestions] = useState([]);
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

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
      const data = await getProjectById(id, token);
      if (data) {
        setFormData({
          title: data.title || "",
          excerpt: data.excerpt || "",
          description: data.description || "",
          image: data.image || "",
          githubUrl: data.githubUrl || "",
          demoUrl: data.demoUrl || "",
          status: data.status || "ongoing",
          isFeatured: data.isFeatured || false,
          startDate: data.startDate ? data.startDate.split('T')[0] : "",
          endDate: data.endDate ? data.endDate.split('T')[0] : ""
        });

        // Parse Tech Stack
        if (Array.isArray(data.techStack)) {
          setSelectedTech(data.techStack);
        } else if (data.techStack && typeof data.techStack === 'string') {
          setSelectedTech(data.techStack.split(",").map(t => t.trim()));
        }
      }
    } catch (error) {
      console.error("Failed to fetch project", error);
      showModal("Gagal", "Gagal memuat data proyek.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle General Input Changes
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handle Image Upload (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Tech Input Change
  const handleTechInputChange = (e) => {
    const value = e.target.value;
    setTechInput(value);

    if (value.length > 0) {
      const filtered = POPULAR_SKILLS.filter(skill =>
        skill.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedTech.includes(skill.name)
      );
      setTechSuggestions(filtered);
      setShowTechSuggestions(true);
    } else {
      setShowTechSuggestions(false);
    }
  };

  // Handle Select Tech
  const addTech = (techName) => {
    if (!selectedTech.includes(techName)) {
      setSelectedTech([...selectedTech, techName]);
    }
    setTechInput("");
    setShowTechSuggestions(false);
  };

  const removeTech = (techName) => {
    setSelectedTech(selectedTech.filter(t => t !== techName));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (techInput.trim()) {
        addTech(techInput.trim());
      }
    }
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
      navigate("/project");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      techStack: selectedTech,
      endDate: formData.status === "ongoing" ? null : formData.endDate // Clear end date if ongoing
    };

    try {
      if (isEditing) {
        await updateProject(id, payload, token);
        showModal("Berhasil!", "Proyek berhasil diperbarui.", "success");
      } else {
        await createProject(payload, token);
        showModal("Berhasil!", "Proyek berhasil dibuat.", "success");
      }
    } catch (error) {
      console.error("Save error", error);
      showModal("Gagal", "Terjadi kesalahan saat menyimpan proyek.", "error");
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
            onClick={() => navigate("/project")}
          >
            <FaArrowLeft /> Kembali
          </button>

          <header style={{
            padding: "1rem",
            marginBottom: "1rem",
          }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem" }}>
              {isEditing ? "Edit Proyek" : "Tambah Proyek"}
            </h1>
            <p style={{ color: "#9ca3af" }}>
              {isEditing ? "Perbarui detail proyek portofolio Anda." : "Tambahkan proyek baru untuk dipamerkan."}
            </p>
          </header>

          <div style={{ background: "#1f1f1f", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
            {loading && isEditing && <p style={{ color: "#aaa", marginBottom: "1rem" }}>Memuat data...</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Judul Proyek</label>
                <input
                  type="text" name="title"
                  className="form-input"
                  placeholder="Nama Proyek"
                  value={formData.title} onChange={handleChange} required
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div style={{ border: "2px dashed #444", padding: "1.5rem", borderRadius: "8px", textAlign: "center", cursor: "pointer", position: "relative" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "#aaa" }}>
                    <FaCloudUploadAlt size={24} />
                    <span>Klik atau drag file gambar di sini</span>
                  </div>
                </div>
                {formData.image && (
                  <div style={{ marginTop: "1rem" }}>
                    <p className="form-label">Preview:</p>
                    <img src={formData.image} alt="Preview" style={{ maxHeight: "200px", borderRadius: "8px", objectFit: "cover" }} />
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Repository (GitHub)</label>
                  <input
                    type="text" name="githubUrl"
                    className="form-input"
                    placeholder="URL GitHub Repo"
                    value={formData.githubUrl} onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Demo URL</label>
                  <input
                    type="text" name="demoUrl"
                    className="form-input"
                    placeholder="URL Live Demo"
                    value={formData.demoUrl} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Dates & Status */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status" className="form-select"
                    value={formData.status} onChange={handleChange}
                  >
                    <option value="ongoing">Sedang Berjalan</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai</label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" style={{ right: "10px", left: "auto", color: "#666" }} />
                    <input
                      type="date"
                      name="startDate"
                      className="form-input"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {formData.status === "completed" && (
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai</label>
                    <div className="input-with-icon">
                      <FaCalendarAlt className="input-icon" style={{ right: "10px", left: "auto", color: "#666" }} />
                      <input
                        type="date"
                        name="endDate"
                        className="form-input"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tech Stack Multi-Select */}
              <div className="form-group" style={{ position: "relative" }}>
                <label className="form-label">Teknologi Digunakan</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.5rem" }}>
                  {selectedTech.map((tech, i) => (
                    <span key={i} style={{
                      background: "#333",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      {tech}
                      <FaTimes
                        style={{ cursor: "pointer", color: "#ef4444" }}
                        onClick={() => removeTech(tech)}
                      />
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ketik teknologi (React, .NET...) lalu Enter"
                  value={techInput}
                  onChange={handleTechInputChange}
                  onKeyDown={handleTechKeyDown}
                  onBlur={() => setTimeout(() => setShowTechSuggestions(false), 200)}
                />

                {/* Autocomplete Dropdown */}
                {showTechSuggestions && techSuggestions.length > 0 && (
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
                    {techSuggestions.map((skill, index) => (
                      <li
                        key={index}
                        onClick={() => addTech(skill.name)}
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

              <div className="form-group">
                <label className="form-label">Ringkasan (Excerpt)</label>
                <textarea
                  name="excerpt" rows="3"
                  className="form-textarea"
                  placeholder="Deskripsi singkat untuk kartu depan..."
                  value={formData.excerpt} onChange={handleChange} required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Lengkap</label>
                <textarea
                  name="description" rows="6"
                  className="form-textarea"
                  placeholder="Jelaskan detail proyek, fitur, dan tantangan..."
                  value={formData.description} onChange={handleChange} required
                  style={{ resize: "vertical" }}
                ></textarea>
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox" name="isFeatured" id="isFeatured"
                  checked={formData.isFeatured} onChange={handleChange}
                  style={{ width: "20px", height: "20px", accentColor: "#6366f1" }}
                />
                <label htmlFor="isFeatured" style={{ color: "#fff", cursor: "pointer" }}>Tampilkan di Beranda (Featured)</label>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ marginTop: "1rem", width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Menyimpan..." : (
                  <><FaSave /> Simpan Proyek</>
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
