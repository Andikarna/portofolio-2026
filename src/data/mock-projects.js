export const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Employee Management System",
    description: "Web-based system for attendance, timesheet, and employee management.",
    period: "January 2024",
    image: "/project-employee.png",
    status: "On Going",
    featured: true,
    github: "https://github.com/Andikarna/EmployeeManagement",
    demo: "https://employee-system-demo.com",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    features: [
      "Real-time attendance tracking with geolocation.",
      "Automated payroll calculation based on work hours.",
      "Leave request and approval workflow.",
      "Comprehensive reporting dashboard for HR managers."
    ],
    detailedDescription: "A comprehensive solution designed to streamline HR processes. The system replaces manual spreadsheets with a centralized database, reducing errors in payroll and attendance tracking by 40%. Built with scalability in mind, it uses a microservices architecture to handle growing employee data."
  },
  {
    id: 2,
    title: "Plant E-Commerce App",
    description: "Mobile application for selling and managing ornamental plants for UMKM.",
    period: "November 2023",
    image: "/project-plant.png",
    status: "Completed",
    featured: false,
    github: "https://github.com/Andikarna/PlantShop",
    demo: null,
    technologies: ["React Native", "Firebase", "Redux", "Stripe API"],
    features: [
      "Product catalog with high-quality image gallery.",
      "Secure payment gateway integration.",
      "Order tracking and history for users.",
      "Admin panel for inventory management."
    ],
    detailedDescription: "Developed to help local MSMEs expand their market reach. This mobile app provides a user-friendly platform for plant enthusiasts to discover and purchase rare ornamental plants. Features include a personalized recommendation engine and a care guide for each plant purchased."
  },
  {
    id: 3,
    title: "AI Skin Disease Detection",
    description: "Android app utilizing machine learning to detect skin diseases via camera.",
    period: "August 2023",
    image: "/project-ai.png",
    status: "On Going",
    featured: true,
    github: "https://github.com/Andikarna/AIDerma",
    demo: null,
    technologies: ["Kotlin", "TensorFlow Lite", "CameraX", "Python"],
    features: [
      "Real-time skin analysis using on-device ML models.",
      "Offline capability for remote areas.",
      "Secure patient data storage.",
      "Integration with local dermatology clinics."
    ],
    detailedDescription: "An innovative healthcare application leveraging computer vision to provide preliminary skin disease screening. The app analyzes skin lesions in real-time and provides a probability score for common conditions, helping users decide whether to seek professional medical advice. Achieved 92% accuracy in testing datasets."
  },
];
