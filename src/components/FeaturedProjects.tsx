import React, { useState } from 'react';
import { ArrowUpRight, Github, Play, Layers, Activity, Cpu, Sparkles } from 'lucide-react';
import { Project } from '../types/portfolio';
import { PROJECTS } from '../data/portfolioData';

interface FeaturedProjectsProps {
  onSelectProject: (project: Project) => void;
  onOpenLabWithProject?: (projectId: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  onSelectProject,
  onOpenLabWithProject,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-20 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              01. Selected Works & Systems
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Production Machine Learning & Research Implementations
            </h2>
          </div>

          {/* Functional Interactive Segmented Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {[
              { id: 'all', label: 'All Work' },
              { id: 'vision', label: 'Computer Vision' },
              { id: 'rag', label: 'Agentic RAG' },
              { id: 'edge', label: 'Edge & Embedded' },
              { id: 'mlops', label: 'Distributed MLOps' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {filteredProjects.map((project, idx) => {
            // First two cards are prominent wide cards (span 7 and 5)
            const isWide = idx === 0;
            const spanClass = isWide
              ? 'lg:col-span-7'
              : idx === 1
              ? 'lg:col-span-5'
              : 'lg:col-span-6';

            return (
              <div
                key={project.id}
                className={`${spanClass} flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                {/* Media Container with Fallback */}
                <div
                  className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback container
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Clean unboxed category overlay */}
                  <div className="absolute top-4 left-4 text-xs font-semibold text-slate-200 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-md border border-slate-800/80">
                    {project.categoryLabel}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-md line-clamp-1">
                        {project.subtitle}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {project.summary}
                    </p>

                    {/* Key Tabular Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 mb-6">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {m.label}
                          </div>
                          <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {m.detail}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Clean unboxed tags with typographic separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                      {project.tags.map((tag, tIdx) => (
                        <React.Fragment key={tag}>
                          <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            {tag}
                          </span>
                          {tIdx < project.tags.length - 1 && (
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>System Architecture & Metrics</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.demoUrl && onOpenLabWithProject && (
                        <a
                          href={project.demoUrl}
                          onClick={() => onOpenLabWithProject(project.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          <span>Interactive Lab</span>
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-md transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
