import React, { useState } from 'react';
import { MapPin, Layers, BookOpen, Compass, ArrowUpRight, Sliders, CheckCircle2 } from 'lucide-react';
import { StudyRegion } from '../data/cvData';
import { useContent } from '../context/ContentContext';

// Topography image generated via generate_image
const TOPOGRAPHY_IMG = '/src/assets/images/ethiopia_geospatial_topography_1794209253351.jpg';

interface InteractiveSpatialExplorerProps {
  onSelectPublication?: (id: number) => void;
}

export const InteractiveSpatialExplorer: React.FC<InteractiveSpatialExplorerProps> = ({
  onSelectPublication,
}) => {
  const { studyRegions, publications } = useContent();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('arsi');
  const [filterTag, setFilterTag] = useState<string>('all');

  const selectedRegion = studyRegions.find((r) => r.id === selectedRegionId) || studyRegions[0] || {
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

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterTag === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Basins & Districts (6)
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
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/30 pointer-events-none" />

                {/* Overlaid Title and Coordinate Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium text-white">Ethiopian Highlands & Rift Valley Corridor</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
                    Datum: WGS84 / UTM Zone 37N
                  </span>
                </div>

                {/* Interactive Hotspot Markers for each study region */}
                <div className="absolute inset-0 p-6 pointer-events-auto">
                  {/* Arsi Zone (Central Highlands) */}
                  <button
                    onClick={() => setSelectedRegionId('arsi')}
                    className={`absolute top-[44%] left-[48%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'arsi' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Arsi Zone Catchments"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'arsi'
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Arsi Zone</span>
                    </div>
                  </button>

                  {/* Genale-Dawa (Southeastern) */}
                  <button
                    onClick={() => setSelectedRegionId('genale-dawa')}
                    className={`absolute top-[68%] left-[62%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'genale-dawa' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Genale-Dawa Bale Sub-Basin"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'genale-dawa'
                          ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-cyan-600" />
                      <span>Genale-Dawa Bale</span>
                    </div>
                  </button>

                  {/* Genale Sub-basin (Southern) */}
                  <button
                    onClick={() => setSelectedRegionId('genale')}
                    className={`absolute top-[75%] left-[42%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'genale' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Genale Sub-Basin"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'genale'
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Genale Basin</span>
                    </div>
                  </button>

                  {/* Bora District (East Shewa / Rift Valley) */}
                  <button
                    onClick={() => setSelectedRegionId('bora')}
                    className={`absolute top-[35%] left-[42%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'bora' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Bora District, East Shewa"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'bora'
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>Bora (Tef Trial)</span>
                    </div>
                  </button>

                  {/* Weyib Sub-basin */}
                  <button
                    onClick={() => setSelectedRegionId('weyib')}
                    className={`absolute top-[52%] left-[66%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'weyib' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Weyib Sub-Basin"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'weyib'
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Weyib (Moringa)</span>
                    </div>
                  </button>

                  {/* Adama Zuria */}
                  <button
                    onClick={() => setSelectedRegionId('adama-zuria')}
                    className={`absolute top-[28%] left-[54%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer transition-transform ${
                      selectedRegionId === 'adama-zuria' ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                    title="Adama Zuria District"
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg transition-all ${
                        selectedRegionId === 'adama-zuria'
                          ? 'bg-purple-400 text-slate-950 ring-4 ring-purple-400/30'
                          : 'bg-slate-950/90 text-slate-200 border border-slate-700 hover:border-purple-400'
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
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl">
              {/* Header badge & title */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400">{selectedRegion.zone}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    {selectedRegion.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono tabular-nums text-slate-400 block">
                    {selectedRegion.coordinates}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Elev: {selectedRegion.elevation}
                  </span>
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
    </section>
  );
};
