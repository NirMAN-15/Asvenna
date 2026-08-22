const db = require('../config/database');
const RiskEngineService = require('./riskEngineService');

class RecommendationService {
  /**
   * Calculate smart crop recommendations for a farmer in an at-risk area
   * Factors:
   * 1. Market Gap Score (35%)
   * 2. Soil Suitability Score (25%)
   * 3. Weather / Climate Suitability (20%)
   * 4. Historical Price Trend (20%)
   */
  static async getSmartRecommendations(district = 'Badulla', currentCropId = null) {
    const cropsRes = await db.query('SELECT * FROM crops ORDER BY id ASC');
    const allCrops = cropsRes.rows;
    const recommendations = [];

    for (const crop of allCrops) {
      if (currentCropId && crop.id === parseInt(currentCropId, 10)) {
        continue; // Skip the currently over-planted crop
      }

      // Check current risk level of this candidate crop
      const risk = await RiskEngineService.evaluateCropRisk(crop.id, district);
      
      // If candidate is already overplanted, do not recommend
      if (risk.riskLevel === 'OVER_PLANTED') continue;

      // 1. Market Gap Score (0-100) -> Higher gap means higher score
      const marketGapRatio = 100 - risk.riskPercentage;
      const marketGapScore = Math.max(0, Math.min(100, marketGapRatio));

      // 2. Soil Suitability (Bandarawela is rich in well-drained loamy/sandy loam soil)
      const soilScore = (crop.soil_type && crop.soil_type.toLowerCase().includes('loam')) ? 95 : 80;

      // 3. Weather / Climate Score (Upcountry temp 14-22C)
      const weatherScore = (crop.optimal_temp_min <= 15 && crop.optimal_temp_max >= 22) ? 90 : 75;

      // 4. Price Trend Score
      const priceScore = Math.min(100, Math.round((crop.standard_price_per_kg / 400) * 100));

      // Composite Weighted Score
      const compositeScore = Math.round(
        marketGapScore * 0.35 +
        soilScore * 0.25 +
        weatherScore * 0.20 +
        priceScore * 0.20
      );

      recommendations.push({
        crop: {
          id: crop.id,
          code: crop.crop_code,
          nameEn: crop.name_en,
          nameSi: crop.name_si,
          nameTa: crop.name_ta,
          category: crop.category,
          growthDurationDays: crop.growth_duration_days,
          standardPricePerKg: crop.standard_price_per_kg
        },
        scores: {
          marketGapScore,
          soilSuitabilityScore: soilScore,
          weatherScore,
          priceScore,
          compositeScore
        },
        riskLevel: risk.riskLevel,
        rationale: {
          en: `High market demand with ${Math.round(marketGapScore)}% unmet regional quota. Highly suitable for Bandarawela soil.`,
          si: `බණ්ඩාරවෙල කලාපයේ ඉහළ ඉල්ලුමක් සහ හිතකර පාංශු තත්ත්වයක් පවතී.`,
          ta: `பண்டாரவளை பிராந்தியத்தில் அதிக சந்தை தேவை மற்றும் உகந்த மண் வளம்.`
        }
      });
    }

    // Sort descending by composite score
    recommendations.sort((a, b) => b.scores.compositeScore - a.scores.compositeScore);

    return recommendations.slice(0, 5); // Return top 5
  }
}

module.exports = RecommendationService;
