import React, { useState } from 'react';
import { AlertCircle, Compass, Sparkles, TrendingUp, CloudRain, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RiskAnalytics() {
  const [searchCrop, setSearchCrop] = useState('Leeks');
  const [recommendations] = useState([
    {
      crop: { nameEn: 'Beetroot', nameSi: 'බීට්රූට්', nameTa: 'பீட்ரூட்' },
      scores: { compositeScore: 92.5, marketGapScore: 95.0, soilSuitabilityScore: 90.0, weatherScore: 92.0, priceTrendScore: 88.0 },
      rationale: { en: 'High market demand gap identified in Western Province. Bandarawela soil pH optimal (5.8-6.5). Price steady at Rs 250/kg.' },
      priceTrend: '+12.4% over 3 months'
    },
    {
      crop: { nameEn: 'Radish', nameSi: 'රාබු', nameTa: 'முள்ளங்கி' },
      scores: { compositeScore: 87.0, marketGapScore: 88.0, soilSuitabilityScore: 92.0, weatherScore: 85.0, priceTrendScore: 83.0 },
      rationale: { en: 'Short growth cycle (45 days) avoids upcoming frost risk. Low regional saturation.' },
      priceTrend: '+8.1% over 3 months'
    },
    {
      crop: { nameEn: 'Spring Onion', nameSi: 'ළූණු කොළ', nameTa: 'வெங்காயத்தாள்' },
      scores: { compositeScore: 84.2, marketGapScore: 82.0, soilSuitabilityScore: 85.0, weatherScore: 88.0, priceTrendScore: 82.0 },
      rationale: { en: 'High demand from hospitality sector in Nuwara Eliya & Ella. Excellent return on investment.' },
      priceTrend: '+15.0% over 3 months'
    }
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">📊 Smart Crop Recommendation Engine</h1>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Predictive Decision Engine Balancing Regional Supply against CROPIX National Market Gaps
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
          <Search className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={searchCrop}
            onChange={(e) => setSearchCrop(e.target.value)}
            placeholder="Search crop before planting..."
            className="text-xs bg-transparent text-white placeholder-emerald-500 focus:outline-none font-semibold"
          />
        </div>
      </div>

      {/* Saturation Warning Banner */}
      <div className="stich-card p-5 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/40 via-red-900/10 to-transparent flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white">Over-Planting Risk Threshold Directive</h4>
          <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
            When queried crop <span className="font-bold underline text-white">{searchCrop}</span> exceeds 85% of regional quota, the Risk Engine activates smart alternatives to prevent market saturation and secure farmer profit margins.
          </p>
        </div>
      </div>

      {/* Multi-Factor Recommendation Score Breakdown */}
      <div className="stich-card p-6">
        <h3 className="text-base font-extrabold text-white mb-5 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Recommended Smart Alternatives for Bandarawela Farmers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => (
            <div key={i} className="stich-card p-5 bg-gradient-to-b from-emerald-950/60 to-slate-950/80 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-extrabold text-white">{rec.crop.nameEn}</h4>
                    <p className="text-xs text-emerald-400/80 font-medium">{rec.crop.nameSi} • {rec.crop.nameTa}</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-900/50">
                    {rec.scores.compositeScore}%
                  </span>
                </div>

                <p className="text-xs text-emerald-100/80 leading-relaxed bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/10 mb-4">
                  {rec.rationale.en}
                </p>

                {/* Score Indicators */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-emerald-300">
                    <span>Market Gap Score</span>
                    <span className="font-bold text-white">{rec.scores.marketGapScore}%</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>Soil Suitability</span>
                    <span className="font-bold text-white">{rec.scores.soilSuitabilityScore}%</span>
                  </div>
                  <div className="flex justify-between text-emerald-300">
                    <span>Weather Alignment</span>
                    <span className="font-bold text-white">{rec.scores.weatherScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {rec.priceTrend}
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  Plant Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
