import React from 'react';
import { Lock, Share2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal }) => {
  const { profile, isAdmin, socialLinks } = useContent();

  return (
    <footer className="py-12 bg-slate-950/90 border-t border-slate-900 text-slate-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div>
            <span className="text-base font-bold text-white tracking-tight">{profile.name}</span>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile.title} · {profile.institution}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#spatial-explorer" className="hover:text-white transition-colors">
              Study Basins
            </a>
            <a href="#decision-simulator" className="hover:text-white transition-colors">
              GIS Simulator
            </a>
            <a href="#publications" className="hover:text-white transition-colors">
              Publications
            </a>
            <a href="#gallery" className="hover:text-white transition-colors">
              Gallery
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Experience
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Dashboard (Active)' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="py-4 border-b border-slate-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Academic & Professional Networks:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {socialLinks.researchgate && (
              <a
                href={socialLinks.researchgate}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                ResearchGate
              </a>
            )}
            {socialLinks.googlescholar && (
              <a
                href={socialLinks.googlescholar}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                Google Scholar
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                X (Twitter)
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                GitHub
              </a>
            )}
            {socialLinks.orcid && (
              <a
                href={socialLinks.orcid}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                ORCID ({profile.orcidId})
              </a>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {profile.name}. All academic, geospatial & leadership rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href={profile.orcid}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              ORCID: {profile.orcidId}
            </a>
            <span>·</span>
            <a
              href={profile.cvPdfUrl}
              download="Getachew_Haile_Curriculum_Vitae.pdf"
              className="hover:text-emerald-400 transition-colors"
            >
              Download CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
