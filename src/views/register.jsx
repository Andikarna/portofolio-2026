// views/register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { register as apiRegister } from "../api/api";
import "../css/form.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setStatus(500);

    try {
      const response = await apiRegister({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setStatus(response.status);

      if (response.status === 200) {
        setMessage(response.message || "Your account has been created successfully!");
        setTimeout(() => navigate("/form"), 2000);
      } else {
        setMessage(response.message || "Failed to register. Please check your inputs.");
      }
    } catch (error) {
      if (error.response) {
        setStatus(error.response.status);
        setMessage(
          error.response.data?.message ||
          "Request failed. Please check your input."
        );
      } else if (error.request) {
        setStatus(503);
        setMessage("Server is not responding. Please try again later.");
      } else {
        // Error di frontend
        setStatus(500);
        setMessage("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      {/* Back Button di atas kiri */}
      <button type="button" className="back-btn-top" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back
      </button>

      <div className="form-container">
        <h1>Create Account</h1>
        <p>Fill in the details below to create your account and access all projects.</p>

        {message && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
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

        <form onSubmit={handleRegister}>
          <div className="input-wrapper">
            <FaUser />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="input-wrapper">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
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
              placeholder="Password"
              required
            />
          </div>

          <div className="btn-group">
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>



          {/* Link to Login */}
          <p className="register-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/form")}>Login here</span>
          </p>
        </form>
      </div>
    </section>
  );
}
