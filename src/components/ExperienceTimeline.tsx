import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-20 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            05. Experience & Engineering Roles
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            Research Labs, Industry Fellowships & Leadership
          </h2>
        </div>

        <div className="space-y-8">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    <span>{exp.type}</span>
                    <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h3>

                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {exp.organization}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0 self-start">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Concrete Outcomes / Achievements */}
              <div className="space-y-2.5 mb-6">
                {exp.achievements.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              {/* Technologies (Zero-Pill: clean unboxed text) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Stack:</span>
                {exp.technologies.map((tech, tIdx) => (
                  <React.Fragment key={tech}>
                    <span>{tech}</span>
                    {tIdx < exp.technologies.length - 1 && (
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
