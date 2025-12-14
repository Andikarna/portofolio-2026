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
        <h1>Hello, I'm Andi Karna</h1>
        <p className="hero-subtitle">
          A passionate Software Developer specialized in modern web technologies, including React, Node.js, and scalable architecture.
        </p>
        <p>
          Welcome to my portfolio! Explore my projects to see how I design, develop, and deploy high-quality web applications. 
          You can register for full access to my work or continue as a guest for a quick preview.
        </p>

        <div className="hero-buttons">
          <button className="register-btn" onClick={() => navigate("/form")}>
            <FaUserPlus /> Register & Explore
          </button>
          <button className="guest-btn" onClick={() => navigate("/portfolio")}>
            <FaDoorOpen /> Continue as Guest
          </button>
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
