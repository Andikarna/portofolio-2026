import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopActions from "../components/top-actions.jsx";
import { MOCK_ARTICLES } from "../../data/mock-articles";
import "../../css/article.css";

const ITEMS_PER_PAGE = 5;

export default function Article() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(MOCK_ARTICLES.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = MOCK_ARTICLES.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <header className="article-header">
          <h1>Artikel & Update Harian</h1>
          <p>
            Catatan perjalanan pengembangan, tutorial, dan update status proyek harian.
          </p>
        </header>

        <div className="article-list">
          {currentArticles.map((article) => (
            <article
              className="article-card"
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
              </div>
              <h2>{article.title}</h2>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-tags">
                {article.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            className="page-btn"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="page-info">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            className="page-btn"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
