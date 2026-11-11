import React, { useState } from 'react';
import {
  Image,
  X,
  ZoomIn,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Save,
} from 'lucide-react';
import { useContent, PhotoGalleryItem } from '../context/ContentContext';
import { PhotoUploadField } from './admin/PhotoUploadField';

export const PhotoGallerySection: React.FC = () => {
  const {
    photoGallery,
    isAdmin,
    addPhotoGalleryItem,
    editPhotoGalleryItem,
    deletePhotoGalleryItem,
  } = useContent();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<PhotoGalleryItem | null>(null);

  // In-Page Photo Edit / Add State
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoGalleryItem> | null>(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(photoGallery.map((p) => p.category)))];

  const filteredPhotos =
    selectedCategory === 'All'
      ? photoGallery
      : photoGallery.filter((p) => p.category === selectedCategory);

  const currentIndex = activePhoto ? filteredPhotos.findIndex((p) => p.id === activePhoto.id) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredPhotos.length - 1) {
      setActivePhoto(filteredPhotos[currentIndex + 1]);
    } else if (currentIndex === filteredPhotos.length - 1) {
      setActivePhoto(filteredPhotos[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActivePhoto(filteredPhotos[currentIndex - 1]);
    } else if (currentIndex === 0) {
      setActivePhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
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
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
            <Image className="w-3.5 h-3.5" />
            <span>Visual Evidence & Research Fieldwork</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Field Demonstrations & Geospatial Gallery
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            High-resolution visual documentation from participatory farmer trials in East Shewa, GIS decision labs, satellite remote sensing terrain mapping, and digital transformation initiatives.
          </p>
        </div>

        {/* Category Filters + In-Page Add Photo Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-400 text-slate-950 font-semibold shadow-xs'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              Showing {filteredPhotos.length} of {photoGallery.length} photographs
            </span>

            {/* Admin Live Add Photo Button */}
            {isAdmin && (
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo to Gallery</span>
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/src/assets/images/')) {
                      target.src = target.src.replace('/src/assets/images/', '/assets/images/');
                    } else if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = '1';
                      target.src = '/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg';
                    } else {
                      target.src = '/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Category Pill Tag */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/80 backdrop-blur-xs text-[10px] font-mono text-emerald-300">
                  {photo.category}
                </div>

                {/* Zoom Icon indicator */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                {/* Admin Quick Edit & Delete Controls on Hover */}
                {isAdmin && (
                  <div
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setEditingPhoto(photo);
                        setIsNewPhoto(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/70 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-md"
                      title="Edit this photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete "${photo.title}" from gallery?`)) {
                          await deletePhotoGalleryItem(photo.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/90 border border-rose-800 text-rose-300 hover:bg-rose-800 hover:text-white transition-all shadow-md"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Caption & Metadata */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>{photo.date}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if category filter yields no photos */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            No photographs found under &quot;{selectedCategory}&quot;.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Controls */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Tag className="w-3.5 h-3.5" />
                <span>{activePhoto.category}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{activePhoto.date}</span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingPhoto(activePhoto);
                      setIsNewPhoto(false);
                      setActivePhoto(null);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Photo</span>
                  </button>
                )}
                <button
                  onClick={() => setActivePhoto(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Photo View with Navigation */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[62vh] overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[62vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/public/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg';
                }}
              />

              {/* Left/Right controls */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 text-white hover:bg-emerald-500 hover:text-slate-950 flex items-center justify-center transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 text-white hover:bg-emerald-500 hover:text-slate-950 flex items-center justify-center transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Caption Footer */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 shrink-0">
              <h4 className="text-base font-bold text-white mb-1.5">{activePhoto.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* In-Page Photo Editor Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-400" />
                <span>{isNewPhoto ? 'Add Photo to Gallery' : `Edit Photo: ${editingPhoto.title}`}</span>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date / Period</label>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Photo Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
