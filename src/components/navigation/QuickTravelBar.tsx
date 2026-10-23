import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  Sliders, 
  Menu, 
  X, 
  Compass, 
  Terminal, 
  Cpu, 
  GraduationCap, 
  Mail,
  Zap
} from 'lucide-react';
import { DestinationId, DESTINATION_LIST } from '../../features/spaceship/destinations';
import { soundManager } from '../../utils/audio';

interface QuickTravelBarProps {
  activeDestination: DestinationId;
  onSelectDestination: (dest: DestinationId) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  is2DMode: boolean;
  onToggle2DMode: () => void;
}

export const QuickTravelBar: React.FC<QuickTravelBarProps> = ({
  activeDestination,
  onSelectDestination,
  isMuted,
  onToggleSound,
  isReducedMotion,
  onToggleReducedMotion,
  is2DMode,
  onToggle2DMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDeckIcon = (id: DestinationId) => {
    switch (id) {
      case 'hub': return <Compass className="w-3.5 h-3.5" />;
      case 'about': return <Terminal className="w-3.5 h-3.5" />;
      case 'projects': return <Cpu className="w-3.5 h-3.5" />;
      case 'skills': return <Zap className="w-3.5 h-3.5" />;
      case 'education': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'contact': return <Mail className="w-3.5 h-3.5" />;
    }
  };

  const handleDestinationClick = (dest: DestinationId) => {
    soundManager.playWarp();
    onSelectDestination(dest);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 bg-space-950/75 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Starship Callsign */}
        <div 
          onClick={() => handleDestinationClick('hub')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-cyan-glow group-hover:border-cyan-300 transition-colors">
            <span className="font-display font-extrabold text-sm text-cyan-300">AV</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                ABHAYVERSE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono hidden sm:inline">
                AV-01 EXPLORER
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              ABHAY CHACHAR • SYSTEM READY
            </div>
          </div>
        </div>

        {/* Desktop Destination Deck Buttons */}
        <nav className="hidden lg:flex items-center gap-1 bg-space-900/80 p-1 rounded-xl border border-slate-800">
          {DESTINATION_LIST.map((dest) => {
            const isActive = activeDestination === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => handleDestinationClick(dest.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-cyan-500/25 border border-cyan-400/60 text-cyan-200 shadow-cyan-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850'
                }`}
                title={dest.purpose}
              >
                {getDeckIcon(dest.id)}
                <span>{dest.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-space-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 shadow-cyan-glow'
            }`}
            title={isMuted ? 'Unmute spaceship audio' : 'Mute audio'}
            aria-label={isMuted ? 'Unmute spaceship audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleReducedMotion();
            }}
            className={`p-2 rounded-lg border transition-colors hidden sm:block ${
              isReducedMotion
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-space-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isReducedMotion ? 'Reduced motion active' : 'Toggle reduced motion'}
            aria-label="Toggle reduced motion"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* 3D vs 2D Fallback Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggle2DMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
              is2DMode
                ? 'bg-purple-500/25 border-purple-400/60 text-purple-200'
                : 'bg-space-900 border-slate-800 text-slate-300 hover:border-cyan-500/40'
            }`}
            title="Toggle between 3D Spaceship and 2D Portfolio View"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{is2DMode ? '3D SPACESHIP' : '2D VIEW'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-space-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-1">
          {DESTINATION_LIST.map((dest) => (
            <button
              key={dest.id}
              onClick={() => handleDestinationClick(dest.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-mono text-xs transition-colors ${
                activeDestination === dest.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
                  : 'text-slate-300 hover:bg-space-850'
              }`}
            >
              <div className="flex items-center gap-2">
                {getDeckIcon(dest.id)}
                <span>{dest.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">{dest.code}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
