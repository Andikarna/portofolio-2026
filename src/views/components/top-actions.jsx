import { useNavigate, useLocation } from "react-router-dom";
import "../../css/topactions.css";

export default function TopActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="top-actions">
      <button
        className={`action-btn ${isActive("/loby") ? "primary" : "ghost"}`}
        onClick={() => navigate("/loby")}
      >
        Tentang Saya
      </button>

      <button
        className={`action-btn ${isActive("/experience") ? "primary" : "ghost"}`}
        onClick={() => navigate("/experience")}
      >
        Pengalaman
      </button>

      <button
        className={`action-btn ${isActive("/skills") ? "primary" : "ghost"}`}
        onClick={() => navigate("/skills")}
      >
        Keahlian
      </button>

      <button
        className={`action-btn ${isActive("/project") ? "primary" : "ghost"}`}
        onClick={() => navigate("/project")}
      >
        Proyek
      </button>

      <button
        className={`action-btn ${isActive("/article") ? "primary" : "ghost"}`}
        onClick={() => navigate("/article")}
      >
        Artikel
      </button>
    </div>
  );
}
