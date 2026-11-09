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
} from 'lucide-react';
import { Publication } from '../data/cvData';
import { useContent } from '../context/ContentContext';

type CitationFormat = 'bibtex' | 'ris' | 'apa';

export const PublicationsSection: React.FC = () => {
  const { publications } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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

  const getModalExportContent = () => {
    if (!activeExportModal) return '';
    if (activeExportModal.pub === 'all') {
      return activeExportModal.format === 'bibtex' ? allBibtexExport : allRisExport;
    } else {
      return activeExportModal.format === 'bibtex' ? activeExportModal.pub.bibtex : activeExportModal.pub.ris;
    }
  };

  const handleModalCopy = () => {
    const content = getModalExportContent();
    navigator.clipboard.writeText(content);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const handleModalDownload = () => {
    if (!activeExportModal) return;
    const content = getModalExportContent();
    const isAll = activeExportModal.pub === 'all';
    const ext = activeExportModal.format === 'bibtex' ? 'bib' : 'ris';
    const mime = activeExportModal.format === 'bibtex' ? 'application/x-bibtex' : 'application/x-research-info-systems';
    const filename = isAll
      ? `getachew_haile_publications_all.${ext}`
      : `haile_${(activeExportModal.pub as Publication).id}_${ext}.${ext}`;
    handleDownloadFile(content, filename, mime);
  };

  return (
    <section id="publications" className="py-20 border-b border-slate-800/80 bg-slate-950/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Batch Citation Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Scientific Output & Citation Management</span>
              <span aria-hidden="true">·</span>
              <span>Peer-Reviewed & Technical Contributions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Selected Publications & Theses
            </h2>
          </div>

          {/* Batch Citation Export Button Cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveExportModal({ pub: 'all', format: 'bibtex' });
                setModalCopied(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-700/60 rounded-xl transition-all shadow-xs"
              title="Export all 8 publications as BibTeX (.bib) file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All (BibTeX)</span>
            </button>
            <button
              onClick={() => {
                setActiveExportModal({ pub: 'all', format: 'ris' });
                setModalCopied(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-700/60 rounded-xl transition-all shadow-xs"
              title="Export all 8 publications as RIS (.ris) file for Zotero, Mendeley & EndNote"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All (RIS)</span>
            </button>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
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
                  className="p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900/95 hover:border-slate-700/80 transition-all duration-200 shadow-md"
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

                    {/* Action buttons with BibTeX and RIS export */}
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
                          Key Geospatial & Empirical Methodologies
                        </h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {pub.methodology.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
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
            <div className="text-center py-12 p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
              No publications match the selected query. Try clearing filters.
            </div>
          )}
        </div>

        {/* Unified Citation Export Modal (BibTeX & RIS) */}
        {activeExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      activeExportModal.format === 'bibtex'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {activeExportModal.format === 'bibtex' ? (
                      <FileCode className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {activeExportModal.pub === 'all'
                        ? `Export All Publications (${activeExportModal.format.toUpperCase()})`
                        : `Citation Export (${activeExportModal.format.toUpperCase()})`}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {activeExportModal.format === 'bibtex'
                        ? 'Compatible with LaTeX, Overleaf, JabRef, and Pandoc'
                        : 'Compatible with Zotero, Mendeley, EndNote, Citavi, and RefWorks'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Format Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    <button
                      onClick={() =>
                        setActiveExportModal({
                          pub: activeExportModal.pub,
                          format: 'bibtex',
                        })
                      }
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        activeExportModal.format === 'bibtex'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      BibTeX
                    </button>
                    <button
                      onClick={() =>
                        setActiveExportModal({
                          pub: activeExportModal.pub,
                          format: 'ris',
                        })
                      }
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        activeExportModal.format === 'ris'
                          ? 'bg-cyan-400 text-slate-950'
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
      </div>
    </section>
  );
};
