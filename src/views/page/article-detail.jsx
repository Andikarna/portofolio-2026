import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaTag } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import { getArticleById } from "../../api/api";
import "../../css/article.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getArticleById(id, token);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

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
            Kembali ke Daftar
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
          <FaArrowLeft /> Kembali ke Daftar
        </button>

        <article className="article-detail-card" style={{ padding: "0", overflow: "hidden" }}>

          {/* Hero Image (New) */}
          {article.image && (
            <div style={{ width: "100%", height: "300px", position: "relative" }}>
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
            <header className="detail-header" style={{ borderBottom: "1px solid #333", paddingBottom: "2rem", marginBottom: "2rem" }}>
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

              <h1 className="detail-title" style={{ marginTop: "1rem" }}>{article.title}</h1>
            </header>

            <div className="detail-content">
              {(() => {
                const content = article.excerpt || article.content || "";
                // Split by triple backticks
                const parts = content.split(/```/g);

                return parts.map((part, index) => {
                  // Even indices are text, Odd indices are code
                  if (index % 2 === 1) {
                    return (
                      <pre key={index} className="code-block">
                        <code>{part.trim()}</code>
                      </pre>
                    );
                  } else {
                    // Handle normal text (split newlines to paragraphs)
                    return part.split('\n').map((line, i) => (
                      line.trim() ? <p key={`${index}-${i}`} style={{ marginBottom: "1rem" }}>{line}</p> : null
                    ));
                  }
                });
              })()}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
