# ABHAYVERSE // Immersive 3D Spaceship Portfolio

Welcome to **ABHAYVERSE**, a cinematic 3D sci-fi spaceship portfolio representing **Abhay Chachar** (Backend Developer | Full-Stack Engineer | AI Enthusiast), accompanied by **NOVA**, an original interactive AI robot guide.

---

## 🚀 Key Features

1. **Cinematic, Realistic Spaceship Interior (`Three.js` & `@react-three/fiber`)**
   - **Fully Enclosed Architecture:** Continuous metallic floor plating with panel seams and non-slip treads, enclosed side walls with structural pilasters, and detailed ceilings with structural transverse beams, recessed linear LED fixtures, and mechanical conduits.
   - **Panoramic Cockpit Windows:** Multi-pane viewport with titanium mullions framing outer space, including a giant ringed gas giant planet with atmospheric Fresnel glow, drifting 3D asteroid field, deep space starfield, and the starship's own exterior hull nose with navigation strobe beacons.
   - **Detailed Control Consoles:** Wall-mounted workstations and desks featuring procedural high-resolution telemetry monitors, radar sweeps, code streams, signal oscilloscopes, and illuminated keyboards.
   - **Connected Ship Layout:** Central Observation Rotunda (`HUB-00`), Forward Command Deck (`CMD-01`), Starboard Engineering Bay (`ENG-02`), Sub-Level Ship's Core (`COR-03`), Port Navigation Archive (`NAV-04`), and Aft Communications Room (`COM-05`), seamlessly connected via enclosed pressurized corridors with blast door portals.
2. **NOVA: The Original AI Robot Guide**
   - 3D animated robotic companion physically docked at a dedicated magnetic charging ring in the Central Hub.
   - Hover thrusters, gentle bobbing, head tracking, LED blinking visor eyes, and joyful spin reactions on interaction.
   - Natural language conversational HUD chatbot with realistic mock intelligence, suggested prompts, conversation clearing, and minimize/expand capabilities.
   - Structured navigation: asking NOVA about projects, skills, or contact automatically commands the starship camera to warp to that deck.
3. **5 Strategic Starship Destinations**
   - **Command Deck (Deck 1 - About Me):** Forward flight bridge with captain's helm, panoramic deep-space window, personal bio, mission directives, and resume access.
   - **Engineering Bay (Deck 2 - Featured Projects):** Industrial technical hangar with 4 dedicated holographic project consoles for **AgriChain**, **Expense Tracker**, **Crictally**, and **Pet Adoption Portal**. Click any blueprint to open the comprehensive architecture modal.
   - **Ship's Core (Deck 3 - Technical Skills):** Multi-level containment chamber with a central pulsating plasma reactor, rotating magnetic containment rings, and orbital technology nodes across Backend, Databases, Frontend, AI, and Infrastructure.
   - **Navigation Archive (Deck 4 - Education & Journey):** Astrometric starmap lab featuring a glowing celestial wireframe globe, starmap table, and timeline stelae detailing Computer Engineering education and hackathons.
   - **Communications Room (Deck 5 - Contact):** Sub-space tachyon transceiver station with quantum server blade racks, direct email, GitHub, LinkedIn, static resume download, and a transmission contact form.
4. **Procedural Audio Synthesizer (Web Audio API)**
   - UI clicks, warp whooshes, NOVA robot chirps, and hologram tones synthesized cleanly via Web Audio API with zero external audio asset dependencies.
5. **Accessibility & 2D Fallback**
   - Instant toggle between the 3D Starship and a high-readability 2D Portfolio mode.
   - Auto-fallback to 2D view if WebGL is unavailable.
   - Full reduced-motion toggle support.
6. **Future-Proof Backend Architecture**
   - Clean service abstraction layer (`NovaService` and `IPortfolioService`).
   - Mock services with realistic delays and structured action payloads.
   - [`API_INTEGRATION_SPEC.md`](./API_INTEGRATION_SPEC.md) documenting every endpoint for future backend development.

---

## 🛠️ Technology Stack

- **Framework:** React 18 & Vite
- **Language:** TypeScript (strict mode)
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
- **Animations:** GSAP (cinematic camera curves) & Framer Motion (HUD micro-interactions)
- **Styling:** Tailwind CSS & Custom Sci-Fi Glassmorphism
- **Icons:** Lucide React
- **Audio:** Native Web Audio API Procedural Synthesizer
- **Testing:** Vitest

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Run Production Build & Typecheck
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Run Verification Test Suite
```bash
npm test
```
