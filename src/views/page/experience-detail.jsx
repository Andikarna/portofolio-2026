import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExperienceById } from "../../api/api";
import { FaArrowLeft, FaBuilding, FaCalendarAlt, FaTools, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import "../../css/experience.css";

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await getExperienceById(id, token);
      console.log("Fetched Detail Data:", result);
      const data = result.data || result;
      setExperience(data);
    } catch (error) {
      console.error("Failed to fetch detail", error);
      alert("Gagal memuat detail pengalaman.");
      navigate("/experience");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Sekarang";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (loading) return (
    <section className="loby">
      <TopActions />
      <div className="page-container" style={{ textAlign: "center", marginTop: "1rem", color: "#aaa" }}>
        <button
          onClick={() => navigate("/experience")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "#6366f1",
            cursor: "pointer",
            marginBottom: "1rem",
            fontWeight: "600",
            fontSize: "1rem"
          }}
        >
          <FaArrowLeft /> Kembali ke Daftar
        </button>
        <p>Memuat detail...</p>
      </div>
    </section>
  );

  if (!experience) return null;

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        <div style={{ width: "100%" }}>
          <button
            className="back-link"
            onClick={() => navigate("/experience")}
          >
            <FaArrowLeft /> Kembali
          </button>

          {/* Header Section */}
          <header style={{
            padding: "1rem",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#fff", marginBottom: "0.5rem", lineHeight: "1.3" }}>
                    {experience.title}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#a1a1aa", fontSize: "1rem", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaBuilding style={{ color: "#6366f1" }} />
                      <span style={{ fontWeight: "500", color: "#e5e7eb" }}>{experience.company}</span>
                    </div>
                    <span style={{ color: "#4b5563" }}>•</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem" }}>
                      <FaCalendarAlt style={{ color: "#10b981" }} />
                      <span>
                        {experience.startDate ? formatDate(experience.startDate) : "-"} — {experience.endDate ? formatDate(experience.endDate) : "Sekarang"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`experience-status ${experience.status === "active" ? "active" : "completed"}`} style={{ fontSize: "0.85rem", padding: "6px 14px", borderRadius: "20px" }}>
                  {experience.status === "active" ? (
                    <><FaHourglassHalf style={{ marginRight: "6px" }} /> Sedang Bekerja</>
                  ) : (
                    <><FaCheckCircle style={{ marginRight: "6px" }} /> Selesai</>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>

            {/* Description Section */}
            <div style={{ background: "#1f1f1f", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #333", paddingBottom: "0.75rem", fontWeight: "600" }}>
                <FaTools style={{ color: "#6366f1" }} /> Deskripsi Pekerjaan
              </h3>
              <div style={{ color: "#d1d5db", lineHeight: "1.7", fontSize: "1rem", whiteSpace: "pre-line" }}>
                {experience.description || "Tidak ada deskripsi."}
              </div>
            </div>

            {/* Skills Section - Full Width & Modern */}
            <div style={{ background: "#1f1f1f", padding: "2rem", borderRadius: "12px", border: "1px solid #333" }}>
              <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #333", paddingBottom: "0.75rem", fontWeight: "600" }}>
                <FaCheckCircle style={{ color: "#10b981" }} /> Skills & Technologies
              </h3>

              <div className="stack" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {experience.skills && typeof experience.skills === 'string'
                  ? experience.skills.split(',').map((tech, i) => (
                    <span key={i} style={{
                      background: "rgba(99, 102, 241, 0.08)",
                      color: "#a5b4fc",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      transition: "all 0.2s"
                    }}>
                      {tech.trim()}
                    </span>
                  ))
                  : Array.isArray(experience.stack)
                    ? experience.stack.map((tech, i) => (
                      <span key={i} style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        color: "#a5b4fc",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                        transition: "all 0.2s"
                      }}>
                        {tech}
                      </span>
                    ))
                    : <span style={{ color: "#52525b", fontStyle: "italic" }}>Tidak ada skills yang dicantumkan.</span>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
