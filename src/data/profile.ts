export interface ProfileData {
  name: string;
  callsign: string;
  titles: string[];
  roleSubtitle: string;
  tagline: string;
  bio: string;
  extendedBio: string[];
  status: string;
  shipDesignation: string;
  dockingLocation: string;
  primaryDirectives: string[];
  stats: {
    label: string;
    value: string;
    unit?: string;
  }[];
}

export const profileData: ProfileData = {
  name: "Abhay Chachar",
  callsign: "ABHAY",
  titles: [
    "Backend Developer",
    "Full-Stack Engineer",
    "AI Enthusiast"
  ],
  roleSubtitle: "BACKEND DEVELOPER | FULL-STACK ENGINEER | AI ENTHUSIAST",
  tagline: "Building scalable backends and intelligent digital experiences.",
  bio: "I'm Abhay, a computer engineering student interested in backend engineering, scalable systems, and AI-powered applications. I enjoy building practical software and exploring how complex systems work.",
  extendedBio: [
    "Specialized in architecting high-throughput REST APIs, database schemas, and microservice communication patterns using Node.js, Express, and PostgreSQL/MongoDB.",
    "Passionate about caching strategies with Redis, secure token-based authentication workflows, and containerized deployment.",
    "Actively exploring autonomous agent workflows and LLM orchestration using LangChain and Google Gemini API."
  ],
  status: "ACTIVE • AVAILABLE FOR OPPORTUNITIES",
  shipDesignation: "AV-01 EXPLORER",
  dockingLocation: "SECTOR 0x7F // EARTH ORBIT",
  primaryDirectives: [
    "Architect fault-tolerant backend services",
    "Design zero-latency data pipelines & caches",
    "Integrate intelligent AI reasoning loops",
    "Deliver production-grade full stack user experiences"
  ],
  stats: [
    { label: "Core Focus", value: "Backend & Systems" },
    { label: "Primary Runtime", value: "Node.js / TypeScript" },
    { label: "Databases", value: "PostgreSQL, MongoDB, Redis" },
    { label: "AI Stack", value: "Gemini API, LangChain" },
  ]
};
