import { useState } from "react";
import "../../css/project.css";
import TopActions from "../components/top-actions.jsx";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { MOCK_PROJECTS } from "../../data/mock-projects";
import { useNavigate } from "react-router-dom";

export default function Project() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(MOCK_PROJECTS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = MOCK_PROJECTS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <header className="project-header">
          <h1>Projects</h1>
          <p>
            A collection of projects showcasing problem-solving skills,
            system design, and real-world application development.
          </p>
        </header>

        <div className="project-grid">
          {currentData.map((project, index) => (
            <article
              key={index}
              onClick={() => navigate(`/project/${project.id}`)}
              style={{ cursor: "pointer" }}
              className={`project-card ${project.featured ? "featured" : ""
                }`}
            >
              {/* IMAGE */}
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <span
                  className={`status ${project.status === "On Going"
                    ? "ongoing"
                    : "completed"
                    }`}
                >
                  {project.status}
                </span>

                {project.featured && (
                  <FaStar className="featured-icon" />
                )}
              </div>

              {/* CONTENT */}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="actions">
                  {project.github && (
                    <a href={project.github} target="_blank">
                      <FaGithub /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank">
                      <FaExternalLinkAlt /> Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
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
        )}
      </div>
    </section>
  );
}
