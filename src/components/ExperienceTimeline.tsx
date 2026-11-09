import React, { useState, useEffect } from 'react';
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
  Edit3,
} from 'lucide-react';
import {
  EXPERIENCE_LIST,
  PROFILE_DATA,
  CORE_COMPETENCIES,
  TECHNICAL_STACK,
  TRAINING_DELIVERED,
  TRAINING_ATTENDED,
} from '../data/cvData';
import { useContent } from '../context/ContentContext';
import { InlineEdit } from './admin/InlineEdit';

export const ExperienceTimeline: React.FC = () => {
  const { isAdmin } = useContent();
  const [activeTab, setActiveTab] = useState<'leadership' | 'research' | 'education' | 'skills'>('leadership');

  // Local state for editable role summaries
  const [leadershipSummary, setLeadershipSummary] = useState(() => {
    return localStorage.getItem('iqqo_exp_leadership_summary') || EXPERIENCE_LIST[0].summary;
  });

  const [researchSummary, setResearchSummary] = useState(() => {
    return localStorage.getItem('iqqo_exp_research_summary') || EXPERIENCE_LIST[1].summary;
  });

  const [leadershipTitle, setLeadershipTitle] = useState(() => {
    return localStorage.getItem('iqqo_exp_leadership_title') || EXPERIENCE_LIST[0].role;
  });

  const [researchTitle, setResearchTitle] = useState(() => {
    return localStorage.getItem('iqqo_exp_research_title') || EXPERIENCE_LIST[1].role;
  });

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
                  <InlineEdit
                    value={leadershipTitle}
                    onSave={(val) => {
                      setLeadershipTitle(val);
                      localStorage.setItem('iqqo_exp_leadership_title', val);
                    }}
                    as="h3"
                    label="Executive Role Title"
                    className="text-2xl font-bold text-white tracking-tight mt-1 block"
                  />
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
                <InlineEdit
                  value={leadershipSummary}
                  onSave={(val) => {
                    setLeadershipSummary(val);
                    localStorage.setItem('iqqo_exp_leadership_summary', val);
                  }}
                  multiline={true}
                  as="div"
                  label="Role Summary"
                  className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 block"
                />

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
                  <InlineEdit
                    value={researchTitle}
                    onSave={(val) => {
                      setResearchTitle(val);
                      localStorage.setItem('iqqo_exp_research_title', val);
                    }}
                    as="h3"
                    label="Researcher Title"
                    className="text-2xl font-bold text-white tracking-tight mt-1 block"
                  />
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
                <InlineEdit
                  value={researchSummary}
                  onSave={(val) => {
                    setResearchSummary(val);
                    localStorage.setItem('iqqo_exp_research_summary', val);
                  }}
                  multiline={true}
                  as="div"
                  label="Research Overview"
                  className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 block"
                />

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {TECHNICAL_STACK.map((group, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left hover:border-emerald-500/50 transition-colors col-span-1 sm:col-span-1 lg:col-span-3"
                  >
                    <span className="text-[11px] font-mono text-emerald-400 block mb-2 font-bold">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Education & Training */}
        {activeTab === 'education' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MSc Degree */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg relative">
                <span className="text-xs font-mono text-emerald-400">2014 – 2017</span>
                <h4 className="text-lg font-bold text-white mt-1">
                  Master of Science (MSc) in Geo-Spatial & Remote Sensing
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Addis Ababa University, College of Natural & Computational Sciences
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <p>
                    <strong className="text-slate-300">Thesis:</strong> GIS-based approach for identification of
                    potential rainwater harvesting sites in Arsi Zone, Central Ethiopia.
                  </p>
                  <p className="text-emerald-400 font-mono text-[11px]">Completed with High Distinction</p>
                </div>
              </div>

              {/* BSc Degree */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg relative">
                <span className="text-xs font-mono text-emerald-400">2006 – 2009</span>
                <h4 className="text-lg font-bold text-white mt-1">
                  Bachelor of Science (BSc) in Computer Science & IT
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Haramaya University, College of Computing and Informatics
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <p>
                    <strong className="text-slate-300">Curriculum:</strong> Database systems, enterprise network
                    architecture, algorithms, software engineering, and spatial computing fundamentals.
                  </p>
                  <p className="text-emerald-400 font-mono text-[11px]">Graduated with Honors</p>
                </div>
              </div>
            </div>

            {/* Trainings Delivered vs Attended */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Key Capacity Trainings Delivered</span>
                </h4>
                <ul className="space-y-3 text-xs text-slate-300">
                  {TRAINING_DELIVERED.map((t, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <p className="font-semibold text-white">{t.topic}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{t.audience}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <span>Advanced Professional Certifications</span>
                </h4>
                <ul className="space-y-3 text-xs text-slate-300">
                  {TRAINING_ATTENDED.map((cert, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <p className="font-semibold text-white text-xs">{cert}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
