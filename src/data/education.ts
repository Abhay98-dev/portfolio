export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  graduationYear: string;
  status: string;
  focusAreas: string[];
  coursework: string[];
  starSector: string;
}

export const educationData: EducationItem[] = [
  {
    id: "eng-degree",
    degree: "Bachelor of Engineering (B.E.) in Computer Engineering",
    institution: "University Engineering Institute",
    location: "India",
    duration: "2022 — Present",
    graduationYear: "Expected 2026",
    status: "Active / Undergraduate",
    focusAreas: [
      "Backend Architecture & Distributed Computing",
      "Database Management Systems & Relational Schema Design",
      "Operating Systems, Concurrency & Networking Protocols",
      "Data Structures & Algorithmic Optimization"
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering & Architecture",
      "Object-Oriented Programming"
    ],
    starSector: "ALPHA-SECTOR // CORE ACADEMIA"
  }
];
