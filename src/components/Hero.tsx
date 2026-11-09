import React from 'react';
import { Download, Mail, MapPin, Sparkles, Compass, Share2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HeroProps {
  onOpenAIModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAIModal }) => {
  const { profile, publications, studyRegions, socialLinks } = useContent();

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800/80 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Natural editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-4 tracking-wider uppercase">
              <span>Director, ICT Directorate</span>
              <span aria-hidden="true">·</span>
              <span>GIS & Remote Sensing Researcher</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-6 text-balance">
              Advancing Geospatial Intelligence & Digital Agriculture in Ethiopia
            </h1>

            {/* Body lead copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              {profile.summary || (
                <>
                  Combining over 15 years of institutional ICT executive leadership at the{' '}
                  <span className="text-white font-medium">{profile.institution}</span> with pioneering applied
                  research in satellite remote sensing, multi-criteria spatial modeling (AHP), soil fertility
                  mapping, and machine-learning decision support systems.
                </>
              )}
            </p>

            {/* Clean unboxed metadata strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400 mb-6 border-y border-slate-800/90 py-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{profile.location}</span>
              </span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{profile.email}</span>
              </a>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <a
                href={profile.orcid}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#A6CE39] text-slate-950 font-bold text-[9px] flex items-center justify-center">
                  iD
                </span>
                <span>ORCID: {profile.orcidId}</span>
              </a>
            </div>

            {/* Social Media & Research Profiles Strip */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mr-1">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connect:</span>
              </span>

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                  title="LinkedIn Profile"
                >
                  <span className="font-bold text-[#0A66C2]">in</span>
                  <span>LinkedIn</span>
                </a>
              )}

              {socialLinks.researchgate && (
                <a
                  href={socialLinks.researchgate}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                  title="ResearchGate Profile"
                >
                  <span className="font-bold text-[#00CCBB]">RG</span>
                  <span>ResearchGate</span>
                </a>
              )}

              {socialLinks.googlescholar && (
                <a
                  href={socialLinks.googlescholar}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                  title="Google Scholar Citations"
                >
                  <span className="font-bold text-[#4285F4]">GS</span>
                  <span>Google Scholar</span>
                </a>
              )}

              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  title="Twitter / X Profile"
                >
                  <span className="font-bold text-white">𝕏</span>
                  <span>X (Twitter)</span>
                </a>
              )}

              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  title="GitHub Profile"
                >
                  <span className="font-bold text-slate-200">GH</span>
                  <span>GitHub</span>
                </a>
              )}

              {socialLinks.orcid && (
                <a
                  href={socialLinks.orcid}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-[#A6CE39] transition-colors flex items-center gap-1.5"
                  title="ORCID Record"
                >
                  <span className="font-bold text-[#A6CE39]">iD</span>
                  <span>ORCID</span>
                </a>
              )}
            </div>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#spatial-explorer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Explore Study Basins</span>
              </a>
              <button
                onClick={onOpenAIModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-emerald-300 bg-slate-900 hover:bg-slate-800/80 border border-slate-700 rounded-lg transition-all whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Ask Research AI</span>
              </button>
              <a
                href={profile.cvPdfUrl}
                download="Getachew_Haile_Curriculum_Vitae.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Download original verified CV as PDF"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Download CV (PDF)</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Fidelity Photo Container */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Decorative corner framing */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-slate-800/30 to-cyan-500/20 blur-sm pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl">
                {/* Photo of Getachew Haile */}
                <div className="aspect-4/5 relative overflow-hidden bg-slate-950">
                  <img
                    src={profile.photoUrl}
                    alt={`${profile.name}, ${profile.title}`}
                    className="w-full h-full object-cover object-[center_20%] filter contrast-[1.04] brightness-[1.01]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/public/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg';
                    }}
                  />
                  {/* Subtle lower gradient overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

                  {/* Identification overlay without IQQO badge next to name */}
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <p className="text-base font-bold text-white tracking-tight">{profile.name}</p>
                    <p className="text-xs text-emerald-400 font-medium">{profile.title}</p>
                  </div>
                </div>

                {/* Sub-card quick info */}
                <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Addis Ababa University</span>
                    <span className="text-slate-200 font-medium">MSc GeoSpatial & Remote Sensing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Haramaya University</span>
                    <span className="text-slate-200 font-medium">BSc Computer Science & IT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width KPI strip below the split */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex flex-col">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono tabular-nums text-white tracking-tight">
                15+
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Years of ICT Leadership
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Enterprise Infrastructure & Geospatial
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono tabular-nums text-emerald-400 tracking-tight">
                {publications.length}+
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Peer-Reviewed Publications
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Rainwater, Agroforestry & Soils
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono tabular-nums text-cyan-400 tracking-tight">
                {studyRegions.length}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Regional Basins Modeled
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Arsi, Genale-Dawa, Bale, Weyib & Rift
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl lg:text-4xl font-extrabold font-mono tabular-nums text-amber-400 tracking-tight">
                100%
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Ground-Truthed Decision Systems
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                National Soil Digital Support Tool
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
