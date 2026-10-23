export type ProjectStatus = 'Live' | 'Completed' | 'In Development';

export interface ProjectData {
  id: string;
  name: string;
  codenumber: string;
  shortDescription: string;
  fullDescription: string;
  problemSolved: string;
  technologies: string[];
  features: string[];
  status: ProjectStatus;
  githubUrl?: string;
  frontendGithubUrl?: string;
  liveDemoUrl?: string;
  category: 'Backend' | 'Full-Stack' | 'Mobile' | 'Real-time';
  hologramColor: string;
  keyHighlights: string[];
}

export const projectsData: ProjectData[] = [
  {
    id: "agrichain",
    name: "AgriChain",
    codenumber: "BAY-PRJ-01",
    shortDescription: "A farmer-focused marketplace backend supporting authenticated operations, warehouse management, and crop traceability.",
    fullDescription: "AgriChain is an end-to-end agricultural supply chain system designed to eliminate unfair intermediary markups and bring transparent price discovery to farmers. The backend service enforces secure multi-role role-based access control, batch tracking for crops from farm gate to distributor, and automated warehouse inventory allocation.",
    problemSolved: "Traditional agricultural distribution networks suffer from severe middleman exploitation, opaque pricing, inventory losses due to bad storage management, and an inability for consumers or buyers to verify crop origin and quality certifications.",
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "API Validation & Security"
    ],
    features: [
      "Role-Based Access Control (RBAC) separating Farmers, Buyers, and Warehouse Managers",
      "Direct farmer marketplace listing and bidding engine",
      "Warehouse space reservation and real-time inventory ledger",
      "End-to-end crop batch traceability with lifecycle timestamping",
      "Input sanitization, rate-limiting, and hardened JWT token authentication"
    ],
    status: "Live",
    githubUrl: "https://github.com/Abhay98-dev/AgriChain-Backend",
    frontendGithubUrl: "https://github.com/Abhay98-dev/AgriChain-frontend",
    liveDemoUrl: "https://agri-chain-frontend-five.vercel.app/",
    category: "Full-Stack",
    hologramColor: "#00f2fe",
    keyHighlights: [
      "Complete backend REST API with authenticated endpoints",
      "Live production deployment with active client",
      "Robust data modeling for dynamic order fulfillment"
    ]
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    codenumber: "BAY-PRJ-02",
    shortDescription: "An expense-tracking application demonstrating authentication, database integration, caching, and API development.",
    fullDescription: "A mobile-first personal finance platform engineered for lightning-fast transaction logging and real-time expenditure metrics. Employs distributed caching layers using Upstash Redis to achieve instantaneous response times for heavy historical aggregation queries.",
    problemSolved: "Personal expense trackers often struggle with slow mobile response times, cumbersome login friction, and lack of performant relational aggregations when querying large spending logs.",
    technologies: [
      "React Native",
      "Expo",
      "PostgreSQL",
      "Clerk",
      "Upstash Redis",
      "Node.js"
    ],
    features: [
      "Seamless authentication and biometric session handling via Clerk",
      "Sub-millisecond query caching with Upstash Redis for recurring calculations",
      "Normalized relational schema in PostgreSQL for precise financial calculations",
      "Dynamic visual categorizations and monthly budget burn-rate projections",
      "Cross-platform responsive design on iOS and Android with Expo"
    ],
    status: "Completed",
    githubUrl: "https://github.com/Abhay98-dev",
    category: "Mobile",
    hologramColor: "#38bdf8",
    keyHighlights: [
      "Upstash Redis caching integration",
      "Normalized SQL schema in PostgreSQL",
      "Cross-platform React Native / Expo front"
    ]
  },
  {
    id: "crictally",
    name: "Crictally",
    codenumber: "BAY-PRJ-03",
    shortDescription: "A cricket scoring application using a backend architecture designed around live scoring operations.",
    fullDescription: "A high-concurrency live cricket scoring engine designed to process ball-by-ball events with low latency. Engineered with an event-driven pub/sub data layer in Redis coupled with persistent relational storage in PostgreSQL and Supabase.",
    problemSolved: "Live sporting events demand instantaneous synchronization across thousands of viewers simultaneously without overwhelming traditional database transactional read/write limits during peak overs.",
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Supabase",
      "Redis"
    ],
    features: [
      "Event-driven ball-by-ball score ingestion and state recalculation",
      "Redis Pub/Sub channel distribution for live scoreboard subscribers",
      "Player career metrics, strike rate calculations, and wagon-wheel data points",
      "Supabase backend services for realtime event streaming and storage",
      "Historical match audit log and rollback safety checks"
    ],
    status: "In Development",
    githubUrl: "https://github.com/Abhay98-dev",
    category: "Real-time",
    hologramColor: "#9d4edd",
    keyHighlights: [
      "Low-latency sports scoring backend",
      "Redis pub/sub real-time event pipeline",
      "High concurrency state updates"
    ]
  },
  {
    id: "pet-adoption-portal",
    name: "Pet Adoption Portal",
    codenumber: "BAY-PRJ-04",
    shortDescription: "A pet adoption portal using server-side rendering and a backend API.",
    fullDescription: "A community pet rescue and adoption platform built using server-side rendered architectures. It combines lightweight, SEO-friendly rendering on the server with a structured backend API for shelter administrators to manage listings and triage adoption requests.",
    problemSolved: "Connecting animal rescues with caring adopters often relies on scattered social media posts without unified screening, status updates, or searchable medical and breed criteria.",
    technologies: [
      "Node.js",
      "Express",
      "MongoDB",
      "EJS"
    ],
    features: [
      "Fast server-side rendering using EJS templates for search engine visibility",
      "Shelter dashboard for pet health records, vaccination tracking, and profiles",
      "Adoption applicant verification form and status tracking pipeline",
      "Filtered query engine across breed, age bracket, personality, and location",
      "MongoDB document validation and clean RESTful API design"
    ],
    status: "Completed",
    githubUrl: "https://github.com/Abhay98-dev",
    category: "Backend",
    hologramColor: "#34d399",
    keyHighlights: [
      "Server-side rendered (SSR) EJS architecture",
      "Full REST API lifecycle",
      "MongoDB document aggregation"
    ]
  }
];
