const RiskEngineService = require('../services/riskEngineService');
const ApiResponse = require('../utils/apiResponse');

class RiskEngineController {
  static async getCropRisk(req, res, next) {
    try {
      const { cropId } = req.params;
      const { district = 'Badulla' } = req.query;
      const risk = await RiskEngineService.evaluateCropRisk(cropId, district);
      return ApiResponse.success(res, risk);
    } catch (err) {
      next(err);
    }
  }

  static async getRegionalRiskSummary(req, res, next) {
    try {
      const { district = 'Badulla' } = req.query;
      const summary = await RiskEngineService.getRegionalRiskSummary(district);
      return ApiResponse.success(res, summary);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RiskEngineController;
