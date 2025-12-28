import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopActions from "../components/top-actions.jsx";
import "../../css/article.css";
import { getArticles, deleteArticle } from "../../api/api";
import { jwtDecode } from "jwt-decode";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function Article() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleId, setRoleId] = useState(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    checkRole();
    fetchArticles();
  }, []);

  const checkRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRoleId(decoded.role || decoded.Role || decoded.RoleId || null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      const list = Array.isArray(data) ? data : (data.data || []);
      setArticles(list);
    } catch (error) {
      console.error(error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };

  // Handlers
  const handleAdd = () => {
    navigate("/article/add");
  };

  const handleEdit = (article, e) => {
    e.stopPropagation();
    navigate(`/article/edit/${article.id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteArticle(id, token);
        fetchArticles();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  return (
    <section className="loby">
      <TopActions />

      <div className="loby-container">
        <header className="article-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h1>Artikel & Update Harian</h1>
            <p>
              Catatan perjalanan pengembangan, tutorial, dan update status proyek harian.
            </p>
          </div>
          {roleId == 1 && (
            <button className="btn-primary" onClick={handleAdd}>
              <FaPlus /> Tambah Artikel
            </button>
          )}
        </header>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <p>Memuat artikel...</p>
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "16px" }}>
                <p style={{ color: "#aaa", fontSize: "1.1rem" }}>Belum ada artikel yang diterbitkan.</p>
                {roleId == 1 && (
                  <button className="btn-primary" onClick={handleAdd} style={{ marginTop: "1rem" }}>
                    Buat Artikel Pertama
                  </button>
                )}
              </div>
            ) : (
              <div className="article-list">
                {currentArticles.map((article, index) => (
                  <article
                    className="article-card"
                    key={article.id || index}
                    onClick={() => navigate(`/article/${article.id}`)}
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    {/* MANAGE ACTIONS */}
                    {roleId == 1 && (
                      <div className="action-btn-group" style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-edit"
                          onClick={(e) => handleEdit(article, e)}
                          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", marginRight: "5px" }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => handleDelete(article.id, e)}
                          style={{ background: "rgba(239, 68, 68, 0.8)", backdropFilter: "blur(4px)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer" }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}

                    {/* COVER IMAGE */}
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="article-image-preview" />
                    ) : (
                      <div className="article-image-preview" style={{ background: "linear-gradient(45deg, #1f1f1f, #2d2d2d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "2rem", opacity: 0.2 }}>📝</span>
                      </div>
                    )}

                    <div className="article-card-content">
                      <div className="article-meta" style={{ marginBottom: "0" }}>
                        <span className="article-date">{article.date}</span>
                      </div>

                      <h2 style={{ fontSize: "1.25rem", margin: "0", lineHeight: "1.4" }}>
                        {article.title}
                      </h2>

                      <p className="article-excerpt" style={{
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        {article.excerpt}
                      </p>

                      <div className="article-tags" style={{ marginTop: "auto", paddingTop: "1rem" }}>
                        {Array.isArray(article.tags) && article.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="tag" style={{ fontSize: "0.75rem" }}>
                            #{tag}
                          </span>
                        ))}
                        {Array.isArray(article.tags) && article.tags.length > 3 && (
                          <span className="tag" style={{ fontSize: "0.75rem" }}>+{article.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>

                <span className="page-info">
                  Halaman {currentPage} dari {totalPages}
                </span>

                <button
                  className="page-btn"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
