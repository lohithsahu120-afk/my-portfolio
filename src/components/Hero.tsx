import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Sparkles, FileDown, CheckCircle2, Rotate3D, User, Camera, Upload, RefreshCw } from 'lucide-react';
import { PERSONAL_INFO, HIGHLIGHT_METRICS } from '../data/portfolioData';
import { ThreeCanvas } from './ThreeCanvas';

interface HeroProps {
  onOpenResume: () => void;
  onOpenChat: () => void;
  onOpenContact: () => void;
  userPhoto?: string;
  onUpdatePhoto?: (newPhoto: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenResume,
  onOpenChat,
  onOpenContact,
  userPhoto,
  onUpdatePhoto,
}) => {
  // Mode toggle: 3D Movable Scene vs Photo View
  const [heroView, setHeroView] = useState<'3d' | 'photo'>('photo');
  const [currentPhoto, setCurrentPhoto] = useState<string>(userPhoto || PERSONAL_INFO.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D card tilt state for realistic movable photo card
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  useEffect(() => {
    if (userPhoto) {
      setCurrentPhoto(userPhoto);
    }
  }, [userPhoto]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate realistic tilt angles (max +/- 14 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setCurrentPhoto(result);
          if (onUpdatePhoto) {
            onUpdatePhoto(result);
          }
          try {
            localStorage.setItem('user_custom_photo', result);
          } catch (err) {
            console.error('Storage quota exceeded:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setCurrentPhoto(PERSONAL_INFO.photo);
    if (onUpdatePhoto) {
      onUpdatePhoto(PERSONAL_INFO.photo);
    }
    localStorage.removeItem('user_custom_photo');
  };

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split-Screen Hero: Typographic Pitch on Left, 3D Movable Studio / Photo on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Typographic Hierarchy & Candidate Credentials */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Clean Unboxed Kicker with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400 mb-4">
              <span>{PERSONAL_INFO.program}</span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
              <span>Roll: {PERSONAL_INFO.rollNumber}</span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
              <span>{PERSONAL_INFO.batch}</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 [text-wrap:balance]">
              Engineering Scalable Vision Models & Agentic AI Architectures
            </h1>

            {/* Lead Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
              I am Lohith Sahu, an AI engineer and deep learning researcher graduating in 2026. My work bridges multimodal clinical diagnostics with localized Grad-CAM heatmaps, sub-5W TensorRT edge spatial perception for robotics, and enterprise knowledge graph RAG.
            </p>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap"
              >
                <span>Explore Flagship Works</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all whitespace-nowrap"
              >
                <FileDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Portfolio Resume (PDF)</span>
              </button>

              <button
                onClick={onOpenChat}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Ask Lohith AI</span>
              </button>
            </div>

            {/* Candidate Availability Status */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Available for Summer 2026 Internships & 2026 Graduating Full-Time Engineering & Research Roles</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Movable Rig / Realistic 3D Photo Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* View Mode Switcher Header */}
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {heroView === 'photo' ? 'Photographic & 3D Tilt View' : 'Interactive 3D Movable Rig'}
                </span>
              </div>

              {/* Functional View Mode Toggle Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <button
                  onClick={() => setHeroView('photo')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    heroView === 'photo'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Photo</span>
                </button>
                <button
                  onClick={() => setHeroView('3d')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    heroView === '3d'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Rotate3D className="w-3.5 h-3.5" />
                  <span>3D Realistic Core</span>
                </button>
              </div>
            </div>

            {/* Container */}
            {heroView === '3d' ? (
              /* 3D Realistic Movable Scene (Three.js with OrbitControls, 360 rotation, exploded view) */
              <div className="w-full animate-fade-in">
                <ThreeCanvas />
              </div>
            ) : (
              /* Realistic 3D Movable Tilt Photo Card */
              <div className="w-full flex flex-col items-center animate-fade-in">
                <div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    perspective: '1200px',
                  }}
                  className="w-full max-w-md cursor-pointer select-none"
                >
                  <div
                    style={{
                      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl group"
                  >
                    {/* Realistic Specular Glare Overlay reacting to mouse movement */}
                    <div
                      style={{
                        background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 80%)`,
                      }}
                      className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-300 opacity-90"
                    />

                    {/* Lohith's Photo */}
                    <img
                      src={currentPhoto}
                      alt="Lohith Sahu - AI Engineer & Researcher"
                      className="w-full h-[460px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Holographic Top Identification Badge */}
                    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                      <div className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 font-mono text-[11px] text-blue-300">
                        2026BTAI036
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>Interactive 3D Tilt</span>
                      </div>
                    </div>

                    {/* Bottom Metadata Plate */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {PERSONAL_INFO.name}
                          </h3>
                          <div className="text-xs text-blue-400 font-medium mt-0.5">
                            {PERSONAL_INFO.program} · {PERSONAL_INFO.batch}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-emerald-400 font-semibold tabular-nums">
                            CGPA 9.22
                          </span>
                          <span className="block text-[10px] text-slate-400">Dean’s List</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Move mouse to tilt photo in 3D space</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setHeroView('3d');
                          }}
                          className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                        >
                          <span>Open 3D Rig</span>
                          <Rotate3D className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Customizer Bar (Allows user to upload or reset their real photo anytime) */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload / Swap My Photo</span>
                  </button>

                  {currentPhoto !== PERSONAL_INFO.photo && (
                    <button
                      onClick={handleResetPhoto}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Original</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-Width Row Below the Split: Quantitative Proof Metrics Strip */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {HIGHLIGHT_METRICS.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  <span>{metric.value}</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{metric.unit}</span>
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
