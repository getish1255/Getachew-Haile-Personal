import React, { useState } from 'react';
import { Menu, X, Sparkles, Lock, ShieldCheck } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface NavbarProps {
  onOpenAIModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIModal, onOpenAdminModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isAdmin } = useContent();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
          >
            {profile.name}
          </a>

          {/* Zone 2: clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              About
            </a>
            <a href="#spatial-explorer" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Study Basins
            </a>
            <a href="#decision-simulator" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              GIS Simulator
            </a>
            <a href="#publications" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Publications
            </a>
            <a href="#gallery" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Gallery
            </a>
            <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Leadership & Research
            </a>
          </nav>

          {/* Zone 3: 1 primary action + Admin & AI affordances */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Admin CMS Trigger */}
            <button
              onClick={onOpenAdminModal}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isAdmin
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
              }`}
              title={isAdmin ? 'Admin CMS: Logged In' : 'Admin CMS Portal'}
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAdmin ? 'Admin' : 'CMS'}</span>
            </button>

            <button
              onClick={onOpenAIModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask Research AI</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdminModal}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-hidden"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            About
          </a>
          <a
            href="#spatial-explorer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Study Basins
          </a>
          <a
            href="#decision-simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            GIS Simulator
          </a>
          <a
            href="#publications"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Publications
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Gallery
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            Leadership & Research
          </a>
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Content Portal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIModal?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800 rounded-lg"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask Research AI</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg"
            >
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
