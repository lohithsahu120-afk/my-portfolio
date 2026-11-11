import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume, onOpenChat }) => {
  return (
    <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Academic Credential */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-slate-900 dark:text-white">
            {PERSONAL_INFO.name}
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
          <span>{PERSONAL_INFO.program} ({PERSONAL_INFO.batch})</span>
          <span aria-hidden="true" className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
          <span className="font-mono text-slate-400">ID: {PERSONAL_INFO.rollNumber}</span>
        </div>

        {/* Quiet Site Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#projects" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Featured Works
          </a>
          <a href="#interactive-lab" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Interactive Lab
          </a>
          <a href="#research" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Publications
          </a>
          <button onClick={onOpenResume} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Portfolio Resume (v4)
          </button>
          <button onClick={onOpenChat} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Ask AI
          </button>
        </div>

        {/* Subtle Copyright & Version */}
        <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px] tabular-nums">
          © {new Date().getFullYear()} Lohith Sahu · v4.2
        </div>
      </div>
    </footer>
  );
};
