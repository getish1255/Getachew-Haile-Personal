import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Copy,
  Check,
  FileCode,
  Download,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { Publication } from '../data/cvData';
import { useContent } from '../context/ContentContext';

type CitationFormat = 'bibtex' | 'ris' | 'apa';

export const PublicationsSection: React.FC = () => {
  const { publications, isAdmin, addPublication, editPublication, deletePublication } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // In-page Publication Form State
  const [editingPub, setEditingPub] = useState<Partial<Publication> | null>(null);
  const [isNewPub, setIsNewPub] = useState(false);

  // Citation Export Modal State
  const [activeExportModal, setActiveExportModal] = useState<{
    pub: Publication | 'all';
    format: 'bibtex' | 'ris';
  } | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  const allBibtexExport = publications.map((p) => p.bibtex).join('\n\n');
  const allRisExport = publications.map((p) => p.ris).join('\n\n');

  const categories = [
    { id: 'all', label: `All Publications (${publications.length})` },
    { id: 'hydrology', label: 'Rainwater & Hydrology' },
    { id: 'soil', label: 'Soil Fertility & Tef' },
    { id: 'agroforestry', label: 'Agroforestry & Suitability' },
    { id: 'lulc', label: 'LULC Dynamics' },
    { id: 'crops', label: 'Crop Genetics & Quality' },
  ];

  const filteredPubs = publications.filter((pub) => {
    const matchesCat = activeCategory === 'all' || pub.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.studyArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.methodology.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyCitation = (pub: Publication) => {
    navigator.clipboard.writeText(pub.citation);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = (format: 'bibtex' | 'ris') => {
    setActiveExportModal({ pub: 'all', format });
    setModalCopied(false);
  };

  const getModalExportContent = () => {
    if (!activeExportModal) return '';
    if (activeExportModal.pub === 'all') {
      return activeExportModal.format === 'bibtex' ? allBibtexExport : allRisExport;
    }
    return activeExportModal.format === 'bibtex'
      ? activeExportModal.pub.bibtex
      : activeExportModal.pub.ris;
  };

  const handleModalDownload = () => {
    if (!activeExportModal) return;
    const content = getModalExportContent();
    const isBib = activeExportModal.format === 'bibtex';
    const ext = isBib ? 'bib' : 'ris';
    const mime = isBib ? 'application/x-bibtex' : 'application/x-research-info-systems';
    const filename =
      activeExportModal.pub === 'all'
        ? `getachew_haile_complete_publications.${ext}`
        : `haile_${activeExportModal.pub.id}_${activeExportModal.pub.year}.${ext}`;
    handleDownloadFile(content, filename, mime);
  };

  const handleModalCopy = () => {
    const content = getModalExportContent();
    navigator.clipboard.writeText(content);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
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
  };

  return (
    <section id="publications" className="py-20 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Peer-Reviewed Literature & MSc Thesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Published Scientific Contributions
            </h2>
          </div>

          {/* Export All Citations Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              Export Full Catalog:
            </span>
            <button
              onClick={() => handleExportAll('bibtex')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 transition-colors shadow-xs"
              title="Export all 8 publications as BibTeX (.bib) for LaTeX/Overleaf"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export All (BibTeX)</span>
            </button>
            <button
              onClick={() => handleExportAll('ris')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 transition-colors shadow-xs"
              title="Export all 8 publications as RIS (.ris) for Zotero, Mendeley & EndNote"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export All (RIS)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls + In-Page Admin Add Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-emerald-400 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search title, watershed, tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500/80 transition-colors"
              />
            </div>

            {/* Admin Add Publication Button */}
            {isAdmin && (
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Publication</span>
              </button>
            )}
          </div>
        </div>

        {/* Publications Grid */}
        <div className="space-y-4">
          {filteredPubs.length > 0 ? (
            filteredPubs.map((pub) => {
              const isExpanded = expandedId === pub.id;
              const isCopied = copiedId === pub.id;

              return (
                <article
                  key={pub.id}
                  id={`pub-${pub.id}`}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900/95 hover:border-slate-700/80 transition-all duration-200 shadow-md relative"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Quiet unboxed metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-emerald-400 font-medium">#{pub.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{pub.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300 font-medium">{pub.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{pub.studyArea}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {pub.title}
                      </h3>

                      {/* Source/Journal line */}
                      <p className="text-xs font-mono text-slate-400">{pub.journalContext}</p>
                    </div>

                    {/* Action buttons with BibTeX, RIS, and Admin Edit/Delete */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1">
                      {/* Quick APA citation copy */}
                      <button
                        onClick={() => handleCopyCitation(pub)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors"
                        title="Copy APA formatted citation"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied APA</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Cite (APA)</span>
                          </>
                        )}
                      </button>

                      {/* BibTeX Export Button */}
                      <button
                        onClick={() => {
                          setActiveExportModal({ pub, format: 'bibtex' });
                          setModalCopied(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/50 hover:bg-emerald-950 border border-emerald-800/70 rounded-lg transition-colors"
                        title="Export BibTeX (.bib) citation"
                      >
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>BibTeX</span>
                      </button>

                      {/* RIS Export Button (for Zotero / Mendeley / EndNote) */}
                      <button
                        onClick={() => {
                          setActiveExportModal({ pub, format: 'ris' });
                          setModalCopied(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-950/50 hover:bg-cyan-950 border border-cyan-800/70 rounded-lg transition-colors"
                        title="Export RIS (.ris) for Zotero, Mendeley & EndNote"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>RIS</span>
                      </button>

                      {/* Expand Abstract Button */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors"
                      >
                        <span>{isExpanded ? 'Less' : 'Abstract'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Admin Live In-Page Edit & Delete */}
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-700">
                          <button
                            onClick={() => {
                              setEditingPub(pub);
                              setIsNewPub(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 transition-colors"
                            title="Edit this publication"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete publication #${pub.id}: "${pub.title}"?`)) {
                                await deletePublication(pub.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 hover:text-white hover:bg-rose-900 border border-rose-800/80 transition-colors"
                            title="Delete publication"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Abstract and Methodology */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 mb-1.5">
                          Abstract Summary
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                          {pub.abstract}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 mb-2">
                          Applied Scientific Methodologies & Tools
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          {pub.methodology.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 text-xs rounded-md bg-slate-950 border border-slate-800 text-emerald-300 font-mono"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              No publications found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>

        {/* Citation Export Modal */}
        {activeExportModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setActiveExportModal(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    {activeExportModal.format === 'bibtex' ? (
                      <FileCode className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {activeExportModal.format === 'bibtex'
                        ? 'BibTeX Citation (.bib)'
                        : 'RIS Research Information Systems (.ris)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {activeExportModal.pub === 'all'
                        ? `Complete library of ${publications.length} publications`
                        : (activeExportModal.pub as Publication).title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() =>
                        setActiveExportModal({ ...activeExportModal, format: 'bibtex' })
                      }
                      className={`px-2.5 py-1 text-xs font-mono rounded ${
                        activeExportModal.format === 'bibtex'
                          ? 'bg-emerald-400 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      BibTeX
                    </button>
                    <button
                      onClick={() =>
                        setActiveExportModal({ ...activeExportModal, format: 'ris' })
                      }
                      className={`px-2.5 py-1 text-xs font-mono rounded ${
                        activeExportModal.format === 'ris'
                          ? 'bg-emerald-400 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      RIS
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveExportModal(null)}
                    className="text-slate-400 hover:text-white text-lg p-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Code Preview Pane */}
              <div className="my-4 flex-1 overflow-y-auto">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300/90 whitespace-pre leading-relaxed overflow-x-auto">
                  {getModalExportContent()}
                </pre>
              </div>

              {/* Footer Controls: Copy and Download .bib / .ris */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono">
                  Format: {activeExportModal.format === 'bibtex' ? '.bib (BibTeX)' : '.ris (Research Info Systems)'}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleModalCopy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                  >
                    {modalCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleModalDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      Download .{activeExportModal.format === 'bibtex' ? 'bib' : 'ris'} File
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* In-Page Publication Editor Modal */}
        {editingPub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{isNewPub ? 'Add New Publication' : `Edit Publication #${editingPub.id}`}</span>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Publication</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
