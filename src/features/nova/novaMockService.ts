import {
  ChatRequest,
  ChatResponse,
  ChatMessage,
  NovaService,
} from './novaTypes';

export class NovaMockService implements NovaService {
  private suggestedPrompts = [
    "Introduce Abhay.",
    "Show me the projects.",
    "Explain AgriChain.",
    "Show backend skills.",
    "Take me to the contact section."
  ];

  public getSuggestedPrompts(): string[] {
    return this.suggestedPrompts;
  }

  public async getInitialGreeting(): Promise<ChatMessage> {
    return {
      id: 'nova-greet-0',
      sender: 'nova',
      text: "Welcome aboard! I'm NOVA, your onboard guide. You can explore the ship yourself or ask me to show you around.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionType: 'none',
      isSimulatedAi: true,
      quickActions: [
        {
          id: 'qa-projects',
          label: 'Show Featured Projects',
          actionType: 'navigate',
          targetDestination: 'projects',
        },
        {
          id: 'qa-skills',
          label: 'Inspect Skill Core',
          actionType: 'navigate',
          targetDestination: 'skills',
        },
        {
          id: 'qa-about',
          label: 'Command Deck Profile',
          actionType: 'navigate',
          targetDestination: 'about',
        },
      ],
    };
  }

  public async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const rawMsg = request.message.trim().toLowerCase();
    
    // Simulate short realistic delay (400-650ms)
    const simulatedDelay = 450 + Math.floor(Math.random() * 200);
    await new Promise((resolve) => setTimeout(resolve, simulatedDelay));

    if (rawMsg.includes('close this panel') || rawMsg.includes('close panel')) {
      return { assistantMessage: 'Closing the room information panel.', actionType: 'close_panel', executionStatus: 'success' };
    }
    if (rawMsg.includes('inside the spaceship') || rawMsg.includes('enter the spaceship') || rawMsg.includes('take me inside')) {
      return { assistantMessage: 'Welcome aboard. Setting course for the Command Deck.', actionType: 'navigate', destination: 'about', executionStatus: 'success' };
    }
    if (rawMsg.includes('outside') || rawMsg.includes('back to space')) {
      return { assistantMessage: 'Returning to the exterior Central Hub.', actionType: 'navigate', destination: 'hub', executionStatus: 'success' };
    }
    if (rawMsg.includes('technolog')) {
      return { assistantMessage: "Opening the Ship's Core technology details.", actionType: 'show_skills', destination: 'skills', executionStatus: 'success' };
    }

    // 1. Projects & Work Navigation
    if (
      rawMsg.includes('project') || 
      rawMsg.includes('work') || 
      rawMsg.includes('portfolio') ||
      rawMsg.includes('engineering bay')
    ) {
      if (rawMsg.includes('agrichain') || rawMsg.includes('agri')) {
        return {
          assistantMessage: "AgriChain is a farmer-focused marketplace backend supporting authenticated marketplace operations, warehouse management, and crop traceability. Opening its holographic blueprint now!",
          actionType: 'open_project',
          destination: 'projects',
          projectId: 'agrichain',
          suggestedFollowUps: ["Show backend skills", "Tell me about Crictally", "Take me to contact"],
          executionStatus: 'success',
          quickActions: [
            {
              id: 'qa-agri-open',
              label: 'Open AgriChain Specs',
              actionType: 'open_project',
              targetProjectId: 'agrichain',
            },
            {
              id: 'qa-agri-live',
              label: 'View Live Web Demo',
              actionType: 'none',
              url: 'https://agri-chain-frontend-five.vercel.app/',
            }
          ]
        };
      }

      if (rawMsg.includes('expense') || rawMsg.includes('tracker')) {
        return {
          assistantMessage: "Expense Tracker is a mobile finance application featuring React Native, PostgreSQL, Clerk auth, and Upstash Redis caching for low-latency queries.",
          actionType: 'open_project',
          destination: 'projects',
          projectId: 'expense-tracker',
          suggestedFollowUps: ["Explain AgriChain", "Show backend skills", "Go to Engineering Bay"],
          executionStatus: 'success',
          quickActions: [
            {
              id: 'qa-exp-open',
              label: 'Inspect Expense Tracker',
              actionType: 'open_project',
              targetProjectId: 'expense-tracker',
            }
          ]
        };
      }

      if (rawMsg.includes('crictally') || rawMsg.includes('cricket')) {
        return {
          assistantMessage: "Crictally is an in-development live cricket scoring backend built on Node.js, Express, PostgreSQL, Supabase, and Redis for high-concurrency state ingestion.",
          actionType: 'open_project',
          destination: 'projects',
          projectId: 'crictally',
          suggestedFollowUps: ["Explain AgriChain", "Show skills", "Go to Engineering Bay"],
          executionStatus: 'success',
          quickActions: [
            {
              id: 'qa-cric-open',
              label: 'View Crictally Specs',
              actionType: 'open_project',
              targetProjectId: 'crictally',
            }
          ]
        };
      }

      if (rawMsg.includes('pet') || rawMsg.includes('adoption')) {
        return {
          assistantMessage: "The Pet Adoption Portal uses server-side rendering (SSR with EJS) backed by Node.js, Express, and MongoDB document schemas.",
          actionType: 'open_project',
          destination: 'projects',
          projectId: 'pet-adoption-portal',
          suggestedFollowUps: ["Show other projects", "Show backend skills"],
          executionStatus: 'success',
        };
      }

      return {
        assistantMessage: "Of course! Follow me to the Engineering Bay to inspect Abhay's featured projects: AgriChain, Expense Tracker, Crictally, and Pet Adoption Portal.",
        actionType: 'navigate',
        destination: 'projects',
        suggestedFollowUps: ["Explain AgriChain", "Show backend skills", "Tell me about Crictally"],
        executionStatus: 'success',
        quickActions: [
          {
            id: 'qa-agri',
            label: 'Explain AgriChain',
            actionType: 'open_project',
            targetProjectId: 'agrichain',
          },
          {
            id: 'qa-exp',
            label: 'Inspect Expense Tracker',
            actionType: 'open_project',
            targetProjectId: 'expense-tracker',
          }
        ]
      };
    }

    // 2. Specific project inquiries
    if (rawMsg.includes('agrichain') || rawMsg.includes('agri')) {
      return {
        assistantMessage: "AgriChain is a farmer-focused marketplace backend supporting authenticated marketplace operations, warehouse management, and crop traceability. Would you like to inspect its features?",
        actionType: 'open_project',
        destination: 'projects',
        projectId: 'agrichain',
        suggestedFollowUps: ["Show other projects", "Show backend skills", "Take me to contact"],
        executionStatus: 'success',
        quickActions: [
          {
            id: 'qa-agri-open',
            label: 'Open Full Specs',
            actionType: 'open_project',
            targetProjectId: 'agrichain',
          }
        ]
      };
    }

    // 3. Technical Skills & Core Inquiries
    if (
      rawMsg.includes('skill') || 
      rawMsg.includes('tech') || 
      rawMsg.includes('backend') || 
      rawMsg.includes('database') ||
      rawMsg.includes('stack') ||
      rawMsg.includes('core')
    ) {
      return {
        assistantMessage: "Rerouting power to the Ship's Core! Here you can examine Abhay's technical proficiencies across Backend (Node.js, Express, REST APIs, Security), Databases (PostgreSQL, MongoDB, Redis), AI (LangChain, Gemini API), and Infrastructure.",
        actionType: 'navigate',
        destination: 'skills',
        suggestedFollowUps: ["Show me the projects", "Explain AgriChain", "Go to Command Deck"],
        executionStatus: 'success',
      };
    }

    // 4. About / Who is Abhay / Command Deck
    if (
      rawMsg.includes('introduce') || 
      rawMsg.includes('who') || 
      rawMsg.includes('about') || 
      rawMsg.includes('command') || 
      rawMsg.includes('bio')
    ) {
      return {
        assistantMessage: "Setting heading to the Command Deck. Abhay is a computer engineering student interested in backend engineering, scalable systems, and AI-powered applications. He enjoys building practical software and exploring how complex systems work.",
        actionType: 'navigate',
        destination: 'about',
        suggestedFollowUps: ["Show me the projects", "Show backend skills", "Take me to contact"],
        executionStatus: 'success',
      };
    }

    // 5. Contact & Communications
    if (
      rawMsg.includes('contact') || 
      rawMsg.includes('email') || 
      rawMsg.includes('reach') || 
      rawMsg.includes('hire') || 
      rawMsg.includes('linkedin') ||
      rawMsg.includes('github')
    ) {
      return {
        assistantMessage: "Opening quantum communications terminal! You can send Abhay an email, review his GitHub repositories, connect on LinkedIn, or download his resume.",
        actionType: 'navigate',
        destination: 'contact',
        suggestedFollowUps: ["Download resume", "Show me the projects", "Introduce Abhay"],
        executionStatus: 'success',
        quickActions: [
          {
            id: 'qa-github',
            label: 'Visit GitHub',
            actionType: 'none',
            url: 'https://github.com/Abhay98-dev',
          },
          {
            id: 'qa-resume',
            label: 'Download Resume',
            actionType: 'download_resume',
          }
        ]
      };
    }

    // 6. Resume
    if (rawMsg.includes('resume') || rawMsg.includes('cv')) {
      return {
        assistantMessage: "You can download Abhay's resume directly from the ship's communications array or via the direct download link.",
        actionType: 'download_resume',
        destination: 'contact',
        suggestedFollowUps: ["Show backend skills", "Show me the projects"],
        executionStatus: 'success',
        quickActions: [
          {
            id: 'qa-dl',
            label: 'Download Resume (PDF)',
            actionType: 'download_resume',
            url: '/resume.pdf'
          }
        ]
      };
    }

    // 7. Education & Achievements & Starmap
    if (
      rawMsg.includes('education') || 
      rawMsg.includes('study') || 
      rawMsg.includes('degree') || 
      rawMsg.includes('archive') || 
      rawMsg.includes('achievement') || 
      rawMsg.includes('hackathon') ||
      rawMsg.includes('milestone')
    ) {
      return {
        assistantMessage: "Transferring to the Navigation Archive. Here you will find Abhay's academic credentials in Computer Engineering, system milestones, and hackathon accomplishments.",
        actionType: 'navigate',
        destination: 'education',
        suggestedFollowUps: ["Show me the projects", "Show backend skills", "Take me to contact"],
        executionStatus: 'success',
      };
    }

    // 8. Return to Hub
    if (rawMsg.includes('hub') || rawMsg.includes('home') || rawMsg.includes('center')) {
      return {
        assistantMessage: "Returning to the Central Observation Rotunda. All five starship corridors are accessible from here.",
        actionType: 'navigate',
        destination: 'hub',
        suggestedFollowUps: ["Introduce Abhay.", "Show me the projects.", "Show backend skills."],
        executionStatus: 'success',
      };
    }

    // Default polite simulation response
    return {
      assistantMessage: `I heard you ask: "${request.message}". As your onboard guide, I can navigate you to the Command Deck (About), Engineering Bay (Projects), Ship's Core (Skills), Navigation Archive (Education), or Communications (Contact). Where would you like to travel?`,
      actionType: 'none',
      suggestedFollowUps: [
        "Introduce Abhay.",
        "Show me the projects.",
        "Explain AgriChain.",
        "Show backend skills.",
        "Take me to the contact section."
      ],
      executionStatus: 'clarification_needed',
      quickActions: [
        {
          id: 'qa-explore-projects',
          label: 'Engineering Bay (Projects)',
          actionType: 'navigate',
          targetDestination: 'projects',
        },
        {
          id: 'qa-explore-skills',
          label: "Ship's Core (Skills)",
          actionType: 'navigate',
          targetDestination: 'skills',
        }
      ]
    };
  }
}

export const novaMockService = new NovaMockService();
