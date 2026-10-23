export interface SkillCategory {
  id: string;
  name: string;
  coreRole: string;
  energySignature: string;
  accentColor: string;
  description: string;
  skills: {
    name: string;
    description: string;
    usedInProjects: string[];
  }[];
}

export const skillsData: SkillCategory[] = [
  {
    id: "backend",
    name: "Backend Architecture",
    coreRole: "Primary Engine Core",
    energySignature: "THERMAL-ION 98.4%",
    accentColor: "#00f2fe",
    description: "Designing resilient server-side applications, modular microservices, RESTful interfaces, and hardened security layers.",
    skills: [
      {
        name: "Node.js",
        description: "Event-driven asynchronous I/O runtime powering high-concurrency microservices and real-time socket processing.",
        usedInProjects: ["AgriChain", "Expense Tracker", "Crictally", "Pet Adoption Portal"]
      },
      {
        name: "Express.js",
        description: "Minimalist, robust web routing framework for scalable API layers, custom middlewares, and route guards.",
        usedInProjects: ["AgriChain", "Crictally", "Pet Adoption Portal"]
      },
      {
        name: "REST APIs",
        description: "Resource-oriented HTTP architectures featuring clean semantic endpoints, pagination, and unified error contracts.",
        usedInProjects: ["AgriChain", "Expense Tracker", "Crictally"]
      },
      {
        name: "Authentication & JWT",
        description: "Stateless JSON Web Tokens, refresh token rotation, password hashing with bcrypt, and RBAC authorization policies.",
        usedInProjects: ["AgriChain", "Expense Tracker"]
      },
      {
        name: "API Security & Validation",
        description: "Payload sanitization, rate-limiting, CORS configuration, helmet headers, and schema validation with Zod/Joi.",
        usedInProjects: ["AgriChain", "Crictally"]
      }
    ]
  },
  {
    id: "databases",
    name: "Databases & Caching",
    coreRole: "Memory Matrix Array",
    energySignature: "PLASMA-FLUX 96.1%",
    accentColor: "#38bdf8",
    description: "Relational and document database design, query optimization, indexing strategies, and distributed in-memory caching.",
    skills: [
      {
        name: "PostgreSQL",
        description: "ACID-compliant relational database management, schema normalization, complex SQL joins, and relational integrity.",
        usedInProjects: ["Expense Tracker", "Crictally"]
      },
      {
        name: "MongoDB",
        description: "NoSQL document store leveraging flexible BSON schemas, pipeline aggregations, and embedded relationship modeling.",
        usedInProjects: ["AgriChain", "Pet Adoption Portal"]
      },
      {
        name: "Redis",
        description: "In-memory key-value data store used for sub-millisecond query caching, rate-limiting counters, and Pub/Sub event streams.",
        usedInProjects: ["Expense Tracker", "Crictally"]
      }
    ]
  },
  {
    id: "frontend",
    name: "Frontend & Mobile",
    coreRole: "Holographic Visor",
    energySignature: "PHOTON-LATTICE 94.8%",
    accentColor: "#818cf8",
    description: "Building responsive, modern web interfaces and cross-platform mobile applications with clean state management.",
    skills: [
      {
        name: "React",
        description: "Declarative component-based UI engineering with modern React hooks, context patterns, and virtual DOM diffing.",
        usedInProjects: ["AgriChain Frontend", "ABHAYVERSE Portfolio"]
      },
      {
        name: "React Native & Expo",
        description: "Cross-platform native mobile application development sharing a single TypeScript codebase for iOS and Android.",
        usedInProjects: ["Expense Tracker"]
      },
      {
        name: "TypeScript",
        description: "Strict static typing system ensuring end-to-end type safety, robust refactoring, and clear interface contracts.",
        usedInProjects: ["ABHAYVERSE Portfolio", "Expense Tracker"]
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework enabling high-speed design implementation, responsive layouts, and modern dark-mode palettes.",
        usedInProjects: ["ABHAYVERSE Portfolio", "AgriChain Frontend"]
      }
    ]
  },
  {
    id: "ai",
    name: "AI & Intelligent Systems",
    coreRole: "Neural Cybernetics",
    energySignature: "QUANTUM-SYNAPSE 92.5%",
    accentColor: "#c084fc",
    description: "Exploring LLM agent orchestration, prompt engineering, semantic retrieval, and structured generative AI workflows.",
    skills: [
      {
        name: "LangChain",
        description: "Framework for composable LLM chains, agentic workflows, memory persistence, and dynamic tool calling.",
        usedInProjects: ["Autonomous AI Experiments"]
      },
      {
        name: "Google Gemini API",
        description: "Multimodal and reasoning API integration for structured JSON output, fast semantic synthesis, and context-aware agents.",
        usedInProjects: ["NOVA Intelligent Guide (Planned Backend Integration)"]
      }
    ]
  },
  {
    id: "infrastructure",
    name: "DevOps & Infrastructure",
    coreRole: "Hull Integrity & Deployment",
    energySignature: "MAGNETIC-SHIELD 95.0%",
    accentColor: "#34d399",
    description: "Version control workflows, continuous integration, production environment management, and cloud deployments.",
    skills: [
      {
        name: "Git",
        description: "Distributed version control system, branching strategies, rebasing, and atomic commit practices.",
        usedInProjects: ["All Repositories"]
      },
      {
        name: "GitHub",
        description: "Collaborative repository hosting, code review pull requests, issue tracking, and GitHub Actions CI/CD pipeline triggers.",
        usedInProjects: ["AgriChain", "Expense Tracker", "Crictally"]
      },
      {
        name: "Deployment & Cloud Hosting",
        description: "Deploying production applications to Vercel, Render, Supabase, and container-ready environments with environment variable protection.",
        usedInProjects: ["AgriChain Frontend", "ABHAYVERSE"]
      }
    ]
  }
];
