import React, { useState, useMemo } from 'react';
import { Sliders, Cpu, CheckCircle2, AlertTriangle, RefreshCw, BarChart2, HelpCircle } from 'lucide-react';

const GIS_MODELING_IMG = '/assets/images/gis_multicriteria_soil_modeling_1794209253751.jpg';

type ModelScenario = 'rwh_arsi' | 'moringa_weyib' | 'soil_tef';

interface ParameterConfig {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage
  min: number;
  max: number;
  defaultVal: number;
  unit: string;
  factorType: 'higher_better' | 'lower_better' | 'optimal_mid';
  optimalRange?: [number, number];
}

const SCENARIOS: Record<
  ModelScenario,
  {
    title: string;
    subtitle: string;
    paperRef: string;
    description: string;
    parameters: ParameterConfig[];
  }
> = {
  rwh_arsi: {
    title: 'Rainwater Harvesting Siting Engine',
    subtitle: 'Arsi Zone Catchments · Central Ethiopia (AAU MSc Model)',
    paperRef: 'Based on Haile, G. (2017) Addis Ababa University Thesis',
    description:
      'Multi-Criteria Evaluation (MCE) combining terrain slope, soil permeability, and runoff volume to isolate high-yield micro-dam and pond catchments.',
    parameters: [
      {
        id: 'slope',
        name: 'Slope Gradient (DEM)',
        description: 'Gentle slopes (2–8%) maximize water retention without excessive earthwork.',
        weight: 30,
        min: 1,
        max: 30,
        defaultVal: 5,
        unit: '%',
        factorType: 'optimal_mid',
        optimalRange: [2, 8],
      },
      {
        id: 'soil_permeability',
        name: 'Soil Infiltration & Texture',
        description: 'Clay-loam textured soils provide natural sealing for reservoir water retention.',
        weight: 25,
        min: 10,
        max: 90,
        defaultVal: 35,
        unit: 'mm/hr',
        factorType: 'lower_better',
      },
      {
        id: 'rainfall',
        name: 'Annual Catchment Rainfall',
        description: 'Threshold precipitation required to generate reliable seasonal runoff.',
        weight: 25,
        min: 500,
        max: 1600,
        defaultVal: 950,
        unit: 'mm/yr',
        factorType: 'higher_better',
      },
      {
        id: 'drainage_proximity',
        name: 'Stream Network Buffer',
        description: 'Proximity to 1st & 2nd order stream tributaries for diversion.',
        weight: 20,
        min: 50,
        max: 1500,
        defaultVal: 250,
        unit: 'meters',
        factorType: 'optimal_mid',
        optimalRange: [100, 400],
      },
    ],
  },
  moringa_weyib: {
    title: 'Moringa oleifera Biophysical Suitability',
    subtitle: 'Weyib Sub-basin · Bale Zone Agro-Ecological Model',
    paperRef: 'Based on Haile, G., et al. (2018) GIS-AHP Suitability',
    description:
      'Biophysical zoning assessing thermal limits, soil pH, and moisture retention for climate-smart agroforestry expansion.',
    parameters: [
      {
        id: 'temperature',
        name: 'Mean Annual Temperature',
        description: 'Moringa flourishes in semi-arid tropical warmth between 22°C and 34°C.',
        weight: 35,
        min: 14,
        max: 38,
        defaultVal: 27,
        unit: '°C',
        factorType: 'optimal_mid',
        optimalRange: [22, 32],
      },
      {
        id: 'soil_ph',
        name: 'Soil Reaction (pH)',
        description: 'Neutral to slightly acidic soils (pH 6.0 – 7.8) optimize nutrient bioavailability.',
        weight: 30,
        min: 4.5,
        max: 9.0,
        defaultVal: 6.8,
        unit: 'pH',
        factorType: 'optimal_mid',
        optimalRange: [6.0, 7.8],
      },
      {
        id: 'elevation',
        name: 'Altitude / Topography',
        description: 'Sub-basin lowlands and midlands (900m – 1,800m) protect against frost.',
        weight: 20,
        min: 800,
        max: 2600,
        defaultVal: 1450,
        unit: 'meters',
        factorType: 'optimal_mid',
        optimalRange: [900, 1800],
      },
      {
        id: 'soil_depth',
        name: 'Effective Soil Depth',
        description: 'Deep root systems require > 80cm for moisture buffering during dry spells.',
        weight: 15,
        min: 20,
        max: 150,
        defaultVal: 95,
        unit: 'cm',
        factorType: 'higher_better',
      },
    ],
  },
  soil_tef: {
    title: 'Soil Organic Fertility & Tef Yield Engine',
    subtitle: 'Bora District · East Shewa Semi-Arid Model',
    paperRef: 'Based on Haile, G., et al. (2022) ECONAT Fertilizer Demonstration',
    description:
      'Agronomic decision matrix modeling organic bio-fertilizer application efficiency based on soil organic carbon and moisture regime.',
    parameters: [
      {
        id: 'soc',
        name: 'Soil Organic Carbon (SOC)',
        description: 'Baseline soil organic matter in semi-arid vertisols.',
        weight: 35,
        min: 0.5,
        max: 3.5,
        defaultVal: 1.2,
        unit: '%',
        factorType: 'higher_better',
      },
      {
        id: 'organic_rate',
        name: 'ECONAT Liquid Dosage',
        description: 'Calibrated foliar spray rate demonstrated in Bora research trials.',
        weight: 30,
        min: 1.0,
        max: 8.0,
        defaultVal: 4.5,
        unit: 'L/ha',
        factorType: 'optimal_mid',
        optimalRange: [3.5, 5.5],
      },
      {
        id: 'moisture_retention',
        name: 'Available Water Capacity',
        description: 'Root zone moisture reserve during critical flowering and grain filling.',
        weight: 20,
        min: 40,
        max: 180,
        defaultVal: 110,
        unit: 'mm/m',
        factorType: 'higher_better',
      },
      {
        id: 'nitrogen_status',
        name: 'Baseline Total Nitrogen',
        description: 'Soil available nitrogen content prior to bio-stimulant foliar feed.',
        weight: 15,
        min: 0.05,
        max: 0.35,
        defaultVal: 0.12,
        unit: '% N',
        factorType: 'higher_better',
      },
    ],
  },
};

export const InteractiveDecisionSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ModelScenario>('rwh_arsi');

  // Values map for the active parameters
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SCENARIOS.rwh_arsi.parameters.forEach((p) => {
      initial[p.id] = p.defaultVal;
    });
    return initial;
  });

  const scenario = SCENARIOS[activeScenario];

  const handleScenarioChange = (scen: ModelScenario) => {
    setActiveScenario(scen);
    const newVals: Record<string, number> = {};
    SCENARIOS[scen].parameters.forEach((p) => {
      newVals[p.id] = p.defaultVal;
    });
    setParamValues(newVals);
  };

  const handleParamChange = (id: string, val: number) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    const newVals: Record<string, number> = {};
    scenario.parameters.forEach((p) => {
      newVals[p.id] = p.defaultVal;
    });
    setParamValues(newVals);
  };

  // Compute AHP Multi-Criteria Suitability Score (0-100)
  const { score, classification, color, recommendation, factorScores } = useMemo(() => {
    let totalScore = 0;
    const scores: Record<string, number> = {};

    scenario.parameters.forEach((param) => {
      const val = paramValues[param.id] ?? param.defaultVal;
      let normalized = 0;

      if (param.factorType === 'higher_better') {
        normalized = Math.min(100, Math.max(0, ((val - param.min) / (param.max - param.min)) * 100));
      } else if (param.factorType === 'lower_better') {
        normalized = Math.min(100, Math.max(0, ((param.max - val) / (param.max - param.min)) * 100));
      } else if (param.factorType === 'optimal_mid' && param.optimalRange) {
        const [optMin, optMax] = param.optimalRange;
        if (val >= optMin && val <= optMax) {
          normalized = 100;
        } else if (val < optMin) {
          normalized = Math.max(10, 100 - ((optMin - val) / (optMin - param.min)) * 90);
        } else {
          normalized = Math.max(10, 100 - ((val - optMax) / (param.max - optMax)) * 90);
        }
      }

      scores[param.id] = Math.round(normalized);
      totalScore += (normalized * param.weight) / 100;
    });

    const roundedScore = Math.round(totalScore);

    let cls = '';
    let col = '';
    let rec = '';

    if (roundedScore >= 80) {
      cls = 'S1 · Highly Suitable';
      col = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      rec =
        activeScenario === 'rwh_arsi'
          ? 'Prime hydrological catchment. Low infiltration clay bedrock and optimal terrain slope guarantee minimal earthwork and sustainable pond volume storage.'
          : activeScenario === 'moringa_weyib'
          ? 'Optimum thermal and edaphic conditions. Recommended for immediate agroforestry integration with high canopy biomass yield.'
          : 'High responsiveness regime. Bio-organic liquid fertilization delivers maximum tef yield stability and improved grain test weight.';
    } else if (roundedScore >= 62) {
      cls = 'S2 · Moderately Suitable';
      col = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      rec =
        activeScenario === 'rwh_arsi'
          ? 'Viable site with minor limitations. Supplementary compaction or geo-textile pond lining is advised to reduce seepage losses.'
          : activeScenario === 'moringa_weyib'
          ? 'Favorable conditions with moderate seasonal moisture deficit. Micro-basin water harvesting recommended during seedling establishment.'
          : 'Positive yield response expected. Recommend split foliar application at tillering and panicle initiation.';
    } else if (roundedScore >= 45) {
      cls = 'S3 · Marginally Suitable';
      col = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      rec =
        activeScenario === 'rwh_arsi'
          ? 'High engineering investment required. Steep gradients or high soil permeability will increase reservoir construction overhead.'
          : activeScenario === 'moringa_weyib'
          ? 'Thermal or altitudinal stress detected. Growth rates will be constrained; localized windbreak and mulching mandatory.'
          : 'Subdued fertilizer efficiency. Address baseline soil organic matter and moisture conservation before intensive foliar spray.';
    } else {
      cls = 'N · Restricted / Not Suitable';
      col = 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      rec =
        activeScenario === 'rwh_arsi'
          ? 'Severe biophysical constraints. Soil infiltration rates or steep terrain present high structural failure risks.'
          : activeScenario === 'moringa_weyib'
          ? 'Incompatible agro-climatic zone. High frost risk or extreme soil acidity prohibitive for Moringa production.'
          : 'Unfavorable soil moisture balance. Risk of nutrient leaching or plant scorch under dry soil conditions.';
    }

    return {
      score: roundedScore,
      classification: cls,
      color: col,
      recommendation: rec,
      factorScores: scores,
    };
  }, [scenario, paramValues, activeScenario]);

  return (
    <section id="decision-simulator" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-400 mb-2 uppercase tracking-wider">
              <span>Interactive Decision-Support Sandbox</span>
              <span aria-hidden="true">·</span>
              <span>AHP Spatial Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Multi-Criteria Spatial Suitability Simulator
            </h2>
          </div>
          <p className="max-w-xl text-sm sm:text-base text-slate-300">
            Simulate the exact Analytic Hierarchy Process (AHP) and Multi-Criteria Evaluation (MCE) models designed and
            validated in Getachew Haile’s published research.
          </p>
        </div>

        {/* Model Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => handleScenarioChange('rwh_arsi')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeScenario === 'rwh_arsi'
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            1. Rainwater Harvesting (Arsi Model)
          </button>
          <button
            onClick={() => handleScenarioChange('moringa_weyib')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeScenario === 'moringa_weyib'
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            2. Moringa oleifera (Weyib Model)
          </button>
          <button
            onClick={() => handleScenarioChange('soil_tef')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeScenario === 'soil_tef'
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            3. Organic Soil & Tef (Bora Model)
          </button>
        </div>

        {/* Scenario Header Info */}
        <div className="mb-8 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">{scenario.title}</h3>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">{scenario.subtitle}</p>
            <p className="text-xs text-slate-400 mt-1">{scenario.description}</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Parameter Sliders */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Model Spatial & Biophysical Layers
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Weights: &Sigma; = 100% (AHP Matrix)
                </span>
              </div>

              {scenario.parameters.map((param) => {
                const curVal = paramValues[param.id] ?? param.defaultVal;
                const factorScore = factorScores[param.id] || 0;

                return (
                  <div key={param.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{param.name}</span>
                        <span className="ml-2 font-mono text-slate-400">({param.weight}% weight)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400 tabular-nums">
                          {curVal} {param.unit}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          (Score: {factorScore}/100)
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.max > 100 ? 10 : param.max > 10 ? 1 : 0.1}
                      value={curVal}
                      onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />

                    <p className="text-[11px] text-slate-400">{param.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Real-time Evaluation Outcome & GIS Visualization */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Scorecard */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/95 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Suitability Index (S)
                </span>
                <span className="text-xs font-mono text-slate-400">Formula: S = &Sigma; (w_i &times; x_i)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-extrabold font-mono tabular-nums text-white tracking-tight">
                  {score}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 100</span>
                <div className={`ml-auto px-3 py-1 rounded-lg border text-xs font-bold ${color}`}>
                  {classification}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-6 border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    score >= 80 ? 'bg-emerald-400' : score >= 62 ? 'bg-cyan-400' : score >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>

              {/* Agronomic / Hydrological Recommendation */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Model Recommendation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{recommendation}</p>
              </div>

              {/* Research Citation Footnote */}
              <p className="text-[11px] text-slate-400 font-mono italic">{scenario.paperRef}</p>
            </div>

            {/* Scientific GIS Map Card */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <div className="relative aspect-4/3 w-full bg-slate-950">
                <img
                  src={GIS_MODELING_IMG}
                  alt="Scientific GIS Land Suitability & Soil Fertility Mapping Interface"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackCount) {
                      target.dataset.fallbackCount = '1';
                      target.src = '/public/assets/images/gis_multicriteria_soil_modeling_1794209253751.jpg';
                    } else if (target.dataset.fallbackCount === '1') {
                      target.dataset.fallbackCount = '2';
                      target.src = '/src/assets/images/gis_multicriteria_soil_modeling_1794209253751.jpg';
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/30 pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Raster Layer Overlay Visualization</span>
                  <span className="font-mono text-emerald-400">MCE Weighted Sum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
