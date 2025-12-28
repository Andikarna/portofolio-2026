import { useState, useEffect } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
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
      const data = await getSkills();
      const list = Array.isArray(data) ? data : (data.data || []);
      setSkills(list);
    } catch (error) {
      console.error(error);
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

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus keahlian ini?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteSkill(id, token);
        fetchSkills();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  const favoriteSkills = skills.filter((s) => s.favorite);
  const otherSkills = skills.filter((s) => !s.favorite);

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
                        <div className="action-btn-group" style={{ position: "absolute", top: "10px", right: "10px" }}>
                          <button className="btn-edit" onClick={() => handleEdit(skill)}>
                            <FaEdit />
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(skill.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      )}

                      <div className="skill-header">
                        <div className="skill-title">
                          <span className="skill-icon">{ICON_MAP[skill.iconName] || <SiReact />}</span>
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
                        <div className="action-btn-group" style={{ position: "absolute", top: "10px", right: "10px" }}>
                          <button className="btn-edit" onClick={() => handleEdit(skill)}>
                            <FaEdit />
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(skill.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      )}

                      <div className="skill-header">
                        <div className="skill-title">
                          <span className="skill-icon">{ICON_MAP[skill.iconName] || <SiReact />}</span>
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
    </section>
  );
}
