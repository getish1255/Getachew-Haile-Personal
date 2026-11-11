import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Check,
  AlertCircle,
  BookOpen,
  MapPin,
  Mail,
  User,
  Settings,
  Share2,
  Image,
  KeyRound,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useContent, SocialLinks, PhotoGalleryItem } from '../../context/ContentContext';
import { Publication, StudyRegion } from '../../data/cvData';
import { PhotoUploadField } from './PhotoUploadField';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'profile' | 'social' | 'gallery' | 'publications' | 'basins' | 'inquiries' | 'backup';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    publications,
    studyRegions,
    socialLinks,
    photoGallery,
    isAdmin,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updateSocialLinks,
    addPublication,
    editPublication,
    deletePublication,
    addStudyRegion,
    editStudyRegion,
    deleteStudyRegion,
    addPhotoGalleryItem,
    editPhotoGalleryItem,
    deletePhotoGalleryItem,
    fetchInquiries,
    deleteInquiry,
    importBackup,
  } = useContent();

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Forgot password flow state
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isRequestingPin, setIsRequestingPin] = useState(false);
  const [pinSentMessage, setPinSentMessage] = useState<string | null>(null);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);

  // Social Links Form State
  const [socialForm, setSocialForm] = useState<SocialLinks>(socialLinks);

  // Inquiries State
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [_isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Publication Form Modal State
  const [editingPub, setEditingPub] = useState<Partial<Publication> | null>(null);
  const [isNewPub, setIsNewPub] = useState(false);

  // Study Basin Form Modal State
  const [editingBasin, setEditingBasin] = useState<Partial<StudyRegion> | null>(null);
  const [isNewBasin, setIsNewBasin] = useState(false);

  // Photo Gallery Form Modal State
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoGalleryItem> | null>(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);

  // Sync states when context changes
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    setSocialForm(socialLinks);
  }, [socialLinks]);

  // Load inquiries when switching to inquiries tab
  useEffect(() => {
    if (isAdmin && activeTab === 'inquiries') {
      setIsLoadingInquiries(true);
      fetchInquiries().then((data) => {
        setInquiriesList(data);
        setIsLoadingInquiries(false);
      });
    }
  }, [isAdmin, activeTab]);

  if (!isOpen) return null;

  const triggerSaveNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    const res = await login(password);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify your administrative passcode.');
    } else {
      setPassword('');
    }
  };

  const handleRequestPin = async () => {
    setIsRequestingPin(true);
    setResetError('');
    setPinSentMessage(null);
    const res = await forgotPassword();
    setIsRequestingPin(false);
    if (res.success) {
      setPinSentMessage(res.message || 'Verification PIN dispatched to boqolo@gmail.com only.');
      if (res.devPin) {
        // Helpful dev cue if running in sandbox
        setRecoveryCode(res.devPin);
      }
    } else {
      setResetError(res.message || 'Failed to dispatch verification PIN.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCode.trim()) {
      setResetError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 4) {
      setResetError('New passcode must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passcodes do not match.');
      return;
    }

    setIsResetting(true);
    setResetError('');
    const res = await resetPassword(recoveryCode, newPassword);
    setIsResetting(false);

    if (res.success) {
      setIsForgotMode(false);
      setRecoveryCode('');
      setNewPassword('');
      setConfirmPassword('');
      setPinSentMessage(null);
      triggerSaveNotification('Passcode updated successfully and unlocked.');
    } else {
      setResetError(res.error || 'Verification code invalid or expired.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile(profileForm);
    if (ok) {
      triggerSaveNotification('Profile and biography published live across all browsers.');
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSocialLinks(socialForm);
    if (ok) {
      triggerSaveNotification('Social media profiles updated and published live.');
    }
  };

  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub || !editingPub.title) return;

    if (isNewPub) {
      await addPublication(editingPub);
    } else if (editingPub.id) {
      await editPublication(editingPub.id, editingPub);
    }
    setEditingPub(null);
    triggerSaveNotification('Publication catalog updated.');
  };

  const handleSaveBasin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBasin || !editingBasin.name) return;

    if (isNewBasin) {
      await addStudyRegion(editingBasin);
    } else if (editingBasin.id) {
      await editStudyRegion(editingBasin.id, editingBasin);
    }
    setEditingBasin(null);
    triggerSaveNotification('Study basin record updated.');
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto || !editingPhoto.title || !editingPhoto.imageUrl) return;

    if (isNewPhoto) {
      await addPhotoGalleryItem(editingPhoto);
    } else if (editingPhoto.id) {
      await editPhotoGalleryItem(editingPhoto.id, editingPhoto);
    }
    setEditingPhoto(null);
    triggerSaveNotification('Photo gallery updated and published live.');
  };

  const handleDownloadBackup = () => {
    const backup = {
      profile,
      publications,
      studyRegions,
      socialLinks,
      photoGallery,
      lastUpdated: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `getachew_haile_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        const ok = await importBackup(json);
        if (ok) {
          triggerSaveNotification('System state restored from backup.');
        } else {
          alert('Failed to import backup payload.');
        }
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Administrative Content Portal</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {isAdmin ? 'Authenticated' : 'Protected'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Live content management across all platforms and browsers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={logout}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/60 transition-colors"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isAdmin ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center overflow-y-auto">
            {!isForgotMode ? (
              /* Regular Login Form */
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Director & Researcher CMS</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                  Enter your administrative passcode to manage publications, profile details, photo gallery, and social media.
                </p>

                <form onSubmit={handleLoginSubmit} className="w-full space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Passcode
                    </label>
                    <input
                      type="password"
                      placeholder="Enter administrative passcode"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                      autoFocus
                    />
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn || !password}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isLoggingIn ? 'Verifying...' : 'Unlock CMS Portal'}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setLoginError('');
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Forgot passcode?</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Forgot Passcode / Reset Form strictly tied to boqolo@gmail.com */
              <div className="w-full max-w-md flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Passcode Recovery</h4>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                  For strict security, password recovery verification codes are dispatched strictly to{' '}
                  <strong className="text-emerald-400 font-mono">boqolo@gmail.com</strong> only.
                </p>

                {!pinSentMessage ? (
                  <div className="w-full space-y-4">
                    <button
                      type="button"
                      onClick={handleRequestPin}
                      disabled={isRequestingPin}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isRequestingPin ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching code to boqolo@gmail.com...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Recovery PIN to boqolo@gmail.com</span>
                        </>
                      )}
                    </button>

                    {resetError && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300 text-left">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setIsForgotMode(false)}
                        className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Login</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="w-full space-y-4 text-left">
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{pinSentMessage}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        6-Digit Verification PIN (sent to boqolo@gmail.com)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 849201"
                        maxLength={6}
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono tracking-widest text-emerald-400 placeholder-slate-600 focus:outline-hidden focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Administrative Passcode
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new passcode"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm New Passcode
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new passcode"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-emerald-500"
                        required
                      />
                    </div>

                    {resetError && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{resetError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isResetting}
                      className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 disabled:opacity-50 transition-colors shadow-xs"
                    >
                      {isResetting ? 'Resetting...' : 'Reset Passcode & Unlock'}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotMode(false);
                          setPinSentMessage(null);
                        }}
                        className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Cancel and return to login</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Authenticated CMS Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile & Bio</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'social'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Social Media</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>Photo Gallery ({photoGallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('publications')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'publications'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Publications ({publications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('basins')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'basins'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Study Basins ({studyRegions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inquiries Inbox</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Backup & Export</span>
              </button>
            </div>

            {/* Notification alert banner */}
            {saveSuccess && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {/* Tab Panes */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 1. Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-5 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Official Professional Title</label>
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Institution</label>
                      <input
                        type="text"
                        value={profileForm.institution}
                        onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ORCID ID</label>
                      <input
                        type="text"
                        value={profileForm.orcidId}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            orcidId: e.target.value,
                            orcid: `https://orcid.org/${e.target.value}`,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <PhotoUploadField
                    label="Official Profile Photo (Upload from device, drag & drop, or pick from library)"
                    value={profileForm.photoUrl}
                    onChange={(url) => setProfileForm({ ...profileForm, photoUrl: url })}
                  />

                  {/* Agricultural Field Trial Photo Configuration */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                        About Section · Agricultural Field Trials Photograph
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Tef Crops & Precision Monitoring</span>
                    </div>

                    <PhotoUploadField
                      label="Field Trial Photograph (Oromia Tef Research)"
                      value={profileForm.fieldTrialPhotoUrl || '/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg'}
                      onChange={(url) => setProfileForm({ ...profileForm, fieldTrialPhotoUrl: url })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Photo Overlay Header
                        </label>
                        <input
                          type="text"
                          value={profileForm.fieldTrialPhotoTitle ?? 'IQQO Agronomy & Natural Resource Trials'}
                          onChange={(e) => setProfileForm({ ...profileForm, fieldTrialPhotoTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Photo Overlay Sub-Caption
                        </label>
                        <input
                          type="text"
                          value={profileForm.fieldTrialPhotoCaption ?? 'Tef fertilization & soil moisture monitoring'}
                          onChange={(e) => setProfileForm({ ...profileForm, fieldTrialPhotoCaption: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Executive & Research Profile Summary</label>
                    <textarea
                      rows={4}
                      value={profileForm.summary}
                      onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Profile Changes</span>
                  </button>
                </form>
              )}

              {/* 2. Social Media Links Tab */}
              {activeTab === 'social' && (
                <form onSubmit={handleSaveSocial} className="space-y-5 max-w-3xl">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <h5 className="text-sm font-bold text-white mb-1">Social Media & Scientific Network Profiles</h5>
                    <p className="text-xs text-slate-400">
                      These links appear in the hero header, footer, and contact section across all platforms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={socialForm.linkedin || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ResearchGate Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://researchgate.net/profile/username"
                        value={socialForm.researchgate || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, researchgate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Google Scholar URL</label>
                      <input
                        type="url"
                        placeholder="https://scholar.google.com/citations?user=..."
                        value={socialForm.googlescholar || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, googlescholar: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://x.com/username"
                        value={socialForm.twitter || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={socialForm.github || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">ORCID Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://orcid.org/0000-0003-..."
                        value={socialForm.orcid || ''}
                        onChange={(e) => setSocialForm({ ...socialForm, orcid: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Social Links</span>
                  </button>
                </form>
              )}

              {/* 3. Photo Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400">
                      Total Photos in Interactive Gallery: <strong className="text-white">{photoGallery.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingPhoto({
                          title: '',
                          caption: '',
                          category: 'Field Agronomy',
                          imageUrl: '/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg',
                          date: new Date().getFullYear().toString(),
                        });
                        setIsNewPhoto(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {photoGallery.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden flex flex-col justify-between group"
                      >
                        <div className="relative h-44 bg-slate-900 overflow-hidden">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/public/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-emerald-400 border border-emerald-900/60 backdrop-blur-xs">
                            {photo.category}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300">
                            {photo.date}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-white mb-1">{photo.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                              {photo.caption}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                              {photo.imageUrl}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingPhoto(photo);
                                  setIsNewPhoto(false);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                title="Edit photo details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete "${photo.title}" from gallery?`)) {
                                    await deletePhotoGalleryItem(photo.id);
                                    triggerSaveNotification('Photo removed from gallery.');
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-400 hover:text-rose-300 transition-colors"
                                title="Delete photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Publications Tab */}
              {activeTab === 'publications' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400">
                      Total Published Outputs: <strong className="text-white">{publications.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingPub({
                          title: '',
                          year: new Date().getFullYear().toString(),
                          category: 'hydrology',
                          categoryLabel: 'Rainwater Harvesting & Watersheds',
                          studyArea: 'Oromia, Ethiopia',
                          journalContext: 'Oromia Agricultural Research Institute',
                          abstract: '',
                          methodology: ['GIS Multi-Criteria Evaluation', 'Satellite Remote Sensing'],
                        });
                        setIsNewPub(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Publication</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {publications.map((pub) => (
                      <div
                        key={pub.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-mono text-emerald-400">#{pub.id}</span>
                            <span>·</span>
                            <span>{pub.year}</span>
                            <span>·</span>
                            <span className="text-slate-300">{pub.categoryLabel}</span>
                          </div>
                          <h5 className="text-sm font-bold text-white leading-snug">{pub.title}</h5>
                          <p className="text-xs text-slate-400 font-mono">{pub.studyArea}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingPub(pub);
                              setIsNewPub(false);
                            }}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                            title="Edit publication"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete publication #${pub.id}: "${pub.title}"?`)) {
                                await deletePublication(pub.id);
                                triggerSaveNotification('Publication deleted.');
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:text-rose-300 transition-colors"
                            title="Delete publication"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Study Basins Tab */}
              {activeTab === 'basins' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400">
                      Total Field Basins: <strong className="text-white">{studyRegions.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setEditingBasin({
                          id: `basin_${Date.now()}`,
                          name: '',
                          zone: 'Oromia Region',
                          coordinates: '',
                          elevation: '',
                          researchFocus: '',
                          methodology: '',
                          findings: '',
                          tags: ['GIS Analysis', 'Watershed'],
                        });
                        setIsNewBasin(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Basin</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {studyRegions.map((region) => (
                      <div
                        key={region.id}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-bold text-white">{region.name}</h5>
                            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60">
                              {region.zone}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mb-2 font-medium">{region.researchFocus}</p>
                          <p className="text-xs text-slate-400 line-clamp-2">{region.findings}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                          <span className="text-[10px] font-mono text-slate-400">{region.coordinates}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingBasin(region);
                                setIsNewBasin(false);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${region.name}"?`)) {
                                  await deleteStudyRegion(region.id);
                                  triggerSaveNotification('Study basin removed.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400 hover:text-rose-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Inquiries Inbox Tab */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400">
                      Total Inquiries: <strong className="text-white">{inquiriesList.length}</strong>
                    </span>
                    <button
                      onClick={async () => {
                        setIsLoadingInquiries(true);
                        const data = await fetchInquiries();
                        setInquiriesList(data);
                        setIsLoadingInquiries(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Inbox</span>
                    </button>
                  </div>

                  {inquiriesList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs">
                      No contact form inquiries recorded yet. Submissions from the contact section will appear here.
                    </div>
                  ) : (
                    inquiriesList.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{inq.name}</span>
                              <span className="text-xs font-normal text-slate-400 font-mono">({inq.email})</span>
                            </h5>
                            <p className="text-xs text-emerald-400 font-medium">
                              {inq.organization} · {inq.inquiryType}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(inq.receivedAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={async () => {
                                await deleteInquiry(inq.id);
                                setInquiriesList(inquiriesList.filter((i) => i.id !== inq.id));
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-300"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                          {inq.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 7. Backup & Export Tab */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h5 className="text-sm font-bold text-white">Full Database JSON Backup</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Download a single, complete JSON snapshot containing all current profile details, publications with BibTeX/RIS records, study basins, social links, and photo gallery.
                    </p>
                    <button
                      onClick={handleDownloadBackup}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Export JSON Snapshot</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h5 className="text-sm font-bold text-white">Restore / Import JSON Snapshot</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload a previously exported JSON backup to synchronize or restore the complete website content across servers.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 cursor-pointer transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Select Backup JSON File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Sub-Editor for Photo Gallery Add/Edit */}
        {editingPhoto && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">
                  {isNewPhoto ? 'Add Photo to Gallery' : `Edit Photo: ${editingPhoto.title}`}
                </h4>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.title || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingPhoto.category || 'Field Agronomy'}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                      placeholder="e.g. Field Agronomy, Geospatial Lab, Remote Sensing"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date / Epoch</label>
                    <input
                      type="text"
                      value={editingPhoto.date || ''}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                      placeholder="e.g. October 2022"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <PhotoUploadField
                  label="Photo Image (Upload from device, drag & drop, or pick from research library) *"
                  value={editingPhoto.imageUrl || ''}
                  onChange={(url) => setEditingPhoto({ ...editingPhoto, imageUrl: url })}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Description</label>
                  <textarea
                    rows={3}
                    value={editingPhoto.caption || ''}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                    placeholder="Describe the research context, study district, or technical apparatus..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs"
                  >
                    Save Photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sub-Editor for Publication Add/Edit */}
        {editingPub && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">
                  {isNewPub ? 'Add Scientific Publication' : `Edit Publication #${editingPub.id}`}
                </h4>
                <button
                  onClick={() => setEditingPub(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePublication} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPub.title || ''}
                    onChange={(e) => setEditingPub({ ...editingPub, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                    <input
                      type="text"
                      value={editingPub.year || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category Code</label>
                    <select
                      value={editingPub.category || 'hydrology'}
                      onChange={(e) => setEditingPub({ ...editingPub, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="hydrology">Hydrology & Water</option>
                      <option value="soil">Soil Fertility</option>
                      <option value="agroforestry">Agroforestry & Land</option>
                      <option value="lulc">LULC Dynamics</option>
                      <option value="crops">Crop Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category Label</label>
                    <input
                      type="text"
                      value={editingPub.categoryLabel || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, categoryLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Study Area / Zone</label>
                    <input
                      type="text"
                      value={editingPub.studyArea || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, studyArea: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Journal Context / Publisher</label>
                    <input
                      type="text"
                      value={editingPub.journalContext || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, journalContext: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Abstract Summary</label>
                  <textarea
                    rows={3}
                    value={editingPub.abstract || ''}
                    onChange={(e) => setEditingPub({ ...editingPub, abstract: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Methodologies (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingPub.methodology?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingPub({
                        ...editingPub,
                        methodology: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. AHP Evaluation, Landsat 8, DEM, Soil Lab Tests"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPub(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs"
                  >
                    Save & Update Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sub-Editor for Study Basin Add/Edit */}
        {editingBasin && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white">
                  {isNewBasin ? 'Add Study Basin' : `Edit Basin: ${editingBasin.name}`}
                </h4>
                <button
                  onClick={() => setEditingBasin(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBasin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Basin Name *</label>
                    <input
                      type="text"
                      required
                      value={editingBasin.name || ''}
                      onChange={(e) => setEditingBasin({ ...editingBasin, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Geographic Zone</label>
                    <input
                      type="text"
                      value={editingBasin.zone || ''}
                      onChange={(e) => setEditingBasin({ ...editingBasin, zone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Coordinates</label>
                    <input
                      type="text"
                      value={editingBasin.coordinates || ''}
                      onChange={(e) => setEditingBasin({ ...editingBasin, coordinates: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Elevation Range</label>
                    <input
                      type="text"
                      value={editingBasin.elevation || ''}
                      onChange={(e) => setEditingBasin({ ...editingBasin, elevation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Research Focus</label>
                  <input
                    type="text"
                    value={editingBasin.researchFocus || ''}
                    onChange={(e) => setEditingBasin({ ...editingBasin, researchFocus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GIS Methodology</label>
                  <textarea
                    rows={2}
                    value={editingBasin.methodology || ''}
                    onChange={(e) => setEditingBasin({ ...editingBasin, methodology: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Key Empirical Findings</label>
                  <textarea
                    rows={2}
                    value={editingBasin.findings || ''}
                    onChange={(e) => setEditingBasin({ ...editingBasin, findings: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingBasin(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs"
                  >
                    Save & Update Site
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
