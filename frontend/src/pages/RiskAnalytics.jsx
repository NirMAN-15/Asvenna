import React, { useState } from 'react';
import { AlertCircle, Compass, Sparkles, TrendingUp, Search, ArrowRight } from 'lucide-react';

export default function RiskAnalytics() {
  const [searchCrop, setSearchCrop] = useState('Leeks');
  const [recommendations] = useState([
    {
      crop: { nameEn: 'Beetroot', nameSi: 'බීට්රූට්', nameTa: 'பீட்ரூட்' },
      scores: { compositeScore: 92.5, marketGapScore: 95.0, soilSuitabilityScore: 90.0, weatherScore: 92.0, priceTrendScore: 88.0 },
      rationale: { en: 'High market demand gap identified in Western Province. Bandarawela soil pH optimal (5.8-6.5). Price steady at Rs 250/kg.' },
      priceTrend: '+12.4% over 3 months',
      image: '/crops/beetroot.jpg'
    },
    {
      crop: { nameEn: 'Radish', nameSi: 'රාබු', nameTa: 'முள்ளங்கி' },
      scores: { compositeScore: 87.0, marketGapScore: 88.0, soilSuitabilityScore: 92.0, weatherScore: 85.0, priceTrendScore: 83.0 },
      rationale: { en: 'Short growth cycle (45 days) avoids upcoming frost risk. Low regional saturation.' },
      priceTrend: '+8.1% over 3 months',
      image: '/crops/radish.jpg'
    },
    {
      crop: { nameEn: 'Spring Onion', nameSi: 'ළූණු කොළ', nameTa: 'வெங்காயத்தாள்' },
      scores: { compositeScore: 84.2, marketGapScore: 82.0, soilSuitabilityScore: 85.0, weatherScore: 88.0, priceTrendScore: 82.0 },
      rationale: { en: 'High demand from hospitality sector in Nuwara Eliya & Ella. Excellent return on investment.' },
      priceTrend: '+15.0% over 3 months',
      image: '/crops/spring_onion.jpg'
    }
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Dark Letters */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
              <Compass className="w-5 h-5 text-emerald-800" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Smart Crop Recommendation Engine
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-700 mt-2 max-w-2xl leading-relaxed">
            Predictive Decision Engine Balancing Regional Supply against CROPIX National Market Gaps
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/50 px-3.5 py-2.5 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchCrop}
            onChange={(e) => setSearchCrop(e.target.value)}
            placeholder="Search crop before planting..."
            className="text-xs bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none font-bold"
          />
        </div>
      </div>

      {/* Saturation Warning Banner with Dark Letters */}
      <div className="bg-red-50/90 border border-red-200 border-l-4 border-l-red-600 rounded-2xl p-5 shadow-card flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-red-200">
          <AlertCircle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="text-base font-black text-red-950 tracking-tight">
            Over-Planting Risk Threshold Directive
          </h4>
          <p className="text-sm text-slate-800 font-medium mt-1 leading-relaxed">
            When queried crop <span className="font-bold underline text-red-950 decoration-red-500">{searchCrop}</span> exceeds 85% of regional quota, the Risk Engine activates smart alternatives to prevent market saturation and secure farmer profit margins.
          </p>
        </div>
      </div>

      {/* Multi-Factor Recommendation Score Breakdown with Real Crop Images */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Recommended Smart Alternatives for Bandarawela Farmers</span>
          </h3>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Real-Time CROPIX Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="bg-white border border-outline-variant/40 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Real Crop Photo Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={rec.image}
                    alt={rec.crop.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Match Score Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black rounded-lg shadow-sm border border-emerald-400/30">
                    {rec.scores.compositeScore}% Match
                  </span>

                  {/* Crop Name on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                      Alternative {i + 1}
                    </span>
                    <h4 className="text-xl font-black text-white leading-tight drop-shadow-sm">
                      {rec.crop.nameEn}
                    </h4>
                    <p className="text-xs text-white/90 font-medium">
                      {rec.crop.nameSi} • {rec.crop.nameTa}
                    </p>
                  </div>
                </div>

                {/* Card Body with Dark Letters */}
                <div className="p-4 space-y-4">
                  {/* Rationale description */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/50 font-medium">
                    {rec.rationale.en}
                  </p>

                  {/* Multi-Factor Score Indicators */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                      <span>Market Gap Score</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rec.scores.marketGapScore}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                      <span>Soil Suitability</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rec.scores.soilSuitabilityScore}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                      <span>Weather Alignment</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rec.scores.weatherScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {rec.priceTrend}
                </span>
                <button
                  type="button"
                  className="text-white bg-primary hover:bg-primary-container px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-xs transition active:scale-95"
                >
                  <span>Plant Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
