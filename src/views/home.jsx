import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaDoorOpen } from "react-icons/fa";
import illustration from "../assets/logo.png";
import "../css/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Left Column: Introduction + CTA */}
      <div className="hero-left">
        <h1>Halo, Saya Andi Karna</h1>
        <p className="hero-subtitle">
          Software Developer yang bersemangat dengan spesialisasi teknologi web modern, termasuk React, Node.js, dan arsitektur scalable.
        </p>
        <p>
          Selamat datang di portofolio saya! Jelajahi proyek saya untuk melihat bagaimana saya merancang dan membangun aplikasi web berkualitas tinggi.
          Anda dapat mendaftar untuk akses penuh atau lanjutkan sebagai tamu.
        </p>

        <div className="hero-buttons">
          <button className="register-btn" onClick={() => navigate("/form")}>
            <FaUserPlus /> Mulai Jelajahi Aplikasi
          </button>
          {/* <button className="guest-btn" onClick={() => navigate("/portfolio")}>
            <FaDoorOpen /> Continue as Guest
          </button> */}
        </div>

        {/* Optional: Skills or small highlights */}
        <div className="hero-skills">
          <span>React.js</span>
          <span>.NET 6/8/9</span>
          <span>REST APIs</span>
          <span>MySQL</span>
          <span>AI</span>
        </div>
      </div>

      {/* Right Column: Illustration */}
      <div className="hero-right">
        <img
          src={illustration}
          alt="Professional Illustration"
          className="hero-illustration"
        />
      </div>
    </section>
  );
}
