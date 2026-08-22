const db = require('../config/database');
const config = require('../config/config');

class RiskEngineService {
  /**
   * Evaluate planting risk for a specific crop and district
   */
  static async evaluateCropRisk(cropId, district = 'Badulla') {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // 1. Get Crop Details
    const cropRes = await db.query('SELECT * FROM crops WHERE id = $1', [cropId]);
    if (cropRes.rows.length === 0) throw new Error('Crop not found');
    const crop = cropRes.rows[0];

    // 2. Calculate Total Active Planted Acres & Estimated Supply
    const plantingAgg = await db.query(
      `SELECT COALESCE(SUM(land_size_acres), 0) as total_acres,
              COALESCE(SUM(expected_yield_kg), 0) as total_yield
       FROM planting_records
       WHERE crop_id = $1 AND district = $2 AND status IN ('PLANTED', 'GROWING')`,
      [cropId, district]
    );

    const totalPlantedAcres = parseFloat(plantingAgg.rows[0].total_acres) || 0;
    const estimatedSupplyKg = parseFloat(plantingAgg.rows[0].total_yield) || (totalPlantedAcres * crop.avg_yield_per_acre_kg);

    // 3. Retrieve CROPIX Demand Benchmark
    const demandRes = await db.query(
      `SELECT regional_quota_kg, national_demand_kg, current_market_gap_kg
       FROM cropix_demand_benchmarks
       WHERE crop_id = $1 AND district = $2 AND target_month = $3 AND target_year = $4`,
      [cropId, district, currentMonth, currentYear]
    );

    let targetDemandKg = 100000; // default baseline
    if (demandRes.rows.length > 0) {
      targetDemandKg = parseFloat(demandRes.rows[0].regional_quota_kg);
    } else {
      targetDemandKg = parseFloat(crop.standard_demand_kg) || (crop.avg_yield_per_acre_kg * 15);
    }

    // 4. Calculate Risk Percentage
    const riskRatio = targetDemandKg > 0 ? (estimatedSupplyKg / targetDemandKg) * 100 : 0;
    const riskPercentage = Math.round(riskRatio * 100) / 100;

    let riskLevel = 'SAFE';
    if (riskPercentage > config.riskThresholds.warning) {
      riskLevel = 'OVER_PLANTED';
    } else if (riskPercentage >= config.riskThresholds.safe) {
      riskLevel = 'WARNING';
    }

    // 5. Store / Update Risk Assessment in DB
    const insertRes = await db.query(
      `INSERT INTO risk_assessments (crop_id, district, total_planted_acres, estimated_supply_kg, target_demand_kg, risk_percentage, risk_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [cropId, district, totalPlantedAcres, estimatedSupplyKg, targetDemandKg, riskPercentage, riskLevel]
    );

    return {
      crop: {
        id: crop.id,
        code: crop.crop_code,
        nameEn: crop.name_en,
        nameSi: crop.name_si,
        nameTa: crop.name_ta
      },
      district,
      totalPlantedAcres,
      estimatedSupplyKg,
      targetDemandKg,
      riskPercentage,
      riskLevel,
      safeThreshold: config.riskThresholds.safe,
      warningThreshold: config.riskThresholds.warning,
      evaluatedAt: insertRes.rows[0].evaluated_at
    };
  }

  /**
   * Get comprehensive regional risk summary across all crops
   */
  static async getRegionalRiskSummary(district = 'Badulla') {
    const cropsRes = await db.query('SELECT * FROM crops ORDER BY id ASC');
    const summary = [];

    for (const crop of cropsRes.rows) {
      const risk = await this.evaluateCropRisk(crop.id, district);
      summary.push(risk);
    }

    return summary;
  }
}

module.exports = RiskEngineService;
