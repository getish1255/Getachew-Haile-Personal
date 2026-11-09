import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Network,
  CheckCircle2,
  Users,
  Building,
  UserCheck,
  Mail,
  Phone,
} from 'lucide-react';
import {
  EXPERIENCE_LIST,
  PROFILE_DATA,
  CORE_COMPETENCIES,
  TECHNICAL_STACK,
  TRAINING_DELIVERED,
  TRAINING_ATTENDED,
} from '../data/cvData';

export const ExperienceTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leadership' | 'research' | 'education' | 'skills'>('leadership');

  return (
    <section id="experience" className="py-20 border-b border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Career Trajectory</span>
              <span aria-hidden="true">·</span>
              <span>15+ Years at IQQO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Executive Leadership & Scientific Track
            </h2>
          </div>
          <p className="max-w-xl text-sm sm:text-base text-slate-300">
            A dual career combining institutional ICT governance and data center modernization with cutting-edge
            geospatial research and agricultural data modeling.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'leadership'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            ICT Directorate Leadership
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'research'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Geospatial & Remote Sensing Research
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'skills'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Technical Stack & Competencies
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'education'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Education & Training
          </button>
        </div>

        {/* Tab 1: ICT Leadership */}
        {activeTab === 'leadership' && (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-emerald-400">February 2010 – Present (15+ Years)</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                    Director, ICT Directorate
                  </h3>
                  <p className="text-sm text-slate-300 font-medium mt-0.5">
                    Oromia Agricultural Research Institute (IQQO), Ethiopia
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-medium">
                  <Network className="w-4 h-4 text-emerald-400" />
                  <span>Executive ICT Role</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                  {EXPERIENCE_LIST[0].summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Strategic Duties */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Executive Responsibilities</span>
                    </h4>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {EXPERIENCE_LIST[0].duties.map((duty, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Achievements */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span>Key Leadership Milestones</span>
                    </h4>
                    <div className="space-y-3">
                      {EXPERIENCE_LIST[0].achievements.map((ach, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GIS & Remote Sensing Research */}
        {activeTab === 'research' && (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-emerald-400">Natural Resources Research Directorate</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                    Senior GIS & Remote Sensing Researcher
                  </h3>
                  <p className="text-sm text-slate-300 font-medium mt-0.5">
                    Oromia Agricultural Research Institute (IQQO)
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-medium">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Earth Observation & ML</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                  {EXPERIENCE_LIST[1].summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Research Activities */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Scientific Research Scope</span>
                    </h4>
                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {EXPERIENCE_LIST[1].duties.map((duty, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Highlights */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400" />
                      <span>Key Research Contributions</span>
                    </h4>
                    <div className="space-y-3">
                      {EXPERIENCE_LIST[1].achievements.map((ach, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Technical Stack & Core Competencies */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CORE_COMPETENCIES.map((comp, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md">
                  <h4 className="text-base font-bold text-white mb-2">{comp.title}</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{comp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Stack Grid */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6">
                Technical Tooling & Software Stack
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TECHNICAL_STACK.map((group, idx) => (
                  <div key={idx} className="space-y-3">
                    <span className="text-xs font-mono font-medium text-emerald-400 block border-b border-slate-800 pb-1.5">
                      {group.category}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {group.tools.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Education & Training */}
        {activeTab === 'education' && (
          <div className="space-y-8">
            {/* Academic Degrees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROFILE_DATA.education.map((edu, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-medium">{edu.year}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">Degree</span>
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{edu.degree}</h4>
                  <p className="text-sm text-slate-300 font-medium">{edu.institution}</p>
                  <p className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    {edu.details}
                  </p>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Focus:</strong> {edu.focus}
                  </p>
                </div>
              ))}
            </div>

            {/* Training Delivered vs Attended */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Training Delivered */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Specialized Training Delivered</span>
                </h4>
                <div className="space-y-2.5">
                  {TRAINING_DELIVERED.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                      <p className="font-semibold text-slate-200">{t.topic}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">Audience: {t.audience}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Attended */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Professional Training Attended</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {TRAINING_ATTENDED.map((t, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Institutional References Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Verified Institutional References</h3>
              <p className="text-xs text-slate-400">From the Oromia Agricultural Research Institute & Bureau of Agriculture</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">3 Listed in Official CV</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROFILE_DATA.references.map((ref, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">{ref.name}</h4>
                </div>
                <p className="text-xs font-medium text-emerald-300">{ref.role}</p>
                <p className="text-xs text-slate-400 mb-3">{ref.organization}</p>
                <div className="pt-3 border-t border-slate-800 text-xs space-y-1 text-slate-400">
                  <a href={`mailto:${ref.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{ref.email}</span>
                  </a>
                  <a href={`tel:${ref.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{ref.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
