import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaTag } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import { MOCK_ARTICLES } from "../../data/mock-articles";
import "../../css/article.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = MOCK_ARTICLES.find((a) => a.id === parseInt(id));

  if (!article) {
    return (
      <section className="loby">
        <TopActions />
        <div className="page-container" style={{ textAlign: "center", paddingTop: "5rem" }}>
          <h2>Artikel tidak ditemukan</h2>
          <button className="back-btn" onClick={() => navigate("/article")}>
            Kembali ke Daftar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <button className="back-link" onClick={() => navigate("/article")}>
          <FaArrowLeft /> Kembali ke Daftar
        </button>

        <article className="article-detail-card">
          <header className="detail-header">
            <div className="meta-row">
              <span className="date-badge">
                <FaCalendar /> {article.date}
              </span>
              <div className="tags-row">
                {article.tags.map((tag, i) => (
                  <span key={i} className="detail-tag">
                    <FaTag /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="detail-title">{article.title}</h1>
          </header>

          <div
            className="detail-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </section>
  );
}
