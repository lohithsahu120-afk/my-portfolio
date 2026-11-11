import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ArrowUpRight, Github, Linkedin, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [roleType, setRoleType] = useState<string>('Full-Time AI/ML Role');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build mailto link so the user can send directly from their mail client
    const subject = encodeURIComponent(`[AI Recruitment / Inquiry] ${roleType} - ${senderName}`);
    const body = encodeURIComponent(
      `Hi Lohith,\n\nName: ${senderName}\nEmail: ${senderEmail}\nRole: ${roleType}\n\nMessage:\n${message}\n\nBest regards,\n${senderName}`
    );
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Inquiries Info */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              06. Direct Connect & Recruitment
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 [text-wrap:balance]">
              Let’s Discuss AI Research & Scalable Engineering
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              I am actively interviewing for Summer 2026 internships and graduating full-time positions (Batch 2026). Whether you are exploring computer vision, agentic knowledge graphs, or low-latency edge deployment, I welcome opportunities to collaborate.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/40">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  Primary Availability:
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  • 2026 Graduating Full-Time (AI / Machine Learning Engineer)<br />
                  • Summer 2026 Research Fellowship / Industrial AI Internship<br />
                  • Bangalore, Hyderabad, or Global Remote
                </div>
              </div>
            </div>

            {/* Social Connectors */}
            <div className="flex items-center gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>

              <a
                href={PERSONAL_INFO.kaggle}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:text-slate-950 dark:hover:text-white transition-colors"
              >
                <span>Kaggle</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Direct Recruiter Dispatch Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Send an Interview Inquiry or Message
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Submitting opens your native email client with this structured brief addressed to {PERSONAL_INFO.email}.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Chen / Apex AI Labs"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="schen@domain.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Opportunity Type
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="Full-Time AI/ML Engineer (Class of 2026)">Full-Time AI/ML Engineer (Class of 2026)</option>
                  <option value="Summer 2026 Research Internship">Summer 2026 Research Internship</option>
                  <option value="Computer Vision Specialist Role">Computer Vision Specialist Role</option>
                  <option value="Agentic RAG / LLM Infrastructure Role">Agentic RAG / LLM Infrastructure Role</option>
                  <option value="Academic Collaboration & Research">Academic Collaboration & Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brief Message & Timeline
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce the project scope, technical expectations, or schedule an initial discussion..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Prepare & Send Direct Email to Lohith</span>
              </button>

              {submitted && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Email client opened! If it didn't trigger, feel free to write directly to {PERSONAL_INFO.email}.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
