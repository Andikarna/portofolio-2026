
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import "../../css/experience.css";

export default function Experience() {

  const experiences = [
    {
      role: "Frontend Developer",
      company: "Tech Company",
      period: "2023 – Present",
      status: "active",
      stack: ["React", "Tailwind", "REST API"],
      description:
        "Responsible for developing and maintaining modern, responsive web applications using React. Actively collaborating with designers and backend teams to translate business requirements into scalable UI components. Focused on improving user experience, performance optimization, and implementing clean, maintainable frontend architecture aligned with best practices.",
    },
    {
      role: "Android Developer",
      company: "Personal & Freelance Projects",
      period: "2022 – Present",
      status: "completed",
      stack: ["Kotlin", "CameraX", "Firebase", "MVVM"],
      description:
        "Designed and developed Android applications using Kotlin with MVVM architecture. Implemented features such as image classification using CameraX, realtime chat with Firebase, and video streaming functionality. Ensured application stability, performance, and maintainability while continuously refining UX based on user feedback.",
    },
    {
      role: "Backend Developer",
      company: "Project-based",
      period: "2023 – 2024",
      status: "completed",
      stack: [".NET Core", "REST API", "JWT", "SQL Server"],
      description:
        "Built secure and scalable RESTful APIs using .NET Core, including authentication and authorization with JWT. Designed database schemas, handled data validation, and applied clean architecture principles to ensure long-term maintainability. Successfully delivered backend services that supported multiple frontend and mobile applications.",
    },
  ];


  return (
    <section className="loby">

      <TopActions />

      {/* Content */}
      <div className="experience-container">
        <div className="loby-right full">
          <h1>Professional Experience</h1>
          <p className="intro">
            A summary of my professional journey, hands-on projects, and
            technologies I use to build scalable digital products.
          </p>

          <div className="experience-list">
            {experiences.map((exp, index) => (
              <div className="experience-card" key={index}>

                <div className="experience-header">
                  <div className="role">
                    <FaBriefcase /> {exp.role}
                  </div>

                  {/* {exp.status === "active" && (
                    <div className="status active">Currently Working</div>
                  )}

                  {exp.status === "completed" && (
                    <div className="status completed">Completed</div>
                  )} */}
                </div>



                <span className="company">{exp.company}</span>

                <p className="description">{exp.description}</p>

                <div className="stack">
                  {exp.stack.map((tech, i) => (
                    <span key={i} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
