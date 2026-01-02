import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopActions from "../components/top-actions.jsx";
import "../../css/article.css";
import { getArticles, deleteArticle } from "../../api/api";
import { jwtDecode } from "jwt-decode";
import Modal from "../components/modal.jsx";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

export default function Article() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleId, setRoleId] = useState(null);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    checkRole();
  }, []);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

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

  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getArticles(page, ITEMS_PER_PAGE, "", token);
      let list = [];

      if (data && data.data && Array.isArray(data.data.data)) {
        list = data.data.data.map(item => ({
          ...item,
          image: (item.imageBase64 && !item.imageBase64.startsWith('data:image'))
            ? `data:image/jpeg;base64,${item.imageBase64}`
            : (item.imageBase64 || item.image),
          date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString() : new Date().toLocaleDateString(),
          excerpt: item.content ? item.content.substring(0, 100) + '...' : item.excerpt || "",
          tags: typeof item.tags === 'string' ? item.tags.split(',') : (item.tags || [])
        }));

        if (data.data.totalPages) {
          setTotalPages(data.data.totalPages);
        } else {
          const total = data.data.totalItems || data.data.totalCount || 0;
          setTotalPages(Math.ceil(total / ITEMS_PER_PAGE) || 1);
        }
      } else if (data && Array.isArray(data.data)) {
        list = data.data.map(item => ({
          ...item,
          image: (item.imageBase64 && !item.imageBase64.startsWith('data:image'))
            ? `data:image/jpeg;base64,${item.imageBase64}`
            : (item.imageBase64 || item.image),
          date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString() : new Date().toLocaleDateString(),
          excerpt: item.content ? item.content.substring(0, 100) + '...' : item.excerpt || "",
          tags: typeof item.tags === 'string' ? item.tags.split(',') : (item.tags || [])
        }));
      } else if (Array.isArray(data)) {
        list = data;
      }

      setArticles(list);
    } catch (error) {
      console.error(error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  // Server-side Pagination
  // const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE); // Handled by state now
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const currentArticles = articles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const currentArticles = articles; // Render what we fetched

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

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const token = localStorage.getItem("token");
      await deleteArticle(selectedId, token);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      fetchArticles(currentPage);
    } catch (error) {
      alert("Gagal menghapus");
      setShowDeleteModal(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleShare = (article, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(url);
    alert("Link artikel berhasil disalin!");
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

                      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="article-tags">
                          {Array.isArray(article.tags) && article.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="tag" style={{ fontSize: "0.75rem" }}>
                              #{tag}
                            </span>
                          ))}
                          {Array.isArray(article.tags) && article.tags.length > 3 && (
                            <span className="tag" style={{ fontSize: "0.75rem" }}>+{article.tags.length - 3}</span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleShare(article, e)}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "none",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        >
                          🔗 Share
                        </button>
                      </div>
                    </div>

                    {/* MANAGE ACTIONS - Bottom Style like Project */}
                    {roleId == 1 && (
                      <div className="action-btn-group" style={{ padding: "10px", borderTop: "1px solid #333", display: "flex", gap: "10px" }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn-edit labeled" style={{ flex: 1 }} onClick={(e) => handleEdit(article, e)}>
                          Edit
                        </button>
                        <button className="btn-delete labeled" style={{ flex: 1 }} onClick={(e) => handleDelete(article.id, e)}>
                          Hapus
                        </button>
                      </div>
                    )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus Artikel"
        actions={
          <>
            <button className="modal-btn cancel" onClick={closeDeleteModal}>
              Batal
            </button>
            <button className="modal-btn confirm" onClick={confirmDelete}>
              Hapus
            </button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.</p>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        title="Berhasil"
        actions={
          <button className="modal-btn confirm" onClick={closeSuccessModal} style={{ background: "#10b981" }}>
            OK
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", padding: "1rem 0" }}>
          <FaCheckCircle style={{ fontSize: "3rem", color: "#10b981" }} />
          <p>Artikel berhasil dihapus.</p>
        </div>
      </Modal>
    </section>
  );
}
