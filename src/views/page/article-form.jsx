import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, updateArticle, getArticleById } from "../../api/api";
import { FaArrowLeft, FaSave, FaCloudUploadAlt, FaTimes, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import "../../css/experience.css"; // Use shared styles

export default function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    excerpt: "",
    tags: [],
    image: null
  });
  const [imageFile, setImageFile] = useState(null);

  const [tagInput, setTagInput] = useState("");

  const [modal, setModal] = useState({ isOpen: false, type: "success", message: "" });

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      navigate("/article");
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchData();
    } else {
      // Use local time for correct date
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await getArticleById(id, token);
      const data = response.data || response; // Handle if response is wrapped or not (based on sample: response.data)

      if (data) {
        setFormData({
          title: data.title || "",
          date: data.publicationDate ? data.publicationDate.split("T")[0] : (data.date ? data.date.split("T")[0] : ""),
          excerpt: data.content || data.excerpt || "",
          tags: Array.isArray(data.tags)
            ? data.tags
            : (typeof data.tags === 'string' ? data.tags.split(",").map(t => t.trim()) : []),
          image: (data.imageBase64 && !data.imageBase64.startsWith('data:image'))
            ? `data:image/jpeg;base64,${data.imageBase64}`
            : (data.imageBase64 || data.image || null)
        });
      }
    } catch (error) {
      console.error("Failed to fetch article", error);
      setModal({ isOpen: true, type: "error", message: "Gagal memuat data artikel." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag Management Logic
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !formData.tags.includes(val)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = new FormData();
    payload.append("Title", formData.title);
    payload.append("Content", formData.excerpt);
    payload.append("PublicationDate", formData.date);

    // Tags: Join with comma
    if (formData.tags && formData.tags.length > 0) {
      payload.append("Tags", formData.tags.join(","));
    } else {
      payload.append("Tags", "");
    }

    // ImageFile
    if (imageFile) {
      payload.append("ImageFile", imageFile);
    }

    // ImageBase64
    if (formData.image && typeof formData.image === 'string' && formData.image.startsWith('data:')) {
      payload.append("ImageBase64", formData.image);
    } else {
      // Prevent 500 crash by sending empty string
      payload.append("ImageBase64", "");

      // Try to preserve by sending URL if it exists
      if (formData.image && !formData.image.startsWith("data:")) {
        payload.append("Image", formData.image);
        payload.append("CoverImageUrl", formData.image);
      }
    }

    try {
      if (isEditing) {
        await updateArticle(id, payload, token);
        setModal({ isOpen: true, type: "success", message: "Artikel berhasil diperbarui!" });
      } else {
        await createArticle(payload, token);
        setModal({ isOpen: true, type: "success", message: "Artikel berhasil dibuat!" });
      }
      // Remove auto-redirect, wait for user to click OK
    } catch (error) {
      console.error("Save error", error);
      setModal({ isOpen: true, type: "error", message: "Gagal menyimpan artikel." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="loby">
      <TopActions />

      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={handleCloseModal}
          title={modal.type === "success" ? "Berhasil" : "Gagal"}
          actions={
            <button
              className="modal-btn confirm"
              onClick={handleCloseModal}
              style={{ background: modal.type === "success" ? "#10b981" : "#ef4444" }}
            >
              OK
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
            {modal.type === "success" ? (
              <FaCheckCircle style={{ fontSize: "3rem", color: "#10b981" }} />
            ) : (
              <FaExclamationCircle style={{ fontSize: "3rem", color: "#ef4444" }} />
            )}
            <p>{modal.message}</p>
          </div>
        </Modal>
      )}

      <div className="loby-container">
        <button
          className="back-link"
          onClick={() => navigate("/article")}
          style={{}}
        >
          <FaArrowLeft /> Kembali
        </button>

        <div className="form-card">
          <header style={{
            marginBottom: "2rem",
            borderBottom: "1px solid #333",
            paddingBottom: "1rem"
          }}>
            <h1 className="form-header-title" style={{ marginBottom: "0.5rem" }}>
              {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>
              Bagikan pemikiran, tutorial, atau update terbaru Anda.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="form-label">Cover Image (Opsional)</label>
              <div
                className="image-upload-area"
                style={{
                  border: "2px dashed #444",
                  borderRadius: "12px",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#1a1a1a",
                  position: "relative",
                  transition: "all 0.2s"
                }}
                onClick={() => document.getElementById("articleImageInput").click()}
              >
                {formData.image ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ maxHeight: "300px", maxWidth: "100%", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, image: null });
                      }}
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div style={{ color: "#666" }}>
                    <FaCloudUploadAlt style={{ fontSize: "3rem", marginBottom: "1rem" }} />
                    <p>Klik untuk upload cover image</p>
                  </div>
                )}
                <input
                  id="articleImageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Judul Artikel</label>
                <input
                  type="text" name="title"
                  className="form-input"
                  placeholder="Contoh: Tutorial React 2024"
                  value={formData.title} onChange={handleChange} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Publikasi</label>
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" style={{ right: "10px", left: "auto", color: "#666" }} />
                  <input
                    type="date" name="date"
                    className="form-input"
                    value={formData.date} onChange={handleChange} required
                  />
                </div>
              </div>
            </div>

            {/* Multi-select Tags */}
            <div className="form-group">
              <label className="form-label">Tags / Topik</label>
              <div style={{
                background: "#0f0f0f",
                border: "1px solid #27272a",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px"
              }}>
                {formData.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    background: "rgba(99, 102, 241, 0.2)",
                    color: "#818cf8",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    {tag}
                    <FaTimes
                      style={{ cursor: "pointer", fontSize: "0.8rem", opacity: 0.8 }}
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={formData.tags.length === 0 ? "Ketik tag lalu Enter..." : ""}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    outline: "none",
                    flex: 1,
                    minWidth: "150px",
                    fontSize: "0.95rem"
                  }}
                />
              </div>
              <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                Tekan <b>Enter</b> untuk menambahkan tag.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Konten / Ringkasan
                <button
                  type="button"
                  onClick={() => {
                    const codeBlock = "\n```\n// Tulis kode anda di sini\nconsole.log('Hello World');\n```\n";
                    setFormData(prev => ({ ...prev, excerpt: prev.excerpt + codeBlock }));
                  }}
                  style={{
                    marginLeft: "10px",
                    background: "#333",
                    border: "none",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  + Insert Code Block
                </button>
              </label>
              <textarea
                name="excerpt" rows="12"
                className="form-textarea"
                placeholder="Tulis artikel anda di sini..."
                value={formData.excerpt} onChange={handleChange} required
                style={{ resize: "vertical", minHeight: "200px", fontFamily: "inherit" }}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                marginTop: "1.5rem",
                width: "100%",
                padding: "16px",
                fontSize: "1rem",
                fontWeight: "600",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {loading ? "Menyimpan..." : (
                <><FaSave /> Simpan Artikel</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
