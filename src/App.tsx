import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { InteractiveLab } from './components/InteractiveLab';
import { ResearchAndBackground } from './components/ResearchAndBackground';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { AskLohithDrawer } from './components/AskLohithDrawer';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Project } from './types/portfolio';
import { PERSONAL_INFO } from './data/portfolioData';
import { Rotate3D, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [labTab, setLabTab] = useState<'vision' | 'rag' | 'edge'>('vision');
  const [userPhoto, setUserPhoto] = useState<string>(PERSONAL_INFO.photo);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Load saved custom photo if user uploaded one previously
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_custom_photo');
      if (saved) {
        setUserPhoto(saved);
      }
    } catch (e) {
      console.warn('LocalStorage access error:', e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenLabWithProject = (projectId: string) => {
    if (projectId === 'neurovision-x') {
      setLabTab('vision');
    } else if (projectId === 'omnix-rag') {
      setLabTab('rag');
    } else if (projectId === 'edgenano-detect') {
      setLabTab('edge');
    }

    const labEl = document.getElementById('interactive-lab');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top 3-Zone Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenContact={handleScrollToContact}
        theme={theme}
        onToggleTheme={toggleTheme}
        userPhoto={userPhoto}
      />

      {/* Main Content Layout */}
      <main>
        {/* Hero Section with 3D Movable Rig & Realistic 3D Tilt Photo */}
        <Hero
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenContact={handleScrollToContact}
          userPhoto={userPhoto}
          onUpdatePhoto={(photo) => setUserPhoto(photo)}
        />

        {/* 01. Flagship Projects & Architecture */}
        <FeaturedProjects
          onSelectProject={(project) => setSelectedProject(project)}
          onOpenLabWithProject={handleOpenLabWithProject}
        />

        {/* Dedicated 3D Spatial Computing & Hardware Rig Explorer */}
        <section id="spatial-3d" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-2">
                  <Rotate3D className="w-4 h-4" />
                  <span>3D Realistic Spatial Hardware Explorer</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  Interactive 3D Tensor Processing Node
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                  Inspect the physical multi-part procedural architecture: drag to rotate in 360°, scroll to zoom, toggle camera angles, or pull the Exploded View slider to deconstruct the cooling fins, gimbal rings, and quantum tensor nucleus.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>360° Drag & Zoom Enabled</span>
              </div>
            </div>

            <ThreeCanvas className="h-[560px] sm:h-[620px]" />
          </div>
        </section>

        {/* 02. Interactive AI Sandbox & Algorithm Simulators */}
        <InteractiveLab initialTab={labTab} />

        {/* 03. Research Publications & 04. Technical Competencies */}
        <ResearchAndBackground />

        {/* 05. Experience & Engineering Roles */}
        <ExperienceTimeline />

        {/* 06. Direct Connect & Recruiter Dispatch */}
        <ContactSection />
      </main>

      {/* Quiet Footer */}
      <Footer
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Deep-Dive Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenLab={handleOpenLabWithProject}
      />

      {/* Digital Portfolio Resume Modal (2026BTAI036_LohithSahu_AI_Portfolio_v4.pdf) */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        userPhoto={userPhoto}
      />

      {/* Conversational AI Portfolio Assistant Drawer */}
      <AskLohithDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userPhoto={userPhoto}
      />
    </div>
  );
}
