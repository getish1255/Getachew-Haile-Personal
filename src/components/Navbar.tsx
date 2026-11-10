import React, { useState } from 'react';
import { Menu, X, Sparkles, Lock, ShieldCheck, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/translations';

interface NavbarProps {
  onOpenAIModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIModal, onOpenAdminModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isAdmin, language, setLanguage, t } = useContent();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
          >
            {profile.name}
          </a>

          {/* Zone 2: clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.about', 'About')}
            </a>
            <a href="#spatial-explorer" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.basins', 'Study Basins')}
            </a>
            <a href="#decision-simulator" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.simulator', 'GIS Simulator')}
            </a>
            <a href="#publications" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.publications', 'Publications')}
            </a>
            <a href="#gallery" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.gallery', 'Gallery')}
            </a>
            <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              {t('nav.experience', 'Leadership & Research')}
            </a>
          </nav>

          {/* Zone 3: Language switcher + Admin + AI + CTA */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Language Switcher Segmented Control */}
            <div
              className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 shadow-xs"
              title="Change Language: English / Afaan Oromoo / አማርኛ"
            >
              <div className="pl-1.5 pr-1 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    language === lang.code
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${lang.label} (${lang.nativeLabel})`}
                >
                  <span className="font-mono">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>

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
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">{t('nav.askAI', 'Ask Research AI')}</span>
              <span className="lg:hidden">AI</span>
            </button>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <span>{t('nav.contact', 'Get in Touch')}</span>
            </a>
          </div>

          {/* Mobile hamburger button + mobile quick language button */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile language compact toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                    language === lang.code
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

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
          {/* Full Language Selector in Mobile Drawer */}
          <div className="pb-3 border-b border-slate-800/80">
            <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language / Afaan / ቋንቋ:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                    language === lang.code
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.about', 'About')}
          </a>
          <a
            href="#spatial-explorer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.basins', 'Study Basins')}
          </a>
          <a
            href="#decision-simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.simulator', 'GIS Simulator')}
          </a>
          <a
            href="#publications"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.publications', 'Publications')}
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.gallery', 'Gallery')}
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-300 hover:text-white"
          >
            {t('nav.experience', 'Leadership & Research')}
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
              <span>{t('nav.askAI', 'Ask Research AI')}</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg"
            >
              <span>{t('nav.contact', 'Get in Touch')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
