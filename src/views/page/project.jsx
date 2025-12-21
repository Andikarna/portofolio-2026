import "../../css/project.css";
import TopActions from "../components/top-actions.jsx";
import { FaGithub, FaExternalLinkAlt, FaStar } from "react-icons/fa";

const projects = [
  {
    title: "Employee Management System",
    description:
      "Web-based system for attendance, timesheet, and employee management.",
    image: "/project-img.png",
    status: "On Going",
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    title: "Plant E-Commerce App",
    description:
      "Mobile application for selling and managing ornamental plants for UMKM.",
    image: "/project-img.png",
    status: "Completed",
    featured: false,
    github: "#",
    demo: null,
  },
  {
    title: "AI Skin Disease Detection",
    description:
      "Android app utilizing machine learning to detect skin diseases via camera.",
     image: "/project-img.png",
    status: "On Going",
    featured: true,
    github: "#",
    demo: null,
  },
];

export default function Project() {
  return (
    <section className="loby">
      <TopActions />

      <div className="project-container">
        <header className="project-header">
          <h1>Projects</h1>
          <p>
            A collection of projects showcasing problem-solving skills,
            system design, and real-world application development.
          </p>
        </header>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article
              key={index}
              className={`project-card ${
                project.featured ? "featured" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <span
                  className={`status ${
                    project.status === "On Going"
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
      </div>
    </section>
  );
}
