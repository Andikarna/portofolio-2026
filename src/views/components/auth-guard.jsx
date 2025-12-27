import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaLock } from "react-icons/fa";
import { refreshToken as apiRefreshToken } from "../../api/api";
import "../../css/auth-guard.css";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const rToken = localStorage.getItem("refresh_token");

      if (!token) {
        setShowPopup(true);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        // Date.now() is in ms, exp is in seconds
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token expired, attempting refresh...");

          if (!rToken) {
            handleUnauthorized();
            return;
          }

          try {
            const response = await apiRefreshToken({
              token: token,
              refreshToken: rToken,
            });

            if (response && response.token && response.refreshToken) {
              console.log("Token refreshed successfully");
              localStorage.setItem("token", response.token);
              localStorage.setItem("refresh_token", response.refreshToken);
              setAuthorized(true);
            } else {
              throw new Error("Invalid refresh response");
            }
          } catch (refreshError) {
            console.error("Refresh failed", refreshError);
            handleUnauthorized();
          }
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Token validation failed", error);
        handleUnauthorized();
      }
    };

    checkAuth();
  }, []);

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setShowPopup(true);
  };

  const handleRedirect = () => {
    navigate("/form");
  };

  if (showPopup) {
    return (
      <div className="auth-overlay">
        <div className="auth-popup">
          <div className="auth-icon">
            <FaLock />
          </div>
          <h2>Sesi Berakhir</h2>
          <p>
            Masa berlaku sesi anda telah habis.
            Silakan login kembali untuk melanjutkan.
          </p>
          <button className="auth-btn" onClick={handleRedirect}>
            Login Kembali
          </button>
        </div>
      </div>
    );
  }

  if (authorized) {
    return children;
  }

  return null;
}
