export interface MilestoneItem {
  id: string;
  category: 'Milestone' | 'Hackathon' | 'Certification';
  title: string;
  organizationOrEvent: string;
  dateOrYear: string;
  badge: string;
  description: string;
  coordinates: string;
}

export const achievementsData: MilestoneItem[] = [
  {
    id: "m-01",
    category: "Milestone",
    title: "Production Deployment of AgriChain Platform",
    organizationOrEvent: "Independent Engineering Initiative",
    dateOrYear: "2024",
    badge: "FULL-STACK SHIPMENT",
    description: "Architected, documented, and shipped a live multi-role agricultural supply chain backend and frontend with live crop tracking and warehouse storage allocations.",
    coordinates: "STAR-POINT 01 // 342.18°"
  },
  {
    id: "m-02",
    category: "Milestone",
    title: "High-Concurrency Caching Engine with Redis",
    organizationOrEvent: "Backend Systems Development",
    dateOrYear: "2024",
    badge: "SYSTEM PERFORMANCE",
    description: "Implemented low-latency query caching and pub/sub event channels in Redis for Crictally and Expense Tracker, reducing redundant SQL read loads.",
    coordinates: "STAR-POINT 02 // 118.42°"
  },
  {
    id: "m-03",
    category: "Hackathon",
    title: "Competitive Hackathon Builder & Problem Solver",
    organizationOrEvent: "Engineering Tech Hackathons",
    dateOrYear: "2023 — 2024",
    badge: "RAPID PROTOTYPING",
    description: "Participated in university and national-level hackathons focusing on building scalable software solutions under rapid 24-48 hour constraints.",
    coordinates: "STAR-POINT 03 // 074.91°"
  },
  {
    id: "m-04",
    category: "Certification",
    title: "Core Computer Science & Systems Specialization",
    organizationOrEvent: "Academic & Professional Coursework",
    dateOrYear: "2023 — 2024",
    badge: "SYSTEMS MASTERY",
    description: "Completed rigorous coursework in Database Systems, RESTful API architecture, Asynchronous JavaScript/Node.js, and Data Structures.",
    coordinates: "STAR-POINT 04 // 215.65°"
  }
];
