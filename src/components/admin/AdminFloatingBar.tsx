import React, { useState } from 'react';
import {
  ShieldCheck,
  Edit3,
  LogOut,
  Layers,
  BookOpen,
  Image,
  MapPin,
  Settings,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface AdminFloatingBarProps {
  onOpenCMS: () => void;
  onQuickAddPub?: () => void;
  onQuickAddBasin?: () => void;
  onQuickAddPhoto?: () => void;
}

export const AdminFloatingBar: React.FC<AdminFloatingBarProps> = ({
  onOpenCMS,
  onQuickAddPub,
  onQuickAddBasin,
  onQuickAddPhoto,
}) => {
  const { isAdmin, logout, profile } = useContent();
  const [showAddMenu, setShowAddMenu] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950 border-b border-emerald-500/50 shadow-2xl backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4 text-xs">
        {/* Left: Mode Indicator & Notice */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-white tracking-tight">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-[11px]">All In-Page Content Is Editable</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300/80 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Firestore Cloud Sync Active
            </span>
          </div>
        </div>

        {/* Middle: Jump Links */}
        <div className="hidden lg:flex items-center gap-3 text-slate-300">
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">Jump to edit:</span>
          <a href="#about" className="hover:text-emerald-300 transition-colors">
            Bio
          </a>
          <a href="#spatial-explorer" className="hover:text-emerald-300 transition-colors">
            Basins
          </a>
          <a href="#publications" className="hover:text-emerald-300 transition-colors">
            Publications
          </a>
          <a href="#gallery" className="hover:text-emerald-300 transition-colors">
            Gallery
          </a>
          <a href="#experience" className="hover:text-emerald-300 transition-colors">
            Timeline
          </a>
        </div>

        {/* Right: Quick Actions & Log Out */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Add Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Add</span>
            </button>

            {showAddMenu && (
              <div
                className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 space-y-1 z-50 text-left"
                onClick={() => setShowAddMenu(false)}
              >
                {onQuickAddPub && (
                  <button
                    onClick={onQuickAddPub}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>New Publication</span>
                  </button>
                )}
                {onQuickAddBasin && (
                  <button
                    onClick={onQuickAddBasin}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>New Study Basin</span>
                  </button>
                )}
                {onQuickAddPhoto && (
                  <button
                    onClick={onQuickAddPhoto}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                  >
                    <Image className="w-3.5 h-3.5 text-amber-400" />
                    <span>New Gallery Photo</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Full CMS Portal Modal trigger */}
          <button
            onClick={onOpenCMS}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Full CMS Portal</span>
          </button>

          {/* Log Out */}
          <button
            onClick={logout}
            className="p-1 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:text-white hover:bg-rose-900 transition-colors"
            title="Exit Admin Mode"
            aria-label="Exit Admin Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
