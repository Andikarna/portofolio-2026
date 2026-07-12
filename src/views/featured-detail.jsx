import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FEATURED_PROJECTS } from "../data/featured-projects.js";
import {
  FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCheckCircle,
  FaChevronLeft, FaChevronRight, FaImages, FaBuilding, FaInfoCircle
} from "react-icons/fa";
import "../css/portofolio.css";

export default function FeaturedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = FEATURED_PROJECTS.find(p => p.id === id);

  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    images: [],
    title: "",
    currentIndex: 0
  });

  const openGallery = (images, title) => {
    setGalleryState({
      isOpen: true,
      images: images,
      title: title,
      currentIndex: 0
    });
  };

  const closeGallery = () => {
    setGalleryState({
      isOpen: false,
      images: [],
      title: "",
      currentIndex: 0
    });
  };

  const nextImage = () => {
    setGalleryState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setGalleryState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (galleryState.isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeGallery();
        } else if (e.key === "ArrowRight") {
          nextImage();
        } else if (e.key === "ArrowLeft") {
          prevImage();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [galleryState.isOpen]);

  if (!project) {
    return (
      <div className="portfolio-container" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h2 style={{ marginBottom: "20px" }}>Proyek tidak ditemukan</h2>
        <button className="back-btn" onClick={() => navigate("/portofolio")}>
          <FaArrowLeft /> Kembali ke Portofolio
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* BACK BUTTON */}
      <div className="portfolio-nav fade-in-up" style={{ animationDelay: '0s' }}>
        <button className="back-btn" onClick={() => navigate("/portofolio")}>
          <FaArrowLeft /> Kembali ke Portofolio
        </button>
      </div>

      <div className="portfolio-grid" style={{ gridTemplateColumns: "1fr", gap: "30px" }}>
        <div className="portfolio-main fade-in-up" style={{ animationDelay: '0.1s' }}>
          <section className="portfolio-section" style={{ padding: "30px", marginBottom: "0" }}>
            {/* HERO BANNER */}
            <div className="fp-image-wrapper" style={{ height: "350px", borderRadius: "16px", marginBottom: "30px" }}>
              <img 
                src={project.image} 
                alt={project.title} 
                className="fp-image" 
                style={{ filter: "brightness(0.8)", animation: "none" }} 
              />
              <div className="fp-glow"></div>
            </div>

            {/* DETAILS HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", marginBottom: "25px" }}>
              <div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px", color: "var(--web-text)" }}>
                  {project.title}
                </h1>
                <div className="fp-badges" style={{ marginBottom: "0" }}>
                  <span className="fp-status">✨ {project.status}</span>
                  <span className="fp-company"><FaBuilding style={{ marginRight: "6px" }} /> {project.company}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ padding: "10px 20px" }}>
                    <FaExternalLinkAlt /> Kunjungi Web
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ padding: "10px 20px" }}>
                    <FaGithub /> Repository
                  </a>
                )}
                {project.images && project.images.length > 0 && (
                  <button 
                    onClick={() => openGallery(project.images, project.title)}
                    className="repo-link gallery-btn"
                    style={{ padding: "10px 20px" }}
                  >
                    <FaImages /> Lihat Galeri Referensi
                  </button>
                )}
              </div>
            </div>

            <hr style={{ borderColor: "var(--web-border)", margin: "30px 0" }} />

            {/* MAIN CONTENT GRID */}
            <div className="portfolio-grid" style={{ gridTemplateColumns: "1.8fr 1fr", gap: "40px" }}>
              {/* DESCRIPTION */}
              <div>
                <h3 className="section-title" style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                  <FaInfoCircle /> Deskripsi Proyek
                </h3>
                <p style={{ color: "var(--web-text-muted)", fontSize: "1.05rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                  {project.description}
                </p>
              </div>

              {/* FEATURES */}
              <div>
                <h3 className="section-title" style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                  <FaCheckCircle /> Fitur Unggulan
                </h3>
                <div className="fp-features">
                  {project.features.map((feat, idx) => (
                    <span key={idx} className="fp-feature" style={{ fontSize: "0.95rem" }}>
                      <FaCheckCircle /> {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* GALLERY MODAL */}
      {galleryState.isOpen && (
        <div className="gallery-modal-overlay" onClick={closeGallery}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <h3>{galleryState.title} - Galeri Foto</h3>
              <button className="gallery-close-btn" onClick={closeGallery} title="Tutup (Esc)">
                &times;
              </button>
            </div>
            
            <div className="gallery-viewer">
              <button 
                className="gallery-nav-arrow left" 
                onClick={prevImage} 
                title="Sebelumnya"
                disabled={galleryState.images.length <= 1}
              >
                <FaChevronLeft />
              </button>
              
              <img 
                src={galleryState.images[galleryState.currentIndex]} 
                alt={`${galleryState.title} - Screenshot ${galleryState.currentIndex + 1}`} 
                className="gallery-img" 
              />
              
              <button 
                className="gallery-nav-arrow right" 
                onClick={nextImage} 
                title="Selanjutnya"
                disabled={galleryState.images.length <= 1}
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className="gallery-counter">
              Gambar {galleryState.currentIndex + 1} dari {galleryState.images.length}
            </div>
            
            {galleryState.images.length > 1 && (
              <div className="gallery-thumbnails">
                {galleryState.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`gallery-thumb ${galleryState.currentIndex === idx ? 'active' : ''}`}
                    onClick={() => setGalleryState(prev => ({ ...prev, currentIndex: idx }))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
