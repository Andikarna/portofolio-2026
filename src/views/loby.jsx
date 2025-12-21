import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import TopActions from "../views/components/top-actions.jsx";
import "../css/loby.css";

export default function Loby() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/form");
    return null;
  }

  const decoded = jwtDecode(token);
  if (decoded.exp * 1000 < Date.now) {
    localStorage.removeItem("token");
    navigate("/form");
    return null;
  }

  const username = decoded.username || decoded.Name || "Guest";

  return (
    <section className="loby">

      <TopActions />
      {/* <div className="top-actions">
        <button className="action-btn primary" onClick={() => navigate("/loby")}>
          About Me
        </button>
        <button className="action-btn ghost" onClick={() => navigate("/experience")}>
          Experience
        </button>
        <button className="action-btn ghost" onClick={() => navigate("/skills")}>
          Skills
        </button>
        <button className="action-btn ghost" onClick={() => navigate("/contact")}>
          Hire Me
        </button>
      </div> */}

      <div className="loby-container">

        <div className="loby-left">
          <div className="card">
            <h3>Active Experience</h3>
            <p>Frontend & Mobile Developer</p>
          </div>
          <div className="card">
            <h3>Main Stack</h3>
            <p>React • Android (Kotlin) • .NET</p>
          </div>
          <div className="card">
            <h3>Total Projects</h3>
            <p>15+ Professional & Personal Projects</p>
          </div>
        </div>
        
        <div className="loby-right">
          <h1>Hello, {username} 👋</h1>
          <h2>I'm Andi Karna</h2>
          <p className="intro">
            A passionate Fullstack & Mobile Developer who builds scalable, clean,
            and maintainable digital products. I focus on business impact and long-term
            growth through solid architecture and thoughtful UX.
          </p>

          <div className="section">
            <h3>Experience</h3>
            <ul>
              <li>✔ Frontend Developer – 1+ year professional experience</li>
              <li>✔ Android Developer (Kotlin, CameraX, Firebase)</li>
              <li>✔ Backend API with .NET & REST Architecture</li>
            </ul>
          </div>

          <div className="section">
            <h3>Highlighted Projects</h3>
            <ul>
              <li>📱 Mobile App – Image Classification & Streaming</li>
              <li>🌱 E-commerce App for UMKM (Plants)</li>
              <li>💬 Realtime Chat App with Firebase</li>
              <li>🌐 Portfolio & Admin Dashboard System</li>
            </ul>
          </div>

          <button className="cta-btn" onClick={() => navigate("/portfolio")}>
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}
