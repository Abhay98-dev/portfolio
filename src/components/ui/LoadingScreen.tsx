import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, Shield, Radio } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [systemStage, setSystemStage] = useState('CALIBRATING ION THRUSTERS...');

  useEffect(() => {
    const stages = [
      'CALIBRATING ION THRUSTERS...',
      'PRESSURIZING HULL ATMOSPHERE...',
      'ONLINE: QUANTUM REPOSITORIES...',
      'BOOTING NOVA AI SUBSYSTEMS...',
      'ENGAGING OBSERVATION ROTUNDA...'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        const stageIdx = Math.min(Math.floor((next / 100) * stages.length), stages.length - 1);
        setSystemStage(stages[stageIdx]);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    soundManager.playWarp();
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-950 text-white p-6 select-none"
      >
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
          {/* Logo Crest */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center shadow-cyan-glow-lg">
              <Shield className="w-10 h-10 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-[9px] font-mono font-bold text-space-950 uppercase tracking-widest">
              AV-01
            </span>
          </div>

          {/* Titles specified in prompt */}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest text-white glow-text-cyan">
              ABHAYVERSE
            </h1>
            <p className="font-mono text-xs sm:text-sm text-cyan-300 tracking-wider mt-2">
              INITIALIZING EXPLORATION SYSTEM
            </p>
          </div>

          {/* Progress Bar & Stage Readout */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                {systemStage}
              </span>
              <span className="text-cyan-300 font-bold">{progress}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-space-900 border border-cyan-500/30 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-150 ease-out shadow-cyan-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-space-900/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 hover:text-cyan-200 transition-all"
          >
            <span>SKIP INITIALIZATION</span>
            <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
