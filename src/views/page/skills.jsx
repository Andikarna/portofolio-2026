import { FaArrowLeft, FaStar } from "react-icons/fa";
import TopActions from "../components/top-actions.jsx";
import "../../css/skill.css";

import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiAndroid,
  SiDotnet,
  SiFirebase,
  SiGit,
} from "react-icons/si";

export default function Skills() {

  const skills = [
    {
      name: ".NET Core",
      icon: <SiDotnet />,
      category: "Backend",
      level: "Expert",
      favorite: true,
    },
    {
      name: "React.js",
      icon: <SiReact />,
      category: "Frontend",
      level: "Advanced",
      favorite: true,
    },
    {
      name: "JavaScript (ES6+)",
      icon: <SiJavascript />,
      category: "Frontend",
      level: "Advanced",
      favorite: true,
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss />,
      category: "Frontend",
      level: "Intermediate",
      favorite: false,
    },
    {
      name: "Android (Kotlin)",
      icon: <SiAndroid />,
      category: "Mobile",
      level: "Advanced",
      favorite: false,
    },
    {
      name: "Firebase",
      icon: <SiFirebase />,
      category: "Tools",
      level: "Intermediate",
      favorite: false,
    },
    {
      name: "Git & GitHub",
      icon: <SiGit />,
      category: "Tools",
      level: "Advanced",
      favorite: true,
    },
  ];

  const favoriteSkills = skills.filter((s) => s.favorite);
  const otherSkills = skills.filter((s) => !s.favorite);

  return (
    <section className="loby">
      <TopActions />

      <div className="page-container">
        <div className="loby-right full">
          <h1>Skills & Expertise</h1>
          <p className="intro">
            A detailed overview of my technical skills, proficiency levels,
            and core technologies I frequently use in real-world projects.
          </p>

          <div className="skills-columns">
            {/* LEFT - FAVORITE */}
            <div className="skills-column">
              <h3 className="column-title">
                <FaStar className="star" /> Core Skills
              </h3>

              <div className="skills-grid">
                {favoriteSkills.map((skill, index) => (
                  <div className="skill-card highlight" key={index}>
                    <div className="skill-header">
                      <div className="skill-title">
                        <span className="skill-icon">{skill.icon}</span>
                        <h3>{skill.name}</h3>
                      </div>
                    </div>

                    <span className="category">{skill.category}</span>
                    <span className={`level ${skill.level.toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - NON FAVORITE */}
            <div className="skills-column">
              <h3 className="column-title muted">Additional Skills</h3>

              <div className="skills-grid">
                {otherSkills.map((skill, index) => (
                  <div className="skill-card" key={index}>
                    <div className="skill-header">
                      <div className="skill-title">
                        <span className="skill-icon">{skill.icon}</span>
                        <h3>{skill.name}</h3>
                      </div>
                    </div>

                    <span className="category">{skill.category}</span>
                    <span className={`level ${skill.level.toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
