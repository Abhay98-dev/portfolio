# ABHAYVERSE // API INTEGRATION SPECIFICATION
**Version:** 1.0.0  
**Target Environment:** Node.js / Express / Supabase / Gemini AI Backend  
**Frontend Client:** React 18 + Vite + TypeScript + Three.js + React Three Fiber  
**Author:** Abhayverse Frontend Architecture  

---

## 1. Executive Summary

This document specifies the exact contract required by the **ABHAYVERSE** frontend for future backend development. 

The frontend has been built strictly with **zero backend dependencies**, utilizing TypeScript data modules and a dedicated mock service (`NovaMockService` in `src/features/nova/novaMockService.ts` and `MockPortfolioService` in `src/services/portfolioService.ts`). 

When developing the backend:
1. Implement the endpoints described below.
2. Define `VITE_API_BASE_URL` in a `.env` file (e.g., `http://localhost:5000/api`).
3. Replace the mock service instances with standard `fetch`/`axios` calls following the provided schema without touching the UI, Three.js 3D scene, or navigation components.

---

## 2. API Endpoints Overview

| # | Endpoint Name | Method | Suggested Path | Priority | Frontend Consumer | Fallback if Offline |
|---|---|---|---|---|---|---|
| **1** | NOVA Chatbot Completion | `POST` | `/api/chat` | **Required** (for live AI) | `NovaChat.tsx` (`novaService.ts`) | Degrades to onboard mock pattern matcher |
| **2** | Portfolio Profile | `GET` | `/api/portfolio/profile` | Optional | `DestinationHudOverlay` (Command Deck) | Resolves local `src/data/profile.ts` |
| **3** | Projects Catalog | `GET` | `/api/portfolio/projects` | Optional | `DestinationHudOverlay` (Engineering Bay) | Resolves local `src/data/projects.ts` |
| **4** | Project Details by ID | `GET` | `/api/portfolio/projects/:id` | Optional | `ProjectDetailModal.tsx` | Resolves local project entry |
| **5** | Technical Skills Matrix | `GET` | `/api/portfolio/skills` | Optional | `DestinationHudOverlay` (Ship's Core) | Resolves local `src/data/skills.ts` |
| **6** | Education & Journey | `GET` | `/api/portfolio/education` | Optional | `DestinationHudOverlay` (Nav Archive) | Resolves local `src/data/education.ts` |
| **7** | Milestones & Achievements | `GET` | `/api/portfolio/achievements` | Optional | `DestinationHudOverlay` (Nav Archive) | Resolves local `src/data/achievements.ts` |
| **8** | Contact Message Transmission | `POST` | `/api/contact` | **Recommended** | `DestinationHudOverlay` (Comms Room) | Local mock confirmation feedback |
| **9** | Static Resume File | `GET` | `/resume.pdf` | **Static Asset** | Direct Browser Download Link | Local `/public/resume.pdf` |

---

## 3. Detailed Endpoint Specifications

---

### Endpoint 1: NOVA Chatbot Interaction

#### 1. Endpoint Name
NOVA Conversational Assistant & Ship Navigator

#### 2. HTTP Method
`POST`

#### 3. Suggested URL Path
`/api/chat`

#### 4. Purpose
Sends a visitor's natural language message to the backend LLM (e.g., Google Gemini 1.5 Flash/Pro or LangChain chain) and receives a friendly, in-character robot response along with an optional **structured navigation action** that commands the starship camera to travel to the requested deck.

#### 5. Required or Optional
**Required** to enable real-time generative AI intelligence. If the backend is unavailable or unconfigured, the frontend automatically falls back to `NovaMockService`.

#### 6. Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### 7. Request Body Schema
```typescript
interface ChatRequest {
  message: string;                      // User prompt (1 - 1000 characters)
  conversationId?: string;             // Optional UUID for session tracking
  currentDestination?: 'hub' | 'about' | 'projects' | 'skills' | 'education' | 'contact';
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

#### 8. Example Request
```json
{
  "message": "Can you show me AgriChain and what problem it solves?",
  "conversationId": "sess_8f2940a1-c241-419b-a0d3",
  "currentDestination": "hub",
  "history": [
    {
      "role": "assistant",
      "content": "Welcome aboard! I'm NOVA, your onboard guide."
    }
  ]
}
```

#### 9. Successful Response Schema (HTTP 200 OK)
```typescript
interface ChatResponse {
  success: boolean;
  data: {
    assistantMessage: string;            // NOVA's spoken dialogue
    actionType: 'navigate' | 'open_project' | 'show_skills' | 'download_resume' | 'contact_form' | 'none';
    destination?: 'hub' | 'about' | 'projects' | 'skills' | 'education' | 'contact';
    projectId?: 'agrichain' | 'expense-tracker' | 'crictally' | 'pet-adoption-portal';
    suggestedFollowUps?: string[];
    quickActions?: Array<{
      id: string;
      label: string;
      actionType: string;
      targetDestination?: string;
      targetProjectId?: string;
      url?: string;
    }>;
    executionStatus: 'success' | 'clarification_needed' | 'unrecognized';
  };
}
```

#### 10. Example Successful Response
```json
{
  "success": true,
  "data": {
    "assistantMessage": "AgriChain is an agricultural marketplace backend that connects farmers directly with buyers and warehouses. Setting coordinates for the Engineering Bay to display its blueprints!",
    "actionType": "open_project",
    "destination": "projects",
    "projectId": "agrichain",
    "suggestedFollowUps": [
      "Show backend skills.",
      "Tell me about Crictally.",
      "Take me to the contact section."
    ],
    "quickActions": [
      {
        "id": "qa-live",
        "label": "Open Live Web App",
        "actionType": "none",
        "url": "https://agri-chain-frontend-five.vercel.app/"
      }
    ],
    "executionStatus": "success"
  }
}
```

#### 11. Error Response Schema (HTTP 400 / 500)
```json
{
  "success": false,
  "error": {
    "code": "AI_GENERATION_FAILED",
    "message": "NOVA's neural relays encountered an unexpected timeout.",
    "details": "Upstream Gemini model rate limit exceeded."
  }
}
```

#### 12. Loading & Timeout Behavior
- **Timeout:** 10,000 ms.
- **Frontend Behavior:** While awaiting response, `NovaChat.tsx` renders a pulsing 3-dot cyan typing indicator.
- **On Timeout:** Frontend logs a warning and displays: `"I encountered a minor comms glitch. Please try asking again."`

#### 13. Frontend Navigation Action Validation
The frontend strictly validates all returned `destination` strings against the allowed whitelist (`hub`, `about`, `projects`, `skills`, `education`, `contact`). If an invalid destination string is returned, the frontend ignores the camera movement and renders only the message text.

#### 14. Frontend Consumer
- `src/features/nova/NovaChat.tsx` via `src/features/nova/novaService.ts`

#### 15. Can Frontend Function Without It?
**Yes.** The frontend is fully operational using `NovaMockService`.

---

### Endpoint 2: Portfolio Profile

#### 1. Endpoint Name
Retrieve Starship Command Profile

#### 2. HTTP Method
`GET`

#### 3. Suggested URL Path
`/api/portfolio/profile`

#### 4. Purpose
Returns Abhay's professional summary, engineering directives, titles, and live telemetry stats if managed dynamically in a CMS or database.

#### 5. Required or Optional
**Optional.** The frontend defaults to `src/data/profile.ts`.

#### 6. Request Headers
`Accept: application/json`

#### 7. Request Body Schema
*None (GET request)*

#### 8. Example Request
`GET /api/portfolio/profile HTTP/1.1`

#### 9. Successful Response Schema (HTTP 200 OK)
```typescript
interface ProfileResponse {
  success: boolean;
  data: {
    name: string;
    callsign: string;
    titles: string[];
    roleSubtitle: string;
    tagline: string;
    bio: string;
    extendedBio: string[];
    status: string;
    stats: Array<{ label: string; value: string }>;
  };
}
```

#### 10. Example Successful Response
```json
{
  "success": true,
  "data": {
    "name": "Abhay Chachar",
    "callsign": "ABHAY",
    "titles": [
      "Backend Developer",
      "Full-Stack Engineer",
      "AI Enthusiast"
    ],
    "roleSubtitle": "BACKEND DEVELOPER | FULL-STACK ENGINEER | AI ENTHUSIAST",
    "tagline": "Building scalable backends and intelligent digital experiences.",
    "bio": "I'm Abhay, a computer engineering student interested in backend engineering, scalable systems, and AI-powered applications. I enjoy building practical software and exploring how complex systems work.",
    "extendedBio": [
      "Specialized in architecting high-throughput REST APIs, database schemas, and microservice communication patterns."
    ],
    "status": "ACTIVE • AVAILABLE FOR OPPORTUNITIES",
    "stats": [
      { "label": "Core Focus", "value": "Backend & Systems" },
      { "label": "Primary Runtime", "value": "Node.js / TypeScript" }
    ]
  }
}
```

#### 11. Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Unable to retrieve command profile data."
  }
}
```

#### 12. Loading & Timeout
- **Timeout:** 5,000 ms.
- **Frontend Behavior:** SWR or local fallback cache.

#### 13. Validation Requirements
- `name` and `bio` must be non-empty strings.

#### 14. Frontend Consumer
- `src/services/portfolioService.ts` called by `DestinationHudOverlay.tsx` and `FallbackView.tsx`.

#### 15. Can Frontend Function Without It?
**Yes.** Defaults to `src/data/profile.ts`.

---

### Endpoint 3: Projects Catalog

#### 1. Endpoint Name
List Engineering Bay Projects

#### 2. HTTP Method
`GET`

#### 3. Suggested URL Path
`/api/portfolio/projects`

#### 4. Purpose
Returns all featured engineering projects (AgriChain, Expense Tracker, Crictally, Pet Adoption Portal) with full technical specifications, problem statements, repository links, and live URLs.

#### 5. Required or Optional
**Optional.**

#### 6. Request Headers
`Accept: application/json`

#### 7. Query Parameters (Optional)
- `category`: Filter by `'Full-Stack' | 'Backend' | 'Mobile' | 'Real-time'`
- `status`: Filter by `'Live' | 'Completed' | 'In Development'`

#### 8. Example Request
`GET /api/portfolio/projects?category=Full-Stack HTTP/1.1`

#### 9. Successful Response Schema (HTTP 200 OK)
```typescript
interface ProjectsResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    codenumber: string;
    shortDescription: string;
    fullDescription: string;
    problemSolved: string;
    technologies: string[];
    features: string[];
    status: 'Live' | 'Completed' | 'In Development';
    githubUrl?: string;
    frontendGithubUrl?: string;
    liveDemoUrl?: string;
    category: 'Backend' | 'Full-Stack' | 'Mobile' | 'Real-time';
    keyHighlights: string[];
  }>;
}
```

#### 10. Example Successful Response
```json
{
  "success": true,
  "data": [
    {
      "id": "agrichain",
      "name": "AgriChain",
      "codenumber": "BAY-PRJ-01",
      "shortDescription": "A farmer-focused marketplace backend supporting authenticated operations, warehouse management, and crop traceability.",
      "fullDescription": "AgriChain is an end-to-end agricultural supply chain system designed to eliminate unfair intermediary markups...",
      "problemSolved": "Traditional agricultural distribution networks suffer from severe middleman exploitation and lack of traceability.",
      "technologies": ["Node.js", "Express.js", "MongoDB", "JWT", "API Validation & Security"],
      "features": [
        "Role-Based Access Control separating Farmers, Buyers, and Warehouse Managers",
        "Direct farmer marketplace listing and bidding engine",
        "Warehouse space reservation and real-time inventory ledger"
      ],
      "status": "Live",
      "githubUrl": "https://github.com/Abhay98-dev/AgriChain-Backend",
      "frontendGithubUrl": "https://github.com/Abhay98-dev/AgriChain-frontend",
      "liveDemoUrl": "https://agri-chain-frontend-five.vercel.app/",
      "category": "Full-Stack",
      "keyHighlights": [
        "Complete backend REST API with authenticated endpoints",
        "Live production deployment with active client"
      ]
    }
  ]
}
```

#### 11. Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "PROJECTS_FETCH_ERROR",
    "message": "Failed to query project database."
  }
}
```

#### 12. Loading & Timeout
- **Timeout:** 6,000 ms.
- **Frontend Consumer:** `ProjectDetailModal.tsx`, `DestinationHudOverlay.tsx`.

#### 13. Can Frontend Function Without It?
**Yes.** Defaults to `src/data/projects.ts`.

---

### Endpoint 4: Technical Skills Matrix

#### 1. Endpoint Name
Retrieve Reactor Core Technical Skills

#### 2. HTTP Method
`GET`

#### 3. Suggested URL Path
`/api/portfolio/skills`

#### 4. Purpose
Retrieves categorized technical competencies across Backend, Databases, Frontend, AI, and DevOps.

#### 5. Required or Optional
**Optional.**

#### 6. Request Headers
`Accept: application/json`

#### 7. Example Request
`GET /api/portfolio/skills HTTP/1.1`

#### 8. Successful Response Schema (HTTP 200 OK)
```typescript
interface SkillsResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    coreRole: string;
    energySignature: string;
    accentColor: string;
    description: string;
    skills: Array<{
      name: string;
      description: string;
      usedInProjects: string[];
    }>;
  }>;
}
```

#### 9. Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "SKILLS_UNAVAILABLE",
    "message": "Skill core data offline."
  }
}
```

#### 10. Can Frontend Function Without It?
**Yes.** Defaults to `src/data/skills.ts`.

---

### Endpoint 5: Education & Achievements

#### 1. Endpoint Name
Navigation Archive Records

#### 2. HTTP Method
`GET`

#### 3. Suggested URL Paths
- `/api/portfolio/education`
- `/api/portfolio/achievements`

#### 4. Purpose
Retrieves academic history (Computer Engineering degree, coursework) and confirmed technical milestones/hackathons.

#### 5. Required or Optional
**Optional.**

#### 6. Successful Response Example (`/api/portfolio/education`)
```json
{
  "success": true,
  "data": [
    {
      "id": "eng-degree",
      "degree": "Bachelor of Engineering (B.E.) in Computer Engineering",
      "institution": "University Engineering Institute",
      "location": "India",
      "duration": "2022 — Present",
      "graduationYear": "Expected 2026",
      "status": "Active / Undergraduate",
      "coursework": [
        "Data Structures & Algorithms",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks"
      ]
    }
  ]
}
```

#### 7. Can Frontend Function Without It?
**Yes.** Defaults to `src/data/education.ts` and `src/data/achievements.ts`.

---

### Endpoint 6: Quantum Contact Form Submission

#### 1. Endpoint Name
Dispatch Sub-Space Message

#### 2. HTTP Method
`POST`

#### 3. Suggested URL Path
`/api/contact`

#### 4. Purpose
Receives messages from the Communications Room contact form and transmits them via email (e.g., Nodemailer, SendGrid, or Resend) to `abhaychachar98@gmail.com`.

#### 5. Required or Optional
**Recommended.** The frontend currently provides a simulated transmission acknowledgment.

#### 6. Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### 7. Request Body Schema
```typescript
interface ContactSubmissionPayload {
  name: string;         // Required: 2 - 100 characters
  email: string;        // Required: Valid email format
  subject?: string;     // Optional
  message: string;      // Required: 10 - 5000 characters
}
```

#### 8. Example Request
```json
{
  "name": "Sarah Connor",
  "email": "sarah@cyberdyne.org",
  "subject": "Backend Engineering Collaboration",
  "message": "Hi Abhay, I reviewed your AgriChain and Crictally repositories and would like to discuss a backend opportunity."
}
```

#### 9. Successful Response Schema (HTTP 201 Created)
```json
{
  "success": true,
  "data": {
    "messageId": "TX-9K38FA",
    "status": "sent",
    "timestamp": "2026-10-23T12:00:00.000Z",
    "feedbackNote": "Transmission successfully relayed to Abhay Chachar."
  }
}
```

#### 10. Error Response Schema (HTTP 422 Unprocessable Entity / HTTP 429 Too Many Requests)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please provide a valid sender email and message payload.",
    "details": {
      "field": "email",
      "rule": "isEmail"
    }
  }
}
```

#### 11. Rate Limiting & Security Considerations
- **Rate Limit:** 5 requests per IP per 10 minutes to prevent spam.
- **Bot Defense:** Add honeypot field or Cloudflare Turnstile token validation.

#### 12. Frontend Consumer
- `DestinationHudOverlay.tsx` and `FallbackView.tsx` via `portfolioService.submitContactMessage()`.

---

### Endpoint 7: Resume Delivery

#### 1. Delivery Strategy: Static File vs API
**Recommended:** Static file delivery via standard HTTP `GET /resume.pdf`.

#### 2. Rationale
A resume is a public, static document. Serving it as a static asset (`/resume.pdf` located in `/public/resume.pdf`) provides:
- Zero backend overhead.
- Instant CDN caching via Cloudflare / Vercel.
- Native browser PDF rendering and downloads.
- Reliable offline access.

An API endpoint for the resume is unnecessary unless dynamic access control or per-download watermarking is explicitly desired.

---

## 4. Frontend Files to Modify for Backend Integration

When your backend server is ready, make changes **only** to these two files:

### 1. `src/services/apiClient.ts`
Set `isMockMode: false` and point to your base URL:
```typescript
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeoutMs: 8000,
  isMockMode: false,
};
```

### 2. `src/features/nova/novaService.ts`
Create an HTTP client class that calls `POST /api/chat` and export it:
```typescript
class HttpNovaService implements NovaService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const res = await fetch(`${API_CONFIG.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const json = await res.json();
    return json.data;
  }
  // ...
}

export const novaService: NovaService = new HttpNovaService();
```

No 3D components, HUD overlays, or navigation logic need to be modified.
