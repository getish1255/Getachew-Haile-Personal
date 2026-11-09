import React from 'react';
import { ShieldCheck, Database, Cpu, Compass, Layers, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const FIELD_TRIAL_IMG = '/src/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg';

export const AboutSection: React.FC = () => {
  const { profile } = useContent();
  return (
    <section id="about" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Photography & Research Story */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
              <div className="aspect-4/3 relative overflow-hidden bg-slate-950">
                <img
                  src={FIELD_TRIAL_IMG}
                  alt="Agricultural field trials of tef crops with precision soil monitoring in Oromia, Ethiopia"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/25 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
                  <p className="font-bold text-white">IQQO Agronomy & Natural Resource Trials</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">Tef fertilization & soil moisture monitoring</p>
                </div>
              </div>
            </div>

            {/* Institutional Membership Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Professional Standing & Policy Impact</span>
              </div>
              <h4 className="text-sm font-bold text-white">National Soil Digital Support Tool</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Appointed contributor delivering spatial decision matrices and digital soil fertility information
                systems to inform smallholder fertilizer recommendations and sustainable land management in Ethiopia.
              </p>
            </div>
          </div>

          {/* Right Column: Bio Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                <span>Executive & Scientific Profile</span>
                <span aria-hidden="true">·</span>
                <span>Oromia Agricultural Research Institute</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Pioneering Evidence-Based Decision Systems for Sustainable Agriculture
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              With over 15 continuous years of institutional leadership at the{' '}
              <strong className="text-white">Oromia Agricultural Research Institute (IQQO)</strong>, Getachew Haile has
              stood at the critical nexus where enterprise digital technologies empower frontline agricultural
              research.
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              As <strong className="text-white">Director of the ICT Directorate</strong>, he orchestrated the modern
              digital architecture of the institute—modernizing data center infrastructures, enterprise LAN/WAN networks
              connecting regional stations, and establishing institutional research information systems (RIMS).
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Concurrently, as a <strong className="text-white">Senior GIS & Remote Sensing Researcher</strong> within the
              Natural Resources Research Directorate, Getachew applies advanced satellite image processing,
              multi-criteria evaluation (AHP), and machine learning to resolve vital hydrological, agroforestry, and soil
              fertility questions across Oromia and Central Ethiopia.
            </p>

            {/* 3 Core Impact Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-emerald-400">01. Strategy</span>
                <p className="text-xs font-bold text-white">Institutional Transformation</p>
                <p className="text-[11px] text-slate-400">15+ years formulating ICT policy and data governance.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-cyan-400">02. Spatial Science</span>
                <p className="text-xs font-bold text-white">AHP & Remote Sensing</p>
                <p className="text-[11px] text-slate-400">Multi-criteria models for rainwater and groundwater.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-amber-400">03. Food Security</span>
                <p className="text-xs font-bold text-white">Soil & Tef Nutrition</p>
                <p className="text-[11px] text-slate-400">Field demonstrations and organic bio-fertilizer optimization.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
