import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../../css/topactions.css";

export default function TopActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const goTo = (path) => {
    navigate(path);
    setOpen(false); // auto close mobile menu
  };

  return (
    <div className="top-actions-wrapper">
      {/* Desktop */}
      <div className="top-actions desktop">
        <button
          className={`action-btn ${isActive("/loby") ? "primary" : "ghost"}`}
          onClick={() => goTo("/loby")}
        >
          About Me
        </button>

        <button
          className={`action-btn ${isActive("/experience") ? "primary" : "ghost"}`}
          onClick={() => goTo("/experience")}
        >
          Experience
        </button>

        <button
          className={`action-btn ${isActive("/skills") ? "primary" : "ghost"}`}
          onClick={() => goTo("/skills")}
        >
          Skills
        </button>

        <button
          className={`action-btn ${isActive("/project") ? "primary" : "ghost"}`}
          onClick={() => goTo("/project")}
        >
          Project
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="top-actions mobile">
        <button className="hamburger" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>

        {open && (
          <div className="mobile-menu">
            <button onClick={() => goTo("/loby")}>About Me</button>
            <button onClick={() => goTo("/experience")}>Experience</button>
            <button onClick={() => goTo("/skills")}>Skills</button>
            <button onClick={() => goTo("/project")}>Project</button>
          </div>
        )}
      </div>
    </div>
  );
}
