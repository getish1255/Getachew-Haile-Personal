/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { InteractiveSpatialExplorer } from './components/InteractiveSpatialExplorer';
import { InteractiveDecisionSimulator } from './components/InteractiveDecisionSimulator';
import { PublicationsSection } from './components/PublicationsSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ResearchAIAssistant } from './components/ResearchAIAssistant';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeBackground } from './components/ThreeBackground';
import { AdminModal } from './components/admin/AdminModal';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Keyboard shortcut: Alt+A or Ctrl+Shift+A opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Interactive 3D Spline / Three.js Canvas Background */}
      <ThreeBackground />

      {/* Top Bar Navigation with Admin Trigger */}
      <Navbar
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* Hero Section with Split-Screen & Portrait */}
        <Hero onOpenAIModal={() => setIsAIModalOpen(true)} />

        {/* About & Institutional Career Highlights */}
        <AboutSection />

        {/* Interactive Spatial Study Basins & Topography Map */}
        <InteractiveSpatialExplorer />

        {/* Interactive AHP Multi-Criteria Suitability Simulator */}
        <InteractiveDecisionSimulator />

        {/* Peer-Reviewed Publications & Theses Repository with BibTeX / RIS Exports */}
        <PublicationsSection />

        {/* Visual Evidence & Fieldwork Photo Gallery */}
        <PhotoGallerySection />

        {/* In-Page Interactive AI Research Assistant & Proposal Builder */}
        <section id="ai-assistant-section" className="py-20 border-b border-slate-800/80 bg-slate-950/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Knowledge Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Engage with Getachew’s Research Assistant
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Ask specific questions about spatial decision methods, soil recommendations in Ethiopia, or draft a
                joint research concept note in seconds.
              </p>
            </div>

            <div className="h-[620px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <ResearchAIAssistant />
            </div>
          </div>
        </section>

        {/* Executive ICT Leadership & Research Timeline */}
        <ExperienceTimeline />

        {/* Contact & Collaboration Dispatch */}
        <ContactSection />
      </main>

      {/* Quiet, Clean Footer with Admin Portal trigger */}
      <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      {/* Floating Quick Action Button for AI Assistant */}
      <button
        onClick={() => setIsAIModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-400 text-slate-950 font-bold shadow-2xl hover:bg-emerald-300 hover:scale-105 transition-all text-xs sm:text-sm cursor-pointer"
        aria-label="Open AI Research Assistant"
      >
        <Sparkles className="w-4 h-4 text-slate-950" />
        <span className="hidden sm:inline">Ask Research AI</span>
      </button>

      {/* Modal Popup version of AI Assistant */}
      {isAIModalOpen && (
        <ResearchAIAssistant isModal={true} onClose={() => setIsAIModalOpen(false)} />
      )}

      {/* Admin Content Management Portal Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
