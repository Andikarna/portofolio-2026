// views/form.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaLock } from "react-icons/fa";
import "../css/form.css";
import { login } from "../api/api";

export default function Form() {

  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLogin) {
      navigate("/loby");
    }
  }, [isLogin, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setStatus(500);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      setStatus(response.status);

      if (response.status == 200) {
        setStatus(response.status);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh_token", response.data.refreshToken);
        setMessage(response?.message || "Login successful!");
        setTimeout(() => navigate("/loby"), 2000);
      }

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data?.message || "Login failed");
      } else {
        setMessage("Server error");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <button type="button" className="back-btn-top" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back
      </button>

      <div className="form-container">
        <h1>Login</h1>
        <p>Enter your credentials to access your account.</p>

        {message && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              marginBottom: "1rem",
              borderRadius: "12px",
              backgroundColor: status === 200 ? "rgba(79,70,229,0.1)" : "rgba(255,77,77,0.1)",
              color: status === 200 ? "#4f46e5" : "#ff4d4d",
              fontWeight: 500,
              transition: "all 0.3s ease",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              required
            />
          </div>

          <div className="input-wrapper">
            <FaLock />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="register-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="register-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register here</span>
          </p>
        </form>
      </div>
    </section>
  );
}
