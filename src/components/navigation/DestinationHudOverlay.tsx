import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Compass, 
  FileText, 
  ExternalLink, 
  Send, 
  Layers, 
  Calendar, 
  MapPin, 
  Mail, 
  Github, 
  Linkedin, 
  Award, 
  GraduationCap, 
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import { DestinationId, DESTINATIONS } from '../../features/spaceship/destinations';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { educationData } from '../../data/education';
import { achievementsData } from '../../data/achievements';
import { contactData } from '../../data/contact';
import { portfolioService, ContactSubmissionPayload } from '../../services/portfolioService';
import { soundManager } from '../../utils/audio';

interface DestinationHudOverlayProps {
  activeDestination: DestinationId;
  onSelectDestination: (dest: DestinationId) => void;
  onOpenProject: (projectId: string) => void;
  isDetailsOpen: boolean;
  onSetDetailsOpen: (open: boolean) => void;
}

export const DestinationHudOverlay: React.FC<DestinationHudOverlayProps> = ({
  activeDestination,
  onSelectDestination,
  onOpenProject,
  isDetailsOpen,
  onSetDetailsOpen,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>('All');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('backend');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactSubmissionPayload>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSetDetailsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onSetDetailsOpen]);

  if (activeDestination === 'hub') {
    return null;
  }

  const destConfig = DESTINATIONS[activeDestination];

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(contactData.directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setIsSubmitting(true);
    setSubmissionFeedback(null);

    const res = await portfolioService.submitContactMessage(contactForm);
    setIsSubmitting(false);

    if (res.success && res.data) {
      soundManager.playNovaChirp();
      setSubmissionFeedback(res.data.feedbackNote);
      setContactForm({ name: '', email: '', message: '' });
    } else {
      setSubmissionFeedback(res.error?.message || 'Transmission failed.');
    }
  };

  const filteredProjects = projectCategoryFilter === 'All' 
    ? projectsData 
    : projectsData.filter((p) => p.category === projectCategoryFilter);

  return (
    <div className="fixed top-20 left-4 sm:left-8 z-30 max-w-xl w-[calc(100vw-2rem)] sm:w-[520px] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="rounded-2xl hud-glass border border-cyan-500/30 overflow-hidden shadow-hud-card hud-border-corners"
      >
        {/* Panel Header */}
        <div className="px-5 py-3.5 bg-space-900/90 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              {destConfig.code}
            </span>
            <div>
              <h2 className="font-display font-bold text-base text-white tracking-wide">
                {destConfig.name}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                {destConfig.deckName} • {destConfig.purpose}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsCollapsed(!isCollapsed);
              }}
              className="p-1.5 rounded-lg bg-space-850 hover:bg-cyan-500/20 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
              title={isCollapsed ? 'Expand panel' : 'Collapse panel to see spaceship'}
              aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundManager.playWarp();
                onSelectDestination('hub');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-xs transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>RETURN TO HUB</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-cyan-500/15">
          <button
            onClick={() => { soundManager.playClick(); onSetDetailsOpen(!isDetailsOpen); }}
            className="px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 font-mono text-[11px] font-bold"
          >
            {isDetailsOpen ? 'CLOSE' : activeDestination === 'about' ? 'ABOUT ABHAY' : activeDestination === 'projects' ? 'VIEW PROJECTS' : activeDestination === 'skills' ? 'EXPLORE SKILLS' : activeDestination === 'education' ? 'EDUCATION & ACHIEVEMENTS' : 'CONTACT INFORMATION'}
          </button>
          {activeDestination === 'about' && <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => soundManager.playClick()} className="px-3 py-2 rounded-lg bg-space-850 border border-slate-700 text-slate-200 font-mono text-[11px]">VIEW RESUME</a>}
          {activeDestination === 'skills' && (
            <button onClick={() => { soundManager.playClick(); onSetDetailsOpen(true); setActiveSkillCategory('backend'); }} className="px-3 py-2 rounded-lg bg-space-850 border border-slate-700 text-slate-200 font-mono text-[11px]">VIEW TECHNOLOGIES</button>
          )}
          {activeDestination === 'education' && (
            <button onClick={() => { soundManager.playClick(); onSetDetailsOpen(true); }} className="px-3 py-2 rounded-lg bg-space-850 border border-slate-700 text-slate-200 font-mono text-[11px]">ACHIEVEMENTS</button>
          )}
          {activeDestination === 'contact' && <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => soundManager.playClick()} className="px-3 py-2 rounded-lg bg-space-850 border border-slate-700 text-slate-200 font-mono text-[11px]">DOWNLOAD RESUME</a>}
        </div>

        {/* Detailed room content opens only after an explicit action */}
        <AnimatePresence>
          {!isCollapsed && isDetailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-h-[62vh] overflow-y-auto p-5 text-xs text-slate-200 space-y-4"
            >
              {/* =========================================================================
                  DESTINATION 1: COMMAND DECK (ABOUT ME)
                  ========================================================================= */}
              {activeDestination === 'about' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                      COMMAND PROFILE
                    </span>
                    <h3 className="font-display text-xl font-bold text-white mt-0.5">
                      {profileData.name}
                    </h3>
                    <p className="font-mono text-xs text-cyan-300/90 mt-0.5">
                      {profileData.roleSubtitle}
                    </p>
                  </div>

                  {/* Core Prompt Introduction */}
                  <div className="p-4 rounded-xl bg-space-950/80 border border-cyan-500/30 shadow-inner">
                    <p className="leading-relaxed text-sm text-slate-200 font-sans">
                      "{profileData.bio}"
                    </p>
                  </div>

                  {/* Extended Bio */}
                  <div className="space-y-2">
                    {profileData.extendedBio.map((paragraph, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed font-sans text-xs">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Directives List */}
                  <div>
                    <h4 className="font-display text-[11px] uppercase tracking-wider text-cyan-400 mb-2">
                      Core Directives
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {profileData.primaryDirectives.map((directive, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{directive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/20">
                    {profileData.stats.map((st, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-space-850/70 border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-mono">{st.label}</div>
                        <div className="font-mono text-xs font-semibold text-cyan-200 mt-0.5">
                          {st.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resume Action */}
                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundManager.playClick()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-mono text-xs font-bold transition-all shadow-cyan-glow"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ACCESS RESUME</span>
                    </a>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  DESTINATION 2: ENGINEERING BAY (PROJECTS)
                  ========================================================================= */}
              {activeDestination === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-slate-300 text-xs">
                      Holographic blueprints for deployed backends and full-stack systems. Click any blueprint to inspect full architecture.
                    </p>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {['All', 'Full-Stack', 'Backend', 'Mobile', 'Real-time'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          soundManager.playClick();
                          setProjectCategoryFilter(cat);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all whitespace-nowrap ${
                          projectCategoryFilter === cat
                            ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200'
                            : 'bg-space-850/80 border border-slate-700/70 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Project Cards List */}
                  <div className="space-y-3">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          soundManager.playHoloOpen();
                          onOpenProject(p.id);
                        }}
                        className="group p-4 rounded-xl bg-space-900/80 hover:bg-space-850 border border-slate-800 hover:border-cyan-400/60 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-cyan-400">
                                {p.codenumber}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {p.category}
                              </span>
                            </div>
                            <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {p.name}
                            </h4>
                          </div>

                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              p.status === 'Live'
                                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                                : p.status === 'In Development'
                                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                                : 'bg-blue-500/15 border-blue-400/40 text-blue-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                          {p.shortDescription}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {p.technologies.slice(0, 3).map((t, idx) => (
                              <span
                                key={idx}
                                className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-space-950 border border-slate-700/60 text-slate-300"
                              >
                                {t}
                              </span>
                            ))}
                            {p.technologies.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                +{p.technologies.length - 3} more
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                            Inspect &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  DESTINATION 3: SHIP'S CORE (SKILLS)
                  ========================================================================= */}
              {activeDestination === 'skills' && (
                <div className="space-y-4">
                  <p className="text-slate-300 text-xs">
                    Sub-level plasma reactor coils routing power to Abhay's core technical proficiencies. Select a matrix category:
                  </p>

                  {/* Skill Category Selector Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {skillsData.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveSkillCategory(cat.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          activeSkillCategory === cat.id
                            ? 'bg-purple-500/30 border border-purple-400 text-purple-200'
                            : 'bg-space-850/80 border border-slate-700/70 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Skill Category Details */}
                  {(() => {
                    const selectedCat = skillsData.find((c) => c.id === activeSkillCategory) || skillsData[0];
                    return (
                      <div className="space-y-3 p-4 rounded-xl bg-space-950/70 border border-purple-500/30">
                        <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                          <div>
                            <span className="font-mono text-[10px] text-purple-400">
                              {selectedCat.coreRole}
                            </span>
                            <h4 className="font-display text-sm font-bold text-white">
                              {selectedCat.name}
                            </h4>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-300">
                            {selectedCat.energySignature}
                          </span>
                        </div>

                        <p className="text-slate-300 text-xs leading-relaxed">
                          {selectedCat.description}
                        </p>

                        <div className="space-y-2 pt-1">
                          {selectedCat.skills.map((skill, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-space-900/90 border border-slate-800"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-cyan-300">
                                  {skill.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1 leading-normal font-sans">
                                {skill.description}
                              </p>
                              {skill.usedInProjects.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 flex-wrap text-[10px] font-mono text-slate-400">
                                  <span className="text-purple-400">Deployed in:</span>
                                  {skill.usedInProjects.map((proj, pIdx) => (
                                    <span key={pIdx} className="px-1.5 py-0.2 rounded bg-space-800 text-slate-300">
                                      {proj}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* =========================================================================
                  DESTINATION 4: NAVIGATION ARCHIVE (EDUCATION & ACHIEVEMENTS)
                  ========================================================================= */}
              {activeDestination === 'education' && (
                <div className="space-y-4">
                  {/* Education Record */}
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      Academic Vector
                    </h3>
                    {educationData.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-xl bg-space-950/70 border border-cyan-500/30 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-[10px] text-cyan-400">
                              {edu.starSector}
                            </span>
                            <h4 className="font-display text-sm font-bold text-white">
                              {edu.degree}
                            </h4>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 whitespace-nowrap">
                            {edu.graduationYear}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            {edu.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            {edu.duration}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono text-cyan-300">
                            Key Systems & Coursework:
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {edu.coursework.map((course, idx) => (
                              <span
                                key={idx}
                                className="font-mono text-[10px] px-2 py-0.5 rounded bg-space-850 border border-slate-700/60 text-slate-300"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Milestones & Achievements */}
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Milestones & Hackathons
                    </h3>
                    <div className="space-y-2.5">
                      {achievementsData.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="p-3.5 rounded-xl bg-space-900/80 border border-slate-800 hover:border-indigo-400/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                              {milestone.badge}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {milestone.dateOrYear}
                            </span>
                          </div>
                          <h4 className="font-display text-xs font-bold text-white mt-1">
                            {milestone.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 mt-1 leading-normal font-sans">
                            {milestone.description}
                          </p>
                          <div className="mt-2 text-[10px] font-mono text-slate-400">
                            {milestone.organizationOrEvent} • {milestone.coordinates}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  DESTINATION 5: COMMUNICATIONS ROOM (CONTACT)
                  ========================================================================= */}
              {activeDestination === 'contact' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-400">
                        {contactData.quantumEncryptionStatus}
                      </span>
                      <h3 className="font-display text-base font-bold text-white">
                        {contactData.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs">
                    {contactData.subtitle}
                  </p>

                  {/* Direct Contact Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Email Card */}
                    <div className="p-3 rounded-xl bg-space-950/80 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">Direct Email</div>
                          <a
                            href={`mailto:${contactData.directEmail}`}
                            className="font-mono text-xs text-white hover:text-emerald-300 transition-colors"
                          >
                            {contactData.directEmail}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyEmail}
                        className="p-1.5 rounded-lg bg-space-850 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                        title="Copy email"
                        aria-label="Copy email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* GitHub Card */}
                    <a
                      href={contactData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundManager.playClick()}
                      className="p-3 rounded-xl bg-space-950/80 border border-slate-800 hover:border-emerald-400/50 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-slate-300 group-hover:text-emerald-300 transition-colors" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">GitHub Profile</div>
                          <div className="font-mono text-xs text-white">github.com/Abhay98-dev</div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                    </a>

                    {/* LinkedIn Card */}
                    <a
                      href={contactData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundManager.playClick()}
                      className="p-3 rounded-xl bg-space-950/80 border border-slate-800 hover:border-emerald-400/50 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">LinkedIn Network</div>
                          <div className="font-mono text-xs text-white">Abhay Chachar</div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
                    </a>

                    {/* Resume Download */}
                    <a
                      href={contactData.resumeDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundManager.playClick()}
                      className="p-3 rounded-xl bg-space-950/80 border border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">Curriculum Vitae</div>
                          <div className="font-mono text-xs text-emerald-200">Download PDF</div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                  </div>

                  {/* Simulated Quantum Contact Transmission Form */}
                  <form onSubmit={handleContactSubmit} className="p-4 rounded-xl bg-space-950/70 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[11px] uppercase tracking-wider text-emerald-400">
                        Dispatch Sub-Space Transmission
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        RELAY STATUS: ONLINE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your Name / Call Sign"
                        className="w-full bg-space-900 border border-slate-700 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                      />
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="Your Comm Frequency (Email)"
                        className="w-full bg-space-900 border border-slate-700 focus:border-emerald-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Transmission payload / project inquiry..."
                      className="w-full bg-space-900 border border-slate-700 focus:border-emerald-400 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none resize-none font-sans"
                    />

                    {submissionFeedback && (
                      <div className="p-2 rounded bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
                        {submissionFeedback}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
