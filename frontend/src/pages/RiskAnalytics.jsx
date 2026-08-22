import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { AlertCircle, Compass } from 'lucide-react';

export default function RiskAnalytics() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const recRes = await API.get('/recommendations?district=Badulla');
        setRecommendations(recRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Predictive Risk & Recommendations</h1>
        <p className="text-sm text-gray-500">Mathematical Risk Engine & Composite Crop Recommendation Matrix</p>
      </div>

      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-900">Over-Planting Risk Threshold Alert</h4>
          <p className="text-xs text-rose-700 mt-1 leading-relaxed">
            Crops exceeding 85% of regional quota automatically trigger broadcast warnings and activate smart crop alternatives to prevent harvest price collapse.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          Recommended Alternative Crops (High Market Gap & Agro-Suitability)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{rec.crop.nameEn}</h4>
                  <p className="text-xs text-gray-500">{rec.crop.nameSi} • {rec.crop.nameTa}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-lg">
                  Score: {rec.scores.compositeScore}%
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">{rec.rationale.si}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs font-medium text-gray-500">
                <span>Gap Score: {rec.scores.marketGapScore}%</span>
                <span>Soil: {rec.scores.soilSuitabilityScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
