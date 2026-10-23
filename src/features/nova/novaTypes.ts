import { DestinationId } from '../spaceship/destinations';

export type NovaSender = 'user' | 'nova';

export type NovaActionType = 
  | 'navigate'
  | 'open_project'
  | 'show_skills'
  | 'download_resume'
  | 'contact_form'
  | 'close_panel'
  | 'none';

export interface NovaQuickAction {
  id: string;
  label: string;
  actionType: NovaActionType;
  targetDestination?: DestinationId;
  targetProjectId?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: NovaSender;
  text: string;
  timestamp: string;
  actionType?: NovaActionType;
  targetDestination?: DestinationId;
  targetProjectId?: string;
  quickActions?: NovaQuickAction[];
  isSimulatedAi?: boolean;
}

export interface ChatRequestHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  history?: ChatRequestHistoryItem[];
  currentDestination?: DestinationId;
}

export interface ChatResponse {
  assistantMessage: string;
  actionType: NovaActionType;
  destination?: DestinationId;
  projectId?: string;
  suggestedFollowUps?: string[];
  quickActions?: NovaQuickAction[];
  executionStatus: 'success' | 'clarification_needed' | 'unrecognized';
  simulatedDelayMs?: number;
}

export interface NovaService {
  sendMessage(request: ChatRequest): Promise<ChatResponse>;
  getInitialGreeting(): Promise<ChatMessage>;
  getSuggestedPrompts(): string[];
}
