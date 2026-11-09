import React, { useState } from 'react';
import { Image, X, ZoomIn, Calendar, Tag, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useContent, PhotoGalleryItem } from '../context/ContentContext';

export const PhotoGallerySection: React.FC = () => {
  const { photoGallery, isAdmin } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<PhotoGalleryItem | null>(null);

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

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
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
          <span className="text-xs text-slate-400 ml-auto font-mono hidden sm:inline-block">
            Showing {filteredPhotos.length} of {photoGallery.length} photographs
          </span>
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
                    e.currentTarget.src = '/public/assets/aistudio/photo_2026-05-26_22-25-44_b863dba6.jpg';
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
                <button
                  onClick={() => setActivePhoto(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
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
    </section>
  );
};
