import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaTag, FaShare, FaCheckCircle, FaCopy, FaCheck } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import Modal from "../components/modal.jsx";
import { getArticleById } from "../../api/api";
import "../../css/article.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);



  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getArticleById(id, token);
        let data = response.data || response; // content is inside data.data based on user schema

        if (data) {
          const processedArticle = {
            ...data,
            image: (data.imageBase64 && !data.imageBase64.startsWith('data:image'))
              ? `data:image/jpeg;base64,${data.imageBase64}`
              : (data.imageBase64 || data.image),
            date: data.publicationDate
              ? new Date(data.publicationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : (data.date ? new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })),
            tags: typeof data.tags === 'string' ? data.tags.split(',') : (data.tags || [])
          };
          setArticle(processedArticle);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(true);
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  if (loading) {
    return (
      <section className="loby">
        <TopActions />
        <div className="loby-container" style={{ textAlign: "center", paddingTop: "5rem", color: "#aaa" }}>
          <p>Memuat artikel...</p>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="loby">
        <TopActions />
        <div className="loby-container" style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h2 style={{ color: "#fff" }}>Artikel tidak ditemukan</h2>
          <button className="back-link" onClick={() => navigate("/article")} style={{ justifyContent: "center", margin: "1rem auto" }}>
            Kembali
          </button>
        </div>
      </section>
    );
  }

  // Handle tags can be array or string
  const tagsList = Array.isArray(article.tags)
    ? article.tags
    : (article.tags ? article.tags.split(',').map(t => t.trim()) : []);

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        <button
          className="back-link"
          onClick={() => navigate("/article")}
          style={{ marginBottom: "1rem" }}
        >
          <FaArrowLeft /> Kembali
        </button>

        <article className="article-detail-card" style={{ padding: "0", overflow: "hidden" }}>

          {/* Hero Image */}
          {article.image && (
            <div style={{ width: "100%", height: "350px", position: "relative" }}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 0%, rgba(31,31,31,1) 100%)"
              }}></div>
            </div>
          )}

          <div style={{ padding: "3rem" }}>
            <header className="detail-header">
              <div className="meta-row">
                <span className="date-badge">
                  <FaCalendar /> {article.date}
                </span>
                <div className="tags-row">
                  {tagsList.map((tag, i) => (
                    <span key={i} className="detail-tag">
                      <FaTag /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="detail-title">{article.title}</h1>
            </header>

            <div className="detail-content">
              {(() => {
                const content = article.excerpt || article.content || "";
                const parts = content.split(/```/g);
                return parts.map((part, index) => {
                  if (index % 2 === 1) {
                    const code = part.trim();
                    const isCopied = copiedCodeIndex === index;
                    return (
                      <div key={index} style={{ position: 'relative' }}>
                        <button
                          onClick={() => handleCopyCode(code, index)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: isCopied ? '#10b981' : '#ccc',
                            padding: '4px 8px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            zIndex: 10,
                            transition: 'all 0.2s'
                          }}
                        >
                          {isCopied ? <FaCheck /> : <FaCopy />}
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                        <pre className="code-block">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  } else {
                    return part.split('\n').map((line, i) => (
                      line.trim() ? <p key={`${index}-${i}`}>{line}</p> : null
                    ));
                  }
                });
              })()}
            </div>

            {/* INTERACTION SECTION (Mocked) */}
            <div className="interaction-section">
              <div className="action-buttons">

                <button
                  className="action-btn share-btn"
                  onClick={handleShare}
                >
                  <FaShare /> Share Article
                </button>
              </div>
            </div>

          </div>
        </article>
      </div>

      {/* Share Success Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Link Disalin!"
        actions={
          <button
            className="modal-btn confirm"
            onClick={() => setShowShareModal(false)}
            style={{ background: "#10b981" }}
          >
            OK
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
          <FaCheckCircle style={{ fontSize: "3rem", color: "#10b981" }} />
          <p>Link artikel telah disalin ke clipboard.</p>
        </div>
      </Modal>
    </section>
  );
}
