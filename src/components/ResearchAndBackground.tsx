import React, { useState } from 'react';
import { BookOpen, Award, GraduationCap, ChevronDown, ChevronUp, ExternalLink, Code2 } from 'lucide-react';
import { PUBLICATIONS, EDUCATION, HONORS, SKILL_CATEGORIES } from '../data/portfolioData';

export const ResearchAndBackground: React.FC = () => {
  const [expandedPaper, setExpandedPaper] = useState<string | null>('paper-1');

  return (
    <section id="research" className="py-20 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section 1: Research Publications */}
        <div className="mb-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            03. Peer-Reviewed Papers & Preprints
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 [text-wrap:balance]">
            Explainable AI, Vision Grounding & Relational Retrieval
          </h2>

          <div className="space-y-6">
            {PUBLICATIONS.map((pub) => {
              const isExpanded = expandedPaper === pub.id;
              return (
                <div
                  key={pub.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Clean unboxed metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                        <span>{pub.badge}</span>
                        <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                        <span className="font-mono tabular-nums">{pub.year}</span>
                        <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                        <span className="text-slate-500 dark:text-slate-400 font-normal">{pub.venue}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {pub.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                        Authors: {pub.authors}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedPaper(isExpanded ? null : pub.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                    >
                      <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                        Abstract:
                      </div>
                      <p>{pub.abstract}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Academic Qualifications & Honors Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Left: Education Credentials */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Foundation</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {EDUCATION.degree} in {EDUCATION.major}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
                <span>Roll ID: {EDUCATION.rollNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Batch: {EDUCATION.period}</span>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Cumulative GPA</div>
                  <div className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                    {EDUCATION.cgpa}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{EDUCATION.honors}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Top 2% of AI Cohort</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Core AI & Systems Coursework
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {EDUCATION.keyCoursework.map((course, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Honors & Awards */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <Award className="w-4 h-4" />
                <span>Distinctions & Fellowships</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Recognitions & Competitions
              </h3>

              <div className="space-y-4">
                {HONORS.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        {item.year}
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      {item.issuer}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Competencies Matrix */}
        <div id="skills">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            04. Core Technical Competencies
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
            Engineering & Algorithmic Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((category, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {skill.name}
                        </span>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
