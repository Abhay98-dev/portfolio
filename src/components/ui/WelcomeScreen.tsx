import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WelcomeScreenProps {
  onExploreShip: () => void;
  onMeetNova: () => void;
  onDismiss: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onExploreShip,
  onMeetNova,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center sm:justify-start p-4 sm:pl-[6vw] pt-20 pointer-events-auto">
        {/* Subtle backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 bg-space-950/25"
        />

        {/* Welcome Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative max-w-xl sm:max-w-md w-full rounded-2xl hud-glass border border-cyan-500/40 p-6 sm:p-8 text-center shadow-hud-card hud-border-corners z-10"
        >
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A DEVELOPER'S UNIVERSE</span>
          </div>

          {/* Main Titles */}
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-wide glow-text-cyan">
            ABHAYVERSE
          </h1>

          <div className="font-mono text-xs sm:text-sm font-semibold text-cyan-300 tracking-wider mt-1.5">
            A DEVELOPER'S UNIVERSE
          </div>

          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed font-sans">
            Explore my projects, technical skills, and journey through an interactive spacecraft.
          </p>

          {/* NOVA Character Intro Box */}
          <div className="mt-6 p-4 rounded-xl bg-space-900/90 border border-cyan-500/30 text-left flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                NOVA
                <span className="text-[9px] font-mono px-1.5 rounded bg-cyan-500/20 text-cyan-300">
                  ONBOARD GUIDE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                "Welcome aboard! I'm NOVA, your onboard guide. You can explore the ship yourself or ask me to show you around."
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundManager.playWarp();
                onExploreShip();
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-mono text-xs font-bold transition-all shadow-cyan-glow group"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>ENTER SPACESHIP</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                soundManager.playNovaChirp();
                onMeetNova();
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 font-mono text-xs font-bold transition-all shadow-violet-glow"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>MEET NOVA</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
