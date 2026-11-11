import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  BookOpen,
  Compass,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { StudyRegion } from '../data/cvData';
import { useContent } from '../context/ContentContext';

// Topography image generated via generate_image
const TOPOGRAPHY_IMG = '/assets/images/ethiopia_geospatial_topography_1794209253351.jpg';

interface InteractiveSpatialExplorerProps {
  onSelectPublication?: (id: number) => void;
}

export const InteractiveSpatialExplorer: React.FC<InteractiveSpatialExplorerProps> = ({
  onSelectPublication,
}) => {
  const { studyRegions, publications, isAdmin, editStudyRegion, addStudyRegion, deleteStudyRegion } =
    useContent();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('arsi');
  const [filterTag, setFilterTag] = useState<string>('all');

  // In-page Basin Editor State
  const [editingBasin, setEditingBasin] = useState<Partial<StudyRegion> | null>(null);
  const [isNewBasin, setIsNewBasin] = useState(false);

  const selectedRegion =
    studyRegions.find((r) => r.id === selectedRegionId) ||
    studyRegions[0] || {
      id: 'arsi',
      name: 'Arsi Zone Catchments',
      zone: 'Central Oromia Highlands',
      coordinates: '7.5000° N, 39.1500° E',
      elevation: '1,900 m – 3,200 m',
      researchFocus: 'Rainwater Harvesting (RWH) Suitability',
      methodology: 'Integrated AHP pairwise comparisons of slope gradients from SRTM DEM.',
      findings: 'Identified over 34 high-potential micro-catchment zones.',
      publicationsLinked: [5],
      tags: ['Water Harvesting'],
    };

  const linkedPublications = publications.filter((p) =>
    selectedRegion.publicationsLinked?.includes(p.id)
  );

  const filteredRegions =
    filterTag === 'all'
      ? studyRegions
      : studyRegions.filter((r) =>
          r.tags?.some((t) => t.toLowerCase().includes(filterTag.toLowerCase()))
        );

  const handleSaveBasin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBasin || !editingBasin.name) return;

    if (isNewBasin) {
      await addStudyRegion(editingBasin);
      if (editingBasin.id) setSelectedRegionId(editingBasin.id);
    } else if (editingBasin.id) {
      await editStudyRegion(editingBasin.id, editingBasin);
    }
    setEditingBasin(null);
  };

  return (
    <section id="spatial-explorer" className="py-20 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Geospatial Research Corridors</span>
              <span aria-hidden="true">·</span>
              <span>Oromia & Central Ethiopia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Interactive Regional Study Basins
            </h2>
          </div>
          <p className="max-w-xl text-sm sm:text-base text-slate-300">
            Explore primary geographic catchments, sub-basins, and agricultural districts where Getachew Haile has
            spearheaded multi-criteria GIS modeling, satellite remote sensing, and field demonstrations.
          </p>
        </div>

        {/* Filter controls + In-page Admin Add Basin Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterTag === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Basins ({studyRegions.length})
            </button>
            <button
              onClick={() => setFilterTag('water')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterTag === 'water'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rainwater & Groundwater
            </button>
            <button
              onClick={() => setFilterTag('agroforestry')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterTag === 'agroforestry'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Agroforestry & Suitability
            </button>
            <button
              onClick={() => setFilterTag('soil')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterTag === 'soil'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Soil Fertility & Tef
            </button>
          </div>

          {/* Admin Live Add Button */}
          {isAdmin && (
            <button
              onClick={() => {
                setEditingBasin({
                  id: `basin_${Date.now()}`,
                  name: '',
                  zone: 'Oromia Region, Ethiopia',
                  coordinates: '8.0000° N, 39.0000° E',
                  elevation: '1,600 m – 2,400 m',
                  researchFocus: 'GIS & Hydrological Suitability',
                  methodology: 'Multi-criteria AHP & satellite remote sensing',
                  findings: 'Spatial modeling completed.',
                  tags: ['Water Harvesting', 'AHP'],
                });
                setIsNewBasin(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Study Basin</span>
            </button>
          )}
        </div>

        {/* Main Grid: Left interactive basin selector / map visual, Right detail inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Topography Visual with Interactive Basin Hotspots */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group shadow-xl">
              {/* Satellite / Topography Cartography Preview */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
                <img
                  src={TOPOGRAPHY_IMG}
                  alt="Ethiopian Highlands & Rift Valley Terrain Geospatial Elevation & NDVI Visualization"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackCount) {
                      target.dataset.fallbackCount = '1';
                      target.src = '/public/assets/images/ethiopia_geospatial_topography_1794209253351.jpg';
                    } else if (target.dataset.fallbackCount === '1') {
                      target.dataset.fallbackCount = '2';
                      target.src = '/src/assets/images/ethiopia_geospatial_topography_1794209253351.jpg';
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Hotspot Markers placed geographically across Ethiopia */}
                <div className="absolute inset-0">
                  {/* Arsi Zone Catchments */}
                  <button
                    onClick={() => setSelectedRegionId('arsi')}
                    className="absolute top-[48%] left-[54%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Arsi Zone Catchments (Central Oromia)"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'arsi'
                          ? 'bg-emerald-400 text-slate-950 scale-110 ring-2 ring-emerald-300'
                          : 'bg-slate-950/90 text-emerald-300 border border-emerald-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Arsi Zone</span>
                    </div>
                  </button>

                  {/* Genale-Dawa Bale Sub-basin */}
                  <button
                    onClick={() => setSelectedRegionId('genale-dawa')}
                    className="absolute top-[68%] left-[62%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Genale-Dawa Bale Sub-basin"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'genale-dawa'
                          ? 'bg-cyan-400 text-slate-950 scale-110 ring-2 ring-cyan-300'
                          : 'bg-slate-950/90 text-cyan-300 border border-cyan-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-cyan-600" />
                      <span>Genale-Dawa</span>
                    </div>
                  </button>

                  {/* Genale Sub-basin */}
                  <button
                    onClick={() => setSelectedRegionId('genale')}
                    className="absolute top-[72%] left-[50%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Genale Sub-basin (Agroforestry)"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'genale'
                          ? 'bg-emerald-400 text-slate-950 scale-110 ring-2 ring-emerald-300'
                          : 'bg-slate-950/90 text-emerald-300 border border-emerald-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Genale Basin</span>
                    </div>
                  </button>

                  {/* Bora District */}
                  <button
                    onClick={() => setSelectedRegionId('bora')}
                    className="absolute top-[40%] left-[48%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Bora District (East Shewa Tef Trials)"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'bora'
                          ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-amber-300'
                          : 'bg-slate-950/90 text-amber-300 border border-amber-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>Bora (Tef Trials)</span>
                    </div>
                  </button>

                  {/* Weyib Sub-basin */}
                  <button
                    onClick={() => setSelectedRegionId('weyib')}
                    className="absolute top-[58%] left-[70%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Weyib Sub-basin (Moringa oleifera Suitability)"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'weyib'
                          ? 'bg-emerald-400 text-slate-950 scale-110 ring-2 ring-emerald-300'
                          : 'bg-slate-950/90 text-emerald-300 border border-emerald-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Weyib Basin</span>
                    </div>
                  </button>

                  {/* Adama Zuria District */}
                  <button
                    onClick={() => setSelectedRegionId('adama-zuria')}
                    className="absolute top-[36%] left-[55%] -translate-x-1/2 -translate-y-1/2 group/pin z-10"
                    title="Adama Zuria District (LULC Dynamics)"
                  >
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-transform ${
                        selectedRegion.id === 'adama-zuria'
                          ? 'bg-purple-400 text-slate-950 scale-110 ring-2 ring-purple-300'
                          : 'bg-slate-950/90 text-purple-300 border border-purple-500/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-purple-600" />
                      <span>Adama Zuria</span>
                    </div>
                  </button>
                </div>

                {/* Bottom legend strip */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>Hydrology & Agroforestry</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span>Soil & Tef Agronomy</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    <span>Groundwater Potential</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Basin quick button list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredRegions.map((region) => {
                const isActive = region.id === selectedRegion.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-slate-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {region.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{region.zone}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Scientific Inspection Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl relative">
              {/* Header badge & title with Admin In-Page Controls */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400">{selectedRegion.zone}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {selectedRegion.name}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-mono tabular-nums text-slate-400 block">
                    {selectedRegion.coordinates}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Elev: {selectedRegion.elevation}
                  </span>

                  {/* Admin Edit / Delete Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => {
                          setEditingBasin(selectedRegion);
                          setIsNewBasin(false);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-semibold border border-slate-700 transition-colors"
                        title="Edit this basin details in real-time"
                      >
                        <Edit2 className="w-3 h-3 text-emerald-400" />
                        <span>Edit Basin</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete study basin "${selectedRegion.name}"?`)) {
                            await deleteStudyRegion(selectedRegion.id);
                          }
                        }}
                        className="p-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:text-white transition-colors"
                        title="Delete this study basin"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Research Focus */}
              <div className="mb-5 pb-5 border-b border-slate-800">
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  Research Domain & Focus
                </span>
                <p className="text-sm font-semibold text-emerald-300">
                  {selectedRegion.researchFocus}
                </p>
              </div>

              {/* GIS & Remote Sensing Methodology */}
              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GIS & Remote Sensing Methodology</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedRegion.methodology}
                </p>
              </div>

              {/* Empirical Findings & Practical Impact */}
              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Outcome & Practical Agronomic Impact</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedRegion.findings}
                </p>
              </div>

              {/* Linked Publications */}
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">
                  Linked Publication from CV
                </span>
                {linkedPublications.length > 0 ? (
                  <div className="space-y-2">
                    {linkedPublications.map((pub) => (
                      <div
                        key={pub.id}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <p className="text-xs font-semibold text-white line-clamp-2">
                          {pub.title}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                          <span>{pub.year} · {pub.categoryLabel}</span>
                          <a
                            href={`#pub-${pub.id}`}
                            onClick={() => onSelectPublication?.(pub.id)}
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            <span>Read Citation</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Integrated field research dataset.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Page Study Basin Editor Modal */}
      {editingBasin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{isNewBasin ? 'Add Study Basin' : `Edit Basin: ${editingBasin.name}`}</span>
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
                  rows={3}
                  value={editingBasin.methodology || ''}
                  onChange={(e) => setEditingBasin({ ...editingBasin, methodology: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Key Empirical Findings</label>
                <textarea
                  rows={3}
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Basin Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
