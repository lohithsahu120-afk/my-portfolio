import React from 'react';
import { Sparkles, FileText, Mail, Moon, Sun } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenChat: () => void;
  onOpenContact: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  userPhoto?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  onOpenChat,
  onOpenContact,
  theme,
  onToggleTheme,
  userPhoto,
}) => {
  const photo = userPhoto || PERSONAL_INFO.photo;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark with circular avatar */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <img
            src={photo}
            alt={PERSONAL_INFO.name}
            className="w-7 h-7 rounded-full object-cover object-top border border-blue-500/40"
            referrerPolicy="no-referrer"
          />
          <span>{PERSONAL_INFO.name}</span>
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#projects"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Featured Works
          </a>
          <a
            href="#interactive-lab"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Interactive Lab
          </a>
          <a
            href="#research"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Research & Papers
          </a>
          <a
            href="#experience"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Experience
          </a>
          <a
            href="#skills"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Competencies
          </a>
        </nav>

        {/* Zone 3: 1 primary action + theme & assistant triggers */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenChat}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-blue-200 dark:border-blue-900/40"
            title="Ask Lohith's AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Lohith AI</span>
          </button>

          <button
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-800"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume PDF</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenContact}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </header>
  );
};
