import React, { useState } from 'react';
import { ShieldCheck, Edit3, Camera, X, Save, Check } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { InlineEdit } from './admin/InlineEdit';
import { PhotoUploadField } from './admin/PhotoUploadField';

const DEFAULT_FIELD_TRIAL_IMG = '/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg';

const DEFAULT_ABOUT_NARRATIVE =
  'With over 15 continuous years of institutional leadership at the Oromia Agricultural Research Institute (IQQO), Getachew Haile has stood at the critical nexus where enterprise digital technologies empower frontline agricultural research.\n\nAs Director of the ICT Directorate, he orchestrated the modern digital architecture of the institute—modernizing data center infrastructures, enterprise LAN/WAN networks connecting regional stations, and establishing institutional research information systems (RIMS).\n\nConcurrently, as a Senior GIS & Remote Sensing Researcher within the Natural Resources Research Directorate, Getachew applies advanced satellite image processing, multi-criteria evaluation (AHP), and machine learning to resolve vital hydrological, agroforestry, and soil fertility questions across Oromia and Central Ethiopia.';

export const AboutSection: React.FC = () => {
  const { profile, updateProfile, isAdmin, t } = useContent();

  const [isEditingPhotoModal, setIsEditingPhotoModal] = useState(false);
  const [photoUrlDraft, setPhotoUrlDraft] = useState('');
  const [photoTitleDraft, setPhotoTitleDraft] = useState('');
  const [photoCaptionDraft, setPhotoCaptionDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const narrativeText = profile.aboutNarrative || DEFAULT_ABOUT_NARRATIVE;
  const currentPhotoUrl = profile.fieldTrialPhotoUrl || DEFAULT_FIELD_TRIAL_IMG;
  const currentPhotoTitle = profile.fieldTrialPhotoTitle || 'IQQO Agronomy & Natural Resource Trials';
  const currentPhotoCaption = profile.fieldTrialPhotoCaption || 'Tef fertilization & soil moisture monitoring';

  const handleOpenPhotoModal = () => {
    setPhotoUrlDraft(currentPhotoUrl);
    setPhotoTitleDraft(currentPhotoTitle);
    setPhotoCaptionDraft(currentPhotoCaption);
    setIsEditingPhotoModal(true);
    setSaveSuccess(false);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fieldTrialPhotoUrl: photoUrlDraft || DEFAULT_FIELD_TRIAL_IMG,
        fieldTrialPhotoTitle: photoTitleDraft.trim() || 'IQQO Agronomy & Natural Resource Trials',
        fieldTrialPhotoCaption: photoCaptionDraft.trim() || 'Tef fertilization & soil moisture monitoring',
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditingPhotoModal(false);
        setSaveSuccess(false);
      }, 700);
    } catch (err) {
      console.error('Failed to update field trial photo:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="about" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Photography & Research Story */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
              <div className="aspect-4/3 relative overflow-hidden bg-slate-950">
                <img
                  src={currentPhotoUrl}
                  alt="Agricultural field trials of tef crops with precision soil monitoring in Oromia, Ethiopia"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackCount) {
                      target.dataset.fallbackCount = '1';
                      target.src = '/public/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg';
                    } else if (target.dataset.fallbackCount === '1') {
                      target.dataset.fallbackCount = '2';
                      target.src = '/src/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg';
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

                {/* Admin Quick Edit Button */}
                {isAdmin && (
                  <button
                    onClick={handleOpenPhotoModal}
                    className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg transition-all transform hover:scale-105"
                    title="Edit Field Trial Photo & Caption"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Edit Photo</span>
                  </button>
                )}

                {/* Photo Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{currentPhotoTitle}</p>
                    {isAdmin && (
                      <button
                        onClick={handleOpenPhotoModal}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono underline ml-2 shrink-0"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-0.5">{currentPhotoCaption}</p>
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

            {/* In-page Editable Bio Narrative */}
            <div className="space-y-4">
              <InlineEdit
                value={narrativeText}
                onSave={(val) => updateProfile({ aboutNarrative: val })}
                multiline={true}
                as="div"
                label="Executive Narrative"
                className="text-sm sm:text-base text-slate-300 leading-relaxed block whitespace-pre-line"
              />
            </div>

            {/* 3 Core Impact Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-emerald-400">01. Strategy</span>
                <p className="text-xs font-bold text-white">{t('about.h1', 'Institutional Transformation')}</p>
                <p className="text-[11px] text-slate-400">{t('about.h1Desc', '15+ years formulating ICT policy and data governance.')}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-cyan-400">02. Spatial Science</span>
                <p className="text-xs font-bold text-white">{t('about.h2', 'AHP & Remote Sensing')}</p>
                <p className="text-[11px] text-slate-400">{t('about.h2Desc', 'Multi-criteria models for rainwater and groundwater.')}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-mono text-purple-400">{t('about.h3Badge', '03. Machine Learning and GeoAI')}</span>
                <p className="text-xs font-bold text-white">{t('about.h3Title', 'Predictive Spatial Modeling')}</p>
                <p className="text-[11px] text-slate-400">{t('about.h3Desc', 'Satellite computer vision, deep spatial analytics, and AI-driven soil-climate decision matrices.')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Field Trial Photo Modal */}
      {isEditingPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Edit Agricultural Field Trial Photo</h3>
              </div>
              <button
                onClick={() => setIsEditingPhotoModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-5">
              {/* Photo Selector / Uploader */}
              <PhotoUploadField
                value={photoUrlDraft}
                onChange={setPhotoUrlDraft}
                label="Field Trial Photograph (Upload or Choose Research Preset)"
              />

              {/* Photo Title */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Overlay Title
                </label>
                <input
                  type="text"
                  value={photoTitleDraft}
                  onChange={(e) => setPhotoTitleDraft(e.target.value)}
                  placeholder="e.g. IQQO Agronomy & Natural Resource Trials"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              {/* Photo Caption */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Sub-Caption / Details
                </label>
                <input
                  type="text"
                  value={photoCaptionDraft}
                  onChange={(e) => setPhotoCaptionDraft(e.target.value)}
                  placeholder="e.g. Tef fertilization & soil moisture monitoring in Oromia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              {/* Live Card Preview */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Live Preview
                </label>
                <div className="aspect-4/3 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-w-md mx-auto">
                  <img
                    src={photoUrlDraft || DEFAULT_FIELD_TRIAL_IMG}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
                    <p className="font-bold text-white">{photoTitleDraft || 'IQQO Agronomy & Natural Resource Trials'}</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      {photoCaptionDraft || 'Tef fertilization & soil moisture monitoring'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoUrlDraft(DEFAULT_FIELD_TRIAL_IMG);
                    setPhotoTitleDraft('IQQO Agronomy & Natural Resource Trials');
                    setPhotoCaptionDraft('Tef fertilization & soil moisture monitoring');
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Reset to Default
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingPhotoModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shadow-md"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved & Synced!</span>
                      </>
                    ) : isSaving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
