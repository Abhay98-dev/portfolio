import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Github, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ProjectData } from '../../data/projects';
import { soundManager } from '../../utils/audio';

interface ProjectDetailModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-space-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-space-900/95 border border-cyan-500/40 p-6 sm:p-8 text-slate-100 shadow-hud-card hud-border-corners z-10"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-cyan-500/20 pb-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300">
                  {project.codenumber}
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {project.category}
                </span>
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    project.status === 'Live'
                      ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                      : project.status === 'In Development'
                      ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                      : 'bg-blue-500/15 border-blue-400/50 text-blue-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {project.status}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white glow-text-cyan">
                {project.name}
              </h2>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-space-850 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-400/50 text-slate-400 hover:text-rose-300 transition-colors"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="mt-6 space-y-6 text-sm">
            {/* Overview */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                System Overview
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                {project.fullDescription}
              </p>
            </div>

            {/* Problem Solved */}
            <div className="p-4 rounded-xl bg-space-950/70 border border-cyan-500/20">
              <h3 className="font-display text-xs uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Problem Being Addressed
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {project.problemSolved}
              </p>
            </div>

            {/* Implemented Features */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Implemented Capabilities & Features
              </h3>
              <ul className="grid grid-cols-1 gap-2.5">
                {project.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-space-850/60 border border-slate-800 text-slate-200 text-xs sm:text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Badges */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Engine Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-400/30 text-cyan-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Architectural Highlights */}
            {project.keyHighlights && project.keyHighlights.length > 0 && (
              <div>
                <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Key Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.keyHighlights.map((hl, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-purple-950/30 border border-purple-500/30 text-purple-200 font-mono"
                    >
                      • {hl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Links Bar */}
            <div className="pt-4 border-t border-cyan-500/20 flex items-center gap-3 flex-wrap">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 border border-slate-700 hover:border-cyan-400 text-white text-xs font-mono transition-all"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>Backend Repository</span>
                </a>
              )}

              {project.frontendGithubUrl && (
                <a
                  href={project.frontendGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 border border-slate-700 hover:border-cyan-400 text-white text-xs font-mono transition-all"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>Frontend Repository</span>
                </a>
              )}

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold transition-all shadow-cyan-glow"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Live Application</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
