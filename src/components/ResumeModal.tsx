import React, { useState } from 'react';
import { X, Printer, Copy, Check, Mail, Phone, MapPin, Globe, Github, Linkedin, Download } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, EDUCATION, EXPERIENCES, PUBLICATIONS, SKILL_CATEGORIES } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhoto?: string;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, userPhoto }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const photo = userPhoto || PERSONAL_INFO.photo;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${PERSONAL_INFO.name}
**Roll No:** ${PERSONAL_INFO.rollNumber} | **Degree:** ${PERSONAL_INFO.program} (${PERSONAL_INFO.batch})
**Email:** ${PERSONAL_INFO.email} | **Portfolio:** ${window.location.origin}
**Academic Standing:** CGPA ${EDUCATION.cgpa} (Dean's Honor List)

## EDUCATION
**${EDUCATION.degree} in ${EDUCATION.major}** (${EDUCATION.period})
- Cumulative GPA: ${EDUCATION.cgpa}
- Key Coursework: ${EDUCATION.keyCoursework.join(', ')}

## EXPERIENCE
${EXPERIENCES.map(e => `### ${e.role} — ${e.organization} (${e.period})
${e.achievements.map(a => `- ${a}`).join('\n')}
*Stack:* ${e.technologies.join(', ')}
`).join('\n')}

## FEATURED RESEARCH & PROJECTS
${PROJECTS.map(p => `### ${p.title} — ${p.subtitle} (${p.year})
${p.summary}
- Metrics: ${p.metrics.map(m => `${m.label}: ${m.value}`).join(' | ')}
*Technologies:* ${p.tags.join(', ')}
`).join('\n')}

## PUBLICATIONS
${PUBLICATIONS.map(pub => `### ${pub.title} (${pub.year})
*${pub.authors}* — ${pub.venue}
${pub.abstract}
`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
              2026BTAI036_LohithSahu_AI_Portfolio_v4.pdf
            </span>
            <span className="text-xs text-slate-400">· Digital Print Replica</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied MD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-2"
              aria-label="Close resume preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Viewport */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 bg-white text-slate-900 text-xs sm:text-sm font-sans selection:bg-blue-100 print:p-0 print:overflow-visible">
          {/* Header with Photo */}
          <div className="border-b border-slate-300 pb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={photo}
                alt={PERSONAL_INFO.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover object-top border-2 border-slate-300 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 text-center sm:text-left">
                  {PERSONAL_INFO.name}
                </h1>
                <div className="text-xs font-semibold text-blue-700 mt-1 uppercase tracking-wider text-center sm:text-left">
                  {PERSONAL_INFO.program} · Roll No: {PERSONAL_INFO.rollNumber} · {PERSONAL_INFO.batch}
                </div>
                <p className="text-xs text-slate-600 mt-2 max-w-lg text-center sm:text-left leading-relaxed">
                  Deep Learning Researcher & AI Engineer specializing in Multimodal Diagnostic Computer Vision, Agentic Knowledge Graph Retrieval, and Sub-5W Edge INT8 Inference.
                </p>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 sm:text-right shrink-0">
              <div className="font-semibold text-slate-900">{PERSONAL_INFO.email}</div>
              <div>{PERSONAL_INFO.location}</div>
              <div className="text-blue-700 font-mono text-[11px] font-bold">CGPA: {EDUCATION.cgpa} (Dean’s Honor List)</div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Education
            </h2>
            <div className="flex justify-between items-baseline">
              <div>
                <strong className="text-slate-950">{EDUCATION.degree} in {EDUCATION.major}</strong>
                <div className="text-slate-600 text-xs mt-0.5">{PERSONAL_INFO.university}</div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-slate-800">{EDUCATION.period}</span>
                <div className="text-xs text-blue-700 font-semibold font-mono">CGPA: {EDUCATION.cgpa}</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 mt-2">
              <strong>Core Coursework:</strong> {EDUCATION.keyCoursework.join(' · ')}
            </div>
          </div>

          {/* Research & Publications */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Publications & Working Papers
            </h2>
            <div className="space-y-3">
              {PUBLICATIONS.map(pub => (
                <div key={pub.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-950">{pub.title}</span>
                    <span className="font-mono text-xs text-slate-700 ml-2">{pub.year}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 italic mt-0.5">
                    {pub.authors} — <strong>{pub.venue}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {EXPERIENCES.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <strong className="text-slate-950">{exp.role}</strong>
                      <span className="text-slate-600"> — {exp.organization}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-700">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1.5 text-xs">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                  <div className="text-[11px] text-slate-500 mt-1">
                    <strong>Stack:</strong> {exp.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagship Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Selected AI Systems & Projects
            </h2>
            <div className="space-y-4">
              {PROJECTS.slice(0, 3).map(p => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-950">{p.title} — {p.subtitle}</span>
                    <span className="font-mono text-xs text-slate-700">{p.year}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{p.summary}</p>
                  <div className="text-[11px] text-slate-600 mt-1">
                    <strong>Metrics:</strong> {p.metrics.map(m => `${m.label}: ${m.value}`).join(' | ')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <strong>Technologies:</strong> {p.tags.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Technical Proficiencies
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <div key={idx}>
                  <strong>{cat.title}:</strong> {cat.skills.map(s => `${s.name} (${s.level})`).join(', ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
