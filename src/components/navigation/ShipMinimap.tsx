import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Compass } from 'lucide-react';
import { DestinationId, DESTINATIONS } from '../../features/spaceship/destinations';
import { soundManager } from '../../utils/audio';

interface ShipMinimapProps {
  activeDestination: DestinationId;
  onSelectDestination: (dest: DestinationId) => void;
}

export const ShipMinimap: React.FC<ShipMinimapProps> = ({
  activeDestination,
  onSelectDestination,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (dest: DestinationId) => {
    soundManager.playWarp();
    onSelectDestination(dest);
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-auto hidden sm:block">
      <motion.div className="rounded-2xl hud-glass border border-cyan-500/30 overflow-hidden shadow-hud-card hud-border-corners">
        {/* Toggle Button / Header */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsOpen(!isOpen);
          }}
          className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-space-900/90 hover:bg-space-850 text-slate-200 transition-colors"
          aria-label="Toggle Deck Minimap"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-display text-xs font-bold tracking-wider text-white">
              DECK SCHEMATIC
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              {DESTINATIONS[activeDestination].code}
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Schematic Canvas Body */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-space-950/90 border-t border-cyan-500/20 w-[260px]"
            >
              <div className="relative w-full h-[180px] rounded-xl bg-space-900/60 border border-slate-800 p-2 tech-grid flex items-center justify-center">
                {/* Visual Ship Schematic Layout */}
                {/* Forward Command Deck */}
                <button
                  onClick={() => handleSelect('about')}
                  className={`absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                    activeDestination === 'about'
                      ? 'bg-cyan-500/40 border border-cyan-400 text-cyan-200 shadow-cyan-glow'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-cyan-400/50'
                  }`}
                  title="Forward: Command Deck (About)"
                >
                  CMD-01 (ABOUT)
                </button>

                {/* Left Port: Navigation Archive */}
                <button
                  onClick={() => handleSelect('education')}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-mono transition-all text-center ${
                    activeDestination === 'education'
                      ? 'bg-indigo-500/40 border border-indigo-400 text-indigo-200'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-indigo-400/50'
                  }`}
                  title="Port: Navigation Archive (Education)"
                >
                  NAV-04
                </button>

                {/* Center: Central Hub */}
                <button
                  onClick={() => handleSelect('hub')}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-[9px] transition-all ${
                    activeDestination === 'hub'
                      ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-cyan-400/50'
                  }`}
                  title="Center: Central Hub"
                >
                  <span>HUB</span>
                  <span className="text-[7px] text-cyan-300">ROTUNDA</span>
                </button>

                {/* Right Starboard: Engineering Bay */}
                <button
                  onClick={() => handleSelect('projects')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[9px] font-mono transition-all text-center ${
                    activeDestination === 'projects'
                      ? 'bg-blue-500/40 border border-blue-400 text-blue-200'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-blue-400/50'
                  }`}
                  title="Starboard: Engineering Bay (Projects)"
                >
                  ENG-02
                </button>

                {/* Core Sub-level button */}
                <button
                  onClick={() => handleSelect('skills')}
                  className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                    activeDestination === 'skills'
                      ? 'bg-purple-500/40 border border-purple-400 text-purple-200'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-purple-400/50'
                  }`}
                  title="Sub-level: Ship's Core (Skills)"
                >
                  CORE-03 (SKILLS)
                </button>

                {/* Aft: Communications Room */}
                <button
                  onClick={() => handleSelect('contact')}
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono transition-all ${
                    activeDestination === 'contact'
                      ? 'bg-emerald-500/40 border border-emerald-400 text-emerald-200'
                      : 'bg-space-850 border border-slate-700 text-slate-300 hover:border-emerald-400/50'
                  }`}
                  title="Aft: Communications Room (Contact)"
                >
                  COM-05 (CONTACT)
                </button>
              </div>

              <div className="mt-2 text-center text-[10px] text-slate-400 font-mono">
                Click any sector to engage sub-light impulse
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
