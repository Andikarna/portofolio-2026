import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaDoorOpen } from "react-icons/fa";
import illustration from "../assets/ils.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Kolom kiri: Perkenalan + tombol */}
      <div className="hero-left">
        <h1>Halo, saya Andi Karna</h1>
        <p>
          Saya seorang Software Developer yang bersemangat membangun aplikasi web modern.
          Jelajahi portofolio saya untuk melihat proyek dan kemampuan saya.
          Anda bisa mendaftar untuk mendapatkan akses penuh atau melanjutkan sebagai pengunjung.
        </p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <button className="register-btn" onClick={() => navigate("/register")}>
            <FaUserPlus /> Daftar & Jelajahi
          </button>
          <button className="guest-btn" onClick={() => navigate("/portfolio")}>
            <FaDoorOpen /> Lanjut sebagai Pengunjung
          </button>
        </div>
      </div>

      {/* Kolom kanan: Ilustrasi */}
      <div className="hero-right">
        <img
          src={illustration}
          alt="Ilustrasi"
          className="hero-illustration"
        />
      </div>
    </section>
  );
}
