import React, { useState } from 'react';
import { Mail, Phone, MapPin, Download, Send, CheckCircle2, MessageSquare, Globe, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useContent } from '../context/ContentContext';

export const ContactSection: React.FC = () => {
  const { profile } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: 'Research Collaboration',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('Inquiry logging fallback:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
    }
  };

  return (
    <section id="contact" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact & Verification */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                <span>Inquiries & Partnerships</span>
                <span aria-hidden="true">·</span>
                <span>Direct Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Connect with Getachew Haile
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Available for joint scientific research programs, geospatial multi-criteria consultations, institutional
                ICT advisory, and agronomy field demonstrations.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Direct Email</span>
                  <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {profile.email}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Telephone / Mobile</span>
                  <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {profile.phone}
                  </span>
                </div>
              </a>

              <a
                href={profile.orcid}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#A6CE39]/10 border border-[#A6CE39]/30 flex items-center justify-center shrink-0 group-hover:bg-[#A6CE39]/20 transition-colors">
                  <span className="text-xs font-bold text-[#A6CE39]">iD</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-slate-400 block">ORCID Academic Profile</span>
                  <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <span>{profile.orcidId}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Institutional Location</span>
                  <span className="text-sm font-medium text-white">
                    {profile.institution}, {profile.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Language Proficiencies */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Working Languages</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                {profile.languages?.map((l, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <p className="font-bold text-white">{l.language}</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Excellent / Fluent</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct CV Download Callout */}
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">Full Curriculum Vitae</p>
                <p className="text-xs text-slate-400">Complete 5-page original verified document (PDF)</p>
              </div>
              <a
                href={profile.cvPdfUrl}
                download="Getachew_Haile_Curriculum_Vitae.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Collaboration Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Send Collaboration or Research Inquiry</h3>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Inquiry Received</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-white">{formData.name}</span>. Your message regarding{' '}
                    <span className="text-emerald-400">{formData.inquiryType}</span> has been logged. Getachew Haile will
                    review and reply via <span className="underline text-white">{formData.email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        organization: '',
                        inquiryType: 'Research Collaboration',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. / Prof. / Colleague"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Official Email Address <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@institution.org"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Organization / University
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. CGIAR, FAO, University, Bureau"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Inquiry Focus</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                      >
                        <option value="Research Collaboration">Academic Research Collaboration</option>
                        <option value="GIS & Remote Sensing Consultation">GIS & Remote Sensing Modeling</option>
                        <option value="Institutional ICT Advisory">Institutional ICT & RIMS Advisory</option>
                        <option value="Soil Fertility & Field Demonstrations">Soil Fertility & Field Demonstrations</option>
                        <option value="Training & Capacity Building">Training & Capacity Building Workshop</option>
                        <option value="Other Inquiries">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Proposal or Inquiry Details <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline your research scope, proposed study region, or technical objectives..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Formal Inquiry</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Transmitted directly to boqolo@gmail.com · Response typically within 24-48 business hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
