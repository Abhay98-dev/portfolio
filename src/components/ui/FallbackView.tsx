import React, { useState } from 'react';
import { 
  Terminal, 
  GraduationCap, 
  Mail, 
  ExternalLink, 
  Github, 
  Linkedin, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  Send 
} from 'lucide-react';
import { profileData } from '../../data/profile';
import { projectsData, ProjectData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { educationData } from '../../data/education';
import { achievementsData } from '../../data/achievements';
import { contactData } from '../../data/contact';
import { portfolioService, ContactSubmissionPayload } from '../../services/portfolioService';
import { soundManager } from '../../utils/audio';

interface FallbackViewProps {
  onOpenProject: (projectId: string) => void;
  onSwitchTo3D?: () => void;
  hasWebGL: boolean;
}

export const FallbackView: React.FC<FallbackViewProps> = ({
  onOpenProject,
  onSwitchTo3D,
  hasWebGL,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactForm, setContactForm] = useState<ContactSubmissionPayload>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

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

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 pt-20 pb-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-16">
      {/* 2D Mode Notice Banner */}
      <div className="p-4 rounded-2xl bg-space-900/90 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white uppercase tracking-wider">
              {hasWebGL ? 'Accessible 2D Portfolio View' : 'WebGL Fallback Mode Active'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              High-readability layout featuring full engineering archives & direct contact access.
            </div>
          </div>
        </div>

        {hasWebGL && onSwitchTo3D && (
          <button
            onClick={() => {
              soundManager.playWarp();
              onSwitchTo3D();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-mono text-xs font-bold transition-all"
          >
            Switch to 3D Spaceship &rarr;
          </button>
        )}
      </div>

      {/* SECTION 1: ABOUT / COMMAND DECK */}
      <section id="about" className="space-y-6">
        <div className="space-y-2">
          <div className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
            COMMAND DECK // PROFILE
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            {profileData.name}
          </h1>
          <p className="font-mono text-sm sm:text-base text-cyan-300 font-semibold">
            {profileData.roleSubtitle}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-space-900/80 border border-cyan-500/30 shadow-hud-card">
          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            "{profileData.bio}"
          </p>

          <div className="mt-4 space-y-2 text-sm text-slate-300 font-sans">
            {profileData.extendedBio.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profileData.stats.map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-space-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-mono">{st.label}</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-cyan-200 mt-1">
                  {st.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-mono text-xs font-bold transition-all shadow-cyan-glow"
            >
              <FileText className="w-4 h-4" />
              <span>ACCESS RESUME</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: ENGINEERING BAY / FEATURED PROJECTS */}
      <section id="projects" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs text-blue-400 uppercase tracking-widest">
              ENGINEERING BAY // CODEBASES
            </div>
            <h2 className="font-display text-3xl font-bold text-white mt-1">
              Featured Projects
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Full-Stack', 'Backend', 'Mobile', 'Real-time'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-500/30 border border-blue-400 text-blue-200'
                    : 'bg-space-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project: ProjectData) => (
            <div
              key={project.id}
              onClick={() => {
                soundManager.playHoloOpen();
                onOpenProject(project.id);
              }}
              className="group p-6 rounded-2xl bg-space-900/80 hover:bg-space-850 border border-slate-800 hover:border-cyan-400/60 transition-all cursor-pointer shadow-hud-card relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">
                      {project.codenumber}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-slate-300">
                      {project.category}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                      project.status === 'Live'
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                        : project.status === 'In Development'
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                        : 'bg-blue-500/15 border-blue-400/40 text-blue-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.name}
                </h3>

                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  {project.shortDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs px-2.5 py-1 rounded bg-space-950 border border-slate-800 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400 group-hover:translate-x-1 transition-transform">
                  View Full Architecture &rarr;
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-300 hover:text-cyan-300 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SHIP'S CORE / TECHNICAL SKILLS */}
      <section id="skills" className="space-y-6">
        <div>
          <div className="font-mono text-xs text-purple-400 uppercase tracking-widest">
            SHIP'S CORE // TECHNICAL CAPABILITIES
          </div>
          <h2 className="font-display text-3xl font-bold text-white mt-1">
            Categorized Technical Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-space-900/80 border border-slate-800 hover:border-purple-500/40 transition-colors shadow-hud-card space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <h3 className="font-display text-base font-bold text-white">
                    {cat.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-400/30">
                  {cat.energySignature}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {cat.description}
              </p>

              <div className="space-y-2">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-space-950/70 border border-slate-800/80">
                    <div className="font-mono text-xs font-semibold text-cyan-300">
                      {skill.name}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-normal font-sans">
                      {skill.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: NAVIGATION ARCHIVE / EDUCATION & JOURNEY */}
      <section id="education" className="space-y-6">
        <div>
          <div className="font-mono text-xs text-indigo-400 uppercase tracking-widest">
            NAVIGATION ARCHIVE // JOURNEY
          </div>
          <h2 className="font-display text-3xl font-bold text-white mt-1">
            Education & Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education */}
          <div className="p-6 rounded-2xl bg-space-900/80 border border-cyan-500/30 shadow-hud-card space-y-4">
            <h3 className="font-display text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Academic Degree
            </h3>
            {educationData.map((edu) => (
              <div key={edu.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">
                      {edu.degree}
                    </h4>
                    <p className="font-mono text-xs text-cyan-300 mt-0.5">
                      {edu.institution} • {edu.location}
                    </p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 whitespace-nowrap">
                    {edu.graduationYear}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-mono text-slate-400 mb-1.5">
                    Core Coursework & Specialized Systems:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-xs px-2.5 py-1 rounded bg-space-950 border border-slate-800 text-slate-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="p-6 rounded-2xl bg-space-900/80 border border-indigo-500/30 shadow-hud-card space-y-4">
            <h3 className="font-display text-sm uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Milestones & Achievements
            </h3>
            <div className="space-y-3">
              {achievementsData.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-space-950/70 border border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      {m.badge}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{m.dateOrYear}</span>
                  </div>
                  <h4 className="font-display text-xs font-bold text-white mt-1">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-normal font-sans">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMMUNICATIONS ROOM / CONTACT */}
      <section id="contact" className="space-y-6">
        <div>
          <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
            COMMUNICATIONS ROOM // DIRECT UPLINK
          </div>
          <h2 className="font-display text-3xl font-bold text-white mt-1">
            Connect with Abhay
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            {contactData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Direct Cards */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-space-900/80 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400 font-mono">Email Transmission</div>
                  <a
                    href={`mailto:${contactData.directEmail}`}
                    className="font-mono text-sm text-white hover:text-emerald-300 transition-colors"
                  >
                    {contactData.directEmail}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-space-850 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={contactData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-space-900/80 border border-slate-800 hover:border-emerald-400/50 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-slate-300 group-hover:text-emerald-300 transition-colors" />
                <div>
                  <div className="text-xs text-slate-400 font-mono">GitHub Repositories</div>
                  <div className="font-mono text-sm text-white">github.com/Abhay98-dev</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-300" />
            </a>

            <a
              href={contactData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-space-900/80 border border-slate-800 hover:border-emerald-400/50 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-400 font-mono">LinkedIn Profile</div>
                  <div className="font-mono text-sm text-white">Abhay Chachar</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-300" />
            </a>

            <a
              href={contactData.resumeDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-space-900/80 border border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400 font-mono">Resume Document</div>
                  <div className="font-mono text-sm text-emerald-200">Download Curriculum Vitae (PDF)</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* Form */}
          <form
            onSubmit={handleContactSubmit}
            className="p-6 rounded-2xl bg-space-900/80 border border-emerald-500/30 space-y-4"
          >
            <h3 className="font-display text-sm uppercase tracking-wider text-emerald-400">
              Transmit Message
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-space-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full bg-space-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Transmission Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Inquiry, collaboration proposal, or message..."
                  className="w-full bg-space-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none resize-none font-sans"
                />
              </div>
            </div>

            {submissionFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
                {submissionFeedback}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-cyan-glow disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'DISPATCHING TRANSMISSION...' : 'SEND MESSAGE'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-800 text-center font-mono text-xs text-slate-400">
        ABHAYVERSE // AV-01 EXPLORER • Built with React, TypeScript, Three.js & Tailwind CSS
      </footer>
    </div>
  );
};
