import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../css/topactions.css";

export default function TopActions() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path starts with the link path (for sub-routes)
  const isActive = (path) => {
    if (path === "/loby" && location.pathname === "/loby") return true;
    if (path !== "/loby" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const token = localStorage.getItem("token");
  let roleId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      roleId = decoded.role || decoded.Role || decoded.RoleId || null;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <div className="top-actions">
      <button
        className={`action-btn ${isActive("/loby") ? "active" : ""}`}
        onClick={() => navigate("/loby")}
      >
        Tentang Saya
      </button>
      {roleId == 1 && (
        <>
          <button
            className={`action-btn manage ${isActive("/experience") ? "active" : ""}`}
            onClick={() => navigate("/experience")}
          >
            Manage Exp
          </button>
          <button
            className={`action-btn manage ${isActive("/skills") ? "active" : ""}`}
            onClick={() => navigate("/skills")}
          >
            Manage Skills
          </button>
          <button
            className={`action-btn manage ${isActive("/project") ? "active" : ""}`}
            onClick={() => navigate("/project")}
          >
            Manage Project
          </button>
          <button
            className={`action-btn manage ${isActive("/article") ? "active" : ""}`}
            onClick={() => navigate("/article")}
          >
            Manage Article
          </button>
        </>
      )}

      {roleId == 2 && (
        <>


          <button
            className={`action-btn ${isActive("/experience") ? "active" : ""}`}
            onClick={() => navigate("/experience")}
          >
            Pengalaman
          </button>

          <button
            className={`action-btn ${isActive("/skills") ? "active" : ""}`}
            onClick={() => navigate("/skills")}
          >
            Keahlian
          </button>

          <button
            className={`action-btn ${isActive("/project") ? "active" : ""}`}
            onClick={() => navigate("/project")}
          >
            Proyek
          </button>

          <button
            className={`action-btn ${isActive("/article") ? "active" : ""}`}
            onClick={() => navigate("/article")}
          >
            Artikel
          </button>
        </>
      )}
    </div>
  );
}
