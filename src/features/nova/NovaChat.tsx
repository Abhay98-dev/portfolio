import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Compass, 
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { ChatMessage, NovaQuickAction } from './novaTypes';
import { novaService } from './novaService';
import { DestinationId } from '../spaceship/destinations';
import { soundManager } from '../../utils/audio';

interface NovaChatProps {
  currentDestination: DestinationId;
  onNavigateDestination: (dest: DestinationId) => void;
  onOpenProject: (projectId: string) => void;
  onOpenRoomDetails: () => void;
  onCloseRoomDetails: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const NovaChat: React.FC<NovaChatProps> = ({
  currentDestination,
  onNavigateDestination,
  onOpenProject,
  onOpenRoomDetails,
  onCloseRoomDetails,
  isOpen,
  onToggleOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = novaService.getSuggestedPrompts();

  // Load initial greeting
  useEffect(() => {
    let isMounted = true;
    novaService.getInitialGreeting().then((greeting) => {
      if (isMounted) {
        setMessages([greeting]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    soundManager.playClick();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await novaService.sendMessage({
        message: text,
        currentDestination,
        history: messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      });

      soundManager.playNovaChirp();

      const novaMsg: ChatMessage = {
        id: `nova-${Date.now()}`,
        sender: 'nova',
        text: response.assistantMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: response.actionType,
        targetDestination: response.destination,
        targetProjectId: response.projectId,
        quickActions: response.quickActions,
        isSimulatedAi: true,
      };

      setMessages((prev) => [...prev, novaMsg]);

      // Execute structured navigation action
      if (response.actionType === 'navigate' && response.destination) {
        onNavigateDestination(response.destination);
      } else if (response.actionType === 'show_skills') {
        if (response.destination) onNavigateDestination(response.destination);
        onOpenRoomDetails();
      } else if (response.actionType === 'close_panel') {
        onCloseRoomDetails();
      } else if (response.actionType === 'open_project') {
        if (response.destination) {
          onNavigateDestination(response.destination);
        }
        if (response.projectId) {
          setTimeout(() => {
            onOpenProject(response.projectId!);
          }, 600);
        }
      } else if (response.actionType === 'download_resume') {
        window.open('/resume.pdf', '_blank');
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'nova',
        text: "I encountered a minor comms glitch. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (qa: NovaQuickAction) => {
    soundManager.playClick();
    if (qa.actionType === 'navigate' && qa.targetDestination) {
      onNavigateDestination(qa.targetDestination);
    } else if (qa.actionType === 'open_project' && qa.targetProjectId) {
      onOpenProject(qa.targetProjectId);
    } else if (qa.actionType === 'download_resume') {
      window.open('/resume.pdf', '_blank');
    } else if (qa.url) {
      window.open(qa.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClear = () => {
    soundManager.playClick();
    novaService.getInitialGreeting().then((greeting) => {
      setMessages([greeting]);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-[calc(100vw-3rem)]">
      {/* Floating launcher trigger button when chat closed */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            soundManager.playNovaChirp();
            onToggleOpen();
          }}
          className="relative group flex items-center gap-3 px-4 py-3 rounded-full bg-space-900/90 border border-cyan-400/40 text-cyan-300 shadow-cyan-glow hover:border-cyan-300 hover:shadow-cyan-glow-lg transition-all duration-300 backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open NOVA Guide"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-space-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-space-950" />
          </div>
          <div className="text-left pr-1">
            <div className="font-display text-xs tracking-wider font-bold text-white uppercase flex items-center gap-1.5">
              NOVA AI Guide
              <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 border border-cyan-400/40 rounded text-cyan-300">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Click to talk or navigate ship
            </div>
          </div>
        </motion.button>
      )}

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '520px',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="w-[360px] sm:w-[400px] flex flex-col rounded-2xl border border-cyan-500/30 bg-space-950/90 backdrop-blur-xl shadow-hud-card overflow-hidden hud-border-corners"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-space-900/90 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm tracking-wide text-white">
                      NOVA
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono">
                      GUIDE BOT
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>ONLINE • ONBOARD SIMULATION</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-cyan-500/10"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-cyan-500/10"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={onToggleOpen}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body - Collapsed when minimized */}
            {!isMinimized && (
              <>
                {/* Simulation Notice Disclaimer */}
                <div className="px-3 py-1.5 bg-cyan-950/40 border-b border-cyan-500/10 flex items-center gap-2 text-[10px] text-cyan-300/80">
                  <Info className="w-3 h-3 flex-shrink-0 text-cyan-400" />
                  <span>Interactive Frontend Mock • Ready for future backend AI link</span>
                </div>

                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white rounded-tr-none border border-cyan-400/30'
                            : 'bg-space-900/90 text-slate-200 rounded-tl-none border border-slate-700/60 shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Quick actions if returned by NOVA */}
                        {msg.quickActions && msg.quickActions.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex flex-wrap gap-1.5">
                            {msg.quickActions.map((qa) => (
                              <button
                                key={qa.id}
                                onClick={() => handleQuickAction(qa)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] text-cyan-300 font-mono font-medium transition-all"
                              >
                                {qa.actionType === 'navigate' && <Compass className="w-2.5 h-2.5" />}
                                {qa.url && <ExternalLink className="w-2.5 h-2.5" />}
                                {qa.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-space-900/80 rounded-2xl rounded-tl-none border border-slate-700/50 w-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompts Pills */}
                <div className="px-3 py-2 bg-space-900/40 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mb-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Suggested transmissions:</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-space-850/80 hover:bg-cyan-500/20 border border-slate-700/70 hover:border-cyan-400/50 text-[10px] text-slate-300 hover:text-cyan-200 transition-colors flex-shrink-0"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-space-900/95 border-t border-cyan-500/20 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask NOVA or type 'Show projects'..."
                    className="flex-1 bg-space-950/80 border border-slate-700/80 focus:border-cyan-400/70 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 rounded-xl bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/50 text-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Send Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
