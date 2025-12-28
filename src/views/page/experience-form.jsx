import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExperience, updateExperience, getExperienceById } from "../../api/api";
import { FaArrowLeft, FaSave, FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import "../../css/experience.css";

// POPULAR SKILLS CONSTANT (Same as Project Form)
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

export default function ExperienceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    status: "active",
    startDate: "",
    endDate: "",
    // skills: "" // Removed string field, using selectedSkills array instead
  });

  // Skills State
  const [techInput, setTechInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
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
      const result = await getExperienceById(id, token);

      const data = result.data || result;

      if (data) {
        setFormData({
          title: data.title || "",
          company: data.company || "",
          description: data.description || "",
          status: data.status || "active",
          startDate: data.startDate ? data.startDate.split('T')[0] : "",
          endDate: data.endDate ? data.endDate.split('T')[0] : ""
        });

        // Parse Skills String "React, Node.js" -> ["React", "Node.js"]
        if (data.skills) {
          setSelectedSkills(data.skills.split(',').map(s => s.trim()).filter(s => s));
        }
      }
    } catch (error) {
      console.error("Failed to fetch experience", error);
      showModal("Gagal", "Gagal memuat data pengalaman.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Skills Logic ---
  const handleTechInputChange = (e) => {
    const value = e.target.value;
    setTechInput(value);

    if (value.length > 0) {
      const filtered = POPULAR_SKILLS.filter(skill =>
        skill.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedSkills.includes(skill.name)
      );
      setTechSuggestions(filtered);
      setShowTechSuggestions(true);
    } else {
      setShowTechSuggestions(false);
    }
  };

  const addTech = (techName) => {
    if (!selectedSkills.includes(techName)) {
      setSelectedSkills([...selectedSkills, techName]);
    }
    setTechInput("");
    setShowTechSuggestions(false);
  };

  const removeTech = (techName) => {
    setSelectedSkills(selectedSkills.filter(t => t !== techName));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (techInput.trim()) {
        addTech(techInput.trim());
      }
    }
  };
  // --------------------

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
      navigate("/experience");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formatDate = (dateStr) => {
      if (!dateStr) return null;
      return new Date(dateStr).toISOString();
    };

    const payload = {
      title: formData.title,
      company: formData.company,
      description: formData.description,
      status: formData.status,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      skills: selectedSkills.join(", ") // Convert array back to CSV string
    };

    try {
      if (isEditing) {
        await updateExperience(id, payload, token);
        showModal("Berhasil!", "Data pengalaman berhasil diperbarui.", "success");
      } else {
        await createExperience(payload, token);
        showModal("Berhasil!", "Pengalaman baru berhasil ditambahkan.", "success");
      }
    } catch (error) {
      console.error("Save error", error);
      showModal("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
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
            onClick={() => navigate("/experience")}
          >
            <FaArrowLeft /> Kembali
          </button>

          <header style={{
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem" }}>
              {isEditing ? "Edit Pengalaman" : "Tambah Pengalaman"}
            </h1>
            <p style={{ color: "#9ca3af" }}>
              {isEditing ? "Perbarui informasi pengalaman kerja Anda." : "Tambahkan jejak karir baru ke portofolio Anda."}
            </p>
          </header>

          <div style={{ background: "#1f1f1f", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
            {loading && isEditing && <p style={{ color: "#aaa", marginBottom: "1rem" }}>Memuat data...</p>}

            <form onSubmit={handleSubmit}>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Posisi / Title</label>
                  <input
                    type="text" name="title"
                    className="form-input"
                    placeholder="Contoh: Frontend Developer"
                    value={formData.title} onChange={handleChange} required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Perusahaan</label>
                  <input
                    type="text" name="company"
                    className="form-input"
                    placeholder="Nama Perusahaan"
                    value={formData.company} onChange={handleChange} required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai</label>
                  <input
                    type="date" name="startDate"
                    className="form-input"
                    value={formData.startDate} onChange={handleChange} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Selesai</label>
                  <input
                    type="date" name="endDate"
                    className="form-input"
                    value={formData.endDate} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status" className="form-select"
                  value={formData.status} onChange={handleChange}
                >
                  <option value="active">Aktif (Sedang Bekerja)</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="description" rows="5"
                  className="form-textarea"
                  placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                  value={formData.description} onChange={handleChange} required
                  style={{ resize: "vertical" }}
                ></textarea>
              </div>

              {/* Multi-Select Skills */}
              <div className="form-group" style={{ position: "relative" }}>
                <label className="form-label">Skills (Teknologi yang digunakan)</label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.5rem" }}>
                  {selectedSkills.map((skill, i) => (
                    <span key={i} style={{
                      background: "rgba(99, 102, 241, 0.2)",
                      color: "#818cf8",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      {skill}
                      <FaTimes
                        style={{ cursor: "pointer", color: "#ef4444" }}
                        onClick={() => removeTech(skill)}
                      />
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Ketik skill (React, .NET...) lalu Enter"
                  value={techInput}
                  onChange={handleTechInputChange}
                  onKeyDown={handleTechKeyDown}
                  onBlur={() => setTimeout(() => setShowTechSuggestions(false), 200)}
                />

                {/* Suggestions Dropdown */}
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
                <small style={{ color: "#6b7280", marginTop: "4px", display: "block" }}>Tekan Enter untuk menambahkan skill manual.</small>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ marginTop: "1.5rem", width: "100%", padding: "14px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Menyimpan..." : (
                  <><FaSave /> Simpan Pengalaman</>
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
